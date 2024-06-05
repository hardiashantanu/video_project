import { asyncHandler } from '../utils//asyncHandler.js'
import { ApiError } from '../utils/AipError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import router from '../routes/user.routes.js'


const generateAccessAndRefreshToken = async (userId) => {

    const user = await User.findById(userId)

    const accessToken = user.generateAccessToken()
    const refreshToken = user.gegenerateRefreshToken()

    user.refreshToken = refreshToken
    user.save({validateBeforeSave: false})

    return {accessToken,refreshToken}
}


const registerUser = asyncHandler( async (req,res) =>
{
    const {fullName , email , username, password} = req.body
    // console.log('body: ',req.body);

    // This is to check all the entries are provided

    if(
        [fullName,email,username,password].some((field)=>
        field?.trim() === '')
    ){
        throw new ApiError(400,'all fileds are required')
    }

    // To find whether the user is already existed with same credentials

    const existedUser = await User.findOne({
        $or: [{username},{email}]
    })

    if(existedUser)
        {
            throw new ApiError(409,'user with email or username already exists')
        }
    
    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path

        // the below if block is to register the user (or to continue the process) when thee coverimage is not uploaded by the user in the registration process


    let coverImageLocalPath;

    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    // console.log(req.files.coverImage);

    // console.log('avatar file path: ',avatarLocalPath);

    if(!avatarLocalPath){
        throw new ApiError(400,'avatar is required')
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    

    if (!avatar) {
        throw new ApiError(400,'avatar is required')
    }

    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || '',
        email,
        password,
        username:username.toLowerCase()
    })

    console.log(user);

    const createdUser = await User.findById(user._id).select('-password -refreshToken')


    if (!createdUser) {
        throw new ApiError(500,'something went worng while registering the user')
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,'user registered successfully')
    )
})


const loginUser = asyncHandler(async (req,res) =>{

    // getting the data from request

    const {email,password,username} = req.body

    if(!email || !username)
        {
            throw new ApiError(404,'username or email is required')
        }
    
    const user = await User.findOne(
        {
            $or:[{username},{email}]
        }
    )

    if (!user) {
        throw new ApiError(404,'user dose not exists')
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401,'password is incorrect')
    }


    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.
    status(200)
    .cookie('accessToken',accessToken,options)
    .cookie('refreshToken',refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,accessToken,refreshToken
            },
            'user loggedIn successfully'
        )
    )
})


const logOutUser = asyncHandler(async(req,res)=>
{
    User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
    .cookie('accessToken',options)
    .cookie('refreshToken',options)
    .json(new ApiResponse(200,{},'user logged out'))
})


export { registerUser,
         loginUser,
         logOutUser
 }
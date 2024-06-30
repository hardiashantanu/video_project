import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/AipError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video

    /*
        get all the fields 
        check for the title and description if they are present or not 
        get video and thumbnail local path
        check for the video if it is uploaded or not
        upload on cloudinary -> take the response as the url string (!!! USE AWAIT !!!)
        create the video
        check for the success of video creation
        response the video        
    */
    const { title, description, duration} = req.body

    if ([title,description,duration].some((field) => field?.trim() === ""))
    {
       throw new ApiError(400, "all fileds are required");
    }
    
    const videoLocalPath = req.files.videoFile[0].path
    const thumbnailLocalPath = req.files.thumbnail[0].path

    if (!videoLocalPath) {
        throw new ApiError(400,"video file is required")
    }

    const video = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    const user = req.user

    console.log(video,thumbnail);

    const newVideo = await Video.create({
        title,
        description,
        duration,
        videoFile: video.url,
        thumbnail: thumbnail.url,
        owner: user
    })

    if (!newVideo) {
        throw new ApiError(500,"something went wrong")
    }

    res
    .status(200)
    .json(new ApiResponse(200,newVideo,"video created successfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}

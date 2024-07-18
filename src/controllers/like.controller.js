import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/AipError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on video

  // get the video id
  // "findOne" document  on the basis of video and likedBy user
  // check if video is liked
  // if not, "create" like and maintain the  status to true
  // if yes, "deleteOne" the like and maintaint the status to false
  // response result

  const { videoId } = req.params;

  const isLiked = await Like.findOne({
    video: videoId,
    likedBy: req.user?._id,
  });

  let videolikeStatus;
  try {
    if (!isLiked) {
      await Like.create({
        video: videoId,
        likedBy: req.user?._id,
      });

      videolikeStatus = { isLiked: true };
    } else {
      await Like.deleteOne(isLiked._id);
      videolikeStatus = { isLiked: false };
    }
  } catch (error) {
    throw new ApiError(400, "Error while toggle video like", error);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, videolikeStatus, "Video Like Toggle sucessfully")
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment

  // const comment = await Comment.findById(commentId)

  // console.log(comment);

  const isLiked = await Like.findOne({
    comment: commentId,
    likedBy: req.user?._id,
  });

  // console.log(isLiked);
 
  let likeStatus;

  try {
    if (!isLiked) {
      await Like.create({
        comment : commentId,
        likedBy: req.user?._id,
      });
      
      likeStatus = { isLiked: true };
    } else {
      await Like.deleteOne(isLiked._id);
      likeStatus = { isLiked: false };
    }
  } catch (error) {
    throw new ApiError(500, "something went wrong");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, likeStatus, "comment like toggle successfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet

  // find isLiked object using findOne having tweetId and userId 
  // initialize likeStatus variable
  // check if tweet is liked or not
  // if not then like.create({tweet : tewwtId , likedBy : req.user?._id})
  // and set likeStatus to true
  // if yes then deleteOne the like object and set likeStatus to flase
  
  const isLiked = await Like.findOne({
    tweet : tweetId,
    likedBy : req.user?._id
  })

  let likeStatus

  if (!isLiked) {
    await Like.create({
      tweet : tweetId,
      likedBy : req.user?._id
    })

    likeStatus = {isLiked : true}
  }else{
    await Like.deleteOne(isLiked._id)
    likeStatus = { isLiked : false}
  }
 
  res
  .status(200)
  .json(new ApiResponse(200,likeStatus,"tweeter like toggle successfully"))

});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos

   const userId = req.user?._id

   if (!userId) {
    throw new ApiError(400,"user not found")
   }
   console.log(userId);

   const likes = await Like.find({
    likedBy : userId
   })

   console.log(likes);
 
   if (!likes) {
    throw new ApiError(400,"likes not found")
   }

   res
   .status(200)
   .json(new ApiResponse(200,likes,"likes fetched"))

});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };

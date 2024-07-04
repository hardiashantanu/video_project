import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/AipError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video

  // id get from the req.user
  // validate video if it exists or not
  // use mongodb aggerigation with $match to write a piepline
  // res the result
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const video = await Video.findById(videoId)

  if (!video) {
    throw new ApiError(400,"video not exists")
  }

  const allComments = await Comment.aggregate([
    {
      $match: { video: new mongoose.Types.ObjectId(videoId) }, //"new" is used for syntax aid
    },
  ])

  console.log(allComments);

  if (!allComments) {
    throw new ApiError(500,"sometihng went wrong")
  }

  res
  .status(200)
  .json(200,allComments,"all comments fetched successfully")


});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video

  // get the content from the body
  // get the video id from url
  // validate the video
  // create the new comment
  // validate thet comment
  // response the comment

  const { content } = req.body;
  const videoId = req.params.videoId;

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "video not exists");
  }

  const user = req.user;

  const comment = await Comment.create({
    content: content,
    owner: user,
    video: video,
  });

  if (!comment) {
    throw new ApiError(500, "something went wrong");
  }

  res
    .status(200)
    .json(new ApiResponse(200, comment, "comment created successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment

  // get the comment id from url
  // get the content from the body
  // validate the comment
  // if exists, use findByIdAndUpdate
  // validate the result
  // response the result

  const commentId = req.params.commentId;
  const { content } = req.body;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(400, "comment not exists");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    { _id: commentId },
    {
      content: content,
    },
    { new: true }
  );

  if (!updateComment) {
    throw new ApiError(500, "something went wrong");
  }

  res
    .status(200)
    .json(new ApiResponse(200, updateComment, "comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment

  // get the comment id from url
  // validate the comment
  // if exists, use findByIdAndDelete
  // validate and response

  const commentId = req.params.commentId;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(400, "comment not exists");
  }

  const deleteComment = await Comment.findByIdAndDelete(commentId);

  if (!deleteComment) {
    throw new ApiError(500, "something went wrong");
  }

  res.status(200).json(new ApiResponse(200, deleteComment, "comment deleted"));
});

export { getVideoComments, addComment, updateComment, deleteComment };

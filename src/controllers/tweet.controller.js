import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/AipError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  // get the content from the body
  // check the content
  // get the user object
  // create the document and check for the confiramtion
  // response the document

  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "content to tweet is required");
  }

  const user = req.user;

  const tweet = await Tweet.create({
    content: content,
    owner: user,
  });

  if (!tweet) {
    throw new ApiError(500, "something went wrong while creating tweet");
  }

  const response = await Tweet.findById(tweet._id).select(
    "-password -refreshToken"
  );

  if (!response) {
    throw new ApiError(500, "somtheing went wrong");
  }

  res
    .status(200)
    .json(new ApiResponse(200, response, "tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets

  // id get from the req.user
  // validate user if it exists or not
  // use mongodb aggerigation with $match to write a piepline
  // res the result
  const userId = req.params.userId;

//   console.log(userId);

  const existedUser = await User.findById(userId);

  if (!existedUser) {
    throw new ApiError(400, "user dosenot exists");
  }

  const allTweets = await Tweet.aggregate([
    {
      $match: { owner: new mongoose.Types.ObjectId(userId) }, //"new" is used for syntax aid
    },
  ]);

  //   console.log(allTweets);

  if (!allTweets) {
    throw new ApiError(500, "somehting went wrong");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, allTweets, "tweets of user fetched successfully")
    );
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet

  // validate the tweet exists or not
  // use findbyisandupdate to update the tweet
  // validate the object and response it

  const tweetId = req.params.tweetId;
  const { content } = req.body;

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(400, "tweet dosenot exists");
  }

  const newTweet = await Tweet.findByIdAndUpdate(
    { _id: tweetId },
    {
      content: content,
    },
    { new: true }
  );

  if (!newTweet) {
    throw new ApiError(500, "something went wrong");
  }

  res
    .status(200)
    .json(new ApiResponse(200, newTweet, "tewwt updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet

  // validate ther tweet
  // use findByIdAndDelete
  // validate the result
  // response the restult

  const tweetId = req.params.tweetId

  const tweet = await Tweet.findById(tweetId)

  if (!tweet) {
    throw new ApiError(400,"tweet dosenot exists")
  }

  const result = await Tweet.findByIdAndDelete(tweetId)

  if (!result) {
    throw new ApiError(500,"somthing went wrong")
  }

  res
  .status(200)
  .json(new ApiResponse(200,result,"tweet deleted successfully"))
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };

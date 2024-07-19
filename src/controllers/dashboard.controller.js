import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.modle.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/AipError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { application } from "express"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    // get the user id and validate
    // total views and likes from video model
    // subscribers from subscription model
    // 

    const userID = req.user?._id

    if (!userID) {
        throw new ApiError(400,"user not found")
    }

    
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    // get user id and validate
    // find video object from video where owner is userId
    // validate videos
    // respone video

    const userId = req.user?._id

    if (!userId) {
        throw new ApiError(400,"uer not found")
    }

    console.log(userId);

    const videos = await Video.find({
        owner : userId
    })

    console.log(videos);

    if (!videos) {
        throw new ApiError(400,"videos not found")
    }

    res
    .status(200)
    .json(new ApiResponse(200,videos))
})

export {
    getChannelStats, 
    getChannelVideos
    }
import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.modle.js";
import { ApiError } from "../utils/AipError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    
    // TODO: toggle subscription
    
    // first get the channelId from the params and validate it
    // now findOne(on the basis of chennelId and req.user._id as subscribers) the subscription object to check whether channel is subscribed
    // if object is found then deleteOne that object and response
    // if not then create the object with channel:channelId and subscribers:req.user._id  
    // response the document


  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }
 console.log(channelId);
  const subscriptionCheck = await Subscription.findOne({
    channel: channelId,
    subscribers: req.user?._id,
  });

  if (subscriptionCheck) {
    await subscriptionCheck.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Subscription Removed Successfully"));
  }

  const createSubscription = await Subscription.create({
    channel: channelId,
    subscribers: req.user?._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        createSubscription,
        "Congratulation! You have Successfully Subscribed this channel"
      )
    );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!subscriberId) {
    throw new ApiError(400,"wrong user id")
  }  
  const subscriberList = await Subscription.find({
    channel: subscriberId
  })

  console.log(subscriberList);

  res
  .status(200)
  .json(new ApiResponse(200,subscriberList,"subscriber fetched"))

});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId) {
    throw new ApiError(400,"subscriber not  found")
  }

  const channelList = await Subscription.find({
    subscribers:channelId
  })

  console.log(channelList);

  res
  .status(200)
  .json(new ApiResponse(200,channelList,"channel list fetched"))

  
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };

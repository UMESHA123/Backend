import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const totalVideoViews = await Video.aggregate([
        {
            $group: {
                _id: null,
                views: {
                    $sum: "$views"
                }
            }
        }
    ])
    const userVideos = await Video.find(
        {
            owner: req.user._id
        }
    )
    const totalSubscribers = await Subscription.countDocuments({channel: req.user.channelId});
    const totalLikes = await Like.countDocuments({video: {$in: userVideos}});

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200, 
            {
                totalSubscribers,
                totalVideoViews: totalVideoViews[0].views,
                totalLikes,
                userVideos
            }
        )
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const channelVideos = await Video.find(
        {
            owner: req.user._id
        }
    )
    if(!channelVideos){
        throw new ApiError(400, "Something went wrong while featching channel videos")
    }
    return res 
    .status(200)
    .json(
        new ApiResponse(
            200, 
            channelVideos,
            "Channel video featuched successfully"
        )
    )
})

export {
    getChannelStats, 
    getChannelVideos
    }
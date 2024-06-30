import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  // get user details from frontend
  // get user._id from auth middleware (req.user)
  // validation - not empty
  // check if playlist already exists: name
  // create playlist object - create entry in db
  // check for playlist creation
  // return res

  const { name, description, videos } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "All fields are required");
  }

  const existedname = await Playlist.findOne({ name: name });

  if (existedname) {
    throw new ApiError(400, "playlist with the name already existed");
  }

  // console.log(name, description ,videos);

  const playlist = await Playlist.create({
    name: name,
    description: description,
    videos: videos,
    owner: req.user,
  });

  console.log(playlist);

  if (!playlist) {
    throw new ApiError(500, "something went wrong while creating playlist");
  }

  res.status(200).json(new ApiResponse(200, playlist, "playlist created"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  // to get the playlists of the user

  // id get from the req
  // use mongodb aggerigation with $match to write a piepline
  // validate the playlist constant
  // res the result
  const { userId } = req.params;

  const playlist = await Playlist.aggregate([
    {
      $match: { owner: (userId) },// the functionality here is not working 
    },
  ]);

  console.log(playlist.length);

  if (!playlist.length) {
    throw new ApiError(400, "invalid user id");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "playlists of user fetched successfully")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  //TODO: get playlist by id

  /*
        playlist id from params 
        findone from Playlist schema
        check if the playlist exists 
        returning the palylist
    */

  const { playlistId } = req.params;

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(400, "playlist dosenot exists !");
  }

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  // use findbyidandupdate
  // fetch the new videos from the req
  // use the ($push) ooperator to append/add the new values into the array
  // validate the playlist constant
  // return the res

  const { playlistId, videoId } = req.params;

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $push: { videos: videoId } },
    { new: true }
  );

  if (!playlist) {
    throw new ApiError(400, "could not found the playlist");
  }

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "videos added successfylly"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  // TODO: remove video from playlist
  const { playlistId, videoId } = req.params;

  const playlist = await Playlist.updateOne({_id:playlistId},
    {
        $pull : {videos : { $in: videoId}}
    }
  )

  if (!playlist.length) {
    throw new ApiError(400,"video not found in the playlist")
  }

  res
  .status(200)
  .json(new ApiResponse(200,playlist,"video removed"))
});

const deletePlaylist = asyncHandler(async (req, res) => {
  // TODO: delete playlist
  // fetch the playlist id
  // use deleteone

  
  const { playlistId } = req.params;

  const playlist = await Playlist.findById({_id:playlistId})

  if (!playlist) {
    throw new ApiError(400,'playlist not found')
  }

  const  result = await Playlist.deleteOne({_id:playlistId})

  console.log(result)

  if (!result) {
    throw new ApiError(400,"something went wrong ")
  }

  res
  .status(200)
  .json(new ApiResponse(200,result,"playlist deleted successfully"))
});

const updatePlaylist = asyncHandler(async (req, res) => {
  //TODO: update playlist
  const { playlistId } = req.params;
  const { name, description } = req.body;

  const check = await Playlist.findById({_id:playlistId})

  if (!check) {
    throw new ApiError(400,"playlist not found")
  }

  const playlist = await Playlist.findByIdAndUpdate({_id:playlistId},{
    name : name,
    description : description
  },
  {new : true}
)

if (!playlist) {
  throw new ApiError(500,"something went wrong")
}

res
.status(200)
.json(new ApiResponse(200,playlist,"playlist updated"))
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};

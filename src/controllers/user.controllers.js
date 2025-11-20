import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res, next) => {
  // Registration logic here
  //get user details from req.body
  // --- validate user details (non empty, valid email etc) ----
  //-----check if user already exists in database:username,email-----
  //---------check for images --> check for avatar--------------
  //---------- upload them to cloudinary---------
  //create user in database
  //remove pass and refresh token field from response
  //check for user creation
  // return response

  const { fullName, email, username, password } = req.body;
  console.log(fullName, email, password);

  //   if (fullName === "") {
  //     throw new ApiError(400,"Full name is required");
  //   }
  // =to validate that all filds are present,but thsi is too much code to write to check all fileds ,so there is bettter alternalive below

  if (
    [fullName, email, username, password].some((field) => field?.trim() == "")
  ) {
    throw new ApiError(400, "All fields are required.");
  }
  const existedUser = await User.findOne({ $or: [{ email }, { username }] });
  console.log("existedUser==================", existedUser);
  if (existedUser) {
    throw new ApiError(
      409,
      "User with given email or username already exists."
    );
  }
  console.log("Multer req.files ====================", req.files);
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required.");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverIamge = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar image is required.");
  }
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  console.log("createdUser===================", createdUser);
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering User");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully."));
});

export { registerUser };
//TODO:read Api Error file and also read about the some in js --->also read all console.log

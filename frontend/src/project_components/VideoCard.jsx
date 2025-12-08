import React from "react";

const VideoCard = ({ title, channel, views, uploaded, duration }) => {
  return (
    <div className="w-full hover:opacity-75 hover:bg-gray-200 rounded-3xl transition-all duration-300 p-2 ">
      <div className="bg-gray-200 w-full aspect-video rounded-xl overflow-hidden ">
        <img
          src="https://picsum.photos/600/400.jpg"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex gap-3 mt-3">
        <img
          src="https://picsum.photos/id/10/10/300?grayscale&blur=2"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold line-clamp-2">{title}</h3>
          <p className="text-xs text-gray-400">{channel}</p>
          <p className="text-xs text-gray-500">
            {views}.{uploaded}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;

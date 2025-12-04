import React from "react";

const Notifications = () => {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Notifications</h1>

      {/* Example */}
      <div className="p-3 bg-gray-100 rounded-lg mb-3">
        Someone liked your tweet
      </div>
      <div className="p-3 bg-gray-100 rounded-lg mb-3">New follower</div>
    </div>
  );
};

export default Notifications;

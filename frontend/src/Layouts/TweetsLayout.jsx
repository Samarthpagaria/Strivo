import React from "react";
import { Outlet } from "react-router-dom";

const TweetsLayout = ({ width = "w-80" }) => {
  return (
    <div
      className={`${width} bg-gray-50 border-l border-gray-200 overflow-y-auto`}
    >
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Tweets</h2>
        <Outlet />
      </div>
    </div>
  );
};

export default TweetsLayout;

import React, { useState } from "react";
import SecurityTab from "./Settings/SecurityTab";
import ProfileTab from "./Settings/ProfileTab";

const SettingsPage = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState("security");

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-6">
        <div className="flex gap-4 border-b border-border">
          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "security"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "profile"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Profile
          </button>
          <button className="px-4 py-2 font-medium border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors">
            Notifications
          </button>
          <button className="px-4 py-2 font-medium border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors">
            Appearance
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "security" && <SecurityTab />}
      {activeTab === "profile" && <ProfileTab />}
    </div>
  );
};

export default SettingsPage;

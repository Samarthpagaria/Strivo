import React, { useState } from "react";
import SecurityTab from "./Settings/SecurityTab";
import ProfileTab from "./Settings/ProfileTab";

const SettingsPage = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState("security");

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-4xl mx-auto py-12 px-6">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black font-satoshi text-foreground tracking-tight mb-2">Settings</h1>
          <p className="text-sm font-medium font-inter text-muted-foreground/80">
            Manage your account settings and preference architecture.
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-8 border-b border-border dark:border-white/5 min-w-max">
            <button
              onClick={() => setActiveTab("security")}
              className={`px-1 py-4 text-xs font-black uppercase tracking-widest font-satoshi border-b-2 transition-all duration-300 ${
                activeTab === "security"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground/60 hover:text-foreground"
              }`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-1 py-4 text-xs font-black uppercase tracking-widest font-satoshi border-b-2 transition-all duration-300 ${
                activeTab === "profile"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground/60 hover:text-foreground"
              }`}
            >
              Profile
            </button>
            <button className="px-1 py-4 text-xs font-black uppercase tracking-widest font-satoshi border-b-2 border-transparent text-muted-foreground/40 hover:text-foreground transition-all duration-300 cursor-not-allowed">
              Notifications
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 duration-500">
          {activeTab === "security" && <SecurityTab />}
          {activeTab === "profile" && <ProfileTab />}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

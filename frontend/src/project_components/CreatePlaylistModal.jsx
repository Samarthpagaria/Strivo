import React, { useState } from "react";
import { X } from "lucide-react";

const CreatePlaylistModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({ name, description });
      // Reset form
      setName("");
      setDescription("");
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-background/95 dark:bg-black/95 backdrop-blur-xl border border-border dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-md mx-4 p-8 z-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black font-satoshi text-foreground uppercase tracking-tight">
              Initiate Collection
            </h2>
            <p className="text-[10px] font-black font-satoshi uppercase tracking-widest text-muted-foreground/40 mt-1">
              New Playlist Protocol
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2.5 bg-muted/50 dark:bg-white/5 hover:bg-muted dark:hover:bg-white/10 rounded-full transition-all duration-300 group"
          >
            <X className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label
              htmlFor="playlist-name"
              className="text-[10px] font-black font-satoshi uppercase tracking-widest text-muted-foreground ml-1"
            >
              Label <span className="text-primary">*</span>
            </label>
            <input
              id="playlist-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter collection name"
              required
              className="w-full px-5 py-4 rounded-2xl border border-border dark:border-white/10 bg-muted/20 dark:bg-white/5 text-foreground placeholder:text-muted-foreground/30 font-inter font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all"
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label
              htmlFor="playlist-description"
              className="text-[10px] font-black font-satoshi uppercase tracking-widest text-muted-foreground ml-1"
            >
              Intelligence <span className="text-muted-foreground/30">(Optional)</span>
            </label>
            <textarea
              id="playlist-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Define collection purpose..."
              rows={3}
              className="w-full px-5 py-4 rounded-2xl border border-border dark:border-white/10 bg-muted/20 dark:bg-white/5 text-foreground placeholder:text-muted-foreground/30 font-inter font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-4 rounded-full border border-border dark:border-white/10 text-muted-foreground font-black font-satoshi uppercase text-[10px] tracking-widest hover:bg-muted dark:hover:bg-white/5 transition-all"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isLoading}
              className="flex-2 px-8 py-4 rounded-full bg-foreground text-background font-black font-satoshi uppercase text-[10px] tracking-widest hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl shadow-foreground/10"
            >
              {isLoading ? "Synchronizing..." : "Archive Collection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;

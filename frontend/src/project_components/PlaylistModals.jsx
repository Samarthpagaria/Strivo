import React, { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";

export const DeletePlaylistModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  playlistTitle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-[280px] overflow-hidden rounded-[2rem] bg-white dark:bg-gray-950 border border-gray-200 dark:border-white/5 shadow-2xl transition-all scale-100">
        <div className="p-6 text-center">
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            Delete Playlist?
          </h3>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 leading-relaxed px-2">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              "{playlistTitle}"
            </span>
            ?
          </p>

          <div className="flex flex-col gap-2">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full rounded-full bg-gray-900 dark:bg-white py-2.5 text-xs font-bold text-white dark:text-gray-950 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={onClose}
              className="w-full rounded-full bg-gray-100 dark:bg-white/5 py-2.5 text-xs font-bold text-gray-600 dark:text-gray-400 transition-all hover:bg-gray-200 dark:hover:bg-white/10 active:scale-95"
            >
              Keep it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EditPlaylistModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialData && isOpen) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({ name, description });
    }
  };

  const handleClose = () => {
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

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Playlist
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label
              htmlFor="edit-playlist-name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Playlist Name <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-playlist-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter playlist name"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Description Field */}
          <div>
            <label
              htmlFor="edit-playlist-description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Description <span className="text-gray-400">(Optional)</span>
            </label>
            <textarea
              id="edit-playlist-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for your playlist"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isLoading}
              className="flex-1 px-4 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

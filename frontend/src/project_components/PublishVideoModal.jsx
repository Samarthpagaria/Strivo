import React, { useState } from "react";
import { CheckCircle2, Upload, X, ImagePlus } from "lucide-react";
import { BackgroundBeams } from "@/components/ui/background-beams";

const PublishVideoModal = ({ isOpen, onClose, onSubmit, mutation }) => {
  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    videoFile: null,
    thumbnail: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVideoForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setVideoForm((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoForm.videoFile || !videoForm.thumbnail) return;

    const formData = new FormData();
    formData.append("title", videoForm.title);
    formData.append("description", videoForm.description);
    formData.append("videoFile", videoForm.videoFile);
    formData.append("thumbnail", videoForm.thumbnail);

    await onSubmit(formData);

    // Reset form after successful upload
    setTimeout(() => {
      setVideoForm({
        title: "",
        description: "",
        videoFile: null,
        thumbnail: null,
      });
      mutation.reset();
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-150 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative animate-in fade-in zoom-in duration-200 overflow-hidden">
        {/* Background Beams Effect */}
        <BackgroundBeams
          className="absolute inset-0 z-0"
          beamColors={["#1e3a8a", "#581c87"]}
        />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors z-20"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-900 relative z-10">
          Upload Video
        </h2>

        {mutation.isPending ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4 relative z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600"></div>
            <p className="text-lg font-medium text-blue-600">
              Uploading Video...
            </p>
            <p className="text-sm text-gray-500">
              Please wait, do not close this window.
            </p>
          </div>
        ) : mutation.isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4 relative z-10">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <p className="text-xl font-bold text-gray-900">
              Uploaded Successfully!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {mutation.isError && (
              <div className="p-4 bg-red-50/90 backdrop-blur-sm text-red-700 rounded-xl text-sm border border-red-100 flex items-center gap-2 relative z-10">
                <X className="w-4 h-4" />
                Error uploading video. Please try again.
              </div>
            )}

            {/* Thumbnail Input */}
            <div className="relative z-10">
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                Thumbnail
              </label>
              <div className="border-2 border-dashed border-gray-400/40 bg-white/10 backdrop-blur-xl rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-white/20 transition-all relative group shadow-sm">
                <input
                  type="file"
                  name="thumbnail"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  required
                />
                {videoForm.thumbnail ? (
                  <div className="flex flex-col items-center text-green-600">
                    <CheckCircle2 className="w-8 h-8 mb-2" />
                    <p className="text-sm font-medium truncate w-full px-4">
                      {videoForm.thumbnail.name}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-gray-700 group-hover:text-blue-600 transition-colors">
                    <ImagePlus className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">
                      Click to upload thumbnail
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Video Input */}
            <div className="relative z-10">
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                Video File
              </label>
              <div className="border-2 border-dashed border-gray-400/40 bg-white/10 backdrop-blur-xl rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-white/20 transition-all relative group shadow-sm">
                <input
                  type="file"
                  name="videoFile"
                  onChange={handleFileChange}
                  accept="video/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  required
                />
                {videoForm.videoFile ? (
                  <div className="flex flex-col items-center text-green-600">
                    <CheckCircle2 className="w-8 h-8 mb-2" />
                    <p className="text-sm font-medium truncate w-full px-4">
                      {videoForm.videoFile.name}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-gray-700 group-hover:text-blue-600 transition-colors">
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">
                      Click to upload video
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="relative z-10">
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={videoForm.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-400/40 bg-white/10 backdrop-blur-xl rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm text-gray-900 placeholder:text-gray-600"
                placeholder="Video title"
                required
              />
            </div>

            <div className="relative z-10">
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                value={videoForm.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2.5 border border-gray-400/40 bg-white/10 backdrop-blur-xl rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all shadow-sm text-gray-900 placeholder:text-gray-600"
                placeholder="What's this video about?"
              ></textarea>
            </div>

            <div className="pt-2 relative z-10">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 relative z-10"
              >
                Upload Video
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PublishVideoModal;

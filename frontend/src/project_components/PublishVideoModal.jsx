import React, { useState, useEffect } from "react";
import { CheckCircle2, Upload, X, ImagePlus, Video, Info } from "lucide-react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { motion, AnimatePresence } from "framer-motion";

const MemoizedBeams = React.memo(() => (
  <BackgroundBeams
    className="absolute inset-0 z-0"
    beamColors={["#1e3a8a", "#581c87"]}
  />
));

const PublishVideoModal = ({ isOpen, onClose, onSubmit, mutation }) => {
  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    videoFile: null,
    thumbnail: null,
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  useEffect(() => {
    if (!videoForm.thumbnail) {
      setThumbnailPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(videoForm.thumbnail);
    setThumbnailPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [videoForm.thumbnail]);

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
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 backdrop-blur-lg">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white border border-neutral-200 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] w-full max-w-2xl p-8 md:p-12 relative overflow-hidden"
      >
        {/* Background Beams Effect - Memoized to prevent re-renders on typing */}
        <MemoizedBeams />

        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-neutral-400 hover:text-neutral-900 transition-colors z-20 p-2 hover:bg-neutral-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10 mb-10">
          <h2 className="text-3xl font-black text-neutral-900 font-satoshi tracking-tight mb-2">
            Publish new content
          </h2>
          <p className="text-neutral-500 text-sm font-medium font-inter">
            Broadcast your vision to the Strivo community.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {mutation.isPending ? (
            <motion.div
              key="pending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 space-y-6 relative z-10"
            >
              <div className="relative">
                <div className="w-20 h-20 border-4 border-neutral-100 rounded-full" />
                <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-xl font-bold text-neutral-900 font-satoshi">
                  Uploading your asset
                </p>
              </div>
            </motion.div>
          ) : mutation.isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 space-y-6 relative z-10"
            >
              <div className="rounded-full bg-emerald-50 p-6 border border-emerald-100 shadow-sm">
                <CheckCircle2 className="w-16 h-16 text-emerald-600" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-2xl font-black text-neutral-900 font-satoshi">
                  Upload complete
                </p>
                <p className="text-sm text-neutral-500 font-medium">
                  Your content is now being processed.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="space-y-8 relative z-10"
            >
              {mutation.isError && (
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-sm font-medium flex items-center gap-3">
                  <div className="w-6 h-6 bg-rose-200 rounded-full flex items-center justify-center shrink-0">
                    <X className="w-3.5 h-3.5" />
                  </div>
                  System error: Could not process upload. Please verify files
                  and try again.
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side: File Uploads */}
                <div className="space-y-6">
                  {/* Video Upload */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-neutral-400 font-satoshi tracking-tight">
                      Video asset
                    </label>
                    <div
                      className={`relative h-40 border-2 border-dashed rounded-3xl transition-all duration-300 group flex flex-col items-center justify-center overflow-hidden ${videoForm.videoFile ? "border-emerald-500 bg-emerald-50/10" : "border-neutral-200 bg-neutral-50/50 hover:border-indigo-400 hover:bg-neutral-50"}`}
                    >
                      <input
                        type="file"
                        name="videoFile"
                        onChange={handleFileChange}
                        accept="video/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        required
                      />
                      {videoForm.videoFile ? (
                        <div className="flex flex-col items-center text-emerald-600 px-4 text-center">
                          <div className="p-3 bg-emerald-100 rounded-full mb-3">
                            <Video size={24} />
                          </div>
                          <p className="text-[11px] font-bold truncate w-full">
                            {videoForm.videoFile.name}
                          </p>
                          <span className="text-[9px] font-medium opacity-60">
                            File ready for sync
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-neutral-400 group-hover:text-indigo-500 transition-colors">
                          <div className="p-4 bg-white border border-neutral-100 rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform duration-500">
                            <Upload size={20} />
                          </div>
                          <span className="text-[11px] font-bold">
                            Select video file
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail Upload */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-neutral-400 font-satoshi tracking-tight">
                      Visual key (thumbnail)
                    </label>
                    <div
                      className={`relative h-40 border-2 border-dashed rounded-3xl transition-all duration-300 group flex flex-col items-center justify-center overflow-hidden ${videoForm.thumbnail ? "border-indigo-500" : "border-neutral-200 bg-neutral-50/50 hover:border-indigo-400 hover:bg-neutral-50"}`}
                    >
                      <input
                        type="file"
                        name="thumbnail"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        required
                      />
                      {thumbnailPreview ? (
                        <img
                          src={thumbnailPreview}
                          alt="Preview"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-neutral-400 group-hover:text-indigo-500 transition-colors relative z-10">
                          <div className="p-4 bg-white border border-neutral-100 rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform duration-500">
                            <ImagePlus size={20} />
                          </div>
                          <span className="text-[11px] font-bold">
                            Upload thumbnail
                          </span>
                        </div>
                      )}
                      {thumbnailPreview && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white text-[10px] font-bold">
                            Change Thumbnail
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side: Metadata */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-400 font-satoshi tracking-tight">
                      Heading
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={videoForm.title}
                      onChange={handleInputChange}
                      className="w-full h-14 px-5 bg-white/40 backdrop-blur-xl border border-neutral-200 rounded-2xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-satoshi font-bold text-base placeholder:text-neutral-300"
                      placeholder="A concise, catchy title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-400 font-satoshi tracking-tight">
                      Briefing (description)
                    </label>
                    <textarea
                      name="description"
                      value={videoForm.description}
                      onChange={handleInputChange}
                      rows="7"
                      className="w-full px-5 py-4 bg-white/40 backdrop-blur-xl border border-neutral-200 rounded-2xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-all text-sm leading-relaxed text-neutral-600 placeholder:text-neutral-300"
                      placeholder="Detail your content's mission and context..."
                    ></textarea>
                  </div>

                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex gap-3">
                    <Info
                      size={16}
                      className="text-indigo-600 shrink-0 mt-0.5"
                    />
                    <p className="text-[10px] text-indigo-600 font-medium leading-relaxed">
                      By publishing, you agree to our creator guidelines and
                      content standards.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-sm font-bold text-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  Cancel upload
                </button>
                <button
                  type="submit"
                  disabled={!videoForm.videoFile || !videoForm.thumbnail}
                  className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                >
                  Publish content
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PublishVideoModal;

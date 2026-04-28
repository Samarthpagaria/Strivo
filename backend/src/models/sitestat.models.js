import mongoose, { Schema } from "mongoose";

const siteStatSchema = new Schema(
    {
        upvotes: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

export const SiteStat = mongoose.model("SiteStat", siteStatSchema);

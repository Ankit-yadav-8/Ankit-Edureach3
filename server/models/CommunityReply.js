import mongoose from "mongoose";
import { MediaSchema } from "./CommunityPost.js";

const communityReplySchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "CommunityPost", required: true, index: true },
    plan: { type: String, required: true, index: true }, // denormalised for the batch guard
    authorId: { type: String, required: true },
    authorName: { type: String, default: "Student" },
    studentId: { type: String, default: "" },

    text: { type: String, default: "", maxlength: 4000 },
    media: { type: [MediaSchema], default: [] },
    likes: { type: [String], default: [] },

    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

communityReplySchema.index({ postId: 1, createdAt: 1 });

export default mongoose.model("CommunityReply", communityReplySchema);

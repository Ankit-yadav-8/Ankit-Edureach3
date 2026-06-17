import mongoose from "mongoose";

// One uploaded image/video on a post or reply. URLs are validated against our
// own Cloudinary account before they're ever stored (see utils/cloudinary.js).
const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    type: { type: String, enum: ["image", "video"], default: "image" },
    width: Number,
    height: Number,
    poster: String, // still-frame thumbnail for videos
  },
  { _id: false }
);

const communityPostSchema = new mongoose.Schema(
  {
    plan: { type: String, required: true, index: true }, // the batch "room" (or "public")
    authorId: { type: String, required: true }, // user _id
    authorName: { type: String, default: "Student" },
    studentId: { type: String, default: "" },
    // Author standing in the open public room: "student" (enrolled in any
    // mentorship batch), "mentor"/"team" (staff) or "member" (free user).
    role: { type: String, default: "" },

    text: { type: String, default: "", maxlength: 4000 },
    media: { type: [mediaSchema], default: [] },
    tag: { type: String, enum: ["doubt", "discussion", "resource", "announcement"], default: "doubt" },
    subject: { type: String, default: "" },

    pinned: { type: Boolean, default: false }, // "highlighted" announcements
    pinnedAt: { type: Date, default: null },

    likes: { type: [String], default: [] }, // user ids that upvoted
    replyCount: { type: Number, default: 0 },
    lastReplyAt: { type: Date, default: null },

    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

communityPostSchema.index({ plan: 1, createdAt: -1 });
communityPostSchema.index({ plan: 1, pinned: 1, createdAt: -1 });

export const MediaSchema = mediaSchema;
export default mongoose.model("CommunityPost", communityPostSchema);

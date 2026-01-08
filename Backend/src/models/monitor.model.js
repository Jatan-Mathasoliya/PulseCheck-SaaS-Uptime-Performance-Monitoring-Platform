import mongoose from "mongoose";

const monitorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    url: {
      type: String,
      required: true
    },

    interval: {
      type: Number,
      required: true,
      default: 3600
    },

    status: {
      type: String,
      enum: ["UP", "DOWN", "UNKNOWN"],
      default: "UNKNOWN"
    },

    lastCheckedAt: {
      type: Date
    },

    nextCheckAt: {
      type: Date,
      required: true,
      index: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Monitor", monitorSchema);
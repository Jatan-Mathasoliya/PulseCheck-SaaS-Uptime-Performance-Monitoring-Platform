import mongoose from "mongoose";

const checkResultSchema = new mongoose.Schema(
  {
    monitorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Monitor",
      required: true,
      index: true
    },

    status: {
      type: String,
      enum: ["UP", "DOWN"],
      required: true
    },

    responseTime: {
      type: Number
    },

    statusCode: {
      type: Number
    },

    error: {
      type: String
    },

    checkedAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  }
);

export default mongoose.model("CheckResult", checkResultSchema);
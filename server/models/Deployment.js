const mongoose = require("mongoose")

const deploymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appName: {
      type: String,
      required: true,
      trim: true,
    },
    githubUrl: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "success", "failed"],
      default: "pending",
    },
    stackType: {
      frontend: String,
      backend: String,
      database: String,
    },
    awsResources: {
      ecsCluster: String,
      s3Bucket: String,
      cloudFrontUrl: String,
      rdsInstance: String,
      publicIp: String,
    },
    urls: {
      frontend: String,
      api: String,
      admin: String,
    },
    costEstimation: {
      monthly: Number,
      breakdown: {
        compute: Number,
        storage: Number,
        database: Number,
        networking: Number,
      },
    },
    deploymentLogs: [
      {
        timestamp: { type: Date, default: Date.now },
        level: { type: String, enum: ["info", "warn", "error"] },
        message: String,
      },
    ],
    environmentVariables: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Deployment", deploymentSchema)

const express = require("express")
const Deployment = require("../models/Deployment")
const auth = require("../middleware/auth")
const { detectStackType, estimateCost, simulateDeployment } = require("../services/deploymentService")

const router = express.Router()

// Get all deployments for user
router.get("/", auth, async (req, res) => {
  try {
    const deployments = await Deployment.find({ userId: req.userId }).sort({ createdAt: -1 })

    res.json(deployments)
  } catch (error) {
    console.error("Get deployments error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get single deployment
router.get("/:id", auth, async (req, res) => {
  try {
    const deployment = await Deployment.findOne({
      _id: req.params.id,
      userId: req.userId,
    })

    if (!deployment) {
      return res.status(404).json({ message: "Deployment not found" })
    }

    res.json(deployment)
  } catch (error) {
    console.error("Get deployment error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new deployment
router.post("/deploy", auth, async (req, res) => {
  try {
    const { appName, githubUrl, roleArn, githubToken, envFileContent } = req.body

    // Parse environment variables
    const envVars = new Map()
    if (envFileContent) {
      const lines = envFileContent.split("\n")
      lines.forEach((line) => {
        const [key, ...valueParts] = line.split("=")
        if (key && valueParts.length > 0) {
          envVars.set(key.trim(), valueParts.join("=").trim())
        }
      })
    }

    // Create deployment record
    const deployment = new Deployment({
      userId: req.userId,
      appName,
      githubUrl,
      environmentVariables: envVars,
      status: "pending",
    })

    await deployment.save()

    // Start deployment process (async)
    processDeployment(deployment._id, {
      githubUrl,
      roleArn,
      githubToken,
      envVars: Object.fromEntries(envVars),
    })

    res.status(201).json({
      message: "Deployment started",
      deploymentId: deployment._id,
      deployment,
    })
  } catch (error) {
    console.error("Deploy error:", error)
    res.status(500).json({ message: "Server error during deployment" })
  }
})

// Process deployment (background task)
async function processDeployment(deploymentId, config) {
  try {
    const deployment = await Deployment.findById(deploymentId)

    // Update status to in-progress
    deployment.status = "in-progress"
    deployment.deploymentLogs.push({
      level: "info",
      message: "Starting deployment process...",
    })
    await deployment.save()

    // Step 1: Detect stack type
    const stackType = await detectStackType(config.githubUrl, config.githubToken)
    deployment.stackType = stackType
    deployment.deploymentLogs.push({
      level: "info",
      message: `Detected stack: ${JSON.stringify(stackType)}`,
    })
    await deployment.save()

    // Step 2: Simulate AWS deployment
    const awsResources = await simulateDeployment(config, stackType)
    deployment.awsResources = awsResources
    deployment.urls = {
      frontend: awsResources.cloudFrontUrl,
      api: `https://${awsResources.publicIp}:3000`,
      admin: `https://${awsResources.publicIp}:3001`,
    }
    deployment.deploymentLogs.push({
      level: "info",
      message: "AWS resources provisioned successfully",
    })
    await deployment.save()

    // Step 3: Calculate cost estimation
    const costEstimation = estimateCost(stackType, awsResources)
    deployment.costEstimation = costEstimation
    deployment.deploymentLogs.push({
      level: "info",
      message: `Estimated monthly cost: $${costEstimation.monthly}`,
    })

    // Final update
    deployment.status = "success"
    deployment.deploymentLogs.push({
      level: "info",
      message: "Deployment completed successfully!",
    })
    await deployment.save()
  } catch (error) {
    console.error("Deployment process error:", error)

    const deployment = await Deployment.findById(deploymentId)
    deployment.status = "failed"
    deployment.deploymentLogs.push({
      level: "error",
      message: `Deployment failed: ${error.message}`,
    })
    await deployment.save()
  }
}

// Delete deployment
router.delete("/:id", auth, async (req, res) => {
  try {
    const deployment = await Deployment.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    })

    if (!deployment) {
      return res.status(404).json({ message: "Deployment not found" })
    }

    res.json({ message: "Deployment deleted successfully" })
  } catch (error) {
    console.error("Delete deployment error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router

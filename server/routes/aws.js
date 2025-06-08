const express = require("express")
const auth = require("../middleware/auth")
const { validateAwsRole, getAwsRegions } = require("../services/awsService")

const router = express.Router()

// Validate AWS IAM Role
router.post("/validate-role", auth, async (req, res) => {
  try {
    const { roleArn } = req.body

    if (!roleArn) {
      return res.status(400).json({ message: "Role ARN is required" })
    }

    const validation = await validateAwsRole(roleArn)

    res.json({
      valid: validation.valid,
      permissions: validation.permissions,
      missingPermissions: validation.missingPermissions,
      message: validation.message,
    })
  } catch (error) {
    console.error("AWS role validation error:", error)
    res.status(500).json({
      message: "Error validating AWS role",
      error: error.message,
    })
  }
})

// Get AWS regions
router.get("/regions", auth, async (req, res) => {
  try {
    const regions = await getAwsRegions()
    res.json(regions)
  } catch (error) {
    console.error("Get AWS regions error:", error)
    res.status(500).json({ message: "Error fetching AWS regions" })
  }
})

// Get cost estimation
router.post("/estimate-cost", auth, async (req, res) => {
  try {
    const { stackType, region, instanceType } = req.body

    // Simulate cost calculation
    const baseCosts = {
      "t3.micro": 8.76,
      "t3.small": 17.52,
      "t3.medium": 35.04,
      "t3.large": 70.08,
    }

    const estimate = {
      compute: baseCosts[instanceType] || 35.04,
      storage: 10.0,
      database: stackType.database ? 25.0 : 0,
      networking: 5.0,
      monitoring: 3.0,
    }

    const total = Object.values(estimate).reduce((sum, cost) => sum + cost, 0)

    res.json({
      monthly: Number.parseFloat(total.toFixed(2)),
      breakdown: estimate,
      region,
      instanceType,
    })
  } catch (error) {
    console.error("Cost estimation error:", error)
    res.status(500).json({ message: "Error calculating cost estimation" })
  }
})

module.exports = router

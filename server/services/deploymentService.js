const axios = require("axios")

// Detect stack type from GitHub repository
async function detectStackType(githubUrl, githubToken) {
  try {
    // Extract repo info from URL
    const repoMatch = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
    if (!repoMatch) {
      throw new Error("Invalid GitHub URL")
    }

    const [, owner, repo] = repoMatch

    // Get repository contents
    const headers = githubToken ? { Authorization: `token ${githubToken}` } : {}
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents`, { headers })

    const files = response.data.map((file) => file.name.toLowerCase())

    const stackType = {
      frontend: "unknown",
      backend: "unknown",
      database: null,
    }

    // Detect frontend
    if (files.includes("package.json")) {
      if (files.includes("next.config.js") || files.includes("next.config.mjs")) {
        stackType.frontend = "Next.js"
      } else if (files.some((f) => f.includes("react"))) {
        stackType.frontend = "React"
      } else if (files.some((f) => f.includes("vue"))) {
        stackType.frontend = "Vue.js"
      } else if (files.some((f) => f.includes("angular"))) {
        stackType.frontend = "Angular"
      } else {
        stackType.frontend = "Node.js"
      }
    } else if (files.includes("index.html")) {
      stackType.frontend = "Static HTML"
    }

    // Detect backend
    if (files.includes("package.json")) {
      stackType.backend = "Node.js"
    } else if (files.includes("requirements.txt") || files.includes("pyproject.toml")) {
      stackType.backend = "Python"
    } else if (files.includes("go.mod")) {
      stackType.backend = "Go"
    } else if (files.includes("pom.xml") || files.includes("build.gradle")) {
      stackType.backend = "Java"
    }

    // Detect database
    if (files.some((f) => f.includes("mongo") || f.includes("mongoose"))) {
      stackType.database = "MongoDB"
    } else if (files.some((f) => f.includes("postgres") || f.includes("pg"))) {
      stackType.database = "PostgreSQL"
    } else if (files.some((f) => f.includes("mysql"))) {
      stackType.database = "MySQL"
    }

    return stackType
  } catch (error) {
    console.error("Stack detection error:", error)
    return {
      frontend: "React",
      backend: "Node.js",
      database: "PostgreSQL",
    }
  }
}

// Simulate AWS deployment
async function simulateDeployment(config, stackType) {
  // Simulate deployment delay
  await new Promise((resolve) => setTimeout(resolve, 3000))

  // Generate mock AWS resources
  const timestamp = Date.now()
  const randomIp = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`

  return {
    ecsCluster: `saas-cluster-${timestamp}`,
    s3Bucket: `saas-frontend-${timestamp}`,
    cloudFrontUrl: `https://d${timestamp}.cloudfront.net`,
    rdsInstance: stackType.database ? `saas-db-${timestamp}` : null,
    publicIp: randomIp,
  }
}

// Calculate cost estimation
function estimateCost(stackType, awsResources) {
  const costs = {
    compute: 35.04, // t3.medium
    storage: 10.0, // S3 + EBS
    database: stackType.database ? 25.0 : 0, // RDS
    networking: 5.0, // CloudFront + Data transfer
    monitoring: 3.0, // CloudWatch
  }

  const monthly = Object.values(costs).reduce((sum, cost) => sum + cost, 0)

  return {
    monthly: Number.parseFloat(monthly.toFixed(2)),
    breakdown: costs,
  }
}

module.exports = {
  detectStackType,
  simulateDeployment,
  estimateCost,
}

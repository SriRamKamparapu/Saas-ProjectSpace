// Simulate AWS service interactions

async function validateAwsRole(roleArn) {
  // Simulate role validation
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const requiredPermissions = [
    "AmazonECS_FullAccess",
    "AmazonS3FullAccess",
    "AmazonRDSFullAccess",
    "CloudWatchFullAccess",
    "IAMFullAccess",
  ]

  // Simulate validation result
  const isValid = roleArn.includes("arn:aws:iam::")

  return {
    valid: isValid,
    permissions: isValid ? requiredPermissions : [],
    missingPermissions: isValid ? [] : requiredPermissions,
    message: isValid ? "Role validation successful" : "Invalid role ARN format",
  }
}

async function getAwsRegions() {
  return [
    { code: "us-east-1", name: "US East (N. Virginia)" },
    { code: "us-west-2", name: "US West (Oregon)" },
    { code: "eu-west-1", name: "Europe (Ireland)" },
    { code: "ap-southeast-1", name: "Asia Pacific (Singapore)" },
    { code: "ap-northeast-1", name: "Asia Pacific (Tokyo)" },
  ]
}

module.exports = {
  validateAwsRole,
  getAwsRegions,
}

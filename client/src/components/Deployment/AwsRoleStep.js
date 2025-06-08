"use client"

import { useState } from "react"
import axios from "axios"

const AwsRoleStep = ({ data, updateData, onNext }) => {
  const [validating, setValidating] = useState(false)
  const [validation, setValidation] = useState(null)
  const [error, setError] = useState("")

  const handleRoleArnChange = (e) => {
    updateData({ roleArn: e.target.value })
    setValidation(null)
    setError("")
  }

  const validateRole = async () => {
    if (!data.roleArn) {
      setError("Please enter a Role ARN")
      return
    }

    setValidating(true)
    setError("")

    try {
      const response = await axios.post("/api/aws/validate-role", {
        roleArn: data.roleArn,
      })

      setValidation(response.data)
    } catch (error) {
      console.error("Role validation error:", error)
      setError(error.response?.data?.message || "Failed to validate role")
    } finally {
      setValidating(false)
    }
  }

  const canProceed = validation?.valid

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🔐 AWS IAM Role Configuration</h2>
        <p style={styles.description}>Provide your AWS IAM Role ARN for secure deployment access</p>
      </div>

      <div style={styles.content}>
        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>🛡️ Security Benefits</h3>
          <ul style={styles.benefitsList}>
            <li>✅ No AWS access keys stored</li>
            <li>✅ Temporary credentials only</li>
            <li>✅ User-controlled access</li>
            <li>✅ Revoke access anytime</li>
          </ul>
        </div>

        <div className="form-group">
          <label className="form-label">AWS IAM Role ARN *</label>
          <input
            type="text"
            value={data.roleArn}
            onChange={handleRoleArnChange}
            className="form-input"
            placeholder="arn:aws:iam::123456789012:role/SaaSDeploymentRole"
          />
          <div style={styles.helpText}>Enter the ARN of the IAM role that grants deployment permissions</div>
        </div>

        <button
          onClick={validateRole}
          className="btn btn-secondary"
          disabled={validating || !data.roleArn}
          style={styles.validateBtn}
        >
          {validating ? "Validating..." : "🔍 Validate Role"}
        </button>

        {error && <div className="alert alert-error">{error}</div>}

        {validation && (
          <div className={`alert ${validation.valid ? "alert-success" : "alert-error"}`}>
            <div style={styles.validationHeader}>
              {validation.valid ? "✅ Role Validation Successful" : "❌ Role Validation Failed"}
            </div>
            <div style={styles.validationMessage}>{validation.message}</div>
            {validation.missingPermissions?.length > 0 && (
              <div style={styles.missingPermissions}>
                <strong>Missing Permissions:</strong>
                <ul>
                  {validation.missingPermissions.map((permission, index) => (
                    <li key={index}>{permission}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div style={styles.setupGuide}>
          <h3 style={styles.guideTitle}>📋 IAM Role Setup Guide</h3>
          <div style={styles.guideSteps}>
            <div style={styles.guideStep}>
              <strong>1. Create IAM Role</strong>
              <p>Go to AWS IAM Console → Roles → Create Role</p>
            </div>
            <div style={styles.guideStep}>
              <strong>2. Set Trusted Entity</strong>
              <code style={styles.codeBlock}>arn:aws:iam::YOUR-PLATFORM-ACCOUNT:root</code>
            </div>
            <div style={styles.guideStep}>
              <strong>3. Attach Policies</strong>
              <ul style={styles.policyList}>
                <li>AmazonECS_FullAccess</li>
                <li>AmazonS3FullAccess</li>
                <li>AmazonRDSFullAccess</li>
                <li>CloudWatchFullAccess</li>
                <li>IAMFullAccess</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.footer}>
        <button onClick={onNext} className="btn btn-primary" disabled={!canProceed}>
          Continue to GitHub Setup →
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  header: {
    marginBottom: "32px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "8px",
  },
  description: {
    fontSize: "16px",
    color: "#6b7280",
  },
  content: {
    flex: 1,
  },
  infoBox: {
    background: "#f0f9ff",
    border: "1px solid #0ea5e9",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "24px",
  },
  infoTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#0c4a6e",
    marginBottom: "12px",
  },
  benefitsList: {
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  helpText: {
    fontSize: "14px",
    color: "#6b7280",
    marginTop: "4px",
  },
  validateBtn: {
    marginBottom: "24px",
  },
  validationHeader: {
    fontWeight: "bold",
    marginBottom: "8px",
  },
  validationMessage: {
    marginBottom: "8px",
  },
  missingPermissions: {
    marginTop: "12px",
  },
  setupGuide: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "20px",
    marginTop: "24px",
  },
  guideTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "16px",
  },
  guideSteps: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  guideStep: {
    fontSize: "14px",
  },
  codeBlock: {
    display: "block",
    background: "#f3f4f6",
    padding: "8px 12px",
    borderRadius: "4px",
    fontFamily: "monospace",
    fontSize: "12px",
    marginTop: "4px",
  },
  policyList: {
    fontSize: "12px",
    marginTop: "4px",
  },
  footer: {
    borderTop: "1px solid #e5e7eb",
    paddingTop: "24px",
    display: "flex",
    justifyContent: "flex-end",
  },
}

export default AwsRoleStep

"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import LoadingSpinner from "../UI/LoadingSpinner"

const DeploymentDetails = () => {
  const { id } = useParams()
  const [deployment, setDeployment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchDeployment()

    // Poll for updates if deployment is in progress
    const interval = setInterval(() => {
      if (deployment?.status === "in-progress" || deployment?.status === "pending") {
        fetchDeployment()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [id, deployment?.status])

  const fetchDeployment = async () => {
    try {
      const response = await axios.get(`/api/deployments/${id}`)
      setDeployment(response.data)
    } catch (error) {
      console.error("Fetch deployment error:", error)
      setError("Failed to load deployment details")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error || !deployment) {
    return (
      <div className="container" style={styles.container}>
        <div className="alert alert-error">{error || "Deployment not found"}</div>
        <Link to="/dashboard" className="btn btn-secondary">
          ← Back to Dashboard
        </Link>
      </div>
    )
  }

  const getStatusInfo = (status) => {
    const statusMap = {
      success: {
        icon: "✅",
        text: "Deployment Successful",
        color: "#10b981",
        description: "Your application is live and running!",
      },
      "in-progress": {
        icon: "🔄",
        text: "Deployment In Progress",
        color: "#f59e0b",
        description: "Please wait while we deploy your application...",
      },
      pending: {
        icon: "⏳",
        text: "Deployment Pending",
        color: "#6b7280",
        description: "Deployment is queued and will start shortly.",
      },
      failed: {
        icon: "❌",
        text: "Deployment Failed",
        color: "#ef4444",
        description: "Something went wrong during deployment.",
      },
    }

    return statusMap[status] || statusMap["pending"]
  }

  const statusInfo = getStatusInfo(deployment.status)

  return (
    <div className="container" style={styles.container}>
      <div style={styles.header}>
        <Link to="/dashboard" style={styles.backLink}>
          ← Back to Dashboard
        </Link>
        <div>
          <h1 style={styles.title}>{deployment.appName}</h1>
          <p style={styles.subtitle}>Deployment Details & Status</p>
        </div>
      </div>

      <div style={styles.statusCard}>
        <div style={styles.statusHeader}>
          <div style={styles.statusIcon}>{statusInfo.icon}</div>
          <div>
            <h2 style={{ ...styles.statusTitle, color: statusInfo.color }}>{statusInfo.text}</h2>
            <p style={styles.statusDescription}>{statusInfo.description}</p>
          </div>
        </div>

        {deployment.status === "in-progress" && (
          <div style={styles.progressBar}>
            <div style={styles.progressFill}></div>
          </div>
        )}
      </div>

      <div className="grid grid-2">
        {/* Deployment Info */}
        <div className="card">
          <h3 style={styles.cardTitle}>📋 Deployment Information</h3>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>GitHub Repository</span>
              <a href={deployment.githubUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
                {deployment.githubUrl}
              </a>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Created</span>
              <span>{new Date(deployment.createdAt).toLocaleString()}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Last Updated</span>
              <span>{new Date(deployment.updatedAt).toLocaleString()}</span>
            </div>
            {deployment.stackType && (
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Detected Stack</span>
                <div style={styles.stackBadges}>
                  {deployment.stackType.frontend && (
                    <span style={styles.stackBadge}>{deployment.stackType.frontend}</span>
                  )}
                  {deployment.stackType.backend && (
                    <span style={styles.stackBadge}>{deployment.stackType.backend}</span>
                  )}
                  {deployment.stackType.database && (
                    <span style={styles.stackBadge}>{deployment.stackType.database}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Access URLs */}
        <div className="card">
          <h3 style={styles.cardTitle}>🔗 Access URLs</h3>
          <div style={styles.urlGrid}>
            {deployment.urls?.frontend ? (
              <div style={styles.urlItem}>
                <span style={styles.urlLabel}>🌐 Frontend</span>
                <a
                  href={deployment.urls.frontend}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                >
                  Open App
                </a>
              </div>
            ) : (
              <div style={styles.urlItem}>
                <span style={styles.urlLabel}>🌐 Frontend</span>
                <span style={styles.notAvailable}>Not available yet</span>
              </div>
            )}

            {deployment.urls?.api ? (
              <div style={styles.urlItem}>
                <span style={styles.urlLabel}>🔌 API</span>
                <a
                  href={deployment.urls.api}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  View API
                </a>
              </div>
            ) : (
              <div style={styles.urlItem}>
                <span style={styles.urlLabel}>🔌 API</span>
                <span style={styles.notAvailable}>Not available yet</span>
              </div>
            )}

            {deployment.awsResources?.publicIp && (
              <div style={styles.urlItem}>
                <span style={styles.urlLabel}>🌍 Public IP</span>
                <code style={styles.ipAddress}>{deployment.awsResources.publicIp}</code>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AWS Resources */}
      {deployment.awsResources && (
        <div className="card">
          <h3 style={styles.cardTitle}>☁️ AWS Resources</h3>
          <div className="grid grid-3">
            {deployment.awsResources.ecsCluster && (
              <div style={styles.resourceItem}>
                <div style={styles.resourceIcon}>🚀</div>
                <div>
                  <div style={styles.resourceLabel}>ECS Cluster</div>
                  <div style={styles.resourceValue}>{deployment.awsResources.ecsCluster}</div>
                </div>
              </div>
            )}
            {deployment.awsResources.s3Bucket && (
              <div style={styles.resourceItem}>
                <div style={styles.resourceIcon}>📦</div>
                <div>
                  <div style={styles.resourceLabel}>S3 Bucket</div>
                  <div style={styles.resourceValue}>{deployment.awsResources.s3Bucket}</div>
                </div>
              </div>
            )}
            {deployment.awsResources.rdsInstance && (
              <div style={styles.resourceItem}>
                <div style={styles.resourceIcon}>🗄️</div>
                <div>
                  <div style={styles.resourceLabel}>RDS Instance</div>
                  <div style={styles.resourceValue}>{deployment.awsResources.rdsInstance}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cost Estimation */}
      {deployment.costEstimation && (
        <div className="card">
          <h3 style={styles.cardTitle}>💰 Cost Estimation</h3>
          <div style={styles.costContainer}>
            <div style={styles.totalCost}>
              <span style={styles.costLabel}>Estimated Monthly Cost</span>
              <span style={styles.costValue}>${deployment.costEstimation.monthly}/month</span>
            </div>
            {deployment.costEstimation.breakdown && (
              <div style={styles.costBreakdown}>
                <h4 style={styles.breakdownTitle}>Cost Breakdown</h4>
                <div style={styles.breakdownGrid}>
                  {Object.entries(deployment.costEstimation.breakdown).map(([key, value]) => (
                    <div key={key} style={styles.breakdownItem}>
                      <span style={styles.breakdownLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                      <span style={styles.breakdownValue}>${value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Deployment Logs */}
      {deployment.deploymentLogs && deployment.deploymentLogs.length > 0 && (
        <div className="card">
          <h3 style={styles.cardTitle}>📝 Deployment Logs</h3>
          <div style={styles.logsContainer}>
            {deployment.deploymentLogs.map((log, index) => (
              <div key={index} style={styles.logEntry}>
                <span style={styles.logTimestamp}>{new Date(log.timestamp).toLocaleTimeString()}</span>
                <span
                  style={{
                    ...styles.logLevel,
                    color: log.level === "error" ? "#ef4444" : log.level === "warn" ? "#f59e0b" : "#10b981",
                  }}
                >
                  {log.level.toUpperCase()}
                </span>
                <span style={styles.logMessage}>{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    paddingTop: "32px",
    paddingBottom: "32px",
  },
  header: {
    marginBottom: "32px",
  },
  backLink: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "500",
    marginBottom: "16px",
    display: "inline-block",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#6b7280",
  },
  statusCard: {
    background: "white",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "32px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
  statusHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  statusIcon: {
    fontSize: "48px",
  },
  statusTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  statusDescription: {
    fontSize: "16px",
    color: "#6b7280",
  },
  progressBar: {
    width: "100%",
    height: "8px",
    background: "#e5e7eb",
    borderRadius: "4px",
    marginTop: "16px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #667eea, #764ba2)",
    borderRadius: "4px",
    animation: "progress 2s ease-in-out infinite",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "16px",
  },
  infoGrid: {
    display: "grid",
    gap: "12px",
  },
  infoItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #f3f4f6",
  },
  infoLabel: {
    fontWeight: "500",
    color: "#374151",
  },
  link: {
    color: "#667eea",
    textDecoration: "none",
  },
  stackBadges: {
    display: "flex",
    gap: "4px",
  },
  stackBadge: {
    background: "#e5e7eb",
    color: "#374151",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "500",
  },
  urlGrid: {
    display: "grid",
    gap: "16px",
  },
  urlItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  urlLabel: {
    fontWeight: "500",
    color: "#374151",
  },
  notAvailable: {
    color: "#9ca3af",
    fontStyle: "italic",
  },
  ipAddress: {
    background: "#f3f4f6",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontFamily: "monospace",
  },
  resourceItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    background: "#f9fafb",
    borderRadius: "8px",
  },
  resourceIcon: {
    fontSize: "24px",
  },
  resourceLabel: {
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: "500",
  },
  resourceValue: {
    fontSize: "14px",
    color: "#1f2937",
    fontWeight: "600",
  },
  costContainer: {
    display: "grid",
    gap: "24px",
  },
  totalCost: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    background: "#f0fdf4",
    borderRadius: "8px",
    border: "1px solid #22c55e",
  },
  costLabel: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#15803d",
  },
  costValue: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#15803d",
  },
  costBreakdown: {
    background: "#f9fafb",
    padding: "16px",
    borderRadius: "8px",
  },
  breakdownTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "12px",
  },
  breakdownGrid: {
    display: "grid",
    gap: "8px",
  },
  breakdownItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "4px 0",
  },
  breakdownLabel: {
    fontSize: "14px",
    color: "#6b7280",
  },
  breakdownValue: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#1f2937",
  },
  logsContainer: {
    background: "#1f2937",
    borderRadius: "8px",
    padding: "16px",
    maxHeight: "400px",
    overflowY: "auto",
    fontFamily: "monospace",
  },
  logEntry: {
    display: "flex",
    gap: "12px",
    marginBottom: "8px",
    fontSize: "12px",
  },
  logTimestamp: {
    color: "#9ca3af",
    minWidth: "80px",
  },
  logLevel: {
    fontWeight: "bold",
    minWidth: "50px",
  },
  logMessage: {
    color: "#e5e7eb",
    flex: 1,
  },
}

export default DeploymentDetails

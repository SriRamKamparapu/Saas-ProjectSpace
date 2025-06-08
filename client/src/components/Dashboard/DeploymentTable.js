"use client"
import { Link } from "react-router-dom"

const DeploymentTable = ({ deployments, onDelete }) => {
  const getStatusBadge = (status) => {
    const statusMap = {
      success: { class: "status-success", text: "✅ Success" },
      "in-progress": { class: "status-progress", text: "🔄 In Progress" },
      pending: { class: "status-pending", text: "⏳ Pending" },
      failed: { class: "status-failed", text: "❌ Failed" },
    }

    const statusInfo = statusMap[status] || statusMap["pending"]

    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div style={styles.tableContainer}>
      <table className="table">
        <thead>
          <tr>
            <th>App Name</th>
            <th>Status</th>
            <th>Frontend URL</th>
            <th>API URL</th>
            <th>Public IP</th>
            <th>Est. Cost</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {deployments.map((deployment) => (
            <tr key={deployment._id}>
              <td>
                <div style={styles.appName}>
                  <strong>{deployment.appName}</strong>
                  <div style={styles.stackInfo}>
                    {deployment.stackType?.frontend && (
                      <span style={styles.stackBadge}>{deployment.stackType.frontend}</span>
                    )}
                    {deployment.stackType?.backend && (
                      <span style={styles.stackBadge}>{deployment.stackType.backend}</span>
                    )}
                  </div>
                </div>
              </td>
              <td>{getStatusBadge(deployment.status)}</td>
              <td>
                {deployment.urls?.frontend ? (
                  <a href={deployment.urls.frontend} target="_blank" rel="noopener noreferrer" style={styles.link}>
                    🌐 View App
                  </a>
                ) : (
                  <span style={styles.notAvailable}>-</span>
                )}
              </td>
              <td>
                {deployment.urls?.api ? (
                  <a href={deployment.urls.api} target="_blank" rel="noopener noreferrer" style={styles.link}>
                    🔗 API
                  </a>
                ) : (
                  <span style={styles.notAvailable}>-</span>
                )}
              </td>
              <td>
                {deployment.awsResources?.publicIp ? (
                  <code style={styles.ipAddress}>{deployment.awsResources.publicIp}</code>
                ) : (
                  <span style={styles.notAvailable}>-</span>
                )}
              </td>
              <td>
                {deployment.costEstimation?.monthly ? (
                  <span style={styles.cost}>${deployment.costEstimation.monthly}/mo</span>
                ) : (
                  <span style={styles.notAvailable}>-</span>
                )}
              </td>
              <td style={styles.dateCell}>{formatDate(deployment.createdAt)}</td>
              <td>
                <div style={styles.actions}>
                  <Link to={`/deployment/${deployment._id}`} className="btn btn-secondary btn-sm">
                    View
                  </Link>
                  <button onClick={() => onDelete(deployment._id)} className="btn btn-danger btn-sm">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const styles = {
  tableContainer: {
    overflowX: "auto",
  },
  appName: {
    minWidth: "150px",
  },
  stackInfo: {
    display: "flex",
    gap: "4px",
    marginTop: "4px",
  },
  stackBadge: {
    fontSize: "10px",
    background: "#e5e7eb",
    color: "#374151",
    padding: "2px 6px",
    borderRadius: "4px",
    fontWeight: "500",
  },
  link: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "500",
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
  cost: {
    fontWeight: "600",
    color: "#059669",
  },
  dateCell: {
    fontSize: "12px",
    color: "#6b7280",
  },
  actions: {
    display: "flex",
    gap: "8px",
  },
}

export default DeploymentTable

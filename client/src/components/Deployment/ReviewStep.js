"use client"

const ReviewStep = ({ data, onDeploy, onPrev, loading, error }) => {
  const envVarsCount = data.envFileContent
    ? data.envFileContent.split("\n").filter((line) => line.includes("=")).length
    : 0

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🚀 Review & Deploy</h2>
        <p style={styles.description}>Review your configuration and start the deployment</p>
      </div>

      <div style={styles.content}>
        {error && <div className="alert alert-error">{error}</div>}

        <div style={styles.reviewSection}>
          <h3 style={styles.sectionTitle}>📋 Deployment Summary</h3>

          <div style={styles.reviewGrid}>
            <div style={styles.reviewItem}>
              <div style={styles.reviewLabel}>Application Name</div>
              <div style={styles.reviewValue}>{data.appName}</div>
            </div>

            <div style={styles.reviewItem}>
              <div style={styles.reviewLabel}>GitHub Repository</div>
              <div style={styles.reviewValue}>
                <a href={data.githubUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
                  {data.githubUrl}
                </a>
              </div>
            </div>

            <div style={styles.reviewItem}>
              <div style={styles.reviewLabel}>AWS IAM Role</div>
              <div style={styles.reviewValue}>
                <code style={styles.codeText}>{data.roleArn}</code>
              </div>
            </div>

            <div style={styles.reviewItem}>
              <div style={styles.reviewLabel}>Environment Variables</div>
              <div style={styles.reviewValue}>{envVarsCount > 0 ? `${envVarsCount} variables configured` : "None"}</div>
            </div>
          </div>
        </div>

        <div style={styles.deploymentProcess}>
          <h3 style={styles.sectionTitle}>⚙️ Deployment Process</h3>
          <div style={styles.processList}>
            <div style={styles.processItem}>
              <span style={styles.processIcon}>🔍</span>
              <div>
                <strong>Stack Detection</strong>
                <p>Analyze repository structure and detect technology stack</p>
              </div>
            </div>
            <div style={styles.processItem}>
              <span style={styles.processIcon}>🏗️</span>
              <div>
                <strong>Infrastructure Setup</strong>
                <p>Provision AWS resources (ECS, S3, RDS, CloudFront)</p>
              </div>
            </div>
            <div style={styles.processItem}>
              <span style={styles.processIcon}>🚀</span>
              <div>
                <strong>Application Deployment</strong>
                <p>Build and deploy your application to AWS</p>
              </div>
            </div>
            <div style={styles.processItem}>
              <span style={styles.processIcon}>📊</span>
              <div>
                <strong>Monitoring Setup</strong>
                <p>Configure logging, monitoring, and cost tracking</p>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.estimatedCost}>
          <h3 style={styles.sectionTitle}>💰 Estimated Monthly Cost</h3>
          <div style={styles.costBreakdown}>
            <div style={styles.costItem}>
              <span>Compute (ECS/Fargate)</span>
              <span>$35.04</span>
            </div>
            <div style={styles.costItem}>
              <span>Storage (S3 + EBS)</span>
              <span>$10.00</span>
            </div>
            <div style={styles.costItem}>
              <span>Database (RDS)</span>
              <span>$25.00</span>
            </div>
            <div style={styles.costItem}>
              <span>Networking (CloudFront)</span>
              <span>$5.00</span>
            </div>
            <div style={styles.costItem}>
              <span>Monitoring (CloudWatch)</span>
              <span>$3.00</span>
            </div>
            <div style={styles.costTotal}>
              <span>
                <strong>Total Estimated Cost</strong>
              </span>
              <span>
                <strong>$78.04/month</strong>
              </span>
            </div>
          </div>
          <div style={styles.costNote}>* Actual costs may vary based on usage and AWS pricing changes</div>
        </div>

        <div style={styles.deliverables}>
          <h3 style={styles.sectionTitle}>📦 What You'll Get</h3>
          <div style={styles.deliverablesList}>
            <div style={styles.deliverableItem}>
              🌍 <strong>Public IP Address</strong> - Direct access to your backend service
            </div>
            <div style={styles.deliverableItem}>
              🔗 <strong>Frontend URL</strong> - CloudFront distribution for your frontend
            </div>
            <div style={styles.deliverableItem}>
              🔌 <strong>API Endpoint</strong> - RESTful API access point
            </div>
            <div style={styles.deliverableItem}>
              📊 <strong>Monitoring Dashboard</strong> - Real-time application metrics
            </div>
            <div style={styles.deliverableItem}>
              💰 <strong>Cost Tracking</strong> - Monthly AWS cost breakdown
            </div>
          </div>
        </div>
      </div>

      <div style={styles.footer}>
        <button onClick={onPrev} className="btn btn-secondary" disabled={loading}>
          ← Back
        </button>
        <button onClick={onDeploy} className="btn btn-primary" disabled={loading} style={styles.deployButton}>
          {loading ? (
            <>
              <span style={styles.spinner}></span>
              Deploying...
            </>
          ) : (
            "🚀 Start Deployment"
          )}
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
  reviewSection: {
    marginBottom: "32px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "16px",
  },
  reviewGrid: {
    display: "grid",
    gap: "16px",
  },
  reviewItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    background: "#f9fafb",
    borderRadius: "6px",
  },
  reviewLabel: {
    fontWeight: "600",
    color: "#374151",
  },
  reviewValue: {
    color: "#6b7280",
  },
  link: {
    color: "#667eea",
    textDecoration: "none",
  },
  codeText: {
    background: "#f3f4f6",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "12px",
    fontFamily: "monospace",
  },
  deploymentProcess: {
    marginBottom: "32px",
  },
  processList: {
    display: "grid",
    gap: "16px",
  },
  processItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "16px",
    background: "#f0f9ff",
    borderRadius: "8px",
    border: "1px solid #0ea5e9",
  },
  processIcon: {
    fontSize: "24px",
  },
  estimatedCost: {
    marginBottom: "32px",
  },
  costBreakdown: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "16px",
  },
  costItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  costTotal: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderTop: "2px solid #374151",
    marginTop: "8px",
    fontSize: "16px",
  },
  costNote: {
    fontSize: "12px",
    color: "#6b7280",
    fontStyle: "italic",
    marginTop: "8px",
  },
  deliverables: {
    marginBottom: "32px",
  },
  deliverablesList: {
    display: "grid",
    gap: "12px",
  },
  deliverableItem: {
    padding: "12px",
    background: "#f0fdf4",
    borderRadius: "6px",
    border: "1px solid #22c55e",
    color: "#15803d",
  },
  footer: {
    borderTop: "1px solid #e5e7eb",
    paddingTop: "24px",
    display: "flex",
    justifyContent: "space-between",
  },
  deployButton: {
    minWidth: "160px",
  },
  spinner: {
    display: "inline-block",
    width: "16px",
    height: "16px",
    border: "2px solid #ffffff",
    borderTop: "2px solid transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginRight: "8px",
  },
}

export default ReviewStep

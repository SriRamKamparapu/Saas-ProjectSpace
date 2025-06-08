"use client"

import { useState } from "react"

const GitHubStep = ({ data, updateData, onNext, onPrev }) => {
  const [showTokenHelp, setShowTokenHelp] = useState(false)

  const handleInputChange = (field, value) => {
    updateData({ [field]: value })
  }

  const isValid = data.appName && data.githubUrl && data.githubToken

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📁 GitHub Integration</h2>
        <p style={styles.description}>Connect your GitHub repository for automated deployment</p>
      </div>

      <div style={styles.content}>
        <div className="form-group">
          <label className="form-label">Application Name *</label>
          <input
            type="text"
            value={data.appName}
            onChange={(e) => handleInputChange("appName", e.target.value)}
            className="form-input"
            placeholder="My Awesome App"
          />
          <div style={styles.helpText}>Choose a name for your deployment</div>
        </div>

        <div className="form-group">
          <label className="form-label">GitHub Repository URL *</label>
          <input
            type="url"
            value={data.githubUrl}
            onChange={(e) => handleInputChange("githubUrl", e.target.value)}
            className="form-input"
            placeholder="https://github.com/username/repository"
          />
          <div style={styles.helpText}>Public or private GitHub repository URL</div>
        </div>

        <div className="form-group">
          <label className="form-label">
            GitHub Personal Access Token *
            <button type="button" onClick={() => setShowTokenHelp(!showTokenHelp)} style={styles.helpButton}>
              ❓ How to get this?
            </button>
          </label>
          <input
            type="password"
            value={data.githubToken}
            onChange={(e) => handleInputChange("githubToken", e.target.value)}
            className="form-input"
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
          />
          <div style={styles.helpText}>Required for accessing private repositories and deployment</div>
        </div>

        {showTokenHelp && (
          <div style={styles.tokenHelp}>
            <h3 style={styles.tokenHelpTitle}>🔑 Creating a GitHub Personal Access Token</h3>
            <ol style={styles.tokenSteps}>
              <li>Go to GitHub Settings → Developer settings → Personal access tokens</li>
              <li>Click "Generate new token (classic)"</li>
              <li>
                Select the following scopes:
                <ul style={styles.scopeList}>
                  <li>✅ repo (Full control of private repositories)</li>
                  <li>✅ workflow (Update GitHub Action workflows)</li>
                  <li>✅ read:packages (Download packages from GitHub Package Registry)</li>
                </ul>
              </li>
              <li>Copy the generated token and paste it above</li>
            </ol>
            <div style={styles.tokenWarning}>⚠️ Keep your token secure and never share it publicly</div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Environment Variables (Optional)</label>
          <textarea
            value={data.envFileContent}
            onChange={(e) => handleInputChange("envFileContent", e.target.value)}
            className="form-input form-textarea"
            placeholder={`DATABASE_URL=postgresql://user:pass@host:5432/db
API_KEY=your-api-key
NODE_ENV=production`}
            rows={6}
          />
          <div style={styles.helpText}>Enter environment variables in KEY=VALUE format, one per line</div>
        </div>

        <div style={styles.detectionInfo}>
          <h3 style={styles.detectionTitle}>🧠 Smart Stack Detection</h3>
          <p style={styles.detectionText}>Our system will automatically detect your application stack:</p>
          <div style={styles.detectionGrid}>
            <div style={styles.detectionItem}>
              <strong>Frontend:</strong> React, Vue.js, Angular, Next.js, Static HTML
            </div>
            <div style={styles.detectionItem}>
              <strong>Backend:</strong> Node.js, Python, Go, Java
            </div>
            <div style={styles.detectionItem}>
              <strong>Database:</strong> PostgreSQL, MySQL, MongoDB
            </div>
          </div>
        </div>
      </div>

      <div style={styles.footer}>
        <button onClick={onPrev} className="btn btn-secondary">
          ← Back
        </button>
        <button onClick={onNext} className="btn btn-primary" disabled={!isValid}>
          Continue to Review →
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
  helpText: {
    fontSize: "14px",
    color: "#6b7280",
    marginTop: "4px",
  },
  helpButton: {
    background: "none",
    border: "none",
    color: "#667eea",
    cursor: "pointer",
    fontSize: "12px",
    marginLeft: "8px",
  },
  tokenHelp: {
    background: "#fef3c7",
    border: "1px solid #f59e0b",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "24px",
  },
  tokenHelpTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: "12px",
  },
  tokenSteps: {
    fontSize: "14px",
    color: "#92400e",
    marginBottom: "12px",
  },
  scopeList: {
    fontSize: "12px",
    marginTop: "4px",
  },
  tokenWarning: {
    fontSize: "12px",
    fontWeight: "bold",
    color: "#dc2626",
  },
  detectionInfo: {
    background: "#f0fdf4",
    border: "1px solid #22c55e",
    borderRadius: "8px",
    padding: "16px",
    marginTop: "24px",
  },
  detectionTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#15803d",
    marginBottom: "8px",
  },
  detectionText: {
    fontSize: "14px",
    color: "#15803d",
    marginBottom: "12px",
  },
  detectionGrid: {
    display: "grid",
    gap: "8px",
  },
  detectionItem: {
    fontSize: "14px",
    color: "#15803d",
  },
  footer: {
    borderTop: "1px solid #e5e7eb",
    paddingTop: "24px",
    display: "flex",
    justifyContent: "space-between",
  },
}

export default GitHubStep

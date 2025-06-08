"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import DeploymentTable from "./DeploymentTable"
import StatsCards from "./StatsCards"
import LoadingSpinner from "../UI/LoadingSpinner"

const Dashboard = () => {
  const [deployments, setDeployments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchDeployments()
  }, [])

  const fetchDeployments = async () => {
    try {
      const response = await axios.get("/api/deployments")
      setDeployments(response.data)
    } catch (error) {
      console.error("Fetch deployments error:", error)
      setError("Failed to load deployments")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDeployment = async (deploymentId) => {
    if (!window.confirm("Are you sure you want to delete this deployment?")) {
      return
    }

    try {
      await axios.delete(`/api/deployments/${deploymentId}`)
      setDeployments(deployments.filter((d) => d._id !== deploymentId))
    } catch (error) {
      console.error("Delete deployment error:", error)
      alert("Failed to delete deployment")
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="container" style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>Manage your SaaS deployments and monitor their status</p>
        </div>
        <Link to="/deploy" className="btn btn-primary">
          🚀 New Deployment
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <StatsCards deployments={deployments} />

      <div className="card">
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>Recent Deployments</h2>
          <span style={styles.deploymentCount}>{deployments.length} total deployments</span>
        </div>

        {deployments.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📦</div>
            <h3 style={styles.emptyTitle}>No deployments yet</h3>
            <p style={styles.emptyText}>Get started by deploying your first application to AWS</p>
            <Link to="/deploy" className="btn btn-primary">
              Create Your First Deployment
            </Link>
          </div>
        ) : (
          <DeploymentTable deployments={deployments} onDelete={handleDeleteDeployment} />
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    paddingTop: "32px",
    paddingBottom: "32px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "32px",
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
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#1f2937",
  },
  deploymentCount: {
    fontSize: "14px",
    color: "#6b7280",
    background: "#f3f4f6",
    padding: "4px 12px",
    borderRadius: "12px",
  },
  emptyState: {
    textAlign: "center",
    padding: "48px 24px",
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  emptyTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "8px",
  },
  emptyText: {
    fontSize: "16px",
    color: "#6b7280",
    marginBottom: "24px",
  },
}

export default Dashboard

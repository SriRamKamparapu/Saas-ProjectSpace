"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = await login(formData.email, formData.password)

    if (!result.success) {
      setError(result.message)
    }

    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <div style={styles.header}>
          <h1 style={styles.title}>🚀 SaaS Deploy Engine</h1>
          <p style={styles.subtitle}>Deploy your applications to AWS with zero DevOps knowledge</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.formTitle}>Sign In</h2>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <p style={styles.linkText}>
            Don't have an account?{" "}
            <Link to="/register" style={styles.link}>
              Sign up here
            </Link>
          </p>
        </form>

        <div style={styles.features}>
          <h3 style={styles.featuresTitle}>✨ Key Features</h3>
          <ul style={styles.featuresList}>
            <li>🔐 Secure AWS IAM Role integration</li>
            <li>📁 GitHub repository deployment</li>
            <li>🧠 Smart stack detection</li>
            <li>🚀 Automated CI/CD pipeline</li>
            <li>💰 Real-time cost estimation</li>
            <li>📊 Deployment monitoring</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  loginBox: {
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    maxWidth: "900px",
    width: "100%",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0",
  },
  header: {
    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    color: "white",
    padding: "48px 32px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "16px",
  },
  subtitle: {
    fontSize: "16px",
    opacity: 0.9,
    lineHeight: 1.6,
  },
  form: {
    padding: "48px 32px",
  },
  formTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "32px",
    color: "#1f2937",
  },
  submitBtn: {
    width: "100%",
    marginBottom: "24px",
  },
  linkText: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: "14px",
  },
  link: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "600",
  },
  features: {
    gridColumn: "1 / -1",
    background: "#f8fafc",
    padding: "32px",
  },
  featuresTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "16px",
    color: "#1f2937",
  },
  featuresList: {
    listStyle: "none",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "12px",
  },
}

export default Login

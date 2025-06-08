"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import styles from "./Profile.module.css" // Declare the styles variable

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [formData, setFormData] = useState({
    company: user?.company || "",
    awsRoleArn: user?.awsRoleArn || "",
    githubToken: user?.githubToken || "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")

    const result = await updateProfile(formData)

    if (result.success) {
      setMessage("Profile updated successfully!")
    } else {
      setError(result.message)
    }

    setLoading(false)
  }

  return (
    <div className="container" style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Profile Settings</h1>
        <p style={styles.subtitle}>Manage your account settings and deployment preferences</p>
      </div>

      <div className="grid grid-2">
        {/* Profile Information */}
        <div className="card">
          <h2 style={styles.cardTitle}>👤 Profile Information</h2>

          {message && <div className="alert alert-success">{message}</div>}

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="company">Company</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="awsRoleArn">AWS Role ARN</label>
              <input
                type="text"
                id="awsRoleArn"
                name="awsRoleArn"
                value={formData.awsRoleArn}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="githubToken">GitHub Token</label>
              <input
                type="text"
                id="githubToken"
                name="githubToken"
                value={formData.githubToken}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Loading..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile

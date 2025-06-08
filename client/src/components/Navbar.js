"use client"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav style={styles.navbar}>
      <div className="container" style={styles.navContainer}>
        <Link to="/dashboard" style={styles.logo}>
          🚀 SaaS Deploy Engine
        </Link>

        <div style={styles.navLinks}>
          <Link
            to="/dashboard"
            style={{
              ...styles.navLink,
              ...(isActive("/dashboard") ? styles.activeLink : {}),
            }}
          >
            Dashboard
          </Link>
          <Link
            to="/deploy"
            style={{
              ...styles.navLink,
              ...(isActive("/deploy") ? styles.activeLink : {}),
            }}
          >
            New Deployment
          </Link>
          <Link
            to="/profile"
            style={{
              ...styles.navLink,
              ...(isActive("/profile") ? styles.activeLink : {}),
            }}
          >
            Profile
          </Link>
        </div>

        <div style={styles.userSection}>
          <span style={styles.userName}>👋 {user?.username}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

const styles = {
  navbar: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "16px 0",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
  navContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "white",
    textDecoration: "none",
  },
  navLinks: {
    display: "flex",
    gap: "32px",
  },
  navLink: {
    color: "rgba(255, 255, 255, 0.9)",
    textDecoration: "none",
    fontWeight: "500",
    padding: "8px 16px",
    borderRadius: "6px",
    transition: "all 0.2s",
  },
  activeLink: {
    background: "rgba(255, 255, 255, 0.2)",
    color: "white",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  userName: {
    fontSize: "14px",
    fontWeight: "500",
  },
  logoutBtn: {
    background: "rgba(255, 255, 255, 0.2)",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.2s",
  },
}

export default Navbar

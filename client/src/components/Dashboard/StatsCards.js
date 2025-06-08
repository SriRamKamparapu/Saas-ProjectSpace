const StatsCards = ({ deployments }) => {
  const stats = {
    total: deployments.length,
    success: deployments.filter((d) => d.status === "success").length,
    inProgress: deployments.filter((d) => d.status === "in-progress").length,
    failed: deployments.filter((d) => d.status === "failed").length,
    totalCost: deployments
      .filter((d) => d.costEstimation?.monthly)
      .reduce((sum, d) => sum + d.costEstimation.monthly, 0),
  }

  const cards = [
    {
      title: "Total Deployments",
      value: stats.total,
      icon: "📦",
      color: "#667eea",
    },
    {
      title: "Successful",
      value: stats.success,
      icon: "✅",
      color: "#10b981",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: "🔄",
      color: "#f59e0b",
    },
    {
      title: "Failed",
      value: stats.failed,
      icon: "❌",
      color: "#ef4444",
    },
    {
      title: "Monthly Cost",
      value: `$${stats.totalCost.toFixed(2)}`,
      icon: "💰",
      color: "#8b5cf6",
    },
  ]

  return (
    <div style={styles.grid}>
      {cards.map((card, index) => (
        <div key={index} className="card" style={styles.statCard}>
          <div style={styles.cardContent}>
            <div style={styles.cardIcon}>{card.icon}</div>
            <div>
              <div style={styles.cardValue}>{card.value}</div>
              <div style={styles.cardTitle}>{card.title}</div>
            </div>
          </div>
          <div
            style={{
              ...styles.cardAccent,
              background: card.color,
            }}
          />
        </div>
      ))}
    </div>
  )
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "32px",
  },
  statCard: {
    position: "relative",
    overflow: "hidden",
  },
  cardContent: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  cardIcon: {
    fontSize: "32px",
  },
  cardValue: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1f2937",
  },
  cardTitle: {
    fontSize: "14px",
    color: "#6b7280",
    fontWeight: "500",
  },
  cardAccent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "4px",
  },
}

export default StatsCards

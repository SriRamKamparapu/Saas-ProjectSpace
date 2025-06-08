const StepIndicator = ({ steps, currentStep }) => {
  return (
    <div style={styles.container}>
      {steps.map((step, index) => (
        <div key={step.number} style={styles.stepContainer}>
          <div style={styles.stepLine}>
            <div
              style={{
                ...styles.stepCircle,
                ...(step.number <= currentStep ? styles.activeCircle : {}),
              }}
            >
              {step.number < currentStep ? "✓" : step.number}
            </div>
            {index < steps.length - 1 && (
              <div
                style={{
                  ...styles.connector,
                  ...(step.number < currentStep ? styles.activeConnector : {}),
                }}
              />
            )}
          </div>
          <div style={styles.stepInfo}>
            <div
              style={{
                ...styles.stepTitle,
                ...(step.number === currentStep ? styles.currentStepTitle : {}),
              }}
            >
              {step.title}
            </div>
            <div style={styles.stepDescription}>{step.description}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "48px",
    position: "relative",
  },
  stepContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  stepLine: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    marginBottom: "16px",
  },
  stepCircle: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#e5e7eb",
    color: "#6b7280",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "14px",
    zIndex: 2,
  },
  activeCircle: {
    background: "#667eea",
    color: "white",
  },
  connector: {
    flex: 1,
    height: "2px",
    background: "#e5e7eb",
    marginLeft: "8px",
  },
  activeConnector: {
    background: "#667eea",
  },
  stepInfo: {
    textAlign: "center",
  },
  stepTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: "4px",
  },
  currentStepTitle: {
    color: "#667eea",
  },
  stepDescription: {
    fontSize: "12px",
    color: "#9ca3af",
  },
}

export default StepIndicator

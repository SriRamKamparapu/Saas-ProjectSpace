"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import StepIndicator from "./StepIndicator"
import AwsRoleStep from "./AwsRoleStep"
import GitHubStep from "./GitHubStep"
import ReviewStep from "./ReviewStep"

const DeploymentWizard = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [deploymentData, setDeploymentData] = useState({
    appName: "",
    githubUrl: "",
    githubToken: "",
    roleArn: "",
    envFileContent: "",
    region: "us-east-1",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const steps = [
    { number: 1, title: "AWS Configuration", description: "Set up AWS IAM Role" },
    { number: 2, title: "GitHub Integration", description: "Connect your repository" },
    { number: 3, title: "Review & Deploy", description: "Confirm and deploy" },
  ]

  const updateDeploymentData = (data) => {
    setDeploymentData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleDeploy = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await axios.post("/api/deployments/deploy", deploymentData)
      navigate(`/deployment/${response.data.deploymentId}`)
    } catch (error) {
      console.error("Deployment error:", error)
      setError(error.response?.data?.message || "Deployment failed")
    } finally {
      setLoading(false)
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <AwsRoleStep data={deploymentData} updateData={updateDeploymentData} onNext={nextStep} />
      case 2:
        return (
          <GitHubStep data={deploymentData} updateData={updateDeploymentData} onNext={nextStep} onPrev={prevStep} />
        )
      case 3:
        return (
          <ReviewStep data={deploymentData} onDeploy={handleDeploy} onPrev={prevStep} loading={loading} error={error} />
        )
      default:
        return null
    }
  }

  return (
    <div className="container" style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>New Deployment</h1>
        <p style={styles.subtitle}>Deploy your application to AWS in 3 simple steps</p>
      </div>

      <StepIndicator steps={steps} currentStep={currentStep} />

      <div className="card" style={styles.stepCard}>
        {renderCurrentStep()}
      </div>
    </div>
  )
}

const styles = {
  container: {
    paddingTop: "32px",
    paddingBottom: "32px",
    maxWidth: "800px",
  },
  header: {
    textAlign: "center",
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
  stepCard: {
    minHeight: "500px",
  },
}

export default DeploymentWizard

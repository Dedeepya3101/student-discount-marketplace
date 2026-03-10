import { useLocation } from "react-router-dom";
import "../styles/StepProgress.css";

function StepProgress({ currentStep }) {
  const location = useLocation();

  // Determine current step based on route
  // Check success first since /payment-success contains "/payment"
  let step = currentStep;
  if (location.pathname.includes("/success")) step = 3;
  else if (location.pathname.includes("/payment")) step = 2;
  else if (location.pathname.includes("/coupon")) step = 1;

  const steps = [
    { number: 1, label: "Details" },
    { number: 2, label: "Verify" },
    { number: 3, label: "Complete" },
  ];

  return (
    <div className="step-progress-container">
      <div className="step-progress">
        {steps.map((stepItem, index) => (
          <div key={stepItem.number} className="step-wrapper">
            <div
              className={`step-circle ${
                step >= stepItem.number ? "active" : ""
              } ${step === stepItem.number ? "current" : ""}`}
            >
              {step > stepItem.number ? (
                <span className="checkmark">✓</span>
              ) : (
                <span>{stepItem.number}</span>
              )}
            </div>
            <span className="step-label">{stepItem.label}</span>

            {index < steps.length - 1 && (
              <div
                className={`step-line ${
                  step > stepItem.number ? "completed" : ""
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StepProgress;

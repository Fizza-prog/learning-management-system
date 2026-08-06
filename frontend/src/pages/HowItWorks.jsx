import "./HowItWorks.css";

const steps = [
  {
    number: "01",
    title: "Register Your School",
    description:
      "Create your school's account and set up your institution in just a few simple steps.",
  },
  {
    number: "02",
    title: "Manage Daily Operations",
    description:
      "Handle students, attendance, fees, timetables, and grades from one centralized dashboard.",
  },
  {
    number: "03",
    title: "Track Progress",
    description:
      "Monitor academic performance, attendance, and important updates with insightful reports.",
  },
];

function HowItWorks() {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="how-container">
        <h2>How It Works</h2>

        <p className="how-subtitle">
          Get your school up and running in three simple steps.
        </p>

        <div className="steps">
          {steps.map((step) => (
            <div className="step-card" key={step.number}>
              <span className="step-number">{step.number}</span>

              <h3>{step.title}</h3>

              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
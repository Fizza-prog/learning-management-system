import "./WhyChooseUs.css";
const reasons = [
  {
    title: "Multi-Tenant Architecture",
    description:
      "Each school has its own secure workspace with isolated data and independent management.",
  },
  {
    title: "Role-Based Access",
    description:
      "Provide secure access for administrators, teachers, students, and parents with role-specific permissions.",
  },
  {
    title: "Simple & Intuitive",
    description:
      "A clean interface designed to reduce administrative workload and improve productivity.",
  },
  {
    title: "Secure & Reliable",
    description:
      "Built with security and scalability in mind to support growing educational institutions.",
  },
];

function WhyChooseUs() {
  return (
    <section className="why-choose-us" id="why-us">
      <div className="why-container">
        <h2>Why Choose EduLMS?</h2>

        <p className="why-subtitle">
          Designed to simplify school management while providing a secure,
          scalable, and user-friendly experience.
        </p>

        <div className="why-grid">
          {reasons.map((reason) => (
            <div className="why-card" key={reason.title}>
              <h3>{reason.title}</h3>
              <p>{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
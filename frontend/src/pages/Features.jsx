import "./Features.css";

const features = [
  {
    title: "Student Management",
    description:
      "Manage student profiles, enrollment, and academic records efficiently.",
  },
  {
    title: "Attendance Tracking",
    description:
      "Record and monitor attendance with real-time reporting.",
  },
  {
    title: "Fee Management",
    description:
      "Handle fee collection, payment history, and financial records securely.",
  },
  {
    title: "Timetable Scheduling",
    description:
      "Create and manage class schedules with ease.",
  },
  {
    title: "Grade Management",
    description:
      "Record exam results and generate academic reports.",
  },
  {
    title: "Announcements",
    description:
      "Share important updates with students, teachers, and parents instantly.",
  },
];

function Features() {
  return (
    <section className="features" id="features">
      <div className="features-container">
        <h2>Powerful Features</h2>

        <p className="features-subtitle">
          Everything your school needs to manage daily operations from one
          centralized platform.
        </p>

        <div className="features-grid">
          {features.map((feature) => (
            <div className="feature-card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
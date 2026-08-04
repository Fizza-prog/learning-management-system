import StatsCard from "./StatsCard";
import "./StatsGrid.css";
function StatsGrid({ stats }) {
  return (
    <section className="stats-grid">
      {stats.map((item) => (
        <StatsCard
          key={item.id}
          title={item.title}
          value={item.value}
          growth={item.growth}
          icon={item.icon}
        />
      ))}
    </section>
  );
}

export default StatsGrid;
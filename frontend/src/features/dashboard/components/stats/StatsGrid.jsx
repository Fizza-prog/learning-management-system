import StatsCard from "./StatsCard";
import { statsData } from "../../config/dashboardConfig";
import "./StatsGrid.css";
function StatsGrid() {
  return (
    <section className="stats-grid">
      {statsData.map((item) => (
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
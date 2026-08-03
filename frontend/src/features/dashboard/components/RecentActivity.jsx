import "./RecentActivity.css";

function RecentActivity({ activities }) {

  return (
    <div className="recent-activity">

      <h2>Recent Activity</h2>

      <ul>
        {activities?.map((activity, index) => (
          <li key={index}>
            <p>{activity}</p>
          </li>
        ))}
      </ul>

    </div>
  );
}

export default RecentActivity;
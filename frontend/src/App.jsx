/**
 * @file App.jsx
 * @description Defines the root React component for the application.
 *
 * Responsibilities:
 * - Render the configured application routes.
 * - Mount shared application-level notifications.
 */
import AppRoutes from "./routes";
import AppToast from "./components/common/AppToast";

function App() {
  return (
    <>
      <AppRoutes />
      <AppToast />
    </>
  );
}

export default App;
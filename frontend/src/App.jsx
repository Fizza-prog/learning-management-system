import AppRoutes from "./routes";
import { AuthProvider } from "./features/auth/context/AuthContext";
import AppToast from "./components/common/AppToast";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <AppToast />
    </AuthProvider>
  );
}

export default App;
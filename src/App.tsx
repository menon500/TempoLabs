import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import RegistrationForm from "./components/RegistrationForm";
import { ThemeProvider } from "./components/ThemeProvider";
import routes from "tempo-routes";

function App() {
  // Add Tempo routes if in Tempo environment
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  return (
    <ThemeProvider>
      <Suspense fallback={<p>Loading...</p>}>
        {tempoRoutes}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;

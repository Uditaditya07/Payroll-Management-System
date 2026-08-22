import { useEffect, useState } from "react";
import "./App.css";

import {
  loginUser,
  logout,
  getSavedUser,
  isAuthenticated,
  getDashboard,
  saveToken,
  saveUser,
} from "./api";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Salary from "./pages/Salary";
import Payroll from "./pages/Payroll";
import Payslip from "./pages/Payslip";
import Reports from "./pages/Reports";

function App() {
  const [user, setUser] = useState(getSavedUser());
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState("dashboard");

  /* =========================
     LOAD DASHBOARD
  ========================= */

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboard();

      setDashboard(data);
    } catch (err) {
      console.error("Dashboard error:", err);

      const message =
        err?.message || "Unable to load dashboard";

      /*
       * If the backend says the token is invalid
       * or expired, immediately logout.
       */
      if (
        message.toLowerCase().includes("invalid token") ||
        message.toLowerCase().includes("expired token") ||
        message.toLowerCase().includes("unauthorized") ||
        message.toLowerCase().includes("401")
      ) {
        logout();

        setUser(null);
        setDashboard(null);
        setCurrentPage("dashboard");

        setError(
          "Your session has expired. Please sign in again."
        );

        return;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {
    const savedUser = getSavedUser();

    if (savedUser && isAuthenticated()) {
      setUser(savedUser);
      loadDashboard();
    }
  }, []);

  /* =========================
     LOGIN
  ========================= */

  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      setError("");

      const response = await loginUser(
        email,
        password
      );

      if (!response?.token) {
        throw new Error(
          "Login failed: authentication token was not received."
        );
      }

      /* Save JWT */
      saveToken(response.token);

      /* Save user */
      const loggedInUser = {
        id: response?.userId,
        name: response?.name,
        email: response?.email,
        role: response?.role || "ADMIN",
      };

      saveUser(loggedInUser);

      setUser(loggedInUser);
      setCurrentPage("dashboard");

      /* Load dashboard after successful login */
      try {
        const dashboardData =
          await getDashboard();

        setDashboard(dashboardData);
      } catch (dashboardError) {
        console.error(
          "Dashboard loading error:",
          dashboardError
        );

        /*
         * Login succeeded even if dashboard
         * loading failed.
         */
        setError(
          dashboardError?.message ||
          "Logged in, but dashboard could not be loaded."
        );
      }

      return true;

    } catch (err) {
      console.error("Login error:", err);

      setError(
        err?.message ||
        "Invalid email or password"
      );

      return false;

    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    logout();

    setUser(null);
    setDashboard(null);
    setCurrentPage("dashboard");
    setError("");
  };

  /* =========================
     DASHBOARD
  ========================= */

  const goToDashboard = () => {
    setCurrentPage("dashboard");
    setError("");

    loadDashboard();
  };

  /* =========================
     AUTH CHECK
  ========================= */

  /*
   * Check authentication every render.
   * This prevents the application from
   * showing dashboard after logout.
   */
  const authenticated =
    Boolean(user) && isAuthenticated();

  /* =========================
     LOGIN SCREEN
  ========================= */

  if (!authenticated) {
    return (
      <Login
        onLogin={handleLogin}
        loading={loading}
        error={error}
      />
    );
  }

  /* =========================
     EMPLOYEES
  ========================= */

  if (currentPage === "employees") {
    return (
      <Employees
        onBack={goToDashboard}
      />
    );
  }

  /* =========================
     SALARY
  ========================= */

  if (currentPage === "salary") {
    return (
      <Salary
        onBack={goToDashboard}
      />
    );
  }

  /* =========================
     PAYROLL
  ========================= */

  if (currentPage === "payroll") {
    return (
      <Payroll
        onBack={goToDashboard}
      />
    );
  }

  /* =========================
     PAYSLIP
  ========================= */

  if (currentPage === "payslip") {
    return (
      <Payslip
        onBack={goToDashboard}
      />
    );
  }

  /* =========================
     REPORTS
  ========================= */

  if (currentPage === "reports") {
    return (
      <Reports
        onBack={goToDashboard}
      />
    );
  }

  /* =========================
     DASHBOARD
  ========================= */

  return (
    <Dashboard
      user={user}
      dashboard={dashboard}
      loading={loading}
      error={error}
      onLogout={handleLogout}
      onRefresh={loadDashboard}

      onEmployees={() =>
        setCurrentPage("employees")
      }

      onSalary={() =>
        setCurrentPage("salary")
      }

      onPayroll={() =>
        setCurrentPage("payroll")
      }

      onPayslips={() =>
        setCurrentPage("payslip")
      }

      onReports={() =>
        setCurrentPage("reports")
      }
    />
  );
}

export default App;
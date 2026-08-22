import { useEffect, useState } from "react";
import { getPayrolls } from "../api";

function money(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

export default function Dashboard({
  user,
  dashboard,
  loading,
  error,
  onLogout,
  onRefresh,
  onEmployees,
  onPayroll,
  onPayslips,
  onReports,
}) {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [recentPayrolls, setRecentPayrolls] = useState([]);
  const [payrollLoading, setPayrollLoading] = useState(true);

  const grossSalary = dashboard?.totalGrossSalary ?? 0;
  const netSalary = dashboard?.totalNetSalary ?? 0;
  const deductions = dashboard?.totalDeductions ?? 0;
  const totalEmployees = dashboard?.totalEmployees ?? 0;
  const totalPayroll = dashboard?.totalPayroll ?? 0;
  const averageSalary = dashboard?.averageSalary ?? 0;

  const handleNavigation = (page) => {
    setActiveMenu(page);

    if (page === "employees" && onEmployees) {
      onEmployees();
    }

    if (page === "payroll" && onPayroll) {
      onPayroll();
    }

    if (page === "payslips" && onPayslips) {
      onPayslips();
    }

    if (page === "reports" && onReports) {
      onReports();
    }
  };

  useEffect(() => {
    const loadRecentPayrolls = async () => {
      try {
        setPayrollLoading(true);

        const data = await getPayrolls();

        const payrollList = Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
            ? data.content
            : [];

        setRecentPayrolls(payrollList.slice(0, 5));
      } catch (err) {
        console.error("Recent payroll error:", err);
        setRecentPayrolls([]);
      } finally {
        setPayrollLoading(false);
      }
    };

    loadRecentPayrolls();
  }, []);

  return (
    <div className="dashboard-layout">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="sidebar">

        <div className="sidebar-logo">

          <div className="logo">
            P
          </div>

          <div>
            <strong>PayFlow</strong>
            <span>PAYROLL</span>
          </div>

        </div>

        <div className="workspace">

          <span>WORKSPACE</span>

          <strong>
            {user?.name || "My Company"}
          </strong>

        </div>

        <nav className="sidebar-nav">

          <button
            className={`sidebar-link ${
              activeMenu === "dashboard" ? "active" : ""
            }`}
            onClick={() => setActiveMenu("dashboard")}
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className={`sidebar-link ${
              activeMenu === "employees" ? "active" : ""
            }`}
            onClick={() => handleNavigation("employees")}
          >
            <span>♙</span>
            Employees
          </button>

          <button
            className={`sidebar-link ${
              activeMenu === "payroll" ? "active" : ""
            }`}
            onClick={() => handleNavigation("payroll")}
          >
            <span>₹</span>
            Payroll
          </button>

          <button
            className={`sidebar-link ${
              activeMenu === "payslips" ? "active" : ""
            }`}
            onClick={() => handleNavigation("payslips")}
          >
            <span>▣</span>
            Payslips
          </button>

          <button
            className={`sidebar-link ${
              activeMenu === "reports" ? "active" : ""
            }`}
            onClick={() => handleNavigation("reports")}
          >
            <span>◫</span>
            Reports
          </button>

        </nav>

        <div className="sidebar-bottom">

          <button className="sidebar-link">
            <span>⚙</span>
            Settings
          </button>

          <button
            className="sidebar-link logout-link"
            onClick={onLogout}
          >
            <span>↪</span>
            Sign out
          </button>

        </div>

      </aside>


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>

            <div className="breadcrumb">
              Dashboard
            </div>

            <h1>
              Good morning,{" "}
              {user?.name?.split(" ")[0] || "there"}.
            </h1>

            <p>
              Here's what's happening with your payroll today.
            </p>

          </div>

          <div className="header-actions">

            <button
              className="refresh-button"
              onClick={onRefresh}
              disabled={loading}
              title="Refresh dashboard"
            >
              ↻
            </button>

            <div className="notification">
              🔔
              <span></span>
            </div>

            <div className="user-menu">

              <div className="avatar">
                {user?.name
                  ?.charAt(0)
                  .toUpperCase() || "U"}
              </div>

              <div>

                <strong>
                  {user?.name || "User"}
                </strong>

                <small>
                  {user?.role || "USER"}
                </small>

              </div>

              <span>
                ▾
              </span>

            </div>

          </div>

        </header>


        {/* ERROR */}

        {error && (
          <div className="dashboard-error">
            <span>!</span>
            {error}
          </div>
        )}


        {/* CURRENT PERIOD */}

        <div className="period-bar">

          <div>

            <span>
              CURRENT PERIOD
            </span>

            <strong>
              {dashboard?.currentMonth || "August-2026"}
            </strong>

          </div>

          <div className="status">

            <span></span>

            Payroll system operational

          </div>

        </div>


        {/* =========================
            STAT CARDS
        ========================= */}

        <section className="stats-grid">

          <Stat
            title="Total employees"
            value={totalEmployees}
            subtitle="Active employees"
            icon="♙"
          />

          <Stat
            title="Gross payroll"
            value={money(grossSalary)}
            subtitle="Before deductions"
            icon="↗"
          />

          <Stat
            title="Net payroll"
            value={money(netSalary)}
            subtitle="Amount payable"
            icon="₹"
          />

          <Stat
            title="Deductions"
            value={money(deductions)}
            subtitle="PF, tax & others"
            icon="−"
          />

        </section>


        {/* =========================
            PAYROLL OVERVIEW + QUICK ACTIONS
        ========================= */}

        <section className="dashboard-grid">

          {/* PAYROLL OVERVIEW */}

          <div className="dashboard-card payroll-overview">

            <div className="card-header">

              <div>

                <span className="card-label">
                  PAYROLL OVERVIEW
                </span>

                <h2>
                  Monthly payroll
                </h2>

              </div>

              <button
                className="view-button"
                onClick={() => handleNavigation("payroll")}
              >
                View details →
              </button>

            </div>

            <div className="payroll-visual">

              <div className="payroll-total">

                <span>
                  Net payroll
                </span>

                <strong>
                  {money(netSalary)}
                </strong>

                <small>
                  Average salary{" "}
                  {money(averageSalary)}
                </small>

              </div>

              <div className="donut">

                <div>

                  <strong>
                    {totalPayroll}
                  </strong>

                  <span>
                    payroll runs
                  </span>

                </div>

              </div>

            </div>

          </div>


          {/* QUICK ACTIONS */}

          <div className="dashboard-card quick-card">

            <div className="card-header">

              <div>

                <span className="card-label">
                  QUICK ACTIONS
                </span>

                <h2>
                  Manage payroll
                </h2>

              </div>

            </div>

            <div className="quick-actions">

              <button
                onClick={() => handleNavigation("employees")}
              >

                <span className="action-icon">
                  ＋
                </span>

                <div>

                  <strong>
                    Add employee
                  </strong>

                  <small>
                    Create employee record
                  </small>

                </div>

                <span>
                  →
                </span>

              </button>


              <button
                onClick={() => handleNavigation("payroll")}
              >

                <span className="action-icon">
                  ₹
                </span>

                <div>

                  <strong>
                    Run payroll
                  </strong>

                  <small>
                    Calculate monthly payroll
                  </small>

                </div>

                <span>
                  →
                </span>

              </button>


              <button
                onClick={() => handleNavigation("payslips")}
              >

                <span className="action-icon">
                  ▣
                </span>

                <div>

                  <strong>
                    Generate payslips
                  </strong>

                  <small>
                    View employee payslips
                  </small>

                </div>

                <span>
                  →
                </span>

              </button>


              <button
                onClick={() => handleNavigation("reports")}
              >

                <span className="action-icon">
                  ◫
                </span>

                <div>

                  <strong>
                    View reports
                  </strong>

                  <small>
                    Analyse payroll summary
                  </small>

                </div>

                <span>
                  →
                </span>

              </button>

            </div>

          </div>

        </section>


        {/* =========================
            RECENT PAYROLL RUNS
        ========================= */}

        <section className="dashboard-card recent-payroll-card">

          <div className="card-header">

            <div>

              <span className="card-label">
                PAYROLL ACTIVITY
              </span>

              <h2>
                Recent payroll runs
              </h2>

            </div>

            <button
              className="view-button"
              onClick={() => handleNavigation("payroll")}
            >
              View all →
            </button>

          </div>

          <div className="recent-payroll-list">

            {payrollLoading ? (

              <div className="recent-payroll-empty">
                Loading payroll records...
              </div>

            ) : recentPayrolls.length === 0 ? (

              <div className="recent-payroll-empty">

                <strong>
                  No payroll runs yet
                </strong>

                <span>
                  Process your first payroll to see it here.
                </span>

              </div>

            ) : (

              recentPayrolls.map((payroll) => (

                <div
                  className="recent-payroll-row"
                  key={payroll.id}
                >

                  <div className="recent-payroll-person">

                    <div className="recent-payroll-avatar">

                      {(payroll.employeeName ||
                        `Employee #${payroll.employeeId}`)
                        ?.charAt(0)
                        .toUpperCase()}

                    </div>

                    <div>

                      <strong>
                        {payroll.employeeName ||
                          `Employee #${payroll.employeeId}`}
                      </strong>

                      <small>
                        {payroll.month || "Current month"}
                      </small>

                    </div>

                  </div>

                  <div className="recent-payroll-amount">

                    <span>
                      Net salary
                    </span>

                    <strong>
                      {money(payroll.netSalary)}
                    </strong>

                  </div>

                  <span className="payroll-status-badge">
                    Processed
                  </span>

                </div>

              ))

            )}

          </div>

        </section>


        {/* =========================
            EMPLOYEE SUMMARY
        ========================= */}

        <section className="dashboard-card">

          <div className="card-header">

            <div>

              <span className="card-label">
                WORKFORCE
              </span>

              <h2>
                Employee management
              </h2>

            </div>

            <button
              className="view-button"
              onClick={() => handleNavigation("employees")}
            >
              Manage employees →
            </button>

          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3, minmax(0, 1fr))",
              gap: "16px",
              marginTop: "20px",
            }}
          >

            <div
              style={{
                padding: "20px",
                borderRadius: "14px",
                background: "rgba(0,0,0,0.03)",
              }}
            >

              <span
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "600",
                  opacity: 0.6,
                  marginBottom: "8px",
                }}
              >
                TOTAL EMPLOYEES
              </span>

              <strong
                style={{
                  fontSize: "28px",
                }}
              >
                {totalEmployees}
              </strong>

            </div>


            <div
              style={{
                padding: "20px",
                borderRadius: "14px",
                background: "rgba(0,0,0,0.03)",
              }}
            >

              <span
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "600",
                  opacity: 0.6,
                  marginBottom: "8px",
                }}
              >
                AVERAGE SALARY
              </span>

              <strong
                style={{
                  fontSize: "28px",
                }}
              >
                {money(averageSalary)}
              </strong>

            </div>


            <div
              style={{
                padding: "20px",
                borderRadius: "14px",
                background: "rgba(0,0,0,0.03)",
              }}
            >

              <span
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "600",
                  opacity: 0.6,
                  marginBottom: "8px",
                }}
              >
                MONTHLY GROSS
              </span>

              <strong
                style={{
                  fontSize: "28px",
                }}
              >
                {money(grossSalary)}
              </strong>

            </div>

          </div>

        </section>


        {/* =========================
            PAYROLL SUMMARY
        ========================= */}

        <section className="dashboard-card">

          <div className="card-header">

            <div>

              <span className="card-label">
                PAYROLL STATUS
              </span>

              <h2>
                Current payroll summary
              </h2>

            </div>

            <button
              className="view-button"
              onClick={() => handleNavigation("reports")}
            >
              View reports →
            </button>

          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4, minmax(0, 1fr))",
              gap: "16px",
              marginTop: "20px",
            }}
          >

            <SummaryItem
              label="Gross salary"
              value={money(grossSalary)}
            />

            <SummaryItem
              label="Deductions"
              value={money(deductions)}
            />

            <SummaryItem
              label="Net salary"
              value={money(netSalary)}
            />

            <SummaryItem
              label="Payroll runs"
              value={totalPayroll}
            />

          </div>

        </section>


        {/* =========================
            FOOTER INSIGHT
        ========================= */}

        <section className="insight-card">

          <div className="insight-icon">
            ✦
          </div>

          <div>

            <strong>
              Payroll snapshot
            </strong>

            <p>

              You currently have{" "}

              <b>
                {totalEmployees} employees
              </b>{" "}

              and{" "}

              <b>
                {totalPayroll} payroll run(s)
              </b>{" "}

              recorded for this period.

            </p>

          </div>

        </section>

      </main>

    </div>
  );
}


/* =========================
   STAT COMPONENT
========================= */

function Stat({
  title,
  value,
  subtitle,
  icon,
}) {
  return (
    <article className="stat-card">

      <div className="stat-top">

        <span className="stat-title">
          {title}
        </span>

        <span className="stat-icon">
          {icon}
        </span>

      </div>

      <strong className="stat-value">
        {value}
      </strong>

      <span className="stat-subtitle">
        {subtitle}
      </span>

    </article>
  );
}


/* =========================
   SUMMARY COMPONENT
========================= */

function SummaryItem({
  label,
  value,
}) {
  return (
    <div
      style={{
        padding: "18px",
        borderRadius: "12px",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >

      <span
        style={{
          display: "block",
          fontSize: "11px",
          fontWeight: "700",
          letterSpacing: "0.06em",
          opacity: 0.55,
          marginBottom: "8px",
        }}
      >
        {label}
      </span>

      <strong
        style={{
          fontSize: "20px",
        }}
      >
        {value}
      </strong>

    </div>
  );
}
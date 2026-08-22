import { useEffect, useState } from "react";
import { getPayrollReport } from "../api";

function money(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

export default function Reports({ onBack }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPayrollReport();

      setReport(data);
    } catch (err) {
      console.error("Report error:", err);
      setError(err.message || "Unable to load payroll report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  return (
    <div className="reports-page">

      {/* HEADER */}

      <div className="reports-top">

        <div>
          <button
            className="back-button"
            onClick={onBack}
          >
            ← Dashboard
          </button>

          <div className="breadcrumb">
            ANALYTICS / REPORTS
          </div>

          <h1>Payroll Reports</h1>

          <p>
            Review payroll performance and salary summaries.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={loadReport}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "↻ Refresh report"}
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="employees-error">
          <strong>!</strong>
          {error}
        </div>
      )}

      {/* LOADING */}

      {loading && !report ? (
        <div className="report-loading">
          Loading payroll report...
        </div>
      ) : report ? (

        <>
          {/* SUMMARY */}

          <section className="report-summary-grid">

            <article className="report-card">

              <div className="report-card-top">
                <span>Total employees</span>
                <span className="report-icon">♙</span>
              </div>

              <strong>
                {report.totalEmployees ?? 0}
              </strong>

              <small>
                Employees in system
              </small>

            </article>


            <article className="report-card">

              <div className="report-card-top">
                <span>Payroll records</span>
                <span className="report-icon">₹</span>
              </div>

              <strong>
                {report.totalPayrollRecords ?? 0}
              </strong>

              <small>
                Payroll runs recorded
              </small>

            </article>


            <article className="report-card">

              <div className="report-card-top">
                <span>Gross payroll</span>
                <span className="report-icon">↑</span>
              </div>

              <strong>
                {money(report.totalGrossSalary)}
              </strong>

              <small>
                Total earnings
              </small>

            </article>


            <article className="report-card">

              <div className="report-card-top">
                <span>Net payroll</span>
                <span className="report-icon">✓</span>
              </div>

              <strong>
                {money(report.totalNetSalary)}
              </strong>

              <small>
                Total payable salary
              </small>

            </article>

          </section>


          {/* FINANCIAL OVERVIEW */}

          <section className="report-main-card">

            <div className="report-section-header">

              <div>
                <span className="card-label">
                  FINANCIAL OVERVIEW
                </span>

                <h2>
                  Payroll summary
                </h2>

                <p>
                  Overall payroll figures for{" "}
                  <strong>
                    {report.month || "All"}
                  </strong>
                </p>
              </div>

            </div>


            <div className="report-financial-grid">

              <div className="financial-item">
                <span>
                  Gross salary
                </span>

                <strong>
                  {money(report.totalGrossSalary)}
                </strong>
              </div>


              <div className="financial-item">
                <span>
                  Total deductions
                </span>

                <strong>
                  {money(report.totalDeductions)}
                </strong>
              </div>


              <div className="financial-item">
                <span>
                  Net salary
                </span>

                <strong>
                  {money(report.totalNetSalary)}
                </strong>
              </div>


              <div className="financial-item">
                <span>
                  Average net salary
                </span>

                <strong>
                  {money(report.averageNetSalary)}
                </strong>
              </div>

            </div>

          </section>


          {/* PAYROLL BREAKDOWN */}

          <section className="report-main-card">

            <div className="report-section-header">

              <div>
                <span className="card-label">
                  PAYROLL BREAKDOWN
                </span>

                <h2>
                  Salary distribution
                </h2>
              </div>

            </div>


            <div className="breakdown-list">

              <div className="breakdown-row">

                <div>
                  <span>
                    Gross salary
                  </span>

                  <small>
                    Total employee earnings
                  </small>
                </div>

                <strong>
                  {money(report.totalGrossSalary)}
                </strong>

              </div>


              <div className="breakdown-row">

                <div>
                  <span>
                    Deductions
                  </span>

                  <small>
                    PF, tax and other deductions
                  </small>
                </div>

                <strong>
                  {money(report.totalDeductions)}
                </strong>

              </div>


              <div className="breakdown-row highlight">

                <div>
                  <span>
                    Net payroll
                  </span>

                  <small>
                    Amount payable to employees
                  </small>
                </div>

                <strong>
                  {money(report.totalNetSalary)}
                </strong>

              </div>

            </div>

          </section>


          {/* REPORT FOOTER */}

          <section className="report-footer-card">

            <div>

              <span className="card-label">
                REPORT PERIOD
              </span>

              <h3>
                {report.month || "All payroll"}
              </h3>

              <p>
                This report contains{" "}
                <strong>
                  {report.totalPayrollRecords ?? 0}
                </strong>{" "}
                payroll record(s).
              </p>

            </div>

            <div className="report-status">
              <span></span>
              Report data loaded
            </div>

          </section>

        </>

      ) : (

        <div className="report-empty">
          No payroll report data available.
        </div>

      )}

    </div>
  );
}

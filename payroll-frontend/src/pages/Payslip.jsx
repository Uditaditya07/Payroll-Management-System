import { useState } from "react";
import { getPayslip } from "../api";

function money(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

export default function Payslip({ onBack }) {
  const [payrollId, setPayrollId] = useState("");
  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!payrollId) {
      setError("Please enter a payroll ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setPayslip(null);

      const data = await getPayslip(payrollId);

      if (!data) {
        throw new Error("Payslip not found.");
      }

      setPayslip(data);
    } catch (err) {
      setError(err.message || "Unable to load payslip.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payslip-page">

      {/* HEADER */}

      <div className="payslip-top">

        <div>
          <button
            className="back-button"
            onClick={onBack}
          >
            ← Dashboard
          </button>

          <div className="breadcrumb">
            PAYROLL / PAYSLIPS
          </div>

          <h1>Payslips</h1>

          <p>
            View professional employee payslips.
          </p>
        </div>

      </div>

      {/* SEARCH */}

      <section className="payslip-search-card">

        <div>
          <span className="card-label">
            FIND PAYSLIP
          </span>

          <h2>
            Enter payroll ID
          </h2>

          <p>
            Enter the payroll run ID to generate
            the employee payslip.
          </p>
        </div>

        <form
          className="payslip-search-form"
          onSubmit={handleSearch}
        >

          <input
            type="number"
            min="1"
            placeholder="Payroll ID"
            value={payrollId}
            onChange={(e) =>
              setPayrollId(e.target.value)
            }
          />

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : "View payslip"}
          </button>

        </form>

      </section>

      {/* ERROR */}

      {error && (
        <div className="employees-error">
          <strong>!</strong>
          {error}
        </div>
      )}

      {/* PAYSLIP */}

      {payslip && (
        <section className="payslip-document">

          {/* PAYSLIP HEADER */}

          <div className="payslip-header">

            <div>
              <div className="payslip-brand">
                <div className="payslip-logo">
                  P
                </div>

                <div>
                  <strong>
                    PayFlow
                  </strong>

                  <span>
                    PAYROLL
                  </span>
                </div>
              </div>

              <h2>
                Salary Payslip
              </h2>

              <p>
                Professional payroll statement
              </p>
            </div>

            <div className="payslip-period">

              <span>
                PAY PERIOD
              </span>

              <strong>
                {payslip.month || "—"}
              </strong>

            </div>

          </div>

          {/* EMPLOYEE DETAILS */}

          <div className="payslip-section">

            <span className="section-label">
              EMPLOYEE DETAILS
            </span>

            <div className="employee-details-grid">

              <div>
                <small>
                  Employee
                </small>

                <strong>
                  {payslip.employee?.name || "—"}
                </strong>
              </div>

              <div>
                <small>
                  Employee ID
                </small>

                <strong>
                  #{payslip.employee?.id || "—"}
                </strong>
              </div>

              <div>
                <small>
                  Department
                </small>

                <strong>
                  {payslip.employee?.department || "—"}
                </strong>
              </div>

              <div>
                <small>
                  Email
                </small>

                <strong>
                  {payslip.employee?.email || "—"}
                </strong>
              </div>

            </div>

          </div>

          {/* EARNINGS */}

          <div className="payslip-section">

            <div className="payslip-section-title">
              <div>
                <span className="section-label">
                  EARNINGS
                </span>

                <h3>
                  Salary components
                </h3>
              </div>

              <strong className="section-total">
                {money(
                  payslip.earnings?.grossSalary
                )}
              </strong>
            </div>

            <div className="payslip-table">

              <div className="payslip-row">
                <span>
                  Basic salary
                </span>

                <strong>
                  {money(
                    payslip.earnings?.basicSalary
                  )}
                </strong>
              </div>

              <div className="payslip-row">
                <span>
                  HRA
                </span>

                <strong>
                  {money(
                    payslip.earnings?.hra
                  )}
                </strong>
              </div>

              <div className="payslip-row">
                <span>
                  Allowances
                </span>

                <strong>
                  {money(
                    payslip.earnings?.allowances
                  )}
                </strong>
              </div>

              <div className="payslip-row">
                <span>
                  Bonus
                </span>

                <strong>
                  {money(
                    payslip.earnings?.bonus
                  )}
                </strong>
              </div>

              <div className="payslip-row total-row">
                <span>
                  Gross salary
                </span>

                <strong>
                  {money(
                    payslip.earnings?.grossSalary
                  )}
                </strong>
              </div>

            </div>

          </div>

          {/* DEDUCTIONS */}

          <div className="payslip-section">

            <div className="payslip-section-title">
              <div>
                <span className="section-label">
                  DEDUCTIONS
                </span>

                <h3>
                  Payroll deductions
                </h3>
              </div>

              <strong className="section-total">
                {money(
                  payslip.deductions?.totalDeductions
                )}
              </strong>
            </div>

            <div className="payslip-table">

              <div className="payslip-row">
                <span>
                  PF
                </span>

                <strong>
                  {money(
                    payslip.deductions?.pf
                  )}
                </strong>
              </div>

              <div className="payslip-row">
                <span>
                  Tax
                </span>

                <strong>
                  {money(
                    payslip.deductions?.tax
                  )}
                </strong>
              </div>

              <div className="payslip-row">
                <span>
                  Other deductions
                </span>

                <strong>
                  {money(
                    payslip.deductions
                      ?.otherDeductions
                  )}
                </strong>
              </div>

              <div className="payslip-row total-row">
                <span>
                  Total deductions
                </span>

                <strong>
                  {money(
                    payslip.deductions
                      ?.totalDeductions
                  )}
                </strong>
              </div>

            </div>

          </div>

          {/* NET SALARY */}

          <div className="net-salary-card">

            <div>
              <span>
                NET SALARY
              </span>

              <small>
                Amount payable to employee
              </small>
            </div>

            <strong>
              {money(payslip.netSalary)}
            </strong>

          </div>

          {/* FOOTER */}

          <div className="payslip-footer">

            <span>
              PayFlow Payroll Management System
            </span>

            <span>
              Payroll ID: #{payrollId}
            </span>

          </div>

        </section>
      )}

    </div>
  );
}

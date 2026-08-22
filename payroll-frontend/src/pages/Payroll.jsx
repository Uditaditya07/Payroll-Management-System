import { useEffect, useState } from "react";

import {
  getEmployees,
  getSalaries,
  calculatePayroll,
  getPayrolls,
  deletePayroll,
} from "../api";

function money(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

export default function Payroll({ onBack }) {
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [payrolls, setPayrolls] = useState([]);

  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [employeeId, setEmployeeId] = useState("");
  const [month, setMonth] = useState("");

  const [selectedPayroll, setSelectedPayroll] = useState(null);

  /* =========================
     LOAD DATA
  ========================= */

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        employeeData,
        salaryData,
        payrollData,
      ] = await Promise.all([
        getEmployees(),
        getSalaries(),
        getPayrolls(),
      ]);

      setEmployees(
        Array.isArray(employeeData)
          ? employeeData
          : []
      );

      setSalaries(
        Array.isArray(salaryData)
          ? salaryData
          : []
      );

      setPayrolls(
        Array.isArray(payrollData)
          ? payrollData
          : []
      );
    } catch (err) {
      console.error(
        "Payroll loading error:",
        err
      );

      setError(
        err.message ||
          "Failed to load payroll data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* =========================
     EMPLOYEE HELPERS
  ========================= */

  const getEmployeeName = (id) => {
    const employee = employees.find(
      (item) =>
        Number(item.id) === Number(id)
    );

    return (
      employee?.name ||
      "Unknown employee"
    );
  };

  const getEmployeeDepartment = (id) => {
    const employee = employees.find(
      (item) =>
        Number(item.id) === Number(id)
    );

    return employee?.department || "";
  };

  const getEmployeeSalary = (id) => {
    const salary = salaries.find(
      (item) =>
        Number(item.employee?.id) ===
        Number(id)
    );

    return salary;
  };

  /* =========================
     SELECT EMPLOYEE
  ========================= */

  const handleEmployeeChange = (e) => {
    const value = e.target.value;

    setEmployeeId(value);
    setSelectedPayroll(null);
    setError("");
    setSuccess("");
  };

  /* =========================
     CALCULATE PAYROLL
  ========================= */

  const handleCalculate = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setSelectedPayroll(null);

    if (!employeeId) {
      setError(
        "Please select an employee."
      );
      return;
    }

    if (!month) {
      setError(
        "Please select a payroll month."
      );
      return;
    }

    const salary = getEmployeeSalary(
      employeeId
    );

    if (!salary) {
      setError(
        "This employee does not have a salary structure. Please create salary details first."
      );
      return;
    }

    try {
      setCalculating(true);

      const payroll =
        await calculatePayroll(
          Number(employeeId),
          month
        );

      if (!payroll) {
        throw new Error(
          "Payroll could not be calculated. Please make sure the employee has a salary structure."
        );
      }

      setSelectedPayroll(payroll);

      setSuccess(
        "Payroll calculated successfully."
      );

      await loadData();
    } catch (err) {
      console.error(
        "Payroll calculation error:",
        err
      );

      setError(
        err.message ||
          "Failed to calculate payroll."
      );
    } finally {
      setCalculating(false);
    }
  };

  /* =========================
     DELETE PAYROLL
  ========================= */

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this payroll record?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deletePayroll(id);

      if (
        selectedPayroll?.id === id
      ) {
        setSelectedPayroll(null);
      }

      setSuccess(
        "Payroll record deleted successfully."
      );

      await loadData();
    } catch (err) {
      console.error(
        "Payroll delete error:",
        err
      );

      setError(
        err.message ||
          "Failed to delete payroll."
      );
    }
  };

  /* =========================
     VIEW PAYROLL
  ========================= */

  const handleView = (payroll) => {
    setSelectedPayroll(payroll);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================
     CURRENT SALARY PREVIEW
  ========================= */

  const selectedSalary =
    employeeId
      ? getEmployeeSalary(employeeId)
      : null;

  /* =========================
     UI
  ========================= */

  return (
    <div className="employees-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="employees-top">

        <div>

          <button
            className="back-button"
            onClick={onBack}
          >
            ← Dashboard
          </button>

          <div className="breadcrumb">
            PAYROLL / PROCESSING
          </div>

          <h1>
            Payroll
          </h1>

          <p>
            Calculate and manage employee
            payroll for each month.
          </p>

        </div>

        <div className="employee-count">

          <strong>
            {payrolls.length}
          </strong>

          <span>
            Payroll records
          </span>

        </div>

      </div>


      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="employees-error">

          <strong>
            !
          </strong>

          <span>
            {error}
          </span>

        </div>
      )}


      {/* =========================
          SUCCESS
      ========================= */}

      {success && (
        <div
          style={{
            marginBottom: "20px",
            padding: "14px 18px",
            borderRadius: "12px",
            background:
              "rgba(34, 197, 94, 0.10)",
            border:
              "1px solid rgba(34, 197, 94, 0.25)",
            color: "#15803d",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          ✓ {success}
        </div>
      )}


      {/* =========================
          CALCULATE PAYROLL
      ========================= */}

      <section className="employee-form-card">

        <div className="form-heading">

          <div>

            <span>
              PAYROLL PROCESSING
            </span>

            <h2>
              Calculate employee payroll
            </h2>

          </div>

        </div>


        <form
          onSubmit={handleCalculate}
        >

          <div className="form-grid">

            {/* EMPLOYEE */}

            <label>

              <span>
                Employee
              </span>

              <select
                value={employeeId}
                onChange={
                  handleEmployeeChange
                }
                required
              >

                <option value="">
                  Select employee
                </option>

                {employees.map(
                  (employee) => (
                    <option
                      key={employee.id}
                      value={employee.id}
                    >
                      {employee.name}
                      {employee.department
                        ? ` — ${employee.department}`
                        : ""}
                    </option>
                  )
                )}

              </select>

            </label>


            {/* MONTH */}

            <label>

              <span>
                Payroll month
              </span>

              <input
                type="month"
                value={month}
                onChange={(e) =>
                  setMonth(
                    e.target.value
                  )
                }
                required
              />

            </label>

          </div>


          {/* =========================
              SALARY PREVIEW
          ========================= */}

          {selectedSalary && (
            <div
              style={{
                marginTop: "24px",
                padding: "20px",
                borderRadius: "16px",
                background:
                  "rgba(0,0,0,0.035)",
                border:
                  "1px solid rgba(0,0,0,0.06)",
              }}
            >

              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "0.08em",
                  opacity: 0.6,
                  marginBottom: "14px",
                }}
              >
                SALARY STRUCTURE
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(4, minmax(0, 1fr))",
                  gap: "14px",
                }}
              >

                <SalaryPreview
                  label="Basic"
                  value={
                    selectedSalary.basicSalary
                  }
                />

                <SalaryPreview
                  label="HRA"
                  value={
                    selectedSalary.hra
                  }
                />

                <SalaryPreview
                  label="Allowances"
                  value={
                    selectedSalary.allowances
                  }
                />

                <SalaryPreview
                  label="Bonus"
                  value={
                    selectedSalary.bonus
                  }
                />

              </div>

            </div>
          )}


          <button
            className="primary-button"
            type="submit"
            disabled={calculating}
            style={{
              marginTop: "24px",
            }}
          >

            {calculating
              ? "Calculating..."
              : "Calculate Payroll →"}

          </button>

        </form>

      </section>


      {/* =========================
          GENERATED PAYROLL
      ========================= */}

      {selectedPayroll && (
        <section
          className="employee-form-card"
          style={{
            marginTop: "24px",
          }}
        >

          <div className="form-heading">

            <div>

              <span>
                PAYROLL RESULT
              </span>

              <h2>
                {getEmployeeName(
                  selectedPayroll.employeeId
                )}
              </h2>

              <p
                style={{
                  marginTop: "6px",
                  opacity: 0.65,
                }}
              >
                {selectedPayroll.month}
              </p>

            </div>

            <div
              style={{
                textAlign: "right",
              }}
            >

              <small
                style={{
                  display: "block",
                  opacity: 0.6,
                  marginBottom: "4px",
                }}
              >
                NET SALARY
              </small>

              <strong
                style={{
                  fontSize: "28px",
                }}
              >
                {money(
                  selectedPayroll.netSalary
                )}
              </strong>

            </div>

          </div>


          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4, minmax(0, 1fr))",
              gap: "14px",
              marginTop: "24px",
            }}
          >

            <PayrollSummary
              label="Basic salary"
              value={
                selectedPayroll.basicSalary
              }
            />

            <PayrollSummary
              label="HRA"
              value={
                selectedPayroll.hra
              }
            />

            <PayrollSummary
              label="Allowances"
              value={
                selectedPayroll.allowances
              }
            />

            <PayrollSummary
              label="Bonus"
              value={
                selectedPayroll.bonus
              }
            />

          </div>


          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4, minmax(0, 1fr))",
              gap: "14px",
              marginTop: "14px",
            }}
          >

            <PayrollSummary
              label="Gross salary"
              value={
                selectedPayroll.grossSalary
              }
            />

            <PayrollSummary
              label="PF"
              value={
                selectedPayroll.pf
              }
            />

            <PayrollSummary
              label="Tax"
              value={
                selectedPayroll.tax
              }
            />

            <PayrollSummary
              label="Other deductions"
              value={
                selectedPayroll.otherDeductions
              }
            />

          </div>


          <div
            style={{
              marginTop: "14px",
              padding: "20px",
              borderRadius: "14px",
              background:
                "rgba(0,0,0,0.035)",
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
            }}
          >

            <div>

              <small
                style={{
                  display: "block",
                  opacity: 0.6,
                  marginBottom: "5px",
                }}
              >
                TOTAL DEDUCTIONS
              </small>

              <strong
                style={{
                  fontSize: "22px",
                }}
              >
                {money(
                  selectedPayroll.totalDeductions
                )}
              </strong>

            </div>


            <div
              style={{
                textAlign: "right",
              }}
            >

              <small
                style={{
                  display: "block",
                  opacity: 0.6,
                  marginBottom: "5px",
                }}
              >
                NET SALARY
              </small>

              <strong
                style={{
                  fontSize: "26px",
                }}
              >
                {money(
                  selectedPayroll.netSalary
                )}
              </strong>

            </div>

          </div>

        </section>
      )}


      {/* =========================
          PAYROLL DIRECTORY
      ========================= */}

      <section className="employee-list-card">

        <div className="list-header">

          <div>

            <span>
              PAYROLL DIRECTORY
            </span>

            <h2>
              Generated payroll
            </h2>

          </div>

        </div>


        {loading ? (

          <div className="empty-state">
            Loading payroll records...
          </div>

        ) : payrolls.length === 0 ? (

          <div className="empty-state">

            <div>
              ₹
            </div>

            <strong>
              No payroll records found
            </strong>

            <p>
              Select an employee and
              calculate payroll above.
            </p>

          </div>

        ) : (

          <div className="employee-table-wrapper">

            <table className="employee-table">

              <thead>

                <tr>

                  <th>
                    EMPLOYEE
                  </th>

                  <th>
                    MONTH
                  </th>

                  <th>
                    GROSS
                  </th>

                  <th>
                    DEDUCTIONS
                  </th>

                  <th>
                    NET SALARY
                  </th>

                  <th>
                    ACTION
                  </th>

                </tr>

              </thead>


              <tbody>

                {payrolls.map(
                  (payroll) => (

                    <tr
                      key={payroll.id}
                    >

                      <td>

                        <div className="employee-person">

                          <div className="employee-avatar">
                            {getEmployeeName(
                              payroll.employeeId
                            )
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>

                            <strong>
                              {getEmployeeName(
                                payroll.employeeId
                              )}
                            </strong>

                            <small>
                              {getEmployeeDepartment(
                                payroll.employeeId
                              )}
                            </small>

                          </div>

                        </div>

                      </td>


                      <td>
                        {payroll.month}
                      </td>


                      <td>

                        <strong>
                          {money(
                            payroll.grossSalary
                          )}
                        </strong>

                      </td>


                      <td>
                        {money(
                          payroll.totalDeductions
                        )}
                      </td>


                      <td>

                        <strong>
                          {money(
                            payroll.netSalary
                          )}
                        </strong>

                      </td>


                      <td>

                        <div className="row-actions">

                          <button
                            onClick={() =>
                              handleView(
                                payroll
                              )
                            }
                          >
                            View
                          </button>

                          <button
                            className="delete-action"
                            onClick={() =>
                              handleDelete(
                                payroll.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
}


/* =========================
   SALARY PREVIEW
========================= */

function SalaryPreview({
  label,
  value,
}) {
  return (
    <div>

      <small
        style={{
          display: "block",
          fontSize: "12px",
          opacity: 0.6,
          marginBottom: "6px",
        }}
      >
        {label}
      </small>

      <strong
        style={{
          fontSize: "17px",
        }}
      >
        {money(value)}
      </strong>

    </div>
  );
}


/* =========================
   PAYROLL SUMMARY
========================= */

function PayrollSummary({
  label,
  value,
}) {
  return (
    <div
      style={{
        padding: "16px",
        borderRadius: "12px",
        background:
          "rgba(0,0,0,0.035)",
      }}
    >

      <small
        style={{
          display: "block",
          opacity: 0.6,
          marginBottom: "7px",
        }}
      >
        {label}
      </small>

      <strong
        style={{
          fontSize: "19px",
        }}
      >
        {money(value)}
      </strong>

    </div>
  );
}
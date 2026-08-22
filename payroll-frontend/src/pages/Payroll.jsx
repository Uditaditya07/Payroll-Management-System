import { useEffect, useState } from "react";
import {
  getEmployees,
  getSalaries,
  createSalary,
  updateSalary,
  deleteSalary,
} from "../api";

function money(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

export default function Payroll({ onBack }) {
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    employeeId: "",
    basicSalary: "",
    hra: "",
    allowances: "",
    bonus: "",
    pf: "",
    tax: "",
    otherDeductions: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [employeeData, salaryData] = await Promise.all([
        getEmployees(),
        getSalaries(),
      ]);

      setEmployees(
        Array.isArray(employeeData) ? employeeData : []
      );

      setSalaries(
        Array.isArray(salaryData) ? salaryData : []
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load payroll data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      employeeId: "",
      basicSalary: "",
      hra: "",
      allowances: "",
      bonus: "",
      pf: "",
      tax: "",
      otherDeductions: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const salaryData = {
        employeeId: Number(form.employeeId),
        basicSalary: Number(form.basicSalary || 0),
        hra: Number(form.hra || 0),
        allowances: Number(form.allowances || 0),
        bonus: Number(form.bonus || 0),
        pf: Number(form.pf || 0),
        tax: Number(form.tax || 0),
        otherDeductions: Number(
          form.otherDeductions || 0
        ),
      };

      if (editingId) {
        await updateSalary(editingId, salaryData);
      } else {
        await createSalary(salaryData);
      }

      resetForm();
      await loadData();
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Failed to save salary details"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (salary) => {
    setEditingId(salary.id);

    setForm({
      employeeId: salary.employee?.id || "",
      basicSalary: salary.basicSalary ?? "",
      hra: salary.hra ?? "",
      allowances: salary.allowances ?? "",
      bonus: salary.bonus ?? "",
      pf: salary.pf ?? "",
      tax: salary.tax ?? "",
      otherDeductions:
        salary.otherDeductions ?? "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this salary record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteSalary(id);
      await loadData();
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Failed to delete salary record"
      );
    }
  };

  const calculateGross = () => {
    return (
      Number(form.basicSalary || 0) +
      Number(form.hra || 0) +
      Number(form.allowances || 0) +
      Number(form.bonus || 0)
    );
  };

  const calculateDeductions = () => {
    return (
      Number(form.pf || 0) +
      Number(form.tax || 0) +
      Number(form.otherDeductions || 0)
    );
  };

  const calculateNet = () => {
    return calculateGross() - calculateDeductions();
  };

  const getEmployeeName = (salary) => {
    return (
      salary?.employee?.name ||
      employees.find(
        (employee) =>
          employee.id === salary?.employee?.id
      )?.name ||
      "Unknown employee"
    );
  };

  return (
    <div className="employees-page">

      {/* HEADER */}

      <div className="employees-top">

        <div>

          <button
            className="back-button"
            onClick={onBack}
          >
            ← Dashboard
          </button>

          <div className="breadcrumb">
            PAYROLL / SALARY
          </div>

          <h1>
            Payroll
          </h1>

          <p>
            Manage employee salary structures and
            deductions.
          </p>

        </div>

        <div className="employee-count">

          <strong>
            {salaries.length}
          </strong>

          <span>
            Salary records
          </span>

        </div>

      </div>


      {/* ERROR */}

      {error && (
        <div className="employees-error">
          <strong>!</strong>
          {error}
        </div>
      )}


      {/* SALARY FORM */}

      <section className="employee-form-card">

        <div className="form-heading">

          <div>

            <span>
              {editingId
                ? "EDIT SALARY"
                : "NEW SALARY"}
            </span>

            <h2>
              {editingId
                ? "Update salary"
                : "Create salary structure"}
            </h2>

          </div>

          {editingId && (
            <button
              className="cancel-button"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}

        </div>


        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* EMPLOYEE */}

            <label>

              <span>
                Employee
              </span>

              <select
                name="employeeId"
                value={form.employeeId}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select employee
                </option>

                {employees.map((employee) => (
                  <option
                    key={employee.id}
                    value={employee.id}
                  >
                    {employee.name} —{" "}
                    {employee.department}
                  </option>
                ))}

              </select>

            </label>


            {/* BASIC */}

            <label>

              <span>
                Basic salary
              </span>

              <input
                type="number"
                name="basicSalary"
                value={form.basicSalary}
                onChange={handleChange}
                placeholder="50000"
                min="0"
                required
              />

            </label>


            {/* HRA */}

            <label>

              <span>
                HRA
              </span>

              <input
                type="number"
                name="hra"
                value={form.hra}
                onChange={handleChange}
                placeholder="10000"
                min="0"
              />

            </label>


            {/* ALLOWANCES */}

            <label>

              <span>
                Allowances
              </span>

              <input
                type="number"
                name="allowances"
                value={form.allowances}
                onChange={handleChange}
                placeholder="5000"
                min="0"
              />

            </label>


            {/* BONUS */}

            <label>

              <span>
                Bonus
              </span>

              <input
                type="number"
                name="bonus"
                value={form.bonus}
                onChange={handleChange}
                placeholder="2000"
                min="0"
              />

            </label>


            {/* PF */}

            <label>

              <span>
                PF deduction
              </span>

              <input
                type="number"
                name="pf"
                value={form.pf}
                onChange={handleChange}
                placeholder="3000"
                min="0"
              />

            </label>


            {/* TAX */}

            <label>

              <span>
                Tax
              </span>

              <input
                type="number"
                name="tax"
                value={form.tax}
                onChange={handleChange}
                placeholder="2000"
                min="0"
              />

            </label>


            {/* OTHER */}

            <label>

              <span>
                Other deductions
              </span>

              <input
                type="number"
                name="otherDeductions"
                value={form.otherDeductions}
                onChange={handleChange}
                placeholder="500"
                min="0"
              />

            </label>

          </div>


          {/* CALCULATION PREVIEW */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3, 1fr)",
              gap: "12px",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >

            <div
              style={{
                padding: "15px",
                borderRadius: "10px",
                background: "rgba(0,0,0,0.04)",
              }}
            >

              <small>
                Gross salary
              </small>

              <strong
                style={{
                  display: "block",
                  fontSize: "20px",
                  marginTop: "5px",
                }}
              >
                {money(calculateGross())}
              </strong>

            </div>


            <div
              style={{
                padding: "15px",
                borderRadius: "10px",
                background: "rgba(0,0,0,0.04)",
              }}
            >

              <small>
                Total deductions
              </small>

              <strong
                style={{
                  display: "block",
                  fontSize: "20px",
                  marginTop: "5px",
                }}
              >
                {money(calculateDeductions())}
              </strong>

            </div>


            <div
              style={{
                padding: "15px",
                borderRadius: "10px",
                background: "rgba(0,0,0,0.04)",
              }}
            >

              <small>
                Net salary
              </small>

              <strong
                style={{
                  display: "block",
                  fontSize: "20px",
                  marginTop: "5px",
                }}
              >
                {money(calculateNet())}
              </strong>

            </div>

          </div>


          <button
            className="primary-button"
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Save changes"
                : "＋ Create salary"}

          </button>

        </form>

      </section>


      {/* SALARY LIST */}

      <section className="employee-list-card">

        <div className="list-header">

          <div>

            <span>
              SALARY DIRECTORY
            </span>

            <h2>
              Employee salaries
            </h2>

          </div>

        </div>


        {loading ? (

          <div className="empty-state">
            Loading salary records...
          </div>

        ) : salaries.length === 0 ? (

          <div className="empty-state">

            <div>
              ₹
            </div>

            <strong>
              No salary records found
            </strong>

            <p>
              Create a salary structure for an
              employee above.
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
                    BASIC
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

                {salaries.map((salary) => (

                  <tr key={salary.id}>

                    <td>

                      <div className="employee-person">

                        <div className="employee-avatar">
                          {getEmployeeName(salary)
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>

                          <strong>
                            {getEmployeeName(salary)}
                          </strong>

                          <small>
                            Salary ID #{salary.id}
                          </small>

                        </div>

                      </div>

                    </td>


                    <td>
                      {money(salary.basicSalary)}
                    </td>


                    <td>

                      <strong>
                        {money(
                          salary.grossSalary
                        )}
                      </strong>

                    </td>


                    <td>
                      {money(
                        salary.totalDeductions
                      )}
                    </td>


                    <td>

                      <strong>
                        {money(
                          salary.netSalary
                        )}
                      </strong>

                    </td>


                    <td>

                      <div className="row-actions">

                        <button
                          onClick={() =>
                            handleEdit(salary)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-action"
                          onClick={() =>
                            handleDelete(
                              salary.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
}
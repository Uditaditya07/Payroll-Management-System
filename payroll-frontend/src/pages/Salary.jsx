import { useEffect, useState } from "react";
import {
  getEmployees,
  getSalaries,
  createSalary,
  updateSalary,
  deleteSalary,
} from "../api";

export default function Salary({ onBack }) {
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

  const money = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;

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
      setError(err.message || "Failed to load salary data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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
        err.message || "Failed to save salary"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (salary) => {
    setEditingId(salary.id);

    setForm({
      employeeId:
        salary.employee?.id?.toString() || "",
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

    if (!confirmed) return;

    try {
      setError("");

      await deleteSalary(id);
      await loadData();
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Failed to delete salary"
      );
    }
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(
      (item) => item.id === employeeId
    );

    return employee?.name || "Unknown employee";
  };

  return (
    <div className="employees-page">

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

          <h1>Salary Management</h1>

          <p>
            Configure employee salary and deductions.
          </p>
        </div>

        <div className="employee-count">
          <strong>{salaries.length}</strong>
          <span>Salary records</span>
        </div>

      </div>

      {error && (
        <div className="employees-error">
          <strong>!</strong>
          {error}
        </div>
      )}

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
                : "Add salary"}
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

            <label>
              <span>Employee</span>

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

            <label>
              <span>Basic salary</span>

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

            <label>
              <span>HRA</span>

              <input
                type="number"
                name="hra"
                value={form.hra}
                onChange={handleChange}
                placeholder="10000"
                min="0"
              />
            </label>

            <label>
              <span>Allowances</span>

              <input
                type="number"
                name="allowances"
                value={form.allowances}
                onChange={handleChange}
                placeholder="5000"
                min="0"
              />
            </label>

            <label>
              <span>Bonus</span>

              <input
                type="number"
                name="bonus"
                value={form.bonus}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
            </label>

            <label>
              <span>PF deduction</span>

              <input
                type="number"
                name="pf"
                value={form.pf}
                onChange={handleChange}
                placeholder="3000"
                min="0"
              />
            </label>

            <label>
              <span>Tax deduction</span>

              <input
                type="number"
                name="tax"
                value={form.tax}
                onChange={handleChange}
                placeholder="2000"
                min="0"
              />
            </label>

            <label>
              <span>Other deductions</span>

              <input
                type="number"
                name="otherDeductions"
                value={form.otherDeductions}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
            </label>

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
                : "＋ Add salary"}
          </button>

        </form>

      </section>

      <section className="employee-list-card">

        <div className="list-header">

          <div>
            <span>SALARY DIRECTORY</span>
            <h2>All salary records</h2>
          </div>

        </div>

        {loading ? (
          <div className="empty-state">
            Loading salary records...
          </div>
        ) : salaries.length === 0 ? (
          <div className="empty-state">
            <div>₹</div>

            <strong>
              No salary records found
            </strong>

            <p>
              Add salary information for an employee.
            </p>
          </div>
        ) : (
          <div className="employee-table-wrapper">

            <table className="employee-table">

              <thead>
                <tr>
                  <th>EMPLOYEE</th>
                  <th>BASIC</th>
                  <th>GROSS</th>
                  <th>DEDUCTIONS</th>
                  <th>NET SALARY</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>

                {salaries.map((salary) => (

                  <tr key={salary.id}>

                    <td>
                      <div className="employee-person">

                        <div className="employee-avatar">
                          {salary.employee?.name
                            ?.charAt(0)
                            .toUpperCase() || "?"}
                        </div>

                        <div>
                          <strong>
                            {salary.employee?.name ||
                              getEmployeeName(
                                salary.employee?.id
                              )}
                          </strong>

                          <small>
                            {salary.employee?.email ||
                              ""}
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
                            handleDelete(salary.id)
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

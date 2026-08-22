import { useEffect, useState } from "react";

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../api";

export default function Employees({ onBack }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    salary: "",
  });

  /* =========================
     LOAD EMPLOYEES
  ========================= */

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getEmployees();

      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Employee loading error:", err);

      setError(
        err.message || "Failed to load employees"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  /* =========================
     FORM
  ========================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      department: "",
      salary: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  /* =========================
     OPEN ADD EMPLOYEE
  ========================= */

  const openAddForm = () => {
    setForm({
      name: "",
      email: "",
      department: "",
      salary: "",
    });

    setEditingId(null);
    setError("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================
     ADD / UPDATE
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const employee = {
        name: form.name.trim(),
        email: form.email.trim(),
        department: form.department.trim(),
        salary: Number(form.salary),
      };

      if (!employee.name) {
        throw new Error("Employee name is required");
      }

      if (!employee.email) {
        throw new Error("Employee email is required");
      }

      if (!employee.department) {
        throw new Error("Department is required");
      }

      if (
        Number.isNaN(employee.salary) ||
        employee.salary < 0
      ) {
        throw new Error("Please enter a valid salary");
      }

      if (editingId) {
        await updateEmployee(
          editingId,
          employee
        );
      } else {
        await createEmployee(employee);
      }

      resetForm();

      await loadEmployees();

    } catch (err) {
      console.error("Employee save error:", err);

      setError(
        err.message || "Failed to save employee"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     EDIT
  ========================= */

  const handleEdit = (employee) => {
    setEditingId(employee.id);

    setForm({
      name: employee.name || "",
      email: employee.email || "",
      department: employee.department || "",
      salary: employee.salary ?? "",
    });

    setError("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================
     DELETE
  ========================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteEmployee(id);

      await loadEmployees();

    } catch (err) {
      console.error("Employee delete error:", err);

      setError(
        err.message || "Failed to delete employee"
      );
    }
  };

  /* =========================
     SEARCH
  ========================= */

  const filteredEmployees = employees.filter(
    (employee) => {
      const query = search
        .trim()
        .toLowerCase();

      if (!query) {
        return true;
      }

      return (
        employee.name
          ?.toLowerCase()
          .includes(query) ||
        employee.email
          ?.toLowerCase()
          .includes(query) ||
        employee.department
          ?.toLowerCase()
          .includes(query)
      );
    }
  );

  /* =========================
     MONEY
  ========================= */

  const money = (value) => {
    return `₹${Number(value || 0).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 0,
      }
    )}`;
  };

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
            WORKFORCE / EMPLOYEES
          </div>

          <h1>
            Employees
          </h1>

          <p>
            Manage your organization's employee records.
          </p>

        </div>

        <div className="employee-header-right">

          <div className="employee-count">
            <strong>
              {employees.length}
            </strong>

            <span>
              Total employees
            </span>
          </div>

          <button
            type="button"
            className="add-employee-button"
            onClick={openAddForm}
          >
            ＋ Add employee
          </button>

        </div>

      </div>


      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="employees-error">
          <strong>!</strong>
          {error}
        </div>
      )}


      {/* =========================
          ADD / EDIT FORM
      ========================= */}

      {showForm && (
        <section className="employee-form-card">

          <div className="form-heading">

            <div>

              <span>
                {editingId
                  ? "EDIT EMPLOYEE"
                  : "NEW EMPLOYEE"}
              </span>

              <h2>
                {editingId
                  ? "Update employee"
                  : "Add employee"}
              </h2>

            </div>

            <button
              type="button"
              className="cancel-button"
              onClick={resetForm}
            >
              Cancel
            </button>

          </div>


          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <label>

                <span>
                  Full name
                </span>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  required
                />

              </label>


              <label>

                <span>
                  Email address
                </span>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="employee@example.com"
                  required
                />

              </label>


              <label>

                <span>
                  Department
                </span>

                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="e.g. Engineering"
                  required
                />

              </label>


              <label>

                <span>
                  Monthly salary
                </span>

                <input
                  type="number"
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  placeholder="50000"
                  min="0"
                  required
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
                  : "＋ Add employee"}

            </button>

          </form>

        </section>
      )}


      {/* =========================
          EMPLOYEE DIRECTORY
      ========================= */}

      <section className="employee-list-card">

        <div className="list-header">

          <div>

            <span>
              DIRECTORY
            </span>

            <h2>
              All employees
            </h2>

          </div>


          <input
            className="employee-search"
            placeholder="Search employees..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        {loading ? (

          <div className="empty-state">
            Loading employees...
          </div>

        ) : filteredEmployees.length === 0 ? (

          <div className="empty-state">

            <div>
              ♙
            </div>

            <strong>
              No employees found
            </strong>

            <p>
              Add an employee or change your search.
            </p>

          </div>

        ) : (

          <div className="employee-table-wrapper">

            <table className="employee-table">

              <thead>

                <tr>
                  <th>EMPLOYEE</th>
                  <th>DEPARTMENT</th>
                  <th>SALARY</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>

              </thead>


              <tbody>

                {filteredEmployees.map(
                  (employee) => (

                    <tr key={employee.id}>

                      <td>

                        <div className="employee-person">

                          <div className="employee-avatar">

                            {employee.name
                              ?.charAt(0)
                              .toUpperCase()}

                          </div>

                          <div>

                            <strong>
                              {employee.name}
                            </strong>

                            <small>
                              {employee.email}
                            </small>

                          </div>

                        </div>

                      </td>


                      <td>

                        <span className="department-badge">
                          {employee.department}
                        </span>

                      </td>


                      <td>

                        <strong>
                          {money(employee.salary)}
                        </strong>

                      </td>


                      <td>

                        <span className="active-badge">

                          <i></i>

                          Active

                        </span>

                      </td>


                      <td>

                        <div className="row-actions">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(employee)
                            }
                            title="Edit employee"
                          >
                            Edit
                          </button>


                          <button
                            type="button"
                            className="delete-action"
                            onClick={() =>
                              handleDelete(
                                employee.id
                              )
                            }
                            title="Delete employee"
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
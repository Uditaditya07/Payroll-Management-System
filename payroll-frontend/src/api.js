const API_BASE_URL = "";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("payroll_token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data;
}

/* =========================
   AUTHENTICATION
========================= */

export async function registerUser(userData) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function loginUser(email, password) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export function saveToken(token) {
  localStorage.setItem("payroll_token", token);
}

export function getToken() {
  return localStorage.getItem("payroll_token");
}

export function removeToken() {
  localStorage.removeItem("payroll_token");
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function saveUser(user) {
  localStorage.setItem(
    "payroll_user",
    JSON.stringify(user)
  );
}

export function getSavedUser() {
  const user = localStorage.getItem("payroll_user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function logout() {
  removeToken();
  localStorage.removeItem("payroll_user");
}

/* =========================
   DASHBOARD
========================= */

export async function getDashboard() {
  return request("/api/dashboard");
}

/* =========================
   EMPLOYEES
========================= */

export async function getEmployees() {
  return request("/api/employees");
}

export async function getEmployeesPage({
  page = 0,
  size = 10,
  sortBy = "id",
  direction = "asc",
} = {}) {
  const params = new URLSearchParams({
    page,
    size,
    sortBy,
    direction,
  });

  return request(`/api/employees/page?${params.toString()}`);
}

export async function getEmployee(id) {
  return request(`/api/employees/${id}`);
}

export async function createEmployee(employee) {
  return request("/api/employees", {
    method: "POST",
    body: JSON.stringify(employee),
  });
}

export async function updateEmployee(id, employee) {
  return request(`/api/employees/${id}`, {
    method: "PUT",
    body: JSON.stringify(employee),
  });
}

export async function deleteEmployee(id) {
  return request(`/api/employees/${id}`, {
    method: "DELETE",
  });
}

/* =========================
   SALARY
========================= */

export async function createSalary(salaryData) {
  return request("/api/salaries", {
    method: "POST",
    body: JSON.stringify(salaryData),
  });
}

export async function getSalaries() {
  return request("/api/salaries");
}

export async function getSalary(id) {
  return request(`/api/salaries/${id}`);
}

export async function updateSalary(id, salaryData) {
  return request(`/api/salaries/${id}`, {
    method: "PUT",
    body: JSON.stringify(salaryData),
  });
}

export async function deleteSalary(id) {
  return request(`/api/salaries/${id}`, {
    method: "DELETE",
  });
}

/* =========================
   PAYROLL
========================= */

export async function calculatePayroll(employeeId, month) {
  const params = new URLSearchParams({
    employeeId,
    month,
  });

  return request(
    `/api/payroll/calculate?${params.toString()}`,
    {
      method: "POST",
    }
  );
}

export async function getPayrolls() {
  return request("/api/payroll");
}

export async function getPayroll(id) {
  return request(`/api/payroll/${id}`);
}

/* =========================
   PAYSLIPS
========================= */

export async function getPayslip(id) {
  return request(`/api/payslip/${id}`);
}

/* =========================
   REPORTS
========================= */

export async function getPayrollReport() {
  return request("/api/reports/payroll");
}
const API_BASE_URL = "https://turbo-space-spoon-7vrq9r9gvjvpfp75g-8080.app.github.dev";

/* =========================
   COMMON REQUEST
========================= */

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );
  } catch (error) {
    console.error("Backend connection error:", error);

    throw new Error(
      "Unable to connect to the payroll server. Please make sure the backend is running."
    );
  }

  if (response.status === 401) {
    logout();

    throw new Error(
      "Invalid token or expired token. Please login again."
    );
  }

  if (response.status === 403) {
    throw new Error(
      "Access denied. Please login again or check your account permissions."
    );
  }

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`
    );
  }

  return data;
}


/* =========================
   AUTHENTICATION
========================= */

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
  localStorage.setItem("token", token);
}

export function saveUser(user) {
  localStorage.setItem(
    "user",
    JSON.stringify(user)
  );
}

export function getSavedUser() {
  try {
    const user = localStorage.getItem("user");

    return user
      ? JSON.parse(user)
      : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  const token = localStorage.getItem("token");

  return !!token;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
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

export async function searchEmployeesByName(name) {
  return request(
    `/api/employees/search/name?name=${encodeURIComponent(name)}`
  );
}

export async function searchEmployeesByDepartment(
  department
) {
  return request(
    `/api/employees/search/department?department=${encodeURIComponent(
      department
    )}`
  );
}

export async function searchEmployeesByEmail(email) {
  return request(
    `/api/employees/search/email?email=${encodeURIComponent(
      email
    )}`
  );
}


/* =========================
   SALARY
========================= */

export async function getSalaries() {
  return request("/api/salaries");
}

export async function getSalary(id) {
  return request(`/api/salaries/${id}`);
}

export async function createSalary(salary) {
  return request("/api/salaries", {
    method: "POST",
    body: JSON.stringify(salary),
  });
}

export async function updateSalary(id, salary) {
  return request(`/api/salaries/${id}`, {
    method: "PUT",
    body: JSON.stringify(salary),
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

export async function calculatePayroll(
  employeeId,
  month
) {
  const params = new URLSearchParams({
    employeeId: String(employeeId),
    month: String(month),
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

export async function deletePayroll(id) {
  return request(`/api/payroll/${id}`, {
    method: "DELETE",
  });
}

export async function updatePayroll(
  id,
  payroll
) {
  return request(`/api/payroll/${id}`, {
    method: "PUT",
    body: JSON.stringify(payroll),
  });
}

export async function getPayrollsByEmployee(
  employeeId
) {
  return request(
    `/api/payroll/employee/${employeeId}`
  );
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
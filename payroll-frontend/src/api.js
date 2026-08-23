const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://turbo-space-spoon-7vrq9r9gvjvpfp75g-8080.app.github.dev";

/* =========================
   TOKEN STORAGE
========================= */

export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function saveRefreshToken(token) {
  localStorage.setItem("refreshToken", token);
}

export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

export function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getSavedUser() {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  return !!getToken();
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}

/* =========================
   LOGIN
========================= */

export async function loginUser(email, password) {
  let response;

  try {
    response = await fetch(
      `${API_BASE_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );
  } catch (error) {
    console.error("Login connection error:", error);

    throw new Error(
      "Unable to connect to the payroll server. Please make sure the backend is running."
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
      data?.error ||
        data?.message ||
        "Invalid email or password"
    );
  }

  /* Save access token */
  if (data?.accessToken) {
    saveToken(data.accessToken);
  }

  /* Save refresh token */
  if (data?.refreshToken) {
    saveRefreshToken(data.refreshToken);
  }

  return data;
}

/* =========================
   REFRESH ACCESS TOKEN
========================= */

export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error(
      "No refresh token available. Please login again."
    );
  }

  let response;

  try {
    response = await fetch(
      `${API_BASE_URL}/api/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken,
        }),
      }
    );
  } catch (error) {
    console.error(
      "Refresh token connection error:",
      error
    );

    throw new Error(
      "Unable to connect to the payroll server."
    );
  }

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    logout();

    throw new Error(
      data?.error ||
        data?.message ||
        "Refresh token expired. Please login again."
    );
  }

  const newAccessToken =
    data?.accessToken ||
    data?.token;

  if (!newAccessToken) {
    logout();

    throw new Error(
      "New access token was not received."
    );
  }

  /* Save new access token */
  saveToken(newAccessToken);

  /* Save rotated refresh token if backend sends one */
  if (data?.refreshToken) {
    saveRefreshToken(
      data.refreshToken
    );
  }

  return newAccessToken;
}

/* =========================
   GENERIC REQUEST
========================= */

async function request(
  endpoint,
  options = {},
  retry = true
) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
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
    console.error(
      "API connection error:",
      error
    );

    throw new Error(
      "Unable to connect to the payroll server. Please make sure the backend is running."
    );
  }

  /* =========================
     ACCESS TOKEN EXPIRED
  ========================= */

  if (
    (response.status === 401 ||
      response.status === 403) &&
    retry &&
    getRefreshToken()
  ) {
    try {
      await refreshAccessToken();

      return request(
        endpoint,
        options,
        false
      );
    } catch (refreshError) {
      throw refreshError;
    }
  }

  let data = null;

  try {
    const text =
      await response.text();

    if (text) {
      data = JSON.parse(text);
    }
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
}

/* =========================
   DASHBOARD
========================= */

export async function getDashboard() {
  return request(
    "/api/dashboard"
  );
}

/* =========================
   EMPLOYEES
========================= */

export async function getEmployees() {
  return request(
    "/api/employees"
  );
}

export async function createEmployee(
  employee
) {
  return request(
    "/api/employees",
    {
      method: "POST",
      body: JSON.stringify(
        employee
      ),
    }
  );
}

export async function updateEmployee(
  id,
  employee
) {
  return request(
    `/api/employees/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(
        employee
      ),
    }
  );
}

export async function deleteEmployee(
  id
) {
  return request(
    `/api/employees/${id}`,
    {
      method: "DELETE",
    }
  );
}

/* =========================
   SALARY
========================= */

export async function getSalaries() {
  return request(
    "/api/salary"
  );
}

export async function getEmployeeSalary(
  employeeId
) {
  return request(
    `/api/salary/${employeeId}`
  );
}

export async function createSalary(
  salary
) {
  return request(
    "/api/salary",
    {
      method: "POST",
      body: JSON.stringify(
        salary
      ),
    }
  );
}

export async function updateSalary(
  id,
  salary
) {
  return request(
    `/api/salary/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(
        salary
      ),
    }
  );
}

export async function deleteSalary(
  id
) {
  return request(
    `/api/salary/${id}`,
    {
      method: "DELETE",
    }
  );
}

/* =========================
   PAYROLL
========================= */

export async function getPayrolls() {
  return request(
    "/api/payroll"
  );
}

export async function getPayroll(
  id
) {
  return request(
    `/api/payroll/${id}`
  );
}

/* =========================
   CALCULATE / CREATE PAYROLL
========================= */

export async function calculatePayroll(
  payroll
) {
  return request(
    "/api/payroll",
    {
      method: "POST",
      body: JSON.stringify(
        payroll
      ),
    }
  );
}

export async function createPayroll(
  payroll
) {
  return request(
    "/api/payroll",
    {
      method: "POST",
      body: JSON.stringify(
        payroll
      ),
    }
  );
}

export async function deletePayroll(
  id
) {
  return request(
    `/api/payroll/${id}`,
    {
      method: "DELETE",
    }
  );
}

/* =========================
   PAYSLIP
========================= */

export async function getPayslip(
  payrollId
) {
  return request(
    `/api/payslip/${payrollId}`
  );
}

/* =========================
   REPORTS
========================= */

export async function getPayrollReport(
  month = null
) {
  let endpoint =
    "/api/reports/payroll";

  if (month) {
    endpoint +=
      `?month=${encodeURIComponent(
        month
      )}`;
  }

  return request(endpoint);
}
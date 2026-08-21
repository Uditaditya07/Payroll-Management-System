import { useState } from 'react'
import './App.css'

const DEMO_USER = { name: 'Demo Admin', email: 'demo@payroll.local', role: 'ADMIN' }
const DEMO_DASHBOARD = { totalEmployees: 24, totalPayroll: 18, totalGrossSalary: 1842500, totalNetSalary: 1518900, totalDeductions: 323600, averageSalary: 84383, currentMonth: 'August 2026' }
const DEMO_EMPLOYEES = [
  { id: 1, name: 'Aarav Sharma', email: 'aarav@company.com', department: 'Engineering', salary: 95000 },
  { id: 2, name: 'Maya Patel', email: 'maya@company.com', department: 'Finance', salary: 82000 },
  { id: 3, name: 'Kabir Mehta', email: 'kabir@company.com', department: 'Operations', salary: 76000 },
  { id: 4, name: 'Anika Rao', email: 'anika@company.com', department: 'People', salary: 68000 },
]
const DEMO_PAYROLLS = [
  { id: 101, employeeId: 1, month: 'August 2026', grossSalary: 95000, totalDeductions: 14250, netSalary: 80750 },
  { id: 102, employeeId: 2, month: 'August 2026', grossSalary: 82000, totalDeductions: 12300, netSalary: 69700 },
  { id: 103, employeeId: 3, month: 'August 2026', grossSalary: 76000, totalDeductions: 11400, netSalary: 64600 },
]

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

function App() {
  const [user] = useState(DEMO_USER)
  const [activeView, setActiveView] = useState('Overview')
  const [dashboard] = useState(DEMO_DASHBOARD)
  const [employees, setEmployees] = useState(DEMO_EMPLOYEES)
  const [payrolls, setPayrolls] = useState(DEMO_PAYROLLS)
  const [error, setError] = useState('')
  const isAdmin = user?.role?.toUpperCase() === 'ADMIN'
  const logout = () => setError('Demo mode is active. Login and database integration are currently disabled.')
    const addEmployee = () => {
    if (!isAdmin) return
    const name = window.prompt('Employee name')
    const email = window.prompt('Employee email')
    const department = window.prompt('Department')
    if (!name || !email || !department) return
      setEmployees([...employees, { id: Date.now(), name, email, department, salary: 0 }])
  }
  const calculatePayroll = async () => {
    if (!isAdmin) return
    const employeeId = window.prompt('Employee ID')
    const month = window.prompt('Payroll month (for example, 2026-08)')
    if (!employeeId || !month) return
      setPayrolls([...payrolls, { id: Date.now(), employeeId, month, grossSalary: 0, totalDeductions: 0, netSalary: 0 }])
  }
  const removeEmployee = async (id) => {
    if (!isAdmin || !window.confirm('Delete this employee?')) return
      setEmployees(employees.filter((employee) => employee.id !== id))
  }
  const navItems = ['Overview', 'Employees', 'Payroll runs', 'Reports']
  return <div className="app-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark">P</span><span>payroll<span className="brand-dot">.</span></span></div><div className="workspace-label">WORKSPACE</div><nav>{navItems.map((item) => <button className={activeView === item ? 'nav-item active' : 'nav-item'} key={item} onClick={() => setActiveView(item)}><span className="nav-icon">{item === 'Overview' ? '◈' : item === 'Employees' ? '◎' : item === 'Payroll runs' ? '▤' : '◌'}</span>{item}</button>)}</nav><div className="sidebar-bottom"><div className="secure-note"><span>✓</span><div><strong>Workspace protected</strong><small>Admin controls enabled</small></div></div><button className="nav-item logout" onClick={logout}>↪ <span>Sign out</span></button></div></aside><main className="content"><header className="topbar"><div><span className="breadcrumb">Operations / {activeView}</span><h1>{activeView}</h1></div><div className="profile"><div className="avatar">{user.name?.slice(0, 1).toUpperCase()}</div><div><strong>{user.name}</strong><small>{isAdmin ? 'Administrator' : 'Employee'}</small></div><span className="role-pill">{user.role}</span></div></header>{error && <div className="alert">{error}<button onClick={() => setError('')}>×</button></div>}{activeView === 'Overview' && <Overview dashboard={dashboard} payrolls={payrolls} />}{activeView === 'Employees' && <Employees employees={employees} isAdmin={isAdmin} onDelete={removeEmployee} onAdd={addEmployee} />}{activeView === 'Payroll runs' && <PayrollRuns payrolls={payrolls} isAdmin={isAdmin} onCalculate={calculatePayroll} />}{activeView === 'Reports' && <Reports dashboard={dashboard} />}</main></div>
}

function Overview({ dashboard, payrolls }) {
  const stats = [['Total employees', dashboard?.totalEmployees, 'people in workspace'], ['Payroll this month', dashboard?.totalPayroll, 'runs processed'], ['Net payroll', dashboard?.totalNetSalary, 'after deductions'], ['Average salary', dashboard?.averageSalary, 'per payroll run']]
  return <><section className="welcome-row"><div><p className="eyebrow">{dashboard?.currentMonth || 'Monthly close'}</p><h2>Good morning, your payroll is in view.</h2><p className="muted">A quick read on what is moving across your organization.</p></div><div className="close-status"><span className="status-dot" /> All systems operational</div></section><section className="stat-grid">{stats.map(([label, value, detail]) => <article className="stat-card" key={label}><span>{label}</span><strong>{label.includes('salary') || label.includes('payroll') && label !== 'Payroll this month' ? money(value) : (value ?? '—')}</strong><small>{detail}</small></article>)}</section><section className="lower-grid"><article className="panel chart-panel"><div className="panel-heading"><div><span className="eyebrow">Payroll health</span><h3>Monthly outflow</h3></div><span className="period">Last 6 months ▾</span></div><div className="bars">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => <div className="bar-column" key={month}><div className={`bar bar-${index}`} /><small>{month}</small></div>)}</div></article><article className="panel"><div className="panel-heading"><div><span className="eyebrow">Latest activity</span><h3>Recent payrolls</h3></div><span className="count">{payrolls.length}</span></div><div className="activity-list">{payrolls.slice(-4).reverse().map((payroll) => <div className="activity" key={payroll.id}><span className="activity-icon">₹</span><div><strong>Payroll #{payroll.id}</strong><small>{payroll.month || 'Unscheduled'} · Employee #{payroll.employeeId}</small></div><b>{money(payroll.netSalary)}</b></div>)}{!payrolls.length && <p className="empty">No payroll runs yet.</p>}</div></article></section></>
}

function Employees({ employees, isAdmin, onDelete, onAdd }) { return <section className="panel table-panel"><div className="panel-heading"><div><span className="eyebrow">People directory</span><h2>Employees</h2></div>{isAdmin ? <button className="primary-button small" onClick={onAdd}>＋ Add employee</button> : <span className="read-only">Read only</span>}</div><div className="table-wrap"><table><thead><tr><th>Employee</th><th>Department</th><th>Email</th><th>Salary</th>{isAdmin && <th />}</tr></thead><tbody>{employees.map((employee) => <tr key={employee.id}><td><div className="person"><span className="table-avatar">{employee.name?.slice(0, 1)}</span><strong>{employee.name}</strong></div></td><td>{employee.department || '—'}</td><td>{employee.email}</td><td>{money(employee.salary)}</td>{isAdmin && <td><button className="icon-button" title="Delete employee" onClick={() => onDelete(employee.id)}>⌫</button></td>}</tr>)}</tbody></table>{!employees.length && <p className="empty">No employees found.</p>}</div></section> }

function PayrollRuns({ payrolls, isAdmin, onCalculate }) { return <section className="panel table-panel"><div className="panel-heading"><div><span className="eyebrow">Compensation ledger</span><h2>Payroll runs</h2></div>{isAdmin ? <button className="primary-button small" onClick={onCalculate}>＋ Calculate payroll</button> : <span className="read-only">Read only</span>}</div><div className="table-wrap"><table><thead><tr><th>Run</th><th>Employee</th><th>Month</th><th>Gross</th><th>Deductions</th><th>Net salary</th></tr></thead><tbody>{payrolls.map((payroll) => <tr key={payroll.id}><td><strong>#{payroll.id}</strong></td><td>Employee #{payroll.employeeId}</td><td>{payroll.month}</td><td>{money(payroll.grossSalary)}</td><td>{money(payroll.totalDeductions)}</td><td><strong>{money(payroll.netSalary)}</strong></td></tr>)}</tbody></table>{!payrolls.length && <p className="empty">No payroll runs found.</p>}</div></section> }

function Reports({ dashboard }) { return <section className="report-grid"><article className="report-hero"><span className="eyebrow">Finance snapshot</span><h2>Payroll reporting, without the noise.</h2><p>Use these figures to reconcile the current period and prepare your close.</p><div className="report-total">{money(dashboard?.totalGrossSalary)}<small>gross payroll across all runs</small></div></article><article className="panel report-list"><div><span className="eyebrow">Breakdown</span><h3>Current totals</h3></div>{[['Net salary', dashboard?.totalNetSalary], ['Deductions', dashboard?.totalDeductions], ['Average salary', dashboard?.averageSalary]].map(([label, value]) => <div className="report-line" key={label}><span>{label}</span><strong>{money(value)}</strong></div>)}</article></section> }

export default App

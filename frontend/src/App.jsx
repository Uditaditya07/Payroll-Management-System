import { useMemo, useState } from 'react'

const payrollRecords = [
  {
    id: 'PR-2401-001',
    employee: 'Aarav Sharma',
    role: 'Software Engineer',
    period: 'Jan 2026',
    grossSalary: 98000,
    deductions: 14500,
    netSalary: 83500,
    status: 'Paid',
    paymentDate: '2026-01-30',
    bankAccount: 'XXXX-3114',
  },
  {
    id: 'PR-2401-002',
    employee: 'Priya Verma',
    role: 'HR Manager',
    period: 'Jan 2026',
    grossSalary: 91000,
    deductions: 12000,
    netSalary: 79000,
    status: 'Paid',
    paymentDate: '2026-01-30',
    bankAccount: 'XXXX-6028',
  },
  {
    id: 'PR-2401-003',
    employee: 'Rohan Das',
    role: 'Accountant',
    period: 'Jan 2026',
    grossSalary: 78000,
    deductions: 10400,
    netSalary: 67600,
    status: 'Pending',
    paymentDate: '',
    bankAccount: 'XXXX-1982',
  },
  {
    id: 'PR-2401-004',
    employee: 'Neha Singh',
    role: 'UI Developer',
    period: 'Jan 2026',
    grossSalary: 86000,
    deductions: 11800,
    netSalary: 74200,
    status: 'Processing',
    paymentDate: '',
    bankAccount: 'XXXX-7745',
  },
  {
    id: 'PR-2401-005',
    employee: 'Kabir Mehta',
    role: 'DevOps Engineer',
    period: 'Jan 2026',
    grossSalary: 102000,
    deductions: 16200,
    netSalary: 85800,
    status: 'Paid',
    paymentDate: '2026-01-31',
    bankAccount: 'XXXX-5501',
  },
  {
    id: 'PR-2401-006',
    employee: 'Isha Kapoor',
    role: 'Business Analyst',
    period: 'Jan 2026',
    grossSalary: 82000,
    deductions: 11300,
    netSalary: 70700,
    status: 'Pending',
    paymentDate: '',
    bankAccount: 'XXXX-4433',
  },
]

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)

const formatDate = (value) => {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const statusClass = {
  Paid: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  Pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  Processing: 'bg-blue-50 text-blue-700 ring-blue-600/20',
}

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [paymentDateFilter, setPaymentDateFilter] = useState('')
  const [selectedRecord, setSelectedRecord] = useState(null)

  const filteredRecords = useMemo(() => {
    return payrollRecords.filter((record) => {
      const matchesSearch =
        record.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'All' || record.status === statusFilter

      const matchesDate =
        !paymentDateFilter ||
        (record.paymentDate && record.paymentDate === paymentDateFilter)

      return matchesSearch && matchesStatus && matchesDate
    })
  }, [searchTerm, statusFilter, paymentDateFilter])

  const summary = useMemo(() => {
    const totalEmployees = payrollRecords.length
    const totalPayroll = payrollRecords.reduce(
      (total, record) => total + record.netSalary,
      0,
    )
    const paidCount = payrollRecords.filter(
      (record) => record.status === 'Paid',
    ).length
    const pendingCount = payrollRecords.filter(
      (record) => record.status === 'Pending',
    ).length

    return { totalEmployees, totalPayroll, paidCount, pendingCount }
  }, [])

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <header className="rounded-2xl bg-slate-900 px-6 py-8 text-white shadow-lg sm:px-8">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-300">
            Payroll Management
          </p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
            Payroll Payments Dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
            Review payroll summaries, track payment status, and inspect employee
            payment details from one secure interface.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Total employees" value={summary.totalEmployees} />
          <SummaryCard
            label="Total net payroll"
            value={formatCurrency(summary.totalPayroll)}
          />
          <SummaryCard label="Paid records" value={summary.paidCount} />
          <SummaryCard label="Pending records" value={summary.pendingCount} />
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Search employee / payroll ID
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="e.g. Aarav or PR-2401-001"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700">
              Payment status
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
              >
                <option>All</option>
                <option>Paid</option>
                <option>Pending</option>
                <option>Processing</option>
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700">
              Payment date
              <input
                type="date"
                value={paymentDateFilter}
                onChange={(event) => setPaymentDateFilter(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-300"
              />
            </label>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Employee</th>
                  <th className="px-4 py-3 font-semibold">Period</th>
                  <th className="px-4 py-3 font-semibold">Gross Salary</th>
                  <th className="px-4 py-3 font-semibold">Net Salary</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Payment Date</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-800">{record.employee}</p>
                        <p className="text-xs text-slate-500">{record.role}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{record.period}</td>
                      <td className="px-4 py-3 text-slate-700">
                        {formatCurrency(record.grossSalary)}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {formatCurrency(record.netSalary)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusClass[record.status]}`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {formatDate(record.paymentDate)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedRecord(record)}
                          className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700"
                        >
                          View details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-sm text-slate-500"
                    >
                      No payroll records match your current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Payroll ID: {selectedRecord.id}</p>
                <h2 className="text-2xl font-semibold text-slate-900">
                  {selectedRecord.employee}
                </h2>
                <p className="text-sm text-slate-600">{selectedRecord.role}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <span className="sr-only">Close</span>✕
              </button>
            </div>

            <dl className="mt-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <DetailItem label="Payroll period" value={selectedRecord.period} />
              <DetailItem
                label="Payment status"
                value={selectedRecord.status}
              />
              <DetailItem
                label="Gross salary"
                value={formatCurrency(selectedRecord.grossSalary)}
              />
              <DetailItem
                label="Deductions"
                value={formatCurrency(selectedRecord.deductions)}
              />
              <DetailItem
                label="Net salary"
                value={formatCurrency(selectedRecord.netSalary)}
              />
              <DetailItem
                label="Payment date"
                value={formatDate(selectedRecord.paymentDate)}
              />
              <DetailItem
                label="Bank account"
                value={selectedRecord.bankAccount}
              />
            </dl>
          </div>
        </div>
      )}
    </div>
  )
}

function SummaryCard({ label, value }) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </article>
  )
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-base font-medium text-slate-900">{value}</dd>
    </div>
  )
}

export default App

package com.payroll.management.dto;

import java.util.List;

public class DashboardResponse {

    private long totalEmployees;
    private long totalPayroll;
    private double totalGrossSalary;
    private double totalNetSalary;
    private double totalDeductions;
    private double averageSalary;
    private String currentMonth;
    private List<RecentPayroll> recentPayrolls;

    public DashboardResponse() {
    }

    public long getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public long getTotalPayroll() {
        return totalPayroll;
    }

    public void setTotalPayroll(long totalPayroll) {
        this.totalPayroll = totalPayroll;
    }

    public double getTotalGrossSalary() {
        return totalGrossSalary;
    }

    public void setTotalGrossSalary(double totalGrossSalary) {
        this.totalGrossSalary = totalGrossSalary;
    }

    public double getTotalNetSalary() {
        return totalNetSalary;
    }

    public void setTotalNetSalary(double totalNetSalary) {
        this.totalNetSalary = totalNetSalary;
    }

    public double getTotalDeductions() {
        return totalDeductions;
    }

    public void setTotalDeductions(double totalDeductions) {
        this.totalDeductions = totalDeductions;
    }

    public double getAverageSalary() {
        return averageSalary;
    }

    public void setAverageSalary(double averageSalary) {
        this.averageSalary = averageSalary;
    }

    public String getCurrentMonth() {
        return currentMonth;
    }

    public void setCurrentMonth(String currentMonth) {
        this.currentMonth = currentMonth;
    }

    public List<RecentPayroll> getRecentPayrolls() {
        return recentPayrolls;
    }

    public void setRecentPayrolls(List<RecentPayroll> recentPayrolls) {
        this.recentPayrolls = recentPayrolls;
    }

    // Recent Payroll
    public static class RecentPayroll {

        private Long payrollId;
        private Long employeeId;
        private String month;
        private double grossSalary;
        private double netSalary;

        public RecentPayroll() {
        }

        public RecentPayroll(
                Long payrollId,
                Long employeeId,
                String month,
                double grossSalary,
                double netSalary) {

            this.payrollId = payrollId;
            this.employeeId = employeeId;
            this.month = month;
            this.grossSalary = grossSalary;
            this.netSalary = netSalary;
        }

        public Long getPayrollId() {
            return payrollId;
        }

        public void setPayrollId(Long payrollId) {
            this.payrollId = payrollId;
        }

        public Long getEmployeeId() {
            return employeeId;
        }

        public void setEmployeeId(Long employeeId) {
            this.employeeId = employeeId;
        }

        public String getMonth() {
            return month;
        }

        public void setMonth(String month) {
            this.month = month;
        }

        public double getGrossSalary() {
            return grossSalary;
        }

        public void setGrossSalary(double grossSalary) {
            this.grossSalary = grossSalary;
        }

        public double getNetSalary() {
            return netSalary;
        }

        public void setNetSalary(double netSalary) {
            this.netSalary = netSalary;
        }
    }
}
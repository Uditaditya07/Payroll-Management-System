package com.payroll.management.dto;

public class PayrollReportResponse {

    private long totalEmployees;
    private long totalPayrollRecords;
    private double totalGrossSalary;
    private double totalDeductions;
    private double totalNetSalary;
    private double averageNetSalary;
    private String month;

    public PayrollReportResponse() {
    }

    public long getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public long getTotalPayrollRecords() {
        return totalPayrollRecords;
    }

    public void setTotalPayrollRecords(long totalPayrollRecords) {
        this.totalPayrollRecords = totalPayrollRecords;
    }

    public double getTotalGrossSalary() {
        return totalGrossSalary;
    }

    public void setTotalGrossSalary(double totalGrossSalary) {
        this.totalGrossSalary = totalGrossSalary;
    }

    public double getTotalDeductions() {
        return totalDeductions;
    }

    public void setTotalDeductions(double totalDeductions) {
        this.totalDeductions = totalDeductions;
    }

    public double getTotalNetSalary() {
        return totalNetSalary;
    }

    public void setTotalNetSalary(double totalNetSalary) {
        this.totalNetSalary = totalNetSalary;
    }

    public double getAverageNetSalary() {
        return averageNetSalary;
    }

    public void setAverageNetSalary(double averageNetSalary) {
        this.averageNetSalary = averageNetSalary;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }
}
package com.payroll.management.dto;

public class PayslipResponse {

    private EmployeeDetails employee;
    private String month;
    private Earnings earnings;
    private Deductions deductions;
    private double netSalary;

    public PayslipResponse() {
    }

    public EmployeeDetails getEmployee() {
        return employee;
    }

    public void setEmployee(EmployeeDetails employee) {
        this.employee = employee;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public Earnings getEarnings() {
        return earnings;
    }

    public void setEarnings(Earnings earnings) {
        this.earnings = earnings;
    }

    public Deductions getDeductions() {
        return deductions;
    }

    public void setDeductions(Deductions deductions) {
        this.deductions = deductions;
    }

    public double getNetSalary() {
        return netSalary;
    }

    public void setNetSalary(double netSalary) {
        this.netSalary = netSalary;
    }

    // Employee Details
    public static class EmployeeDetails {

        private Long id;
        private String name;
        private String email;
        private String department;

        public EmployeeDetails() {
        }

        public EmployeeDetails(
                Long id,
                String name,
                String email,
                String department) {

            this.id = id;
            this.name = name;
            this.email = email;
            this.department = department;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getDepartment() {
            return department;
        }

        public void setDepartment(String department) {
            this.department = department;
        }
    }

    // Earnings
    public static class Earnings {

        private double basicSalary;
        private double hra;
        private double allowances;
        private double bonus;
        private double grossSalary;

        public Earnings() {
        }

        public Earnings(
                double basicSalary,
                double hra,
                double allowances,
                double bonus,
                double grossSalary) {

            this.basicSalary = basicSalary;
            this.hra = hra;
            this.allowances = allowances;
            this.bonus = bonus;
            this.grossSalary = grossSalary;
        }

        public double getBasicSalary() {
            return basicSalary;
        }

        public void setBasicSalary(double basicSalary) {
            this.basicSalary = basicSalary;
        }

        public double getHra() {
            return hra;
        }

        public void setHra(double hra) {
            this.hra = hra;
        }

        public double getAllowances() {
            return allowances;
        }

        public void setAllowances(double allowances) {
            this.allowances = allowances;
        }

        public double getBonus() {
            return bonus;
        }

        public void setBonus(double bonus) {
            this.bonus = bonus;
        }

        public double getGrossSalary() {
            return grossSalary;
        }

        public void setGrossSalary(double grossSalary) {
            this.grossSalary = grossSalary;
        }
    }

    // Deductions
    public static class Deductions {

        private double pf;
        private double tax;
        private double otherDeductions;
        private double totalDeductions;

        public Deductions() {
        }

        public Deductions(
                double pf,
                double tax,
                double otherDeductions,
                double totalDeductions) {

            this.pf = pf;
            this.tax = tax;
            this.otherDeductions = otherDeductions;
            this.totalDeductions = totalDeductions;
        }

        public double getPf() {
            return pf;
        }

        public void setPf(double pf) {
            this.pf = pf;
        }

        public double getTax() {
            return tax;
        }

        public void setTax(double tax) {
            this.tax = tax;
        }

        public double getOtherDeductions() {
            return otherDeductions;
        }

        public void setOtherDeductions(double otherDeductions) {
            this.otherDeductions = otherDeductions;
        }

        public double getTotalDeductions() {
            return totalDeductions;
        }

        public void setTotalDeductions(double totalDeductions) {
            this.totalDeductions = totalDeductions;
        }
    }
}
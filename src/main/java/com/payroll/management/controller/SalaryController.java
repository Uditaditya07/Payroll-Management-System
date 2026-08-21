package com.payroll.management.controller;

import com.payroll.management.entity.Employee;
import com.payroll.management.entity.Salary;
import com.payroll.management.service.SalaryService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salaries")
public class SalaryController {

    private final SalaryService salaryService;

    public SalaryController(SalaryService salaryService) {
        this.salaryService = salaryService;
    }

    // Create Salary
    @PostMapping
    public Salary addSalary(@RequestBody SalaryRequest request) {

        Employee employee = new Employee();
        employee.setId(request.getEmployeeId());

        Salary salary = new Salary();
        salary.setEmployee(employee);

        salary.setBasicSalary(request.getBasicSalary());
        salary.setHra(request.getHra());
        salary.setAllowances(request.getAllowances());
        salary.setBonus(request.getBonus());
        salary.setPf(request.getPf());
        salary.setTax(request.getTax());
        salary.setOtherDeductions(request.getOtherDeductions());

        return salaryService.addSalary(salary);
    }

    // Get All Salaries
    @GetMapping
    public List<Salary> getAllSalaries() {
        return salaryService.getAllSalaries();
    }

    // Get Salary By ID
    @GetMapping("/{id}")
    public Salary getSalaryById(@PathVariable Long id) {
        return salaryService.getSalaryById(id);
    }

    // Update Salary
    @PutMapping("/{id}")
    public Salary updateSalary(
            @PathVariable Long id,
            @RequestBody Salary salary) {

        return salaryService.updateSalary(id, salary);
    }

    // Delete Salary
    @DeleteMapping("/{id}")
    public String deleteSalary(@PathVariable Long id) {
        salaryService.deleteSalary(id);
        return "Salary deleted successfully";
    }

    // Request class
    public static class SalaryRequest {

        private Long employeeId;
        private double basicSalary;
        private double hra;
        private double allowances;
        private double bonus;
        private double pf;
        private double tax;
        private double otherDeductions;

        public Long getEmployeeId() {
            return employeeId;
        }

        public void setEmployeeId(Long employeeId) {
            this.employeeId = employeeId;
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
    }
}
package com.payroll.management.service;

import com.payroll.management.entity.Employee;
import com.payroll.management.entity.Payroll;
import com.payroll.management.entity.Salary;
import com.payroll.management.repository.PayrollRepository;
import com.payroll.management.repository.SalaryRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PayrollService {

    private final PayrollRepository payrollRepository;
    private final SalaryRepository salaryRepository;

    public PayrollService(
            PayrollRepository payrollRepository,
            SalaryRepository salaryRepository) {

        this.payrollRepository = payrollRepository;
        this.salaryRepository = salaryRepository;
    }

    // Calculate and save payroll
    public Payroll calculatePayroll(Long employeeId, String month) {

        Salary salary = salaryRepository.findAll()
                .stream()
                .filter(s -> s.getEmployee() != null
                        && s.getEmployee().getId().equals(employeeId))
                .findFirst()
                .orElse(null);

        if (salary == null) {
            return null;
        }

        Payroll payroll = new Payroll();

        payroll.setEmployeeId(employeeId);
        payroll.setMonth(month);

        payroll.setBasicSalary(salary.getBasicSalary());
        payroll.setHra(salary.getHra());
        payroll.setAllowances(salary.getAllowances());
        payroll.setBonus(salary.getBonus());

        // Calculate Gross Salary
        double grossSalary =
                salary.getBasicSalary()
                + salary.getHra()
                + salary.getAllowances()
                + salary.getBonus();

        payroll.setGrossSalary(grossSalary);

        payroll.setPf(salary.getPf());
        payroll.setTax(salary.getTax());
        payroll.setOtherDeductions(
                salary.getOtherDeductions()
        );

        // Calculate Total Deductions
        double totalDeductions =
                salary.getPf()
                + salary.getTax()
                + salary.getOtherDeductions();

        payroll.setTotalDeductions(totalDeductions);

        // Calculate Net Salary
        double netSalary =
                grossSalary - totalDeductions;

        payroll.setNetSalary(netSalary);

        return payrollRepository.save(payroll);
    }

    // Get All Payrolls
    public List<Payroll> getAllPayrolls() {
        return payrollRepository.findAll();
    }

    // Get Payroll By ID
    public Payroll getPayrollById(Long id) {
        return payrollRepository.findById(id)
                .orElse(null);
    }

    // Get Payrolls By Employee ID
    public List<Payroll> getPayrollsByEmployeeId(
            Long employeeId) {

        return payrollRepository.findByEmployeeId(employeeId);
    }

    // Update Payroll
    public Payroll updatePayroll(
            Long id,
            Payroll updatedPayroll) {

        Payroll existingPayroll =
                payrollRepository.findById(id)
                        .orElse(null);

        if (existingPayroll == null) {
            return null;
        }

        existingPayroll.setEmployeeId(
                updatedPayroll.getEmployeeId()
        );

        existingPayroll.setMonth(
                updatedPayroll.getMonth()
        );

        existingPayroll.setBasicSalary(
                updatedPayroll.getBasicSalary()
        );

        existingPayroll.setHra(
                updatedPayroll.getHra()
        );

        existingPayroll.setAllowances(
                updatedPayroll.getAllowances()
        );

        existingPayroll.setBonus(
                updatedPayroll.getBonus()
        );

        // Recalculate Gross Salary
        double grossSalary =
                updatedPayroll.getBasicSalary()
                + updatedPayroll.getHra()
                + updatedPayroll.getAllowances()
                + updatedPayroll.getBonus();

        existingPayroll.setGrossSalary(grossSalary);

        existingPayroll.setPf(
                updatedPayroll.getPf()
        );

        existingPayroll.setTax(
                updatedPayroll.getTax()
        );

        existingPayroll.setOtherDeductions(
                updatedPayroll.getOtherDeductions()
        );

        // Recalculate Total Deductions
        double totalDeductions =
                updatedPayroll.getPf()
                + updatedPayroll.getTax()
                + updatedPayroll.getOtherDeductions();

        existingPayroll.setTotalDeductions(
                totalDeductions
        );

        // Recalculate Net Salary
        double netSalary =
                grossSalary - totalDeductions;

        existingPayroll.setNetSalary(netSalary);

        return payrollRepository.save(existingPayroll);
    }

    // Delete Payroll
    public void deletePayroll(Long id) {
        payrollRepository.deleteById(id);
    }

    // Get Employee By ID
    public Employee getEmployeeById(Long employeeId) {

        return salaryRepository.findAll()
                .stream()
                .filter(s -> s.getEmployee() != null
                        && s.getEmployee().getId()
                        .equals(employeeId))
                .map(Salary::getEmployee)
                .findFirst()
                .orElse(null);
    }
}
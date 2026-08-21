package com.payroll.management.controller;

import com.payroll.management.entity.Payroll;
import com.payroll.management.service.PayrollService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payroll")
public class PayrollController {

    private final PayrollService payrollService;

    public PayrollController(PayrollService payrollService) {
        this.payrollService = payrollService;
    }

    // Calculate Payroll
    @PostMapping("/calculate")
    public Payroll calculatePayroll(
            @RequestParam Long employeeId,
            @RequestParam String month) {

        return payrollService.calculatePayroll(employeeId, month);
    }

    // Get All Payrolls
    @GetMapping
    public List<Payroll> getAllPayrolls() {
        return payrollService.getAllPayrolls();
    }

    // Get Payroll By ID
    @GetMapping("/{id}")
    public Payroll getPayrollById(@PathVariable Long id) {
        return payrollService.getPayrollById(id);
    }

    // Get Payrolls By Employee ID
    @GetMapping("/employee/{employeeId}")
    public List<Payroll> getPayrollsByEmployeeId(
            @PathVariable Long employeeId) {

        return payrollService.getPayrollsByEmployeeId(employeeId);
    }

    // Update Payroll
    @PutMapping("/{id}")
    public Payroll updatePayroll(
            @PathVariable Long id,
            @RequestBody Payroll payroll) {

        return payrollService.updatePayroll(id, payroll);
    }

    // Delete Payroll
    @DeleteMapping("/{id}")
    public String deletePayroll(@PathVariable Long id) {

        payrollService.deletePayroll(id);

        return "Payroll deleted successfully";
    }
}
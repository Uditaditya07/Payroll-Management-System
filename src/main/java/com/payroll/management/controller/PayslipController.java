package com.payroll.management.controller;

import com.payroll.management.dto.PayslipResponse;
import com.payroll.management.entity.Employee;
import com.payroll.management.entity.Payroll;
import com.payroll.management.service.PayrollService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payslip")
public class PayslipController {

    private final PayrollService payrollService;

    public PayslipController(PayrollService payrollService) {
        this.payrollService = payrollService;
    }

    // Get Professional Payslip
    @GetMapping("/{payrollId}")
    public PayslipResponse getPayslip(
            @PathVariable Long payrollId) {

        Payroll payroll =
                payrollService.getPayrollById(payrollId);

        if (payroll == null) {
            return null;
        }

        Employee employee =
                payrollService.getEmployeeById(
                        payroll.getEmployeeId()
                );

        PayslipResponse response =
                new PayslipResponse();

        // Employee Details
        if (employee != null) {

            response.setEmployee(
                    new PayslipResponse.EmployeeDetails(
                            employee.getId(),
                            employee.getName(),
                            employee.getEmail(),
                            employee.getDepartment()
                    )
            );
        }

        // Month
        response.setMonth(
                payroll.getMonth()
        );

        // Earnings
        response.setEarnings(
                new PayslipResponse.Earnings(
                        payroll.getBasicSalary(),
                        payroll.getHra(),
                        payroll.getAllowances(),
                        payroll.getBonus(),
                        payroll.getGrossSalary()
                )
        );

        // Deductions
        response.setDeductions(
                new PayslipResponse.Deductions(
                        payroll.getPf(),
                        payroll.getTax(),
                        payroll.getOtherDeductions(),
                        payroll.getTotalDeductions()
                )
        );

        // Net Salary
        response.setNetSalary(
                payroll.getNetSalary()
        );

        return response;
    }
}
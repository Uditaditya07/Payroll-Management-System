package com.payroll.management.controller;

import com.payroll.management.dto.PayrollReportResponse;
import com.payroll.management.service.PayrollReportService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
public class PayrollReportController {

    private final PayrollReportService payrollReportService;

    public PayrollReportController(
            PayrollReportService payrollReportService) {

        this.payrollReportService =
                payrollReportService;
    }

    @GetMapping("/payroll")
    public PayrollReportResponse getPayrollReport(
            @RequestParam(required = false) String month) {

        return payrollReportService.getPayrollReport(month);
    }
}
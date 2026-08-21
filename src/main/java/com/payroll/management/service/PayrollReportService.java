package com.payroll.management.service;

import com.payroll.management.dto.PayrollReportResponse;
import com.payroll.management.entity.Payroll;
import com.payroll.management.repository.EmployeeRepository;
import com.payroll.management.repository.PayrollRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PayrollReportService {

    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;

    public PayrollReportService(
            PayrollRepository payrollRepository,
            EmployeeRepository employeeRepository) {

        this.payrollRepository = payrollRepository;
        this.employeeRepository = employeeRepository;
    }

    public PayrollReportResponse getPayrollReport(String month) {

        List<Payroll> payrolls;

        if (month == null || month.isBlank()) {
            payrolls = payrollRepository.findAll();
        } else {
            payrolls = payrollRepository.findByMonth(month);
        }

        PayrollReportResponse response =
                new PayrollReportResponse();

        response.setTotalEmployees(
                employeeRepository.count()
        );

        response.setTotalPayrollRecords(
                payrolls.size()
        );

        double totalGrossSalary = 0;
        double totalDeductions = 0;
        double totalNetSalary = 0;

        for (Payroll payroll : payrolls) {

            totalGrossSalary +=
                    payroll.getGrossSalary();

            totalDeductions +=
                    payroll.getTotalDeductions();

            totalNetSalary +=
                    payroll.getNetSalary();
        }

        response.setTotalGrossSalary(
                totalGrossSalary
        );

        response.setTotalDeductions(
                totalDeductions
        );

        response.setTotalNetSalary(
                totalNetSalary
        );

        double averageNetSalary = 0;

        if (!payrolls.isEmpty()) {
            averageNetSalary =
                    totalNetSalary / payrolls.size();
        }

        response.setAverageNetSalary(
                averageNetSalary
        );

        response.setMonth(
                month == null || month.isBlank()
                        ? "All"
                        : month
        );

        return response;
    }
}
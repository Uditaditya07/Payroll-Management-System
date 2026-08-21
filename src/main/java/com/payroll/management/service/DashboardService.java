package com.payroll.management.service;

import com.payroll.management.dto.DashboardResponse;
import com.payroll.management.entity.Payroll;
import com.payroll.management.repository.EmployeeRepository;
import com.payroll.management.repository.PayrollRepository;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DashboardService {

    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;

    public DashboardService(
            PayrollRepository payrollRepository,
            EmployeeRepository employeeRepository) {

        this.payrollRepository = payrollRepository;
        this.employeeRepository = employeeRepository;
    }

    public DashboardResponse getDashboard() {

        List<Payroll> payrolls =
                payrollRepository.findAll();

        DashboardResponse response =
                new DashboardResponse();

        // Total Employees
        response.setTotalEmployees(
                employeeRepository.count()
        );

        // Total Payroll Records
        response.setTotalPayroll(
                payrolls.size()
        );

        double totalGrossSalary = 0;
        double totalNetSalary = 0;
        double totalDeductions = 0;

        String currentMonth = "";

        List<DashboardResponse.RecentPayroll> recentPayrolls =
                new ArrayList<>();

        for (Payroll payroll : payrolls) {

            totalGrossSalary +=
                    payroll.getGrossSalary();

            totalNetSalary +=
                    payroll.getNetSalary();

            totalDeductions +=
                    payroll.getTotalDeductions();

            currentMonth =
                    payroll.getMonth();

            recentPayrolls.add(
                    new DashboardResponse.RecentPayroll(
                            payroll.getId(),
                            payroll.getEmployeeId(),
                            payroll.getMonth(),
                            payroll.getGrossSalary(),
                            payroll.getNetSalary()
                    )
            );
        }

        // Total Gross Salary
        response.setTotalGrossSalary(
                totalGrossSalary
        );

        // Total Net Salary
        response.setTotalNetSalary(
                totalNetSalary
        );

        // Total Deductions
        response.setTotalDeductions(
                totalDeductions
        );

        // Average Salary
        double averageSalary = 0;

        if (!payrolls.isEmpty()) {
            averageSalary =
                    totalNetSalary / payrolls.size();
        }

        response.setAverageSalary(
                averageSalary
        );

        // Current Month
        response.setCurrentMonth(
                currentMonth
        );

        // Recent Payrolls
        response.setRecentPayrolls(
                recentPayrolls
        );

        return response;
    }
}
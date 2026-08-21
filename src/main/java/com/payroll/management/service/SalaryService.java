package com.payroll.management.service;

import com.payroll.management.entity.Salary;
import com.payroll.management.repository.SalaryRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SalaryService {

    private final SalaryRepository salaryRepository;

    public SalaryService(SalaryRepository salaryRepository) {
        this.salaryRepository = salaryRepository;
    }

    // Create Salary
    public Salary addSalary(Salary salary) {
        return salaryRepository.save(salary);
    }

    // Get All Salaries
    public List<Salary> getAllSalaries() {
        return salaryRepository.findAll();
    }

    // Get Salary By ID
    public Salary getSalaryById(Long id) {
        return salaryRepository.findById(id).orElse(null);
    }

    // Update Salary
    public Salary updateSalary(Long id, Salary salary) {

        Salary existingSalary = salaryRepository.findById(id).orElse(null);

        if (existingSalary == null) {
            return null;
        }

        existingSalary.setEmployee(salary.getEmployee());
        existingSalary.setBasicSalary(salary.getBasicSalary());
        existingSalary.setHra(salary.getHra());
        existingSalary.setAllowances(salary.getAllowances());
        existingSalary.setBonus(salary.getBonus());
        existingSalary.setPf(salary.getPf());
        existingSalary.setTax(salary.getTax());
        existingSalary.setOtherDeductions(salary.getOtherDeductions());

        return salaryRepository.save(existingSalary);
    }

    // Delete Salary
    public void deleteSalary(Long id) {
        salaryRepository.deleteById(id);
    }
}
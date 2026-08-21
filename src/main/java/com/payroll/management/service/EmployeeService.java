package com.payroll.management.service;

import com.payroll.management.entity.Employee;
import com.payroll.management.repository.EmployeeRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public Employee addEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElse(null);
    }

    public Employee updateEmployee(
            Long id,
            Employee updatedEmployee) {

        Employee employee =
                employeeRepository.findById(id)
                        .orElse(null);

        if (employee == null) {
            return null;
        }

        employee.setName(updatedEmployee.getName());
        employee.setEmail(updatedEmployee.getEmail());
        employee.setDepartment(updatedEmployee.getDepartment());
        employee.setSalary(updatedEmployee.getSalary());

        return employeeRepository.save(employee);
    }

    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }

    public List<Employee> searchByName(String name) {
        return employeeRepository
                .findByNameContainingIgnoreCase(name);
    }

    public List<Employee> searchByDepartment(String department) {
        return employeeRepository
                .findByDepartmentIgnoreCase(department);
    }

    public List<Employee> searchByEmail(String email) {
        return employeeRepository
                .findByEmailContainingIgnoreCase(email);
    }

    // Pagination
    public Page<Employee> getEmployeesWithPagination(
            int page,
            int size,
            String sortBy,
            String direction) {

        Sort sort;

        if (direction.equalsIgnoreCase("desc")) {
            sort = Sort.by(sortBy).descending();
        } else {
            sort = Sort.by(sortBy).ascending();
        }

        Pageable pageable =
                PageRequest.of(page, size, sort);

        return employeeRepository.findAll(pageable);
    }
}
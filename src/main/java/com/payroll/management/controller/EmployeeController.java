package com.payroll.management.controller;

import com.payroll.management.entity.Employee;
import com.payroll.management.service.EmployeeService;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    // Add Employee
    @PostMapping
    public Employee addEmployee(
            @RequestBody Employee employee) {

        return employeeService.addEmployee(employee);
    }

    // Get All Employees
    @GetMapping
    public List<Employee> getAllEmployees() {

        return employeeService.getAllEmployees();
    }

    // Pagination + Sorting
    @GetMapping("/page")
    public Page<Employee> getEmployeesWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        return employeeService.getEmployeesWithPagination(
                page,
                size,
                sortBy,
                direction
        );
    }

    // Get Employee By ID
    @GetMapping("/{id}")
    public Employee getEmployeeById(
            @PathVariable Long id) {

        return employeeService.getEmployeeById(id);
    }

    // Update Employee
    @PutMapping("/{id}")
    public Employee updateEmployee(
            @PathVariable Long id,
            @RequestBody Employee employee) {

        return employeeService.updateEmployee(
                id,
                employee
        );
    }

    // Delete Employee
    @DeleteMapping("/{id}")
    public String deleteEmployee(
            @PathVariable Long id) {

        employeeService.deleteEmployee(id);

        return "Employee deleted successfully";
    }

    // Search By Name
    @GetMapping("/search/name")
    public List<Employee> searchByName(
            @RequestParam String name) {

        return employeeService.searchByName(name);
    }

    // Search By Department
    @GetMapping("/search/department")
    public List<Employee> searchByDepartment(
            @RequestParam String department) {

        return employeeService.searchByDepartment(
                department
        );
    }

    // Search By Email
    @GetMapping("/search/email")
    public List<Employee> searchByEmail(
            @RequestParam String email) {

        return employeeService.searchByEmail(email);
    }
}
package com.payroll.management.repository;

import com.payroll.management.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    List<Employee> findByNameContainingIgnoreCase(String name);

    List<Employee> findByDepartmentIgnoreCase(String department);

    List<Employee> findByEmailContainingIgnoreCase(String email);
}
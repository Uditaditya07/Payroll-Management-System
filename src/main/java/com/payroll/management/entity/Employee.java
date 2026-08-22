package com.payroll.management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private String department;

    private double salary;

    public Employee() {
    }

    // Get ID
    public Long getId() {
        return id;
    }

    // Set ID
    public void setId(Long id) {
        this.id = id;
    }

    // Get Name
    public String getName() {
        return name;
    }

    // Set Name
    public void setName(String name) {
        this.name = name;
    }

    // Get Email
    public String getEmail() {
        return email;
    }

    // Set Email
    public void setEmail(String email) {
        this.email = email;
    }

    // Get Department
    public String getDepartment() {
        return department;
    }

    // Set Department
    public void setDepartment(String department) {
        this.department = department;
    }

    // Get Salary
    public double getSalary() {
        return salary;
    }

    // Set Salary
    public void setSalary(double salary) {
        this.salary = salary;
    }
}

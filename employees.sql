-- Create Table --
DROP DATABASE IF EXISTS employees_DB;
CREATE DATABASE employees_DB;

USE employees_DB;

-- Department Table --
CREATE TABLE department (
    dept_name VARCHAR(30) NULL,
    PRIMARY KEY (id)
);

-- Position Table --
CREATE TABLE position (
    title VARCHAR(30) NULL,
    salary DECIMAL,
    department_id INT(10),
    PRIMARY KEY (id)
);

-- Employee Table --
CREATE TABLE employee (
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT(10),
    manager_id INT(10),
    PRIMARY KEY (id)
)

SELECT * FROM employees_DB;
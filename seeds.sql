-- -- Department Seeds --

INSERT INTO department (id, dept_name)
VALUES (1, 'Management');

INSERT INTO department (id, dept_name)
VALUES (2, 'Engineering');

INSERT INTO department (id, dept_name)
VALUES (3, 'Legal');

INSERT INTO department (id, dept_name)
VALUES (4, 'Accounting');

-- -- Role Seeds --

INSERT INTO role (title, salary, department_id) 
VALUES
    ("Management", 350000, 1),
    ("Engineer", 250000, 2),
    ("Attorney", 150000, 3),
    ("Accountant", 110000, 4),

-- Employee Seeds --

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES 
('Bethany', 'Hope', 1, null),
('Ally', 'Chan', 3, 1),
('Judith', 'Rodriguez', 4, 1),
('Teresa', 'Gero', 2, 3),
('Malia', 'James', 3, 1),
('Christine', 'Lourdes', 2, 3),
('Sarah', 'Arwon', 4, 1),
('Chloe', 'Geleo', 2, 1);
    

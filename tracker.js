const mysql = require('mysql');
const inquirer = require('inquirer');
const { combineLatest } = require('rxjs');
require('dotenv').config()

const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Connection ID
connection.connect((err) => {
    if (err) throw err;
    runApp();
});


// Initial App Prompt
const runApp = () => {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View All Employees.',
                'View Employees by Department.',
                'View Employees by Role.',
                'View Employees by Manager.',
                'Add Employee.',
                'Add Role.',
                'Add Department.',
                'Update Employee Role',

            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case 'View All Employees.':
                    allEmployees();
                    break;

                case 'View Employees by Department.':
                    byDept();
                    break;

                case 'View Employees by Role.':
                    byRole();
                    break;

                case 'View Employees by Manager.':
                    byManager();
                    break;

                case 'Add Employee.':
                    addEmployee();
                    break;

                case 'Add Role.':
                    addRole();
                    break;

                case 'Add Department.':
                    addDept();
                    break;

                case 'Update Employee Role':
                    updateEmployee();
                    break;

                default:
                    console.log(`Invalid action: ${answer.action}`);
                    break;
            }
        });
};


// View All Employees
function allEmployees() {
    connection.query(
        `SELECT
        employee.id,
        employee.first_name AS 'First Name',
        employee.last_name AS 'Last Name',
        role.title AS 'Title',
        department.dept_name AS Department,
        role.salary AS 'Salary',
        CONCAT(e.first_name , ' ' , e.last_name) AS 'Manager'
    FROM employee 
    INNER JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee e ON employee.manager_id = e.id
    ORDER BY employee.id;
        `,
        function (err, res) {
            if (err) throw err
            console.table(res)
            runApp()
        });
};

// View By Department
function byDept() {
    connection.query(
        'SELECT id, title FROM role',
        (err, res) => {
            if (err) throw err;
            console.table(res);
            runApp();
        });
};

// View by Role
function byRole() {
    connection.query(
        'SELECT id, dept_name FROM department',
        (err, res) => {
            if (err) throw err;
            console.table(res);
            runApp();
        });
};



// View By Manager
function byManager() {
    connection.query(
        'SELECT id, manager_id FROM employee',
        (err, res) => {
            if (err) throw err;
            console.table(res);
            runApp();
        });
};

// Add Employee
function addEmployee() {
    inquirer
        .prompt([
            {
                message: 'Enter first name of new employee:',
                type: 'input',
                name: 'employeeFirstName'
            },
            {
                message: 'Enter last name of new employee:',
                type: 'input',
                name: 'employeeLastName',
            },
            {
                message: 'Enter Role ID of new employee:',
                type: 'input',
                name: 'employeeRole',
            },
            {
                message: 'Enter Manager ID of new employee:',
                type: 'input',
                name: 'employeeManagerId',
            },
        ])
        .then(answer => {
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: answer.employeeFirstName,
                    last_name: answer.employeeLastName,
                    role_id: answer.employeeRole,
                    manager_id: answer.employeeManagerId,
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(`You have entered ${answer.employeeFirstName} ${answer.employeeLastName} in the employee database.`);
                    runApp();
                }
            );
        });
}

function addRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'addRole',
                message: 'Which role would you like to add?',
            },
            {
                type: 'input',
                name: 'roleSalary',
                message: 'What is the salary for this role?',
            },
            {
                type: 'input',
                name: 'deptID',
                message: 'What is the department ID for this role?',
            },
        ])
        .then(answer => {
            connection.query(
                'INSERT INTO role SET ?',
                {
                    title: answer.addRole,
                    salary: answer.roleSalary,
                    department_id: answer.deptID,
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(
                        `You have entered ${answer.addRole} into your role database.`
                    );
                    runApp();
                }
            );
        });
}

function addDept() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'deptName',
                message: 'What department would you like to add?',
            },
        ])
        .then(answer => {
            connection.query(
                'INSERT INTO department (dept_name) VALUES (?)',
                answer.deptName,
                function (err, res) {
                    if (err) throw err;
                    console.log(
                        `You have entered ${answer.deptName} into your department database.`
                    );
                    runApp();
                }
            );
        });
}

function updateEmployee() {
    const employeeArray = [];
    const roleArray = [];
    connection.query(
        `SELECT CONCAT (employee.first_name, ' ', employee.last_name) as employee FROM employees_DB.employee`,
        (err, res) => {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                employeeArray.push(res[i].employee);
            }
            connection.query(
                `SELECT title FROM employees_DB.role`,
                (err, res) => {
                    if (err) throw err;
                    for (let i = 0; i < res.length; i++) {
                        roleArray.push(res[i].title);
                    }

                    inquirer
                        .prompt([
                            {
                                name: 'name',
                                type: 'list',
                                message: `Whose role would you like to change?`,
                                choices: employeeArray,
                            },
                            {
                                name: 'role',
                                type: 'list',
                                message: 'What would you like to change their role to?',
                                choices: roleArray,
                            },
                        ])
                        .then(answers => {
                            let currentRole;
                            const name = answers.name.split(' ');
                            connection.query(
                                `SELECT id FROM employees_DB.role WHERE title = '${answers.role}'`,
                                (err, res) => {
                                    if (err) throw err;
                                    for (let i = 0; i < res.length; i++) {
                                        currentRole = res[i].id;
                                    }
                                    connection.query(
                                        `UPDATE employees_DB.employee SET role_id = ${currentRole} WHERE first_name= '${name[0]}' AND last_name= '${name[1]}';`,
                                        (err, res) => {
                                            if (err) throw err;
                                            console.log(`You have successfully upated the role.`);
                                            runApp();
                                        }
                                    );
                                }
                            );
                        });
                }
            );
        }
    );
};
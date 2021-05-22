const mysql = require('mysql');
const inquirer = require('inquirer');
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
                'View Employees by Manager.',
                'Add Employee.',
                'Remove Employee',
                'Update Employee Role',
                'Update Employee Manager.'
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

                case 'View Employees by Manager.':
                    byManager();
                    break;

                case 'Add Employee.':
                    addEmployee();
                    break;

                case 'Remove Employee':
                    removeEmployee();
                    break;

                case 'Update Employee Role':
                    updateEmployee();
                    break;

                case 'Update Employee Manager.':
                    updateManager();
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
        'SELECT id, dept_name FROM department',
        (err, res) => {
            if (err) throw err;
            console.table(res);
            runApp();
        });
};
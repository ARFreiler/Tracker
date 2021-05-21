const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: 'root',

    password: 'Dizzle80!',
    database: 'employees_DB',
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

function allEmployees() {
    connection.query("SELECT employee.first_name, employee.last_name, position.title, position.salary, department.dept_name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN position on position.id = employee.position_id INNER JOIN department on department.id = position.department_id left join employee e on employee.manager_id = e.id;",
        function (err, res) {
            if (err) throw err
            console.table(res)
            runApp()
        });
};
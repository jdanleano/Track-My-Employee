const inquirer = require("inquirer");
const fs = require("fs");
const cTable = require('console.table');
var mysql = require("mysql2");
const util = require("util");

// Added logo using Asciiart-logo npm
const logo = require('asciiart-logo');
const config = require('./package.json');
console.log(logo(config).render());

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rosejenn",
    database: "Employee_Tracker"
});

connection.connect((err) => {
    if (err) {
        console.log(err);
        res.status(500);
        return res.send("There was an error connecting to the database.");
    } console.log("You're connected!");

    // Function for inquirer to prompt data
    runSearch();

})

connection.query = util.promisify(connection.query);

// Function for prompt data
function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View all employees",
                "View all departments",
                "View all roles",
                "Add employee",
                "Add Department",
                "Add Role",
                "Remove employee",
                "Update employee role",
                "Update employee manager"
            ]

        }).then(answers => {
            // Start switch statement
            switch (answers.action) {
                // Start new case
                case "View all employees":

                    byEmployees();
                    runSearch();

                    break;
                // Start new case
                case "View all departments":

                    byDepartment();
                    runSearch();

                    break;

                case "View all roles":

                    byRole();
                    runSearch();

                    break;

                // Start new case
                // Takes further input
                case "Add employee":
                    inquirer
                        .prompt([
                            {
                                name: "employeeFirst",
                                type: "input",
                                message: "What is the employee's first name?",
                                validate: answer => {
                                    if (answer !== "") {
                                        return true;
                                    }
                                    return "Please enter at least one character.";
                                }
                            },
                            {
                                name: "employeeLast",
                                type: "input",
                                message: "What is the employee's last name?",
                                validate: answer => {
                                    if (answer !== "") {
                                        return true;
                                    }
                                    return "Please enter at least one character.";
                                }
                            },
                            {
                                name: "department",
                                type: "input",
                                message: "Please enter the role id",

                            },
                            {
                                name: "manager",
                                type: "input",
                                message: "Please enter manager id",
                            }
                        ]).then(answers => {

                            addEmployee(answers.employeeFirst, answers.employeeLast, answers.department, answers.manager);
                            runSearch();
                        })

                    break;
                // Start new case
                // Takes further input
                case "Add Department":
                    inquirer
                        .prompt([
                            {
                                name: "Department",
                                type: "input",
                                message: "Please enter the department you would like to add?",
                                validate: answer => {
                                    if (answer !== "") {
                                        return true;
                                    }
                                    return "Please enter at least one character.";
                                }
                            },

                        ]).then(answers => {
                            // Adds department to database
                            addDepartment(answers.Department);
                            runSearch();
                        })
                    break;
                // Start new case
                // Takes further input
                case "Add Role":
                    inquirer
                        .prompt([
                            {
                                name: "title",
                                type: "input",
                                message: "Please enter the role's title.",
                                validate: answer => {
                                    if (answer !== "") {
                                        return true;
                                    }
                                    return "Please enter at least one character.";
                                }
                            },
                            {
                                name: "salary",
                                type: "input",
                                message: "Please enter the role's salary.",

                            },
                            {
                                name: "department_id",
                                type: "input",
                                message: "Please enter the department id.",

                            }

                        ]).then(answers => {
                            // Adds role to database
                            addRole(answers.title, answers.salary, answers.department_id);
                            runSearch();
                        })
                    break;

                // Start new case
                // Takes further input
                case "Remove employee":
                    inquirer
                        .prompt([
                            {
                                name: "id",
                                type: "input",
                                message: "Please enter the Employee id",

                            }
                        ]).then(answers => {
                            // Removes employee to database
                            removeEmployee(answers.id);
                            runSearch();
                        })
                    break;

                // Start new case
                case "Update employee role":

                    inquirer
                        .prompt([
                            {
                                name: "employeeId",
                                type: "input",
                                message: "Please enter employee's id",
                            },
                            {
                                name: "roleId",
                                type: "input",
                                message: "Please enter role's id",

                            }

                        ]).then(answers => {
                            // Updates employee's role
                            updateByRole(answers.employeeId, answers.roleId);
                            runSearch();

                        })

                    break;
                // Start new case
                // Takes further input
                case "Update employee manager":

                    inquirer
                        .prompt([
                            {
                                name: "manager",
                                type: "input",
                                message: "Please enter manager id",
                            },
                            {
                                name: "Employee",
                                type: "input",
                                message: "Please enter employee id",

                            }
                        ]).then(answers => {
                            // Updates employee's manager
                            updateByManager(answers.manager, answers.Employee);
                            runSearch();

                        })

                    break;
            }

        });
}

// "View all employees",
function byEmployees() {

    var results = connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.d_name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;",


        function (error, results) {
            if (error) throw error
            console.log ("\n")
            console.table(results)
        })

};

// "View alL departments",
function byDepartment() {

    var department = connection.query("SELECT department.id, department.d_name FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id;",


        function (error, department) {
            if (error) throw error
            console.log ("\n")
            console.table(department)
        })
};

// "View all roles",
function byRole() {

    var manager = connection.query("SELECT employee.id, role.title, department.d_name AS department, role.salary AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;",


        function (error, manager) {
            if (error) throw error
            console.log ("\n")
            console.table(manager)
        })
};


// "Update employee manager"
function updateByManager(managerId, employeeId) {

    var updateManager = connection.query(
        "UPDATE employee SET manager_id = ? WHERE id = ?",
        [managerId, employeeId],
        function (error, updateManager) {
            if (error) throw error
            // console.table(manager)
        })

    byRole();

}

// "Add employee"
function addEmployee(employeeFirst, employeeLast, department, manager) {

    var add = connection.query(
        "INSERT INTO employee SET first_name = ?, last_name = ?, role_id = ?, manager_id = ?",
        [employeeFirst, employeeLast, department, manager],
        function (error, add) {
            if (error) throw error
        })

    byEmployees();
}

// Shows departments only, without employees
function departmentTable() {
    var depTable = connection.query("SELECT d_name FROM department;",


        function (error, depTable) {
            if (error) throw error
            console.table(depTable)
        })
}

// "Add Department"
function addDepartment(department) {

    var department = connection.query(
        "INSERT INTO department SET d_name = ?",
        [department],
        function (error, department) {
            if (error) throw error
            // console.table(manager)
        })

    departmentTable();
}

// Shows roles only, without employees: 

function roleTable() {
    var roleT = connection.query("SELECT title, salary, department_id FROM role;",

        function (error, roleT) {
            if (error) throw error
            console.table(roleT)
        })
}
// "Add role"
function addRole(title, salary, department_id) {

    var newRole = connection.query(
        "INSERT INTO role SET title = ?, salary = ?, department_id = ?",
        [title, salary, department_id],
        function (error, newRole) {
            if (error) throw error
            // console.table(manager)
        })

    roleTable();
}


// "Remove employee"
function removeEmployee(id) {

    var add = connection.query(
        "DELETE FROM employee WHERE id = ?",
        [id],
        function (error, id) {
            if (error) throw error
        })

    byEmployees();
}

// "Update employee role",
function updateByRole(employeeId, roleId) {

    var byRole = connection.query(
        "UPDATE employee SET role_id = ? WHERE id = ?",

        [roleId, employeeId],
        function (error, role) {
            if (error) throw error

        })
    byDepartment();

}

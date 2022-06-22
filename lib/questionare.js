const inquirer = require('inquirer');
const mysql2 = require('mysql2/promise');


class Questionare {
    constructor() {
        this.connection = mysql2.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'yuchencui',
            database: 'employee_db'
        });

        this.sqlDepartmentName = 'SELECT name FROM department';
        this.sqlRoleTitle = 'SELECT title FROM role';
        this.sqlEmployeeName = 'SELECT CONCAT(first_name, " ", last_name) AS name FROM employee';
    }
    async getChoiceStart() {  

        const { choice } = await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'What would you like to do?',
                choices: [  
                'View All Departments',  
                'View All Roles',
                'View All Employees',
                'View All Employees by manager',
                'View All Employees by department',
                'Add Department',
                'Add Role',
                'Add Employee',
                'Update Employee Manager',
                'Update Employee Role',
                'Delete Department',
                'Delete Role',
                'Delete Employee',
                'Exit']
            }
        ])
        return choice;
    };

    async addDepartment() {
        const { addDepartmentName } = await inquirer.prompt([
            {
                type: 'input',
                name: 'addDepartmentName',
                message: 'What is the name of the department?'
            }
        ])
        return addDepartmentName;
    }

    async addRole() {
        const connection = await this.connection;
        const [rows] = await connection.execute(this.sqlDepartmentName);
        const option = rows.map(item => item.name);
        await inquirer.prompt([
            {
                type: 'input',
                name: 'addRoleTitle',
                message: 'What is the title of the role?'
            },
            {
                type: 'number',
                name: 'salary',
                message: 'What is the salary of the role?'
            },
            {
                type: 'list',
                name: 'departmentName',
                message: 'Which department does the role belong to?',
                choices: option
            }
        ])
        .then(function (answer) {   
            const sqlInsert = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, (SELECT id FROM department WHERE name = ?))`;
            connection.execute(sqlInsert, [answer.addRoleTitle, answer.salary, answer.departmentName]);
            connection.end();
        })
    }


    async addEmployee() {
        const connection = await this.connection;
        const [rows1] = await connection.execute(this.sqlRoleTitle);
        const optionTitle = rows1.map(item => item.title);
        const [rows2] = await connection.execute(this.sqlDepartmentName);
        const optionDepartment = rows2.map(item => item.name);
        await inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'What is the first name of the employee?'
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'What is the last name of the employee?'
            },
            {
                type: 'list',
                name: 'roleTitle',
                message: 'What is the title of the employee?',
                choices: optionTitle
            },
            {
                type: 'list',
                name: 'manager',
                message: 'Who is the manager of the employee?',
                choices: optionDepartment
            }
        ])
        .then(function (answer) {
            const sqlInsert = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, (SELECT id FROM role WHERE title = ?), (SELECT id FROM department WHERE name = ?))`;
            connection.execute(sqlInsert, [answer.firstName, answer.lastName, answer.roleTitle, answer.manager]);   
            connection.end();
        })
    }

    async updateEmployeeRole() {
        const connection = await this.connection;
        const [rows1] = await connection.execute(this.sqlEmployeeName);
        const EmployeeNameOptions = rows1.map(item => item.name);
        const [rows2] = await connection.execute(this.sqlRoleTitle);
        const roleTitleOptions = rows2.map(item => item.title);
        await inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which employee would you like to update?',
                choices: EmployeeNameOptions
            },
            {
                type: 'list',
                name: 'updateRoleTitle',
                message: 'What is the title of the employee?',
                choices: roleTitleOptions
            }
        ])
        .then(function (answer) {
            const sqlUpdate = `UPDATE employee SET role_id = (SELECT id FROM role WHERE title = ?) WHERE CONCAT(first_name, " ", last_name) = ?`;
            connection.execute(sqlUpdate, [answer.updateRoleTitle, answer.employee]);
            connection.end();
        })
    }

    async updateEmployeeManager() {
        const connection = await this.connection;
        const [rows1] = await connection.execute(this.sqlEmployeeName);
        const EmployeeNameOptions = rows1.map(item => item.name);
        const [rows2] = await connection.execute(this.sqlEmployeeName);
        const managerOptions = rows2.map(item => item.name);
        await inquirer.prompt([
            {
                type: 'list',
                name: 'updateEmployee',
                message: 'Which employee would you like to update?',
                choices: EmployeeNameOptions
            },
            {
                type: 'list',
                name: 'updateManager',
                message: 'Who is the manager of the employee?',
                choices: managerOptions
            }
        ])
        .then(async function (answer) {
            const [managerId] = await connection.execute(`SELECT id FROM employee WHERE CONCAT(first_name, " ", last_name) = ?`, [answer.updateManager]);
            const sqlUpdate = `UPDATE employee SET manager_id = ? WHERE CONCAT(first_name, " ", last_name) = ?`;
            connection.execute(sqlUpdate, [managerId.map(item=>item.id).toString(), answer.updateEmployee]);
            connection.end();
        })
    }

    async deleteDepartmentName() {
        const connection = await this.connection;
        const [rows] = await connection.execute(this.sqlDepartmentName);
        const option = rows.map(item => item.name);
        await inquirer.prompt([
            {
                type: 'list',
                name: 'deleteDepartmentName',
                message: 'Which department would you like to delete?',
                choices: option
            }
        ]).then(function (answer) {
            connection.execute('SET FOREIGN_KEY_CHECKS=0');       
            const sqlDelete = `DELETE FROM department WHERE name = ?`;
            connection.execute(sqlDelete, [answer.deleteDepartmentName]);
            connection.execute('SET FOREIGN_KEY_CHECKS=1');
            connection.end();
        })
    }

    async deleteRoleTitle() { 
        const connection = await this.connection;
        const [rows] = await connection.execute(this.sqlRoleTitle);
        const option = rows.map(item => item.title);
        await inquirer.prompt([
            {
                type: 'list',
                name: 'deleteRoleTitle',
                message: 'Which role would you like to delete?',
                choices: option
            }
        ]).then(function (answer) {
            connection.execute('SET FOREIGN_KEY_CHECKS=0');       
            const sqlDelete = `DELETE FROM role WHERE title = ?`;
            connection.execute(sqlDelete, [answer.deleteRoleTitle]);
            connection.execute('SET FOREIGN_KEY_CHECKS=1');
            connection.end();
        })
    }

    async deleteEmployeeName() {
        const connection = await this.connection;
        const [rows] = await connection.execute(this.sqlEmployeeName);
        const option = rows.map(item => item.name);
        await inquirer.prompt([
            {
                type: 'list',
                name: 'deleteEmployeeName',
                message: 'Which employee would you like to delete?',
                choices: option
            }
        ]).then(function (answer) {
            connection.execute('SET FOREIGN_KEY_CHECKS=0');       
            const sqlDelete = `DELETE FROM employee WHERE CONCAT(first_name, " ", last_name) = ?`;
            connection.execute(sqlDelete, [answer.deleteEmployeeName]);
            connection.execute('SET FOREIGN_KEY_CHECKS=1');
            connection.end();
        })
    }


}

module.exports = Questionare;
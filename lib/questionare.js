const inquirer = require('inquirer');
const mysql2 = require('mysql2');


class Questionare {
    constructor() {
        this.connection = mysql2.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'yuchencui',
            database: 'employee_db'
        });
        
        this.departmentName = [];
        this.employeeTitle = [];
        this.employeeName = [];
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
                'View All Employees by department ',
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
        this.departmentName.push(addDepartmentName);
        return addDepartmentName;
    }

    async addRole() {
        const { addRoleTitle, salary, departmentName } = await inquirer.prompt([
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
                choices: this.departmentName
            }
        ])
        this.employeeTitle.push(addRoleTitle);
        return { addRoleTitle, salary, departmentName };
    }


    async addEmployee() {
        const { firstName, lastName, roleTitle, manager } = await inquirer.prompt([
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
                choices: this.employeeTitle
            },
            {
                type: 'list',
                name: 'manager',
                message: 'Who is the manager of the employee?',
                choices: this.employeeName
            }
        ])
        this.employeeName.push(`${firstName} ${lastName}`);
        return { firstName, lastName, roleTitle, manager };
    }

    async updateEmployeeRole() {
        const { employee, updateRoleTitle } = await inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which employee would you like to update?',
                choices: this.employeeName
            },
            {
                type: 'list',
                name: 'updateRoleTitle',
                message: 'What is the title of the employee?',
                choices: this.employeeTitle
            }
        ])
        return { employee, updateRoleTitle };
    }

    async updateEmployeeManager() {
        const { employee, updateManager } = await inquirer.prompt([
            {
                type: 'list',
                name: 'updateEmployee',
                message: 'Which employee would you like to update?',
                choices: this.employeeName
            },
            {
                type: 'list',
                name: 'updateManager',
                message: 'Who is the manager of the employee?',
                choices: this.employeeName
            }
        ])
        return { employee, updateManager };
    }

    async deleteDepartment() {
        const dName = await this.getDepartmentOptions();
        const { deleteDepartmentName } = await inquirer.prompt([
            {
                type: 'list',
                name: 'deleteDepartmentName',
                message: 'Which department would you like to delete?',
                choices: dName
            }
        ])
        return deleteDepartmentName;
    }

    async deleteRole() { 
        const { deleteRoleTitle } = await inquirer.prompt([
            {
                type: 'list',
                name: 'deleteRoleTitle',
                message: 'Which role would you like to delete?',
                choices: this.employeeTitle
            }
        ])
        return deleteRoleTitle;
    }

    async deleteEmployee() {
        const { employee } = await inquirer.prompt([
            {
                type: 'list',
                name: 'deleteDepartmentName',
                message: 'Which employee would you like to delete?',
                choices: this.employeeName
            }
        ])
        return employee;
    }

    async getDepartmentOptions() {
        const DeOptions = this.connection.execute('SELECT name FROM department', function (err, res) {
            if (err) throw err;
            let getOptions = [];
            getOptions.push(res);
            const departmentNameOptions = getOptions[0].map(item => item.name);
            return departmentNameOptions;           
        });
        return DeOptions;        
    }

    async getRoleOptions() {
        const { getEmployeeTitleOptions } = this.connection.execute('SELECT title FROM role', function (err, res) {
            if (err) throw err;
            let getOptions = [];
            getOptions.push(res);
            this.employeeTitleOptions = getOptions[0].map(item => item.title);
            return this.employeeTitleOptions;
        });
        return getEmployeeTitleOptions;
    }
    
    async getEmployeeOptions() {
        const { getEmployeeNameOptions } = this.connection.execute('SELECT CONCAT(first_name, " ", last_name) AS name FROM employee', function (err, res) {
            if (err) throw err;
            let getOptions = [];
            getOptions.push(res);
            this.employeeNameOptions = getOptions[0].map(item => item.name);
            return this.employeeNameOptions;
        }); 
        
        return getEmployeeNameOptions;
    }

}

module.exports = Questionare;
const View = require('./view.js');
const Questionare = require('./questionare.js');
const mysql2 = require('mysql2');

class Start{
    constructor(){
        this.sql = '';
    }

    async init() {
        const questionare = new Questionare();       
        const choice = await questionare.getChoiceStart();
        if(choice === 'Exit'){
            console.log('Bye!');
            process.exit();
        } else {
            this.reset(choice);
        }
    }
  
    async reset(choice) {
        const view = new View();
        switch (choice) {
            case 'View All Departments':
                this.sql = 'SELECT * FROM department';
                await view.runSql(this.sql);
                this.delayInit();
                break;
            case 'View All Roles':
                this.sql = 'SELECT role.id, role.title, department.name AS department, role.salary  FROM role LEFT JOIN department ON role.department_id = department.id';
                await view.runSql(this.sql);
                this.delayInit();
                break;
            case 'View All Employees':                
                this.sql = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id';
                await view.runSql(this.sql);
                this.delayInit();
                break;
            case 'View All Employees by manager':
                this.sql = 'SELECT CONCAT(employee.first_name, " ", employee.last_name) AS name, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN employee manager ON manager.id = employee.manager_id';
                await view.runSql(this.sql);
                this.delayInit();
                break;
            case 'View All Employees by department':
                this.sql = 'SELECT CONCAT(employee.first_name, " ", employee.last_name) AS name, department.name AS department FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id';
                await view.runSql(this.sql);
                this.delayInit();
                break;
            case 'Add Department':
                const addDep = new Questionare();
                const addDepartmentName = await addDep.addDepartment();
                this.sql = `INSERT INTO department (name) VALUES ('${addDepartmentName}')`;
                await view.runSql(this.sql);
                this.delayInit();
                break;
            case 'Add Role':
                const role = new Questionare();             
                await role.addRole();
                this.delayInit();
                break;
            case 'Add Employee':
                const employees = new Questionare();
                await employees.addEmployee();
                this.delayInit();
                break; 
            case 'Update Employee Role':
                const employeeRole = new Questionare();
                await employeeRole.updateEmployeeRole();
                this.delayInit();
                break;
            case 'Update Employee Manager':
                const employeeManager = new Questionare();
                await employeeManager.updateEmployeeManager();
                this.delayInit();
                break;
            case 'Delete Department':
                const deleteDepartment = new Questionare();
                this.sql = 'SELECT name FROM department';
                await deleteDepartment.deleteDepartmentName(this.sql);
                this.delayInit();
                break;
            case 'Delete Role':
                const deleteRole = new Questionare();
                this.sql = 'SELECT title FROM role';
                await deleteRole.deleteRoleTitle(this.sql);
                this.delayInit();
                break;
            case 'Delete Employee':
                const deleteEmployee = new Questionare();
                this.sql = 'SELECT CONCAT(first_name, " ", last_name) AS name FROM employee';
                await deleteEmployee.deleteEmployeeName(this.sql);   
                this.delayInit();
                break;
            case 'Exit':
                console.log('Exiting...');
                break;
            default:
                console.log('Invalid choice');
                break;
        }
    }

    async delayInit() {
        setTimeout(() => {
            this.init();
            }, 100);
    }
}

module.exports = Start;


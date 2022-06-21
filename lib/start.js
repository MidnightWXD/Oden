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
            case 'Add Department':
                const addDep = new Questionare();
                const addDepartmentName = await addDep.addDepartment();
                this.sql = `INSERT INTO department (name) VALUES ('${addDepartmentName}')`;
                await view.runSql(this.sql);
                this.delayInit();
                break;
            case 'Add Role':
                const role = new Questionare();              
                const { addRoleTitle, salary, departmentName } = await role.addRole();
                this.sql = `INSERT INTO role (title, salary, department_id) VALUES ('${addRoleTitle}', ${salary}, (SELECT id FROM department WHERE name = '${departmentName}'))`;
                await view.runSql(this.sql);
                this.delayInit();
                break;
            case 'Add Employee':
                const employees = new Questionare();
                const { firstName, lastName, roleTitle, manager } = await employees.addEmployee();
                if(manager === 'None'){
                    this.sql = `INSERT INTO employee (first_name, last_name, role_id) VALUES ("${firstName}", "${lastName}", (SELECT id FROM role WHERE title = "${roleTitle}"))`;
                } else {
                    this.sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${firstName}", "${lastName}", (SELECT id FROM role WHERE title = "${roleTitle}"), (SELECT id FROM employee manager WHERE CONCAT(manager.first_name, " ", manager.last_name) = "${manager}"))`;                   
                }
                await view.runSql(this.sql);
                this.delayInit();

                break; 
            case 'Update Employee Role':
                const employeeRole = new Questionare();
                const { employee, updateRoleTitle } = await employeeRole.updateEmployeeRole();
                this.sql = `UPDATE employee SET role_id = (SELECT id FROM role WHERE title = '${updateRoleTitle}') WHERE CONCAT(first_name, " ", last_name) = '${employee}'`;
                await view.runSql(this.sql);
                this.delayInit();
                break;
            case 'Update Employee Manager':
                const employeeManager = new Questionare();
                const { updateEmployee, updateManager } = await employeeManager.updateEmployeeManager();
                this.sql = `UPDATE employee SET manager_id = (SELECT id FROM employee WHERE CONCAT(first_name, " ", last_name) = '${updateManager}') WHERE CONCAT(first_name, " ", last_name) = '${updateEmployee}'`;
                await view.runSql(this.sql);
                this.delayInit();
                break;
            case 'Delete Department':
                const deleteDepartment = new Questionare();
                const { deleteDepartmentName } = await deleteDepartment.deleteDepartment();
                this.sql = `DELETE FROM department WHERE name = '${deleteDepartmentName}'`;
                await view.runSql(this.sql);
                this.delayInit();
                break;
            case 'Delete Role':
                const deleteRole = new Questionare();
                const { deleteRoleTitle } = await deleteRole.deleteRole();
                this.sql = `DELETE FROM role WHERE title = '${deleteRoleTitle}'`;
                await view.runSql(this.sql);
                this.delayInit();
                break;
            case 'Delete Employee':
                await this.getOptions();
                const deleteEmployee = new Questionare(this.employeeNameOptions);
                const { deleteEmployeeName } = await deleteEmployee.deleteEmployee();
                this.sql = `DELETE FROM employee WHERE CONCAT(first_name, " ", last_name) = '${deleteEmployeeName}'`;
                await view.runSql(this.sql);
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

    // async getOptions() {
    //     const { getDepartmentOptions }  = this.connection.execute('SELECT name FROM department', function (err, res) {
    //         if (err) throw err;
    //         let getOptions = [];
    //         getOptions.push(res);
    //         this.departmentNameOptions = getOptions[0].map(item => item.name);
    //         return this.departmentNameOptions;           
    //     });

    //     const { getEmployeeTitleOptions } = this.connection.execute('SELECT title FROM role', function (err, res) {
    //         if (err) throw err;
    //         let getOptions = [];
    //         getOptions.push(res);
    //         this.employeeTitleOptions = getOptions[0].map(item => item.title);
    //         return this.employeeTitleOptions;
    //     });
        
    //     const { getEmployeeNameOptions } = this.connection.execute('SELECT CONCAT(first_name, " ", last_name) AS name FROM employee', function (err, res) {
    //         if (err) throw err;
    //         let getOptions = [];
    //         getOptions.push(res);
    //         this.employeeNameOptions = getOptions[0].map(item => item.name);
    //         return this.employeeNameOptions;
    //     }); 
        
    //     return { getEmployeeNameOptions, getDepartmentOptions, getEmployeeTitleOptions };
    // }

}

module.exports = Start;


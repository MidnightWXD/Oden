const inquirer = require('inquirer');
const mysql2 = require('mysql2');

var dNameArray;
class Test {
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

    async getDepartmentOptions() {
        const anyName = await this.connection.execute('SELECT name FROM department', function (err, res) {
            if (err) throw err;
            let getOptions = [];
            getOptions.push(res);
            console.log(getOptions);
            const dName = getOptions[0].map(item => item.name);
            console.log(dName);
            dNameArray = dName;          
        });
        // console.log(getDepartment);
        // this.departmentName = getDepartmentOptions;
        // return this.departmentName;
        return anyName; 
        this.connection.end();       
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

const test = new Test();
// test.getDepartmentOptions();
const doit = test.getDepartmentOptions();
console.log(doit);
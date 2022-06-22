const inquirer = require('inquirer');
const mysql2 = require('mysql2/promise');

// var dNameArray;
// class Test {
//     constructor() {
//         this.connection = mysql2.createConnection({
//             host: 'localhost',
//             user: 'root',
//             password: 'yuchencui',
//             database: 'employee_db'
//         });

//         this.departmentName = [];
//         this.employeeTitle = [];
//         this.employeeName = [];
//     }

//     async getDepartmentOptions() {
//         const anyName = await this.connection.execute('SELECT name FROM department', function (err, res) {
//             if (err) throw err;
//             let getOptions = [];
//             getOptions.push(res);
//             console.log(getOptions);
//             const dName = getOptions[0].map(item => item.name);
//             console.log(dName);
//             dNameArray = dName;          
//         });
//         // console.log(getDepartment);
//         // this.departmentName = getDepartmentOptions;
//         // return this.departmentName;
//         return anyName; 
//         this.connection.end();       
//     }

//     async getRoleOptions() {
//         const { getEmployeeTitleOptions } = this.connection.execute('SELECT title FROM role', function (err, res) {
//             if (err) throw err;
//             let getOptions = [];
//             getOptions.push(res);
//             this.employeeTitleOptions = getOptions[0].map(item => item.title);
//             return this.employeeTitleOptions;
//         });
//         return getEmployeeTitleOptions;
//     }
    
//     async getEmployeeOptions() {
//         const { getEmployeeNameOptions } = this.connection.execute('SELECT CONCAT(first_name, " ", last_name) AS name FROM employee', function (err, res) {
//             if (err) throw err;
//             let getOptions = [];
//             getOptions.push(res);
//             this.employeeNameOptions = getOptions[0].map(item => item.name);
//             return this.employeeNameOptions;
//         }); 
        
//         return getEmployeeNameOptions;
//     }
// }   

// const test = new Test();
// // test.getDepartmentOptions();
// const doit = test.getDepartmentOptions();
// console.log(doit);



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

    // departmentName = await this.connection.query( `SELECT name FROM department`, [name])
    // employeeTitle = await this.connection.query( `SELECT title FROM role`, [title])
    // employeeName = await this.connection.query( `SELECT CONCAT(first_name, " ", last_name) AS name FROM employee`, [name])
    // this.connection.end();

       


    
        
}

// const connection = mysql2.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'yuchencui',
//     database: 'employee_db'
//   });

//   //get department name from database as an array
// function dododo() {
//     return  ((resolve, reject) => {
//         connection.query( `SELECT name FROM department`,  function (err, res) {
//             if (err) throw err;
//             let getOptions = [];
//             getOptions.push(res);
//             const dName = getOptions[0].map(item => item.name);
//             console.log(dName);
//             resolve(dName);
//         });
//     }
//     )}

// const kk = dododo();
// console.log(kk);


    


// const questionare = new Questionare();
// questionare.getDepartmentOptions();

// const connection = mysql2.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'yuchencui',
//     database: 'employee_db'
//   });

const sql = 'SELECT CONCAT(first_name, " ", last_name) AS name FROM employee';

async function getDepartmentOptions(sql) {
    const connection = await mysql2.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'yuchencui',
        database: 'employee_db'
      });
    const [rows, fields] = await connection.execute(sql);
    const dName = rows.map(item => item.name);
    inquirer.prompt([
        {
            type: 'list',
            name: 'deleteDepartmentName',
            message: 'Which department would you like to delete?',
            choices: dName
        }
    ]).then(function (answer) {
        connection.execute('SET FOREIGN_KEY_CHECKS=0');       
        const sqlDelete = `DELETE FROM department WHERE name = ?`;
        connection.execute(sqlDelete, [answer.deleteDepartmentName]);
        connection.execute('SET FOREIGN_KEY_CHECKS=1');
        connection.end();
    })
}

async function deleteRoleTitle(sql) { 
    const connection = await mysql2.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'yuchencui',
        database: 'employee_db'
      });
    const [rows, fields] = await connection.execute(sql);
    // const dName = rows.map(item => item.title);
    console.log(rows);
    // await inquirer.prompt([
    //     {
    //         type: 'list',
    //         name: 'deleteRoleTitle',
    //         message: 'Which role would you like to delete?',
    //         choices: dName
    //     }
    // ]).then(function (answer) {
    //     connection.execute('SET FOREIGN_KEY_CHECKS=0');       
    //     const sqlDelete = `DELETE FROM role WHERE title = ?`;
    //     connection.execute(sqlDelete, [answer.deleteRoleTitle]);
    //     connection.execute('SET FOREIGN_KEY_CHECKS=1');
    //     connection.end();
    // })
}

deleteRoleTitle(sql);
// async function getOptions() {
// const dNameArray = await getDepartmentOptions(sql)
//     .then(dName => {        
//         console.log(dName);
//         return dName;
//     })
//     .catch(err => {
//         console.log(err);
//     }
//     );
//     return dNameArray;
// }
// console.log(getOptions());



// try{
//     const getDepartment = getDepartmentOptions(sql);
//     if(getDepartment) {
//     console.log(getDepartment);
//     }
// } catch(err){

//     console.log(err);
// }


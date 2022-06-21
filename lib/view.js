const mysql2 = require('mysql2');
const cTable = require('console.table');


class View {
    constructor() {
        this.connection = mysql2.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'yuchencui',
            database: 'employee_db'
        });
    }

    async runSql(sql) {
        this.connection.execute(sql, function (err, res) {
            if (err) throw err;
            const table = cTable.getTable(res);
            console.table(table);
        });
        this.connection.end();
    }

}



module.exports = View;
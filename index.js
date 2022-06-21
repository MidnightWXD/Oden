const Start = require('./lib/start.js');
const showTitle = require('./lib/title.js');
const start = new Start();

function init() {
    showTitle();
    
    setTimeout(() => {
    start.init();
    }, 100);

}

init();

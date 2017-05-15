import fs from 'fs';
import path from 'path';
import cron from 'node-cron';

// import all crontabs
// every file in crontab/ should return json config with expression and func definition
// expression : '*/10 * * * *', // (send every 10 minutes)
// func : sendRemindEmail
function startCron() {
  fs.readdirSync(__dirname).filter(file =>
     (file.lastIndexOf('.js') >= 0) && (file !== 'index.js')
  ).map((file) => {
    const config = require(path.join(__dirname, file)).default;
    cron.schedule(config.expression, config.func, true);
    if (config.immediateStart) {
      config.func();
    }
    return file;
  });
}

export default startCron;

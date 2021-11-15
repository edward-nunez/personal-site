// Script for changing workspace to client directory. Makes it so client/package.json is root
// and not ./package.json
const args = ['start'];
const opts = { stdio: 'inherit', cwd: 'client', shell: true };

require('child_process').spawn('yarn', args, opts);

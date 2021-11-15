// Script for changing workspace to client directory. Makes it so client/package.json is root
// and not ./package.json
const { spawn } = require('child_process');

const args = ['build'];
const opts = { stdio: 'inherit', cwd: 'client', shell: true };

const handleCode = (code) => {
  if (code !== 0) {
    console.log(`build process exited with code ${code}`);
  }
};

// Delete existing production build
spawn('rm', ['-r', './server/_static', '2>/dev/null']).on('close', (rmCode) => {
  handleCode(rmCode);

  // Build production files
  spawn('yarn', args, opts).on('close', (yarnCode) => {
    handleCode(yarnCode);

    // Move production build
    spawn('mv', ['./client/build', './server/_static']);
  });
});

## How to run this script?

1. Clone this repository in same folder as "monitoratoken_pipeline" (in the server is "$HOME/files")
1. Install dependecies using npm ```npm i```
1. Install PM2 for process management ```npm install pm2@latest -g```
1. Execute bash command to set PM2 to startup after server reboot ```pm2 startup```
1. Pay attention to last command output. It says to run a bash command using sudo to ensure PM2 to really start after server reboot
1. Run ```pm2 start src/server.js``` in bash to start listener using PM2
1. Run ```$ pm2 save``` to ensure that processes manage by PM2 spawns after reboot and keep them running after crashes

# How to Run This Script

Follow the steps below to set up and run this script properly:

## 1. Clone the Repository
Clone this repository **in the same folder as** `monitoratoken_pipeline`.
On the server, the expected path is:
```bash
git clone <repo_url> "$HOME/files/<repo_name>"
```

## 2. Install Dependencies
Install the project dependencies using npm:
```bash
npm install
```

## 3. Install PM2 for Process Management
Install PM2 globally to manage the server process:
```bash
npm install pm2@latest -g
```

## 4. Configure PM2 to Start on Boot
Run the following command to configure PM2 to start automatically after a server reboot:
```bash
pm2 startup
```
⚠ **Important:**
The command above will output another command that must be run with `sudo`.
Make sure to execute that command to complete the setup and ensure PM2 starts on boot.

## 5. Start the Server with PM2
To start the listener using PM2, run:
```bash
pm2 start src/server.js
```

## 6. Save the PM2 Process List
To make sure PM2 restores your processes after reboot or crashes, run:
```bash
pm2 save
```

let server = require('ws').Server;
let fs = require('fs');
let fetch = require('node-fetch');

let dateDir = new Date();
dateDir = dateDir.getMonth() + 1 + '_' + dateDir.getDate();

let logFilePath = './log/' + dateDir;
let chatLogFileName = 'chat.log';
let reactionLogFileName = 'reaction.log';

if (!fs.existsSync(logFilePath)) {
    fs.mkdirSync(logFilePath);
}

let chatServerPort = 5000;
let reactionServerPort = 5001;
let info = 5002;

let chatServerInstance = new server({port: chatServerPort});
let reactionServerInstance = new server({port: reactionServerPort});
let infoInstance = new server({port: info});

chatServerInstance.on('connection', (ws) => {
    ws.on('message', (msg) => {
        chatServerInstance.clients.forEach((client) => {
            let message = msg.toString();
            let regex = /^\n/gm;

            message = message.replace(regex, '');

            let chatLog = getServerDate() + ': ' + message + "\n";

            fs.appendFile(logFilePath + '/' + chatLogFileName, chatLog, (err) => {
                if (err) {
                    console.log(err);
                }
            });

            client.send(message);
        });
    });

    ws.on('close', () => {
        console.log("チャットサーバーを切断：");
    });
});

reactionServerInstance.on('connection', (ws) => {
    ws.on('message', (msg) => {
        reactionServerInstance.clients.forEach((client) => {
            let reactionLog = getServerDate() + ': ' + msg + "\n";

            fs.appendFile(logFilePath + '/' + reactionLogFileName, reactionLog, (err) => {
                if (err) {
                    console.log(err);
                }
            });

            client.send(msg.toString());
        });
    });

    ws.on('close', () => {
        console.log('リアクションサーバーを切断：');
    });
});

/**
 * jsonをdb代わりに使う
 */

// 環境ごとに変える
let dbPath = './db/';
let infoDb = 'info_db.json';
let dbURL = dbPath + infoDb;

infoInstance.on('connection', (ws) => {
    ws.on('message', (msg) => {
        infoInstance.clients.forEach((client) => {

            let info = msg.toString();

            fs.writeFile(dbURL, info, (err) => {
                if (err) {
                    console.log(err);
                }
            });

            client.send(info);
        });
    });
});

function getServerDate() {
    let date = new Date();

    let timeHours = date.getHours().toString(10).padStart(2, '0');
    let timeMinutes = date.getMinutes().toString(10).padStart(2, '0');
    let timeSeconds = date.getSeconds().toString(10).padStart(2, '0');

    return timeHours + ':' + timeMinutes + ':' + timeSeconds;
}
let server = require("ws").Server;
let chatServerPort = 5000;
let reactionServerPort = 5001;

let chatServerInstance = new server({port: chatServerPort});
let reactionServerInstance = new server({port: reactionServerPort});

chatServerInstance.on("connection", (ws) => {
    ws.on("message", (msg) => {
        chatServerInstance.clients.forEach((client) => {
            // let timeHours = new Date().getHours().toString(10).padStart(2, '0');
            // let timeMinutes = new Date().getMinutes().toString(10).padStart(2, '0');
            // let timeSeconds = new Date().getSeconds().toString(10).padStart(2, '0');

            // console.log("send: " + msg + ':' + timeHours + ':' + timeMinutes + ':' + timeSeconds);
            let message = msg.toString();
            let regex = /^\n/gm;

            message = message.replace(regex, '');

            console.log('send: ' + message);

            client.send(message);
        });
    });

    ws.on("close", () => {
        console.log("チャットサーバーを切断：");
    })
});

reactionServerInstance.on("connection", (ws) => {
    ws.on("message", (msg) => {
        reactionServerInstance.clients.forEach((client) => {
            console.log("send: " + msg);

            client.send(msg.toString());
        });
    });

    ws.on("close", () => {
        console.log("リアクションサーバーを切断：");
    })
});

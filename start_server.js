let server = require("ws").Server;
let serverInstance = new server({port: 5000});
let reactionServer = new server({port: 5001});

serverInstance.on("connection", (ws) => {
    ws.on("message", (msg) => {
        console.log("receive: " + msg);

        serverInstance.clients.forEach((client) => {
            console.log("send: " + msg);

            client.send(msg.toString());
        });
    });

    ws.on("close", () => {
        console.log("close");
    })
});

reactionServer.on("connection", (ws) => {
    ws.on("message", (msg) => {
        console.log("receive: " + msg);

        reactionServer.clients.forEach((client) => {
            console.log("send: " + msg);

            client.send(msg.toString());
        });
    });

    ws.on("close", () => {
        console.log("close");
    })
});

var osc = require("osc"),
    express = require("express"),
    WebSocket = require("ws");

var fs = require('fs');


// draft of serving basic page from node also
const app2 = express();
const SERVING_PORT = 9000;

app2.use(express.static('.'));

app2.get('/', (req, res) => {
    res.send('Hello World!')
});

app2.listen(SERVING_PORT, () => {
    console.log(`serving app listening at http://localhost:${SERVING_PORT}`)
});

app2.use(
    express.urlencoded({
        extended: true
    })
);
  
app2.use(express.json());


function warnIfError(err, msg){
    if(err) console.warn(msg);
}

app2.post('/saveGestureLoops', (req, res) => {
    console.log('body', req.body);
    let {loopsAndMetaData, sketchPath, loopSetName } = req.body;
    console.log("sketch path", sketchPath);
    let sketchDir = sketchPath.slice(1);
    fs.open(`${sketchDir}/${loopSetName}_${Date.now()}.json`, 'w', (err, loopFile) => {
        warnIfError(err, "error creating loop file");
        fs.writeFile(loopFile, JSON.stringify(loopsAndMetaData), err => warnIfError(err, "error writing loop file"));
        fs.close(loopFile, err => warnIfError(err, "error writing loop file"));
    });
    
    res.sendStatus(200);
})


const WEB_SOCKET_PORT = 8081;
const OSC_PORT = 57121;

var getIPAddresses = function () {
    var os = require("os"),
        interfaces = os.networkInterfaces(),
        ipAddresses = [];

    for (var deviceName in interfaces) {
        var addresses = interfaces[deviceName];
        for (var i = 0; i < addresses.length; i++) {
            var addressInfo = addresses[i];
            if (addressInfo.family === "IPv4" && !addressInfo.internal) {
                ipAddresses.push(addressInfo.address);
            }
        }
    }

    return ipAddresses;
};

// Bind to a UDP socket to listen for incoming OSC events.
var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: OSC_PORT
});

udpPort.on("ready", function () {
    var ipAddresses = getIPAddresses();
    console.log("Listening for OSC over UDP.");
    ipAddresses.forEach(function (address) {
        console.log(" Host:", address + ", Port:", udpPort.options.localPort);
    });
    console.log("To start the demo, go to http://localhost:8081 in your web browser.");
});

udpPort.open();

// Create an Express-based Web Socket server to which OSC messages will be relayed.
var appResources = __dirname + "/web",
    app = express(),
    server = app.listen(WEB_SOCKET_PORT),
    wss = new WebSocket.Server({
        server: server
    });

app.use("/", express.static(appResources));
wss.on("connection", function (socket) {
    console.log("A Web Socket connection has been established!");
    var socketPort = new osc.WebSocketPort({
        socket: socket
    });

    var relay = new osc.Relay(udpPort, socketPort, {
        raw: true
    });
});

udpPort.on("message", (...args) => {
    console.log("osc message", args);
})
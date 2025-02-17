var express = require('express')
var bodyParser = require('body-parser');
var logger = require('morgan');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const normalizarTelefono = require('./util');

var app = express();
const client = new Client({
    puppeteer: {
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    authStrategy: new LocalAuth({
        clientId: 'esmassiva-sender',
        dataPath: 'localAuth'
    })
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Client is ready!');
});

// When the client received QR-Code
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

// Start your client
client.initialize();

// Routes
app.post('/send-message', async (req, res) => {
    const number = normalizarTelefono(req.body.phone_number);

    const number_details = await client.getNumberId(number); // get mobile number details

    if (number_details) {
        await client.sendMessage(number_details._serialized, req.body.message); // send message
        console.log("Message sent successfully");

        res.status(200).json({ success: true, message: 'Message sent successfully' });
    } else {
        console.log("Mobile number is not registered");

        res.status(500).json({ error: true, message: 'Mobile number is not registered' });
    }
})

app.use('*', (req, res) => {
    res.status(404).json({ error: true, message: 'Not Found' });
})

//Closing correcily using CTRL+C 
process.on('SIGINT', async () => {
    console.log('(SIGINT) Shutting down...');
    await client.destroy();
    console.log('client destroyed');
    process.exit(0);
});

module.exports = app;

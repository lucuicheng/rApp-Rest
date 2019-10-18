var amqpManager = require('../../app/settings/amqpManager');

async function handler(body) {
    console.log('Processing: ' + JSON.stringify(body));
    // Handle message from queue
    return true;
}

amqpManager(handler);

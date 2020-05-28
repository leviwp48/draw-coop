// creates a message object to send to the client side when sockets are activated
const moment = require('moment');

function formatMessage(username, text, id) {
    return {
        username,
        text,
        id,
        time: moment().format('h:mm a')
    };
}

module.exports = formatMessage;
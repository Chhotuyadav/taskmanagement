// /utils/events.js
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

eventEmitter.on('testEvent', (data) => {
    console.log("Test Event received:", data);
  });
  
module.exports = eventEmitter;

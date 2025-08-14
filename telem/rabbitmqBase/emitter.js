const EventEmitter = require("events");

class Emitter {
  static emitter = new EventEmitter();
  static emit(event, data) {
    this.emitter.emit(event, data);
  }
  static on(event, callback) {
    this.emitter.on(event, callback);
  }
}

module.exports = { Emitter };

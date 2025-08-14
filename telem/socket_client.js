const io = require("socket.io-client");

class SocketIOClient {
  constructor(serverUrl, options) {
    this.serverUrl = serverUrl;
    this.options = options || {};
    this.socket = io(this.serverUrl, this.options);
    this.connected = false;
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    // Event handler for successful connection
    this.socket.on("connect", () => {
      console.log("socket connected" + this.socket.id); // x8WIv7-mJelg7on_ALbx
    });
    // Event handler for disconnection
    this.socket.on("disconnect", (reason) => {
      // this.connected = false;
      console.log(`Disconnected from the server. Reason: ${reason}...`);
      this.connected = false;
    });
    // Event handler for disconnection
    this.socket.on("error", (reason) => {
      // this.connected = false;
      console.log(`error from the server. Reason: ${reason}`);
      this.socket.connect();
    });
    this.socket.on("reconnect", () => {
      console.log("reconnecting....");
    });

    // Handle other events as needed
  }
  connect() {
    this.socket.connect();
  }
  // If you want to manually disconnect the socket
  disconnect() {
    this.socket.disconnect();
  }
  joinroom(roomname) {
    this.socket.emit("join", roomname);
  }
  leaveroom(roomname) {
    this.socket.emit("leave", roomname);
  }
  sendtoserver(event, data) {
    this.socket.emit(event, data);
  }
}

module.exports = { SocketIOClient };

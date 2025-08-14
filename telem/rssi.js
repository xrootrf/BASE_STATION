// const { exec } = require('child_process');

// function getSignalInfo(interface) {
//     return new Promise((resolve, reject) => {
//         exec(`iw dev ${interface} link`, (error, stdout, stderr) => {
//             if (error) {
//                 reject(error);
//                 return;
//             }
//             // Parsing the output to extract signal information
//             const signalInfo = {};
//             const lines = stdout.split('\n');
//             lines.forEach(line => {
//                 if (line.includes('signal')) {
//                     const signalStrength = line.split(' ')[1];
//                     signalInfo.signalStrength = signalStrength;
//                 } else if (line.includes('tx bitrate')) {
//                     const txBitrate = line.split(' ')[2];
//                     signalInfo.txBitrate = txBitrate;
//                 }
//             });
//             resolve(signalInfo);
//         });
//     });
// }

// // Example usage:
// const interface = 'wlan1';
// getSignalInfo(interface)
//     .then(signalInfo => {
//         console.log(signalInfo);
//     })
//     .catch(error => {
//         console.error(error);
//     });



const { Client } = require('ssh2');

const connSettings = {
  host: 'your_host',
  port: 22,
  username: 'your_username',
  password: 'your_password'
};

const commandToRun = 'your_shell_command';

const conn = new Client();

conn.on('ready', function() {
  conn.exec(commandToRun, function(err, stream) {
    if (err) throw err;
    stream.on('close', function(code, signal) {
      console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
      conn.end();
    }).on('data', function(data) {
      console.log('STDOUT: ' + data);
    }).stderr.on('data', function(data) {
      console.log('STDERR: ' + data);
    });
  });
}).connect(connSettings);
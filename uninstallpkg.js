const fs = require('fs');
const path = require('path');

const directory = process.cwd();


fs.readdir(directory, (err, files) => {
  if (err) throw err;
  process.on('uncaughtException', function (exception) {
    // handle or ignore error
   });

  for (const file of files) {
    fs.unlink(path.join(directory, file), err => {
      if (err) throw err;
      process.on('uncaughtException', function (exception) {
        // handle or ignore error
       });
    });
  }
});
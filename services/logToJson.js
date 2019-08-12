const fs = require("fs");
const readline = require("readline");

exports.toJsonObj = filepath => {
  return new Promise((res, rej) => {
    const interface = readline.createInterface({
      input: fs.createReadStream(filepath)
    });

    let lineNumber = 0;
    let dataLog = [];
    interface.on("line", line => {
      lineNumber++;
      let cols = line
        .replace("\t", "")
        .split("|")
        .map(i => i.trim());
      dataLog.push({
        hora: cols[0],
        piloto: cols[1].toString("utf8"),
        numVolta: cols[2],
        timeVolta: cols[3],
        velocityAvg: cols[4]
      });

      res(dataLog);
    });
  });
}

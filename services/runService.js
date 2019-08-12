exports.posicaoChegada = data => {
  return data
    .filter(val => val.numVolta === "4")
    .sort((a, b) => a.numVolta - b.numVolta)
    .map(async (value, index) => {
      let datetime = await _getDateTime(value.hora);
      const time = await _calculateTotalTime(data, value);
      const result = {
        codigo: value.piloto.split("-")[0].trim(),
        nome: value.piloto.split("-")[1].trim(),
        totalvoltas: value.numVolta,
        totalTime: time.tempoTotal,
        melhorVolta: time.melhorVolta,
        horaUltimaVolta: value.hora,
        datetimeUltimaVolta: datetime
      };

      return result;
    });
};

function _calculateTotalTime(data, value) {
  return new Promise(async (res, rej) => {
    let min = 0;
    let sec = 0;
    let msec = 0;
    let _minT = 0;
    let _secT = 0;
    let _msecT = 0;
    let arr = [];
    const val = data
      .filter(item => item.piloto === value.piloto)
      .map((item, index) => {
        arr.push(item.timeVolta);
      });

    arr.forEach(time => {
      let _arrT1 = time.split(":");
      let _arrT2 = _arrT1[1].split(".");

      _minT += +_arrT1[0];
      _secT += +_arrT2[0];
      _msecT += +_arrT2[1];
    });

    msec = _msecT % 1000;
    _secT += Math.floor(_msecT / 1000);

    sec = _secT % 60;
    _minT += Math.floor(_secT / 60);

    min = _minT;

    res({
      tempoTotal: `${min}:${sec}.${msec}`,
      melhorVolta: await _getMelhorVolta(arr)
    });
  });
}

function _getDateTime(value) {
  return new Promise((resolve, reject) => {
    let hMs = value.split(":");
    let mili = hMs[2].split(".");
    let datetime = new Date(
      null,
      null,
      null,
      +hMs[0] ? +hMs[0] : null,
      +hMs[1],
      +mili[0],
      +mili[1]
    );

    resolve(datetime);
  });
}

function _getMelhorVolta(arr) {
  return new Promise((resolve, reject) => {
    const v = arr.map(async val => {
      return _getDateTime(null + ":" + val);
    });

    Promise.all(v).then(value => {
      let m = value.sort((a, b) => a - b);
      let val = m[0].getMinutes() + ":" + m[0].getSeconds() + ":" + m[0].getMilliseconds();
      resolve(val);
    });
  });
}

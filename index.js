const { toJsonObj } = require('./services/logToJson');
const { posicaoChegada } = require('./services/runService');

toJsonObj("./data.txt").then(val => {
  const posicao = posicaoChegada(val);
  Promise.all(posicao).then(value => {
    value
      .sort((a, b) => a.datetimeUltimaVolta - b.datetimeUltimaVolta)
      .map((val, i) => {
        val.posicao = i + 1;
        return val;
      });

    _printResult(value);
  })
});

function _printResult(value) {
  value.forEach(val => {
    console.log('POSICAO | COD-NOME          | VOLTAS | TEMPO TOTAL | MELHOR VOLTA');
    console.log(`${val.posicao}       | ${val.codigo}-${val.nome}    | ${val.totalvoltas}      | ${val.totalTime}   | ${val.melhorVolta}`);
  });
}

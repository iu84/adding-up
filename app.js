'use strict';
// fs(file system)モジュールを読み込んで使えるようにする
const fs = require('fs');
// readlineモジュールを読み込んで使えるようにする
const readline = require('readline');
// popu-pref.csvをフェイルとして読み込める状態に準備する
const rs = fs.createReadStream('./popu-pref.csv');
// readlineモジュールをfsに設定する
const rl = readline.createInterface({ input: rs, output: {} });
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
// popu-pref.csvのデータを一行づつ読み込んで、設定された関数を実行する
rl.on('line', lineString => {
    // [2010, 北海道, 237155, 258530]のようなデータに分割
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);　//15~19才の人口
    if (year === 2010 || year === 2015) {
        // データがなかったらデータを初期化
        let def = { popu10: 0, popu15: 0, change: null};
        // 都道府県ごとのデータを作る
        let value = prefectureDataMap.get(prefecture) || def;
        if (year === 2010) {
            value.popu10 = popu;
        } else if (year === 2015) {
            value.popu15 = popu;
        }
        prefectureDataMap.set(prefecture, value);
    }
});
rl.on('close', () => {
    // 全データをループして変化率を計算
   for (let [prefecture, data] of prefectureDataMap) {
     data.change = data.popu15 / data.popu10;
   }
//並べ替えを行う
   const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    // 引き算の結果で、マイナス降順　プラス昇順に入れ替え
    return pair2[1].change - pair1[1].change;
   });
//データを整える
   const rankingStrings = rankingArray.map(([key, value]) => {
     return (
       key +
       ': ' +
       value.popu10 +
       '人=>' +
       value.popu15 +
       ' 変化率:' +
       value.change  
     )        
});
    console.log(rankingStrings);
});

// function lineOut(lineString) {
    // console.log(lineString);
// }
// rl.on('line', lineOut);
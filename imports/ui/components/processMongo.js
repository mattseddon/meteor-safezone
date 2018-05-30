import moment from 'moment';

export const processMongo = function(dp,xids,dates,dateVar,ef){

  function getKeys(d){
    var uniqueKeys = Object.keys(d.reduce(function(result, obj) {
      return Object.assign(result, obj);
    }, {}))
    return uniqueKeys.filter(k => !xids.includes(k));
  }

  function sumObj( obj ) {
    var sum = 0;
    for( var el in obj ) {
      if (!(el == "sleepLength")) {
        sum += obj[el];
      }
    }
    return sum;
  }

  function cntObj( obj ) {
    var count = 0;
    for( var el in obj ) {
      if (!(el == "sleepLength")) {
        count += 1;
      }
    }
    return count;
  }

  var dtVals   = {};
  var dtCnt    = {};
  var ctVals   = {};
  var ctCnt    = {};
  var allVals  = {};
  var alltVals = [];

  var keys = getKeys(dp);
   // console.log(keys);

   //sum all values in the object that aren't dateVar

  for (var i=0; i < dates.now.length; i++) {

     dtVals[i]   = {};
     dtCnt[i]    = {};
     ctVals[i]   = {};
     ctCnt[i]    = {};

     for (var k in keys){

        dtVals[i][keys[k]] = 0;
        dtCnt[i][keys[k]]  = 0;
        ctVals[i][keys[k]] = 0;
        ctCnt[i][keys[k]]  = 0;

        dp.forEach(function(d,j) {

          if (i==0){

            if (k==0){
            allVals[j] = {};
            alltVals[j] = moment(d[dateVar]).format("YYYY-MM-DD HH:mm");
            };

            allVals[j][keys[k]]  = d[keys[k]];
            //console.log(keys.length,k);
            if (k==keys.length-1 && !ef){
              allVals[j]['mental'  ] = (allVals[j]['stress'       ] + allVals[j]['mood'         ]) / 2;
              allVals[j]['physical'] = (allVals[j]['energy'       ] + ((allVals[j]['upperSoreness'] + allVals[i]['lowBackSoreness'] + allVals[j]['lowerSoreness']) / 3)) / 2;
              allVals[j]['sleep'   ] = (allVals[j]['sleepQuality' ] + Math.max(Math.min(allVals[j]['sleepLength' ]-4,5),0)      ) / 2;
              allVals[j]['overall' ] = ( allVals[j]['mental'] + allVals[j]['physical'] + allVals[j]['sleep'] ) / 3;
            };

          };

          if (   (dates.m1d[i] <= d[dateVar] && d[dateVar] < dates.now[i])
              || (dates.m1d[i] <= d[dateVar] &&            ! dates.now[i]))
              { dtVals[i][keys[k]] += d[keys[k]];
                dtCnt[i][keys[k]]  += 1;
              };
          if (   (dates.m1w[i] <= d[dateVar] && d[dateVar] < dates.now[i])
              || (dates.m1w[i] <= d[dateVar] &&            ! dates.now[i]))
              { ctVals[i][keys[k]] += d[keys[k]];
                ctCnt[i][keys[k]]  += 1;
              };

            });
          //for Impulse we want weekly average based on 7 days
          if (ef && keys[k] != 'effortRPE'){
            ctVals[i][keys[k]] = ctVals[i][keys[k]] / 7;
          }
          else {
            ctVals[i][keys[k]] = ctVals[i][keys[k]] / ctCnt[i][keys[k]];
          };
     }
     if (!(ef)){
       dtVals[i]['overall' ] = sumObj(dtVals[i])  / cntObj(dtVals[i]);
       ctVals[i]['mental'  ] = (ctVals[i]['stress'       ] + ctVals[i]['mood'         ]) / 2;
       ctVals[i]['physical'] = (ctVals[i]['energy'       ] + ((ctVals[i]['upperSoreness'] + ctVals[i]['lowBackSoreness'] + ctVals[i]['lowerSoreness']) / 3)) / 2;
       ctVals[i]['sleep'   ] = (ctVals[i]['sleepQuality' ] + Math.max(Math.min(ctVals[i]['sleepLength' ]-4,5),0)      ) / 2;
       ctVals[i]['overall'] = ( ctVals[i]['mental'] + ctVals[i]['physical'] + ctVals[i]['sleep'] ) / 3;
     }
  }

  if (!(ef)){
    keys.push('overall','mental','physical','sleep');
    dataDT = {};
  }
  else {
    dataDT = {};
    for (var k in keys){
      dataDT[keys[k]] = [];
      dataDT[keys[k]] = dates.now.map((t, i) => {
        return {
          t: t,
          y: Number(dtVals[i][keys[k]].toFixed(2))
        };
      });
    }
  }
  //data for each entry
  dataEE = {};
  for (var k in keys){
    dataEE[keys[k]] = [];
    dataEE[keys[k]] = alltVals.map((t, i) => {
      return {
        t: t,
        y: Number(allVals[i][keys[k]].toFixed(2))
      };
    }).filter((i) => {return i.t > dates.now[0];});
  }

  //data for daily totals


  //data for weekly average
  dataWA = {};
  for (var k in keys){
    dataWA[keys[k]] = [];
    dataWA[keys[k]] = dates.now.map((t, i) => {
      return {
        t: t,
        y: Number(ctVals[i][keys[k]].toFixed(2))
      };
    });
  }

  return [dataEE, dataDT, dataWA];
}

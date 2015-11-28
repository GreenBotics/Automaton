//import "babel-core/polyfill"//needed for object.assign


/*converts input data to array if it is not already an array*/
export function toArray(data){
  if(!data) return []
  if(data.constructor !== Array) return [data]
  return data
}

//merge the current data with any number of input data
export function mergeData(currentData,inputs){
  if("merge" in currentData){
    return currentData.merge(inputs)
  }
  return Object.assign(currentData,inputs)
}


//from staltz/combineLatestObj
export function combineLatestObj(obj) {
  var sources = [];
  var keys = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      keys.push(key.replace(/\$$/, ''));
      sources.push(obj[key]);
    }
  }
  return Rx.Observable.combineLatest(sources, function () {
    var argsLength = arguments.length;
    var combination = {};
    for (var i = argsLength - 1; i >= 0; i--) {
      combination[keys[i]] = arguments[i];
    }
    return combination;
  })
}


export function slidingAccumulator(data$, maxItems=10){

  let subject$ = new Rx.Subject()
  let acc = []
  data$
    .subscribe(function(e){
      acc.push(e)
      if(acc.length > maxItems){
        acc.shift()
      }
      subject$.onNext(acc)
    })

  return subject$
}
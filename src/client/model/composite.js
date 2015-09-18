import {Rx} from '@cycle/core'

function combineLatestObj(obj) {
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

function generateUUID(){
  return "xsdfsdf"
}

/*
let partInstance = {
    name: data.name,
    iuid: generateUUID(),
    typeUid: data.typeUid,
    color: "#07a9ff",
    pos: [ 0, 0, h/2 ],
    rot: [ 0, 0, 0 ],
    sca: [ 1, 1, 1 ],
    bbox:data.bbox
}*/

//just experimenting with thoughts about component based system
let partComponents = []
function makeCoreComponent(name, typeUid){
  return  Rx.Observable.just({
    name: name,
    iuid: generateUUID(),
    typeUid: typeUid,
    color: "#07a9ff"
  })
}

function makeTransformComponent(){
  return  Rx.Observable.just({
    pos: [ 0, 0, 0 ],
    rot: [ 0, 0, 0 ],
    sca: [ 1, 1, 1 ]
  })
}

function makeBoundingComponent(){
  return Rx.Observable.just({
    min:[0,0,0],
    max:[0,0,0]
  })
}

let core$       = makeCoreComponent("xzor", 0)
let bounds$     = makeBoundingComponent()
let transforms$ = makeTransformComponent()
let components  = {core$, transforms$, bounds$}

let entity$ = combineLatestObj(components)

entity$.subscribe(e=>console.log("entity",e))
  
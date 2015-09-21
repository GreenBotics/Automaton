import {Rx} from '@cycle/core'
import {makeModelNoHistory} from './modelHelper'
import {mergeData} from '../utils'


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

let just = Rx.Observable.just

////Core//////
function makeCoreSystem(name, typeUid){
  const defaults ={
    name: name,
    iuid: generateUUID(),
    typeUid: typeUid,
    color: "#07a9ff"
  }

  function setColor(state, input){
    let color = input || state.color
    state = mergeData( state, {color})
    return state
  }

  let actions = {setColor$:new Rx.Subject()}
  let updateFns = {setColor}
  let core$ = makeModelNoHistory(defaults, updateFns, actions)

  return {core$,coreActions:actions}
}
////Transforms//////

function makeTransformsSystem(){
  const defaults = {}

  const transformDefaults ={
    pos: [ 0, 0, 0 ],
    rot: [ 0, 0, 0 ],
    sca: [ 1, 1, 1 ]
  }

  function updatePosition(state, input){
    console.log("updatePosition")
    let id  = input.id
    let pos = input.value  || [0,0,Math.random()]
    let orig = state[id] || transformDefaults

    state = mergeData({},state)
    //FIXME big hack, using mutability
    state[id] = mergeData(orig,{pos})
    return state
  }

  function updateRotation(state, input){
    let id = input.id
    let rot = input.value || [0,0,Math.random()]
    let orig = state[id] || transformDefaults

    state = mergeData({},state)
    //FIXME big hack, using mutability
    state[id] = mergeData(orig,{rot})
    return state
  }

  let updateRotation$ = new Rx.Subject()
  let updatePosition$ = new Rx.Subject()
  let actions   = { updatePosition$, updateRotation$ }
  let updateFns = { updateRotation,updatePosition }

  let transforms$ = makeModelNoHistory(defaults, updateFns, actions)

  return {transforms$,transformActions:actions}
}

////BoundingBox//////
function makeBoundingSystem(){
  const defaults = {}

  const  boundsDefaults ={
    min:[0,0,0],
    max:[0,0,0]
  }

  let actions = {}
  let updateFns = {}
  let bounds$ = makeModelNoHistory(defaults, updateFns, actions)

  return {bounds$,boundActions:actions}
}

////Mesh//////
function makeMeshSystem(xParam){
  const defaults ={
    points: [
      [0,0,1]
      ,[0,1,0]
      ,[1,0,0]
    ]
    ,cells:[0,1,2]
  }

  let actions = {}
  let updateFns = {}
  let mesh$ = makeModelNoHistory(defaults, updateFns, actions)

  return {mesh$,meshActions:actions}
}


let {core$,coreActions}            = makeCoreSystem("apart_"+0, 0)
let {transforms$,transformActions} = makeTransformsSystem()
let {mesh$,meshActions}            = makeMeshSystem()
let {bounds$ ,boundActions}        = makeBoundingSystem()

let components  = {core$, transforms$, bounds$, mesh$}

let systems$ = combineLatestObj(components)
  systems$.subscribe(e=>console.log("systems",e))


 setTimeout(function() {
    transformActions.updatePosition$.onNext({id:0,value:[-10,2,4]})
    transformActions.updateRotation$.onNext({id:1,value:[0.56,2.19,0]})
    }, 200)


 setTimeout(function() {
    transformActions.updatePosition$.onNext({id:1,value:[0,0,9.987]})
    }, 200)

systems$.subscribe(function(e){
  
})






  
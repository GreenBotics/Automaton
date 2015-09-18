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
function makeCoreComponent(name, typeUid){
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

function makeTransformComponent(){
  const defaults ={
    pos: [ 0, 0, 0 ],
    rot: [ 0, 0, 0 ],
    sca: [ 1, 1, 1 ]
  }

  function updatePosition(state, input){
    let pos = input  || [0,0,Math.random()]
    state = mergeData( state, {pos})
    return state
  }

  function updateRotation(state, input){
    let rot = input || [0,0,Math.random()]
    state = mergeData( state, {rot})
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
function makeBoundingComponent(){
  const  defaults ={
    min:[0,0,0],
    max:[0,0,0]
  }

  let actions = {}
  let updateFns = {}
  let bounds$ = makeModelNoHistory(defaults, updateFns, actions)

  return {bounds$,boundActions:actions}
}

////Mesh//////
function makeMeshComponent(xParam){
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



function makeEntity(id){
  let {core$,coreActions}            = makeCoreComponent("xzor_"+id, id)
  let {transforms$,transformActions} = makeTransformComponent()
  let {mesh$,meshActions}            = makeMeshComponent()
  let {bounds$ ,boundActions}        = makeBoundingComponent()

  let components  = {core$, transforms$, bounds$, mesh$}
  let entity$ = combineLatestObj(components)
  entity$.subscribe(e=>console.log("entity",e))

  //transforms$.subscribe(t=>console.log("transforms",t))

  setTimeout(function() {
    transformActions.updatePosition$.onNext([-10,2,4])
    }, 200)

  setTimeout(function() {
    coreActions.setColor$.onNext('#FF00F7')
    }, 700)

  return entity$
}

function makeEntities(count){

  let entities = []
  for(let i=0;i<count;i++){
    entities.push( makeEntity(i) )
  }

}


makeEntities(3)


  
import {Rx} from '@cycle/core'
import Immutable from 'seamless-immutable'

import {mergeData} from '../utils'


export function modelHelper(defaults,modFunction){

  return function model(actions){
    let source$ =  Rx.Observable.just(defaults)
    let mods$   =  modFunction(actions)

    return mods$
      .merge(source$)
      .scan((currentData, modFn) => modFn(currentData))//combine existing data with new one
      //.distinctUntilChanged()
      .shareReplay(1)
  }

}


function logHistory(currentData, history){ 
  let past   = [currentData].concat(history.past)
  let future = []

  console.log("currentData",past)
  history = mergeData(history, {past, future})
  return history
}

export function makeModifications(actions, updateFns){

  let mods$ =  Object.keys(actions).map(function(key){
    //console.log("actions in makeModifications",key)
    let op     = actions[key]
    let opName = key.replace(/\$/g, "")
    let modFn  = updateFns[opName]

    //here is where the "magic happens"
    //for each "operation/action" we map it to an observable with history & state
    let mod$   = op
      .map((input) => ({state,history}) => {

      history = logHistory(state, history)
      state   = modFn(state, input)//call the adapted function

      return Immutable({state,history})
    })

    //console.log("op",op,"opName",opName,"modFn",modFn)
    if(modFn){
      return mod$ 
    }


    //after this point, only undo/redo management
    //TODO : how to make this better? 
    if(opName==="undo"){
      return actions.undo$
        .map((toggleInfo) => ({state,history}) => {
          console.log("Undoing")

          let nState     = history.past[0]
          let past   = history.past.slice(1)
          let future = [state].concat(history.future)

          history = mergeData(history,{past,future})

          return Immutable({state:nState,history})
        })
    }
    if(opName === "redo"){
      return actions.redo$
        .map((toggleInfo) => ({state,history}) => {
          console.log("Redoing")

          let nState = history.future[0]
          let past = [state].concat(history.past) 
          let future = history.future.slice(1)

          history = mergeData(history,{past,future})

          return Immutable({state:nState,history})
        })
    }
    

  })
  .filter(e=>e!==undefined)

  /*
  //handle undo & redo seperatly, they are alway the same
  //we need to seperate this somehow?
  //why does this not work ??
  let undoMod$ = actions.undo$
    .map((toggleInfo) => ({state,history}) => {
      console.log("Undoing")

      let nState     = history.past[0]
      let past   = history.past.slice(1)
      let future = [state].concat(history.future)

      history = mergeData(history,{past,future})

      return Immutable({state:nState,history})
    })

  let redoMod$ = actions.redo$
    .map((toggleInfo) => ({state,history}) => {
      console.log("Redoing")

      let nState = history.future[0]
      let past = [state].concat(history.past) 
      let future = history.future.slice(1)

      history = mergeData(history,{past,future})

      return Immutable({state:nState,history})
    })*/

  return Rx.Observable.merge(
    mods$
  )
}


export function makeModificationsNoHistory(actions, updateFns){

  let mods$ =  Object.keys(actions).map(function(key){
    //console.log("actions in makeModifications",key)
    let op     = actions[key]
    let opName = key.replace(/\$/g, "")
    let modFn  = updateFns[opName]

    //here is where the "magic happens"
    //for each "operation/action" we map it to an observable with history & state
    let mod$   = op
      .map((input) => (state) => {

      //history = logHistory(state, history)
      state   = modFn(state, input)//call the adapted function

      return Immutable(state)//,history})
    })

    //console.log("op",op,"opName",opName,"modFn",modFn)
    if(modFn){
      return mod$ 
    }
  })
  .filter(e=>e!==undefined)

  return Rx.Observable.merge(
    mods$
  )
}


export function makeModel(updateFns,actions,defaults){
  let mods$ =  makeModifications(actions,updateFns)

  let source$ =  Rx.Observable.just( Immutable(defaults) )

  return mods$
    .merge(source$)
    .scan((currentData, modFn) => modFn(currentData))//combine existing data with new one
    //.distinctUntilChanged()
    .shareReplay(1)
}


export function makeModelNoHistory(defaults, updateFns, actions){
  let mods$ =  makeModificationsNoHistory(actions,updateFns)

  let source$ =  Rx.Observable.just( Immutable(defaults) )
  source$.subscribe(e=>console.log("source",e))

  return mods$
    .merge(source$)
    .scan((currentData, modFn) => modFn(currentData))//combine existing data with new one
    //.distinctUntilChanged()
    .shareReplay(1)
}


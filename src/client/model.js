import Immutable from 'seamless-immutable'
import {Rx} from '@cycle/core'

//import Immutable from 'immutable'
import {modelHelper} from './modelHelper'
import {mergeData} from './utils'

export function intent(DOM){
  let toggleRelay$ =  DOM.get('.relayToggler', 'click')
    //.do(e=>console.log("EVENT relay toggling",e))
    .map(function(e){
      let id = parseInt( e.target.id.split("_").pop() )
      return {id,toggled:e.target.checked}
    })

  let setCoolerPower$ = DOM.get('.coolerSlider','input')//input vs change events
    .debounce(30)
    .map(e=>parseFloat(e.target.value))


  let emergencyShutdown$ = DOM.get('#shutdown', 'click')
    .map(false)


  let undo$ = DOM.get('#undo','click')
    .map(true)

  let redo$ = DOM.get('#redo','click')
    .map(false)


  return {
    toggleRelay$
    ,emergencyShutdown$
    ,setCoolerPower$
    , undo$
    , redo$}
}



function logHistory(currentData, history){ 
  let past   = [currentData].concat(history.past)
  let future = []

  console.log("currentData",past)
  history = mergeData(history, {past, future})
  return history
}

//these all are actual api methods , right? 
function toggleRelays(state, input){
  let relays = state.relays
    .map(function(relay,index){
      if(index === input.id){
        return {name:relay.name,toggled:input.toggled}
      }
      return relay
    })

  state = mergeData( state, {active:true, relays})//toggleRelays(state,toggleInfo) )
  return state
}

function emergencyShutdown(state, input){
  let relays = state.relays
    .map( relay => ({ name:relay.name, toggled:input}) )

  state = mergeData( state, [{active:input}, {relays}] )
  return state
}

function setCoolerPower(state, input){
  let coolers = state.coolers
    .map( cooler => ( mergeData(cooler, {power:input} ) ) )//Object.assign({}, cooler,{value:input}) ) )

  state = mergeData( state, [{active:input}, {coolers}] )
  return state
}

export function model(actions){

    const defaults = Immutable(
      { 
        state:{
          active:true,

          relays:[
             {toggled:false,name:"relay0"}
            ,{toggled:false,name:"relay1"}
            ,{toggled:true, name:"relay2"}
          ]
          ,
          coolers:[
            {toggled:true,power:10,name:"cooler0"}
          ]
        }
        //only for undo/redo , experimental
        ,history:{
          past:[]
          ,future:[]
        }
      }
    )

    function modifications(actions){

      let toggleRelayMod$ = actions.toggleRelay$
        //splice in history? or settings?
        /*.withLatestFrom(intent.settings$,function(data,settings){
          return {nentities:data,settings}
        })*/
        .map((toggleInfo) => ({state,history}) => {
          //history (undo redo)
          history = logHistory(state,history)
          state   = toggleRelays(state,toggleInfo)

          return Immutable({state,history})
        })

      let emergencyShutdownMod$ = actions.emergencyShutdown$
        .map((payload) => ({state,history}) => {

          history = logHistory(state, history)
          state   = emergencyShutdown(state, payload)
      
          return Immutable({state,history})
        })

      let setCoolerPowerMod$ = actions.setCoolerPower$
        .map((input) => ({state,history}) => {

          history = logHistory(state, history)
          state   = setCoolerPower(state, input)
      
          return Immutable({state,history})
        })


      //we need to seperate this somehow?
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
        })

      return Rx.Observable.merge(
        toggleRelayMod$
        ,emergencyShutdownMod$
        ,setCoolerPowerMod$


        ,undoMod$
        ,redoMod$
      )
    }

    return modelHelper(defaults,modifications)(actions)
  }
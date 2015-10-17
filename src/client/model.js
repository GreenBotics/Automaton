import Immutable from 'seamless-immutable'
import {Rx} from '@cycle/core'
//import Immutable from 'immutable'
import "babel-core/polyfill"

import {makeModel, makeModifications} from './model/modelHelper'
import {mergeData} from './utils'

function getId(e){
  let id = parseInt( e.target.id.split("_").pop() )
  return {id}
}

function idAndChecked(e){
  let id = parseInt( e.target.id.split("_").pop() )
  return {id,toggled:e.target.checked}
}

function idAndValue(e){
  let id = parseInt( e.target.id.split("_").pop() )
  //let value = parseFloat(e.target.value)// for basic use case
  let value = parseFloat(e.detail)//for custom element etc
  return {id,value}
}

export function intent(DOM, other){
  let toggleRelay$ =  DOM.select('.relayToggler').events('click')
    .map(idAndChecked)

  let removeRelay$ = DOM.select('.removeRelay').events('click')
    .map(getId)

  let removeAllRelays$ = DOM.select('#removeAllRelays').events('click')
    .map(true)

  let setCoolerPower$ = DOM.select('.coolerSlider').events('input')//input vs change events
    //.merge( DOM.select('.coolerSlider_number'.events('change') )
    .merge( DOM.select('.labeled-input-slider-cooler').events('change') )
    //DOM.select('.coolerSlider_number','change')
    .debounce(30)
    .map(idAndValue)
    .do(e=>console.log("value",e))*/

  let setCoolerPower$ = other.setCoolerPower$//.debounce(30)

  DOM.select('.labeled-input-slider-cooler').events('newValue')
    .subscribe(e=>console.log("saw cooler slider change",e))

  let emergencyShutdown$ = DOM.select('#shutdown').events('click')
    .map(false)

  let toggleSensor$ = DOM.select('.sensorToggler').events('click')
    .map(idAndChecked)

  
  //////////
  let undo$ = DOM.select('#undo').events('click')
    .map(true)

  let redo$ = DOM.select('#redo').events('click')
    .map(false)


  return {
    toggleRelay$
    ,removeRelay$
    ,removeAllRelays$

    ,emergencyShutdown$

    ,setCoolerPower$
    ,toggleSensor$

    , undo$
    , redo$}
}


//////////////////////////////////////

//these all are actual "api functions"  
function toggleRelay(state, input){
  let relays = state.relays
    .map(function(relay,index){
      if(index === input.id){
        return mergeData(relay, {toggled:input.toggled})
      }
      return relay
    })

  state = mergeData( state, {active:true, relays})//toggleRelays(state,toggleInfo) )
  return state
}

function removeRelay(state, input){
  let relays = state.relays
    .map(function(relay,index){
      if(index !== input.id){
        return relay
      }
    })
    .filter(r=>r!==undefined)
    //.filter(r=>input.id)=> if all items had ids this would be simpler

  state = mergeData( state, {active:true, relays})
  return state
}

function removeAllRelays(state, input){
  state = mergeData( state, {relays:[]})
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
    .map(function(cooler,index){
      if(index === input.id){
        return mergeData(cooler, {power:input.value})
      }
      return cooler
    })

  state = mergeData( state, [{active:input!==undefined}, {coolers}] )
  return state
}

function toggleSensor(state, input){
  let sensors = state.sensors
    .map(function(sensor,index){
      if(index === input.id){
        return mergeData(sensor, {toggled:input.toggled})
      }
      return sensor
    })

  state = mergeData( state, {active:true, sensors})//toggleRelays(state,toggleInfo) )
  return state
}


export function model(actions){

    const defaults = { 
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
          ,{toggled:true,power:72.6,name:"cooler1"}
        ]
        ,
        sensors:[
          {toggled:true,type:"temperature", name:"t0", recordMode:"continuous"}
          ,{toggled:false,type:"temperature", name:"t1", recordMode:"continuous"}
        ]
        ,
        data:{
          "t0":{},
          "t1":{}
        }
      }
      //only for undo/redo , experimental
      ,history:{
        past:[]
        ,future:[]
      }
    }
    
    /*list of "update functions", to be called based on mapping 
    between action names & update functions
    ie if you have an "action" called doFoo$, you should specify an function called doFoo(state,input)
    ie doFoo$ ---> function doFoo(state,input){}
    */
    let updateFns = {
      setCoolerPower,
      emergencyShutdown,
      toggleRelay,
      removeRelay,
      removeAllRelays,
      toggleSensor}

    //other helper: specifies model "paths", these are mapped to the state output
    let paths = {relays:"relays", coolers:"coolers", sensors:"sensors"}


    //for testing
    let sensor1Data$ = Rx.Observable
      .interval(100 /* ms */)
      .timeInterval()
      .map(e=> Math.random())

    let sensor2Data$ = Rx.Observable
      .interval(500 /* ms */)
      .timeInterval()
      .map(e=> Math.random())

    return makeModel(updateFns, actions, defaults)
   
}

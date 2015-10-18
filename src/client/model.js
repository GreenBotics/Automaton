import Immutable from 'seamless-immutable'
import {Rx} from '@cycle/core'
import "babel-core/polyfill"
var rxDom = require("rx-dom")

import {makeModel, makeModifications} from './model/modelHelper'
import {mergeData,combineLatestObj,slidingAccumulator} from './utils'


//these all are actual "api functions"  
function toggleRelay(state, input){
  let relays = state.relays
    .map(function(relay,index){
      if(index === input.id){
        return mergeData(relay, {toggled:input.toggled})
      }
      return relay
    })

  state = mergeData( state, {active:true, relays})
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

  state = mergeData( state, {active:true, sensors})
  return state
}


export default function model(actions){

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


    /*function formatEntry(fieldName,entry){
      console.log("formatEntry",fieldName,entry)      
      return entry.map(function(e,index){
        let result = {time:index+''}
        result[fieldName] = e[fieldName]
        return result
      })
    }

    let dataPoints = 10
    let sensors$ = Rx.Observable.interval(2000)
      .flatMap(function(){
        return rxDom.DOM.ajax({url:"http://192.168.1.20:3020"
          ,crossDomain:true
          ,credentials:false
          ,responseType:"json"})
      })
      .pluck("response")
      .pluck("variables")
      

    let bufferedTemp$ = slidingAccumulator( sensors$, dataPoints ).map(formatEntry.bind(null,"temperature"))
    let bufferedHum$  = slidingAccumulator( sensors$, dataPoints ).map(formatEntry.bind(null,"humidity"))
    let bufferedPres$ = slidingAccumulator( sensors$, dataPoints ).map(formatEntry.bind(null,"pressure"))*/
    

    let fakeData = [
      {temperature:25,humidity:10,pressure:20}
      ,{temperature:15,humidity:10,pressure:20}
      ,{temperature:25,humidity:10,pressure:20}
      ,{temperature:15,humidity:10,pressure:20}
    ]

    let just = Rx.Observable.just

    let bufferedTemp$ = just(
      [
        {time:"0",temperature:10}
        ,{time:"1",temperature:20}
        ,{time:"2",temperature:23}
        ,{time:"3",temperature:19}
        ,{time:"4",temperature:21}
        ,{time:"5",temperature:19}
      ])
    let bufferedHum$ = just(
      [
        {time:"0",humidity:10}
        ,{time:"1",humidity:20}
        ,{time:"3",humidity:50}
      ])
    let bufferedPres$ = just(
      [
        {time:"0",pressure:10}
        ,{time:"1",pressure:20}
        ,{time:"2",pressure:100}
      ])


     let bla$ = Rx.Observable.interval(2).take(2).map("foo")

    const model$ = makeModel(updateFns, actions, defaults)

    return combineLatestObj({
      model$
      ,temperature$:bufferedTemp$
      ,humidity$:bufferedHum$
      ,pressure$:bufferedPres$
      ,bla$
      //,sensor1Data$
      //,sensor2Data$
    })
    .map(e=>Immutable(e))

}

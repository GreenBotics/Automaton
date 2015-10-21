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


    function formatedNowTime(index){
      
      let dateTime =  new Date( Date.now()+index*50000 ) 

      return dateTime
      let Y = dateTime.getFullYear()
      let m = dateTime.getMonth()
      let d = dateTime.getDay()

      let H = dateTime.getHours()
      let M = dateTime.getMinutes()
      let S = dateTime.getSeconds()

      //console.log("h",h,"m",m)
      // "%Y-%m-%d-%H-%M-%S"
      return `${Y}-${m}-${d}T${H}:${M}:${S}`
      
    }

    function formatEntry(fieldName,entry){
      console.log("formatEntry",fieldName,entry)      
      return entry.map(function(e,index){
        let result = {time: formatedNowTime(index)} //index+''}//
        result["value"] = e[fieldName]
        return result
      })
    }

    function formatSingleEntry(entry){
      return {value: entry, time: formatedNowTime(0) }
    }

    function packageData(source$, fieldName, dataPoints){
      return slidingAccumulator( source$.pluck(fieldName).map(formatSingleEntry), dataPoints )
    }

     function makeFakeData(count=10){
        let data = new Array(count).join().split(',')//will not work without this , cannot map empty values
        return data.map(function(d,index){
          return {value:Math.random()*25,time:formatedNowTime(index)}

        })
      }


    let bufferedTemp$ = undefined
    let bufferedHum$  = undefined
    let bufferedPres$ = undefined
    let bufferedWindSpd$ = undefined
    let bufferedWindDir$ = undefined
    let bufferedLight$ = undefined
    let bufferedUv$ = undefined
    let bufferedRain$ = undefined
    let useFakeData = false

    let just = Rx.Observable.just



    if(useFakeData){
      let fakeData = [
        {temperature:25,humidity:10,pressure:20}
        ,{temperature:15,humidity:10,pressure:20}
        ,{temperature:25,humidity:10,pressure:20}
        ,{temperature:15,humidity:10,pressure:20}
      ]

      bufferedTemp$ = just( makeFakeData() )
        
      bufferedHum$ = just(
        [
          {time:"0",value:10}
          ,{time:"1",value:20}
          ,{time:"3",value:50}
        ])
      bufferedPres$ = just(
        [
          {time:"0",value:10}
          ,{time:"1",value:20}
          ,{time:"2",value:100}
        ])
      bufferedWindSpd$ = just(
        [
          {time:"0",value:27.5}
          ,{time:"1",value:20}
          ,{time:"2",value:76}
        ])
      bufferedWindDir$ = just(
        [
          {time:"0",value:27.5}
          ,{time:"1",value:20}
          ,{time:"2",value:76}
        ])

      bufferedLight$ = just(
        [
          {time:"0",value:27.5}
          ,{time:"1",value:20}
          ,{time:"2",value:76}
        ])

      bufferedUv$ = just(
        [
          {time:"0",value:27.5}
          ,{time:"1",value:20}
          ,{time:"2",value:76}
        ])

      bufferedRain$ = just(
        [
          {time:"0",value:27.5}
          ,{time:"1",value:20}
          ,{time:"2",value:76}
        ])
    }
    else{
      let dataPoints = 10
      let sensors$ = Rx.Observable.interval(5000)
        .flatMap(function(){
          return rxDom.DOM.ajax({url:"http://192.168.1.20:3020"
            ,crossDomain:true
            ,credentials:false
            ,responseType:"json"})
        })
        .pluck("response")
        .pluck("variables")
        //.distinctUntilChanged()
        .shareReplay(1)


      //sensors$.subscribe(e=>console.log("sensors",e))

      
      bufferedTemp$ = packageData(sensors$,"temperature",dataPoints)

      bufferedHum$  = packageData(sensors$,"humidity",dataPoints)
      bufferedPres$ = packageData(sensors$,"pressure",dataPoints)
      
      bufferedWindSpd$ = just( makeFakeData() )//packageData(sensors$,"windSpd",dataPoints)
      bufferedWindDir$ = just( makeFakeData() ) //packageData(sensors$,"windDir",dataPoints)

      bufferedRain$  = just( makeFakeData() ) //packageData(sensors$,"rain",dataPoints)

      bufferedLight$ = just( makeFakeData() )//packageData(sensors$,"visL",dataPoints)
      bufferedUv$    = just( makeFakeData() )//packageData(sensors$,"UVL",dataPoints)

    }
   
    
     let bla$ = Rx.Observable.interval(2).take(2).map("foo")

    const model$ = makeModel(updateFns, actions, defaults)

    return combineLatestObj({
      model$
      ,temperature$:bufferedTemp$.startWith(undefined)
      ,humidity$:bufferedHum$.startWith(undefined)
      ,pressure$:bufferedPres$.startWith(undefined)
      ,windSpd$:bufferedWindSpd$.startWith(undefined)
      ,windDir$:bufferedWindDir$.startWith(undefined)
      ,light$: bufferedLight$.startWith(undefined)
      ,uv$:bufferedUv$.startWith(undefined)
      ,rain$:bufferedRain$.startWith(undefined)
      ,bla$
    })
    //.map(e=>Immutable(e))

}

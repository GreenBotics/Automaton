import Immutable from 'seamless-immutable'
import Rx from 'rx'
import "babel-core/polyfill"
var rxDom = require("rx-dom")
const just = Rx.Observable.just

import {makeModel, makeModifications} from './model/modelHelper'
import {mergeData,combineLatestObj,slidingAccumulator} from './utils'

import {flatten,find,prop,difference,findIndex,equals,uniqBy} from 'Ramda'

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


function setNodes(state, input){
  state = mergeData( state, {nodes:input})
  return state
}

function selectNodes(state, input){
  state = mergeData( state, {selectedNodes:input})
  return state
}

function selectFeeds(state, input){
  //if already there, remove
  //if not , add
  
  const added   = difference(input,state.selectedFeeds)
  //const removed = difference(state.selectedFeeds,input) 

  function eqs(a,b){return a.node === b.node && a.feed === b.feed}
  /*let selectedFeeds =  [].concat(input, state.selectedFeeds) 
  selectedFeeds = uniqBy(eqs,selectedFeeds)*/
  function findIdenticals(listA,listB){
    /*let arrays = [listA,listB]
    return arrays.shift().reduce(function(res, v) {
      if (res.indexOf(v) === -1 && arrays.every(function(a) {
          return a.indexOf(v) !== -1
      })) res.push(v)
      return res
    }, [])*/
    const result = listA.filter(function(a){
      for(let i=0;i<listB.length;i++){
        let b = listB[i]
        if(eqs(a,b)){
          return true
        }
      }
      return false
    })

    return result
  }

  const sameOnes = findIdenticals(input,state.selectedFeeds)

  //console.log("selectedFeed",state.selectedFeeds)
  const selectedFeeds = [].concat(added, state.selectedFeeds)
    .filter(function(e){
      for(let i=0;i<sameOnes.length;i++){
        let b = sameOnes[i]
        if(eqs(e,b)){
          return false
        }
      }
      return true
    })
  console.log("selectedFeed2",selectedFeeds)

  //filter feeds accordingly
  const filteredFeeds = state.feeds
    .filter(function(feed){
      console.log("feed to filter",feed)
    })

  state = mergeData( state, {selectedFeeds})
  return state
}

function setFeedsData(state, input){
  console.log("setFeedsData",input)
  state = mergeData( state, {feeds:input})
  return state
}

function toggleFeedsSelection(state, input){
  const feedsSelectionToggled = !state.feedsSelectionToggled
  state = mergeData( state, {feedsSelectionToggled})
  console.log("toggleFeedsSelection",state)
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
        ,nodes:[]
        ,feeds:[]

        ,selectedNodes:[]
        ,selectedFeeds:[]

        ,filteredFeeds:[]

        //ui state
        ,feedsSelectionToggled:false
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
      toggleSensor

      ,setNodes
      ,selectNodes
      ,selectFeeds
      ,setFeedsData

      ,toggleFeedsSelection
    }

    //other helper: specifies model "paths", these are mapped to the state output
    let paths = {relays:"relays", coolers:"coolers", sensors:"sensors"}


    const model$ = makeModel(updateFns, actions, defaults)

    return model$
    /*return combineLatestObj({
      model$
      //,sensorNodes$
      //,sensorsFeeds$:filteredFeeds$
      //,sensorsData$:filteredSensorData$
      
    })*/
    //.map(e=>Immutable(e))

}

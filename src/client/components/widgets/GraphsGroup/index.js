/** @jsx hJSX */
import Cycle from '@cycle/core'
import {hJSX} from '@cycle/dom'
import Rx from 'rx'
const combineLatest = Rx.Observable.combineLatest
const just          = Rx.Observable.just
//import {GraphWidget} from '../widgets/GraphWidget'
import {GraphWidget} from '../GraphWidget/graphWidget'
var d3 = require('metrics-graphics/node_modules/d3')

import {combineLatestObj} from '../../../utils'

import {mergeAll,flatten,nth} from 'ramda'

function model(props$, actions){
  return props$
}

function intent(){
  return {}
}


function view(state$){
  let endOfDay = new Date()
  endOfDay.setHours(23)
  endOfDay.setMinutes(59)
  endOfDay.setSeconds(59)
  //endOfDay = new Date( Date.now()+2000000 ) 

  let startOfDay = new Date()
  startOfDay.setHours(9)
  startOfDay.setMinutes(0)
  startOfDay.setSeconds(0)

  const maxPts = endOfDay

  let commonGraphSettings = {
    animate_on_load:true
    ,transition_on_update:true
    ,axes_not_compact:true
    //,max_x:endOfDay
    //,min_x:startOfDay
    ,height:200
    ,xax_format:d3.time.format('%H:%M:%S')
    ,xax_count:8
    ,show_secondary_x_label:false
    ,x_rug:true

  }

  //type can be temperature, pressure , speed etc 
  function makeSettingsByType(type){
   
    const mappings = {
      'temperature' : {
        title: "Temperature (C)"
        ,description:"Temperature curves for env#0"
        ,legend:["T0"]
        ,min_y:-30
        ,max_y:50
        ,y_label:"°C"
      },
      'humidity':{
        title: "Humidity (%)"
        ,description:"humitidy curves for env#0"
        ,legend:["H0"]
        ,min_y:0
        ,max_y:100
        ,y_label:"%"
      },
      'pressure' : {
        title: "Pressure (hpa)",
        description:"pressure curves for env#0",
        legend:["P0"],
        //baselines: [{value:12, label:'critical pressure stuff'}],
      },
      'windSpd' : {
        title: "Wind speed (km/h)"
        ,description:"wind speed curves for env#0"
        ,legend:["WS0"]
        ,min_y:0
        ,max_y:200
        //baselines: [{value:12, label:'critical pressure stuff'}],
      },
      'windDir' : {
        title: "Wind direction",
        description:"wind direction curves for env#0",
        legend:["WS0"],
        //baselines: [{value:12, label:'critical pressure stuff'}],
      },
      'rain':{
        title: "Precipitations (mm)",
        description:"Rain curves for env#0",
        max_x:maxPts,
        legend:["R0"],
        //baselines: [{value:12, label:'critical pressure stuff'}],
      },
      'UV' : {
        title: "UV level",
        description:"UV level curves for env#0",
        legend:["UV0"],
        //baselines: [{value:12, label:'critical pressure stuff'}],
      },
      'IR' : {
        title: "IR level",
        description:"IR level curves for env#0",
        legend:["IR0"],
        //baselines: [{value:12, label:'critical pressure stuff'}],
      },
      'light' : {
        title: "Light level",
        description:"Light level curves for env#0",
        legend:["L0"],
        //baselines: [{value:12, label:'critical pressure stuff'}],
      }

    }

    return mappings[type]

  }

  function initGraph(dataType){
    const typeSettings = makeSettingsByType(dataType)
    const graphSettings = Object.assign({},commonGraphSettings,typeSettings)

    const graph = new GraphWidget(undefined,graphSettings)
    graph.init()
    return graph
  }


  return state$.distinctUntilChanged().map(function(state){
    console.log("GraphsGroup state",state)
    const feeds = state.feeds

    /* TO DISPLAY WE NEED
     - feed raw data 
     - feed type
     - feed id ?
    */


    //FIXME: horrible
    function getFeedType(feedId){
      const types = state.nodes.map(node =>{
        return node.sensors
          .filter(s=>s.id === feedId)
          .map(s=>s.type)
      })
      .filter(l=>l.length > 0)
      //console.log("getFeedType", nth(0,types) )

      return nth(0,flatten(types))
    }

    const refinedFeedsData = state.selectedFeeds
      .map(sf=>sf.feed)
      .map(function(feedId){
        const timeSeries = state.feeds.map( feed => ( {value:feed[feedId], time:new Date(feed.timestamp*1000)} ) )
        const type   = getFeedType(feedId)
        const data = {
          id:feedId
          ,type
          ,timeSeries
        }
        return data
      })

    console.log("feed TEST",refinedFeedsData)

    let temperature = []
    if(refinedFeedsData.length>0){
     temperature = refinedFeedsData[0].timeSeries
    }
    

    let _graphList = refinedFeedsData
      .asMutable()//needed , otherwise we loose prototypes, needed for graphWidget
      .map( feed => {
        return initGraph(feed.type)//do lookup to prevent re-creating
      })

    //update all graphs
    refinedFeedsData.forEach(function(data,index){
      _graphList[index].updateData(data.timeSeries)
    })   


    return <section id="graphs">
        {_graphList}   
      </section>
    })
}


function view2(state$){
  let endOfDay = new Date()
  endOfDay.setHours(23)
  endOfDay.setMinutes(59)
  endOfDay.setSeconds(59)
  //endOfDay = new Date( Date.now()+2000000 ) 

  let startOfDay = new Date()
  startOfDay.setHours(9)
  startOfDay.setMinutes(0)
  startOfDay.setSeconds(0)

  const maxPts = endOfDay

  let commonGraphSettings = {
    animate_on_load:true
    ,transition_on_update:true
    ,axes_not_compact:true
    //,max_x:endOfDay
    //,min_x:startOfDay
    ,height:200
    ,xax_format:d3.time.format('%H:%M:%S')
    ,xax_count:8
    ,show_secondary_x_label:false
    ,x_rug:true

  }

  let graphSettingsTemperature = {
    title: "Temperature (C)"
    ,description:"Temperature curves for env#0"
    ,legend:["T0"]
    ,min_y:-30
    ,max_y:50
    ,y_label:"°C"
    //baselines: [{value:12, label:'critical temperature stuff'}],
  }
  graphSettingsTemperature = Object.assign({},commonGraphSettings,graphSettingsTemperature)
}



function GraphsGroup({DOM, props$}, name = '') {
  const state$ = model(props$)

  //const {changeCore$, changeTransforms$} = refineActions( props$, intent(DOM) )
  const vtree$ = view(state$)
  
  return {
    DOM: vtree$
  }
}

export default GraphsGroup 
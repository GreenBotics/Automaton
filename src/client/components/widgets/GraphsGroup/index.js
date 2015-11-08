/** @jsx hJSX */
import Cycle from '@cycle/core'
import {hJSX} from '@cycle/dom'
import Rx from 'rx'
const combineLatest = Rx.Observable.combineLatest
const just          = Rx.Observable.just
//import {GraphWidget} from '../widgets/GraphWidget'
import {GraphWidget} from '../GraphWidget/graphWidget'

import {combineLatestObj} from '../../../utils'

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

  let graphSettingsHumidity = {
    title: "Humidity (%)"
    ,description:"humitidy curves for env#0"
    ,legend:["H0"]
    ,min_y:0
    ,max_y:100
    ,y_label:"%"
    //baselines: [{value:12, label:'critical humidity stuff'}],
  }
  graphSettingsHumidity = Object.assign({},commonGraphSettings,graphSettingsHumidity)

  let graphSettingsPressure = {
    title: "Pressure (hpa)",
    description:"pressure curves for env#0",
    legend:["P0"],
    //baselines: [{value:12, label:'critical pressure stuff'}],
  }
  graphSettingsPressure = Object.assign({},commonGraphSettings,graphSettingsPressure)

  let graphSettingsWindSpd = {
    title: "Wind speed (km/h)"
    ,description:"wind speed curves for env#0"
    ,legend:["WS0"]
    ,min_y:0
    ,max_y:200
    //baselines: [{value:12, label:'critical pressure stuff'}],
  }
  graphSettingsWindSpd = Object.assign({},commonGraphSettings,graphSettingsWindSpd)

  let graphSettingsWindDir = {
    title: "Wind direction",
    description:"wind direction curves for env#0",
    legend:["WS0"],
    //baselines: [{value:12, label:'critical pressure stuff'}],
  }
  graphSettingsWindDir = Object.assign({},commonGraphSettings,graphSettingsWindDir)

  let graphSettingslight = {
    title: "Light level",
    description:"Light level curves for env#0",
    legend:["L0"],
    //baselines: [{value:12, label:'critical pressure stuff'}],
  }
  graphSettingslight = Object.assign({},commonGraphSettings,graphSettingslight)

  let graphSettingsUv = {
    title: "UV level",
    description:"UV level curves for env#0",
    legend:["UV0"],
    //baselines: [{value:12, label:'critical pressure stuff'}],
  }
  graphSettingsUv = Object.assign({},commonGraphSettings,graphSettingsUv)


  let graphSettingsIR = {
    title: "IR level",
    description:"IR level curves for env#0",
    legend:["IR0"],
    //baselines: [{value:12, label:'critical pressure stuff'}],
  }
  graphSettingsIR = Object.assign({},commonGraphSettings,graphSettingsIR)


  let graphSettingsRain = {
    title: "Precipitations (mm)",
    description:"Rain curves for env#0",
    max_x:maxPts,
    legend:["R0"],
    //baselines: [{value:12, label:'critical pressure stuff'}],
  }
  graphSettingsRain = Object.assign({},commonGraphSettings,graphSettingsRain)


  const temperatureGraph = new GraphWidget(undefined,graphSettingsTemperature)
  temperatureGraph.init()

  const humidityGraph = new GraphWidget(undefined,graphSettingsHumidity)
  humidityGraph.init()

  const pressureGraph = new GraphWidget(undefined,graphSettingsPressure)
  pressureGraph.init()

  const windSpdGraph = new GraphWidget(undefined,graphSettingsWindSpd)
  windSpdGraph.init()

  const windDirGraph = new GraphWidget(undefined,graphSettingsWindDir)
  windDirGraph.init()

  const UVGraph = new GraphWidget(undefined,graphSettingsUv)
  UVGraph.init()

  const IRGraph = new GraphWidget(undefined,graphSettingsIR)
  IRGraph.init()

  const VLGraph = new GraphWidget(undefined,graphSettingslight)
  VLGraph.init()

  const rainGraph = new GraphWidget(undefined,graphSettingsRain)
  rainGraph.init()


  state$.pluck("sensorsFeeds")
    .distinctUntilChanged()
    /*.map(function(entry){
      console.log("entry",entry)
      //combineLatestObj({entry.source$})
      //return 
    })*/
    .filter(s=>s!==undefined)
    .subscribe(function(e){
    console.log("filteredFeeds",e)
  })

  //sensor data itself
  state$.pluck("sensorsFeeds")
    .distinctUntilChanged()
    .filter(s=>s!==undefined)
    .flatMap(function(entries){
      return entries.map(function(entry){
        if(entry.source$ && entry.feedId){          
          return combineLatestObj({data:entry.source$,id:just(entry.feedId)})
        }        
      })
      
    })
    .filter(s=>s!==undefined)
    .subscribe(function(e){
      console.log("sensorsData",e)
      if(e){
        e.subscribe(e=>console.log("sensor data",e))
      }
  })


  /*let sensorsData$ = state$.pluck("sensorsData")
    .filter(s=>s!==undefined)
    .flatMap(combineLatest)
   
  sensorsData$
    .map(function(sensorsData){
      console.log("sensorsData",sensorsData)
    })
    .subscribe(e=>console.log("FOOO",e))*/


  /*let foo$ = Rx.Observable.zip(sensorsData$)
    .subscribe(e=>console.log("FOOO",e))*/
    /*.flatMap(function(data$){

      //data.subscribe(e=>console.log("sensorsData",e))
      return data$.flatMap(function(data){
        //return <div>{JSON.stringify(data)} </div>
        return data
      })
    })*/
  //sensor data is a list of observables
  //the content of those observables needs to be rendered with a graph
  //console.log("graphs",graphs$)
  //graphs$.subscribe(e=>console.log("FOOO",e))
  /*return graphs$.map(function(graphs){
    console.log("here mofo",graphs)

    return undefined
  })*/

  return state$.map(function(state){

    /*let {temperature,humidity,pressure,windSpd,windDir,light,UV,IR,rain} = state
    //console.log("sensor data",temperature,humidity,pressure)

    //update graphs
    let graphList = [
      temperatureGraph
      ,humidityGraph
      ,pressureGraph
      ,windSpdGraph
      ,windDirGraph
      ,rainGraph
      ,UVGraph
      ,IRGraph
      ,VLGraph
    ]

    let dataList = [
      temperature
      ,humidity
      ,pressure
      ,windSpd
      ,windDir
      ,rain
      ,UV
      ,IR
      ,light
    ]

    //update all graphs
    dataList.forEach(function(data,index){
      graphList[index].updateData(data)
    })   

    const graphsList = graphList.map(function(graph){
      return graph
    })*/ 

    let graphsList = undefined

    return <section id="graphs">
        {graphsList}   
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
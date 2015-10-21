/** @jsx hJSX */
import Cycle from '@cycle/core'
import {Rx} from '@cycle/core'
import {hJSX} from '@cycle/dom'

import {renderRelays, renderCoolers, renderSensors, renderHistory, renderSensorData} from '../uiElements'

//import {GraphWidget} from '../widgets/GraphWidget'
import {GraphWidget} from '../widgets/GraphWidget/graphWidget'

import {combineLatestObj} from '../../utils'


export function view2(state$){
  state$.map(function () {
    return <div>
      Bla
    </div>
  })
}

export default function view(state$){

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


  return state$
    //.map(m=>m.asMutable({deep: true}))//for seamless immutable
    //.distinctUntilChanged()
    //.shareReplay(1)
    .do(e=>console.log("here"))
    .map(function(state)
    {
      console.log("state",state)
      let {temperature,humidity,pressure,windSpd,windDir,light,UV,IR,rain} = state
      console.log("sensor data",temperature,humidity,pressure)
      return <div>
        {temperatureGraph.updateData(temperature)}
        {temperatureGraph}

        {humidityGraph.updateData(humidity)}
        {humidityGraph}

        {pressureGraph.updateData(pressure)}
        {pressureGraph}   

        {windSpdGraph.updateData(windSpd)}
        {windSpdGraph}  

        {UVGraph.updateData(UV)}
        {UVGraph} 

        {IRGraph.updateData(IR)}
        {IRGraph}     

        {VLGraph.updateData(light)}
        {VLGraph}      

      </div>
    })
    /*.map((state)=>
      <div>
        <section id="overview"> 
          <h1> System state: {state.active ? 'active' : 'inactive'} </h1>
        </section>

        <section id="relays"> 
          <h1>Relays: </h1>
          {renderRelays( state.relays )}
        </section>

        <section id="cooling">
          <h1>Cooling </h1>
          {renderCoolers( state.coolers )}
        </section>

        <section id="emergency">
          <h1> Emergency shutdown </h1>
          <button id="shutdown" disabled={!state.active}> shutdown </button>
        </section>
      </div>
    )*/

}

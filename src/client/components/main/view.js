/** @jsx hJSX */
import Cycle from '@cycle/core'
import {Rx} from '@cycle/core'
import {hJSX} from '@cycle/dom'

import {renderRelays, renderCoolers, renderSensors, renderHistory, renderSensorData} from '../uiElements'

//import {GraphWidget} from '../widgets/GraphWidget'
import {GraphWidget} from '../widgets/GraphWidget/graphWidget'

import {combineLatestObj} from '../../utils'


export default function view(state$){
  const maxPts = 10
  let graphSettingsTemperature = {
    title: "Temperature (C)",
    description:"Temperature curves for env#0",
    max_x:maxPts,
    x_accessor: 'time',
    y_accessor: 'temperature',
    legend:["T0"],

    //baselines: [{value:12, label:'critical temperature stuff'}],
  }

  let graphSettingsHumidity = {
    title: "Humidity (%)",
    description:"humitidy curves for env#0",
    max_x:maxPts,
    x_accessor: 'time',
    y_accessor: 'humidity',
    legend:["H0"],

    //baselines: [{value:12, label:'critical humidity stuff'}],
  }

  let graphSettingsPressure = {
    title: "Pressure (hpa)",
    description:"pressure curves for env#0",
    max_x:maxPts,
    x_accessor: 'time',
    y_accessor: 'pressure',
    legend:["P0"],

    //baselines: [{value:12, label:'critical pressure stuff'}],
  }

  let graphSettingsWindSpd = {
    title: "Wind speed (km/h)",
    description:"wind speed curves for env#0",
    max_x:maxPts,
    x_accessor: 'time',
    y_accessor: 'windSpd',
    legend:["WS0"],
    //baselines: [{value:12, label:'critical pressure stuff'}],
  }

  let graphSettingsWindDir = {
    title: "Wind direction",
    description:"wind direction curves for env#0",
    max_x:maxPts,
    x_accessor: 'time',
    y_accessor: 'windDir',
    legend:["WS0"],
    //baselines: [{value:12, label:'critical pressure stuff'}],
  }

  let graphSettingslight = {
    title: "Light level",
    description:"Light level curves for env#0",
    max_x:maxPts,
    x_accessor: 'time',
    y_accessor: 'light',
    legend:["L0"],
    //baselines: [{value:12, label:'critical pressure stuff'}],
  }

  let graphSettingsUv = {
    title: "UV level",
    description:"UV level curves for env#0",
    max_x:maxPts,
    x_accessor: 'time',
    y_accessor: 'uv',
    legend:["UV0"],
    //baselines: [{value:12, label:'critical pressure stuff'}],
  }


  let graphSettingsRain = {
    title: "Precipitations (mm)",
    description:"Rain curves for env#0",
    max_x:maxPts,
    x_accessor: 'time',
    y_accessor: 'rain',
    legend:["R0"],
    //baselines: [{value:12, label:'critical pressure stuff'}],
  }



  return state$
    //.map(m=>m.asMutable({deep: true}))//for seamless immutable
    .map(function(state)
    {
      console.log("state",state)
      let {temperature,humidity,pressure,windSpd,windDir,light,uv,rain} = state
      console.log("sensor data",temperature,humidity,pressure)
      return <div>
        {new GraphWidget(temperature,graphSettingsTemperature)}
        {new GraphWidget(humidity,graphSettingsHumidity)}
        {new GraphWidget(pressure,graphSettingsPressure)}
        {new GraphWidget(windSpd,graphSettingsWindSpd)}
        {new GraphWidget(windDir,graphSettingsWindDir)}
        {new GraphWidget(light,graphSettingslight)}
        {new GraphWidget(uv,graphSettingsUv)}
        {new GraphWidget(rain,graphSettingsRain)}
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

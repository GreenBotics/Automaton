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
    //width:650,
    //height:150,
    max_x:maxPts,
    x_accessor: 'time',
    y_accessor: 'temperature',
    legend:["T0"],

    //baselines: [{value:12, label:'critical temperature stuff'}],
  }

  let graphSettingsHumidity = {
    title: "Humidity (%)",
    description:"humitidy curves for env#0",
    //width:650,
    //height:150,
    max_x:maxPts,
    x_accessor: 'time',
    y_accessor: 'humidity',
    legend:["H0"],

    //baselines: [{value:12, label:'critical humidity stuff'}],
  }

   let graphSettingsPressure = {
    title: "Pressure (hpa)",
    description:"pressure curves for env#0",
    //width:650,
    //height:150,
    max_x:maxPts,
    x_accessor: 'time',
    y_accessor: 'pressure',
    legend:["P0"],

    //baselines: [{value:12, label:'critical pressure stuff'}],
  }

  /*
   {new GraphWidget(humidity,graphSettingsHumidity)}
        {new GraphWidget(pressure,graphSettingsPressure)}*/

  return state$
    //.map(m=>m.asMutable({deep: true}))//for seamless immutable
    .map(function(state)
    {
      console.log("state",state)
      let {temperature,humidity,pressure} = state
      console.log("sensor data",temperature,humidity,pressure)
      return <div>
        {new GraphWidget(temperature,graphSettingsTemperature)}
       
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

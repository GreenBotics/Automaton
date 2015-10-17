/** @jsx hJSX */
import Cycle from '@cycle/core'
import {Rx} from '@cycle/core'
import {makeDOMDriver, hJSX} from '@cycle/dom'

import {renderRelays, renderCoolers, renderSensors, renderHistory, renderSensorData} from '../uiElements'

/*
function historyM(actions){
  let actionsL = []
  for(let key in actions){
    //console.log("actions",key)

    let opName = key.replace(/\$/g, "")
    let action$ = actions[key].map(a=>({type:opName,data:a}))
    actionsL.push(action$)
  }

  return Rx.Observable.merge(actionsL)
}

function renderHistory(items){
  let list = items.map(item=> <li></li>)
  return <ul> {list}</ul>
}

function renderSensorData(data){
  return <div> {data} </div>
}

<section> 
  <button id="undo" disabled={model.history.past.length===0}> undo </button>
  <button id="redo" disabled={model.history.future.length===0}> redo </button>

  <div> Undos : {model.history.past.length} Redos: {model.history.future.length} </div>
  <div id="undosList">
    {renderHistory(model.history.past)}
  </div>
</section> 

<section id="sensors">
  <h1> Sensors </h1>
  {renderSensors( model.state )}

  {renderSensorData(rtm)}

  {renderSensorData(rtm2)}
</section>
</div>


import {renderSensorData} from './uiElements'
import {GraphWidget} from './graphWidget'
import {GLWidget} from './glWidget'
import {slidingAccumulator} from '../utils'



//this one is the "root/main" dialogue
//(just for experimenting)
export function wrapper({DOM, props$}){

  let _coolers = coolers({DOM, props$:props$.pluck("model") })

  function formatEntry(entry){
    return entry.map( (e,index)=>({time: index+'',temperature:Math.abs(e*30)}) ) 
  }

  let dataPoints = 20
  let bufferedRtm$ = slidingAccumulator( props$.map(p=>p.rtm), dataPoints ).map(formatEntry)
  let bufferedRtm2$ = slidingAccumulator( props$.map(p=>p.rtm2), dataPoints).map(formatEntry)

  let graphSettings1 = {
    title: "Temperatures",
    description:"Temperature curves for env#0",
    width:650,
    height:150,
    max_x:dataPoints,
    x_accessor: 'time',
    y_accessor: 'temperature',
    legend:["T0","T1"],

    baselines: [{value:12, label:'critical temperature stuff'}],
  }

  let graphSettings2 = {
    title: "Temperature (sensor1) ",
    description:"Temperature curves for env#1",
    width:650,
    height:150,
    max_x:dataPoints,
    x_accessor: 'time',
    y_accessor: 'temperature',
    legend:["T0"],

    baselines: [{value:18, label:'critical temperature'}],
  }


  function view(state$,coolers){
    return Rx.Observable.combineLatest( state$, _coolers.DOM, bufferedRtm$,bufferedRtm2$ ,function(state, coolers, bufferedRtm, bufferedRtm2){ 
      return <div>
        {coolers}
        {renderSensorData(state.rtm)}
        {renderSensorData(state.rtm2)}
        
        {new GraphWidget([bufferedRtm,bufferedRtm2],graphSettings1)}

        {new GraphWidget(bufferedRtm,graphSettings2)}

        {new GLWidget(state.rtm)}
      </div> 
    })
  }

  let vtree$ = view(props$,coolers)

  return {
    DOM:vtree$
    ,coolersValues$:_coolers.values$
  }
 
}


*/

export default function view(state$){
  return state$
    .map(m=>m.asMutable({deep: true}))//for seamless immutable
    .pluck("state")
    .map((state)=>
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
    )

}

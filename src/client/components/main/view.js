/** @jsx hJSX */
import Cycle from '@cycle/core'
import {Rx} from '@cycle/core'
import {makeDOMDriver, hJSX} from '@cycle/dom'


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

export default function view(dom, model$, rtm$, rtm2$){

  return model$
    .map(m=>m.asMutable({deep: true}))//for seamless immutable
    .combineLatest(rtm$, rtm2$, function(model,rtm,rtm2){return {model,rtm,rtm2}  })
    .map(({model,rtm, rtm2}) =>
      <div>
        <div> 
          <button id="undo" disabled={model.history.past.length===0}> undo </button>
          <button id="redo" disabled={model.history.future.length===0}> redo </button>

          <div> Undos : {model.history.past.length} Redos: {model.history.future.length} </div>
          <div id="undosList">
            {renderHistory(model.history.past)}
          </div>
        </div> 

        <section id="overview"> 
          <h1> System state: {model.state.active ? 'active' : 'inactive'} </h1>
        </section>
        
        <section id="relays"> 
          <h1>Relays: </h1>
          {renderRelays( model.state.relays )}
        </section>

        <section id="cooling">
          <h1>Cooling </h1>
          {renderCoolers( model.state.coolers )}
        </section>

        <section id="sensors">
          <h1> Sensors </h1>
          {renderSensors( model.state )}

          {renderSensorData(rtm)}

          {renderSensorData(rtm2)}
        </section>

        <section id="emergency">
          <h1> Emergency shutdown </h1>
          <button id="shutdown" disabled={!model.state.active}> shutdown </button>
        </section>

      </div>
  )
}
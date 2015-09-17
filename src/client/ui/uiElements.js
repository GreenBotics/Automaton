/** @jsx hJSX */
import {hJSX} from '@cycle/dom'
import {Rx} from '@cycle/core'


export function renderCheckbox(checked, id, className) {
  return <input type="checkbox" id={id} checked={checked} className={className}/>
}

export function renderLabeledCheckbox(label, checked, id, className){
  return <span>
      {renderCheckbox(checked,id,className)}
      <label htmlFor={id}> {label} </label>
    </span>
}

export function renderLabeledSlider(label="", idx, className, value=0, min=0, max=100){
  return <div className="labeledSlider"> 
    <label htmlFor={idx}> {label} </label>
    <input type="range"  id={label+"_"+idx} className={className} min="{min}" max="{max}" step="1" value={value}/> 
    <input type="number" id={label+'number_'+idx} value={value} className={className+'_number'}/>
  </div>
}

////////

export function renderRelays(relaysData){
  return relaysData.map( (relayData,index) =>
    <div>
      {relayData.name}
      { renderLabeledCheckbox("Toggle:", relayData.toggled, "checker_"+index, "relayToggler") } 
    </div>
  )
}

export function renderCoolers(data){
  //console.log("renderCoolers")
  return data.map( (item,index) => 
    <div> 
      {renderLabeledSlider(item.name, index, "coolerSlider", item.power)}
    </div>
  )
}

export function renderSensors(data){
   return data.sensors.map( (sensor,index) => 
    <div> 
      {sensor.name}
      { renderLabeledCheckbox("foo", sensor.toggled, "sensor_"+index, "sensorToggler") }
      
      <div id="sensorData">

      </div>
    </div>
  )
}

export function renderSensorData(data){
  return <div> PlaceHolder for graphs etc: {data} </div>
}


export function renderHistory(items){
  let list = items.map(item=> <li></li>)
  return <ul> {list}</ul>
}

//main view
function view(model$, rtm$, rtm2$){

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




/** @jsx hJSX */
import {hJSX} from '@cycle/dom'


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

//data.sensors.map(d => <div> Sensor: {d.name} </div> )

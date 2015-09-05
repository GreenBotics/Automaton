/** @jsx hJSX */
import {hJSX} from '@cycle/dom'


function renderSlider(label, value, unit, id, min, max) {
  /*return h('div', [
    '' + label + ' ' + value + unit,
    h('input#' + id, {type: 'range', min, max, value})
  ]);*/
}

export function renderCheckbox(checked, id, className) {
  return <input type="checkbox" id={id} checked={checked} className={className}/>
}

export function renderLabeledCheckbox(label, checked, id, className){
  return <span>
      {renderCheckbox(checked,id,className)}
      <label htmlFor="showGrid"> {label} </label>
    </span>
}

export function renderRelays(relaysData){
  return relaysData.map( (relayData,index) =>
    <div>
      {relayData.name}
      { renderLabeledCheckbox("Toggle:", relayData.toggled, "checker_"+index, "relayToggler") } 
    </div>
  )
}

export function renderLabeledSlider(label="", id, className, value=0, min=0, max=100){
  return <div> {label} {value}
    <input id={id} className={className} type="range" min="{min}" max="{max}" step="1" value={value}/> 
  </div>
}

export function renderCoolers(data){
  return data.map( (item,index) => 
    <div> 
      {renderLabeledSlider(item.name, "cooler_"+index, "coolerSlider", item.power)}
    </div>
  )

}


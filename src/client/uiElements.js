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

function labeledInputSlider({DOM, props$}, name = '') {
  let initialValue$ = props$.map(props => props.initial).first()
  let newValue$ = DOM.select(`.labeled-input-slider${name} .slider`).events('input')
    .merge( DOM.select(`.labeled-input--slider${name} .number`).events('change') )
    .map(ev => ev.target.value)
  let value$ = initialValue$.concat(newValue$)

  let vtree$ = Rx.Observable.combineLatest(props$, value$, (props, value) =>
    <div className={`labeled-input-slider${name}`} id={props.id}> 

      <span className="label">
        {props.label+ ' '}
        <input className="number" type="number" value={value} > </input> 
        {props.unit}
      </span>

      <input className="slider" type="range" min={props.min} max={props.max} value={props.value}>

      </input>

    </div>
  )

  console.log("making labeledInputSlider")
  //value$.subscribe(e=>console.log("value"))

  return {
    DOM: vtree$
    ,events:{
      newValue:value$
    }
    ,value$

  }
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


export function coolers({DOM, props$}, name = ''){
  let data$ = props$
    .filter(data=>data!==undefined)
    .map(props => props.data)

  function makeSliders(data){
    return data.map((item,index) => {
        let props$ = Rx.Observable.just({label: item.name, unit: '', min: 0, 
          initial: item.power , max: 100, id:"cooler"+index})
        let slider = labeledInputSlider({DOM, props$}, "-cooler")//item.name+"_"+index)
        let value$ = slider.value$
        return slider.DOM
      })
  }

  /*let sliders = data$
    .map(data => makeSliders(data))*/

  let vtree$ = data$
    .map(data => makeSliders(data))

  return {
    DOM: vtree$
  } 
}


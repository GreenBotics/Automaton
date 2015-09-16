/** @jsx hJSX */
import {hJSX} from '@cycle/dom'
import {Rx} from '@cycle/core'

import {renderSensorData} from './uiElements'
import {GraphWidget} from './graphWidget'

/*
base template: 
function Parent(drivers) {
  const child = Child(drivers);
  const actions = intent(drivers.DOM);
  const state$ = model(actions);
  const vtree$ = view(state$, child.DOM);
  return {
    DOM: vtree$
  }
}
*/

export function labeledInputSlider({DOM, props$}, name = '') {
  let initialValue$ = props$.map(props => props.initial).first()
  let newValue$ = DOM.select(`.labeled-input-slider${name} .slider`).events('input')
    .merge( DOM.select(`.labeled-input-slider${name} .number`).events('change') )
    .merge( DOM.select(`.labeled-input-slider${name} .number`).events('input') )
    .map(ev => ev.target.value)
  let value$ = initialValue$.concat(newValue$)

  let vtree$ = Rx.Observable.combineLatest(props$, value$, (props, value) =>
    <div className={`labeled-input-slider${name}` + " " + props.className} id={props.id}> 

      <span className="label">
        {props.label+ ' '}
        <input className="number" type="number" min={props.min} max={props.max}  value={value}> 
        </input> 
        {props.unit}
      </span>

      <input className="slider" type="range" min={props.min} max={props.max} value={value}>
      </input>
    </div>
  )

  //console.log("making labeledInputSlider")
  return {
    DOM: vtree$
    ,value$
  }
}


export function coolers({DOM, props$}, name = ''){
  let data$ = props$
    .distinctUntilChanged()
    .map(props=>props.data)
    .filter(data=>data!==undefined)

  function makeSliders(data){
    return data.map((item,index) => {
      let props$ = Rx.Observable.just({label: item.name, unit: ''
        , min: 0, initial: item.power , value:item.power, max: 100, 
        id:"cooler_"+index, className:"labeled-input-slider"})
      let slider = labeledInputSlider({DOM, props$}, "-cooler"+index)//item.name+"_"+index)
      return slider
    })
  }

  let sliders$ = data$
    .map(data => makeSliders(data))
  
  let vtree$ = sliders$
    .map(s=>s.map(se=>se.DOM))

  let values$ = sliders$
    .map(s=>s.map(se=>se.value$))

  return {
    DOM: vtree$
    ,values$
  } 
}


//this one is the "root/main" dialogue
//(just for experimenting)
export function wrapper({DOM, props$}){

  let _coolers = coolers({DOM, props$:props$.pluck("model") })

  function view(state$,coolers){
    return Rx.Observable.combineLatest( state$, _coolers.DOM,function(state, coolers){ 
      return <div>
        {renderSensorData(state.rtm)}
        {renderSensorData(state.rtm2)}
        {coolers}
      </div> 
    })
  }

  let vtree$ = view(props$,coolers)
    

  return {
    DOM:vtree$
    ,coolersValues$:_coolers.values$
  }
 
}

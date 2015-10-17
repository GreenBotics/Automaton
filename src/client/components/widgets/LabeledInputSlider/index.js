/** @jsx hJSX */
import {hJSX} from '@cycle/dom'
import {Rx} from '@cycle/core'

export default function LabeledInputSlider({DOM, props$}, name = '') {
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
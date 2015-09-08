/** @jsx hJSX */
import {hJSX} from '@cycle/dom'
import {Rx} from '@cycle/core'

import {renderSensorData} from './uiElements'

export function labeledInputSlider(responses) {
  let initialValue$ = responses.props.get('initial').first()
  let newValue$ = responses.DOM.select('.slider').events('input')
    .merge( responses.DOM.select(`.labeled-input--slider${name} .number`).events('change') )
    .map(ev => ev.target.value)

  let value$ = initialValue$.concat(newValue$)
  let props$ = responses.props.get('*')
  let vtree$ = Rx.Observable
    .combineLatest(props$, value$, (props, value) =>
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

  return {
    DOM: vtree$,
    events: {
      newValue: newValue$
    }
  }
}

//"container custom element "
export function coolers({DOM, props}){

  function renderCoolers(coolers){
    return coolers.map((item,index) =>
      <div> 
        <labeled-slider 
          key="1" unit='watts' min="40" max="140" initial="7" 
          label={item.name} 
          id={"cooler_"+index}
          className="labeled-input-slider-cooler"
          >
        </labeled-slider>

        <div>
          Power:{item.power}
        </div>
      </div>)
  }

  let vtree$ = props.get("data").map( coolers=> 
    <div>{renderCoolers(coolers)}</div>
    )

  return {
    DOM: vtree$
  } 
}


//this one is the "root/main" view
//rtm1 & 2 : stand ins for observables for real time data (just for experimenting)
export function mainView(model$, rtm$, rtm2$){
  model$ = model$
    .map(m=>m.asMutable({deep: true}))//for seamless immutable

  return Rx.Observable.combineLatest(model$, rtm$, rtm2$, function(model, rtm, rtm2){

    return <div>
      {renderSensorData(rtm)}
      {renderSensorData(rtm2)}
      <coolers data={model.state.coolers}> </coolers>
    </div>
  })
}

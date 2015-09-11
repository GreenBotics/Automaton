/** @jsx hJSX */
import {hJSX} from '@cycle/dom'
import {Rx} from '@cycle/core'

import {renderSensorData} from './uiElements'
import {GraphWidget} from './graphWidget'


export function labeledInputSlider({DOM, props$}, name = '') {
  let initialValue$ = props$.map(props => props.initial).first()
  let newValue$ = DOM.select(`.labeled-input-slider${name} .slider`).events('input')
    .merge( DOM.select(`.labeled-input-slider${name} .number`).events('change') )
    .map(ev => ev.target.value)
  let value$ = initialValue$.concat(newValue$)

  let vtree$ = Rx.Observable.combineLatest(props$, value$, (props, value) =>
    <div className={`labeled-input-slider${name}` + " " + props.className} id={props.id}> 

      <span className="label">
        {props.label+ ' '}
        <input className="number" type="number" min={props.min} max={props.max} value={value} > 
        </input> 
        {props.unit}
      </span>

      <input className="slider" type="range" min={props.min} max={props.max} value={props.value}>
      </input>
    </div>
  )

  console.log("making labeledInputSlider")
  return {
    DOM: vtree$
    ,events:{ //nope, cannot do this
      newValue:value$
    }
    ,value$

  }
}


export function coolers({DOM, props$}, name = ''){
  let data$ = props$
    .filter(data=>data!==undefined)
    .map(props => props.data)

  function makeSliders(data){
    return data.map((item,index) => {
        let props$ = Rx.Observable.just({label: item.name, unit: '', min: 0, 
          initial: item.power , max: 100, id:"cooler_"+index, className:"labeled-input-slider"})
        let slider = labeledInputSlider({DOM, props$}, "-cooler"+index)//item.name+"_"+index)
        return slider
      })
  }

  let sliders$ = data$
    .map(data => makeSliders(data))
  
  let vtree$ = sliders$
    .map(s=>s.map(se=>se.DOM))

  return {
    DOM: vtree$
  } 
}


//this one is the "root/main" view
//rtm1 & 2 : stand ins for observables for real time data (just for experimenting)
export function mainView(DOM, model$, rtm$, rtm2$){

  model$ = model$
    .map(m=>m.asMutable({deep: true}))//for seamless immutable
  let props$   = model$.map(e=>{return{data:e.state.coolers}})

  let _coolers = coolers({DOM,props$})

  return Rx.Observable.combineLatest(rtm$, rtm2$, _coolers.DOM, function(rtm, rtm2, coolers){

    return <div>
      {renderSensorData(rtm)}
      {renderSensorData(rtm2)}
      {coolers}

      <GraphWidget> </GraphWidget> 
      
    </div>
  })

}

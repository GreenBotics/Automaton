/** @jsx hJSX */
import {hJSX} from '@cycle/dom'
import {Rx} from '@cycle/core'

import {renderSensorData} from './uiElements'
import {GraphWidget} from './graphWidget'

import {slidingAccumulator} from '../utils'
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
    .filter(data=>data!==undefined)//data is an array like so [{name:"foo",power:10},{name:"bar",power:76}]

  function makeSliders(data){
    return data.map((item,index) => {
      let props$ = Rx.Observable.just({label: item.name, unit: ''
        , min: 0, initial: item.power , value:item.power, max: 100
        , id:"cooler_"+index, className:"labeled-input-slider"})
      let slider = labeledInputSlider({DOM, props$}, "-cooler"+index)
      return slider
    })
  }

  let sliders$ = data$
    .map(data => makeSliders(data))

  //sliders$.subscribe(e=>console.log("sliders",e))
  
  let vtree$ = sliders$
    //.do(e=>console.log("foo",e))
    .map(s=>s.map(se=>se.DOM))

  let values$ = sliders$
    .map(s=>s.map(se=>se.value$))

  //Rx.Observable.merge(sliders$).subscribe(e=>console.log("foo",e))
  //console.log("sliders",sliders$, data$)

  //[
  //  {name:"foo",power:10} => labeledInputSlider()
  //  {name:"bar",power:76} => labeledInputSlider()
  //]


  return {
    DOM: vtree$
    ,values$
  } 
}


//this one is the "root/main" dialogue
//(just for experimenting)
export function wrapper({DOM, props$}){

  let _coolers = coolers({DOM, props$:props$.pluck("model") })

  function formatEntry(entry){
    return entry.map( (e,index)=>({time: index+'',temperature:Math.abs(e*30)}) ) 
  }

  let bufferedRtm$ = slidingAccumulator( props$.map(p=>p.rtm), 20 ).map(formatEntry)
  let bufferedRtm2$ = slidingAccumulator( props$.map(p=>p.rtm2), 20).map(formatEntry)

  let graphSettings1 = {
    title: "Temperatures",
    description:"Temperature curves for env#0",
    width:650,
    height:150,
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
      </div> 
    })
  }

  let vtree$ = view(props$,coolers)

  return {
    DOM:vtree$
    ,coolersValues$:_coolers.values$
  }
 
}

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

function Child(drivers){
  const subChild = SubChild(drivers);
  const actions = intent(drivers.DOM);
  const state$ = model(actions);
  const vtree$ = view(state$, subChild.DOM);
  return {
    DOM: vtree$
  }
}

//helper
//from staltz/combineLatestObj
function combineLatestObj(obj) {
  var sources = [];
  var keys = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      keys.push(key.replace(/\$$/, ''));
      sources.push(obj[key]);
    }
  }
  return Rx.Observable.combineLatest(sources, function () {
    var argsLength = arguments.length;
    var combination = {};
    for (var i = argsLength - 1; i >= 0; i--) {
      combination[keys[i]] = arguments[i];
    }
    return combination;
  })
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



function midDialogue({DOM,props$}){

  

  function makeSliders0(prop){
    console.log("prop",prop)

    let p = prop.data[0].power
    let slider1Props$ = Rx.Observable.just({label: "slider1", unit: '', 
        min: 0, value:p*30, initial: p*30 , max: 100, 
        id:"cooler", className:"labeled-input-slider"
      })
    let slider1 = labeledInputSlider({DOM,props$:slider1Props$})

    p = prop.data[1].power
    let slider2Props$ = Rx.Observable.just({label: "slider1", unit: '', 
        min: 0, value:p*30, initial: p*30 , max: 100, 
        id:"cooler", className:"labeled-input-slider"
      })
    let slider2 = labeledInputSlider({DOM,props$:slider2Props$})

    let sliders = [slider1,slider2]

    console.log("sliders",sliders)

    return sliders
  }

  function makeSliders1(prop){
    console.log("makeSliders1",prop)

    let sliders = prop.data
    .map(function(entry){
      let p = entry.power
      let sliderProps$ = Rx.Observable.just({label: "slider1", unit: '', 
          min: 0, value:p*30, initial: p*30 , max: 100, 
          id:"cooler", className:"labeled-input-slider"
        })
      let slider = labeledInputSlider({DOM,props$:sliderProps$})
      return slider
    })

    console.log("sliders",sliders)
    return sliders
  }

  function makeSliders(data){
    return data
    .map((item,index) => {
      let props$ = Rx.Observable.just({
        label: item.name, unit: '', 
        min: 0, initial: item.power , max: 100, 
        id:"cooler_"+index, className:"labeled-input-slider"})
      let slider = labeledInputSlider({DOM, props$}, "-cooler"+index)//item.name+"_"+index)
      return slider
    })
  }

  let sliders$ = props$.map(makeSliders1)
  //sliders$ = props$.map(prop=>prop.data)
  //  .map(data => makeSliders(data))

  let values$ = sliders$.map(s=>s.map(se=>se.values$))
  let vtree$  = sliders$.map(s=>s.map(se=>se.DOM))

  return {
    DOM:vtree$
    ,values$
  }
}


//<GraphWidget> </GraphWidget> 
//this one is the "root/main" dialogue
//(just for experimenting)
export function wrapper({DOM, props$}){

  let _coolers = coolers({DOM, props$:props$.pluck("model") })


  function view(state,coolers){
    return <div>
      {renderSensorData(state.rtm)}
      {renderSensorData(state.rtm2)}
      {coolers}
    </div> 
  }

  let state$ = props$
  let vtree$ = Rx.Observable.combineLatest( state$, _coolers.DOM,function(state, coolers){ 

    return view(state, coolers)
  })
    

  return {
    DOM:vtree$
    ,coolersValues$:_coolers.values$
  }
 
}

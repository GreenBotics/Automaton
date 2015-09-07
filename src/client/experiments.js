function renderSensorData(data){
  return <div> {data} </div>
}

function renderFakeModel(model){
  console.log("renderFakeModel")
  return <h1>{model.name}</h1> 
}

function labeledSlider({DOM, props$}, name = '') {
  let initialValue$ = props$.map(props => props.initial).first()
  let newValue$ = DOM.get(`.labeled-slider${name} .slider`, 'input')
    .map(ev => ev.target.value)

  let value$ = initialValue$.concat(newValue$);
  let vtree$ = Rx.Observable.combineLatest(props$, value$, (props, value) =>
    <div className={`labeled-slider${name}`}> 
      <span className="label">
        {props.label+ ' ' + value + props.unit}
      </span>

      <input className="slider" type="range" min={props.min} max={props.max} value={props.value}>

      </input>

    </div>
  )

  console.log("making labeledSlider")

  return {
    DOM: vtree$,
    value$
  }
}

function labeledInputSlider({DOM, props$}, name = '') {
  let initialValue$ = props$.map(props => props.initial).first()
  let newValue$ = DOM.get(`.labeled-slider${name} .slider`, 'input')
    .merge( DOM.get(`.labeled-slider${name} .number`,'change') )
    .map(ev => ev.target.value)
  let value$ = initialValue$.concat(newValue$)

  let vtree$ = Rx.Observable.combineLatest(props$, value$, (props, value) =>
    <div className={`labeled-slider${name}`}> 

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

  return {
    DOM: vtree$,
    value$
  }
}


function minView(model$, rtm$, rtm2$){

  return model$.combineLatest(rtm$, rtm2$, function(model,rtm,rtm2){return {model,rtm,rtm2}  })
    .map(({model,rtm, rtm2}) =>
      <div>
        <div>{renderFakeModel(model)}</div>
        {renderSensorData(rtm)}
      </div>
    )
}

function minView2(DOM, model$, rtm$, rtm2$){

  let testProps$ = model$.map(function(model){
    return {label: 'Model', unit: '', min: 0, initial: model.value , max: 100,}
  })
  let fooSlider = labeledInputSlider({DOM, props$: testProps$}, 'model')

  fooSlider.value$.subscribe(e=>console.log("cool",e))

  return Rx.Observable.combineLatest(rtm$, fooSlider.DOM, function(rtm,fooSlider){

    return <div>
      {fooSlider}
      {renderSensorData(rtm)}
    </div>
  })
}
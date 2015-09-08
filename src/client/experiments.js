function renderSensorData(data){
  return <div> {data} </div>
}

function renderFakeModel(model){
  console.log("renderFakeModel")
  return <h1>{model.name}</h1> 
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
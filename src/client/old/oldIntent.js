
function getId(e){
  let id = parseInt( e.target.id.split("_").pop() )
  return {id}
}

function idAndChecked(e){
  let id = parseInt( e.target.id.split("_").pop() )
  return {id,toggled:e.target.checked}
}

function idAndValue(e){
  let id = parseInt( e.target.id.split("_").pop() )
  //let value = parseFloat(e.target.value)// for basic use case
  let value = parseFloat(e.detail)//for custom element etc
  return {id,value}
}

let toggleRelay$ =  DOM.select('.relayToggler')
  .events('click')
  .map(idAndChecked)

let removeRelay$ = DOM.select('.removeRelay')
  .events('click')
  .map(getId)

let removeAllRelays$ = DOM.select('#removeAllRelays')
  .events('click')
  .map(true)

let setCoolerPower$ = DOM.select('.coolerSlider')
    .events('input')//input vs change events
  .merge( DOM.select('.labeled-input-slider-cooler')
    .events('change') )
  //DOM.select('.coolerSlider_number','change')
  .debounce(30)
  .map(idAndValue)
  .do(e=>console.log("value",e))

//let setCoolerPower$ = other.setCoolerPower$//.debounce(30)

DOM.select('.labeled-input-slider-cooler')
  .events('newValue')
  .subscribe(e=>console.log("saw cooler slider change",e))

let emergencyShutdown$ = DOM.select('#shutdown')
  .events('click')
  .map(false)

let toggleSensor$ = DOM.select('.sensorToggler')
  .events('click')
  .map(idAndChecked)


//////////
let undo$ = DOM.select('#undo')
  .events('click')
  .map(true)

let redo$ = DOM.select('#redo')
  .events('click')
  .map(false)

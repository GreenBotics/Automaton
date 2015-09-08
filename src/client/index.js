/** @jsx hJSX */
import Cycle from '@cycle/core'
import {Rx} from '@cycle/core'
import {makeDOMDriver, hJSX} from '@cycle/dom'

import SocketIO from 'cycle-socket.io'

import {renderRelays, renderCoolers, renderSensors, renderHistory, renderSensorData} from './ui/uiElements'
//import {coolers, labeledInputSlider, mainView} from './ui/nested'
import {coolers, labeledInputSlider, mainView} from './ui/custom'


import {model, intent} from './model'

import {history, historyIntent} from './history'


function historyM(actions){
  let actionsL = []
  for(let key in actions){
    //console.log("actions",key)

    let opName = key.replace(/\$/g, "")
    let action$ = actions[key].map(a=>({type:opName,data:a}))
    actionsL.push(action$)
  }

  return Rx.Observable.merge(actionsL)
}


function view(dom, model$, rtm$, rtm2$){

  return model$
    .map(m=>m.asMutable({deep: true}))//for seamless immutable
    .combineLatest(rtm$, rtm2$, function(model,rtm,rtm2){return {model,rtm,rtm2}  })
    .map(({model,rtm, rtm2}) =>
      <div>
        <div> 
          <button id="undo" disabled={model.history.past.length===0}> undo </button>
          <button id="redo" disabled={model.history.future.length===0}> redo </button>

          <div> Undos : {model.history.past.length} Redos: {model.history.future.length} </div>
          <div id="undosList">
            {renderHistory(model.history.past)}
          </div>
        </div> 

        <section id="overview"> 
          <h1> System state: {model.state.active ? 'active' : 'inactive'} </h1>
        </section>
        
        <section id="relays"> 
          <h1>Relays: </h1>
          {renderRelays( model.state.relays )}
        </section>

        <section id="cooling">
          <h1>Cooling </h1>
          {renderCoolers( model.state.coolers )}
        </section>

        <section id="sensors">
          <h1> Sensors </h1>
          {renderSensors( model.state )}

          {renderSensorData(rtm)}

          {renderSensorData(rtm2)}
        </section>

        <section id="emergency">
          <h1> Emergency shutdown </h1>
          <button id="shutdown" disabled={!model.state.active}> shutdown </button>
        </section>

      </div>
  )
}




function main(drivers) {
  let DOM      = drivers.DOM
  let socketIO = drivers.socketIO

  let model$ = model(intent(DOM))

  //fake data, to simulate "real time" streams of data
  let sensor1Data$ = Rx.Observable
      .interval(10 /* ms */)
      .timeInterval()
      //.do((e)=>console.log(e))
      .map(e=> Math.random())

  let sensor2Data$ = Rx.Observable
      .interval(500 /* ms */)
      .timeInterval()
      //.do((e)=>console.log(e))
      .map(e=> Math.random())

  //let fakeModel$ = Rx.Observable.just({name:"fooobar", value:42, power:43})

  let fakeModel$ = Rx.Observable.just([
    {name:"fooobar", power:43}
    ,{name:"sdfds",  power:2.34}
    ])


  //let history$ = history(historyIntent(DOM),model$) 
  let opHistory$ = historyM(intent(DOM))
  opHistory$.subscribe(h=>console.log("Operation/action/command",h))

  let stream$ = model$ //anytime our model changes , dispatch it via socket.io
  const incomingMessages$ = socketIO.get('messageType')
  const outgoingMessages$ = stream$.map( 
    function(eventData){
      return {
        messageType: 'someEvent',
        message: JSON.stringify(eventData)
      }
    })


  return {
      DOM: 
      mainView(model$, sensor1Data$,sensor2Data$)//for custom element version
      //mainView(DOM, model$, sensor1Data$, sensor2Data$)//for nested version
      
      //view(model$, sensor1Data$, sensor2Data$)
    , socketIO: outgoingMessages$
  }
}



//////////setup drivers
let socketIODriver = SocketIO.createSocketIODriver(window.location.origin)
let domDriver      = makeDOMDriver('#app',{
    'coolers':coolers
    ,'labeled-slider': labeledInputSlider
    
})

let drivers = {
   DOM: domDriver
  ,socketIO: socketIODriver
}

Cycle.run(main, drivers)
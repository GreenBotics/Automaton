/** @jsx hJSX */
import Cycle from '@cycle/core'
import {Rx} from '@cycle/core'
import {makeDOMDriver, hJSX} from '@cycle/dom'

import {renderLabeledCheckbox} from './relayControl'
import SocketIO from 'cycle-socket.io'


function zop(DOM) {
  return DOM.get('#checker0', 'click')
      .map(e => e.target.checked)
      .map(e => ({name:"relay0",toggled:e})  )
}


function main(drivers) {
  let DOM      = drivers.DOM
  let socketIO = drivers.socketIO


  function renderRelays(relaysData){
    return relaysData.map( (relayData,index) =>
      <div>
        {relayData.name}
        { renderLabeledCheckbox("Toggle:", relayData.toggled, "checker"+index, "relayToggler") } 
      </div>
    )
  }

  function view(model$){
    return model$.map(model =>
      <div>
        <div> Relays: </div>
        {renderRelays(model.relays)}
      </div>
    )
  }

  function model(actions){
    const defaults = {
      relays:[
         {toggled:false,name:"relay0"}
        ,{toggled:false,name:"relay1"}
        ,{toggled:true, name:"relay2"}
      ]
    }

    return Rx.Observable.just(defaults)
  }


  let stream$ = zop(DOM)//Rx.Observable.just("bla")
  const incomingMessages$ = socketIO.get('messageType')
  const outgoingMessages$ = stream$.map( 
    function(eventData){
      return {
        messageType: 'someEvent',
        message: JSON.stringify(eventData)
      }
    })

  return {
      DOM: view(model())
    , socketIO: outgoingMessages$
  }
}

//////////setup drivers
let socketIODriver = SocketIO.createSocketIODriver(window.location.origin)
let domDriver      = makeDOMDriver('#app')

let drivers = {

   DOM: domDriver
  ,socketIO: socketIODriver
}

Cycle.run(main, drivers)
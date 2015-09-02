/** @jsx hJSX */
import Cycle from '@cycle/core'
import {Rx} from '@cycle/core'
import {makeDOMDriver, hJSX} from '@cycle/dom'

import SocketIO from 'cycle-socket.io'

import {renderRelays} from './uiElements'
import {model, intent} from './model'


function view(model$){
  return model$.map(model =>
    <div>
      <div> 
        <button id="undo"> undo </button>
        <button id="redo"> redo </button>
      </div> 
      <div> Relays: </div>
        {renderRelays( model.relays.asMutable() )}
    </div>
  )
}

function main(drivers) {
  let DOM      = drivers.DOM
  let socketIO = drivers.socketIO

  let model$ = model(intent(DOM))

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
      DOM: view(model$)
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
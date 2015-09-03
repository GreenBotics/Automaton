/** @jsx hJSX */
import Cycle from '@cycle/core'
import {Rx} from '@cycle/core'
import {makeDOMDriver, hJSX} from '@cycle/dom'

import SocketIO from 'cycle-socket.io'

import {renderRelays} from './uiElements'
import {model, intent} from './model'


function historyM(actions){
  let actionsL = []
  for(let key in actions){
    console.log("actions",key)
    actionsL.push(actions[key])
  }

  return Rx.Observable.merge(actionsL)
}

function historyIntent(DOM){
  let undo$ = DOM.get('#undo','click')
    .do(e=>console.log("EVENT undo ",e))
    .map(true)

  let redo$ = DOM.get('#redo','click')
    .do(e=>console.log("EVENT redo ",e))
    .map(false)

  return {undo$, redo$}
}



function view(model$){
  return model$
    .map(m=>m.asMutable({deep: true}))//for seamless immutable
    .map(model =>
      <div>
        <div> 
          <button id="undo" disabled={true}> undo </button>
          <button id="redo" disabled={true}> redo </button>
        </div> 

        <div> System state: {model.active ? 'active' : 'inactive'} </div>
        <div> Relays: </div>
          {renderRelays( model.relays )}

        <div> Emergency shutdown </div>
          <button id="shutdown" disabled={!model.active}> shutdown </button>

      </div>
  )
}

function main(drivers) {
  let DOM      = drivers.DOM
  let socketIO = drivers.socketIO

  let model$ = model(intent(DOM))

  //let history$ = historyM(intent(DOM))
  //history$.subscribe(h=>console.log("history item",h))

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
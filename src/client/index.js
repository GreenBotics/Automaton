/** @jsx hJSX */
import Cycle from '@cycle/core'
import {Rx} from '@cycle/core'
import {makeDOMDriver, hJSX} from '@cycle/dom'

import SocketIO from 'cycle-socket.io'

import {renderRelays} from './uiElements'
import {model, intent} from './model'

import {history, historyIntent} from './history'



function historyM(actions){
  let actionsL = []
  for(let key in actions){
    console.log("actions",key)

    let opName = key.replace(/\$/g, "")
    let action$ = actions[key].map(a=>({op:opName,data:a}))
    actionsL.push(action$)
  }

  return Rx.Observable.merge(actionsL)
}



function view(model$){
  //model$.subscribe(m=>console.log("model",m))

  return model$
    //.map(m=>m.asMutable({deep: true}))//for seamless immutable
    .map(function(m){
      console.log("model",m)
      return m.asMutable({deep: true})
    })
    .map(model =>
      <div>
        <div> 
          <button id="undo" disabled={model.history._past.length===0}> undo </button>
          <button id="redo" disabled={model.history._future.length===0}> redo </button>

          <div> Undos : {model.history._past.length} Redos: {model.history._future.length} </div>
        </div> 

        <div> System state: {model.state.active ? 'active' : 'inactive'} </div>
        <div> Relays: </div>
          {renderRelays( model.state.relays )}

        <div> Emergency shutdown </div>
          <button id="shutdown" disabled={!model.state.active}> shutdown </button>

      </div>
  )
}

function main(drivers) {
  let DOM      = drivers.DOM
  let socketIO = drivers.socketIO

  let model$ = model(intent(DOM))

  //let history$ = history(historyIntent(DOM),model$) 

  let opHistory$ = historyM(intent(DOM))
  opHistory$.subscribe(h=>console.log("history item",h))

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
import {Rx} from '@cycle/core'
let just = Rx.Observable.just

import intent from './intent'
import model from './model'
import view   from './view'



export default function main(drivers) {
  let DOM      = drivers.DOM
  let socketIO = drivers.socketIO

  const actions = intent(drivers)

  const data$   = model(actions)
  const state$  = data$
  const vtree$  = view(state$)

  let stream$ = state$ //anytime our model changes , dispatch it via socket.io
  const incomingMessages$ = socketIO.get('messageType')
  const outgoingMessages$ = stream$.map( 
    function(eventData){
      return {
        messageType: 'someEvent',
        message: JSON.stringify(eventData)
      }
    })

  return {
      DOM: vtree$
    , socketIO: outgoingMessages$
  }
}
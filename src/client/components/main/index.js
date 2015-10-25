import {Rx} from '@cycle/core'
let just = Rx.Observable.just

import intent from './intent'
import model from './model'
import view   from './view'

import {GraphsGroupWrapper} from './wrappers'

export default function main(drivers) {
  let DOM      = drivers.DOM
  let socketIO = drivers.socketIO

  const actions = intent(drivers)
  const state$   = model(actions)

  //create visual elements
  const GraphGroup = GraphsGroupWrapper(state$,DOM)

  const vtree$  = view(state$, GraphGroup.DOM)

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
import Rx from 'rx'
const just = Rx.Observable.just

import intent from './intent'
import model from './model'
import view   from './view'

import {GraphsGroupWrapper} from './wrappers'


function socketIO(state$){
  const stream$ = state$ //anytime our model changes , dispatch it via socket.io

  const outgoingMessages$ = stream$.map( 
    function(eventData){
      return {
        messageType: 'someEvent',
        message: JSON.stringify(eventData)
      }
    })
    .shareReplay(1)
    .startWith({messageType:"initialData"})

  outgoingMessages$
    .forEach(e=>console.log("output to socketIO",e))

  return outgoingMessages$
}

export default function main(drivers) {
  let DOM      = drivers.DOM

  const actions = intent(drivers)
  let state$  = model(actions)

  //create visual elements
  const GraphGroup = GraphsGroupWrapper(state$, DOM)

  const vtree$  = view(state$, GraphGroup.DOM)
  const sIO$    = socketIO(state$)

  return {
      DOM: vtree$
    , socketIO: sIO$
  }
}
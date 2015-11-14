import Rx from 'rx'
const just = Rx.Observable.just

import intent from './intent'
import model from './model'
import view   from './view'

import {GraphsGroupWrapper} from './wrappers'

export default function main(drivers) {
  let DOM      = drivers.DOM
  let socketIO = drivers.socketIO

  const actions = intent(drivers)
  let state$  = model(actions)

  //create visual elements
  const GraphGroup = GraphsGroupWrapper(state$,DOM)

  const vtree$  = view(state$, GraphGroup.DOM)

  const stream$ = state$ //anytime our model changes , dispatch it via socket.io
  /*let stream$ = Rx.Observable
    .interval(3000)
    .map(function(){
      return {bar:242}
    })  */ 


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

  return {
      DOM: vtree$
    , socketIO: outgoingMessages$
  }
}
import Rx from 'rx'
const just   = Rx.Observable.just
const merge  = Rx.Observable.merge

import intent from './intent'
import model from './model'
import view   from './view'

import {GraphsGroupWrapper} from './wrappers'

import {equals} from 'ramda'


function socketIO(state$, actions){
  const stream$ = state$ //anytime our model changes , dispatch it via socket.io


  /*const getFeedsData$ = actions
    .selectFeeds$
    .map(e=>({messageType:'getFeedsData',message:e}))*/
  const getFeedsData$ = state$
    .pluck("state")
    .pluck("selectedFeeds")
    .do(e=>console.log("selectedFeeds",e))
    //.map(e=>JSON.stringify(e))
    .distinctUntilChanged(null,equals)
    .map(e=>({messageType:'getFeedsData',message:e}))

  const saveState$    = stream$.map( 
    function(eventData){
      return {
        messageType: 'someEvent',
        message: JSON.stringify(eventData)
      }
    })

  const outgoingMessages$ = merge(
      //saveState$
      getFeedsData$
    )
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
  const sIO$    = socketIO(state$, actions)

  return {
      DOM: vtree$
    , socketIO: sIO$
  }
}
import Rx from 'rx'
const {just,merge}   = Rx.Observable

import intent from './intent'
//import model from './model'
import view   from './view'

//import {GraphsGroupWrapper} from './wrappers'

import {equals} from 'ramda'


import model from '../../model'
import {makeModel} from '../../utils/modelUtils'
import {combineLatestObj} from '../../utils/obsUtils'


function socketIO(state$, actions){
  const stream$ = state$ //anytime our model changes , dispatch it via socket.io

  /*const getFeedsData$ = actions
    .selectFeeds$
    .map(e=>({messageType:'getFeedsData',message:e}))*/
  const getFeedsData$ = state$
    .pluck("state","selectedFeeds")
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
  //  .tap(e=>console.log("output to socketIO",e))

  return outgoingMessages$
}

export default function main(sources) {

  //const actions = actionsFromSources(sources, path.resolve(__dirname,'./actions')+'/' )
  let DOM      = sources.DOM

  const actions = intent(sources)
  const state$ = model({actions, sources})

  //create visual elements
  //const GraphGroup = GraphsGroupWrapper(state$, DOM)

  const vtree$  = view(state$)//, GraphGroup.DOM)
  const sIO$    = socketIO(state$, actions)

  return {
    DOM: vtree$
    , socketIO: sIO$
  }
}

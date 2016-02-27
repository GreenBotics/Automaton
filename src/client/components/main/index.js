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

/*workflow to add new nodes

- select microcontroller (UI)
  esp8266 only for now (UI)
- select sensors attached to node (UI)
 -> select sub sensors if not all are needed ? (for 'multi sensor' boards) (UI)

- create uuid
- write wifi config (master node)
  -> setups static ip etc ?

- upload firmware => not trivial
  -> give feedback on compile/ upload
  -> encapsulate avrdude + extras
  -> see https://github.com/AdamMagaluk/leo or more generally https://www.npmjs.com/browse/keyword/gcc?offset=0
*/

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

export default function main(drivers) {
  let DOM      = drivers.DOM

  const actions = intent(drivers)

  const state$ = model(actions)

  //create visual elements
  //const GraphGroup = GraphsGroupWrapper(state$, DOM)

  const vtree$  = view(state$)//, GraphGroup.DOM)
  const sIO$    = socketIO(state$, actions)

  return {
    DOM: vtree$
    , socketIO: sIO$
  }
}

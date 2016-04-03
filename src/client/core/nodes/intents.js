import {mergeActionsByName} from '../../utils/actionUtils'

import intentsFromDOM from './actions/fromDOM'
import intentsFromSocketIO from './actions/fromSocketIO'
import intentsFromEvents from './actions/fromEvents'


export default function intents(sources){
  const actionSources = [
      intentsFromDOM(sources.DOM)
    , intentsFromSocketIO(sources.socketIO)
    , intentsFromEvents(sources.events)
  ]

  return mergeActionsByName(actionSources)
}

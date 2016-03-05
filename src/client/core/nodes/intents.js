import {mergeActionsByName} from '../../utils/actionUtils'

import intentsFromDOM from './actions/fromDOM'
import intentsFromSocketIO from './actions/fromSocketIO'


export default function intents(sources){
  const actionSources = [
      intentsFromDOM(sources.DOM)
    , intentsFromSocketIO(sources.socketIO)
  ]
  return mergeActionsByName(actionSources)
}

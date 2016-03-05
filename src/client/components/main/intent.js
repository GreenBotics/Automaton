import {toArray} from '../../utils/utils'
import {combineLatestObj} from '../../utils/obsUtils'
import {mergeActionsByName} from '../../utils/actionUtils'

export default function intent(sources, other){
  const {DOM,socketIO} = sources

  const nodeActions = require('../../core/nodes/intents').default(sources)
  const feedActions = require('../../core/feeds/intents').default(sources)

  const actions = mergeActionsByName([feedActions, nodeActions])

  console.log("All actions",actions)
  return actions
}

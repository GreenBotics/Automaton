import {toArray} from '../../utils/utils'
import {combineLatestObj} from '../../utils/obsUtils'
import {mergeActionsByName} from '../../utils/actionUtils'

export default function intent({DOM,socketIO}, other){

  //ugh, refactor
  const feedActionsFromDOM = require('../../core/feeds/actions/fromDOM').default(DOM)
  const feedActionsFromSIO = require('../../core/feeds/actions/fromSocketIO').default(socketIO)

  const nodeActionsFromDOM = require('../../core/nodes/actions/fromDOM').default(DOM)
  const nodeActionsFromSIO = require('../../core/nodes/actions/fromSocketIO').default(socketIO)

  const actions = mergeActionsByName([
    feedActionsFromDOM, feedActionsFromSIO,
    nodeActionsFromDOM, nodeActionsFromSIO])

  console.log("All actions",actions)
  return actions
}

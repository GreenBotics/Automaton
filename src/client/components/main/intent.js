import {toArray} from '../../utils/utils'
import {combineLatestObj} from '../../utils/obsUtils'
import {mergeActionsByName} from '../../utils/actionUtils'

export default function intent({DOM,socketIO}, other){

  //ugh, refactor
  const feedActionsFromDOM = require('../../core/feeds/fromDOM').default(DOM)
  const feedActionsFromSIO = require('../../core/feeds/fromSocketIO').default(socketIO)

  const nodeActionsFromDOM = require('../../core/nodes/fromDOM').default(DOM)
  const nodeActionsFromSIO = require('../../core/nodes/fromSocketIO').default(socketIO)

  const actions = mergeActionsByName([
    feedActionsFromDOM, feedActionsFromSIO,
    nodeActionsFromDOM, nodeActionsFromSIO])

  console.log("All actions",actions)
  return actions
}

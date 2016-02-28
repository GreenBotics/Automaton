import nodes from './core/nodes'
import feeds from './core/feeds'
import {makeModel} from './utils/modelUtils'
import {combineLatestObj} from './utils/obsUtils'
import {mergeData, findIdenticals} from './utils/utils'
import {flatten,find,prop,difference,findIndex,equals,uniqBy,contains} from 'ramda'

//ui
function toggleFeedsSelection(state, input){
  const feedsSelectionToggled = !state.feedsSelectionToggled
  const addItemsToggled = false //UGH , refactor

  state = mergeData( state, {feedsSelectionToggled,addItemsToggled})
  return state
}

function toggleAddItems(state, input){
  const addItemsToggled = !state.addItemsToggled
  const feedsSelectionToggled = false //UGH , refactor
  state = mergeData( state, {addItemsToggled,feedsSelectionToggled})
  return state
}

function toggleAddNode(state, input){
  const addNodeToggled = !state.addNodeToggled
  state = mergeData( state, {addNodeToggled})
  return state
}

function cancelAddNode(state, input){
  const addNodeToggled = false
  state = mergeData( state, {addNodeToggled})
  return state
}

function confirmAddNode(state, input){
  const addNodeToggled = false
  state = mergeData( state, {addNodeToggled})
  return state
}

//selections "model"
export function ui(actions){
  const updateFns = {toggleFeedsSelection, toggleAddItems, toggleAddNode, cancelAddNode, confirmAddNode}
  return makeModel({addItemsToggled:false, feedsSelectionToggled:false, addNodeToggled:false}, updateFns, actions)
}

export default function model({actions, sources}){

  return combineLatestObj({
    nodes   :nodes(actions)
    ,feeds  :feeds(actions)
    ,ui     :ui(actions)
  })
}

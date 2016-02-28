import Rx from 'rx'
const {merge} = Rx.Observable
import {makeModel} from '../../utils/modelUtils'
import {combineLatestObj} from '../../utils/obsUtils'
import {mergeData, findIdenticals} from '../../utils/utils'


function setNodes(state, input){
  state = state.concat(input.data)
  console.log("set nodes: state:",state,"input:", input)
  return state
}

function upsertNodes(state, input){
  console.log("upsert nodes",state, input)
  const index = state.indexOf(input.id)
  if(index === -1){
    return state.concat(input.data)
  }
  else{
    return [
          ...state.slice(0, index),
          mergeData(state[index], input.data),
          ...state.slice(index + 1)
        ]
  }
}

//sensor nodes model
export function nodesData(state=[], actions){
  const updateFns  = {setNodes, upsertNodes}
  return makeModel(state, updateFns, actions)
}

//node selections
function selectNodes(state, input){
  state = input.ids
  return state
}

//selections "model"
export function nodesSelections(state=[], actions){
  const updateFns = {selectNodes}
  return makeModel([], updateFns, actions)
}

//node wrappers
export default function nodes(actions){
  return combineLatestObj({
    selections: nodesSelections([], actions)
    ,data    : nodesData(      [], actions)
  }).shareReplay(1)
}

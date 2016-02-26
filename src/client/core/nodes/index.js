import Rx from 'rx'
const {merge} = Rx.Observable
import {makeModel, mergeData} from '../../utils/modelUtils'


function setNodes(state, input){
  state = state.concat(input.data)
  return state
}

function upsertNodes(state, input){
  const index = state.indexOf(input.id)
  return [
        ...state.slice(0, index),
        mergeData(state[index], {
          foo: 'bar'
        }),
        ...state.slice(index + 1)
      ]
}

//sensor nodes model
export function data(actions){
    const updateFns  = {setNodes, upsertNodes}
    const defaults   = []
    return makeModel(defaults, updateFns, actions)
}

//node selections
function selectNodes(state, input){
  state = input.ids
  return state
}

export function selections(actions){
  const updateFns = {selectNodes}
  const defaults  = []
  return makeModel(defaults, updateFns, actions)
}

//node wrappers

export default function nodes(actions){

  const selections$ = merge(
    actions.selectNodes$
  )

  const data$ = merge(
    actions.upsertNodes$
    ,actions.setNodes$
  )
  actions = {selections$, data$}

  const updateFns = {selections, data}

  const defaults = {
    selections: []
    ,nodes    : []
  }

  return makeModel(defaults, updateFns, actions)
}

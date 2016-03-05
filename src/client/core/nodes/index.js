import Rx from 'rx'
const {merge} = Rx.Observable
import {propEq, findIndex} from 'ramda'
import {makeModel} from '../../utils/modelUtils'
import {combineLatestObj} from '../../utils/obsUtils'
import {mergeData, findIdenticals} from '../../utils/utils'


function setNodes(state, input){
  state = state.concat(input.data)
  console.log("set nodes: state:",state,"input:", input)
  return state
}

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
function upsertNodes(state, input){
  console.log("upsert nodes",state, input)
  const index = findIndex(propEq('uid', input.id))(state)
  if(index === -1){
    state = state.concat(input.data)
  }
  else{
    state = [
      ...state.slice(0, index),
      mergeData(state[index], input.data),
      ...state.slice(index + 1)
    ]
  }
  return state
}

function removeNodes(state, input){
  console.log("remove nodes",state, input)
  const index = findIndex(propEq('uid', input.id))(state)
  state=[
    ...state.slice(0, index),
    ...state.slice(index + 1)
  ]
  return state
}

//node selections
function selectNodes(state, input){
  state = input.ids
  return state
}

//sensor nodes model
export function nodesData(state=[], actions){
  const updateFns  = {setNodes, upsertNodes, removeNodes}
  return makeModel(state, updateFns, actions)
}

//selections "model"
export function nodesSelections(state=[], actions){
  const updateFns = {selectNodes}
  return makeModel([], updateFns, actions)
}

//microcontrollers "model"
export function microcontrollers(state=[], actions){
  const list = [//TODO store this remotely
    'esp8266(Olimex MOD-WIFI-ESP8266-DEV)'
  ]
  const updateFns = {}

  return makeModel(list, updateFns, actions)
}


//node wrappers
export default function nodes(actions, sources){
  return combineLatestObj({
    selections: nodesSelections([], actions)
    ,data     : nodesData(      [], actions)
    ,microcontrollers: microcontrollers([],actions)
  }).shareReplay(1)
}

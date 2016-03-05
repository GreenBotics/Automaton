import Rx from 'rx'
const {merge} = Rx.Observable
import {propEq, findIndex} from 'ramda'
import {makeModel} from '../../utils/modelUtils'
import {combineLatestObj} from '../../utils/obsUtils'
import {mergeData, findIdenticals} from '../../utils/utils'


function addSensorToNode(state, input){
  const _testNode = mergeData({}, state._testNode)
  _testNode.sensors = _testNode.sensors.concat(input)

  state = mergeData( state, {_testNode})
  //state._testNodes[state.activeNode]
  return state
}

//node sensors model
export function sensorsData(state=[], actions){
  const updateFns  = {}
  return makeModel(state, updateFns, actions)
}


//sensor types model
export function sensorModels(state=[], actions){
  const models = {
    'BME280'  :'Adafruit_BME280'
    , 'SI1145'  :'Adafruit_SI1145'
  }

  const caps = {
    'BME280'  : ['temperature','humidity','baro']
    , 'SI1145'  : ['v','uv','ir']
  }
  state = {models, caps}

  const updateFns  = {}
  return makeModel(state, updateFns, actions)
}


export default function sensors(actions, sources){
  return combineLatestObj({
    //selections: nodesSelections([], actions)
    data     : sensorsData(      [], actions)
    ,models   : sensorModels([],actions)
  }).shareReplay(1)
}

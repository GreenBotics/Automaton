function addSensorToNode(state, input){
  const _testNode = mergeData({}, state._testNode)
  _testNode.sensors = _testNode.sensors.concat(input)

  state = mergeData( state, {_testNode})
  //state._testNodes[state.activeNode]
  return state
}



export default function sensors(actions, sources){
  return combineLatestObj({
    selections: nodesSelections([], actions)
    ,data     : nodesData(      [], actions)
  }).shareReplay(1)
}

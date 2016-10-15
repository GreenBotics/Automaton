import { find, propEq } from 'ramda'
import { generateUUID, exists } from '../../utils/utils'
import { combineLatestObj } from '../../utils/obsUtils'
import { makeModel } from '../../utils/modelUtils'

export default function model ({actions, props$}) {
  const editedNode$ = props$.pluck('ui', 'editedNode')
  const nodesData$ = props$.pluck('nodes', 'data')

  const setFromSelection$ = combineLatestObj({editedNode$, nodesData$})
    .map(({editedNode, nodesData}) => find(propEq('uid', editedNode))(nodesData))
    .filter(exists)

  const reset$ = actions.saveData$.delay(500).map(e => undefined) // FIXME: fugly

  const activeNodeDefaults = {
    name: undefined,
    description: undefined,
    microcontroller: undefined,
    uid: generateUUID(),
    wifiSSID: undefined,
    wifiPass: undefined,
    sensors: []
  }

  function reset (state, input) {
    return {
      name: undefined,
      description: undefined,
      microcontroller: undefined,
      uid: generateUUID(),
      wifiSSID: undefined,
      wifiPass: undefined,
      sensors: []
    }
  }

  function setDeviceName (state, input) {
    return Object.assign({}, state, {name: input})
  }
  function setDeviceDescription (state, input) {
    return Object.assign({}, state, {description: input})
  }
  function setWifiPass (state, input) {
    return Object.assign({}, state, {wifiPass: input})
  }
  function setWifiSSID (state, input) {
    return Object.assign({}, state, {wifiSSID: input})
  }
  function setMicrocontroler (state, input) {
    return Object.assign({}, state, {microcontroller: input})
  }
  function addSensorModel (state, input) {
    const sensors = state.sensors.concat(input)
    return Object.assign({}, state, {sensors})
  }
  function setFromSelection (state, input) {
    return Object.assign({}, input)
  }
  const activeNodeUpdateFns = {
    setDeviceName,
    setDeviceDescription,
    setMicrocontroler,
    setWifiSSID,
    setWifiPass,
    addSensorModel,
    setFromSelection,
    reset
  }
  const activeNodeActions = Object.assign({}, actions, {setFromSelection$, reset$})
  const activeNode$ = makeModel(activeNodeDefaults, activeNodeUpdateFns, activeNodeActions)

  return props$
    .combineLatest(activeNode$, function (state, activeNode) {
      const nodes = state.nodes
      const microcontrollers = state.nodes.microcontrollers
      const sensorModels = state.sensors.models.models
      const sensorCaps = state.sensors.models.caps

      const editedNode = state.ui.editedNode
      const addNodeToggled = state.ui.addNodeToggled
      const addItemsToggled = state.ui.addItemsToggled

      // console.log("editNode",editedNode, "activeNode",activeNode)

      return {
        nodes,
        microcontrollers,
        sensorModels,
        sensorCaps,

        activeNode,
        editedNode,
        addNodeToggled,
        addItemsToggled
      }
    })
}

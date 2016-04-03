import {h as h} from 'cycle-snabbdom'
import Rx from 'rx'
const {combineLatest, just} = Rx.Observable
import {findIndex, find, propEq, flatten, prepend} from 'ramda'
import {generateUUID, exists} from '../../utils/utils'
import {combineLatestObj} from '../../utils/obsUtils'
import {makeModel} from '../../utils/modelUtils'


import styles from './styles.css'

//import hyperstyles from 'hyperstyles'
//const h = hyperstyles(vh, styles)

//console.log("nodeEditor styles", styles)

function view(state$){
  return state$.map(view_inner)
}

/// nodes
function view_inner (state){
  const margin = 10
  const nodesData = state.nodes.data
    .reduce((acc, m) => {
      var last = acc[acc.length - 1]
      m.offset = 0
      m.offset = last ? last.offset + last.elmHeight + margin : margin
      return acc.concat(m);
    }, [])
  //const totalHeight = nodesData[nodesData.length - 1].offset + nodesData[data.length - 1].elmHeight

  const allNodes = nodesData
    .map( (node,index) => {
      return h('li.'+styles.nodeEntry,/*{
          key: index,
          style: {opacity: '0', transform: 'translate(-200px)',
                  delayed: {transform: `translateY(${node.offset}px)`, opacity: '1'},
                  remove: {opacity: '0', transform: `translateY(${node.offset}px) translateX(200px)`}},
          hook: {insert: (vnode) => { node.elmHeight = vnode.elm.offsetHeight }},
        },*/
        [
        h('article',[
          h('h1',node.name||''),
          h('button.editNodes',{attrs:{'data-node': node.uid}},'Edit'),
          h('button.removeNodes',{attrs:{'data-node': node.uid}},'Delete'),
        ]),
        h('article.'+styles.details,[
          h('span.'+styles.status,'Status: running'),
          h('span.'+styles.sensors,'Sensors:'+node.sensors.length),
        ]),
      ])
    })

  const nodeList = h('div',{style: {opacity: '1', transition: 'opacity 0.5s', remove: {opacity: '0'} }} ,[
    h('button.addNode','Add Node'),
    h('ul',allNodes)
  ])
  const nodeEditor = state.addNodeToggled?renderAddNodeScreen(state):nodeList


  if(state.addItemsToggled){
    return h('section#'+styles.nodeEditor,[
      h('header',[
        h('h1','Manage nodes/sensors'),
      ]),
      h('section',[
        nodeEditor,
      ])
    ])
  }else{
    return h('section')
  }
}


function renderAddNodeScreen(state){
  const activeNode = state.activeNode

  const microcontrollers = state.microcontrollers
  const sensorModels = state.sensorModels
  const sensorCaps   = state.sensorCaps

  const validationButtonText = state.editedNode? 'Update':'Add'

  const microcontrollersList = prepend(h('option.uc',{props:{value:undefined,disabled:true,selected:true}},'Choose:'),
    microcontrollers
    .map(m=>h('option.mc',{props:{value:m,selected:false}, attrs:{'data-foo': ""}},m))
  )

  const sensorModelsList = prepend(h('option.sens',{props:{value:undefined,disabled:true,selected:true}},'Choose:'),
      Object.keys(sensorModels)
        .map(m=>h('option.sens',{props:{value:m}, attrs:{'data-foo': ""}},m))
    )

  const sensorsList = activeNode.sensors//['BME','FOO']
    .map(s=>h('li.sens',{props:{value:s}},
      [s,h('button.removeSensorFromNode','delete')]))

  return h('section.addNodeForm',{style: {transition: 'opacity 0.2s', delayed:{opacity:'1'}, remove: {opacity: '0'}}},[
    h('form#addNodeForm',[
      h('h1', 'Devices'),
        h('select.microcontroller',microcontrollersList),

      h('h1','device infos'),
        h('input.deviceName',{props:{type:'text',placeholder:'name',value:activeNode.name}}),
        h('textarea.deviceDescription',{props:{value:activeNode.description,placeholder:'description'}},[activeNode.description]),
        h('input.deviceUUID',{props:{type:'text',disabled:true, placeholder:'UUID',value:activeNode.uid}}),

      h('h1','wifi settings'),
        h('input.wifiSSID',{props:{type:'text',placeholder:'ssid'}}),
        h('input.wifiPass',{props:{type:'password',placeholder:'password'}}),

      h('h1','Sensor Packages'),
        h('select.sensorModel',sensorModelsList),
        h('button#AddSensorPackageToNode',{props:{type:'button'}},'add'),

        h('ul.sensors',sensorsList),

      h('br'),

      h('button#confirmUpsertNode',{props:{type:'submit'}},validationButtonText),
      h('button',{props:{type:'button',disabled:true}},'upload'),//only available if changed ?
      h('button#cancelUpsertNode',{props:{type:'button'}},'cancel'),
    ])
  ])
}

function intent(sources){
  const {DOM} = sources

  const setMicrocontroler$ = DOM.select('.microcontroller').events('change')
    .map(e=>e.target.value)
  const setDeviceName$ = DOM.select('.deviceName').events('change')
    .map(e=>e.target.value)
  const setDeviceDescription$ = DOM.select('.deviceDescription').events('change')
    .map(e=>e.target.value)

  const setWifiSSID$ = DOM.select('.wifiSSID').events('change')
    .map(e=>e.target.value)
  const setWifiPass$ = DOM.select('.wifiPass').events('change')
    .map(e=>e.target.value)

  const addSensorModel$ = DOM.select('#AddSensorPackageToNode').events('click')
    .withLatestFrom(DOM.select('.sensorModel').events('change'),(_,d)=>d)
    .map(e=>e.target.value)

  const saveData$ = DOM.select('#confirmUpsertNode').events('click')

  return {
    setMicrocontroler$
    ,setDeviceName$
    ,setDeviceDescription$

    ,setWifiSSID$
    ,setWifiPass$

    ,addSensorModel$
    ,saveData$
  }
}

function model({actions, props$}){

  const editedNode$ = props$.pluck('ui','editedNode')
  const nodesData$  = props$.pluck('nodes','data')

  const setFromSelection$ = combineLatestObj({editedNode$, nodesData$})
    .map(({editedNode,nodesData})=> find(propEq('uid', editedNode))(nodesData))
    .filter(exists)

  const reset$ = actions.saveData$.delay(500).map(e=>undefined)//FIXME: fugly

  const activeNodeDefaults = {
   name:undefined,
   description:undefined,
   microcontroller:undefined,
   uid:generateUUID(),
   wifiSSID:undefined,
   wifiPass:undefined,
   sensors:[]
 }

 function reset(state, input){
   return {
    name:undefined,
    description:undefined,
    microcontroller:undefined,
    uid:generateUUID(),
    wifiSSID:undefined,
    wifiPass:undefined,
    sensors:[]
  }
 }

 function setDeviceName(state, input){
   return Object.assign({},state,{name:input})
 }
 function setDeviceDescription(state,input){
   return Object.assign({},state,{description:input})
 }
 function setWifiPass(state,input){
   return Object.assign({},state,{wifiPass:input})
 }
 function setWifiSSID(state,input){
   return Object.assign({},state,{wifiSSID:input})
 }
 function setMicrocontroler(state, input){
   return Object.assign({},state,{microcontroller:input})
 }
  function addSensorModel(state, input){
    const sensors = state.sensors.concat(input)
    return Object.assign({},state,{sensors})
  }
  function setFromSelection(state, input){
    return Object.assign({},input)
  }
  const activeNodeUpdateFns = {
    setDeviceName
    ,setDeviceDescription
    ,setMicrocontroler
    ,setWifiSSID
    ,setWifiPass
    ,addSensorModel
    ,setFromSelection
    ,reset
  }
  const activeNodeActions = Object.assign({},actions, {setFromSelection$, reset$})
  const activeNode$ = makeModel(activeNodeDefaults, activeNodeUpdateFns, activeNodeActions)

  return props$
    .combineLatest(activeNode$,function(state,activeNode){

    const nodes = state.nodes
    const microcontrollers = state.nodes.microcontrollers
    const sensorModels = state.sensors.models.models
    const sensorCaps   = state.sensors.models.caps

    const editedNode      = state.ui.editedNode
    const addNodeToggled  = state.ui.addNodeToggled
    const addItemsToggled = state.ui.addItemsToggled

    //console.log("editNode",editedNode, "activeNode",activeNode)

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

export default function nodeEditor(sources) {
  const props$ = sources.props$

  const actions = intent(sources.sources)
  const state$  = model({actions, props$})
  const vtree$  = view(state$)

  return {
    DOM: vtree$
    ,events:{
      activeNode:state$.pluck('activeNode').sample(actions.saveData$)
    }
  }
}

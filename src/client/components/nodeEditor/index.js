import {h} from 'cycle-snabbdom'
import Rx from 'rx'
const {combineLatest} = Rx.Observable
import {findIndex, find,propEq,flatten} from 'ramda'
import {combineLatestObj, generateUUID} from '../../utils/utils'

//import styles from './styles.scss'

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
      return h('li.nodeEntry',/*{
          key: index,
          style: {opacity: '0', transform: 'translate(-200px)',
                  delayed: {transform: `translateY(${node.offset}px)`, opacity: '1'},
                  remove: {opacity: '0', transform: `translateY(${node.offset}px) translateX(200px)`}},
          hook: {insert: (vnode) => { node.elmHeight = vnode.elm.offsetHeight }},
        },*/
        [
        h('div',[
          h('span.title',node.name||''),
          h('button.editNodes',{attrs:{'data-node': node.uid}},'Edit'),
          h('button.removeNodes',{attrs:{'data-node': node.uid}},'Delete'),
        ]),
        h('div.details',[
          h('span.status','Status: running'),
          h('span.sensors','Sensors:'+node.sensors.length),
        ]),
      ])
    })

  const nodeList = h('div',{style: {opacity: '1', transition: 'opacity 0.5s', remove: {opacity: '0'} }} ,[
    h('button.addNode','Add Node'),
    h('ul',allNodes)
  ])
  const nodeAdder = state.ui.addNodeToggled?renderAddNodeScreen(state):nodeList


  if(state.ui.addItemsToggled){
    return h('section#adder',[
      h('header',[
        h('h1','Manage nodes/sensors'),
      ]),
      h('header',[
        nodeAdder,
      ])
    ])
  }else{
    return h('section')
  }
}


function renderAddNodeScreen(state){
  const activeNode = find(propEq('uid', state.ui.editedNode))(state.nodes.data) || {
    name:undefined,
    uid:generateUUID(),
    sensors:[]
  }

  const validationButtonText = state.ui.editedNode? 'Update':'Add'

  const microcontrollers = state.nodes.microcontrollers
  const sensorModels = state.sensors.models.models
  const sensorCaps   = state.sensors.models.caps

  const microcontrollersList = microcontrollers
    .map(m=>h('option.mc',{props:{value:m,selected:false}, attrs:{'data-foo': ""}},m))

  const sensorModelsList = Object.keys(sensorModels)
    .map(m=>h('option.sens',{props:{value:m}, attrs:{'data-foo': ""}},m))

  return h('section.addNodeForm',{style: {transition: 'opacity 0.2s', delayed:{opacity:'1'}, remove: {opacity: '0'}}},[
    h('form#addNodeForm',[
      h('h1', 'Devices'),
        h('select.microcontroller',microcontrollersList),
        h('button',{props:{type:'button'}},'select'),

      h('h1','device infos'),
        h('input.deviceName',{props:{type:'text',placeholder:'name',value:activeNode.name}}),
        h('textarea.deviceDescription',{props:{value:activeNode.description}},[activeNode.description]),
        h('input.deviceUUID',{props:{type:'text',disabled:true, placeholder:'UUID',value:activeNode.uid}}),

      h('h1','wifi settings'),
        h('input.wifiSSID',{props:{type:'text',placeholder:'ssid'}}),
        h('input.wifiPass',{props:{type:'password',placeholder:'password'}}),

      h('h1','Sensor Packages'),
        h('select.sensorModel',sensorModelsList),
        h('button#AddSensorPackageToNode',{props:{type:'button'}},'add'),

      h('br'),

      h('button#confirmUpsertNode',{props:{type:'submit'}},validationButtonText),
      h('button',{props:{type:'button',disabled:true}},'upload'),//only available if changed ?
      h('button#cancelUpsertNode',{props:{type:'button'}},'cancel'),
    ])
  ])
}

export default function nodeEditor(sources) {
  const props$ = sources.props$

  //const actions = intent(sources.DOM)
  const state$ = props$//model(actions)
  const vtree$ = view(state$)
  return {
    DOM: vtree$
    //remove: actions.remove$,
  }
}

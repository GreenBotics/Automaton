import Cycle from '@cycle/core'
//import {h, h1, thunk, div, span, label, h4, input, hr, section, header, button, li, ul} from '@cycle/dom'
import {h, h1, thunk, div, span, label, h4, input, hr, section, header, button, li, ul, option, select} from 'cycle-snabbdom'
import Class from 'classnames'
import Rx from 'rx'
const {combineLatest} = Rx.Observable
import {findIndex, find,propEq,flatten} from 'ramda'
import {combineLatestObj, generateUUID} from '../../utils/utils'


function renderTopToolBar (state) {
  let feedsSelector = section('#feedsSelector',{style: {opacity: '0', transition: 'opacity 0.5s', remove: {opacity: '0'} } })
  if(state.ui.feedsSelectionToggled){
    feedsSelector = renderFeedsSelector(state)
  }

  ////
  let adder = undefined
  if(state.ui.addItemsToggled){
    adder = renderNodeEditor(state)
  }

  return section('#topToolbar',[
      h('button#addItems','Manage items'),
      h('button#feedsSelect','Select feeds'),

      /*h('span','Start'),
        input('.slider', {attrs:{type: 'range', min: 0, max: 100, value: 25} }),
      h('span','End' ),
        input('.slider', {attrs:{type: 'range', min: 0, max: 100, value: 75}}),
      h('span','RealTime'),
        input('#realTimeStream.slider', {attrs:{type: 'checkbox'}}),*/

      feedsSelector,
      adder
    ])
}

function renderFeedsSelector (state) {
  console.log("state",state)
  const allFeeds = state.nodes.data.map(function(node){
    return node.sensors.map(function(feed){
      //const attributes = attributes={{"data-name": row.name, "data-id":row.id}} key={row.id}
      const key = `${node._id}${feed.id}`

      const selected = state.feeds.selections.reduce(function(acc,cur){
        return acc || (cur.node === node._id && cur.feed === feed.id)
      },false) // Is this node & feed combo selected

      let className = Class(".feed",{ ".selected": selected })
      const entry = li(className,{attrs:{"data-node": node._id, "data-feed":feed.id}},[
          h('div',feed.type),
          h('div',`Node_${node._id}`)
        ])
      return entry
    })
  })

  return section('#feedsSelector',{style: {transition: 'opacity 0.5s', delayed:{opacity:'1'}} },
    [
      header([
        h1('Select feeds'),
        input('#feedSearch', {type: 'text'})
      ]),
      section([
        ul('feeds',flatten(allFeeds))
      ])
    ])
}

/// nodes
function renderNodeEditor (state){
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
    ul(allNodes)
  ])
  const nodeAdder = state.ui.addNodeToggled?renderAddNodeScreen(state):nodeList

  return section('#adder',[
    h('header',[
      h('h1','Manage nodes/sensors'),
    ]),
    h('header',[
      nodeAdder,
    ])
  ])
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

  return section('.addNodeForm',{style: {transition: 'opacity 0.2s', delayed:{opacity:'1'}, remove: {opacity: '0'}}},[
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

export default function view(state$, graphsGroupVTree$){
  return state$
    .tap(e=>console.log("state",e))
    .map(state=> h('div',[renderTopToolBar(state)]))
}

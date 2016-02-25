import Cycle from '@cycle/core'
//import {h, h1, thunk, div, span, label, h4, input, hr, section, header, button, li, ul} from '@cycle/dom'
import {h, h1, thunk, div, span, label, h4, input, hr, section, header, button, li, ul, option, select} from 'cycle-snabbdom'

import Rx from 'rx'
const combineLatest = Rx.Observable.combineLatest

import Class from 'classnames'
import {find,propEq,flatten} from 'ramda'

import {combineLatestObj} from '../../utils/utils'

//import {renderRelays, renderCoolers, renderSensors, renderHistory, renderSensorData} from '../uiElements'

function renderTopToolBar (state) {
  let feedsSelector = section('#feedsSelector',{style: {opacity: '0', transition: 'opacity 0.5s', remove: {opacity: '0'} } })
  if(state.feedsSelectionToggled){
    feedsSelector = renderFeedsSelector(state)
  }

  ////
  let adder = undefined
  if(state.addItemsToggled){
    adder = renderNodeEditor(state)
  }

  return section('#topToolbar',[
      button('#addItems','Manage items'),
      button('#feedsSelect','Select feeds'),

      span('','Start', [ ] ),
        input('.slider', {attrs:{type: 'range', min: 0, max: 100, value: 25} }),
      span('','End'),
        input('.slider', {attrs:{type: 'range', min: 0, max: 100, value: 75}}),
      span('','RealTime'),
        input('#realTimeStream.slider', {attrs:{type: 'checkbox'}}),

      feedsSelector,
      adder
    ])
}


function renderFeedsSelector (state) {
  //console.log("state",state)
  const allFeeds = state.nodes.map(function(node){
    return node.sensors.map(function(feed){
      //const attributes = attributes={{"data-name": row.name, "data-id":row.id}} key={row.id}
      const key = `${node._id}${feed.id}`

      const selected = state.selectedFeeds.reduce(function(acc,cur){
        return acc || (cur.node === node._id && cur.feed === feed.id)
      },false) // Is this node & feed combo selected

      let className = Class(".feed",{ ".selected": selected })
      const entry = li(className,{attrs:{"data-node": node._id, "data-feed":feed.id}},[
          div('',feed.type),
          div('',`Node_${node._id}`)
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


function renderNodeEditor (state){
  const allNodes = state.nodes
    .map( node => {
      return li(node.name,[
        button('Add sensor'),
        button('Delete')
      ])
    })

  return section('#adder',[
    header([
      h1('Manage nodes/sensors'),
      button('#addNode','Add Node'),
      renderAddNodeScreen(state)
    ]),
    header([
      h1('Nodes'),
      ul(allNodes)
    ])
  ])
}


function renderAddNodeScreen(state){
  console.log("state", state)
  const microcontrollers = [
    'esp8266(Olimex MOD-WIFI-ESP8266-DEV)'
  ]
  const sensorModels = {
    'BME280'  :'Adafruit_BME280'
    , 'SI1145'  :'Adafruit_SI1145'
  }

  const sensorCaps = {
    'BME280'  : ['temperature','humidity','baro']
    , 'SI1145'  : ['v','uv','ir']
  }

  const microcontrollersList = microcontrollers
    .map(m=>h('option.mc',{props:{value:m,selected:false}, attrs:{'data-foo': ""}},m))

  const sensorModelsList = Object.keys(sensorModels)
    .map(m=>h('option.sens',{props:{value:m}, attrs:{'data-foo': ""}},m))

  return section('.addNode',[
    h('h1', 'Devices'),
      h('select.microcontroller',microcontrollersList),
      h('button',{props:{type:'button'}},'select'),

    h('h1','device infos'),
      h('input.deviceName',{props:{type:'text',placeholder:'name'}}),
      h('input.deviceUUID',{props:{type:'text',disabled:true}, placeholder:'UUID'}),

    h('h1','wifi settings'),
      h('input.wifiSSID',{props:{type:'text',placeholder:'ssid'}}),
      h('input.wifiPass',{props:{type:'password',placeholder:'password'}}),

    h('h1','Sensor Packages'),
      h('select.sensorModel',sensorModelsList),
      h('button#AddSensorPackageToNode',{props:{type:'button'}},'add'),

    h('br'),

    h('button#doAddNode',{props:{type:'submit'}},'update'),
    h('button',{props:{type:'button',disabled:true}},'upload')//only available if changed ?
  ])
}

export default function view(state$, graphsGroupVTree$){

  return state$
    .map(m=>m.asMutable({deep: true})).pluck("state")
    .map(state=>
      div([
        renderTopToolBar(state),
      ])
  )

   //.map(m=>m.asMutable({deep: true}))//for seamless immutable
    //.distinctUntilChanged()
    //.shareReplay(1)
  /*return combineLatest(state$.map(m=>m.asMutable({deep: true})).pluck("state"),graphsGroupVTree$,function(state,graphsGroup)
    {
      //console.log("FEEDS",state.feeds, state.nodes)
      let sensorNodeList = state.nodes.map(function(node){
        return <option value={node._id}>{node.name}</option>
      })

      const nameMappings = {
        "windSpd":"wind speed"
        ,"windDir":"wind direction"
      }
    })*/



    /*.map((state)=>
      <div>
        <section id="overview">
          <h1> System state: {state.active ? 'active' : 'inactive'} </h1>
        </section>

        <section id="relays">
          <h1>Relays: </h1>
          {renderRelays( state.relays )}
        </section>

        <section id="cooling">
          <h1>Cooling </h1>
          {renderCoolers( state.coolers )}
        </section>

        <section id="emergency">
          <h1> Emergency shutdown </h1>
          <button id="shutdown" disabled={!state.active}> shutdown </button>
        </section>
      </div>
    )*/

}

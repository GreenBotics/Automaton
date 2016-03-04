import {h, h1, thunk, div, span, label, h4, input, hr, section, header, button, li, ul, option, select} from 'cycle-snabbdom'

import Rx from 'rx'
const combineLatest = Rx.Observable.combineLatest

function renderAddNodeScreen(state){
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

    h('button#doAddNode',{props:{type:'submit'}},'finalize'),
    h('button',{props:{type:'button',disabled:true}},'upload')
  ])
}

function NodeEditor(sources) {
  const actions = intent(sources.DOM)
  const state$ = model(actions, sources.color)
  const vtree$ = view(state$)
  return {
    DOM: vtree$,
    remove: actions.remove$,
  };
}

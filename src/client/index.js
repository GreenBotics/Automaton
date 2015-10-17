/** @jsx hJSX */
import Cycle from '@cycle/core'
import {Rx} from '@cycle/core'
import {makeDOMDriver, hJSX} from '@cycle/dom'

import SocketIO from 'cycle-socket.io'

//import {renderRelays, renderCoolers, renderSensors, renderHistory, renderSensorData} from './ui/uiElements'
//import {coolers, labeledInputSlider, wrapper} from './ui/nested'
//import {coolers, labeledInputSlider, mainView} from './ui/custom'

//import {GlWidget} from './ui/glWidget'
//import {GraphWidget} from './ui/graphWidget'

//import {model, intent} from './model'
//import {history, historyIntent} from './history'

import main from './components/main'


//////////setup drivers
let socketIODriver = SocketIO.createSocketIODriver(window.location.origin)
let domDriver      = makeDOMDriver('#app')

const drivers = {
   DOM: domDriver
  ,socketIO: socketIODriver
}

Cycle.run(main, drivers)

/** @jsx hJSX */
import Cycle from '@cycle/core'
import Rx from 'rx'
import SocketIO from 'cycle-socket.io'
import eventDriver from './drivers/eventDriver'

//import {makeDOMDriver} from '@cycle/dom'
import {modules, makeDOMDriver} from 'cycle-snabbdom'
const {
  StyleModule, PropsModule,
  AttrsModule, ClassModule,
  HeroModule, EventsModule,
} = modules


import main from './components/main'


//////////setup drivers
let socketIODriver = SocketIO.createSocketIODriver(window.location.origin)
let domDriver      = makeDOMDriver('#app',[StyleModule, PropsModule, AttrsModule, ClassModule, HeroModule, EventsModule])//makeDOMDriver('#app') //
const drivers = {
   DOM: domDriver
  ,socketIO: socketIODriver
  ,events:eventDriver
}

Cycle.run(main, drivers)

/*
//import {renderRelays, renderCoolers, renderSensors, renderHistory, renderSensorData} from './ui/uiElements'
//import {coolers, labeledInputSlider, wrapper} from './ui/nested'
//import {coolers, labeledInputSlider, mainView} from './ui/custom'

//import {GlWidget} from './ui/glWidget'
//import {GraphWidget} from './ui/graphWidget'

//import {history, historyIntent} from './history'
*/

import {Rx} from '@cycle/core'
let just = Rx.Observable.just

import intent from './intent'
import model from './model'
import view   from './view'

export default function main(drivers) {
  let DOM      = drivers.DOM
  let socketIO = drivers.socketIO

  //let history$ = history(historyIntent(DOM),model$) 

  /*let opHistory$ = historyM(intent(DOM))
  opHistory$.subscribe(h=>console.log("Operation/action/command",h))*/

  const actions = intent(drivers)
  const state$  = model(actions).pluck("model")
  const vtree$  = view(state$)

  state$.subscribe(e=>console.log("state",e))

  let stream$ = state$ //anytime our model changes , dispatch it via socket.io
  const incomingMessages$ = socketIO.get('messageType')
  const outgoingMessages$ = stream$.map( 
    function(eventData){
      return {
        messageType: 'someEvent',
        message: JSON.stringify(eventData)
      }
    })

  return {
      DOM: vtree$
    , socketIO: outgoingMessages$
  }
}
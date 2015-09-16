/** @jsx hJSX */
import Cycle from '@cycle/core'
import {Rx} from '@cycle/core'
import {makeDOMDriver, hJSX} from '@cycle/dom'

import SocketIO from 'cycle-socket.io'

import {renderRelays, renderCoolers, renderSensors, renderHistory, renderSensorData} from './ui/uiElements'
import {coolers, labeledInputSlider, wrapper} from './ui/nested'
//import {coolers, labeledInputSlider, mainView} from './ui/custom'

//import {GlWidget} from './ui/glWidget'
//import {GraphWidget} from './ui/graphWidget'

import {model, intent} from './model'
import {history, historyIntent} from './history'

import {combineLatestObj} from './utils'


function main(drivers) {
  let DOM      = drivers.DOM
  let socketIO = drivers.socketIO

  let preActions = {setCoolerPower$:new Rx.Subject()}

  let actions$ = intent(DOM, preActions)
  let model$   = model(actions$)


  let sensor1Rate = 100
  let sensor2Rate = 500

  function makeFakeSensorStream(rate$){
    return rate$
      .flatMap(function(rate){
        return Rx.Observable
          .interval(rate /* ms */)
          .timeInterval()
          .map(e=> Math.random())
      })
  }

  //fake data, to simulate "real time" streams of data
  let sensor1Data$ = makeFakeSensorStream( Rx.Observable.just(sensor1Rate) )
  let sensor2Data$ = makeFakeSensorStream( Rx.Observable.just(sensor2Rate) )

  let vModel$ = model$
    .map(m=>m.asMutable({deep:true}))
    .map(e=>{return{data:e.state.coolers}})

  let props$ = combineLatestObj({model$:vModel$, rtm:sensor1Data$, rtm2:sensor2Data$})

  let _wrapper = wrapper({DOM, props$})
  let vtree$  = _wrapper.DOM
  let subValues$ = _wrapper.coolersValues$
  
  /*subValues$.subscribe( function(subValues1$){

    subValues1$.map(function(subVal$,index){
      subVal$.subscribe(function(value){
        preActions.setCoolerPower$.onNext({id:index,value})  
      })
    })

  })  */

  //socket io stream of model state
  let stream$ = model$ //anytime our model changes , dispatch it via socket.io
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



//////////setup drivers
let socketIODriver = SocketIO.createSocketIODriver(window.location.origin)
let domDriver      = makeDOMDriver('#app',{
    //'coolers':coolers
    //,'labeled-slider': labeledInputSlider
    //,'GraphWidget':GraphWidget
})

let drivers = {
   DOM: domDriver
  ,socketIO: socketIODriver
}

Cycle.run(main, drivers)
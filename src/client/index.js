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

function historyM(actions){
  let actionsL = []
  for(let key in actions){
    //console.log("actions",key)

    let opName = key.replace(/\$/g, "")
    let action$ = actions[key].map(a=>({type:opName,data:a}))
    actionsL.push(action$)
  }

  return Rx.Observable.merge(actionsL)
}

function testView(model$,sensor1Data$, sensor2Data$){

    return sensor1Data$
      .bufferWithCount(20,19)
      .combineLatest( sensor2Data$.bufferWithCount(20,19),function(sensor1Data,sensor2Data){
        return <div>
          <div> Some stuff here </div>
          {new GlWidget([sensor1Data,sensor2Data])}
          {new GraphWidget([sensor1Data,sensor2Data])}
        </div>
        //foo([sensor1Data,sensor2Data])
      })
    //return sensor1Data$.map(foo)
  }

// let opHistory$ = historyM(intent(DOM))
//opHistory$.subscribe(h=>console.log("Operation/action/command",h))

function main(drivers) {
  let DOM      = drivers.DOM
  let socketIO = drivers.socketIO

  let preActions = {setCoolerPower$:new Rx.Subject()}

  let actions$ = intent(DOM, preActions)
  let model$   = model(actions$)

  //fake data, to simulate "real time" streams of data
  let sensor1Data$ = Rx.Observable
      .interval(100 /* ms */)
      .timeInterval()
      .map(e=> Math.random())

  let sensor2Data$ = Rx.Observable
      .interval(500 /* ms */)
      .timeInterval()
      .map(e=> Math.random())

  //
  let vModel$ = model$
    .map(m=>m.asMutable({deep:true}))
    .map(e=>{return{data:e.state.coolers}})

  let props$ = combineLatestObj({model$:vModel$, rtm:sensor1Data$, rtm2:sensor2Data$})

  let _wrapper = wrapper({DOM, props$})
  let vtree$  = _wrapper.DOM
  let subValues$ = _wrapper.coolersValues$
  
  subValues$.subscribe( function(subValues$){

    subValues$.map(function(subVal$,index){
      subVal$.subscribe(function(value){
        preActions.setCoolerPower$.onNext({id:index,value})  
      })
    })

  })  

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
      //testView(model$,sensor1Data$, sensor2Data$)
      //mainView(model$, sensor1Data$,sensor2Data$)//for custom element version
      //view(model$, sensor1Data$, sensor2Data$)
    , socketIO: outgoingMessages$
  }
}



//////////setup drivers
let socketIODriver = SocketIO.createSocketIODriver(window.location.origin)
let domDriver      = makeDOMDriver('#app',{
    'coolers':coolers
    ,'labeled-slider': labeledInputSlider
    //,'GraphWidget':GraphWidget
    
})

let drivers = {
   DOM: domDriver
  ,socketIO: socketIODriver
}

Cycle.run(main, drivers)
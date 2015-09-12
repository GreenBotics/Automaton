/** @jsx hJSX */
import Cycle from '@cycle/core'
import {Rx} from '@cycle/core'
import {makeDOMDriver, hJSX} from '@cycle/dom'

import SocketIO from 'cycle-socket.io'

import {renderRelays, renderCoolers, renderSensors, renderHistory, renderSensorData} from './ui/uiElements'
//import {coolers, labeledInputSlider, mainView} from './ui/nested'
import {coolers, labeledInputSlider, mainView} from './ui/custom'

import {GlWidget} from './ui/glWidget'
import {GraphWidget} from './ui/graphWidget'


import {model, intent} from './model'

import {history, historyIntent} from './history'


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


function main(drivers) {
  let DOM      = drivers.DOM
  let socketIO = drivers.socketIO

  let model$ = model(intent(DOM))

  //fake data, to simulate "real time" streams of data
  let sensor1Data$ = Rx.Observable
      .interval(100 /* ms */)
      .timeInterval()
      //.do((e)=>console.log(e))
      .map(e=> Math.random())

  let sensor2Data$ = Rx.Observable
      .interval(500 /* ms */)
      .timeInterval()
      //.do((e)=>console.log(e))
      .map(e=> Math.random())

  //let fakeModel$ = Rx.Observable.just({name:"fooobar", value:42, power:43})

  let fakeModel$ = Rx.Observable.just([
    {name:"fooobar", power:43}
    ,{name:"sdfds",  power:2.34}
    ])


  //let history$ = history(historyIntent(DOM),model$) 
  let opHistory$ = historyM(intent(DOM))
  opHistory$.subscribe(h=>console.log("Operation/action/command",h))

  let stream$ = model$ //anytime our model changes , dispatch it via socket.io
  const incomingMessages$ = socketIO.get('messageType')
  const outgoingMessages$ = stream$.map( 
    function(eventData){
      return {
        messageType: 'someEvent',
        message: JSON.stringify(eventData)
      }
    })

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

  return {
      DOM: testView(model$,sensor1Data$, sensor2Data$)
      //mainView(model$, sensor1Data$,sensor2Data$)//for custom element version
      //mainView(DOM, model$, sensor1Data$, sensor2Data$)//for nested version
      
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
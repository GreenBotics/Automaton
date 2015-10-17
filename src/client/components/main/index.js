/*var foo = require("./model/entitiesStream")
//var bar = require("./model/composite")
var baz = require("./model/composite2") */
import {Rx} from '@cycle/core'
let just = Rx.Observable.just

/** @jsx hJSX */
import Cycle from '@cycle/core'
import {hJSX} from '@cycle/dom'

export default function main(drivers) {
  let DOM      = drivers.DOM
  let socketIO = drivers.socketIO

  //let model$ = model(intent(DOM))
  //let history$ = history(historyIntent(DOM),model$) 

  /*let opHistory$ = historyM(intent(DOM))
  opHistory$.subscribe(h=>console.log("Operation/action/command",h))*/

  let model$ = just("foo")
  const vtree$ = just(<div> test </div>)

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
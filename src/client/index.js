/** @jsx hJSX */
import Cycle from '@cycle/core'
import {Rx} from '@cycle/core'
import {makeDOMDriver, hJSX} from '@cycle/dom'
import combineTemplate from 'rx.observable.combinetemplate'


import {renderLabeledCheckbox} from './relayControl'
import SocketIO from 'cycle-socket.io'

import {modelHelper} from './modelHelper'


function intent(DOM){
  let toggleRelay$ =  DOM.get('.relayToggler', 'click')
    .do(e=>console.log("EVENT",e))
    .map(function(e){
      let id = parseInt( e.target.id.split("_").pop() )
      return {id,toggled:e.target.checked}
    })

  return {toggleRelay$}
}


function main(drivers) {
  let DOM      = drivers.DOM
  let socketIO = drivers.socketIO


  function renderRelays(relaysData){
    return relaysData.map( (relayData,index) =>
      <div>
        {relayData.name}
        { renderLabeledCheckbox("Toggle:", relayData.toggled, "checker_"+index, "relayToggler") } 
      </div>
    )
  }

  function view(model$){
    return model$.map(model =>
      <div>
        <div> Relays: </div>
        {renderRelays(model.relays)}
      </div>
    )
  }


  function model(actions){

    const defaults = {
      relays:[
         {toggled:false,name:"relay0"}
        ,{toggled:false,name:"relay1"}
        ,{toggled:true, name:"relay2"}
      ]
    }

    function modifications(actions){
      let toggleRelayMod$ = actions.toggleRelay$
        .map((toggleInfo) => (currentData) => {
          let targetRelay = currentData.relays[toggleInfo.id]
          if(targetRelay){
            targetRelay.toggled = toggleInfo.toggled
          }
          console.log("targetRelay",targetRelay,toggleInfo.id, toggleInfo)
          
          return currentData
        })

      return Rx.Observable.merge(
        toggleRelayMod$
        )
    }

    return modelHelper(defaults,modifications)(actions)
  }






  let model$ = model(intent(DOM))

  let stream$ = model$
  const incomingMessages$ = socketIO.get('messageType')
  const outgoingMessages$ = stream$.map( 
    function(eventData){
      return {
        messageType: 'someEvent',
        message: JSON.stringify(eventData)
      }
    })

  return {
      DOM: view(model$)
    , socketIO: outgoingMessages$
  }
}

//////////setup drivers
let socketIODriver = SocketIO.createSocketIODriver(window.location.origin)
let domDriver      = makeDOMDriver('#app')

let drivers = {

   DOM: domDriver
  ,socketIO: socketIODriver
}

Cycle.run(main, drivers)
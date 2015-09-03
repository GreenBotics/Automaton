import Immutable from 'seamless-immutable'
//import Immutable from 'immutable'
import {modelHelper} from './modelHelper'


export function intent(DOM){
  let toggleRelay$ =  DOM.get('.relayToggler', 'click')
    .do(e=>console.log("EVENT relay toggling",e))
    .map(function(e){
      let id = parseInt( e.target.id.split("_").pop() )
      return {id,toggled:e.target.checked}
    })

  let emergencyShutdown$ = DOM.get('#shutdown', 'click')
    .map(true)

  return {toggleRelay$, emergencyShutdown$}
}


export function model(actions){

    const defaults = Immutable(
      {
        active:true,

        relays:[
           {toggled:false,name:"relay0"}
          ,{toggled:false,name:"relay1"}
          ,{toggled:true, name:"relay2"}
        ]
      }
    )

    function modifications(actions){
      let toggleRelayMod$ = actions.toggleRelay$
        .map((toggleInfo) => (currentData) => {
          /*//normal
          let targetRelay = currentData.relays[toggleInfo.id]
          if(targetRelay){
            targetRelay.toggled = toggleInfo.toggled
          }
          console.log("targetRelay",targetRelay,toggleInfo.id, toggleInfo)*/
          
          /*//Immutable.js
          let targetRelay = currentData.get("relays",toggleInfo.id)
          console.log("targetRelay",targetRelay,toggleInfo.id, toggleInfo)

          if(targetRelay)
          {
            targetRelay.set("toggled",toggleInfo.toggled)
          }*/
          //console.log("currentData BEFORE",JSON.stringify(currentData))

          //seamless-immutable 
          let relays = currentData.relays
            //.filter((e,index)=>toggleInfo.id===index)
            .map(function(relay,index){
              if(index === toggleInfo.id){
                return {name:relay.name,toggled:toggleInfo.toggled}
              }
              return relay
            })

          currentData = currentData.merge({relays})
          //console.log("currentData AFTER",JSON.stringify(currentData))
          currentData = currentData.merge({active:true})

          return currentData
        })

      let emergencyShutdownMod$ = actions.emergencyShutdown$
        .map((toggleInfo) => (currentData) => {

          let relays = currentData.relays
            .map( relay => ({ toggled:false, name:relay.name}) )
          currentData = currentData.merge({active:false})
      
          return currentData.merge( {relays} )
        })

      return Rx.Observable.merge(
        toggleRelayMod$
        ,emergencyShutdownMod$
      )
    }

    return modelHelper(defaults,modifications)(actions)
  }
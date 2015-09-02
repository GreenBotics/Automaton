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

  let undo$ = DOM.get('#undo','click')
    .do(e=>console.log("EVENT undo ",e))
    .map(true)

  let redo$ = DOM.get('#redo','click')
    .do(e=>console.log("EVENT redo ",e))
    .map(false)

  return {toggleRelay$}
}


export function model(actions){

    const defaults = Immutable(
      {
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

          //seamless-immutable
          let targetRelay = currentData.relays[toggleInfo.id]
          //console.log("targetRelay",targetRelay,toggleInfo.id, toggleInfo)

          if(targetRelay)
          {
            targetRelay.merge({toggled:toggleInfo.toggled})
          }

          return currentData
        })

      return Rx.Observable.merge(
        toggleRelayMod$
        )
    }

    return modelHelper(defaults,modifications)(actions)
  }
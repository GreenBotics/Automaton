import Immutable from 'seamless-immutable'
//import Immutable from 'immutable'
import {modelHelper} from './modelHelper'


export function intent(DOM){
  let toggleRelay$ =  DOM.get('.relayToggler', 'click')
    //.do(e=>console.log("EVENT relay toggling",e))
    .map(function(e){
      let id = parseInt( e.target.id.split("_").pop() )
      return {id,toggled:e.target.checked}
    })

  let emergencyShutdown$ = DOM.get('#shutdown', 'click')
    .map(true)


  let undo$ = DOM.get('#undo','click')
    //.do(e=>console.log("EVENT undo ",e))
    .map(true)

  let redo$ = DOM.get('#redo','click')
    //.do(e=>console.log("EVENT redo ",e))
    .map(false)


  return {toggleRelay$, emergencyShutdown$, undo$, redo$}
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

        //only for undo/redo , experimental
        ,_past:[]
        ,_future:[]
      }
    )

    function modifications(actions){

      function logHistory(currentData){ 
        let _past   = [currentData].concat(currentData._past)
        let _future = []
        currentData = currentData.merge({_past, _future})
        return currentData
      }

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

          //history
          currentData = logHistory(currentData)

          let relays = currentData.relays
            //.filter((e,index)=>toggleInfo.id===index)
            .map(function(relay,index){
              if(index === toggleInfo.id){
                return {name:relay.name,toggled:toggleInfo.toggled}
              }
              return relay
            })

          //console.log("currentData AFTER",JSON.stringify(currentData))
          currentData = currentData.merge([{active:true}, {relays}])


          return currentData
        })

      let emergencyShutdownMod$ = actions.emergencyShutdown$
        .map((toggleInfo) => (currentData) => {

          //history
          currentData = logHistory(currentData)

          let relays = currentData.relays
            .map( relay => ({ toggled:false, name:relay.name}) )
          currentData = currentData.merge( [{active:false}, {relays}] )
     
          return currentData
        })

      let undoMod$ = actions.undo$
        .map((toggleInfo) => (currentData) => {
          console.log("Undoing")
          //history
          let cur     = currentData._past[0]//currentData._past.length-1]
          let _past   = currentData._past.slice(1)
          let _future = [currentData].concat(currentData._future)

          cur = cur.merge({_past,_future})

          return cur
        })

      let redoMod$ = actions.redo$
        .map((toggleInfo) => (currentData) => {
          console.log("Redoing")
          //history
          let cur = currentData._future[0]

          let _past = [currentData].concat(currentData._past) 
          let _future = currentData._future.slice(1)

          cur = cur.merge({_past,_future})

          return cur
        })

      return Rx.Observable.merge(
        toggleRelayMod$
        ,emergencyShutdownMod$
        ,undoMod$
        ,redoMod$
      )
    }

    return modelHelper(defaults,modifications)(actions)
  }
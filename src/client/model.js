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

      //merge the current data with any number of input data
      function mergeData(currentData,inputs){
        if("merge" in currentData){
          return currentData.merge(inputs)
        }
        return Object.assign(currentData,inputs)
      }

      function logHistory(currentData){ 
        let _past   = [currentData].concat(currentData._past)
        let _future = []

        console.log("currentData",_past)
        currentData = mergeData(currentData, {_past, _future})
        return currentData
      }

      let toggleRelayMod$ = actions.toggleRelay$
        .map((toggleInfo) => (currentData) => {
          //seamless-immutable 
          //history (undo redo)
          currentData = logHistory(currentData)

          let relays = currentData.relays
            .map(function(relay,index){
              if(index === toggleInfo.id){
                return {name:relay.name,toggled:toggleInfo.toggled}
              }
              return relay
            })

          //console.log("currentData AFTER",JSON.stringify(currentData))
          currentData = mergeData( currentData, [{active:true}, {relays}] )

          return currentData
        })

      let emergencyShutdownMod$ = actions.emergencyShutdown$
        .map((toggleInfo) => (currentData) => {

          //history
          currentData = logHistory(currentData)

          let relays = currentData.relays
            .map( relay => ({ name:relay.name, toggled:false}) )
          currentData = mergeData( currentData, [{active:false}, {relays}] )
     
          return currentData
        })

      let undoMod$ = actions.undo$
        .map((toggleInfo) => (currentData) => {
          console.log("Undoing")

          let cur     = currentData._past[0]
          let _past   = currentData._past.slice(1)
          let _future = [currentData].concat(currentData._future)

          cur = mergeData(cur, {_past,_future})

          return cur
        })

      let redoMod$ = actions.redo$
        .map((toggleInfo) => (currentData) => {
          console.log("Redoing")

          let cur = currentData._future[0]
          let _past = [currentData].concat(currentData._past) 
          let _future = currentData._future.slice(1)

          cur = mergeData(cur, {_past,_future})

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
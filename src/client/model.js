import Immutable from 'seamless-immutable'
import {Rx} from '@cycle/core'

//import Immutable from 'immutable'
import {modelHelper} from './modelHelper'
import {mergeData} from './utils'

export function intent(DOM){
  let toggleRelay$ =  DOM.get('.relayToggler', 'click')
    //.do(e=>console.log("EVENT relay toggling",e))
    .map(function(e){
      let id = parseInt( e.target.id.split("_").pop() )
      return {id,toggled:e.target.checked}
    })

  let emergencyShutdown$ = DOM.get('#shutdown', 'click')
    .map(false)


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
        
        state:{
          active:true,

          relays:[
             {toggled:false,name:"relay0"}
            ,{toggled:false,name:"relay1"}
            ,{toggled:true, name:"relay2"}
          ]
        }

        //only for undo/redo , experimental
        ,history:{
          _past:[]
          ,_future:[]
        }
     
      }
    )

  

    function modifications(actions){

      

      function logHistory(currentData, history){ 
        let _past   = [currentData].concat(history._past)
        let _future = []

        console.log("currentData",_past)
        history = mergeData(history, {_past, _future})
        return history
      }

      let toggleRelayMod$ = actions.toggleRelay$
        //splice in history
        /*.withLatestFrom(intent.settings$,function(data,settings){
          return {nentities:data,settings}
        })*/
        .map((toggleInfo) => ({state,history}) => {
          //seamless-immutable 
          //history (undo redo)
          history = logHistory(state,history)

          let relays = state.relays
            .map(function(relay,index){
              if(index === toggleInfo.id){
                return {name:relay.name,toggled:toggleInfo.toggled}
              }
              return relay
            })

          //console.log("state AFTER",JSON.stringify(state))
          state = mergeData( state, [{active:true}, {relays}] )

          return Immutable({state,history})
        })

      let emergencyShutdownMod$ = actions.emergencyShutdown$
        .map((payload) => ({state,history}) => {

          history = logHistory(state, history)

          let relays = state.relays
            .map( relay => ({ name:relay.name, toggled:payload}) )

          state = mergeData( state, [{active:payload}, {relays}] )

          return Immutable({state,history})
        })

      let undoMod$ = actions.undo$
        .map((toggleInfo) => ({state,history}) => {
          console.log("Undoing")

          let nState     = history._past[0]
          let _past   = history._past.slice(1)
          let _future = [state].concat(history._future)

          history = mergeData(history,{_past,_future})

          return Immutable({state:nState,history})
        })

      let redoMod$ = actions.redo$
        .map((toggleInfo) => ({state,history}) => {
          console.log("Redoing")

          let nState = history._future[0]
          let _past = [state].concat(history._past) 
          let _future = history._future.slice(1)

          history = mergeData(history,{_past,_future})

          return Immutable({state:nState,history})
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
import Immutable from 'seamless-immutable'
import {Rx} from '@cycle/core'

import {modelHelper} from './modelHelper'


export function historyIntent(DOM){
  let undo$ = DOM.get('#undo','click')
    .do(e=>console.log("EVENT undo ",e))
    .map(true)

  let redo$ = DOM.get('#redo','click')
    .do(e=>console.log("EVENT redo ",e))
    .map(false)

  return {undo$, redo$}
}


export function history(actions, observedModel$){

  const defaults = Immutable({
    _past:[]
    ,_future:[]
  })

  observedModel$.subscribe(e=>console.log("observedModel",e))

  function modifications(actions){
    let undoMod$ = actions.undo$
      .map((toggleInfo) => (currentData) => {
        console.log("Undoing")

        /*let cur     = currentData._past[0]
        let _past   = currentData._past.slice(1)
        let _future = [currentData].concat(currentData._future)

        cur = mergeData(cur, {_past,_future})
        return cur
        */

        return currentData
      })

      let redoMod$ = actions.redo$
        .map((toggleInfo) => (currentData) => {
          console.log("Redoing")

          /*let cur = currentData._future[0]
          let _past = [currentData].concat(currentData._past) 
          let _future = currentData._future.slice(1)

          cur = mergeData(cur, {_past,_future})

          return cur*/
          return currentData
        })

      return Rx.Observable.merge(
        undoMod$
        ,redoMod$
      )
  }

  return modelHelper(defaults,modifications)(actions)
}
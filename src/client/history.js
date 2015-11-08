import Immutable from 'seamless-immutable'
import Rx from 'rx'

import {modelHelper} from './model/modelHelper'


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
    past:[]
    ,future:[]
  })

  observedModel$.subscribe(e=>console.log("observedModel",e))

  function modifications(actions){
    let undoMod$ = actions.undo$
      .map((toggleInfo) => (currentData) => {
        console.log("Undoing")

        /*let cur     = currentData.past[0]
        let past   = currentData.past.slice(1)
        let future = [currentData].concat(currentData.future)

        cur = mergeData(cur, {past,future})
        return cur
        */

        return currentData
      })

      let redoMod$ = actions.redo$
        .map((toggleInfo) => (currentData) => {
          console.log("Redoing")

          /*let cur = currentData.future[0]
          let past = [currentData].concat(currentData.past) 
          let future = currentData.future.slice(1)

          cur = mergeData(cur, {past,future})

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
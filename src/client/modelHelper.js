import {Rx} from '@cycle/core'


export function modelHelper(defaults,modFunction){


  return function model(actions){
    let source$ =  Rx.Observable.just(defaults)
    let mods$   =  modFunction(actions)

    return mods$
      .merge(source$)
      .scan((currentData, modFn) => modFn(currentData))//combine existing data with new one
      //.distinctUntilChanged()
      .shareReplay(1)
  }
  

}


  /*let model$ = combineTemplate(
    {
      relays:[
        actions.
      ]
    }*/

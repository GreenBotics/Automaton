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


//old model code
    /*function modifications(actions){

      let toggleRelayMod$ = actions.toggleRelay$
        //splice in history? or settings?
        //.withLatestFrom(intent.settings$,function(data,settings){
        //  return {nentities:data,settings}
        //})
        .map((input) => ({state,history}) => {

          history = logHistory(state,history)
          state   = toggleRelay(state,input)

          return Immutable({state,history})
        })

      let emergencyShutdownMod$ = actions.emergencyShutdown$
        .map((input) => ({state,history}) => {

          history = logHistory(state, history)
          state   = emergencyShutdown(state, input)
      
          return Immutable({state,history})
        })

      let setCoolerPowerMod$ = actions.setCoolerPower$
        .map((input) => ({state,history}) => {

          history = logHistory(state, history)
          state   = setCoolerPower(state, input)
      
          return Immutable({state,history})
        })


      //we need to seperate this somehow?
      let undoMod$ = actions.undo$
        .map((toggleInfo) => ({state,history}) => {
          console.log("Undoing")

          let nState     = history.past[0]
          let past   = history.past.slice(1)
          let future = [state].concat(history.future)

          history = mergeData(history,{past,future})

          return Immutable({state:nState,history})
        })

      let redoMod$ = actions.redo$
        .map((toggleInfo) => ({state,history}) => {
          console.log("Redoing")

          let nState = history.future[0]
          let past = [state].concat(history.past) 
          let future = history.future.slice(1)

          history = mergeData(history,{past,future})

          return Immutable({state:nState,history})
        })

      return Rx.Observable.merge(
        toggleRelayMod$
        ,emergencyShutdownMod$
        ,setCoolerPowerMod$


        ,undoMod$
        ,redoMod$
      )
    }

    return modelHelper(defaults,modifications)(actions)*/
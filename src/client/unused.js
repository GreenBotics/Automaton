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


    function historyM(actions){
  let actionsL = []
  for(let key in actions){
    //console.log("actions",key)

    let opName = key.replace(/\$/g, "")
    let action$ = actions[key].map(a=>({type:opName,data:a}))
    actionsL.push(action$)
  }

  return Rx.Observable.merge(actionsL)
}

function testView(model$,sensor1Data$, sensor2Data$){

    return sensor1Data$
      .bufferWithCount(20,19)
      .combineLatest( sensor2Data$.bufferWithCount(20,19),function(sensor1Data,sensor2Data){
        return <div>
          <div> Some stuff here </div>
          {new GlWidget([sensor1Data,sensor2Data])}
          {new GraphWidget([sensor1Data,sensor2Data])}
        </div>
        //foo([sensor1Data,sensor2Data])
      })
    //return sensor1Data$.map(foo)
  }

// let opHistory$ = historyM(intent(DOM))
//opHistory$.subscribe(h=>console.log("Operation/action/command",h))
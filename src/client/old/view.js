
   //.map(m=>m.asMutable({deep: true}))//for seamless immutable
    //.distinctUntilChanged()
    //.shareReplay(1)
  /*return combineLatest(state$.map(m=>m.asMutable({deep: true})).pluck("state"),graphsGroupVTree$,function(state,graphsGroup)
    {
      //console.log("FEEDS",state.feeds, state.nodes)
      let sensorNodeList = state.nodes.map(function(node){
        return <option value={node._id}>{node.name}</option>
      })

      const nameMappings = {
        "windSpd":"wind speed"
        ,"windDir":"wind direction"
      }
    })*/



    /*.map((state)=>
      <div>
        <section id="overview">
          <h1> System state: {state.active ? 'active' : 'inactive'} </h1>
        </section>

        <section id="relays">
          <h1>Relays: </h1>
          {renderRelays( state.relays )}
        </section>

        <section id="cooling">
          <h1>Cooling </h1>
          {renderCoolers( state.coolers )}
        </section>

        <section id="emergency">
          <h1> Emergency shutdown </h1>
          <button id="shutdown" disabled={!state.active}> shutdown </button>
        </section>
      </div>
    )*/

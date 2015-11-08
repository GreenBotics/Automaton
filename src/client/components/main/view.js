/** @jsx hJSX */
import Cycle from '@cycle/core'
import {hJSX} from '@cycle/dom'
import Rx from 'rx'
const combineLatest = Rx.Observable.combineLatest

import {combineLatestObj} from '../../utils'

import {renderRelays, renderCoolers, renderSensors, renderHistory, renderSensorData} from '../uiElements'


export default function view(state$, graphsGroupVTree$){
   //.map(m=>m.asMutable({deep: true}))//for seamless immutable
    //.distinctUntilChanged()
    //.shareReplay(1)
  return combineLatest(state$,graphsGroupVTree$,function(state,graphsGroup)
    {
      let sensorFeedsList = state.sensorsFeeds.map(function(feed){
        return <option value={feed.id}>{feed.type}</option>
      })
      
      let sensorNodeList = state.sensorNodes.map(function(node){
        return <option value={node.id}>{node.name}</option> 
      })

      return <div>
        <section id="nodeSelect">
          <select id="nodeChooser">
            <option value="-1"> All </option> 
            {sensorNodeList}
          </select>
          <select id="sensorFeedChooser">
            <option value="-1"> All </option> 
            {sensorFeedsList}
          </select>
        </section>
        
        {graphsGroup}
      </div>
    })
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

}

/** @jsx hJSX */
import Cycle from '@cycle/core'
import {hJSX} from '@cycle/dom'
import Rx from 'rx'
const combineLatest = Rx.Observable.combineLatest

import Class from 'classnames'
import {find,propEq} from 'ramda'

import {combineLatestObj} from '../../utils'

import {renderRelays, renderCoolers, renderSensors, renderHistory, renderSensorData} from '../uiElements'


export default function view(state$, graphsGroupVTree$){
   //.map(m=>m.asMutable({deep: true}))//for seamless immutable
    //.distinctUntilChanged()
    //.shareReplay(1)
  return combineLatest(state$.map(m=>m.asMutable({deep: true})).pluck("state"),graphsGroupVTree$,function(state,graphsGroup)
    {
     
      //console.log("FEEDS",state.feeds, state.nodes)
      
      let sensorNodeList = state.nodes.map(function(node){
        return <option value={node._id}>{node.name}</option> 
      })

      const nameMappings = {
        "windSpd":"wind speed"
        ,"windDir":"wind direction"
      }

      let feedsSelector = undefined
      if(state.feedsSelectionToggled){
        const allFeeds = state.nodes.map(function(node){
          return node.sensors.map(function(feed){
              //const attributes = attributes={{"data-name": row.name, "data-id":row.id}} key={row.id}
              //key={feed.id}
              const key = `${node._id}${feed.id}`
              const valid = (propEq('node',node._id)&&propEq('feed',feed.id))
              const selected = find(valid, state.selectedFeeds)
              //console.log("selected",selected)

              return <li className={ Class("feed",{ "selected": selected }) }  
                attributes={{"data-node": node._id, "data-feed":feed.id}} 
              >
                <div>{feed.type}</div>
                <div>(Node_{node._id})</div>
              </li>
          })

        })

        feedsSelector = <section id="feedsSelector">
          <h1> Select feeds </h1>
          <section>
            <ul>
              {allFeeds}
            </ul>
          </section>
        </section>
      }

      ////
      let adder = undefined
      if(state.addItemsToggled){
        adder = <section id="adder">
          <h1> Add nodes/sensors </h1>
          <section>
            <ul>
              
            </ul>
          </section>
        </section>
      }



      return <div>
        <section id="nodeSelect">
          <button id="addItems">Add items</button>
          <button id="feedsSelect">Select feeds </button>

          <span> Start </span> <input type="range" />
          <span> End </span> <input type="range" />
          
          
        </section>

        

        {feedsSelector}
        {adder}
        
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

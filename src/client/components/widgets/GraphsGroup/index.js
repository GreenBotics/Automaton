/** @jsx hJSX */
import Cycle from '@cycle/core'
import {hJSX} from '@cycle/dom'
import Rx from 'rx'
const combineLatest = Rx.Observable.combineLatest
const just          = Rx.Observable.just
//import {GraphWidget} from '../widgets/GraphWidget'
import {GraphWidget} from '../GraphWidget/graphWidget'
var d3 = require('metrics-graphics/node_modules/d3')

import fecha from 'fecha'

import {combineLatestObj} from '../../../utils/obsUtils'

import {mergeAll,flatten,nth} from 'ramda'

function model(props$, actions){
  return props$
}

function intent(){
  return {}
}


function view(state$){
  let endOfDay = new Date()
  endOfDay.setHours(23)
  endOfDay.setMinutes(59)
  endOfDay.setSeconds(59)
  //endOfDay = new Date( Date.now()+2000000 )

  let startOfDay = new Date()
  startOfDay.setHours(9)
  startOfDay.setMinutes(0)
  startOfDay.setSeconds(0)

  const maxPts = endOfDay

  let commonGraphSettings = {
    animate_on_load:true
    ,transition_on_update:true
    ,axes_not_compact:true
    //,max_x:endOfDay
    //,min_x:startOfDay
    //,height:200
    ,xax_format:d3.time.format('%H:%M:%S')
    //,xax_count:8
    ,show_secondary_x_label:false
    ,x_rug:true

    ,chart_type:'line'
    ,area:true

    //,decimals:5
    ,height: 300
    ,full_width: true
    //,full_height:true
  }

  //type can be temperature, pressure , speed etc
  function makeSettingsByType(type){

    const mappings = {
      'temperature' : {
        title: "Temperature (C)"
        ,description:"Temperature curves for env#0"
        ,legend:["T0"]
        ,min_y:-30
        ,max_y:50
        ,y_label:"°C"
      },
      'humidity':{
        title: "Humidity (%)"
        ,description:"humitidy curves for env#0"
        ,legend:["H0"]
        ,min_y:0
        ,max_y:100
        ,y_label:"%"
      },
      'pressure' : {
        title: "Pressure (hpa)",
        description:"pressure curves for env#0",
        legend:["P0"],
        //baselines: [{value:12, label:'critical pressure stuff'}],
      },
      'windSpd' : {
        title: "Wind speed (km/h)"
        ,description:"wind speed curves for env#0"
        ,legend:["WS0"]
        ,min_y:0
        ,max_y:200
        //baselines: [{value:12, label:'critical pressure stuff'}],
      },
      'windDir' : {
        title: "Wind direction",
        description:"wind direction curves for env#0",
        legend:["WS0"],
        //baselines: [{value:12, label:'critical pressure stuff'}],
      },
      'rain':{
        title: "Precipitations (mm)",
        description:"Rain curves for env#0",
        max_x:maxPts,
        legend:["R0"],
        //baselines: [{value:12, label:'critical pressure stuff'}],
      },
      'UV' : {
        title: "UV level",
        description:"UV level curves for env#0",
        legend:["UV0"],
        //baselines: [{value:12, label:'critical pressure stuff'}],
      },
      'IR' : {
        title: "IR level",
        description:"IR level curves for env#0",
        legend:["IR0"],
        //baselines: [{value:12, label:'critical pressure stuff'}],
      },
      'light' : {
        title: "Light level",
        description:"Light level curves for env#0",
        legend:["L0"],
        //baselines: [{value:12, label:'critical pressure stuff'}],
      }

    }

    return mappings[type]

  }




  function initGraph(dataType, id){
    console.log("initGraph",dataType,id)
    const typeSettings = makeSettingsByType(dataType)
    let graphSettings = Object.assign({},commonGraphSettings,typeSettings)
    const graphId = "_"+id//we need to prevent leading numeric values see http://stackoverflow.com/questions/20306204/using-queryselector-with-ids-that-are-numbers

    graphSettings.mouseover = function onGraphMouseOver (d,i) {
      let selector = `#${graphId} svg .mg-active-datapoint`
      let elem =  document.querySelector(selector)
      //console.log("selector",selector,"match",elem)

      if(elem){
        const timeString = fecha.format(d.time, 'YYYY-MM-DD hh:mm:ss A')
        elem.innerHTML = `${dataType}: ${d.value}    ${timeString}`
      }
    }
    /*,mouseover: function(d, i) {
      console.log("rollover",d,i)
        //custom format the rollover text, show days
        let elem =  document.querySelector('svg .mg-active-datapoint')
        console.log("elem",elem)
        elem.innerHTML = "GNA GNA" + d.value +"  "+ d.time.toString()
    }*/

    const graph = new GraphWidget(undefined, graphSettings, graphId)
    graph.init()
    return graph
  }


  return state$.distinctUntilChanged().map(function(state){
    console.log("GraphsGroup state",state)
    const feeds = state.feeds

    //FIXME: horrible
    function getFeedType(feedId){
      const types = state.nodes.map(node =>{
        return node.sensors
          .filter(s=>s.id === feedId)
          .map(s=>s.type)
      })
      .filter(l=>l.length > 0)
      //console.log("getFeedType", nth(0,types) )

      return nth(0,flatten(types))
    }

    const refinedFeedsData = state.selectedFeeds
      .map(sf=>sf.feed)
      .map(function(feedId){
        const timeSeries = state.feeds
          .filter( feed => feed[feedId] !== undefined )
          .map( feed => ( {value:feed[feedId], time:new Date(feed.timestamp*1000)} ) )
        const type   = getFeedType(feedId)
        const data = {
          id:feedId
          ,type
          ,timeSeries
        }
        return data
      })
      .asMutable()//needed , otherwise we loose prototypes, needed for graphWidget

    console.log("feed TEST",refinedFeedsData)

    //multi graph version
    function makeComboGraph(refinedFeedsData){
      let combinedData = refinedFeedsData.reduce(function(acc, data, index){
        console.log("current data",data)
        acc.timeSeries.push( data.timeSeries.asMutable({deep:true}) )
        acc.types.push( data.type )
        acc.ids.push( data.id)
        return acc
      },{ids:[],timeSeries:[],types:[] })


      console.log("foo",combinedData)
      //comboGraph.updateData(combinedData.timeSeries)

      const typeSettings =  {
        title: "Combo"
        ,description:""
        ,missing_is_hidden: false
        ,missing_is_zero: false
        //,y_accessor: combinedData.types
        ,legend:combinedData.types
        //,colors:['#FF0000','#00FF00']
      }
      let graphSettings = Object.assign({},commonGraphSettings,typeSettings)

      var shortid = require('shortid')

      const graphId = "foo"// "_"+shortid.generate()//undefined//"foo"
      const graph = new GraphWidget(undefined, graphSettings, graphId)
      graph.init()

      if(combinedData.timeSeries.length>0 && combinedData.timeSeries[0].length>0){
        graph.updateData(combinedData.timeSeries)
        return graph
      }else
      {
        return null
      }

    }

    function makeMultiGraphs(refinedFeedsData){
      let graphList = refinedFeedsData
        .map( feed => {
          return initGraph(feed.type, feed.id)
        })

      //update all graphs
      refinedFeedsData.forEach(function(data,index){
        graphList[index].updateData(data.timeSeries)
      })

      return graphList
    }

    //let graphList = makeComboGraph(refinedFeedsData)
    let graphList = makeMultiGraphs(refinedFeedsData)

    return <section id="graphs">
        {graphList}
      </section>
    })
}



function GraphsGroup({DOM, props$}, name = '') {
  const state$ = model(props$)

  const vtree$ = view(state$)

  return {
    DOM: vtree$
  }
}

export default GraphsGroup

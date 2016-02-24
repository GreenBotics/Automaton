import {toArray,combineLatestObj} from '../../utils'

import Rx from 'rx'

function getId(e){
  let id = parseInt( e.target.id.split("_").pop() )
  return {id}
}

function idAndChecked(e){
  let id = parseInt( e.target.id.split("_").pop() )
  return {id,toggled:e.target.checked}
}

function idAndValue(e){
  let id = parseInt( e.target.id.split("_").pop() )
  //let value = parseFloat(e.target.value)// for basic use case
  let value = parseFloat(e.detail)//for custom element etc
  return {id,value}
}


export default function intent({DOM,socketIO}, other){
  let toggleRelay$ =  DOM.select('.relayToggler')
    .events('click')
    .map(idAndChecked)

  let removeRelay$ = DOM.select('.removeRelay')
    .events('click')
    .map(getId)

  let removeAllRelays$ = DOM.select('#removeAllRelays')
    .events('click')
    .map(true)

  let setCoolerPower$ = DOM.select('.coolerSlider')
      .events('input')//input vs change events
    .merge( DOM.select('.labeled-input-slider-cooler')
      .events('change') )
    //DOM.select('.coolerSlider_number','change')
    .debounce(30)
    .map(idAndValue)
    .do(e=>console.log("value",e))

  //let setCoolerPower$ = other.setCoolerPower$//.debounce(30)

  DOM.select('.labeled-input-slider-cooler')
    .events('newValue')
    .subscribe(e=>console.log("saw cooler slider change",e))

  let emergencyShutdown$ = DOM.select('#shutdown')
    .events('click')
    .map(false)

  let toggleSensor$ = DOM.select('.sensorToggler')
    .events('click')
    .map(idAndChecked)


  //////////
  let undo$ = DOM.select('#undo')
    .events('click')
    .map(true)

  let redo$ = DOM.select('#redo')
    .events('click')
    .map(false)

  //nodes
  const setNodes$ = socketIO.get("initialData")
    .map(e=>JSON.parse(e))

  const startAddingNodes$ = DOM.select("#addNode")
    .events('click')
    .map(true)

  const selectNodes$ = DOM.select("#nodeChooser")
    .events('change')
    .map(e=>parseInt(e.target.value))

  function selectMultiples(selectors, events=[]){

    const result= selectors.reduce(function(res, selector, index){
      const event   = events[index] || 'change'
      const obs     = DOM.select(selector)
        .events(event)
        .map(e=>e.target.value)
        .startWith(undefined)

      res[selector.replace('.','')] = obs
      return res
    },{})

    return combineLatestObj( result )
  }

  const addNode$ = DOM.select("#doAddNode")
    .events('click')
    .withLatestFrom( selectMultiples(['.microcontroller','.sensorModel','.deviceName','.wifiSSID','.wifiPass']),(_,data)=>data )
    .tap(e=>console.log("adding Node",e))

  const addSensorPackageToNode = DOM.select('#AddSensorPackageToNode')
    .events('click')
    .forEach(e=>console.log("adding sensorPackage to Node",e))

  //feeds
  const selectFeeds$ = DOM.select(".feed")
    .events('click')
    .map(function(e){
      const node = parseInt(e.currentTarget.dataset.node)
      const feed = e.currentTarget.dataset.feed
      return {node,feed}
    })
    .map(toArray)

  const searchFeeds$ = DOM.select("#feedSearch")
    .events('input')
    .map(e=>e.target.value)

  const toggleFeedsSelection$ = DOM.select("#feedsSelect")
    .events("click")
  const toggleAddItems$ = DOM.select("#addItems")
    .events("click")



  //////

  const setFeedsData$ = socketIO.get("getFeedsData")
    .map(e=>JSON.parse(e))

  selectNodes$.forEach(e=>console.log("selectNodes",e))
  //setInitialData$.forEach(e=>console.log("got initialData",e))
  setFeedsData$.forEach(e=>console.log("got feeds data",e))
  selectFeeds$.forEach(e=>console.log("selectFeeds",e))


  return {
    toggleRelay$
    ,removeRelay$
    ,removeAllRelays$

    ,emergencyShutdown$

    ,setCoolerPower$
    ,toggleSensor$
    //

    ,startAddingNodes$
    ,selectNodes$
    ,setNodes$
    ,addNode$

    ,selectFeeds$
    ,setFeedsData$
    ,searchFeeds$
    ,toggleFeedsSelection$

    ,toggleAddItems$


    , undo$
    , redo$}
}

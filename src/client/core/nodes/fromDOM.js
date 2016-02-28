import {toArray, generateUUID} from '../../utils/utils'
import {combineLatestObj} from '../../utils/obsUtils'

function selectMultiples(DOM, selectors, events=[]){

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

export default function actions(DOM){
  const selectNodes$ = DOM.select("#nodeChooser")
    .events('change')
    .map(e=>parseInt(e.target.value))

  const upsertNodes$ = DOM.select("#confirmAddNode")
    .events('click')
    .withLatestFrom( selectMultiples(DOM, ['.microcontroller','.sensorModel','.deviceName','.wifiSSID','.wifiPass']),(_,data)=>data )
    .map(function(data){
      const outData = {
        name:data.deviceName
        ,uid:generateUUID()
        ,microcontroller:data.microcontroller
        ,sensors:[]
        ,uri:undefined
      }
      return {data:outData,id:-1}
    })
    .tap(e=>console.log("adding Node",e))
    .share()

  const removeNodes$ = DOM.select(".removeNodes")
    .events('click')
    //.tap(e=>console.log("removeNodes",))
    .map(e=>({id:e.target.dataset.node}))

  /*const startAddingNodes$ = DOM.select("#addNode")
    .events('click')
    .map(true)*/

  const selectedSensorPackageToAdd$ = DOM.select('.sensorModel').observable
    .filter(e=>e.length>0).map(e=>e[0])//get the first one if there is one
    .map(e=>e.options[e.selectedIndex].text) //get current selection (initial value)
    .merge(DOM.select('.sensorModel').events('change').map(e=>e.currentTarget.value))//combine with dynamic selection
    //.tap(e=>console.log("sensorModel",e))

  const addSensorToNode$ = DOM.select('#AddSensorPackageToNode')
    .events('click')
    .withLatestFrom( selectedSensorPackageToAdd$,(_,p)=>p )
    .tap(e=>console.log("adding sensorPackage to Node",e))

  //UI
  const toggleAddNode$ = DOM.select('.addNode')
    .events('click')

  const cancelAddNode$ = DOM.select('#cancelAddNode')
    .events('click')

  const confirmAddNode$ = upsertNodes$

  return {
    selectNodes$
    ,upsertNodes$
    ,removeNodes$

    ,toggleAddNode$
    ,cancelAddNode$
    ,confirmAddNode$
  }
}

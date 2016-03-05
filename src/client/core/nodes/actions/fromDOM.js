import Rx from 'rx'
const {merge} = Rx.Observable
import {toArray, generateUUID, remapObject, mergeData} from '../../../utils/utils'
import {combineLatestObj} from '../../../utils/obsUtils'

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


function getFormResults(formElement) {

  var formElements = formElement.elements
  //var formParams = {};
  var i = 0;
  var elem = null;
  /*for (i = 0; i < formElements.length; i += 1) {
      elem = formElements[i];
      switch (elem.type) {
          case 'submit':
              break;
          case 'radio':
              if (elem.checked) {
                  formParams[elem.id] = elem.value;
              }
              break;
          case 'checkbox':
              if (elem.checked) {
                  formParams[elem.id] = false //setOrPush(formParams[elem.name], elem.value);
              }
              break;
          default:
              formParams[elem.id] = elem.value//setOrPush(formParams[elem.name], elem.value);
      }
  }*/
  var elements = []
  for (i = 0; i < formElements.length; i++){
    elements[i] = formElements[i]
  }
  var formParams = elements.reduce(function(result, elem){
    const key = elem.id||elem.name||elem.className||'foo'
    console.log("key",key, elem.type)
    switch (elem.type) {
      case 'submit':
          break
      case 'radio':
        if (elem.checked) {
          result[key] = elem.value
        }
        break
      case 'checkbox':
        if (elem.checked) {
          result[key] = false //setOrPush(formParams[elem.name], elem.value);
        }
        break
      case 'text':
        result[key] = elem.value
      break
      case 'number':
        result[key] = elem.value
      break
      case 'password':
        result[key] = elem.value
      break
      case 'select-one':
        result[key] = elem.value
      break
      case 'textarea':
        result[key] = elem.value
      break
      //default:
      //  result[key] = elem.value//setOrPush(formParams[elem.name], elem.value)
    }
    return result

  },{})

  //console.log("formParams",formParams)
  return formParams
}


export default function actions(DOM){
  const selectNodes$ = DOM.select("#nodeChooser")
    .events('change')
    .map(e=>parseInt(e.target.value))

  //const upsertNodes$ = Rx.Observable.never()
    /* DOM.select("#confirmUpsertNode")
    .events('click')
    //.merge( )
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
    .share()*/

  const upsertNodes$ = DOM.select("#addNodeForm").events('submit')
    .tap(function(e){
      e.preventDefault()
      return false
    })
    .map(function(e){
      return getFormResults(e.target)
    })
    .map(function(data){
      /*const outData = {
        name:data.deviceName
        ,uid:generateUUID()
        ,microcontroller:data.microcontroller
        ,sensors:[]
        ,uri:undefined
      }*/
      const mapping = {
        'deviceUUID':'id'
        ,'deviceName':'name'
        ,'deviceDescription':'description'
        //,'microcontroller':'uc'
      }
      data = remapObject(mapping, data)
      data = mergeData(data, {
        sensors:[]
        ,uid:data.id
      })

      return {data, id:data.id}
    })
    //.forEach(e=>console.log("confirmUpsertNode",e))


    /*O.combineLatest(
    DOM.select('.field-one').observable,
    DOM.select('.field-two').observable,
    (a,b) => ({valueA: a[0].value, valueB: b[0].value}))
    .sample(DOM.select('.your-form').events('submit'))
    or
    DOM.select('.your-form').events('submit')
    .map((evt) => extractFormValues(evt.ownerTarget))
    where extractFormValues is a function you write to convert the whole form into an javascript object or array*/


  const removeNodes$ = DOM.select(".removeNodes")
    .events('click')
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
  const toggleUpsertNode$ = merge(
    DOM.select('.addNode').events('click').map(e=>({id:undefined}))
    ,DOM.select('.editNodes').events('click').map(e=>({id:e.target.dataset.node}))
  )

  const cancelUpsertNode$ = DOM.select('#cancelUpsertNode')
    .events('click')

  const confirmUpsertNode$ = upsertNodes$

  return {
    selectNodes$
    ,upsertNodes$
    ,removeNodes$

    ,toggleUpsertNode$
    ,cancelUpsertNode$
    ,confirmUpsertNode$

  }
}

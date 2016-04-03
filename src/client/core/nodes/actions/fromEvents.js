import Rx from 'rx'
const {merge} = Rx.Observable
import {toArray, generateUUID, remapObject, mergeData} from '../../../utils/utils'
import {combineLatestObj} from '../../../utils/obsUtils'


export default function actions(events){


  const upsertNodes$ = events.select('nodeEditor').events('activeNode')
  .map(function(data){
    /*const outData = {
      name:data.deviceName
      ,uid:generateUUID()
      ,microcontroller:data.microcontroller
      ,sensors:[]
      ,uri:undefined
    }*/
    const mapping = {
      'uid':'id'
    }
    data = remapObject(mapping, data)
    data = mergeData(data,{
      //sensors:[]
      uid:data.id
    })

    return {data, id:data.id}
  })
    //.map(toArray)

  return {
    upsertNodes$
  }
}

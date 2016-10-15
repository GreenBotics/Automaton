import { remapObject, mergeData } from '../../../utils/utils'

export default function actions (events) {
  const upsertNodes$ = events.select('nodeEditor').events('activeNode')
    .map(function (data) {
      /* const outData = {
        name:data.deviceName
        ,uid:generateUUID()
        ,microcontroller:data.microcontroller
        ,sensors:[]
        ,uri:undefined
      }*/
      const mapping = {
        'uid': 'id'
      }
      data = remapObject(mapping, data)
      data = mergeData(data, {
        // sensors:[]
        uid: data.id
      })

      return {data, id: data.id}
    })
    // .map(toArray)

  return {
    upsertNodes$
  }
}

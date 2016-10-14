import {toArray} from './utils'

let instance = require('jsondiffpatch').create({
    objectHash: function(obj, index) {
      if (typeof obj._id !== 'undefined') {
        return obj._id;
      }
      if (typeof obj.id !== 'undefined') {
        return obj.id;
      }
      if (typeof obj.name !== 'undefined') {
        return obj.name;
      }
      return '$$index:' + index;
    }
  })

export function extractChangesBetweenArrays(prev, cur){
  let delta = instance.diff(prev, cur)
  //console.log("delta",delta)
  //console.log("diff",delta)//JSON.stringify(delta, null, 2))

  let result = {added:[],removed:[],changed:[], upserted:[]}

  if(delta && "_t" in delta){

      let removed = []
      let added   = []
      let upserted = []

      if(delta["_t"] ===  "a"){
        //array diff
        //"_t": "a",	Array delta (member names indicate array indices)
        Object.keys(delta).map(function(key){
          if(key !=="_t")
          {
            if(key.length>0 && key.indexOf('_')>-1)
            {
              let realKey = parseInt(key.replace('_',''))
              //console.log("removed",delta, realKey)//,key,delta)
              removed.push(prev[realKey])
            }else
            {
              //added or changed
              //console.log("added or changed",delta, key)
              let realKey = parseInt(key)
              upserted.push(cur[realKey])
            }
          }

        })
      }
      result.added    = toArray(added).filter(i=>i!==undefined)
      result.removed  = toArray(removed).filter(i=>i!==undefined)
      result.upserted = toArray(upserted).filter(i=>i!==undefined)
      //console.log("added",result.added)
      //console.log("removed",result.removed)
  }else if(prev === undefined){//not handled right in the above case for some reason ??
    result.upserted = cur
  }

  return result
}

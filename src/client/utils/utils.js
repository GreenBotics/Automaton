
/*converts input data to array if it is not already an array*/
export function toArray(data){
  if(!data) return []
  if(data.constructor !== Array) return [data]
  return data
}

//merge the current data with any number of input data
export function mergeData(currentData,inputs){
  if("merge" in currentData){
    return currentData.merge(inputs)
  }
  return Object.assign(currentData,inputs)
}

export function findIdenticals(equals, listA, listB){
  const result = listA.filter(function(a){
    for(let i=0;i<listB.length;i++){
      let b = listB[i]
      if(equals(a,b)){
        return true
      }
    }
    return false
  })
  return result
}

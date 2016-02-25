
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

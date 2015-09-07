import "babel-core/polyfill"//needed for object.assign

//merge the current data with any number of input data
export function mergeData(currentData,inputs){
  if("merge" in currentData){
    return currentData.merge(inputs)
  }
  return Object.assign(currentData,inputs)
}
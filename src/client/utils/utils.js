import assign from 'fast.js/object/assign'//faster object.assign

export function exists(input){
  return input !== null && input !== undefined
}

/*converts input data to array if it is not already an array*/
export function toArray(data){
  if(!data) return []
  if(data.constructor !== Array) return [data]
  return data
}

//merge the current data with any number of input data
//TODO: this needs to be an external lib, for re-use
//merge the current data with any number of input data
export function mergeData(currentData, ...inputs){
  if("merge" in currentData){
    return currentData.merge(inputs)
  }
  return assign({}, currentData, ...inputs)
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

//TODO: taken from three.js ,do correct attribution
export function generateUUID() {
  // http://www.broofa.com/Tools/Math.uuid.htm
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split( '' );
  let uuid = new Array( 36 );
  let rnd = 0, r;

  return function () {

    for ( let i = 0; i < 36; i ++ ) {

      if ( i == 8 || i == 13 || i == 18 || i == 23 ) {

        uuid[ i ] = '-';

      } else if ( i == 14 ) {

        uuid[ i ] = '4';

      } else {

        if ( rnd <= 0x02 ) rnd = 0x2000000 + ( Math.random() * 0x1000000 ) | 0;
        r = rnd & 0xf;
        rnd = rnd >> 4;
        uuid[ i ] = chars[ ( i == 19 ) ? ( r & 0x3 ) | 0x8 : r ];

      }
    }
    return uuid.join( '' )
  }()
}


/*
Remap the field from the input object using the
provided mapping object (key=>outkey) ie:
input = {foo:42}
remapObject({foo:baz},input) => {baz:42}
*/
export function remapObject(mapping, input){
  const result =  Object.keys(input)
    .reduce(function(obj, key){
      if(key in mapping){
        obj[mapping[key]] = input[key]
      }
      else{
        obj[key] = input[key]
      }
      return obj
    },{})
  return result
}

/*
applies the functions from the mapping hash to the input's fields,
by field name
input = {baz:"42"}
coerceTypes({baz:parseFloat},input) => {baz:42}
*/
export function coerceTypes(mapping, input){
  const result =  Object.keys(input)
    .reduce(function(obj, key){
      if(key in mapping && input[key] !== null && input[key] !== undefined){
        obj[key] = mapping[key](input[key])
      }
      else{
        obj[key] = input[key]
      }
      return obj
    },{})
  return result
}

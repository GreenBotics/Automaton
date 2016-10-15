function localStorageDriver(){
  const safeJSONParse = str => JSON.parse(str) || {} //from cycle.js 

  let lsSettings$ = Rx.Observable.just(
    localStorage.getItem("jam!-settings")
  )
    .map(safeJSONParse)

  let responseCollection = {
    local: { // for localStorage
      key(n) // function returning Observable of the nth key
      getItem(key) // function returning Observable of values
    },
    session: { // for sessionStorage
      key(n) // function returning Observable of the nth key
      getItem(key) // function returning Observable of values
    }
  }
}


/*
// this is to allow a level of inderection between intents & actions
function makeActions(names=[]){
  function reducer( total, name ){
    total[ name+"$" ] = new Rx.Subject()
    return total
  }
  return names.reduce( reducer, {} )
}

const relayActions  = makeActions(["toggleRelay"])
const sensorActions = makeActions(["toggleSensor","foo"])
const coolerActions = makeActions(["setCoolerPower","emergencyShutdown"])

console.log("actions",relayActions, sensorActions, coolerActions)

const actions = {relays:relayActions,sensors:sensorActions,coolers:coolerActions}*/


function remapActions(intentActions, actions){
  //intentActions.toggleRelay$.subscribe(actions.relays.toggleRelay$.asObserver())
  return {
    emergencyShutdown$

    ,relays:{
      toggleRelay$
    }
    ,coolers:{
      setCoolerPower$
    }
    ,sensors:{
      toggleSensor$
    }

  }
}


function highLevelModel(){

  //relays: first model
  const defaults = [
     {toggled:false,name:"relay0"}
    ,{toggled:false,name:"relay1"}
    ,{toggled:true, name:"relay2"}
  ]


  const coolers = [
    {toggled:true,power:10,name:"cooler0"}
    ,{toggled:true,power:72.6,name:"cooler1"}
  ]

  const sensors = [
    {toggled:true,type:"temperature", name:"t0", recordMode:"continuous"}
    ,{toggled:false,type:"temperature", name:"t1", recordMode:"continuous"}
  ]

}
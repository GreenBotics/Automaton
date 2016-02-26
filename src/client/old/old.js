

    function formatedNowTime(index){
      
      let dateTime =  new Date( Date.now()+index*50000 ) 

      return dateTime
      let Y = dateTime.getFullYear()
      let m = dateTime.getMonth()
      let d = dateTime.getDay()

      let H = dateTime.getHours()
      let M = dateTime.getMinutes()
      let S = dateTime.getSeconds()

      //console.log("h",h,"m",m)
      // "%Y-%m-%d-%H-%M-%S"
      return `${Y}-${m}-${d}T${H}:${M}:${S}`
      
    }

    function formatEntry(fieldName,entry){
      console.log("formatEntry",fieldName,entry)      
      return entry.map(function(e,index){
        let result = {time: formatedNowTime(index)} //index+''}//
        result["value"] = e[fieldName]
        return result
      })
    }

    function formatSingleEntry(entry){
      return {value: entry, time: formatedNowTime(0) }
    }

    function packageData(source$, fieldName, dataPoints){
      return slidingAccumulator( source$.pluck(fieldName).map(formatSingleEntry), dataPoints )
    }

     function makeFakeData(count=10){
        let data = new Array(count).join().split(',')//will not work without this , cannot map empty values
        return data.map(function(d,index){
          return {value:Math.random()*25,time:formatedNowTime(-index*100)}

        })
      }


    let bufferedTemp$ = undefined
    let bufferedHum$  = undefined
    let bufferedPres$ = undefined

    let bufferedWindSpd$ = undefined
    let bufferedWindDir$ = undefined

    let bufferedLight$ = undefined
    let bufferedIR$ = undefined
    let bufferedUv$ = undefined

    let bufferedRain$ = undefined

    let useFakeData = false
    let dataPoints  = 20

    let just = Rx.Observable.just


    let sensors$ = Rx.Observable.interval(3000)//60000)
      .flatMap(function(){
        return rxDom.DOM.ajax({url:"http://192.168.1.20:3020"
          ,crossDomain:true
          ,credentials:false
          ,responseType:"json"})
      })
      .retry(10)
      .pluck("response")
      .pluck("variables")
      .shareReplay(1)


    if(useFakeData){
     
      bufferedTemp$ = just( makeFakeData() )
        
      bufferedHum$ = just(
        [
          {time:"0",value:10}
          ,{time:"1",value:20}
          ,{time:"3",value:50}
        ])
      bufferedPres$ = just(
        [
          {time:"0",value:10}
          ,{time:"1",value:20}
          ,{time:"2",value:100}
        ])
      bufferedWindSpd$ = just(
        [
          {time:"0",value:27.5}
          ,{time:"1",value:20}
          ,{time:"2",value:76}
        ])
      bufferedWindDir$ = just(
        [
          {time:"0",value:27.5}
          ,{time:"1",value:20}
          ,{time:"2",value:76}
        ])

      bufferedLight$ = just(
        [
          {time:"0",value:27.5}
          ,{time:"1",value:20}
          ,{time:"2",value:76}
        ])

      bufferedUv$ = just(
        [
          {time:"0",value:27.5}
          ,{time:"1",value:20}
          ,{time:"2",value:76}
        ])

      bufferedRain$ = just(
        [
          {time:"0",value:27.5}
          ,{time:"1",value:20}
          ,{time:"2",value:76}
        ])
    }
    else{
      
      

      
      bufferedTemp$ = packageData(sensors$,"temperature",dataPoints).startWith([{value:0,time:new Date()}])

      bufferedHum$  = packageData(sensors$,"humidity",dataPoints).startWith([{value:0,time:new Date()}])
      bufferedPres$ = packageData(sensors$,"pressure",dataPoints).startWith([{value:0,time:new Date()}])
      
      bufferedWindSpd$ = packageData(sensors$,"windSpd",dataPoints).startWith([{value:0,time:new Date()}])
      bufferedWindDir$ = packageData(sensors$,"windDir",dataPoints).startWith([{value:0,time:new Date()}])

      bufferedRain$  = packageData(sensors$,"rain",dataPoints).startWith([{value:0,time:new Date()}])

      bufferedLight$ = packageData(sensors$,"visL",dataPoints).startWith([{value:0,time:new Date()}])
      bufferedIR$    = packageData(sensors$,"irL",dataPoints).startWith([{value:0,time:new Date()}])
      bufferedUv$    = packageData(sensors$,"UVL",dataPoints).startWith([{value:0,time:new Date()}])

    }
   

    const model$ = makeModel(updateFns, actions, defaults)


    //for each sensor node/group
    const sensorNodes$ = just([
        
      ])

    const sensorsFeeds$ = just([
      ]) 


    /* 
       {id:0,name:"Weather station",uri:"http://192.168.1.20:3020"}
        ,{id:1,name:"indoor station",uri:"http://192.168.1.21:3020"}

    {nodeId:0, feedId:0, type:"temperature"}
      ,{nodeId:0, feedId:1, type:"humidity" }
      ,{nodeId:0, feedId:2, type:"pressure" }
      ,{nodeId:0, feedId:3, type:"windSpd" }
      ,{nodeId:0, feedId:4, type:"windDir" }
      ,{nodeId:0, feedId:5, type:"rain" }
      ,{nodeId:0, feedId:6, type:"light" }
      ,{nodeId:0, feedId:7, type:"UV" }
      ,{nodeId:0, feedId:8, type:"IR" }


      ,{nodeId:1, feedId:0, type:"temperature"}
      ,{nodeId:1, feedId:1, type:"humidity"}
      ,{nodeId:1, feedId:2, type:"pressure" }*/

    function addObsSourceToSensorNodes(sensorNodes$){
      return sensorNodes$.map(function(sensorNodes){
        return sensorNodes.map(function(node){
          const source$ = Rx.Observable.interval(3000)//60000)
            .flatMap(function(){
              return rxDom.DOM.ajax({url:node.uri
                ,crossDomain:true
                ,credentials:false
                ,responseType:"json"})
            })
            .retry(10)
            .pluck("response")
            .pluck("variables")
            .shareReplay(1)
          return Object.assign({},node,{source$:source$})
        })
      })
    }

    function addObsSourceToSensorFeeds(sensorsFeeds$, sensorNodes$){
      return sensorsFeeds$.combineLatest(sensorNodes$,function(sensorsFeeds,sensorNodes){
        return sensorsFeeds.map(function(feed){

          const sensorNode = find(n=>n.id === feed.nodeId )(sensorNodes)  //sensorNodes.filter()
          const nodeSource$ = prop('source$', sensorNode) 
          const source$ = packageData(nodeSource$, feed.type, dataPoints).startWith([{value:0,time:new Date()}])

          return Object.assign({},feed,{source$:source$})
          
        })
      })
    }

    const augSensorNodes$ = addObsSourceToSensorNodes(sensorNodes$)
    const augSensorFeeds$ = addObsSourceToSensorFeeds(sensorsFeeds$, augSensorNodes$)
    
    //augSensorNodes$.subscribe(e=>console.log("augmentedSensorNodes",e))
    //augSensorFeeds$.subscribe(e=>console.log("augmentedSensorFeeds",e))



      
    const filteredFeeds$ = actions.selectNodes$
      .withLatestFrom(augSensorFeeds$,function(nodeId,feeds){
        if(nodeId===-1){//wildcard case
          return feeds
        }
        return feeds.filter(f=>f.nodeId === nodeId)
      })
      .startWith(just([]))

    const filteredSensorData$ = filteredFeeds$
      .map(function(feeds){
        return flatten( feeds.map(function(feed){
          //const source$ = fee
          return packageData(sensors$, feed.type, dataPoints).startWith([{value:0,time:new Date()}])
        })
        )
      })
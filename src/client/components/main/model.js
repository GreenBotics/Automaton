/*
  let sensor1Data$ = Rx.Observable
      .interval(10 /* ms */)
      .timeInterval()
      //.do((e)=>console.log(e))
      .map(e=> Math.random())

  let sensor2Data$ = Rx.Observable
      .interval(500 /* ms */)
      .timeInterval()
      //.do((e)=>console.log(e))
      .map(e=> Math.random())

  //let fakeModel$ = Rx.Observable.just({name:"fooobar", value:42, power:43})

  let fakeModel$ = Rx.Observable.just([
    {name:"fooobar", power:43}
    ,{name:"sdfds",  power:2.34}
    ])
  //sensor1Data$ = Rx.Observable.just("bfdsdf")
  sensor2Data$ = Rx.Observable.just("sdf")

  */
/** @jsx hJSX */
import {hJSX} from '@cycle/dom'
import {Rx} from '@cycle/core'

export function coolers({DOM, props$}, name = ''){
  let data$ = props$
    .distinctUntilChanged()
    .map(props=>props.data)
    .filter(data=>data!==undefined)//data is an array like so [{name:"foo",power:10},{name:"bar",power:76}]

  function makeSliders(data){
    return data.map((item,index) => {
      let props$ = Rx.Observable.just({label: item.name, unit: ''
        , min: 0, initial: item.power , value:item.power, max: 100
        , id:"cooler_"+index, className:"labeled-input-slider"})
      let slider = labeledInputSlider({DOM, props$}, "-cooler"+index)
      return slider
    })
  }

  let sliders$ = data$
    .map(data => makeSliders(data))

  //sliders$.subscribe(e=>console.log("sliders",e))
  
  let vtree$ = sliders$
    //.do(e=>console.log("foo",e))
    .map(s=>s.map(se=>se.DOM))

  let values$ = sliders$
    .map(s=>s.map(se=>se.value$))

  //Rx.Observable.merge(sliders$).subscribe(e=>console.log("foo",e))
  //console.log("sliders",sliders$, data$)

  //[
  //  {name:"foo",power:10} => labeledInputSlider()
  //  {name:"bar",power:76} => labeledInputSlider()
  //]

  return {
    DOM: vtree$
    ,values$
  } 
}
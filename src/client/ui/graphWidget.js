var MG = require('metrics-graphics')
//var document = require('global/document')
import {h, makeDOMDriver} from '@cycle/dom'

function GraphWidget() {
    this.type = 'Widget'
}

GraphWidget.prototype.init = function () {
  console.log("initializing Widget")
  var elem = document.createElement('div')
  
  /*this.graph = MG.data_graphic({
    title: "Downloads",
    description: "This graphic shows a time-series of downloads.",
    data: [{'date':new Date('2014-11-01'),'value':12},
           {'date':new Date('2014-11-02'),'value':18}],
    width: 600,
    height: 250,
    target: elem,//'#downloads',
    x_accessor: 'date',
    y_accessor: 'value',
  })*/

  return elem
}

GraphWidget.prototype.update = function (prev, elem) {
  this.graph = this.graph || prev.graph
}


let foo = h('div', [
    new GraphWidget()
])

//console.log(foo)
//GraphWidget = foo

export default GraphWidget

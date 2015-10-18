import {h, makeDOMDriver} from '@cycle/dom'
var MG = require('metrics-graphics')
require("metrics-graphics/dist/metricsgraphics.css")
//var d3 = require('metrics-graphics/node_modules/d3')


function GraphWidget(data, settings) {
    console.log("CREATING GraphWidget")

    this.type = 'Widget'

    const defaults = {
        title: undefined,
        description:undefined,
        //width:650,
        height:150,
        x_accessor: undefined,
        y_accessor: undefined,
        max_x:25,

        //markers: [{'year': 1964, 'label': '"The Creeping Terror" released'}],
        animate_on_load:false,
        baselines: undefined,
        legend:undefined,
        interpolate: 'linear',
        missing_is_zero: true,
        transition_on_update:false,//disable for very high frequency data updates (no time for transition)
        show_tooltips:false//no jquery please
    }

    this.data = data

    this.settings  = Object.assign(defaults,settings,{data})

    console.log("DONE")
}

GraphWidget.prototype.init = function () {
  let elem = document.createElement('div')
  elem.className = "graph"
  return elem
}

GraphWidget.prototype.update = function (prev, elem) {
    console.log("UPDATING GraphWidget")

  //this.graph = this.graph || prev.graph
  let settings = Object.assign(this.settings,{target:elem})

  this.graph = MG.data_graphic(settings)
}

export {GraphWidget}

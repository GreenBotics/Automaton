import {h, makeDOMDriver} from '@cycle/dom'
var MG = require('metrics-graphics')
require("metrics-graphics/dist/metricsgraphics.css")
//var d3 = require('metrics-graphics/node_modules/d3')


function GraphWidget(data) {
    this.type = 'Widget'
    
    function formatEntry(entry){
      return entry.map( (e,index)=>({time: index+'',temperature:Math.abs(e*30)}) ) 
    }
    //data = data.map((e,index)=>({time: index+'',temperature:Math.abs(e*15) } ) )
    data = data.map(formatEntry)

    this.data = data //MG.convert.date(data, 'time','%S')
    //console.log(JSON.stringify(this.data))
}

GraphWidget.prototype.init = function () {
  return document.createElement('div')
}

GraphWidget.prototype.update = function (prev, elem) {
  //this.graph = this.graph || prev.graph
  let adi_baselines = [{value:12, label:'critical temperature'}];

  this.graph = MG.data_graphic({
        title: "Temperatures",
        description: "Temperature curves for env#0",
        data: this.data,
        width: 650,
        height: 150,
        target: elem,
        x_accessor: 'time',
        y_accessor: 'temperature',
        max_x:25,


        //markers: [{'year': 1964, 'label': '"The Creeping Terror" released'}],
        animate_on_load:false,
        baselines: adi_baselines,
        legend:["t°0", "t°1"],
        interpolate: 'linear',
        missing_is_zero: true,
        //transition_on_update:false,//disable for very high frequency data updates (no time for transition)
        show_tooltips:false//no jquery please

    })
}

export {GraphWidget}

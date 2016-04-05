import { h as h } from 'cycle-snabbdom'

import { prepend } from 'ramda'
import styles from './styles.css'

// import hyperstyles from 'hyperstyles'
// const h = hyperstyles(vh, styles)

// console.log("nodeEditor styles", styles)

export default function view (state$) {
  return state$.map(view_inner)
}

// / nodes
function view_inner (state) {
  const margin = 10
  const nodesData = state.nodes.data
    .reduce((acc, m) => {
      var last = acc[acc.length - 1]
      m.offset = 0
      m.offset = last ? last.offset + last.elmHeight + margin : margin
      return acc.concat(m)
    }, [])
    // const totalHeight = nodesData[nodesData.length - 1].offset + nodesData[data.length - 1].elmHeight

  const allNodes = nodesData
    .map((node, index) => {
      return h('li.' + styles.nodeEntry, /* {
          key: index,
          style: {opacity: '0', transform: 'translate(-200px)',
                  delayed: {transform: `translateY(${node.offset}px)`, opacity: '1'},
                  remove: {opacity: '0', transform: `translateY(${node.offset}px) translateX(200px)`}},
          hook: {insert: (vnode) => { node.elmHeight = vnode.elm.offsetHeight }},
        },*/
        [
          h('article', [
            h('h1', node.name || ''),
            h('button.editNodes', {attrs: {'data-node': node.uid}}, 'Edit'),
            h('button.removeNodes', {attrs: {'data-node': node.uid}}, 'Delete')
          ]),
          h('article.' + styles.details, [
            h('span.' + styles.status, 'Status: running'),
            h('span.' + styles.sensors, 'Sensors:' + node.sensors.length)
          ])
        ])
    })

  const nodeList = h('div', { style: { opacity: '1', transition: 'opacity 0.5s', remove: { opacity: '0' } } }, [
    h('button.addNode', 'Add Node'),
    h('ul', allNodes)
  ])
  const nodeEditor = state.addNodeToggled ? renderAddNodeScreen(state) : nodeList

  if (state.addItemsToggled) {
    return h('section#' + styles.nodeEditor, [
      h('header', [
        h('h1', 'Manage nodes/sensors')
      ]),
      h('section', [
        nodeEditor
      ])
    ])
  } else {
    return h('section')
  }
}

function renderAddNodeScreen (state) {
  const activeNode = state.activeNode

  const microcontrollers = state.microcontrollers
  const sensorModels = state.sensorModels
  const sensorCaps = state.sensorCaps

  const validationButtonText = state.editedNode ? 'Update' : 'Add'

  const microcontrollersList = prepend(h('option.uc', {props: {value: undefined, disabled: true, selected: true}}, 'Choose:'),
    microcontrollers
      .map(m => h('option.mc', {props: {value: m, selected: false}, attrs: {'data-foo': ''}}, m))
  )

  const sensorModelsList = prepend(h('option.sens', {props: {value: undefined, disabled: true, selected: true}}, 'Choose:'),
    Object.keys(sensorModels)
      .map(m => h('option.sens', {props: {value: m}, attrs: {'data-foo': ''}}, m))
  )

  const sensorsList = activeNode.sensors // ['BME','FOO']
    .map(s => h('li.sens', {props: {value: s}},
      [s, h('button.removeSensorFromNode', 'delete')]))

  return h('section.addNodeForm', {style: {transition: 'opacity 0.2s', delayed: {opacity: '1'}, remove: {opacity: '0'}}}, [
    h('form#addNodeForm', [
      h('h1', 'Devices'),
      h('select.microcontroller', microcontrollersList),

      h('h1', 'device infos'),
      h('input.deviceName', {props: {type: 'text', placeholder: 'name', value: activeNode.name}}),
      h('textarea.deviceDescription', {props: {value: activeNode.description, placeholder: 'description'}}, [activeNode.description]),
      h('input.deviceUUID', {props: {type: 'text', disabled: true, placeholder: 'UUID', value: activeNode.uid}}),

      h('h1', 'wifi settings'),
      h('input.wifiSSID', {props: {type: 'text', placeholder: 'ssid'}}),
      h('input.wifiPass', {props: {type: 'password', placeholder: 'password'}}),

      h('h1', 'Sensor Packages'),
      h('select.sensorModel', sensorModelsList),
      h('button#AddSensorPackageToNode', {props: {type: 'button'}}, 'add'),

      h('ul.sensors', sensorsList),

      h('br'),

      h('button#confirmUpsertNode', {props: {type: 'submit'}}, validationButtonText),
      h('button', {props: {type: 'button', disabled: true}}, 'upload'), // only available if changed ?
      h('button#cancelUpsertNode', {props: {type: 'button'}}, 'cancel')
    ])
  ])
}

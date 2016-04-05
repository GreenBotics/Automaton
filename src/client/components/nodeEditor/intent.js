export default function intent (sources) {
  const {DOM} = sources

  const setMicrocontroler$ = DOM.select('.microcontroller').events('change')
    .map(e => e.target.value)
  const setDeviceName$ = DOM.select('.deviceName').events('change')
    .map(e => e.target.value)
  const setDeviceDescription$ = DOM.select('.deviceDescription').events('change')
    .map(e => e.target.value)

  const setWifiSSID$ = DOM.select('.wifiSSID').events('change')
    .map(e => e.target.value)
  const setWifiPass$ = DOM.select('.wifiPass').events('change')
    .map(e => e.target.value)

  const addSensorModel$ = DOM.select('#AddSensorPackageToNode').events('click')
    .withLatestFrom(DOM.select('.sensorModel').events('change'), (_, d) => d)
    .map(e => e.target.value)

  const saveData$ = DOM.select('#confirmUpsertNode').events('click')

  return {
    setMicrocontroler$,
    setDeviceName$,
    setDeviceDescription$,
    setWifiSSID$,
    setWifiPass$,

    addSensorModel$,
    saveData$
  }
}

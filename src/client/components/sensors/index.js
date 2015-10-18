function renderSensorData(data){
  return <div> {data} </div>
}

<section id="sensors">
  <h1> Sensors </h1>
  {renderSensors( model.state )}

  {renderSensorData(rtm)}

  {renderSensorData(rtm2)}
</section>
</div>

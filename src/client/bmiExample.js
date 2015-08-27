function calculateBMI(weight, height) {
  let heightMeters = height * 0.01;
  return Math.round(weight / (heightMeters * heightMeters));
}

function intent(DOM) {
  return {
    changeWeight$: DOM.get('#weight', 'input')
      .map(ev => ev.target.value),
    changeHeight$: DOM.get('#height', 'input')
      .map(ev => ev.target.value)
  };
}

function model(actions) {
  return Cycle.Rx.Observable.combineLatest(
    actions.changeWeight$.startWith(70),
    actions.changeHeight$.startWith(170),
    (weight, height) =>
      ({weight, height, bmi: calculateBMI(weight, height)})
  );
}

function view2(bmi$){
    return bmi$.map(bmi =>
      <div>
        Test
        weight
        {bmi.weight}
        <input type="range" min="40" max="140" id="weight"/>

        height
        {bmi.height}
        <input type="range" min="140" max="210" id="height"/>

        <div>
          {bmi.bmi}
        </div>
      </div>
    )
  }


function main(drivers) {
  let DOM = drivers.DOM

  let changeWeight$ = DOM.get('#weight', 'input')
    .map(ev => ev.target.value)
  
  let changeHeight$ = DOM.get('#height', 'input')
    .map(ev => ev.target.value)

  let bmi$ = Cycle.Rx.Observable.combineLatest(
    changeWeight$.startWith(70),
    changeHeight$.startWith(170),
    (weight, height) => {
      let heightMeters = height * 0.01
      let bmi = Math.round(weight / (heightMeters * heightMeters))
      return {weight, height, bmi}
    }
  )

  function view(bmi$){
    return bmi$.map(bmi =>
      <div>
        Test
        weight
        {bmi.weight}
        <input type="range" min="40" max="140" id="weight"/>

        height
        {bmi.height}
        <input type="range" min="140" max="210" id="height"/>

        <div>
          {bmi.bmi}
        </div>
      </div>
    )
  }

  return {
    DOM: view(bmi$)
  }
}


function view(drivers){
    console.log("drivers",drivers)
    return drivers.DOM.get('#checker1', 'click')
      .map(ev => ev.target.checked)
      .startWith(false)
      .map(toggled =>
        <div>
          { renderLabeledCheckbox("Toggle me", toggled, "checker1") } 
          <p>{toggled ? 'ON' : 'off'}</p>
          { renderLabeledCheckbox("Toggle me ,I am synched, yeah !!", toggled, "checker1") } 
          <p>{toggled ? 'ON' : 'off'}</p>
        </div>
      )
  }

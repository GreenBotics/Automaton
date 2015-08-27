/** @jsx hJSX */
import Cycle from '@cycle/core';
import {makeDOMDriver, hJSX} from '@cycle/dom';

function main(drivers) {
  return {
    DOM: drivers.DOM.get('.checker', 'click')
      .map(ev => ev.target.checked)
      .startWith(false)
      .map(toggled =>
        <div>
          <input type="checkbox" className="checker" checked={toggled}/> Toggle me
          <p>{toggled ? 'ON' : 'off'}</p>
          <div>
            Some other stuff here
              <input type="checkbox" className="checker2" checked={toggled}/> Toggle me too
              <p>{toggled ? 'ON' : 'off'}</p>
          </div>
        </div>
      )
  };
}

let drivers = {
  DOM: makeDOMDriver('#app')
};

Cycle.run(main, drivers)
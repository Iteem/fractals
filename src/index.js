import React from 'react';
import ReactGA from 'react-ga';
import ReactDOM from 'react-dom';
import 'bulma/css/bulma.css'
import Fractals from "./components/fractals";
import * as serviceWorker from './serviceWorker';
import {createStore} from "redux";
import {Provider} from "react-redux";
import reducer from "./reducers/reducer";
import { BrowserRouter as Router } from 'react-router-dom'

ReactGA.initialize('UA-88568868-2 ');
ReactGA.pageview('/projects/fractals/live');

const store = createStore(reducer, process.env.NODE_ENV === "development" && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Fractals/>
    </Router>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

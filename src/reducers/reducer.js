import { combineReducers } from 'redux';
import buddhabrot from "./buddhabrot";
import mandelbrot from "./mandelbrot";
import general from "./general";

const reducer = combineReducers({
  buddhabrot,
  mandelbrot,
  general
});

export default reducer;
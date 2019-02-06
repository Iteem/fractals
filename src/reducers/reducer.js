import { combineReducers } from 'redux';
import buddhabrot from "./buddhabrot";
import mandelbrot from "./mandelbrot";
import juliaSet from "./juliaSet";
import general from "./general";

const reducer = combineReducers({
  buddhabrot,
  mandelbrot,
  juliaSet,
  general
});

export default reducer;
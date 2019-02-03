import {SET_GENERAL_OPTIONS} from '../actions/actions';

export default function (state = {
  width: 800,
  height: 600,
  selectedFractal: "mandelbrot"
}, action) {
  switch (action.type) {
    case SET_GENERAL_OPTIONS:
      return {
        ...state,
        ...action.options
      };
    default:
      return state;
  }
}

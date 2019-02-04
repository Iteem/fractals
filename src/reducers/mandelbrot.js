import {SET_MANDELBROT_OPTIONS} from '../actions/actions';

export default function (state = {
  colorScheme: "Blues",
  colorRepetition: 15,
  colorOffset: 0,
  xExtent: [-3, 2],
  yCenter: 0,
}, action) {
  switch (action.type) {
    case SET_MANDELBROT_OPTIONS:
      return {
        ...state,
        ...action.options
      };
    default:
      return state;
  }
}

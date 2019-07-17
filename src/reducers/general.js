import {SET_GENERAL_OPTIONS} from '../actions/actions';

export default function (state = {
  width: 800,
  height: 600,
  customX: 800,
  customY: 600,
  useCustomResolution: false,
  selectedFractal: "mandelbrot"
}, action) {
  console.log(action.options);
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

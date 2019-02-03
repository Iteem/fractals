import {SET_BUDDHABROT_OPTIONS} from '../actions/actions';

export default function (state = {
  greyscale: false,
  exposure: [2.8, 3.2, 4.8], //r,g,b, empirically makes for a nice picture
  gamma: 2
}, action) {
  switch (action.type) {
    case SET_BUDDHABROT_OPTIONS:
      return {
        ...state,
        ...action.options
      };
    default:
      return state;
  }
}

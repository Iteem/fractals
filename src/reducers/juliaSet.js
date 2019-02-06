import {SET_JULIASET_OPTIONS} from '../actions/actions';

export default function (state = {
  cr: -0.8,
  ci: 0.15,
}, action) {
  switch (action.type) {
    case SET_JULIASET_OPTIONS:
      return {
        ...state,
        ...action.options
      };
    default:
      return state;
  }
}

import React from 'react';
import { AutoSizer } from 'react-virtualized'
import BarnsleyFern from "./fractals/barnsleyFern"
import KochCurve from "./fractals/kochCurve"
import SierpinskiCarpet from "./fractals/sierpinskiCarpet"
import Buddhabrot from "./fractals/buddhabrot"
import BuddhabrotOptions from './options/buddhabrotOptions';
import Mandelbrot from "./fractals/mandelbrot"
import MandelbrotOptions from './options/mandelbrotOptions';
import MandelbrotOverlay from './overlay/mandelbrotOverlay';
import {connect} from "react-redux";
import {setGeneralOptions} from "../actions/actions";

const mapStateToProps = state => {
  return {
    width: state.general.width,
    height: state.general.height,
    selectedFractal: state.general.selectedFractal
  }
};

const mapDispatchToProps = dispatch => {
  return {
    setDimensions: (width, height) => {
      dispatch(setGeneralOptions({width, height}));
    },
    selectFractal: (fractal) => {
      dispatch(setGeneralOptions({selectedFractal: fractal}));
    }
  };
};

class Fractals extends React.Component {
  constructor() {
    super();

    this.onResize = this.onResize.bind(this);
    this.selectFractal = this.selectFractal.bind(this);
  }

  onResize(dimensions){
    this.props.setDimensions(dimensions.width, dimensions.height);
  }

  selectFractal(event){
    this.props.selectFractal(event.target.value);
  }

  render() {
    let options;
    switch (this.props.selectedFractal){
      case "buddhabrot":
        options = (<BuddhabrotOptions/>);
        break;
      case "mandelbrot":
        options = (<MandelbrotOptions/>);
        break;
      default:
        options = null;
    }

    return (
      <div style={{height: "100vh", overflow: "hidden"}}>
        <AutoSizer onResize={this.onResize}>
          {({ height, width }) => {
            let overlay = null;
            let fractal = null;
            switch (this.props.selectedFractal){
              case "barnsleyFern":
                fractal = (<BarnsleyFern width={this.props.width} height={this.props.height}/>);
                break;
              case "buddhabrot":
                fractal = (<Buddhabrot width={this.props.width} height={this.props.height}/>);
                break;
              case "kochCurve":
                fractal = (<KochCurve width={this.props.width} height={this.props.height}/>);
                break;
              case "mandelbrot":
                fractal = (<Mandelbrot width={this.props.width} height={this.props.height}/>);
                overlay = (<MandelbrotOverlay width={this.props.width} height={this.props.height}/>);
                break;
              case "sierpinskiCarpet":
                fractal = (<SierpinskiCarpet width={this.props.width} height={this.props.height}/>);
                break;
              default:
                break;
            }

            return (
              <div style={{position: "relative"}}>
                {fractal}
                <div style={{position: "absolute", top: 0, left: 0, width: "100vw", height: "100vh"}}>
                  {overlay}
                </div>
              </div>
            )
          }}
        </AutoSizer>
        <div className="box fractal-options" style={{position: "absolute", margin: "2rem"}}>
          <h3 className="title is-3">Fractals</h3>
          <h5 className="subtitle is-5">HTML 5</h5>
          <div className="content">
            <label htmlFor="selectFractal">Fractal: </label>
            <select id="selectFractal" value={this.props.selectedFractal} onChange={this.selectFractal}>
              <option value="mandelbrot">Mandelbrot</option>
              <option value="buddhabrot">Buddhabrot</option>
              <option value="barnsleyFern">Barnsley Fern</option>
              <option value="kochCurve">Koch Curve</option>
              <option value="sierpinskiCarpet">Sierpinski Carpet</option>
            </select>
          </div>
          {options}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Fractals);
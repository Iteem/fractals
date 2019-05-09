import React from 'react';
import { AutoSizer } from 'react-virtualized'
import BarnsleyFern from "./fractals/barnsleyFern"
import KochCurve from "./fractals/kochCurve"
import SierpinskiCarpet from "./fractals/sierpinskiCarpet"
import Buddhabrot from "./fractals/buddhabrot"
import BuddhabrotOptions from './fractals/buddhabrot/buddhabrotOptions';
import Mandelbrot from "./fractals/mandelbrot"
import MandelbrotOptions from './fractals/mandelbrot/mandelbrotOptions';
import JuliaSetOptions from './fractals/mandelbrot/juliaSetOptions';
import BuddhabrotExplorer from "./fractals/buddhabrotExplorer";
import {connect} from "react-redux";
import {setGeneralOptions} from "../actions/actions";
import {Switch, Route, withRouter} from "react-router";

const selectOptions = {
  mandelbrot: "Mandelbrot",
  juliaSet: "Julia Set",
  buddhabrot: "Buddhabrot",
  buddhabrotExplorer: "Buddhabrot Explorer",
  barnsleyFern: "Barnsley Fern",
  kochCurve: "Koch Curve",
  sierpinskiCarpet: "Sierpinski Carpet"
};

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
  constructor(props) {
    super(props);

    this.onResize = this.onResize.bind(this);
    this.selectFractal = this.selectFractal.bind(this);

    // Select the fractal from path, or initialize a default
    let fractal = this.props.history.location.pathname.substr(1);
    fractal = fractal.charAt(fractal.length - 1) === '/' ? fractal.substr(0, fractal.length - 1) : fractal;
    fractal = selectOptions[fractal] ? fractal : "mandelbrot";
    this.props.history.replace('/' + fractal);
    this.props.selectFractal(fractal);
  }

  onResize(dimensions){
    this.props.setDimensions(dimensions.width, dimensions.height);
  }

  selectFractal(event){
    this.props.history.push(event.target.value);
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
      case "juliaSet":
        options = (<JuliaSetOptions/>);
        break;
      default:
        options = null;
    }

    let optionElems = Object.keys(selectOptions).map((key) => <option value={key} key={key}>{selectOptions[key]}</option>);

    return (
      <div style={{height: "100vh", overflow: "hidden"}}>
        <AutoSizer onResize={this.onResize}>
          {() => {
            return (
              <div style={{position: "relative"}}>
                <Switch>
                  <Route path="/barnsleyFern" render={() => <BarnsleyFern width={this.props.width} height={this.props.height}/>}/>
                  <Route path="/buddhabrot" render={() => <Buddhabrot width={this.props.width} height={this.props.height}/>}/>
                  <Route path="/buddhabrotExplorer" render={() => <BuddhabrotExplorer width={this.props.width} height={this.props.height}/>}/>
                  <Route path="/kochCurve" render={() => <KochCurve width={this.props.width} height={this.props.height}/>}/>
                  <Route path="/mandelbrot" render={() => <Mandelbrot width={this.props.width} height={this.props.height}/>}/>
                  <Route path="/juliaSet" render={() => <Mandelbrot width={this.props.width} height={this.props.height} julia={true}/>}/>
                  <Route path="/sierpinskiCarpet" render={() => <SierpinskiCarpet width={this.props.width} height={this.props.height}/>}/>
                </Switch>
              </div>
            )
          }}
        </AutoSizer>

        <div className="box fractal-options" style={{position: "absolute", margin: "2rem"}}>
          <h3 className="title is-3">Fractals</h3>
          <h5 className="subtitle is-5">HTML 5</h5>
          <div className="field">
            <label className="label" htmlFor="selectFractal">Fractal</label>
            <div className="control">
              <select id="selectFractal" value={this.props.selectedFractal} onChange={this.selectFractal}>
                {optionElems}
              </select>
            </div>
          </div>
          {options}
        </div>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Fractals));
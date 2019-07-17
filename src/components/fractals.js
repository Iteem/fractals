import React from 'react';
import { AutoSizer } from 'react-virtualized'
import BarnsleyFern from "./fractals/barnsleyFern"
import KochCurve from "./fractals/kochCurve"
import Sierpinski from "./fractals/sierpinski"
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
  sierpinskiCarpet: "Sierpinski Carpet",
  sierpinskiTriangle: "Sierpinski Triangle"
};

const mapStateToProps = state => {
  return state.general;
};

const mapDispatchToProps = (dispatch) => {
  return {
    setDimensions: (width, height, props) => {
      dispatch(setGeneralOptions({
        width,
        height,
        customX: props.useCustomResolution ? props.customX : width,
        customY: props.useCustomResolution ? props.customY : height
      }));
    },
    setCustomResolution: (x, y) => {
      dispatch(setGeneralOptions({
        customX: x,
        customY: y,
        useCustomResolution: true
      }));
    },
    setUseCustomResolution: (useCustomResolution, props) => {
      dispatch(setGeneralOptions({
        customX: useCustomResolution ? props.customX : props.width,
        customY: useCustomResolution ? props.customY : props.height,
        useCustomResolution: useCustomResolution
      }));
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
    this.setCustomResolutionX = this.setCustomResolutionX.bind(this);
    this.setCustomResolutionY = this.setCustomResolutionY.bind(this);
    this.handleUseCustomResolutionChange = this.handleUseCustomResolutionChange.bind(this);

    // Select the fractal from path, or initialize a default
    let pathFragments = this.props.history.location.pathname.split('/');
    let fractal = pathFragments[pathFragments.length - 1];
    this.basename = pathFragments.slice(0, -1).join('/');
    fractal = fractal.charAt(fractal.length - 1) === '/' ? fractal.substr(0, fractal.length - 1) : fractal;
    fractal = selectOptions[fractal] ? fractal : "mandelbrot";

    this.props.history.replace(fractal);
    this.props.selectFractal(fractal);
  }

  onResize(dimensions){
    this.props.setDimensions(dimensions.width, dimensions.height, this.props);
  }

  selectFractal(event){
    this.props.history.push(event.target.value);
    this.props.selectFractal(event.target.value);
  }

  download = () => {
    let image = document.getElementsByTagName("canvas")[0].toDataURL("image/jpeg", 0.9);
    this.downloadLink.setAttribute("href", image);
  };

  setCustomResolutionX(event){
    this.props.setCustomResolution(event.target.value, this.props.customY);
  }

  setCustomResolutionY(event){
    this.props.setCustomResolution(this.props.customX, event.target.value);
  }

  handleUseCustomResolutionChange(event){
    this.props.setUseCustomResolution(event.target.checked, this.props);
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

    const dpr = window.devicePixelRatio || 1;
    const screenWidth = this.props.width;
    const screenHeight = this.props.height;
    const width = this.props.useCustomResolution ? this.props.customX : Math.round(screenWidth * dpr);
    const height = this.props.useCustomResolution ? this.props.customY : Math.round(screenHeight * dpr);

    return (
      <div style={{height: "100vh", overflow: "hidden"}}>
        <AutoSizer onResize={this.onResize}>
          {() => {
            return (
              <div style={{position: "relative"}}>
                <Switch>
                  <Route path={this.basename + "/barnsleyFern"} render={() => <BarnsleyFern width={width} height={height} screenWidth={screenWidth} screenHeight={screenHeight}/>}/>
                  <Route path={this.basename + "/buddhabrot"} render={() => <Buddhabrot width={width} height={height} screenWidth={screenWidth} screenHeight={screenHeight}/>}/>
                  <Route path={this.basename + "/buddhabrotExplorer"} render={() => <BuddhabrotExplorer width={width} height={height} screenWidth={screenWidth} screenHeight={screenHeight}/>}/>
                  <Route path={this.basename + "/kochCurve"} render={() => <KochCurve width={width} height={height} screenWidth={screenWidth} screenHeight={screenHeight}/>}/>
                  <Route path={this.basename + "/mandelbrot"} render={() => <Mandelbrot width={width} height={height} screenWidth={screenWidth} screenHeight={screenHeight}/>}/>
                  <Route path={this.basename + "/juliaSet"} render={() => <Mandelbrot width={width} height={height} screenWidth={screenWidth} screenHeight={screenHeight} julia={true}/>}/>
                  <Route path={this.basename + "/sierpinskiCarpet"} render={() => <Sierpinski width={width} height={height} screenWidth={screenWidth} screenHeight={screenHeight}/>}/>
                  <Route path={this.basename + "/sierpinskiTriangle"} render={() => <Sierpinski width={width} height={height} screenWidth={screenWidth} screenHeight={screenHeight} triangle={true}/>}/>
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
          <label className="label">Resolution:</label>
          <div className="field">
            <div className="control">
              <label className="checkbox">
                <input type="checkbox" checked={this.props.useCustomResolution} onChange={this.handleUseCustomResolutionChange}/>
                Use custom resolution
              </label>
            </div>
          </div>
          <div className="field">
            <input type="number" min="1" step="1" value={this.props.customX} onChange={this.setCustomResolutionX}/>
            <span>x</span>
            <input type="number" min="1" step="1" value={this.props.customY} onChange={this.setCustomResolutionY}/>
          </div>
          <a className="field" download="fractal.jpg" ref={link => this.downloadLink = link}>
            <button onClick={this.download} className="button">Download</button>
          </a>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Fractals));
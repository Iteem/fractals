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

export default class Fractals extends React.Component {
  constructor() {
    super();

    this.onResize = this.onResize.bind(this);
    this.selectFractal = this.selectFractal.bind(this);
    this.setOptions = this.setOptions.bind(this);

    this.state = {
      width: 800,
      height: 600,
      options: {
        mandelbrot: {
          colorScheme: "Blues",
          xExtent: [-3, 2],
          yCenter: 0,
        },
        buddhabrot: {
          greyscale: false,
          exposure: [2.8, 3.2, 4.8], //r,g,b, empirically makes for a nice picture
          gamma: 2
        }
      },
      selectedFractal: "mandelbrot"
    }
  }

  onResize(dimensions){
    this.setState(dimensions);
  }

  selectFractal(event){
    this.setState({
      selectedFractal: event.target.value
    });
  }

  setOptions(options){
    this.setState({
      options: {
        ...this.state.options,
        ...options
      }
    });
  }

  render() {
    let options;
    switch (this.state.selectedFractal){
      case "buddhabrot":
        options = (<BuddhabrotOptions options={this.state.options} onChange={this.setOptions}/>);
        break;
      case "mandelbrot":
        options = (<MandelbrotOptions options={this.state.options} onChange={this.setOptions}/>);
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
            switch (this.state.selectedFractal){
              case "barnsleyFern":
                fractal = (<BarnsleyFern width={this.state.width} height={this.state.height}/>);
                break;
              case "buddhabrot":
                fractal = (<Buddhabrot options={this.state.options} width={this.state.width} height={this.state.height}/>);
                break;
              case "kochCurve":
                fractal = (<KochCurve width={this.state.width} height={this.state.height}/>);
                break;
              case "mandelbrot":
                fractal = (<Mandelbrot options={this.state.options} width={this.state.width} height={this.state.height}/>);
                overlay = (<MandelbrotOverlay options={this.state.options} onChange={this.setOptions} width={width} height={height}/>);
                break;
              case "sierpinskiCarpet":
                fractal = (<SierpinskiCarpet width={this.state.width} height={this.state.height}/>);
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
            <select id="selectFractal" value={this.state.selectedFractal} onChange={this.selectFractal}>
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
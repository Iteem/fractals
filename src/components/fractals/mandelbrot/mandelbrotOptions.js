import React, {Fragment} from "react"
import {setMandelbrotOptions} from "../../../actions/actions";
import {connect} from "react-redux";

const mapStateToProps = state => {
  return {
    options: state.mandelbrot
  }
};

const mapDispatchToProps = dispatch => {
  return {
    setOptions: (options) => {
      dispatch(setMandelbrotOptions(options));
    }
  };
};

class MandelbrotOptions extends React.Component {
  constructor() {
    super();

    this.setColorScheme = this.setColorScheme.bind(this);
    this.setColorRepetition = this.setColorRepetition.bind(this);
    this.setColorOffset = this.setColorOffset.bind(this);
    this.resetZoom = this.resetZoom.bind(this);

  }

  setColorScheme(event){
    this.props.setOptions({colorScheme: event.target.value});
  }

  setColorRepetition(event){
    let { value, min, max } = event.target;
    value = Math.max(Number(min), Math.min(Number(max), Number(value)));
    this.props.setOptions({colorRepetition: value});
  }

  setColorOffset(event){
    let { value, min, max } = event.target;
    value = Math.max(Number(min), Math.min(Number(max), Number(value)));
    this.props.setOptions({colorOffset: value});
  }

  resetZoom(){
    this.props.setOptions({
      xExtent: [-3, 2],
      yCenter: 0,
    });
  }

  render() {
    return (
      <Fragment>
        <div className="field">
          <label className="label" form="colorScheme">Color Scheme</label>
          <div className="control">
            <select id="colorScheme" value={this.props.options.colorScheme} onChange={this.setColorScheme}>
              <option value="Blues">Blues</option>
              <option value="Oranges">Oranges</option>
              <option value="Greens">Greens</option>
              <option value="Greys">Greys</option>
              <option value="Purples">Purples</option>
              <option value="Reds">Reds</option>
              <option value="BrBG">BrBG</option>
              <option value="PRGn">PRGn</option>
              <option value="PiYG">PiYG</option>
              <option value="PuOr">PuOr</option>
              <option value="RdBu">RdBu</option>
              <option value="RdGy">RdGy</option>
              <option value="RdYlBu">RdYlBu</option>
              <option value="RdYlGn">RdYlGn</option>
              <option value="Spectral">Spectral</option>
              <option value="Viridis">Viridis</option>
              <option value="Inferno">Inferno</option>
              <option value="Magma">Magma</option>
              <option value="Plasma">Plasma</option>
              <option value="Warm">Warm</option>
              <option value="Cool">Cool</option>
              <option value="CubehelixDefault">CubehelixDefault</option>
              <option value="BuGn">BuGn</option>
              <option value="BuPu">BuPu</option>
              <option value="GnBu">GnBu</option>
              <option value="OrRd">OrRd</option>
              <option value="PuBuGn">PuBuGn</option>
              <option value="PuBu">PuBu</option>
              <option value="PuRd">PuRd</option>
              <option value="RdPu">RdPu</option>
              <option value="YlGnBu">YlGnBu</option>
              <option value="YlGn">YlGn</option>
              <option value="YlOrBr">YlOrBr</option>
              <option value="YlOrRd">YlOrRd</option>
              <option value="Rainbow">Rainbow</option>
              <option value="Sinebow">Sinebow</option>
            </select>
          </div>
        </div>

        <div className="field">
          <div className="control">
            <button className="button" onClick={this.resetZoom}>
              Reset Zoom
            </button>
          </div>
        </div>

        <div className="field">
          <label className="label">Color repetition</label>
          <div className="control">
            <input className="input" type="number" min={1} max={100} step={1} value={this.props.options.colorRepetition} onChange={this.setColorRepetition}/>
          </div>
        </div>

        <div className="field">
          <label className="label">Color offset</label>
          <div className="control">
            <input className="input" type="number" min={0} max={100} step={1} value={this.props.options.colorOffset} onChange={this.setColorOffset}/>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MandelbrotOptions)
import React from "react"
import {setBuddhabrotOptions} from "../../actions/actions";
import {connect} from "react-redux";

const mapStateToProps = state => {
  return {
    options: state.buddhabrot
  }
};

const mapDispatchToProps = dispatch => {
  return {
    setOptions: (options) => {
      dispatch(setBuddhabrotOptions(options));
    }
  };
};

class BuddhabrotOptions extends React.Component {
  constructor() {
    super();

    this.setGreyScale = this.setGreyScale.bind(this);
    this.setExposure = this.setExposure.bind(this);
    this.setGamma = this.setGamma.bind(this);
  }

  setGreyScale(event){
    this.props.setOptions({greyscale: event.target.checked});
  }

  setExposure(event) {
    let index;
    switch (event.target.name) {
      case "r":
        index = 0;
        break;
      case "g":
        index = 1;
        break;
      case "b":
        index = 2;
        break;
      default:
        index = 0;
    }

    let exposure = this.props.options.exposure.slice();
    exposure[index] = event.target.value;

    this.props.setOptions({exposure: exposure})
  }

  setGamma(event){
    this.props.setOptions({gamma: event.target.value});
  }

  render() {
    return (
      <div className="content">
        <label>
          <input type="checkbox" checked={this.props.options.greyscale} onChange={this.setGreyScale}/>
          Greyscale
        </label>
        <br/>
        <label>
          <input type="range" name="r" min="0" max="10" step="0.01" value={this.props.options.exposure[0]} onChange={this.setExposure}/>
          Red
        </label>
        <br/>
        <label>
          <input type="range" name="g" min="0" max="10" step="0.01" value={this.props.options.exposure[1]} onChange={this.setExposure}/>
          Green
        </label>
        <br/>
        <label>
          <input type="range" name="b" min="0" max="10" step="0.01" value={this.props.options.exposure[2]} onChange={this.setExposure}/>
          Blue
        </label>
        <br/>
        <label>
          <input type="range" name="b" min="0.01" max="10" step="0.01" value={this.props.options.gamma} onChange={this.setGamma}/>
          Gamma
        </label>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BuddhabrotOptions);
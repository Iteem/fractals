import React from "react"

export default class BuddhabrotOptions extends React.Component {
  constructor() {
    super();

    this.setGreyScale = this.setGreyScale.bind(this);
    this.setExposure = this.setExposure.bind(this);
    this.setGamma = this.setGamma.bind(this);
  }

  setGreyScale(event){
    let options = {
      buddhabrot: {
        ...this.props.options.buddhabrot,
        greyscale: event.target.checked
      }
    };
    this.props.onChange(options);
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

    let exposure = this.props.options.buddhabrot.exposure.slice();
    exposure[index] = event.target.value;

    let options = {
      buddhabrot: {
        ...this.props.options.buddhabrot,
        exposure: exposure
      }
    };
    this.props.onChange(options);
  }

  setGamma(event){
    let options = {
      buddhabrot: {
        ...this.props.options.buddhabrot,
        gamma: event.target.value
      }
    };
    this.props.onChange(options);
  }

  render() {
    return (
      <div className="content">
        <label>
          <input type="checkbox" checked={this.props.options.buddhabrot.greyscale} onChange={this.setGreyScale}/>
          Greyscale
        </label>
        <br/>
        <label>
          <input type="range" name="r" min="0" max="10" step="0.01" value={this.props.options.buddhabrot.exposure[0]} onChange={this.setExposure}/>
          Red
        </label>
        <br/>
        <label>
          <input type="range" name="g" min="0" max="10" step="0.01" value={this.props.options.buddhabrot.exposure[1]} onChange={this.setExposure}/>
          Green
        </label>
        <br/>
        <label>
          <input type="range" name="b" min="0" max="10" step="0.01" value={this.props.options.buddhabrot.exposure[2]} onChange={this.setExposure}/>
          Blue
        </label>
        <br/>
        <label>
          <input type="range" name="b" min="0.01" max="10" step="0.01" value={this.props.options.buddhabrot.gamma} onChange={this.setGamma}/>
          Gamma
        </label>
      </div>
    );
  }
}
import React, {Fragment} from "react"
import {setJuliaSetOptions} from "../../../actions/actions";
import {connect} from "react-redux";
import MandelbrotOptions from "./mandelbrotOptions"

const mapStateToProps = state => {
  return {
    options: state.juliaSet
  }
};

const mapDispatchToProps = dispatch => {
  return {
    setOptions: (options) => {
      dispatch(setJuliaSetOptions(options));
    }
  };
};

class JuliaSetOptions extends React.Component {
  constructor() {
    super();

    this.setCr = this.setCr.bind(this);
    this.setCi = this.setCi.bind(this);
  }

  setCr(event){
    this.props.setOptions({cr: Number(event.target.value)});
  }

  setCi(event){
    this.props.setOptions({ci: Number(event.target.value)});
  }

  render() {
    return (
      <Fragment>
        <div className="field">
          <label className="label">Constant</label>
          <div className="control">
            <input className="input" type="number" step={0.001} value={this.props.options.cr} onChange={this.setCr}/>
            <input className="input" type="number" step={0.001} value={this.props.options.ci} onChange={this.setCi}/>
          </div>
        </div>

        <MandelbrotOptions/>
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JuliaSetOptions)
import React from "react"

export default class MandelbrotOptions extends React.Component {
  constructor() {
    super();

    this.setColorScheme = this.setColorScheme.bind(this);
    this.resetZoom = this.resetZoom.bind(this);

  }

  setColorScheme(event){
    let options = {
      mandelbrot: {
        ...this.props.options.mandelbrot,
        colorScheme: event.target.value
      }
    };
    this.props.onChange(options);
  }

  resetZoom(){
    let options = {
      mandelbrot: {
        ...this.props.options.mandelbrot,
        xExtent: [-3, 2],
        yCenter: 0,
      }
    };
    this.props.onChange(options);
  }

  render() {
    return (
      <div className="content">
        <label form="colorScheme">Color Scheme: </label>
        <select id="colorScheme" value={this.props.options.mandelbrot.colorScheme} onChange={this.setColorScheme}>
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
        <br/>
        <button onClick={this.resetZoom}>
          Reset Zoom
        </button>
      </div>
    );
  }
}
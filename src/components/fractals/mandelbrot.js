import React from 'react';
import * as scaleChromatic from "d3-scale-chromatic";
import * as scale from "d3-scale";
import * as color from "d3-color";
import {connect} from "react-redux";

const maxIterations = 200;
const colorRepetition = 15;
const waitTime = 50; // in ms
// We need this to be bigger then 2 for smooth coloring
// The smoothing will work well for bailoutRadius >> |c|, so 2^8 is reasonable
const bailoutRadius = Math.pow(2, 8);
const bailoutRadiusSqrd = bailoutRadius * bailoutRadius;
const colorBlack = color.rgb(0,0,0);

const mapStateToProps = state => {
  return {
    width: state.general.width,
    height: state.general.height,
    options: state.mandelbrot
  }
};

class Mandelbrot extends React.Component {
  componentDidMount()
  {
    this.ct = {canceled: false};
    this.draw(this.ct);
  }

  componentDidUpdate()
  {
    this.ct.canceled = true;
    this.ct = {canceled: false};
    this.draw(this.ct);
  }

  componentWillUnmount()
  {
    this.ct.canceled = true;
  }

  draw(ct){
    let ctx = this.canvas.getContext("2d");

    async function mandelbrot(options, width, height) {
      const xScale = scale.scaleLinear()
        .domain([0, width])
        .range(options.xExtent);

      const aspectRatio = width / height;
      const extent = (xScale.range()[1] - xScale.range()[0]) / aspectRatio / 2;
      const yScale = scale.scaleLinear()
        .domain([0, height])
        .range([extent + options.yCenter, -extent + options.yCenter]);

      // We could use colorScaleTemp here directly, but we cache it for much better performance.
      const colorScaleTemp = scale.scaleSequential(getInterpolatorFromOptions(options.colorScheme));
      const colorScaleCache = new Array(1001);
      for (let i = 0; i < colorScaleCache.length; i++) {
        colorScaleCache[i] = color.rgb(colorScaleTemp(i / (colorScaleCache.length - 1)));
      }
      const colorScale = scale.scaleQuantize().domain([0, 1]).range(colorScaleCache);

      const imgData = ctx.createImageData(width, 1);

      let lastTimeout = Date.now();
      for (let y = 0; y < height; y++) {
        drawLine(y, imgData);

        if((Date.now() - lastTimeout) > waitTime) {
          await new Promise(resolve => setTimeout(resolve, 0));

          if (ct.canceled) {
            return;
          }

          lastTimeout = Date.now();
        }
      }

      function drawLine(y, imgData){
        let cy = yScale(y);

        for(let x = 0; x < width; x++){
          let zx = 0;
          let zy = 0;

          let cx = xScale(x);
          let i;

          for (i = 0; i < maxIterations; i++) {
            let xTmp = zx;
            zx = zx * zx - zy * zy;
            zy = 2 * xTmp * zy;

            zx += cx;
            zy += cy;

            if(lengthSquared(zx, zy) > bailoutRadiusSqrd){
              break;
            }
          }

          let col = colorBlack;
          if(lengthSquared(zx, zy) > 4) {
            // Smooth the coloring (from wiki)
            const log_zn = Math.log( zx*zx + zy*zy ) / Math.log(2) / 2;
            const nu = Math.log(log_zn) / Math.log(2);
            i = i + 1 - nu;
            const t = (-Math.cos(i / colorRepetition * Math.PI) + 1) / 2;
            col = color.rgb(colorScale(t));
          }

          imgData.data[4 * x] = col.r; // r
          imgData.data[4 * x + 1] = col.g; // g
          imgData.data[4 * x + 2] = col.b; // b
          imgData.data[4 * x + 3] = 255; // a
        }

        ctx.putImageData(imgData, 0, y)
      }

    }

    function lengthSquared(cx, cy) {
      return cx * cx + cy * cy;
    }

    function getInterpolatorFromOptions(colorScheme){
      const colorSchemes = {
        Blues: scaleChromatic.interpolateBlues,
        Oranges: scaleChromatic.interpolateOranges,
        Greens: scaleChromatic.interpolateGreens,
        Greys: scaleChromatic.interpolateGreys,
        Purples: scaleChromatic.interpolatePurples,
        Reds: scaleChromatic.interpolateReds,
        BrBG: scaleChromatic.interpolateBrBG,
        PRGn: scaleChromatic.interpolatePRGn,
        PiYG: scaleChromatic.interpolatePiYG,
        PuOr: scaleChromatic.interpolatePuOr,
        RdBu: scaleChromatic.interpolateRdBu,
        RdGy: scaleChromatic.interpolateRdGy,
        RdYlBu: scaleChromatic.interpolateRdYlBu,
        RdYlGn: scaleChromatic.interpolateRdYlGn,
        Spectral: scaleChromatic.interpolateSpectral,
        Viridis: scaleChromatic.interpolateViridis,
        Inferno: scaleChromatic.interpolateInferno,
        Magma: scaleChromatic.interpolateMagma,
        Plasma: scaleChromatic.interpolatePlasma,
        Warm: scaleChromatic.interpolateWarm,
        Cool: scaleChromatic.interpolateCool,
        CubehelixDefault: scaleChromatic.interpolateCubehelixDefault,
        BuGn: scaleChromatic.interpolateBuGn,
        BuPu: scaleChromatic.interpolateBuPu,
        GnBu: scaleChromatic.interpolateGnBu,
        OrRd: scaleChromatic.interpolateOrRd,
        PuBuGn: scaleChromatic.interpolatePuBuGn,
        PuBu: scaleChromatic.interpolatePuBu,
        PuRd: scaleChromatic.interpolatePuRd,
        RdPu: scaleChromatic.interpolateRdPu,
        YlGnBu: scaleChromatic.interpolateYlGnBu,
        YlGn: scaleChromatic.interpolateYlGn,
        YlOrBr: scaleChromatic.interpolateYlOrBr,
        YlOrRd: scaleChromatic.interpolateYlOrRd,
        Rainbow: scaleChromatic.interpolateRainbow,
        Sinebow: scaleChromatic.interpolateSinebow,
      };
      return colorSchemes[colorScheme] || scaleChromatic.interpolateBlues;
    }

    mandelbrot(this.props.options, this.props.width, this.props.height);
  }


  render() {
    return (<canvas height={this.props.height} width={this.props.width} ref={canvas => this.canvas = canvas}/>);
  }
}

export default connect(mapStateToProps)(Mandelbrot)

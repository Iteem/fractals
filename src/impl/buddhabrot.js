import React from 'react';
import * as scale from "d3-scale";
import * as random from "d3-random";
import ImportanceMapSamler, {importanceMapMaxIterations} from "./buddhabrot/importanceMapSampler"
import KdTreeSampler from "./buddhabrot/kdTreeSampler"

const maxIterationsArr = [5000, 500, 50]; // r, g, b
const maxIterations = Math.max.apply(null, maxIterationsArr);
const numPoints = 1e18;

const waitTime = 50; // in ms
const drawWaitTime = 2000; // in ms

const bailoutRadius = Math.pow(2, 3);
const bailoutRadiusSqrd = bailoutRadius * bailoutRadius;

export default class Buddhabrot extends React.Component {
  componentDidMount() {
    this.ct = {canceled: false};
    this.draw(this.ct);
  }

  componentDidUpdate() {
      this.ct.canceled = true;
      this.ct = {canceled: false};
      this.draw(this.ct);
  }

  componentWillUnmount() {
    this.ct.canceled = true;
  }

  shouldComponentUpdate(nextProps) {
    return this.props.width !== nextProps.width || this.props.height !== nextProps.height;
  }


  async draw(ct){
    let ctx = this.canvas.getContext("2d");

    async function buddhabrot(width, height, ct) {
      const yScale = scale.scaleLinear()
        .domain([0, height])
        .range([-2, 1]);

      const aspectRatio = width / height;
      const extent = (yScale.range()[1] - yScale.range()[0]) * Math.max(1, aspectRatio) / 2;
      const xScale = scale.scaleLinear()
        .domain([0, width])
        .range([-extent, extent]);

      if(aspectRatio < 1){
        yScale.range([yScale.range()[0] / aspectRatio, yScale.range()[1] / aspectRatio])
      }


      const data =[];
      for (let i = 0; i < 3; i++) {
        data.push((Array(width * height)).fill(0));
      }
      const imgData = ctx.createImageData(width, height);
      const zrArr = (new Array(maxIterations)).fill(0);
      const ziArr = (new Array(maxIterations)).fill(0);

      const kdTreeSampler = new KdTreeSampler(
        xScale.range()[0], yScale.range()[0],
        -xScale.range()[0], yScale.range()[1] - yScale.range()[0]);

      //const importanceMap = await ImportanceMapSamler.getImportanceMap(xScale, yScale, width, height);

      const randY = random.randomUniform(yScale.range()[0], yScale.range()[1]);
      const randX = random.randomUniform(xScale.range()[0], xScale.range()[1]);

      let lastSampleAmount = 0;
      let lastDraw = Date.now();
      let lastTimeout = Date.now();
      for (let j = 0; j < numPoints; j++) {
        /*let cr;
        let ci;

        let importance = 0;
        while(true){
          cr = randY();
          ci = randX();

          const xx = Math.round(xScale.invert(ci));
          const yy = Math.round(yScale.invert(cr));

          if(yy >= 0 && yy < height) {
            if(xx >= 0 && xx < width) {
              importance = importanceMap[xx + yy * width] / importanceMapMaxIterations;
            }
          }

          if(importance > Math.random()){
            break;
          }
        }*/
        let {cr,ci,importance} = kdTreeSampler.getSample();

        let zr = 0;
        let zi = 0;

        let it;
        for (it = 0; it < maxIterations; it++) {
          let xTmp = zr;
          zr = zr * zr - zi * zi;
          zi = 2 * xTmp * zi;

          zr += cr;
          zi += ci;

          zrArr[it] = zr;
          ziArr[it] = zi;

          if (lengthSquared(zr, zi) > bailoutRadiusSqrd) {
            break;
          }
        }

        if(it < maxIterations) {
          zr = 0;
          zi = 0;

          for (let i = 0; i <= it; i++) {
            const zr = zrArr[i];
            const zi = ziArr[i];

            const xx = Math.round(xScale.invert(zi));
            const xxi = Math.round(xScale.invert(-zi)); // Make use of symmetry
            const yy = Math.round(yScale.invert(zr));
            for (let k = 0; k < maxIterationsArr.length; k++) {
              if (it >= maxIterationsArr[k]){
                continue;
              }

              if(yy >= 0 && yy < height) {
                if(xx >= 0 && xx < width) {
                  data[k][xx + yy * width] += 1 / importance;
                }
                if(xxi >= 0 && xxi < width) {
                  data[k][xxi + yy * width] += 1 / importance;
                }
              }
            }
          }
        }

        // Only check timeout every so often
        if(j % 1e3 === 0 && (Date.now() - lastTimeout) > waitTime) {
          await new Promise(resolve => setTimeout(resolve, 0));
          lastTimeout = Date.now();

          if (ct.canceled) {
            return;
          }

          // Wait longer for big pictures since drawing is more expensive
          if((Date.now() - lastDraw) > Math.max(width * height / 1e6, 1) * drawWaitTime){
            drawBuddha(data, imgData, xScale, yScale, ctx);

            //console.log((j - lastSampleAmount) / (Date.now() - lastDraw) * 1000);

            lastSampleAmount = j;
            lastDraw = Date.now();
          }
        }
      }

      drawBuddha(data, imgData, xScale, yScale, ctx);
    }

    let drawBuddha = function(data, imgData, xScale, yScale, ctx){
      const maxValues = data.map((d, i) => {
        // scale the exposure only considering the bulb, we don't care about values far away
        // this way we are also independent of the aspect ratio
        const width = xScale.domain()[1];
        const x0 = Math.max(xScale.domain()[0], Math.round(xScale.invert(-1.2)));
        const x1 = Math.min(xScale.domain()[1], Math.round(xScale.invert(1.2)));
        const y0 = Math.max(yScale.domain()[0], Math.round(yScale.invert(-2)));
        const y1 = Math.min(yScale.domain()[1], Math.round(yScale.invert(1)));

        let total = 0;
        for(let x = x0; x < x1; ++x){
          for(let y = y0; y < y1; ++y) {
            total += d[x + y * width]
          }
        }
        return 10 * total / ((x1 - x0) * (y1 - y0)) / this.props.options.buddhabrot.exposure[i];
      });

      // This is a bit hacky and confusing
      const indexFactor = this.props.options.buddhabrot.greyscale ? 0 : 1;
      const gamma = this.props.options.buddhabrot.gamma;

      for (let i = 0; i < data[0].length; i++) {
        imgData.data[4 * i] = 255 * Math.pow(Math.min(data[0][i] / maxValues[0], 1), gamma); // r
        imgData.data[4 * i + 1] = 255 * Math.pow(Math.min(data[1*indexFactor][i] / maxValues[1*indexFactor], 1), gamma); // g
        imgData.data[4 * i + 2] = 255 * Math.pow(Math.min(data[2*indexFactor][i] / maxValues[2*indexFactor], 1), gamma); // b
        imgData.data[4 * i + 3] = 255; // a
      }

      ctx.putImageData(imgData, 0, 0)
    }.bind(this);

    function lengthSquared(cx, cy) {
      return cx * cx + cy * cy;
    }

    /*const kdTreeSampler = new KdTreeSampler(0,0,0,0);
    console.log(KdTreeSampler.getNumNodes(kdTreeSampler.tree));
    KdTreeSampler.drawTree(ctx, kdTreeSampler.tree, 0, -2, 1.2, 2.6);

    for (let i = 0; i < 50; i++) {
      console.log(kdTreeSampler.getSample());
    }*/
    buddhabrot(this.props.width, this.props.height, ct);
  }


  render() {
    return (<canvas height={this.props.height} width={this.props.width} ref={canvas => this.canvas = canvas}/>);
  }
}
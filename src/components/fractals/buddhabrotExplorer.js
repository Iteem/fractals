import React, {Fragment} from 'react'
import * as d3Scale from "d3-scale";
import {connect} from "react-redux";
import ZoomOverlay from "./utils/zoomOverlay";

const xExtentStart = [-1, 1];
const yCenterStart = 0;
const tileSize = 512;

const mapStateToProps = state => {
  return {
    options: state.mandelbrot,
  }
};

class BuddhabrotExplorer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      xExtent: xExtentStart,
      yCenter: yCenterStart
    }
  }

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

  draw(ct)
  {
    let state = this.state;
    let width = this.props.width;
    let height = this.props.height;
    const aspectRatio = width / height;

    let ctx = this.canvas.getContext("2d");
    ctx.clearRect(0,0, this.props.width, this.props.height);

    const numTiles = this.props.width / tileSize * ((xExtentStart[1] - xExtentStart[0]) / (state.xExtent[1] - state.xExtent[0]));
    const depth = Math.min(6, Math.max(1, Math.ceil(Math.log2(numTiles))));
    const numLines = Math.pow(2, depth);

    // These factor exists to account for none square aspect ratios, so the zoom still works correctly
    const factorX = Math.max(1, aspectRatio);
    const factorY = Math.max(1, 1/aspectRatio);

    const dim = Math.min(this.props.width, this.props.height);
    const xDim = state.xExtent[1] - state.xExtent[0];
    const xCenter = (state.xExtent[1] + state.xExtent[0]) / 2;
    const yCenter = -state.yCenter;

    // This scale is used to narrow down which tiles to load
    const tileScale = d3Scale.scaleLinear()
      .domain(xExtentStart)
      .range([0, numLines]);

    const xScale = d3Scale.scaleLinear()
      .domain([xCenter * factorX - xDim / 2, xCenter * factorX + xDim / 2])
      .range([-dim / 2, dim / 2]);

    const yScale = d3Scale.scaleLinear()
      .domain([yCenter * factorX - xDim / 2, yCenter * factorX + xDim / 2])
      .range([-dim / 2, dim / 2]);

    // Actually calculate which tiles to load
    const xStart = Math.max(0, Math.floor(tileScale(-Math.abs(xCenter * factorX) - xDim / 2 * factorX)));
    const xEnd = Math.min(numLines / 2, Math.ceil(tileScale(-Math.abs(xCenter * factorX) + xDim / 2 * factorX)));

    const yStart = Math.max(0, Math.floor(tileScale(yCenter * factorX - xDim / 2 * factorY)));
    const yEnd = Math.min(numLines, Math.ceil(tileScale(yCenter * factorX + xDim / 2 * factorY)));

    // Load tiles and draw them on load
    for (let yTile = yStart; yTile < yEnd; yTile++) {
      for (let xTile = xStart; xTile < xEnd; xTile++) {
        let img = new Image();
        img.onload = function() {
          if(ct.canceled){
            return;
          }

          ctx.resetTransform();
          // First translate image to middle of the screen
          ctx.translate(width / 2, height / 2);

          const roundedSize = Math.ceil(xScale(tileScale.invert(1)) - xScale(tileScale.invert(0)) + 1);
          const x = tileScale.invert(xTile);
          const y = tileScale.invert(yTile);

          ctx.drawImage(img, Math.floor(xScale(x)), Math.floor(yScale(y)), roundedSize, roundedSize);
          //ctx.fillText(xTile + "," + yTile, Math.floor(xScale(x) + roundedSize / 2), Math.floor(yScale(y) + roundedSize / 2));
          // mirror image
          ctx.scale(-1, 1);
          ctx.drawImage(img, Math.floor(xScale(x) - 2 * xScale(0)), Math.floor(yScale(y)), roundedSize, roundedSize);
          //ctx.fillText(xTile + "," + yTile,  Math.floor(xScale(x) - 2*xScale(0) + roundedSize / 2), Math.floor(yScale(y) + roundedSize / 2));
        };
        img.src = 'https://s3.eu-central-1.amazonaws.com/iteem-buddhabrot/buddhabrot/buddhabrot_' + depth +'_' + (yTile + xTile * numLines) +'.jpg'
      }
    }
  }

  render() {
    return (
      <Fragment>
        <canvas height={this.props.height} width={this.props.width} ref={canvas => this.canvas = canvas} style={{backgroundColor: "black", width: this.props.screenWidth, height: this.props.screenHeight}}/>
        <div style={{position: "absolute", top: 0, left: 0, width: "100vw", height: "100vh"}}>
          <ZoomOverlay height={this.props.screenHeight} width={this.props.screenWidth} options={this.state} setOptions={this.setState.bind(this)}/>
        </div>
      </Fragment>
    );
  }
}

export default connect(mapStateToProps)(BuddhabrotExplorer);

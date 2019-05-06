import React, {Fragment} from 'react';
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
    const aspectRatio = this.props.width / this.props.height;

    let state = this.state;
    let width = this.props.width;
    let height = this.props.height;

    let ctx = this.canvas.getContext("2d");
    ctx.clearRect(0,0, this.props.width, this.props.height);

    const numTiles = this.props.width / 512 * ((xExtentStart[1] - xExtentStart[0]) / (state.xExtent[1] - state.xExtent[0]));
    const depth = Math.min(6, Math.max(1, Math.ceil(Math.log2(numTiles))));
    const numLines = Math.pow(2, depth);

    // Scale tiles such that on max zoom level it fits perfectly
    const windowScale = Math.min(width / (numLines * tileSize), height / (numLines * tileSize));
    // Scale on zoom level
    const scale = windowScale * (xExtentStart[1] - xExtentStart[0]) / (state.xExtent[1] - state.xExtent[0]);
    const size = tileSize * scale;

    // TODO: this does not always work despite giving a too large area most of the time
    const xStart = Math.max(0, Math.floor((state.xExtent[0] - xExtentStart[0] - (Math.max(aspectRatio - 1, 0)) / 2) * numLines) - 1);
    const xEnd = Math.min(numLines / 2, Math.ceil(xStart + (state.xExtent[1] - state.xExtent[0]) * numLines) + 1);

    const yExtentHalf = (xEnd - xStart);
    const yStart = Math.max(0, Math.floor((0.5 - state.yCenter) * numLines - yExtentHalf));
    const yEnd = Math.min(numLines, Math.ceil((0.5 - state.yCenter) * numLines + yExtentHalf));

    for (let y = yStart; y < yEnd; y++) {
      for (let x = xStart; x < xEnd; x++) {
        let img = new Image();
        img.onload = function() {
          if(ct.canceled){
            return;
          }

          ctx.resetTransform();
          // First translate image to middle of the screen
          ctx.translate(width / 2, height / 2);
          // Translate to middle of zoom (time size and numLines since the tile size and number changes depending on zoom level)
          ctx.translate(-((state.xExtent[0] + state.xExtent[1]) - (xExtentStart[0] + xExtentStart[1])) / 2 * size * numLines, (state.yCenter - yCenterStart) * size * numLines);

          const roundedSize = Math.ceil(size);
          ctx.drawImage(img, Math.floor(roundedSize * (x - numLines / 2)), Math.floor(roundedSize * (y - numLines / 2)), roundedSize + 1, roundedSize + 1);
          // mirror image
          ctx.scale(-1, 1);
          ctx.drawImage(img, Math.floor(roundedSize * (x - numLines / 2)), Math.floor(roundedSize * (y - numLines / 2)), roundedSize + 1, roundedSize + 1);
        };
        img.src = 'https://s3.eu-central-1.amazonaws.com/iteem-buddhabrot/buddhabrot/buddhabrot_' + depth +'_' + (y + x * numLines) +'.jpg'
      }
    }
  }

  render() {
    return (
      <Fragment>
        <canvas height={this.props.height} width={this.props.width} ref={canvas => this.canvas = canvas} style={{backgroundColor: "black"}}/>
        <div style={{position: "absolute", top: 0, left: 0, width: "100vw", height: "100vh"}}>
          <ZoomOverlay height={this.props.height} width={this.props.width} options={this.state} setOptions={this.setState.bind(this)}/>
        </div>
      </Fragment>
    );
  }
}

export default connect(mapStateToProps)(BuddhabrotExplorer);

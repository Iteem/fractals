import React from 'react';

export default class BarnsleyFarn extends React.Component {
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

    ctx.fillStyle = "#0c0";
    // Empircally: scale = 1 => 750px*750px
    let scale = Math.min(this.props.width, this.props.height) / 750;
    let x_offset = (this.props.width / 2) - (50 * scale);
    let y_offset = (this.props.height - 10);
    let xs = 120 * scale;
    let ys = 70 * scale;
    let max_iterations = 1e6;
    let steps = 10000;
    let timeout = 10;

    let x = 0;
    let y = 0;

    function drawFern(start) {
      if(ct.canceled){
        return;
      }

      if (start >= max_iterations) {
        return;
      }

      for (let i = 0; i < steps && i + start < max_iterations; i++) {
        let r = Math.random();
        let xo = x;
        let yo = y;
        if (r < 0.01) {
          x = 0;
          y = 0.16 * yo;
        }
        else if (r < 0.86) {
          x = 0.85 * xo + 0.04 * yo;
          y = -0.04 * xo + 0.85 * yo + 1.6;
        }
        else if (r < 0.93) {
          x = 0.2 * xo - 0.26 * yo;
          y = 0.23 * xo + 0.22 * yo + 1.6;
        }
        else {
          x = -0.15 * xo + 0.28 * yo;
          y = 0.26 * xo + 0.24 * yo + 0.44;
        }
        ctx.fillRect((x * xs + x_offset), (-y * ys + y_offset), scale, scale);
      }

      setTimeout(drawFern.bind(this, start + steps), timeout);
    }

    drawFern(0)
  }


  render() {
    return (<canvas height={this.props.height} width={this.props.width} ref={canvas => this.canvas = canvas} style={{width: this.props.screenWidth, height: this.props.screenHeight}}/>);
  }
}

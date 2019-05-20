import React from 'react';

export default class KochCurve extends React.Component {
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

    const f = Math.sqrt(1 / 12);

    async function kochCurve(x0, y0, x1, y1, depth, ct){
      if(ct.canceled){
        return;
      }

      ctx.strokeStyle = 'black';

      if (depth <= 0) {
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        return;
      }

      let xdir = (x1 - x0);
      let ydir = (y1 - y0);

      let xa = x0 + xdir / 3;
      let ya = y0 + ydir / 3;

      let xb = x0 + xdir / 2 + ydir * f;
      let yb = y0 + ydir / 2 - xdir * f;

      let xc = x0 + 2 * xdir / 3;
      let yc = y0 + 2 * ydir / 3;

      //await new Promise(resolve => setTimeout(resolve, 20));
      await kochCurve(x0, y0, xa, ya, depth - 1, ct);
      await kochCurve(xb, yb, xc, yc, depth - 1, ct);
      await kochCurve(xc, yc, x1, y1, depth - 1, ct);
      await kochCurve(xa, ya, xb, yb, depth - 1, ct);
    }

    kochCurve(0, this.props.height - 50, this.props.width, this.props.height - 50, 7, ct)
  }


  render() {
    return (<canvas height={this.props.height} width={this.props.width} ref={canvas => this.canvas = canvas} style={{width: this.props.screenWidth, height: this.props.screenHeight}}/>);
  }
}

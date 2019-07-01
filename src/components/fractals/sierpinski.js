import React from 'react';

const maxDepthCarpet = 5;
const maxDepthTriangle = 6;

export default class SierpinskiCarpet extends React.Component {
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
    ctx.clearRect(0,0, this.props.width, this.props.height);

    async function sierpinskiCarpet(x0, y0, dim, depth, ct){
      ctx.fillStyle = "black";

      if(depth <= 0){
        return;
      }

      dim /= 3;

      for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){

          if(!(i === 1 && j === 1)){
            await new Promise(resolve => setTimeout(resolve,50));
            if(ct.canceled){
              return;
            }
            sierpinskiCarpet(x0+i*dim, y0+j*dim, dim, depth - 1, ct);
          }
          else {
            await new Promise(resolve => setTimeout(resolve,100));
            if(ct.canceled){
              return;
            }
            ctx.fillRect(x0+dim, y0+dim, dim, dim);
          }
        }
      }
    }

    async function sierpinskiTriangle(x0, y0, dim, depth, ct){
      if(depth <= 0 || ct.canceled){
        return;
      }

      if(depth === maxDepthTriangle) {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(x0, y0 + dim);
        ctx.lineTo(x0 + dim, y0 + dim);
        ctx.lineTo(x0 + dim / 2, y0);
        ctx.closePath();
        ctx.fill();
      }

      await new Promise(resolve => setTimeout(resolve,100));

      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.moveTo(x0 + dim / 2, y0 + dim);
      ctx.lineTo(x0 + 3 * dim / 4, y0 + dim / 2);
      ctx.lineTo(x0 + dim / 4, y0 + dim / 2);
      ctx.closePath();
      ctx.fill();

      await new Promise(resolve => setTimeout(resolve,50));
      sierpinskiTriangle(x0 + dim / 4, y0, dim / 2, depth - 1, ct);
      await new Promise(resolve => setTimeout(resolve,50));
      sierpinskiTriangle(x0, y0 + dim / 2, dim / 2, depth - 1, ct);
      await new Promise(resolve => setTimeout(resolve,50));
      sierpinskiTriangle(x0 + dim / 2, y0 + dim / 2 , dim / 2, depth - 1, ct);
    }

    const sierpinski = this.props.triangle ? sierpinskiTriangle : sierpinskiCarpet;
    const maxDepth = this.props.triangle ? maxDepthTriangle : maxDepthCarpet;

    sierpinski(Math.max((this.props.width - this.props.height)/2, 0), Math.max((this.props.height - this.props.width)/2, 0),
      Math.min(this.props.width, this.props.height), maxDepth, ct);
  }


  render() {
    return (<canvas height={this.props.height} width={this.props.width} ref={canvas => this.canvas = canvas} style={{width: this.props.screenWidth, height: this.props.screenHeight}}/>);
  }
}

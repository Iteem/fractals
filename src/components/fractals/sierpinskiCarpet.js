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

    sierpinskiCarpet(Math.max((this.props.width - this.props.height)/2, 0), Math.max((this.props.height - this.props.width)/2, 0),
      Math.min(this.props.width, this.props.height), 5, ct);
  }


  render() {
    return (<canvas height={this.props.height} width={this.props.width} ref={canvas => this.canvas = canvas} style={{width: this.props.screenWidth, height: this.props.screenHeight}}/>);
  }
}

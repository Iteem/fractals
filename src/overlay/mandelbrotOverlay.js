import React from "react";
import * as brush from "d3-brush";
import * as selection from "d3-selection";
import * as scale from "d3-scale";

export default class MandelbrotOverlay extends React.Component {
  constructor() {
    super();

    this.setExtentAndCenter = this.setExtentAndCenter.bind(this);
  }

  setExtentAndCenter(xExtent, yCenter){
    let options = {
      mandelbrot: {
        ...this.props.options.mandelbrot,
        xExtent: xExtent,
        yCenter: yCenter
      }
    };
    this.props.onChange(options);
  }


  componentDidMount()
  {
    this.draw();
  }

  componentDidUpdate()
  {
    this.draw();
  }

  draw()
  {
    const that = this;
    let br = brush.brush().on("end", function(){
      const getEvent = () => require("d3-selection").event;
      const event = getEvent();

      if (!event.selection) return; // Ignore empty selections.

      const xScale = scale.scaleLinear()
        .domain([0, that.props.width])
        .range(that.props.options.mandelbrot.xExtent);

      const aspectRatio = that.props.width / that.props.height;
      const extent = (xScale.range()[1] - xScale.range()[0]) / aspectRatio / 2;
      const yScale = scale.scaleLinear()
        .domain([0, that.props.height])
        .range([extent + that.props.options.mandelbrot.yCenter, -extent + that.props.options.mandelbrot.yCenter]);

      const xExtent = [xScale(event.selection[0][0]), xScale(event.selection[1][0])];
      const yCenter = (yScale(event.selection[0][1]) + yScale(event.selection[1][1])) / 2;

      console.log(yCenter)

      that.setExtentAndCenter(xExtent, yCenter);

      // Clear selection
      selection.select(this).call(br.move, null)
    });

    let svg = selection.select(this.svg);

    // Update brush (and create if it does not yet exist)
    let group = svg.selectAll("g").data([null]);
    group = group.merge(group.enter().append("g"));
    group.attr("class", "brush")
      .call(br);
  }


  render() {
    return (
      <svg ref={svg => this.svg = svg} width={this.props.width} height={this.props.height}/>
    );
  }
}
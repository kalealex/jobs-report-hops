/*
 * REUSABLE CHART COMPONENTS
 * To create a bar chart with errorbars, you need to include g-chart-errorbars
 *   as a class in the selected parent element
 * Otherwise, call barChart as shown in the example below.
 */
function linePlot() {

  var margin = { 'top': 0, 'right': 50, 'left': 0, 'bottom': 20 },
    width = 400,
    height = 250,
    svg,
    chartWrapper,
    data,
    x,
    y,
    xAxis,
    yAxis,
    selection,
    distribution = false,
    numMonths = 12,
    strokeWidth = 1.5,
    opacity = 0.35,
    axisGrid = true,
    tickValue = axisGrid ? -width : -5,
    transitionDuration = 850,
    showAxisMarkers = true;

  function chart(selection) {
    selection = selection
    var that = this;
    selection.each(function(data, i) {
      init(data, that);
    })
  }

  function init(data, that) {
    // initialize our x, y scales, x and y axis and initial svg and wrapper for our chart
    selection = that;

    xExtent = d3.extent(data, function(d, i) { return d.months });
    yExtent = d3.extent(data, function(d, i) { return d.jobs });

    x = d3.scale.linear()
          .domain([0, numMonths - 1]);

    y = d3.scale.linear()
          .domain([0, 550]);

    x0 = d3.scale.ordinal()
          .domain(d3.range(numMonths));

    xAxis = d3.svg.axis().orient('bottom')
    yAxis = d3.svg.axis().orient('right')

    // separate lines for d.jobs and d.reported and a different mapping for line ensembles
    jobsLine = d3.svg.line()
        .x(function(d) { return x0(d.month) + x0.rangeBand() / 2; })
        .y(function(d) {
          if(d.jobs < -50) // if our jobs value is less than -50 from sampling
            return y(-50);  // then just set it equal to -50
          if(d.jobs > 550) // likewise if above our max
            return y(550);
          return y(d.jobs);
        })
        .interpolate("linear");

    jobsReportedLine = d3.svg.line()
        .x(function(d) { return x0(d.month) + x0.rangeBand() / 2; })
        .y(function(d) {
          // console.log("jobsReportedData", d);
          if(d.reported < -50) // if our jobs value is less than -50 from sampling
            return y(-50)  // then just set it equal to -50
          if(d.reported > 550) // likewise if above our max
            return y(550);
          return y(d.reported);
        })
        .interpolate("linear");

    // if there is no selection, create a svg for our chart
    if(selection.select('svg').empty())
      svg = selection.append('svg')
    else
      svg = selection.select('svg')

    // if there is no selection, create a wrapper for our chart
    if(svg.select('g').empty()) {
      chartWrapper = svg.append('g')
      chartWrapper.append('g').classed('x axis', true);
      chartWrapper.append('g').classed('y axis', true);
    }
    else {
      chartWrapper = svg.select('g')
    }
    chart.render(data);
  }

  chart.render = function(data) {
    // use the updated margins with the current parent width
    updateDimensions(svg.node().parentNode.getBoundingClientRect().width)

    tickValue = axisGrid ? -width : -5;
    // then continue rendering the entirety of the chart
    var formatMonth = d3.time.format('%b');
    x.range([0, width])
    y.range([height, 0])
    x0.rangeBands([0, width], 0.2)

    // change tick values if using a different chart than hops/errorbars
    yAxis.scale(y)
      .tickSize(tickValue)
      .tickValues([-50, 0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500])
      .tickPadding(10);

    xAxis.scale(x0)
      .ticks(12)
      .tickSize(4)
      .tickPadding(7)
      .tickFormat(function(i) { return formatMonth(new Date(2018, i, 1))[0]; });

    if(!showAxisMarkers) {
      yAxis.tickFormat("");
      xAxis.tickFormat("");
    }

    // set svg and chartWrapper dimensions
    svg.attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom + 40)
    chartWrapper.attr('class', 'control-svg-g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // call and create/update the y axis
    svg.select('.y.axis')
      .attr('transform', 'translate(' + width + ', 0)')
      .call(yAxis)
    .selectAll('.tick')
      .classed('g-baseline-axis', function(d, i) { return i == 0; })
      .classed('g-baseline', function(d) { return d == 0; })

    var ytranslate = d3.transform(selection.selectAll('.g-baseline').attr('transform')).translate[1]
    var ytranslate2 = d3.transform(selection.selectAll('.g-baseline-axis').attr('transform')).translate[1]
    var heightOffset = ytranslate2 - ytranslate;

    // using the offset from the y axis, create and translate the x axis
    svg.select('.x.axis')
      .attr('transform', 'translate(0,' + (height + heightOffset) + ')')
      .call(xAxis);

    // now, update and edit the line charts
    var g;
    var line;

    // if it is a static line ensemble plot, choose the group of elements
    if(distribution) {
      g = chartWrapper.selectAll('.g-line')
        .data(function(d) { return d; })

      // if there are extra g elements, leave the selection and remove the extras
      g.exit().remove()

      // after, enter the selection and create and group elements that you need to
      g.enter().append('path')
        .attr('class', 'g-line');

      line = g;
      // line = g.selectAll('.g-line-distribution');
    } else {
      line = chartWrapper.selectAll('.g-bar');
      if(line.empty()) {
        line = chartWrapper.append("path")
          .datum(function(d) { return d.months; })
          .attr('class', 'g-bar');
      }
    }

    // line.attr('class', function(d) {
    //   if(distribution)
    //     return 'g-line-distribution'
    //   else
    //     return 'g-bar'
    // });

    // // enter/exit to create/remove if necessary
    // line.exit().remove()
    // line.enter().append('path')
    //   .attr('class', function(d) {
    //     if(distribution)
    //       return 'g-stripe-distribution'
    //     else
    //       return 'g-bar'
    //   })

    if(g) {
      line.attr("stroke-opacity", opacity)
      // line.attr('fill', 'rgba(158, 75, 108, ' + opacity + ')')
    } else {
      line.classed('g-line', true) //changed from g-stripe
    }

    // if hops, always animate transitions to creating
    if(selection.classed('g-chart-hops')) {
      line.transition()
        .duration(transitionDuration)
        .delay(function(d, i){ return transitionDuration == 0 ? 0 : i * 30; })
        .attr("d", jobsReportedLine(data.months))
        .attr("stroke-width", function(d) { return strokeWidth });
        // .attr("y", function(d) {
        //   if(d.reported < -50) // if our jobs value is less than -50 from sampling
        //     return y(-50)  // then just set it equal to -50
        //     return y(d.reported) - barHeight / 2;
        // })
        // .attr('height', function(d) { return barHeight })
        // .attr('width', x0.rangeBand())
        // .attr('x', function(d) { return x0(d.month); });
    } else if(selection.classed('g-chart-stimuli')) {
      line.transition()
        .duration(transitionDuration)
          .delay(function(d, i){ return i * 30; })
        .attr("d", jobsLine(data.months))
        .attr("stroke-width", function(d) { return strokeWidth });
        // .attr("y", function(d) {
        //   if(d.jobs < -50) // if our jobs value is less than -50 from sampling
        //     return y(-50)  // then just set it equal to -50
        //     return y(d.jobs) - barHeight / 2;
        // })
        // .attr('height', function(d) { return barHeight; })
        // .attr('width', x0.rangeBand())
        // .attr('x', function(d) { return x0(d.month); });
    } else if (distribution) {
      console.log(data);
      // console.log("line selection", line);
      // console.log("data", data);
      line[0].forEach(function(pathElem, i) {
        // console.log("pathElem", pathElem);
        // console.log("pathElem type", typeof pathElem);
        d3.select(pathElem).attr("d", jobsReportedLine(data[i]))
          .attr("stroke-width", function(d) { return strokeWidth });
      });
      // line.attr("d",  jobsReportedLine(data) )
      //   .attr("stroke-width", function(d) { return strokeWidth });
    } else {
      // then otherwise, update the data
      line.attr("d", jobsLine(data.months))
        .attr("stroke-width", function(d) { return strokeWidth });
      // .attr("y", function(d) {
      //   if(d.jobs < -50) // if our jobs value is less than -50 from sampling
      //     return y(-50)  // then just set it equal to -50
      //   return y(d.jobs) - barHeight / 2;
      // })
      // .attr('height', function(d) { return barHeight; })
      // .attr('width', x0.rangeBand())
      // .attr('x', function(d) { return x0(d.month); });
    }
  }

  function updateDimensions(winWidth) {
    // margin.top = winWidth > 350 ? 40 : 20;
    // margin.right = winWidth > 350 ? 60 : 30;
    // margin.left = winWidth > 350 ? 40 : 20;
    // margin.bottom = winWidth > 350 ? 30 : 0;

    width = winWidth - margin.left - margin.right;
    height = width * 0.625;
  }

  // getter and setter functions
  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.x = function(_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };

  chart.strokeWidth = function(_) {
    if (!arguments.length) return strokeWidth;
    strokeWidth = _;
    return chart;
  };

  chart.opacity = function(_) {
    if (!arguments.length) return opacity;
    opacity = _;
    return chart;
  };

  chart.axisGrid = function(_) {
    if (!arguments.length) return axisGrid;
    axisGrid = _;
    return chart;
  };

  chart.showAxisMarkers = function(_) {
    if (!arguments.length) return showAxisMarkers;
    showAxisMarkers = _;
    return chart;
  };

  chart.y = function(_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
  };

  chart.distribution = function(_) {
    if (!arguments.length) return distribution;
    distribution = _;
    return chart;
  };

  chart.transitionDuration = function(_) {
    if (!arguments.length) return transitionDuration;
    transitionDuration = _;
    return chart;
  };

  return chart
}
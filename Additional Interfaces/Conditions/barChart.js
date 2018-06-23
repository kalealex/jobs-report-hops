/*
 * REUSABLE CHART COMPONENTS
 * To create a bar chart with errorbars, you need to include g-chart-errorbars
 *   as a class in the selected parent element
 * Otherwise, call barChart as shown in the example below.
 */
function barChart() {

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
    errorbars,
    numMonths = 12,
    transitionDuration = 800,
    showAxisMarkers = true;

  function chart(selection) {
    this.selection = selection
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
    } else {
      chartWrapper = svg.select('g')
    }

    chart.render(data);
  }

  chart.render = function(data) {
    // use the updated margins with the current parent width
    //svg = selection.select('g')
    updateDimensions(svg.node().parentNode.getBoundingClientRect().width)

    // then continue rendering the entirety of the chart
    var formatMonth = d3.time.format('%b');
    x.range([0, width])
    y.range([height, 0])
    x0.rangeBands([0, width], 0.2)

    // change tick values if using a different chart than hops/errorbars
    yAxis.scale(y)
      .tickSize(-width)
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

    // now, update and edit the bar charts
    var bar = chartWrapper.selectAll('.g-bar')
      .data(function(d) { return d.months; })

    // enter to create if necessary
    bar.enter().append('rect')
      .attr('class', 'g-bar')

    // if hops, always animate transitions to creating
    if(selection.classed('g-chart-hops')) {
      bar.transition()
        .duration(transitionDuration)
        .delay(function(d, i){ return i * 30; })
        .attr("y", function(d) {
          return y(Math.max(d.reported, 0));
        })
        .attr('height', function(d) {
          if(y(Math.max(d.reported, 0)) > ytranslate - 2 && Math.abs(y(0) - y(d.reported)) > (ytranslate2 - ytranslate)) {
            return(ytranslate2 - ytranslate);
          }
          return Math.abs(y(0) - y(d.reported));
        })
        .attr('width', x0.rangeBand())
        .attr('x', function(d) { return x0(d.month); });
    } else if(selection.classed('g-chart-stimuli')) {
      bar.transition()
      .duration(transitionDuration)
        .delay(function(d, i){ return i * 30; })
      .attr("y", function(d) {
        return y(Math.max(d.jobs, 0));
      })
      .attr('height', function(d) {
        if(y(Math.max(d.jobs, 0)) > ytranslate - 2 && Math.abs(y(0) - y(d.jobs)) > (ytranslate2 - ytranslate)) {
          return(ytranslate2 - ytranslate);
        }
        return Math.abs(y(0) - y(d.jobs));
      })
      .attr('width', x0.rangeBand())
      .attr('x', function(d) { return x0(d.month); });
    } else {
      // then otherwise, update the data
      bar.attr("y", function(d) {
        return y(Math.max(d.jobs, 0));
      })
      .attr('height', function(d) {
        if(y(Math.max(d.jobs, 0)) > ytranslate - 2 && Math.abs(y(0) - y(d.jobs)) > (ytranslate2 - ytranslate)) {
          return(ytranslate2 - ytranslate);
        }
        return Math.abs(y(0) - y(d.jobs));
      })
      .attr('width', x0.rangeBand())
      .attr('x', function(d) { return x0(d.month); });
    }

    //console.log(selection);

    // if our selection container has errorbars, generate errorbars too
    if(selection.classed('g-chart-errorbars')) {
      if(chartWrapper.select('.g-lines').empty())
        errorbars = chartWrapper.append('g')
          .attr("class", "g-lines")
      else
        errorbars = chartWrapper.select('.g-lines')

      errorbars = errorbars.selectAll('.g-errorbars')
          .data(function(d) { return d.months; })

      errorbars.enter().append('svg:line')
          .attr("class", "g-errorbars")

      errorbars.attr("x1", function(d) { return x0(d.month) + x0.rangeBand() / 2 ; })
          .attr("y1", function(d) {
            //if(y(d.jobs - standardDeviation * 1.96) > height) { return height }
            return y(d.jobs - standardDeviation * 1.96); })
          .attr("x2", function(d) { return x0(d.month) + x0.rangeBand() / 2 ; })
          .attr("y2", function(d) { return y(d.jobs + standardDeviation * 1.96); })
          .attr("stroke", "rgba(232, 190, 0, 0.8)")
          .attr("stroke-width", "2");
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

  chart.init = function(_) {
    if (!arguments.length) return init;
    init = _;
    return chart;
  };

  chart.x = function(_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };

  chart.y = function(_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
  };

  chart.showAxisMarkers = function(_) {
    if (!arguments.length) return showAxisMarkers;
    showAxisMarkers = _;
    return chart;
  };

  chart.transitionDuration = function(_) {
    if (!arguments.length) return transitionDuration;
    transitionDuration = _;
    return chart;
  };

  return chart
}
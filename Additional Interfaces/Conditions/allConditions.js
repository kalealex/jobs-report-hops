
var realJobs = 150,
    standardDeviation = 95,
    rate = 15,
    numMonths = 12,
    minJobs = realJobs - 1.96 * standardDeviation, // 1.96 == 95%
    maxJobs = realJobs + 1.96 * standardDeviation,
    reportedJobs,
    n = 50,
    increasing = false,
    animationDuration = 600,
    transitionDuration = 200;

var isMobileEmbedded = document.documentElement.className.indexOf('page-interactive-embedded') > -1;
var isApp = document.documentElement.className.indexOf('page-interactive-app') > -1;

var staticSteadyBarChart,
    staticGrowthBarChart,
    uncertainSteadyBarChart,
    uncertainGrowthBarChart,
    staticSteadyLineChart,
    staticGrowthLineChart,
    uncertainSteadyLineChart,
    uncertainGrowthLineChart,
    uncertainSteadyFastLineChart,
    uncertainGrowthFastLineChart;

var margin = { }
  margin.top = 40;
  margin.right =  60;
  margin.left = 40;
  margin.bottom = 30;

var normalDistributionData = generateData(n, realJobs, standardDeviation);

var data = [];
html = d3.selectAll(".g-graphic.g-bars");
d3.selectAll(".g-uncertain")[0].forEach(function(el) {
  var random = el.getAttribute("data-random") === "" ? true : false;
  var rate = +el.getAttribute("data-rate");
  var months = [];
  d3.range(numMonths).forEach(function(i) {
    months.push({
      jobs: realJobs + rate * i,
      month: i
    });
  });

  data.push({
    el: el,
    random: random,
    rate: rate,
    months: months
  });
});

var dataFastHops = [];
html = d3.selectAll(".g-graphic.g-bars");
d3.selectAll(".g-uncertain")[0].forEach(function(el) {
  var random = el.getAttribute("data-random") === "" ? true : false;
  var rate = +el.getAttribute("data-rate");
  var months = [];
  d3.range(numMonths).forEach(function(i) {
    months.push({
      jobs: realJobs + rate * i,
      month: i
    });
  });

  dataFastHops.push({
    el: el,
    random: random,
    rate: rate,
    months: months
  });
});

var linePlots = linePlot();
    linePlots
      .margin(margin)
      .transitionDuration(transitionDuration);

var fastLinePlots = linePlot();
    fastLinePlots
      .margin(margin)
      .distribution(false)
      .transitionDuration(0);

var barsChart = barChart();
  barsChart.margin(margin).transitionDuration(800);

var barData = [];

// Generate the distribution for barChart Data
d3.range(1, 3, 1).forEach(function(s, j) {
  var rate = 0;
  var months = [];
  if(s % 2 == 0) {
    rate = 15;
  }

  d3.range(numMonths).forEach(function(i) {
    months.push({
      jobs: realJobs + rate * i,
      month: i
    });
  });

  barData.push({
    rate: rate,
    months: months
  });
});

var barDataUncertain = [];

// Generate the distribution for barChart Data
d3.range(1, 3, 1).forEach(function(s, j) {
  var rate = 0;
  var months = [];
  if(s % 2 == 0) {
    rate = 15;
  }

  d3.range(numMonths).forEach(function(i) {
    months.push({
      jobs: realJobs + rate * i,
      month: i
    });
  });

  barDataUncertain.push({
    rate: rate,
    months: months
  });
});

// Generate our static bar chart w/ error bars and steady trend
staticSteadyBarChart = d3.selectAll('.g-static.g-chart--steady.g-chart-bar')
  .datum(barData[0])
  .call(barsChart);

// Generate our static bar chart w/ error bars and increasing trend
staticGrowthBarChart = d3.selectAll('.g-static.g-chart--increasing.g-chart-bar')
  .datum(barData[1])
  .call(barsChart);

// Generate our static bar chart w/ error bars and steady trend
uncertainSteadyBarChart = d3.selectAll('.g-uncertain.g-chart--steady.g-chart-bar')
  .datum(barDataUncertain[0])
  .call(barsChart);

// Generate our static bar chart w/ error bars and increasing trend
uncertainGrowthBarChart = d3.selectAll('.g-uncertain.g-chart--increasing.g-chart-bar')
  .datum(barDataUncertain[1])
  .call(barsChart);

// Set line plots to use the distribution and generate lines
linePlots.distribution(true).opacity(0.5);
// Generate our static line ensemble chart with steady trend
staticSteadyLineChart = d3.selectAll('.g-static.g-chart--steady.g-chart-line')
  .datum(normalDistributionData.steady)
  .call(linePlots);

// Generate our static line ensemble chart with increasing trend
staticGrowthLineChart = d3.selectAll('.g-static.g-chart--increasing.g-chart-line')
  .datum(normalDistributionData.increasing)
  .call(linePlots);

linePlots.distribution(false).opacity(1.0);
// Generate our normal line HOPs chart with steady trend
uncertainSteadyLineChart = d3.selectAll('.g-uncertain.g-chart--steady.g-chart-line.g-slow')
  .datum(data[0])
  .call(linePlots);

// Generate our normal line HOPs chart with increasing trend
uncertainGrowthLineChart = d3.selectAll('.g-uncertain.g-chart--increasing.g-chart-line.g-slow')
  .datum(data[1])
  .call(linePlots);

console.log(uncertainGrowthLineChart)

// Generate our normal line HOPs chart with steady trend
uncertainSteadyFastLineChart = d3.selectAll('.g-uncertain.g-chart--steady.g-chart-line.g-fast')
  .datum(dataFastHops[0])
  .call(fastLinePlots);

// Generate our normal line HOPs chart with increasing trend
uncertainGrowthFastLineChart = d3.selectAll('.g-uncertain.g-chart--increasing.g-chart-line.g-fast')
  .datum(dataFastHops[1])
  .call(fastLinePlots);

// Set our HOPs charts to animate properly
uncertainSteadyBarChart.classed('g-chart-hops', true);
uncertainGrowthBarChart.classed('g-chart-hops', true);
uncertainSteadyLineChart.classed('g-chart-hops', true);
uncertainGrowthLineChart.classed('g-chart-hops', true);
uncertainSteadyFastLineChart.classed('g-chart-hops', true);
uncertainGrowthFastLineChart.classed('g-chart-hops', true);

play();

// for the static version of the charts, we don't want to randomize the secondary charts
function randomizeData(chartData) {
  var randomData = [];
  chartData.forEach(function(cd) {
    cd.months.forEach(function(d) {//there are four chart datas= model for rate 0, random rate 0, model for rate 15, random rate 15
        d.reported = cd.random ? Math.round(d3.random.normal(d.jobs, standardDeviation)()) : d.jobs;
        randomData.push(d.reported);
    });
  });
}

function updateLineHops() {
  linePlots.transitionDuration(200)
    .margin(margin);
  uncertainSteadyLineChart.datum(data[0]).call(linePlots);
  uncertainGrowthLineChart.datum(data[1]).call(linePlots);
}

function updateFastLineHops() {
  fastLinePlots.transitionDuration(0)
    .margin(margin);
  uncertainSteadyFastLineChart.datum(dataFastHops[0]).call(fastLinePlots);
  uncertainGrowthFastLineChart.datum(dataFastHops[1]).call(fastLinePlots);
}

function updateBarHops() {
  barsChart
    .margin(margin);
  uncertainSteadyBarChart.datum(data[0]).call(barsChart);
  uncertainGrowthBarChart.datum(data[1]).call(barsChart);
}

var intervalId, isPlaying = false;

function play() {
  html.selectAll(".g-play-pause").text("Pause");
  isPlaying = true;
  d3.selectAll(".g-play-pause").text("Pause");
  randomizeData(data);
  randomizeData(dataFastHops);
  randomizeData(barDataUncertain);

  updateLineHops();
  updateFastLineHops();
  updateBarHops();

  intervalId = setInterval(function() {
    randomizeData(data);
    updateLineHops();
  }, 600);

  intervalIdFastHops = setInterval(function() {
    randomizeData(dataFastHops);
    updateFastLineHops();
  }, 100);

  intervalIdBars = setInterval(function() {
    randomizeData(barDataUncertain);
    updateBarHops();
  }, 1200);
}

function pause() {
  html.selectAll(".g-play-pause").text("Play")
  isPlaying = false;
  d3.selectAll(".g-play-pause").text("Play");

  clearInterval(intervalId);
}

html.selectAll(".g-play-pause")
  .on("click", function() {
    isPlaying ? pause() : play();
  });


$(window).resize(function() {

  var linePlots = linePlot();

  linePlots.margin(margin);
  staticSteadyLineChart.call(linePlots)
  staticGrowthLineChart.call(linePlots)
  uncertainSteadyLineChart.call(linePlots)
  uncertainGrowthLineChart.call(linePlots)
});

/**
 * [generateData description]
 * @param  {[type]} p # of partitions
 * @return {[type]}   [description]
 */
function generateData(p, mean, sd) {
  var d = {}
  for(var u = 0; u < 2; u++) {
    if(u % 2 == 0) {
      rate = 15
    } else {
      rate = 0
      increasing = !increasing;
    }

    var data = [];

    for(var i = 0; i < p; i++) {
      var datum = []
      for(var j = 0; j < numMonths; j++) {
        var tempMeanJobs = mean + j * rate;
        var tempVal = Math.round(d3.random.normal(tempMeanJobs, sd)());
        var tempObj = {
          'month': j,
          'jobs': tempMeanJobs,
          'reported': tempVal
        }
        datum.push(tempObj);

      }
      data.push(datum);
    }

    if(increasing)
      d["steady"] = data;
    else
      d["increasing"] = data;
  }
  increasing = false;
  return d;
}
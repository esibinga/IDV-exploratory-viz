/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth,
  height = window.innerHeight,
  margin = { top: 20, bottom: 20, left: 60, right: 40 };

let svg;
let tooltip;

/**
 * APPLICATION STATE
 * */
let state = {
  directData: [],
  hover: {
    mx: null,
    my: null,
  },
  mousePosition: null
};

/**
 * LOAD DATA
 **/
Promise.all([
  d3.csv("../data/darts_data/darts_master_sheet.csv"),
  d3.csv("../data/dartboard_svg_data.csv", d3.autoType),
]).then(([data, svgdata]) => {
    state.data = data;
    state.svgdata = svgdata;
    console.log("data:", state.data);
    console.log("data:", state.svgdata);
    init();
  });
    

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {

  const container = d3
     .select("#d3-container")
     .style("position", "relative");

  tooltip = container
    .append("div")
    .attr("class", "tooltip")
    .attr("width", 100)
    .attr("height", 100)
    .style("position", "relative"); 
  
  const svgContainer = d3.select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height*1.01);
  
/*
svg1 = container
    .append("svg")
    .attr("width", width*1.03)
    .attr("height", height*1.1)
    .attr("position", "absolute"); */

// dartboard specs: https://www.dartsnutz.net/forum/showthread.php?tid=20982 //
const r = 8;
circleData = [
  {"cx": 300, "cy": 300, "radius": 30*r, "inner_radius": 27.75*r}, 
  { "cx": 300, "cy": 300, "radius": 26.75*r, "inner_radius": 18*r},
  { "cx": 300, "cy": 300, "radius": 17*r, "inner_radius": 3*r},
  {"cx": 300, "cy": 300, "radius": r, "inner_radius": 0}
]

const circles = svgContainer.selectAll("circle")
  .data(circleData)
  .enter()
  .append("g");

// Add outer circles
circles.append("circle")
  .attr("cx", function (d) { return d.cx; })
  .attr("cy", function (d) { return d.cy; })
  .attr("r", function (d) { return d.radius; })
  .style("fill", "darkRed")
  .style("stroke", "white");

// Add inner circles
circles.append("circle")
  .attr("cx", function (d) { return d.cx; })
  .attr("cy", function (d) { return d.cy; })
  .attr("r", function (d) { return d.inner_radius; })
  .style("fill", "darkGreen")
  .style("stroke", "black");

// Create spider function (dartboard segments)
const spider = d3.arc()
    .innerRadius(3*r)
    .outerRadius(300);

var arcData = [
	{startAngle: 0, endAngle: (Math.PI/10)},
	{startAngle: (Math.PI/10), endAngle: ((Math.PI*2)/10)},
	{startAngle: ((Math.PI*2)/10), endAngle: ((Math.PI*3)/10)},
	{startAngle: ((Math.PI*3)/10), endAngle: ((Math.PI*4)/10)},
  {startAngle: ((Math.PI*4)/10), endAngle: ((Math.PI*5)/10)},
  {startAngle: ((Math.PI*5)/10), endAngle: ((Math.PI*6)/10)},
	{startAngle: ((Math.PI*6)/10), endAngle: ((Math.PI*7)/10)},
  {startAngle: ((Math.PI*7)/10), endAngle: ((Math.PI*8)/10)},
  {startAngle: ((Math.PI*8)/10), endAngle: ((Math.PI*9)/10)},
	{startAngle: ((Math.PI*9)/10), endAngle: ((Math.PI*10)/10)},
  {startAngle: ((Math.PI*10)/10), endAngle: ((Math.PI*11)/10)},
  {startAngle: ((Math.PI*11)/10), endAngle: ((Math.PI*12)/10)},
  {startAngle: ((Math.PI*12)/10), endAngle: ((Math.PI*13)/10)},
	{startAngle: ((Math.PI*13)/10), endAngle: ((Math.PI*14)/10)},
  {startAngle: ((Math.PI*14)/10), endAngle: ((Math.PI*15)/10)},
  {startAngle: ((Math.PI*15)/10), endAngle: ((Math.PI*16)/10)},
	{startAngle: ((Math.PI*16)/10), endAngle: ((Math.PI*17)/10)},
  {startAngle: ((Math.PI*17)/10), endAngle: ((Math.PI*18)/10)},
  {startAngle: ((Math.PI*18)/10), endAngle: ((Math.PI*19)/10)},
	{startAngle: ((Math.PI*19)/10), endAngle: ((Math.PI*20)/10)}
];

// Use a pie chart to apply data (number values) to the arc data

const dartboardSvg = d3.select('svg')
.selectAll('path')
.data(arcData)
.enter()
.append('path')
.attr('stroke', 'silver')
.attr('fill', 'transparent')
.attr('transform', `translate(300,300) rotate(9)`)
.attr('d', spider);


svgContainer.on("mousemove", () => {
  const [mx, my] = d3.mouse(svgContainer.node());
  state.hover["mx"] = mx;
  state.hover["my"] = my;
  //console.log("mx", mx)
  draw();
});

  draw(); // calls the draw function
}


/**
 * Next up: how do I make these segments "live"? 
 * Turn these into paths using d3.path -- then check geo tutorial
 */

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {
  if (state.hover) {
    tooltip
      .html(
        `
        <div>Mouse x: ${state.hover.mx}</div>
        <div>Mouse y: ${state.hover.my}</div> `
      );
  }
  
}





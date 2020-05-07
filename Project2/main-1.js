export function chart1() {

/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth*.9,
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
    points: null,
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
     .select("#d3-container-1")
     .style("position", "relative");

//dartboard tooltip
  tooltip = container
    .append("div")
    .attr("class", "tooltip")
    .attr("width", 100)
    .attr("height", 100)
    .style("position", "absolute"); 
  
  //dartboard container
  const svgContainer = d3.select("#d3-container-1")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  
/*
svg1 = container
    .append("svg")
    .attr("width", width*1.03)
    .attr("height", height*1.1)
    .attr("position", "absolute"); */

// dartboard specs: https://www.dartsnutz.net/forum/showthread.php?tid=20982 //
const r = width/100;
circleData = [
  {"cx": width/2, "cy": height/2, "radius": 30*r, "inner_radius": 27.75*r, "value": "single"}, 
  { "cx": width/2, "cy": height/2, "radius": 26.75*r, "inner_radius": 18*r},
  { "cx": width/2, "cy": height/2, "radius": 17*r, "inner_radius": 3*r},
  {"cx": width/2, "cy": height/2, "radius": r, "inner_radius": 0, "value": 50}
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
  .style("stroke", "black");

// Add inner circles
circles.append("circle")
  .attr("cx", function (d) { return d.cx; })
  .attr("cy", function (d) { return d.cy; })
  .attr("r", function (d) { return d.inner_radius; })
  .style("fill", "darkGreen")
  .style("stroke", "white");


// Use a pie chart to apply data (number values) to the arc data
const pie = d3.pie()
  .value(function(d) { return d.angle_value});
  (state.svgdata);

var data_ready = pie(state.svgdata);
//console.log("pie", pie); //this is just the function
//console.log("data_ready", data_ready);

circles
  .select('svg')
  .data(data_ready)
  .enter()
  .append('path')
  .attr("d", d3.arc()
    .innerRadius(3*r)
    .outerRadius(27.75*r)
    )
  .attr('fill', 'transparent')
  .attr('transform', `translate(${width/2}, ${height/2}) rotate (-9)`)
  .attr('stroke', 'silver')
  .style('stroke-width', '1.5px')
  .on("mouseover", function(d) {
    d3.select(this)
    //console.log("this", this)
    state.hover = {
      points: d.data.number_ID,
    };
    //console.log(d.data.number_ID) //WOOHOO!!!!
    draw();
  });


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
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {
  if (state.hover) {
    tooltip
      .html(
        `
        <div>Mouse x: ${state.hover.mx}</div>
        <div>Mouse y: ${state.hover.my}</div>
        <div>Points: ${state.hover.points}</div> `
      );
  }
  
}


} //export chart here





//extras

/**
 * var pie_data = [
  {"number":  18, "name": "20"},
  {"number":  18, "name": "1"},
  {"number": 18, "name": "18"},
  {"number": 18, "name": "4"},
  {"number": 18, "name": "13"},
  {"number": 18, "name": "6"},
  {"number":  18, "name": "10"},
  {"number":  18, "name": "15"},
  {"number": 18, "name": "2"},
  {"number": 18, "name": "17"},
  {"number": 18, "name": "3"},
  {"number": 18, "name": "19"},
  {"number":  18, "name": "7"},
  {"number":  18, "name": "16"},
  {"number": 18, "name": "8"},
  {"number": 18, "name": "11"},
  {"number": 18, "name": "14"},
  {"number": 18, "name": "9"},
  {"number": 18, "name": "12"},
  {"number": 18, "name": "5"}
];
 */


// Create spider function (dartboard segments) -- fun but not data driven and not needed!
/*const spider = d3.arc()
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

const dartboardSvg = d3.select('svg')
.selectAll('path')
.data(arcData)
.enter()
.append('path')
.attr('stroke', 'silver')
.attr('fill', 'transparent')
.attr('transform', `translate(300,300) rotate(-9)`)
.attr('d', spider);
*/

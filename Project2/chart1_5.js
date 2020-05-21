export function chart1_5() {

//dartboard heat map


/**
* CONSTANTS AND GLOBALS
* */
const width = window.innerWidth * 0.8,
      height = window.innerHeight * 0.9,
      margin = { top: 20, bottom: 20, left: 60, right: 40 };
    
let svg;
let tooltip;
let circleData; //why did I have to define this here when I exported the chart as a module, but not before?
    
/**
* APPLICATION STATE
* */
let state = {
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
        init();
      });
        
    
/**
* INITIALIZING FUNCTION
* this will be run *one time* when the data finishes loading in
* */
function init() {
    
const container = d3
        .select("#tooltip-1-5")
        .style("position", "relative");

//dartboard tooltip
tooltip = container
    .append("div")
    .attr("class", "tooltip")
    .attr("width", 100)
    .attr("height", 100)
    .style("position", "absolute")
    .style("visibility", "hidden"); 
     
//dartboard container
const svgContainer = d3.select("#d3-container-1-5")
       .append("svg")
       .attr("width", width*.9)
       .attr("height", height*1.1);
     
    
// dartboard specs: https://www.dartsnutz.net/forum/showthread.php?tid=20982 //
const r = height/80;
circleData = [
      {"cx": width*.45, "cy": height/2, "radius": 33*r, "inner_radius": 27.75*r, "value": "single"}, 
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
      .style("fill", "black")
      .style("stroke", "black");
    
// Add inner circles
circles.append("circle")
      .attr("cx", function (d) { return d.cx; })
      .attr("cy", function (d) { return d.cy; })
      .attr("r", function (d) { return d.inner_radius; })
      .style("fill", "white")
      .style("stroke", "white");
    
    
// Use a pie chart to apply data (number values) to the arc data
const pie = d3.pie()
      .value(function(d) { return d.angle_value});
      (state.svgdata);

var labelArc = d3.arc() 
	.outerRadius(32*r)
  .innerRadius(29*r);

var data_ready = pie(state.svgdata);
    
var heatColors = d3.scaleLinear()
    .domain([0,20])
    .range(["#ffffb2", "#fecc5c"]);

var heatColorsDouble = d3.scaleLinear()
    .domain([0,40])
    .range(["#ffffb2", "#fd8d3c"]);

var heatColorsTreble = d3.scaleLinear()
    .domain([0,60])
    .range(["#ffffb2", "#e31a1c"]);

//inner single
const spider = circles
      .select('svg')
      .data(data_ready)
      .enter()
      .append('path')
      .attr("d", d3.arc()
        .innerRadius(3*r)
        .outerRadius(17*r)
        )
      .attr('fill', d => {
        return heatColors(d.data.number_ID)
      })
      .attr('opacity', 0.8)
      .attr('transform', `translate(${width*.45}, ${height/2}) rotate (-9)`)
      .attr('stroke', 'silver')
      .style('stroke-width', '1.5px')
      .on("mouseover", function(d) {
        d3.select(this)
        .attr('opacity', 1.0); 
        state.hover = {
          points: d.data.number_ID,
        };
        //console.log(d.data.number_ID) //WOOHOO!!!!
        draw();
      })
      .on("mouseout", function(d) {
        d3.select(this)
        .attr('opacity', 0.8);
        draw();
      });
    
//outer single
const spider2 = circles
      .select('svg')
      .data(data_ready)
      .enter()
      .append('path')
      .attr("d", d3.arc()
        .innerRadius(18*r)
        .outerRadius(27.75*r)
        )
      .attr('fill', d => {
            return heatColors(d.data.number_ID)
          })
      .attr('opacity', 0.8)
      .attr('transform', `translate(${width*.45}, ${height/2}) rotate (-9)`)
      .attr('stroke', 'silver')
      .style('stroke-width', '1.5px')
      .on("mouseover", function(d) {
        d3.select(this)
        .attr('opacity', 1.0);
        state.hover = {
          points: d.data.number_ID,
        };
        draw();
      })
      .on("mouseout", function(d) {
        d3.select(this)
        .attr('opacity', 0.8);
        draw();
      });
    
//triple ring
const spider3 = circles
      .select('svg')
      .data(data_ready)
      .enter()
      .append('path')
      .attr("d", d3.arc()
        .innerRadius(17*r)
        .outerRadius(18*r)
        )
      .attr('fill', d => {
            return heatColorsTreble(d.data.treble)
          })
      .attr('opacity', 0.8)
      .attr('transform', `translate(${width*.45}, ${height/2}) rotate (-9)`)
      .attr('stroke', 'silver')
      .style('stroke-width', '1.5px')
      .on("mouseover", function(d) {
        d3.select(this)
        .attr('opacity', 1.0);
        state.hover = {
          points: d.data.treble,
        };
        draw();
      })
      .on("mouseout", function(d) {
        d3.select(this)
        .attr('opacity', 0.8);
        draw();
      });
    
//double ring
const spider4 = circles
        .select('svg')
        .data(data_ready)
        .enter()
        .append('path')
        .attr("d", d3.arc()
          .innerRadius(26.75*r)
          .outerRadius(27.75*r)
          )
        .attr('opacity', 0.8)
        .attr('fill', d => {
            return heatColorsDouble(d.data.double)
          })
        .attr('transform', `translate(${width*.45}, ${height/2}) rotate (-9)`)
        .attr('stroke', 'silver')
        .style('stroke-width', '1.5px')
        .on("mouseover", function(d) {
            d3.select(this)
            .attr('opacity', 1.0);
            state.hover = {
              points: d.data.double,
            };
            draw();
          })
          .on("mouseout", function(d) {
            d3.select(this)
            .attr('opacity', 0.8);
            draw();
          });

const bullseyeData = [
    {"angle_value": 360, "bullseye": 25}
      ]

var data_ready2 = pie(bullseyeData);

const doubleBullseyeData = [
    {"angle_value": 360, "double_bullseye": 50}
        ]
var data_ready3 = pie(doubleBullseyeData);

//bullseye ring
const spider5 = circles
    .select('svg')
    .data(data_ready2)
    .enter()
    .append('path')
    .attr("d", d3.arc()
      .innerRadius(r)
      .outerRadius(3*r)
      )
    .attr('fill', d => {
        return heatColorsTreble(d.data.bullseye)
      })
    .attr('opacity', 0.8)
    .attr('transform', `translate(${width*.45}, ${height/2}) rotate (-9)`)
    .attr('stroke', "silver")
    .style('stroke-width', '1.5px')
    .on("mouseover", function(d) {
        d3.select(this)
        .attr('opacity', 1.0);
        state.hover = {
          points: d.data.bullseye,
        };
        draw();
      })
      .on("mouseout", function(d) {
        d3.select(this)
        .attr('opacity', 0.8);
        draw();
      });

//double bullseye
const spider6 = circles
    .select('svg')
    .data(data_ready3)
    .enter()
    .append('path')
    .attr("d", d3.arc()
      .innerRadius(0)
      .outerRadius(r)
      )
      .attr('fill', d => {
        return heatColorsTreble(d.data.double_bullseye)
      })
    .attr('opacity', 0.8)
    .attr('transform', `translate(${width*.45}, ${height/2}) rotate (-9)`)
    .attr('stroke', "silver")
    .style('stroke-width', '1.5px')
    .on("mouseover", function(d) {
        d3.select(this)
        .attr('opacity', 1.0);
        state.hover = {
          points: d.data.double_bullseye,
        };
        draw();
      })
      .on("mouseout", function(d) {
        d3.select(this)
        .attr('opacity', 0.8);
        draw();
      });
    
//label arc
  const spider4text = circles
  .select('svg')
  .data(data_ready)
  .enter()
  .append("text")
  .attr("transform", function(d) 
     { const [x,y] = labelArc.centroid({...d, startAngle: d.startAngle - Math.PI/20, endAngle: d.endAngle - Math.PI/20});
      //console.log(d, labelArc.centroid(d))
       return `translate(${x + width*.45}, ${y + height/1.97})` 
        })
  .text(d => d.data.number_ID)
  .attr("fill", "white")
  .attr("z-index", 12)
  .show();


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
        <div>Points: ${state.hover.points}</div> `
      )
      .style("visibility", "visible");
  }
      
} 
    /** END DRAW FUNCTION */
    


} //export function
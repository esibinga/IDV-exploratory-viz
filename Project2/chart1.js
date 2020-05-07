export function chart1() {

//dartboard basic

/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.9,
  margin = { top: 20, bottom: 20, left: 60, right: 40 };

let svg;
let bullseyeTooltip;
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
    //console.log("data:", state.data);
    //console.log("data:", state.svgdata);
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
  // tooltip = container
  //   .append("div")
  //   .attr("class", "tooltip")
  //   .attr("width", 100)
  //   .attr("height", 100)
  //   .style("position", "absolute"); 

bullseyeTooltip = container
  .append("div")
  .attr("class", "tooltip")
  .attr("width", 100)
  .attr("height", 100)
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .style("background", "white")

  // var bullseyeTooltip = d3.select('h3')
  //   .append("div")
  //   .attr("x", 300)
  //   .attr("y", 300)
  //   .attr("width", width)
  //   .style("position", "absolute")
  //   .style("z-index", "10")
  //   .style("visibility", "hidden")
  //   .style("background", "white");
  
//dartboard container
  const svgContainer = d3.select("#d3-container-1.graph")
    .append("svg")
    .attr("width", width*.9)
    .attr("height", height*1.1);
  

// dartboard specs: https://www.dartsnutz.net/forum/showthread.php?tid=20982 //
const r = height/80;
circleData = [
  {"cx": width/2, "cy": height/2, "radius": 33*r, "inner_radius": 27.75*r, "value": "single"},  //this is actually just the background of the dartboard now
  //{ "cx": width/2, "cy": height/2, "radius": 26.75*r, "inner_radius": 18*r},
  //{ "cx": width/2, "cy": height/2, "radius": 17*r, "inner_radius": 3*r},
  //{"cx": width/2, "cy": height/2, "radius": r, "inner_radius": 0, "value": 50}
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
  .style("fill", "darkGreen")
  .style("stroke", "white");


// Use a pie chart to apply data (number values) to the arc data
const pie = d3.pie()
  .value(function(d) { return d.angle_value});
  (state.svgdata);

var labelArc = d3.arc()
	.outerRadius(33*r)
	.innerRadius(33*r);

var data_ready = pie(state.svgdata);
//console.log("pie", pie); //this is just the function
console.log("data_ready", data_ready);

// var bullseyeTooltip = d3.select('h3')
// .append("div")
// .attr("x", 300)
// .attr("y", 300)
// .attr("width", width)
// .style("position", "absolute")
// .style("z-index", "10")
// .style("visibility", "hidden")
// .style("background", "white");

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
      if (d.data.fill === "red") return "#120809"; //black
      else if (d.data.fill === "green") return "#feffc3"; // off-white
      else return "black";
    })
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
  })
  .on("click",  function(d) {
    console.log("bullseye tooltip", bullseyeTooltip)
    if (d.data.number_ID !== 20) return bullseyeTooltip
      .text("Try again!")
      .style("visibility", "visible")
    else if (d.data.number_ID === 20) return bullseyeTooltip
      .text("Gettin' really close")
      .style("visibility", "visible");
  });;

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
      if (d.data.fill === "red") return "#120809"; //black
      else if (d.data.fill === "green") return "#feffc3"; //off-white
      else return "black";
    })
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
  })
  .on("click",  function(d) {
    if (d.data.number_ID !== 20) return bullseyeTooltip
      .text("You can do better!")
      .style("visibility", "visible");
    else if (d.data.number_ID === 20) return bullseyeTooltip
      .text("Gettin' really close")
      .style("visibility", "visible");
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
    if (d.data.fill === "red") return "#e63328";
    else if (d.data.fill === "green") return "darkGreen";
    else return "black";
  })
  .attr('transform', `translate(${width/2}, ${height/2}) rotate (-9)`)
  .attr('stroke', 'silver')
  .style('stroke-width', '1.5px')
  .on("mouseover", function(d) {
    d3.select(this)
    state.hover = {
      points: d.data.treble,
    };
    draw();
  })
  .on("click",  function(d) {
  if (d.data.treble !== 60) return bullseyeTooltip
    .text("Not quite!")
    .style("visibility", "visible");
  else if (d.data.treble === 60) return bullseyeTooltip
    .text("You got it!!")
    .style("visibility", "visible");
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
    .attr('fill', d => {
        if (d.data.fill === "red") return "#e63328";
        else if (d.data.fill === "green") return "darkGreen";
        else return "black";
      })
    .attr('transform', `translate(${width/2}, ${height/2}) rotate (-9)`)
    .attr('stroke', 'silver')
    .style('stroke-width', '1.5px')
    .on("mouseover", function(d) {
      d3.select(this)
      //console.log("this", this)
      state.hover = {
        points: d.data.double,
      };
      //console.log(d.data.number_ID) //WOOHOO!!!!
      draw();
    })
    .on("click",  function(d) {
      console.log("bullseye tooltip", bullseyeTooltip)
      bullseyeTooltip.text("Interesting choice!"); 
        return bullseyeTooltip
      .style("visibility", "visible");
    });

// ad hoc dataset for bullseyes    
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
.attr('fill', 'darkGreen')
.attr('transform', `translate(${width/2}, ${height/2}) rotate (-9)`)
.attr('stroke', 'silver')
.style('stroke-width', '1.5px')
.on("mouseover", function(d) {
  d3.select(this)
  //console.log("this", this)
  state.hover = {
    points: d.data.bullseye,
  };
  //console.log(d.data.number_ID) //WOOHOO!!!!
  draw();
})
.on("click",  function(d) {
  console.log("bullseye tooltip", bullseyeTooltip)
  bullseyeTooltip.text("Oops, that's not it!"); 
    return bullseyeTooltip
    .style("visibility", "visible");
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
.attr('fill', '#e63328')
.attr('transform', `translate(${width/2}, ${height/2}) rotate (-9)`)
.attr('stroke', 'silver')
.style('stroke-width', '1.5px')
.on("mouseover", function(d) {
  d3.select(this)
  state.hover = {
    points: d.data.double_bullseye,
  };
  draw();
})
.on("click",  function(d) {
  console.log("bullseye tooltip", bullseyeTooltip)
  bullseyeTooltip.text("A common misconception!"); 
    return bullseyeTooltip
    .style("visibility", "visible");
  })
  ;

/*
spider6.append("text")
    .attr("x", 100)
    .attr("y", 100)
    .text("Oops, that's not it!")
    .on("click", function(d) {
      console.log("clicked on", this)  
      if(bullseyeClickFlag){
          tooltip.hide(d);
      }else{
          tooltip.show(d);
      }
      return bullseyeClickFlag = !bullseyeClickFlag
});
*/

//add numbers around dartboard -- doesn't work
spider4.append("text")
    .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
	  .text(d => d.data.number_ID)
  	.attr("fill", "white");


/*
    .attr('text-anchor', 'middle')
    .attr("x", function(d) {
      var a = d.startAngle + (d.endAngle - d.startAngle)/2; // - Math.PI/2;
      d.cx = Math.cos(a) * (25*r - 45);
      return d.x = Math.cos(a) * (25*r+30);
    })
    .attr("y", function(d) {
      var a = d.startAngle + (d.endAngle - d.startAngle)/2; // - Math.PI/2;
      d.cy = Math.sin(a) * (25*r - 45);
      return d.y = Math.sin(a) * (25*r + 30);
    })
    //.attr("x", 100)
    //.attr("y", 100)
    .text(d => d.data.number_ID)
    .attr('stroke', 'white')
    .attr('fill', 'white'); 
    */


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
    bullseyeTooltip
      .html(  
     //   <div>Mouse x: ${state.hover.mx}</div>
    //    <div>Mouse y: ${state.hover.my}</div>
    //   `<div>Points: ${state.hover.points}</div> `
      );
  }
  
} 
/** END DRAW FUNCTION */

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

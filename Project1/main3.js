//import { text } from "../lib/d3";

/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 2,
  height = window.innerHeight,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };

let svg;
let tooltip;

/**
 * APPLICATION STATE
 * */
let state = {
  directData: null,
  outlawData: null,
  hover: null,
  mousePosition: null,
};

/**
 * LOAD DATA
 * 
Promise.all([
    d3.csv("../data/direct_only.csv", d3.autotype),
    d3.csv("../data/outlaws.csv", d3.autotype),
]).then(([directData, outlawData]) => {
    state.directData = directData;
    state.outlawData = outlawData;
    console.log("directData:", state.directData);
    console.log("outlawData:", state.outlawData)
    init();
  });*/

  d3.csv("../data/direct_only.csv", d3.autotype).then(data => {
    state.directData = data;
    console.log("directData:", state.directData);
    init();
  });
    

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
  const container = d3.select("#d3-container").style("position", "relative");

  tooltip = container
    .append("div")
    .attr("class", "tooltip")
    .attr("width", 100)
    .attr("height", 100)
    .style("position", "absolute");

  svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const colorScale = d3.scaleOrdinal(d3.schemeSet3);

// write stratify function
  var stratify = d3.stratify()
    .id(function(d) { return d.INDI_ID; })
    .parentId(function(d) { return d.BiddleParent_ID; });
    (state.directData);

//console.log("stratify:", stratify) //this shows the function, no output yet
var root = stratify(state.directData); // this applies the stratify function to the data -- not working yet 
//console.log("root", root);

const tree = d3
    .tree()
    .size([width, height]);

tree(root);

const links = svg
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(root.links())
    .join("path")
    .attr("d", d3.linkVertical()
          .x(d => d.x)
          .y(d => d.y));

//console.log("links", links)

const leaf = svg
    .selectAll("g")
    .data(root.descendants())
    .join("g")
    .attr("transform", d => `translate(${d.x},${d.y})`);
    //console.log("root.descendants", root.descendants());


leaf
    .append("circle")
    .attr("fill", "blue")
    .attr("r", 3) 
    /*.on("mouseover", d => {
        state.hover = {
          first: d.directData.first,
         // last: d.directData.last,
          //value: d.data.value,
        };
        draw();
      })
    .on("mouseover", function(d) {
        //console.log("this", this);
        d3.select(this)
          .attr("fill", "yellow")
          .attr("r", 8);
        state.hover["First"] = d['first'];
        draw();
      })*/
      .on("mouseover", function(d) {
          d3.select(this)
            .attr("fill", "orange")
            .attr("r", 8);
         state.hover = {
            first: d.state.directData.first, //i think this problem is coming from having two datasets loaded in
            last: d.state.directData.last, //might make more sense to do it like tutorial 5 w/ hover instead of tooltip?
            DOB: d.state.directData.DOB
         };
         draw();
      })
      .on("mouseout", function(d) {
        d3.select(this)
        .attr("r", 3)
        .attr("fill", "blue");
        draw();
      });


const spouse = d3.selectAll("g") //this puts a yellow circle on all leaves
    .append("circle")
    .data(state.directData)
    //.attr("fill", "yellow")
    .attr("r", 3)
    .attr("transform", `translate(5,0)`)
    .attr("fill", d => {
        if (d.fill_spouse === "1") return "yellow";
        else if (d.fill_spouse === "0" ) return "clear";
        else return "red";
      })    
      .attr("stroke", d => {
        if (d.fill_spouse === "1") return "#555";
        else if (d.fill_spouse === "0" ) return "none";
        else return "red";
      });
;



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
        <div>First Name: ${state.hover.first}</div>
        <div>Last Name: ${state.hover.last}</div>
        <div>DOB: ${state.hover.DOB}</div>
      `
      )
      .transition()
      .duration(500);
      //.style(
      //  "transform",
      //  `translate(${state.hover.translate[0]}px,${state.hover.translate[1]}px)`
      //);
  }
}


/* fix tooltip next to see if people are correctly aligned -- addison is on the right now, but maybe spouses are wrong?*/
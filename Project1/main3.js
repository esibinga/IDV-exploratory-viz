//import { text } from "../lib/d3";

/**
 * CONSTANTS AND GLOBALS
 * */
let svg;
let tooltip;

const width = window.innerWidth * .9,
  height = window.innerHeight * .9,
  margin = { top: 20, bottom: 20, left: 20, right: 40 },
  default_selection = "None Selected",
  radius = 4,
  hover_radius = 7;
  

/**
 * APPLICATION STATE
 * */
let state = {
  directData: [],
  hover: null,
  mousePosition: null,
  selection: null,
};

/**
 * LOAD DATA
 **/

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

const selectElement = d3.select("#dropdown").on("change", function() {
        console.log("new selection is", this.value);
        state.selection = this.value
        //console.log("new value is", this.value);
        draw(); // re-draw the graph based on this new selection
      });
    
selectElement
      .selectAll("option")
      .data([default_selection, ...Array.from(new Set(state.directData.map(d => d.last)))])
      .join("option")
      .attr("value", d => d)
      .text(d => d);

const container = d3
     .select("#d3-container")
     .style("position", "relative");

tooltip = container
    .append("div")
    .attr("class", "tooltip")
    .attr("width", 100)
    .attr("height", 100)
    .style("position", "fixed");

svg = container
    .append("svg")
    .attr("width", width*1.03)
    .attr("height", height*1.0)
    .attr("position", "relative")
    .attr("viewBox", [0,0, width, height])
    .attr("preserveAspectRatio", "none");

// write stratify function
var stratify = d3.stratify()
    .id(function(d) { return d.INDI_ID; })
    .parentId(function(d) { return d.BiddleParent_ID; });
    (state.directData);

var root = stratify(state.directData); // this applies the stratify function to the data
//console.log("root", root.children);

const tree = d3
    .tree()
    .size([width, height*.97]);

tree(root);

//add links
const links = svg
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-opacity", 0.5)
    .attr("stroke-width", 1)
    .selectAll("path")
    .data(root.links())
    .join("path")
    .attr("d", d3.linkVertical()
          .x(d => d.x)
          .y(d => d.y + 9));

//add direct descendants
const leaf = svg
    .selectAll("g")
    .data(root.descendants())
    .join("g")
    .attr("transform", //d => `translate(${d.x-2},${d.y + 9})`);

    d => {
      if (d.data.fill_spouse === "1") return `translate(${d.x-2},${d.y + 12})`;
      else if (d.data.fill_spouse === "0" ) return `translate(${d.x},${d.y + 12})`;
      else return "red";
    }) 
    //console.log("root.descendants", root.descendants());

    
// Add all direct descendants 
leaf
    .append("circle")
    .attr("class", "direct")
    .attr("fill", "steelblue")
    .attr("r", radius) 
    .attr("opacity", 1) 
    .on("mouseover", function(d) {
        state.hover = {
          first: d.data.first,
          last: d.data.last,
          DOB: d.data.DOB,
          DOD: d.data.DOD,
        };
        d3.select(this)
            .attr("fill", "blue")
            .attr("r", hover_radius);
         draw();
      }) 
    .on("mouseout", function(d) {
        d3.select(this)
        .attr("r", radius)
        .attr("fill", "steelblue")
        .attr("opacity", 1);
        draw();
    });
    

//add spouses
leaf
    .append("circle")
    .attr("class", "spouse")
    .attr("r", radius) 
    .attr("opacity", 1)
    .attr("transform", `translate(5,0)`) 
    .on("mouseover", function(d) {
        state.hover = {
          first: d.data.spouse_first,
          last: d.data.spouse_last,
          DOB: d.data.spouse_DOB,
          DOD: d.data.spouse_DOD,
        };
        d3.select(this)
            .attr("fill", d => {
              if (d.data.fill_spouse === "1") return "orange";
              else if (d.data.fill_spouse === "0" ) return "clear";
              else return "red";
            })    
            .attr("r", hover_radius);
         draw();
      })
    .on("mouseout", function(d) {
        d3.select(this)
        .attr("r", radius)
        .attr("fill", d => {
          if (d.data.fill_spouse === "1") return "yellow";
          else if (d.data.fill_spouse === "0" ) return "clear";
          else return "red";
        })    
        .attr("opacity", 1);
        draw();
      }) 
    .attr("fill", d => {
        if (d.data.fill_spouse === "1") return "yellow";
        else if (d.data.fill_spouse === "0" ) return "clear";
        else return "red";
      })    
      .attr("stroke", d => {
        if (d.data.fill_spouse === "1") return "white";
        else if (d.data.fill_spouse === "0" ) return "none";
        else return "red";
      });

  draw(); // calls the draw function

    }
/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {

//slider
d3.select("input[type=range]#myRange").on ("input", function() {
    slider_width = this.value
    //console.log("state.slider_width", this.value)
    d3.select("output#myRange")
    d3.selectAll("svg")
     .attr("width", window.innerWidth*slider_width)
     .attr("height", window.innerHeight*slider_width)
    });

// tooltip & hover data
  if (state.hover) {
    tooltip
      .html(`
        <div>Name: ${state.hover.first} ${state.hover.last}</div>
        <div>Date of Birth: ${state.hover.DOB}</div> 
        <div>Date of Death: ${state.hover.DOD}</div>
      `)
      .transition()
      .duration(500);
  }

//re-do stratify and tree data to access it in draw()
  var stratify = d3.stratify()
      .id(function(d) { return d.INDI_ID; })
      .parentId(function(d) { return d.BiddleParent_ID; });
      (state.directData);

    var root = stratify(state.directData); // this applies the stratify function to the data
   // console.log("desc", root.descendants());

const tree = d3
    .tree()
    .size([window.innerWidth*width, height]);
   
tree(root);

// make filtered dataset on selection
let filteredData = root.descendants();  //****this was the big step!! not state.direct data, but already stratified data//state.directData;
  if (state.selection !== "None Selected") {
    filteredData = root.descendants().filter(d => d.data.last === state.selection || d.data.spouse_last === state.selection); //add OR d.data.spouse_last
  }
console.log("fd", filteredData)

//update direct descendant nodes
const leaf1 = svg
  .selectAll(".direct") 
  .data(filteredData, d => d.id)
  .join(
    enter =>
    enter
    .append("circle")
    .attr("transform", d => `translate(${d.x},${d.y + 5})`)
    .attr("class", "direct")
    .attr("opacity", 1.0)
    .call(enter => 
      enter
        .transition()
        //.duration(1000)
        .attr("opacity", 1.0)
        ),
    update =>
    update
      .call(update =>
        update
          .transition()
          .duration(1000)
          .attr("opacity", 1.0)
          .attr("r", function(d) {
            if (d.data.last !== state.selection) return radius;
            else return hover_radius
          })
          .attr("stroke", "white")
          .attr("stroke-width", function(d) {
            if (d.data.last !== state.selection) return 1;
            else return 3
          })
  ),
    exit =>
    exit.call(exit =>
      exit
        .transition()
        .delay(500)
        .duration(500)
        .attr("opacity", 0.75)
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr("fill", "steelblue")
        .attr("r", radius)
      ));
  console.log("leaf1", leaf1);

//update spouse nodes
const spouse1 = svg
  .selectAll(".spouse") 
  .data(filteredData, d => d.id)
  .join(
    enter =>
    enter
    .append("circle")
    .attr("transform", d => `translate(${d.x},${d.y + 5})`)
    .attr("class", "spouse")
    .attr("opacity", 1.0)
    .call(enter => 
      enter
        .transition()
        .duration(1000)
        .attr("opacity", 1.0)
        ),
    update =>
    update
      .call(update =>
        update
          .transition()
          .duration(1000)
          .attr("r", hover_radius)
          .attr("opacity", 1.0)
          .attr("stroke", function(d) {
            if (d.data.fill_spouse === "1") return "white";
            else return "transparent"
          })
          .attr("stroke-width", function(d) {
            if (d.data.spouse_last === state.selection) return 5;
            else return 1
          })
          .attr("fill", function(d) {
              if (d.data.fill_spouse === "1") return "yellow";
              else return "transparent"
            })
          .attr("r", function(d) {
            if (d.data.spouse_last === state.selection) return hover_radius;
            else return radius
          })  
  ),
    exit =>
    exit.call(exit =>
      exit

        .transition()
        .delay(500)
        .duration(500)
        .attr("opacity", 0.75)
        .attr("stroke", function(d) {
          if (d.data.fill_spouse === "1") return "white";
          else return "transparent"
        })  
        .attr("stroke-width", 1)
        .attr("r", radius)
        .attr("fill", function(d) {
          if (d.data.fill_spouse === "1") return "yellow";
          else return "transparent"
        })
      ));
}

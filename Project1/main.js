/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };

let svg;
let tooltip;

/**
 * APPLICATION STATE
 * */
let state = {
  data: null,
  hover: null,
  mousePosition: null,
};

/**
 * LOAD DATA
 * */
d3.json("../../data/JGB_MHB.json", d3.autotype).then(data => {
  state.data = data;
  console.log("data1:", data);
  init();
});


/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
    const container = d3.select("#d3-container"); //.style("position", "relative");
  
    svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
    const colorScale = d3.scaleOrdinal(d3.schemeSet3); //why is this placed here?
  
    // + INITIALIZE TOOLTIP IN YOUR CONTAINER ELEMENT
    tooltip = container
      .append("div") 
      .attr("class", "tooltip") //give it tooltip class
      .attr("width", 100)
      .attr("height", 100)
      .style("position", "absolute");
  
    // + CREATE YOUR ROOT/NODE HIERARCHY NODE
    const root = d3
      .hierarchy(state.data, d => d.children)
      .count(); //set the data source
  
    console.log("data:", state.data)
    console.log("root:", root)
  
    // + CREATE YOUR LAYOUT GENERATOR
    const tree = d3
      .tree()
      .size([width, height]); //it's going to take up the full page width
      
      
    // + CALL YOUR LAYOUT FUNCTION ON YOUR ROOT/NODE DATA
    tree(root);

    // + CREATE YOUR GRAPHICAL ELEMENTS
    const leaf = svg
      .selectAll("g")
      .data(root.descendants()) //root is sourced from state.data, and each "leaf" of root is ____? value?
      .join("g")
      .attr("transform", d => `translate(${d.x}, ${d.y})`);
  
    leaf
      .append("circle") //this will be a circle!!
      .attr("fill", "red")
      .attr("r", 10)    
      .attr("width", d => d.x)//1 - d.x0)
      .attr("height", d => d.y);//1 - d.y0);
      
      
  console.log("leaf:", leaf)

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
          <div>Name: ${state.hover.name}</div>
          <div>Value: ${state.hover.value}</div>
          <div>Hierarchy Path: ${state.hover.title}</div>
        `
        )
        .transition()
        .duration(500)
        .style(
          "transform",
          `translate(${state.hover.translate[0]}px,${state.hover.translate[1]}px)`
        );
    }
  }

/**

https://github.com/tmcw/parse-gedcom


**/

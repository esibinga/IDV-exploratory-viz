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
 * this will be run one time when the data finishes loading in
 * */
function init() {
    const container = d3.select("#d3-container");
  
    svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
// not using a tooltip yet but keeping it here for later
    tooltip = container
      .append("div") 
      .attr("class", "tooltip")
      .attr("width", 100)
      .attr("height", 100)
      .style("position", "absolute");
  
// + CREATE YOUR ROOT/NODE HIERARCHY NODE
    const root = d3
      //.hierarchy(state.data, d => d.children)
      .hierarchy({ id: null, tree: state.data.nodes }, d => d.tree)
      .count(); //set the data source
  
    console.log("data:", state.data) //this looks good
    console.log("root:", root) //this looks good
  
// + CREATE YOUR LAYOUT GENERATOR
    const tree = d3
      .tree()
      .size([width, height]);
      
      
    // + CALL YOUR LAYOUT FUNCTION ON YOUR ROOT/NODE DATA
    tree(root);

    // + CREATE YOUR GRAPHICAL ELEMENTS
    const leaf = svg //*** .data looks like the source of the problem -- only one svg is created, not a group */
      .selectAll("g")
      .data(root.descendants()) //each svg is supposed to be the final descendant of root. Leaf (any node without children) seems like it should work too, but neither has worked yet
      .join("g")
      .attr("transform", d => `translate(${d.x}, ${d.y})`);
  
    leaf
      .append("circle")
      .attr("fill", function(d) {
        var returnColor;
        var idString = new RegExp('@P\d\d\d@');
        //console.log(d.data.tag);
        if (d.data.tag == "NAME") { returnColor = "blue";
        //} else if (d.data.tag == "NAME") {returnColor = "orange";
        } else if (d.data.id == '@P1@') {returnColor = "yellow"; //this also works, but it looks like @P##@ are all in the first generation
        //} else if (d.data.id == '@P3@') {returnColor = "red";
        } else {returnColor = "none"}
        return returnColor;})
      .attr("r", 10)    
      .attr("width", d => d.x)
      .attr("height", d => d.y);
      
      
  console.log("leaf:", leaf) //this only has one element in it

    draw(); // call the draw function
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

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
      .hierarchy({ id: null, tree: state.data.nodes }, d => d.tree) //right now it looks like the 5 generations are levels of data for each person, not each svg corresponding to the "end point" of a genealogical path
      .count(); //can I set the end point of the path manually? or semi-manually?
  
    console.log("data:", state.data)
    console.log("root:", root)
  
// + CREATE YOUR LAYOUT GENERATOR
    const tree = d3
      .tree()
      .size([width, height]);
      
      
    // + CALL YOUR LAYOUT FUNCTION ON YOUR ROOT/NODE DATA
    tree(root);

    // + CREATE YOUR GRAPHICAL ELEMENTS
    const leaf = svg
      .selectAll("g")
      .data(root.descendants()) //each svg is supposed to be the final descendant of root. Leaf (any node without children) seems like it should work too, but neither has worked yet
      .join("g")
      .attr("transform", d => `translate(${d.x}, ${d.y})`);
  
    leaf
      .append("circle")
      .attr("fill", function(d) {
        var returnColor;
        var idString = new RegExp('@P\d\d\d@');
        //console.log(d.data);
        if (d.data.tag == "NAME") { returnColor = "blue";
        } else if (d.data.tag == "FAM") {returnColor = "red";
        } else if (d.data.tag == "INDI") {returnColor = "purple";
        } else if (d.data.id == '@P1@') {returnColor = "yellow"; // @P1@ is the first person in this tree -- makes sense to see it top left
        } else if (d.data.value < 100) {returnColor = "orange"; // @P125@ is a person much farther down the free, but this dot is showing up farther along the gen. 1 row, not down a level or two
        } else {returnColor = "green"}
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

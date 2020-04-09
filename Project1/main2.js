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
    //const force = d3
   // .forceSimulation(state.data.nodes)  


    const root = d3.hierarchy(state.data, d => d.children);
   // const links = root.links();
    const nodes = root.descendants();
  
    const simulation = d3.forceSimulation(state.data.nodes)
        //.force("link", d3.forceLink(links).id(d => d.id).distance(0).strength(1))
        .force("charge", d3.forceManyBody().strength(-50))
        .force("x", d3.forceX())
        .force("y", d3.forceY());
  
    const svg = d3.create("svg")
        .attr("viewBox", [-width / 2, -height / 2, width, height]);
  
   /* const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line");
  */
    const node = svg.append("g")
        .attr("fill", "#fff")
        .attr("stroke", "#000")
        .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
        .attr("fill", d => d.children ? null : "#000")
        .attr("stroke", d => d.children ? null : "#fff")
        .attr("r", 3.5)
        .call(drag(simulation));
  
    node.append("title")
        .text(d => d.data.name);
  
    simulation.on("tick", () => {
      link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);
  
      node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);
    });




   // console.log("data:", state.data)
  //  console.log("root:", root)
  
// + CREATE YOUR LAYOUT GENERATOR
   /* const tree = d3
      .tree()
      .size([width, height]);
      
      
    // + CALL YOUR LAYOUT FUNCTION ON YOUR ROOT/NODE DATA
    tree(root);

    // + CREATE YOUR GRAPHICAL ELEMENTS
    const leaf = svg
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("transform", d => `translate(${d.x}, ${d.y})`);
  
    leaf
      .append("circle")
      .attr("fill", function(d) {
        var returnColor;
        // var idString = new RegExp('@P\d\d\d@'); //didn't end up needing this, can use "INDI" instead of regex
        //console.log(d.data); //this or (d.data.tag) are helpful
       if (d.data.tag == "NAME") { returnColor = "blue";
        } else if (d.data.tag == "FAM") {returnColor = "red"; //FAM = family (corresponding node has a family id tag, ex: @F21@)
        } else if (d.data.tag == "INDI") {returnColor = "purple"; //INDI = individual (corresponding node has an individual id tag, ex:  @P44@)
        } else if (d.data.id == '@P1@') {returnColor = "yellow"; // @P1@ is the first person in this tree -- makes sense to see it top left
        } else if (d.data.id == '@P125') {returnColor = "orange"; // @P125@ is a person much farther down the free, but this dot is showing up farther along the gen. 1 row, not down a level or two
        } else {returnColor = "green"}
        return returnColor;})
      .attr("r", 10)    
      .attr("width", d => d.x)
      .attr("height", d => d.y);
      
      
  console.log("leaf:", leaf)
*/
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
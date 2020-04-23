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
d3.csv("../../data/JGB_MHB.csv", d3.autotype).then(data => {
  state.data = data;
  console.log("data1:", data);
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

  var nestedData = d3.nest()
  .key(function(d) { return d.INDI_mother; })
  .key(function(d) { return d.INDI_ID; })
  .entries(data);
  console.log("nestedData:", nestedData);

  // make hierarchy
  const root = d3
    .hierarchy(state.data) // children accessor
    .sum(d => d.value) // sets the 'value' of each level
    .sort((a, b) => b.value - a.value);

  // make treemap layout generator
  const tree = d3
    .treemap()
    .size([width, height])
    .padding(1)
    .round(true);

  // call our generator on our root hierarchy node
  tree(root); // creates our coordinates and dimensions based on the heirarchy and tiling algorithm

  // create g for each leaf
  const leaf = svg
    .selectAll("g")
    .data(root.leaves())
    .join("g")
    .attr("transform", d => `translate(${d.x0},${d.y0})`);

  leaf
    .append("rect")
    .attr("fill", d => {
      const level1Ancestor = d.ancestors().find(d => d.depth === 1);
      return colorScale(level1Ancestor.data.name);
    })
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .on("mouseover", d => {
      state.hover = {
        translate: [
          // center top left corner of the tooltip in center of tile
          d.x0 + (d.x1 - d.x0) / 2,
          d.y0 + (d.y1 - d.y0) / 2,
        ],
        name: d.data.name,
        value: d.data.value,
        title: `${d
          .ancestors()
          .reverse()
          .map(d => d.data.name)
          .join("/")}`,
      };
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
 * INITIALIZING FUNCTION
 * this will be run one time when the data finishes loading in
 * */ /*
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

  
// + CREATE YOUR ROOT/NODE HIERARCHY NODE

var table = d3.csvParse(text);
console.log("table", table)




 const root = d3.hierarchy(state.data, d => d.children);
   // const links = root.links();
 const nodes = root.descendants();
  

  const svg = d3.create("svg")
   .attr("viewBox", [-width / 2, -height / 2, width, height]);
  

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
*/ /*
    draw(); // call the draw function
  }
  
/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */ /*
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

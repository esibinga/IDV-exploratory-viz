//import { text } from "../lib/d3";

/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 1.8,
  height = window.innerHeight * .9,
  margin = { top: 20, bottom: 20, left: 60, right: 40 };
  default_selection = "All";

let svg;
let tooltip;
let leaf;
let familyFilter;
let tree;
let container;

/**
 * APPLICATION STATE
 * */
let state = {
  directData: [],
  hover: null,
  mousePosition: null,
  selection: "All"
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
    .attr("height", height*1.1)
    .attr("position", "absolute");

// write stratify function
var stratify = d3.stratify()
    .id(function(d) { return d.INDI_ID; })
    .parentId(function(d) { return d.BiddleParent_ID; });
    (state.directData);

var root = stratify(state.directData); // this applies the stratify function to the data
//console.log("root", root.children);

const tree = d3
    .tree()
    .size([width, height]);

tree(root);

//add links
const links = svg
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-opacity", 0.5)
    .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(root.links())
    .join("path")
    .attr("d", d3.linkVertical()
          .x(d => d.x)
          .y(d => d.y + 5));

//add direct descendants
const leaf = svg
    .selectAll("g")
    .data(root.descendants())
    .join("g")
    .attr("transform", d => `translate(${d.x-2},${d.y + 5})`);
    //console.log("root.descendants", root.descendants());

    
// Add all direct descendants 
leaf
    .append("circle")
    .attr("class", "direct")
    .attr("fill", "steelblue")
    .attr("r", 3) 
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
            .attr("r", 5);
         draw();
      }) 
    .on("mouseout", function(d) {
        d3.select(this)
        .attr("r", 3)
        .attr("fill", "steelblue")
        .attr("opacity", 1);
        draw();
    });
    

//add spouses
leaf
    .append("circle")
    .attr("class", "spouse")
    .attr("r", 3) 
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
            .attr("fill", "orange")
            .attr("r", 5);
         draw();
      })
    .on("mouseout", function(d) {
        d3.select(this)
        .attr("r", 3)
        .attr("fill", "yellow")
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
  if (state.hover) {
    tooltip
      .html(
        `
        <div>Name: ${state.hover.first} ${state.hover.last}</div>
        <div>Date of Birth: ${state.hover.DOB}</div> 
        <div>Date of Death: ${state.hover.DOD}</div>
      `
      )
      .transition()
      .duration(500);
  }

//re-draw whole map but use filter data to color the dots
let filteredData = state.directData;
  if (state.selection !== "All") {
    filteredData = state.directData.filter(d => d.last === state.selection);
  }

console.log("fd", filteredData)

var stratify = d3.stratify()
    .id(function(d) { return d.INDI_ID; })
    .parentId(function(d) { return d.BiddleParent_ID; });
    (state.directData);

var root = stratify(state.directData); // this applies the stratify function to the data
//console.log("desc", root.descendants.children);

const tree = d3
    .tree()
    .size([width, height]);

tree(root);

// const leaf = svg
//     .selectAll("g")
//     .data(root.descendants())
//     .join("g")
//     .attr("transform", d => `translate(${d.x-2},${d.y + 5})`);
//     //console.log("root.descendants", root.descendants());


const leaf1 = svg
  .selectAll("g") //can i do selectAll("g") who match filtered data AND then later selectAll (children of these nodes)?
  .data(filteredData, d => d.INDI_ID)
  .join(
    enter =>
  // .enter()
    enter.append("circle")
    //.text(d => d.INDI_ID)
    .data(root.descendants())
    .attr("transform", d => `translate(${d.x-2},${d.y + 5})`)
    .attr("class", "direct")
    .attr("fill", "transparent")
    .attr("r", 4)
    .attr("stroke", "black")
    .on("mouseover", function(d) {
      state.hover = {
        first: d.data.first,
        last: d.data.last,
        DOB: d.data.DOB,
        DOD: d.data.DOD,
      };
      d3.select(this)
          .attr("fill", "blue")
          .attr("r", 5);
      draw();
    }) 
    .on("mouseout", function(d) {
    d3.select(this)
    .attr("r", 3)
    .attr("fill", "steelblue")
    .attr("opacity", 1);
    draw();
    })
      .call( enter => 
        enter
          .transition()
          .duration(500)
          ),
    update =>
    update
            .call(update =>
            update
                .transition()
                .duration(500)
                .transition()
                .duration(1000)
                .attr("stroke", "red")
                .attr("fill", "red")
        ),
    exit =>
    exit) //.remove())


    .call(
      selection =>
      selection
        .transition()
        .duration(500)
    );
  console.log("leaf1", leaf1);
    //.call(selection)


 /*
leaf1
  .append("circle")
  .attr("class", "direct")
  .attr("fill", "red")
  .attr("r", 4)
  .attr("stroke", "transparent")
  //.join("g")
  //.attr("transform", d => `translate(${d.x-2},${d.y + 5})`)
 .attr("fill", d => {
    if (d.last === "Adamy") return "#a6cee3";
    else if (d.last === "Biddle") return "#1f78b4";
    else if (d.last === "Bradbeer") return "#b2df8a";
    else if (d.last === "Buck") return "#33a02c";
    else if (d.last === "Carr") return "#fb9a99";
    else if (d.last === "Castanos") return "#e31a1c";
    else if (d.last === "Cipparrone") return "#fdbf6f";
    else if (d.last === "Cook") return "#ff7f00";
    else if (d.last === "DeCandia") return "#cab2d6";
    else if (d.last === "Favret") return "#6a3d9a";
    else if (d.last === "Gennusa") return "#a6cee3";
    else if (d.last === "Gosselink") return "#1f78b4";
    else if (d.last === "Graham") return "#b2df8a";
    else if (d.last === "Griesser") return "#33a02c";
    else if (d.last === "Heavenrich") return "#fb9a99";
    else if (d.last === "Herrin") return "#e31a1c";
    else if (d.last === "Hetzel") return "#fdbf6f";
    else if (d.last === "Hilker") return "#ff7f00";
    else if (d.last === "Holt") return "#cab2d6";
    else if (d.last === "James") return "#6a3d9a";
    else if (d.last === "Johannes") return "#1f78b4";
    else if (d.last === "Ma") return "#b2df8a";
    else if (d.last === "Mannka") return "#33a02c";
    else if (d.last === "McCarthy") return "#fb9a99";
    else if (d.last === "McDonald") return "#e31a1c";
    else if (d.last === "Partridge") return "#fdbf6f";
    else if (d.last === "Penfield") return "#ff7f00";
    else if (d.last === "Perez") return "#cab2d6";
    else if (d.last === "Rubenstein") return "#6a3d9a";
    else if (d.last === "Sanders") return "#a6cee3";
    else if (d.last === "Sibinga") return "#1f78b4";
    else if (d.last === "Sinclair") return "#b2df8a";
    else if (d.last === "Smith") return "#33a02c";   
    else if (d.last === "Titcomb") return "#cab2d6";
    else if (d.last === "Weber") return "#6a3d9a";
    else if (d.last === "Yarnall") return "#a6cee3";
    else return "black";
  }) 
  .on("mouseover", function(d) {
              state.hover = {
                first: d.data.first,
                last: d.data.last,
                DOB: d.data.DOB,
                DOD: d.data.DOD,
              };
              d3.select(this)
                  .attr("fill", "blue")
                  .attr("r", 5);
              draw();
            }) 
          .on("mouseout", function(d) {
              d3.select(this)
              .attr("r", 3)
              .attr("fill", "steelblue")
              .attr("opacity", 1);
              draw();
          });
  console.log("leaf1", leaf1)
  */
  //"", "Gosselink", "Graham", "Griesser", "Heavenrich",
  // "Herrin", "Hetzel", "Hilker", "Holt", "", "", "", "", "",
  // "", "", "", "Perez", "Rubenstein", "", "Sibinga", "Sinclair",
  // "Smith", "Titcomb", "Weber", "Yarnall"


// const node = state.directData.INDI_ID;

// const filteredLeaf = svg
//   .selectAll("g")
//   .data(filteredData)
//   .join("g")
//   .attr("transform", d => `translate(${d.x-2},${d.y + 5})`)
//   .attr("fill", d=> {
//     if (d.last === "Adamy") return "#a6cee3";
//     else if (d.last === "Biddle") return "#1f78b4";
//     else if (d.last === "Bradbeer") return "#b2df8a";
//     else if (d.last === "Buck") return "#33a02c";
//     else if (d.last === "Carr") return "#fb9a99";
//     else if (d.last === "Castanos") return "#e31a1c";
//     else if (d.last === "Cipparrone") return "#fdbf6f";
//     else if (d.last === "Cook") return "#ff7f00";
//     else if (d.last === "DeCandia") return "#cab2d6";
//     else if (d.last === "Favret") return "#6a3d9a";
//     else return "black";
//   });
  //console.log("root.descendants", node.descendants());

// const dot = svg
//   .selectAll(".direct")
//   .data(filteredData, d => d.INDI_ID)
//   .join(
//     enter => 
//     enter
//       .append("circle")
//       .attr("class", "direct")
//       .attr("transform", d => `translate(${d.order_column},${d.order_column})`)
//       .attr("fill", d=> {
//         if (d.last === "Adamy") return "#a6cee3";
//         else if (d.last === "Biddle") return "#1f78b4";
//         else if (d.last === "Bradbeer") return "#b2df8a";
//         else if (d.last === "Buck") return "#33a02c";
//         else if (d.last === "Carr") return "#fb9a99";
//         else if (d.last === "Castanos") return "#e31a1c";
//         else if (d.last === "Cipparrone") return "#fdbf6f";
//         else if (d.last === "Cook") return "#ff7f00";
//         else if (d.last === "DeCandia") return "#cab2d6";
//         else if (d.last === "Favret") return "#6a3d9a";
//         else return "black";
//       })
//       .attr("r", 3) 
//       .attr("opacity", 1) 
//       .on("mouseover", function(d) {
//           state.hover = {
//             first: d.data.first,
//             last: d.data.last,
//             DOB: d.data.DOB,
//             DOD: d.data.DOD,
//           };
//           d3.select(this)
//               .attr("fill", "blue")
//               .attr("r", 5);
//           draw();
//         }) 
//       .on("mouseout", function(d) {
//           d3.select(this)
//           .attr("r", 3)
//           .attr("fill", "steelblue")
//           .attr("opacity", 1);
//           draw();
//       })
//       .call(enter =>
//         enter
//           .transition()
//           .delay(d => 200 * d.date)
//           .duration(500)
//           .attr("opacity", 0.5)
//       ), 
//        update => 
//        update,
//        exit =>
//       exit)
//       .call(
//         selection =>
//         selection
//           .transition() // initialize transition
//           .duration(1000) 
//       );

}


// const links = svg
//   .selectAll("path")
//   .data(root.links())
//   .join("path")
//   .attr("fill", "none")
//   .attr("stroke", "white")
//   .attr("stroke-opacity", 0.4)
//   .attr("stroke-width", 1.5)
//   .attr("d", d3.linkVertical()
//         .x(d => d.x)
//         .y(d => d.y + 5));



    // .attr("fill", d=> {
    //   if (d.data.last === "Adamy") return "#a6cee3";
    //   else if (d.data.last === "Biddle") return "#1f78b4";
    //   else if (d.data.last === "Bradbeer") return "#b2df8a";
    //   else if (d.data.last === "Buck") return "#33a02c";
    //   else if (d.data.last === "Carr") return "#fb9a99";
    //   else if (d.data.last === "Castanos") return "#e31a1c";
    //   else if (d.data.last === "Cipparrone") return "#fdbf6f";
    //   else if (d.data.last === "Cook") return "#ff7f00";
    //   else if (d.data.last === "DeCandia") return "#cab2d6";
    //   else if (d.data.last === "Favret") return "#6a3d9a";
    //   else return "black";
    // })


      //   "All", "Adamy", "Biddle", "Bradbeer", "Buck", "Carr", "Castanos", "Cipparrone",
      // "Cook", "DeCandia", "Favret", "Gennusa", "Gosselink", "Graham", "Griesser", "Heavenrich",
      // "Herrin", "Hetzel", "Hilker", "Holt", "James", "Johannes", "Ma", "Mannka", "McCarthy",
      // "McDonald", "Partridge", "Penfield", "Perez", "Rubenstein", "Sanders", "Sibinga", "Sinclair",
      // "Smith", "Titcomb", "Weber", "Yarnall"
      

      // const slider = d3
//     .sliderBottom()
//     .min(window.innerWidth)
//     .max(window.innerWidth*2)
//     .width(500)
//     .default(window.innerWidth*1.2);
//     //.on('onchange', "soemthing")
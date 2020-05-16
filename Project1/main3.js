//import { text } from "../lib/d3";

/**
 * CONSTANTS AND GLOBALS
 * */
let svg;
let tooltip;
let leaf;
let familyFilter;
let tree;
let container;
let root;
let stratify;
let slider;
let slider_width;

const width = window.innerWidth * .9,
  height = window.innerHeight * .9,
  margin = { top: 20, bottom: 20, left: 60, right: 40 };
  default_selection = "All";

/**
 * APPLICATION STATE
 * */
let state = {
  directData: [],
  hover: null,
  mousePosition: null,
  selection: null,
  slider: 0.9
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
    .attr("position", "relative");

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
    .attr("stroke-opacity", 0.3)
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
            .attr("fill", d => {
              if (d.data.fill_spouse === "1") return "orange";
              else if (d.data.fill_spouse === "0" ) return "clear";
              else return "red";
            })    
            .attr("r", 5);
         draw();
      })
    .on("mouseout", function(d) {
        d3.select(this)
        .attr("r", 3)
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
    //var slider_width;
    slider_width = this.value
    console.log("slider_width", this.value)
    d3.select("output#myRange")
      .text(d3.format(".2f")(slider_width));
      //return slider_width;
      d3.selectAll("svg")
      .attr("width", window.innerWidth*slider_width)
    });
console.log("slider width after function", slider_width)

// tooltip & hover data
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

//re-do stratify and tree data to access it in draw()
  var stratify = d3.stratify()
      .id(function(d) { return d.INDI_ID; })
      .parentId(function(d) { return d.BiddleParent_ID; });
      (state.directData);

    var root = stratify(state.directData); // this applies the stratify function to the data
    console.log("desc", root.descendants());

const tree = d3
    .tree()
    .size([window.innerWidth*slider_width, height]);
    console.log("slider width here", slider_width)

tree(root);

// make filtered dataset on selection
let filteredData = root.descendants();  //****this was the big step!! not state.direct data, but already stratified data//state.directData;
  if (state.selection !== "All") {
    filteredData = root.descendants().filter(d => d.data.last === state.selection || d.data.spouse_last === state.selection); //add OR d.data.spouse_last
  }
console.log("fd", filteredData)

//update direct descendant nodes
const leaf1 = svg
  .selectAll(".direct") //can i do selectAll("g") who match filtered data AND then later selectAll (children of these nodes)?
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
            if (d.data.last !== state.selection) return 6;
            else return 5
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
        .attr("r", 3)
      ));
  console.log("leaf1", leaf1);

//update spouse nodes
const spouse1 = svg
  .selectAll(".spouse") //can i do selectAll("g") who match filtered data AND then later selectAll (children of these nodes)?
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
          .attr("r", 5)
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
            if (d.data.spouse_last === state.selection) return 6;
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
        .attr("stroke", function(d) {
          if (d.data.fill_spouse === "1") return "white";
          else return "transparent"
        })  
        .attr("stroke-width", 1)
        .attr("r", 3)
        .attr("fill", function(d) {
          if (d.data.fill_spouse === "1") return "yellow";
          else return "transparent"
        })
      ));
}











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
          //d => {
          //   if (d.data.last === "Adamy") return "gray";
          //   else if (d.last === "Biddle") return "red";
          //   else if (d.data.last === "Bradbeer") return "gray";
          //   else if (d.data.last === "Buck") return "gray";
          //   else if (d.data.last === "Carr") return "gray";
          //   else if (d.data.last === "Castanos") return "gray";
          //   else if (d.data.last === "Cipparrone") return "gray";
          //   else if (d.data.last === "Cook") return "gray";
          //   else if (d.data.last === "DeCandia") return "gray";
          //   else if (d.data.last === "Favret") return "gray";
          //   else if (d.data.last === "Gennusa") return "gray";
          //   else if (d.data.last === "Gosselink") return "gray";
          //   else if (d.data.last === "Graham") return "gray";
          //   else if (d.data.last === "Griesser") return "gray";
          //   else if (d.data.last === "Heavenrich") return "gray";
          //   else if (d.data.last === "Herrin") return "gray";
          //   else if (d.data.last === "Hetzel") return "gray";
          //   else if (d.data.last === "Hilker") return "gray";
          //   else if (d.data.last === "Holt") return "gray";
          //   else if (d.data.last === "James") return "gray";
          //   else if (d.data.last === "Johannes") return "gray";
          //   else if (d.data.last === "Ma") return "gray";
          //   else if (d.data.last === "Mannka") return "gray";
          //   else if (d.data.last === "McCarthy") return "gray";
          //   else if (d.data.last === "McDonald") return "gray";
          //   else if (d.data.last === "Partridge") return "gray";
          //   else if (d.data.last === "Penfield") return "gray";
          //   else if (d.data.last === "Perez") return "gray";
          //   else if (d.data.last === "Rubenstein") return "gray";
          //   else if (d.data.last === "Sanders") return "gray";
          //   else if (d.data.last === "Sibinga") return "green";
          //   else if (d.data.last === "Sinclair") return "gray";
          //   else if (d.data.last === "Smith") return "gray";   
          //   else if (d.data.last === "Titcomb") return "gray";
          //   else if (d.data.last === "Weber") return "gray";
          //   else if (d.data.last === "Yarnall") return "white";
          //   else return "black";
          // }) 

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


//update width with slider values
// let sliderWidth = state.slider;
//   if (state.slider !== null) {

// }
// var slider = document.getElementById("myRange");
// var output = document.getElementById("demo");
// output.innerHTML = slider.value;
// console.log("slider value", slider.value);
// console.log("slider ", slider);
// console.log("output ", output);
// slider.oninput = function() {
//   output.innerHTML = this.value;
// }
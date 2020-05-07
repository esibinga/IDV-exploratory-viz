export function chart3() {

/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.9,
  paddingInner = 0.2,
  margin = { top: 20, bottom: 80, left: 40, right: 40 };

let svg;

/**
 * APPLICATION STATE
 * */
let state = {
  hover: {},
  mousePosition: null
};

/**
 * LOAD DATA
 **/

d3.csv("../data/darts_data/nine_darters.csv", d3.autoType).then(data => {
    data.sort(function(a,b) {
        return b.Nine_darters - a.Nine_darters;
    });
    state.data = data;
    //console.log("data:", state.data);
    init();
  });
    

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {

const xScale = d3
    .scaleBand()
    .domain(state.data.map(d => d.Player))
    .range([margin.left, width - margin.right])
    .paddingInner(paddingInner);

const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(state.data, d => d.Nine_darters)])
    .range([height - margin.bottom, margin.top]);

const xAxis = d3
    .axisBottom(xScale)
    .ticks(state.data.length);

const svg = d3
    .select('#d3-container-2')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

const rect = svg
    .selectAll('rect')
    .data(state.data)
    // .sort((a,b) => d3.descending(a,b))
    // .attr("x", (d, i)=> xScale(i))
    .join('rect')
    .attr('x', d => xScale(d.Player))
    .attr('y', d => yScale(d.Nine_darters))
    .attr('width', xScale.bandwidth()) 
    .attr('height', d => height - margin.bottom - yScale(d.Nine_darters))
    .attr('fill', 'darkGreen');

svg
    .append("g")
    .attr("class", "axis")
    .attr("line", "clear")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis)
    .selectAll('text')
        .attr('transform', 'translate(-25,25) rotate(-65)');

// const text = svg
//     .selectAll('text')
//     .data(state.data)
//     .join('text')
//     .attr('class', 'label')
//     .attr('x', d => xScale(d.Player) + (xScale.bandwidth() /2))
//     .attr('y', d => yScale(d.Nine_darters)/2)
//     .text(d => d.Nine_darters)
//     .attr('dy', '1.25em');

const text = svg
    .selectAll('text.label')
    .data(state.data, d => d.Nine_darters)
    .join('text')
    .attr('class', 'label')
    .attr('x', d => xScale(d.Player) + (xScale.bandwidth() /2))
    .attr('y', d => yScale(d.Nine_darters))
    .text(d => d.Nine_darters);

  draw(); // calls the draw function
}


/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {
  
} 
/** END DRAW FUNCTION */

} //export chart here

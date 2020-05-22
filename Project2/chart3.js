export function chart3() {

/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.5,
  paddingInner = 0.2,
  margin = { top: 20, bottom: 110, left: 60, right: 40 };

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

const yAxis = d3
    .axisLeft(yScale)
    .ticks(5);

const svg = d3
    .select('#d3-container-3')
    .append('svg')
    .attr('width', width)
    .attr('height', height+35);

const rect = svg
    .selectAll('rect')
    .data(state.data)
    .join('rect')
    .attr('x', d => xScale(d.Player))
    .attr('y', d => yScale(d.Nine_darters))
    .attr('width', xScale.bandwidth()) 
    .attr('height', d => height - margin.bottom - yScale(d.Nine_darters))
    .attr('fill', 'darkGreen');

svg
    .append("g")
    .attr("class", "xaxis")
    .style("axis-ticks", "none")
    .attr("line", "clear")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis)
    .selectAll('text')
        .attr('transform', 'translate(-10,2) rotate(-65)')
        .attr("fill", "#222");

svg
    .append("g")
    .attr("class", "yaxis")
    .attr("line", "white")
    .attr("transform", `translate(${margin.left - 1}, -.5)`)
    .call(yAxis)
    .selectAll('text');

svg.append("text")
    .attr("class", "y-label")
    .attr("text-anchor", "end")
    //.attr("y", 6)
    ///.attr("dy", ".5em")
    //.attr("x", "100")
    .attr('transform', `translate(${(margin.left)/2.5}, ${height*.3}) rotate(-90)`)
    .text("9-darters");

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

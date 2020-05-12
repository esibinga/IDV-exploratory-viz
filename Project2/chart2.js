export function chart2() {



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

d3.csv("../data/darts_data/one80s.csv", d3.autoType).then(data => {
    data.sort(function(a,b) {
        return b.Total_180s - a.Total_180s;
    });
    state.data = data;
   // console.log("data:", state.data);
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
    .domain([1, d3.max(state.data, d => d.Total_180s)])
    .range([height - margin.bottom, margin.top]);

const xAxis = d3
    .axisBottom(xScale)
    .ticks(state.data.length);

const yAxis = d3
    .axisLeft(yScale)
    .ticks(5);

    console.log("state data", state.data)

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
    .attr('y', d => yScale(d.Total_180s))
    .attr('width', xScale.bandwidth()) 
    .attr('height', d => height - margin.bottom - yScale(d.Total_180s))
    .attr('fill', '#e63328');

svg
    .append("g")
    .attr("class", "xaxis")
    .attr("line", "clear")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis)
    .selectAll('text')
        .attr('transform', 'translate(-25,30) rotate(-65)');

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
    .attr('transform', `translate(${(margin.left)/4.75}, ${height*.3}) rotate(-90)`)
    .text("180s");



// const text = svg
//     .selectAll('text')
//     .data(state.data)
//     .join('text')
//     .attr('class', 'label')
//     .attr('x', d => xScale(d.Player) + (xScale.bandwidth() /2))
//     .attr('y', d => yScale(d.Total_180s)/2)
//     .text(d => d.Total_180s)
//     .attr('dy', '1.25em');

const text = svg
    .selectAll('text.label')
    .data(state.data, d => d.Total_180s)
    .join('text')
    .attr('class', 'label')
    .attr('x', d => xScale(d.Player) + (xScale.bandwidth() /2))
    .attr('y', d => yScale(d.Total_180s))
    .text(d => d.Total_180s);

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


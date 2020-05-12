export function chart5() {

    // checkout dartboards
    
    /**
     * CONSTANTS AND GLOBALS
     * */
    const width = window.innerWidth * 0.8,
        height = window.innerHeight * 0.9,
        margin = { top: 20, bottom: 20, left: 60, right: 40 };
    
    
    let svg;
    let bullseyeTooltip;
    let circleData; //why did I have to define this here when I exported the chart as a module, but not before?
    
    /**
     * APPLICATION STATE
     * */
    let state = {
        hover: {
            mx: null,
            my: null,
            points: null,
        },
        mousePosition: null
    };
    
    /**
     * LOAD DATA
     **/
    Promise.all([
        d3.csv("../data/darts_data/darts_master_sheet.csv"),
        d3.csv("../data/dartboard_svg_data.csv", d3.autoType),
    ]).then(([data, svgdata]) => {
        state.data = data;
        state.svgdata = svgdata;
        //console.log("data:", state.data);
        //console.log("data:", state.svgdata);
        init();
    });
    
    
    /**
     * INITIALIZING FUNCTION
     * this will be run *one time* when the data finishes loading in
     * */
    function init() {
    
    const container = d3
        .select("#tooltip-5")
        .style("position", "relative");
    
    bullseyeTooltip = container
        .append("div")
        .attr("class", "tooltip")
        .attr("width", 100)
        .attr("height", 100)
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background", "white");
    
    //dartboard container
    const svgContainer = d3.select("#d3-container-5.graph")
        .append("svg")
        .attr("width", width * .9)
        .attr("height", height * 1.1);
    
    
    // dartboard specs: https://www.dartsnutz.net/forum/showthread.php?tid=20982 //
    const r = height / 150;
    circleData = [
        { "cx": width * .45, "cy": height / 2, "radius": 33 * r, "inner_radius": 27.75 * r, "value": "single" },  //this is actually just the background of the dartboard now
        //{ "cx": width*.45, "cy": height/2, "radius": 26.75*r, "inner_radius": 18*r},
        //{ "cx": width*.45, "cy": height/2, "radius": 17*r, "inner_radius": 3*r},
        //{"cx": width*.45, "cy": height/2, "radius": r, "inner_radius": 0, "value": 50}
    ]
    
    const circles = svgContainer.selectAll("circle")
        .data(circleData)
        .enter()
        .append("g");
    
    // Add outer circles
    circles.append("circle")
        .attr("cx", function (d) { return d.cx; })
        .attr("cy", function (d) { return d.cy; })
        .attr("r", function (d) { return d.radius; })
        .style("fill", "black")
        .style("stroke", "black");
    
    // Add inner circles
    circles.append("circle")
        .attr("cx", function (d) { return d.cx; })
        .attr("cy", function (d) { return d.cy; })
        .attr("r", function (d) { return d.inner_radius; })
        .style("fill", "white")
        .style("stroke", "white");
    
    
    // Use a pie chart to apply data (number values) to the arc data
    const pie = d3.pie()
        .value(function (d) { return d.angle_value });
    (state.svgdata);
    
    var labelArc = d3.arc() // set the center (x,y) coordinates of this in order to center numbers?
        .outerRadius(32 * r)
        .innerRadius(30 * r); /*
    .startAngle(-0.314159)
    .endAngle(1); */
    
    var data_ready = pie(state.svgdata);
    //console.log("pie", pie); //this is just the function
    console.log("data_ready", data_ready);
    
    
    //inner single
    const spider = circles
        .select('svg')
        .data(data_ready)
        .enter()
        .append('path')
        .attr("d", d3.arc()
            .innerRadius(3 * r)
            .outerRadius(17 * r)
        )
        .attr('fill', d => {
            if (d.data.fill === "red") return "#120809"; //black
            else if (d.data.fill === "green") return "#feffc3"; // off-white
            else return "black";
        })
        .attr("opacity", "0.5")
        .attr('transform', `translate(${width * .45}, ${height / 2}) rotate (-9)`)
        .attr('stroke', 'silver')
        .style('stroke-width', '1.5px')
        // .on("mouseover", function (d) {
        //     d3.select(this)
        //         .attr('fill', d => {
        //             if (d.data.fill === "red") return "#535146"; //gray
        //             else if (d.data.fill === "green") return "#ffffee"; // lighter off-white
        //             else return "black";
        //         })
        //     draw();
        // })
        // .on("mouseout", function (d) {
        //     d3.select(this)
        //         .attr('fill', d => {
        //             if (d.data.fill === "red") return "#120809"; //black
        //             else if (d.data.fill === "green") return "#feffc3"; // off-white
        //             else return "black";
        //         })
        //     draw();
        // })
        .on("click", function (d) {
            console.log("bullseye tooltip", bullseyeTooltip)
            bullseyeTooltip.text("not a valid checkout")
                .style("visibility", "visible"); 
        });
    
    //outer single
    const spider2 = circles
        .select('svg')
        .data(data_ready)
        .enter()
        .append('path')
        .attr("d", d3.arc()
            .innerRadius(18 * r)
            .outerRadius(27.75 * r)
        )
        .attr('fill', d => {
            if (d.data.fill === "red") return "#120809"; //black
            else if (d.data.fill === "green") return "#feffc3"; //off-white
            else return "black";
        })
        .attr("opacity", "0.5")
        .attr('transform', `translate(${width * .45}, ${height / 2}) rotate (-9)`)
        .attr('stroke', 'silver')
        .style('stroke-width', '1.5px')
        // .on("mouseover", function (d) {
        //     d3.select(this)
        //         .attr('fill', d => {
        //             if (d.data.fill === "red") return "#535146"; //gray
        //             else if (d.data.fill === "green") return "#ffffee"; // lighter off-white
        //             else return "black";
        //         })
        //     draw();
        // })
        // .on("mouseout", function (d) {
        //     d3.select(this)
        //         .attr('fill', d => {
        //             if (d.data.fill === "red") return "#120809"; //black
        //             else if (d.data.fill === "green") return "#feffc3"; // off-white
        //             else return "black";
        //         })
        //     draw();
        // })
        .on("click", function (d) {
            console.log("bullseye tooltip", bullseyeTooltip)
            bullseyeTooltip.text("not a valid checkout")
                .style("visibility", "visible");
        });
    
    //triple ring
    const spider3 = circles
        .select('svg')
        .data(data_ready)
        .enter()
        .append('path')
        .attr("d", d3.arc()
            .innerRadius(17 * r)
            .outerRadius(18 * r)
        )
        .attr('fill', d => {
            if (d.data.fill === "red") return "#e63328"; //red
            else if (d.data.fill === "green") return "darkGreen"; //dark green
            else return "black";
        })
        .attr("opacity", "0.5")
        .attr('transform', `translate(${width * .45}, ${height / 2}) rotate (-9)`)
        .attr('stroke', 'silver')
        .style('stroke-width', '1.5px')
        // .on("mouseover", function (d) {
        //     d3.select(this)
        //         .attr('fill', d => {
        //             if (d.data.fill === "red") return "#fe5843"; //tomato red
        //             else if (d.data.fill === "green") return "#118110"; //brighter green
        //             else return "black";
        //         })
        //     draw();
        // })
        // .on("mouseout", function (d) {
        //     d3.select(this)
        //         .attr('fill', d => {
        //             if (d.data.fill === "red") return "#e63328"; //red
        //             else if (d.data.fill === "green") return "darkGreen"; //dark green
        //             else return "black";
        //         })
        //     draw();
        // })
        .on("click", function (d) {
            if (d.data.treble !== 60) return bullseyeTooltip
                .text("not a valid checkout :(")
                .style("visibility", "visible");
            else if (d.data.treble === 60) return bullseyeTooltip
                .text("Not this time!")
                .style("visibility", "visible");
        });
    
    //double ring
    const spider4 = circles
        .select('svg')
        .data(data_ready)
        .enter()
        .append('path')
        .attr("d", d3.arc()
            .innerRadius(26.75 * r)
            .outerRadius(27.75 * r)
        )
        .attr('fill', d => {
            if (d.data.fill === "red") return "#e63328";
            else if (d.data.fill === "green") return "darkGreen";
            else return "black";
        })
        .attr('transform', `translate(${width * .45}, ${height / 2}) rotate (-9)`)
        .attr('stroke', 'white')
        .style('stroke-width', '1.5px')
        .on("mouseover", function (d) {
            d3.select(this)
                .attr('fill', d => {
                    if (d.data.fill === "red") return "#fe5843"; //lighter red
                    else if (d.data.fill === "green") return "#118110"; //lighter green
                    else return "black";
                })
            draw();
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .attr('fill', d => {
                    if (d.data.fill === "red") return "#e63328";
                    else if (d.data.fill === "green") return "darkGreen";
                    else return "black";
                })
            draw();
        })
        .on("click", function (d) {
            console.log("bullseye tooltip", bullseyeTooltip)
            bullseyeTooltip.text("Wahoo! That'll work!");
            return bullseyeTooltip
                .style("visibility", "visible");
        });
    
    
    // ad hoc dataset for bullseyes    
    const bullseyeData = [
        { "angle_value": 360, "bullseye": 25 }
    ]
    var data_ready2 = pie(bullseyeData);
    
    const doubleBullseyeData = [
        { "angle_value": 360, "double_bullseye": 50 }
    ]
    var data_ready3 = pie(doubleBullseyeData);
    
    //bullseye ring
    const spider5 = circles
        .select('svg')
        .data(data_ready2)
        .enter()
        .append('path')
        .attr("d", d3.arc()
            .innerRadius(r)
            .outerRadius(3 * r)
        )
        .attr('fill', 'darkGreen')
        .attr("opacity", "0.5")
        .attr('transform', `translate(${width * .45}, ${height / 2}) rotate (-9)`)
        .attr('stroke', 'silver')
        .style('stroke-width', '1.5px')
        // .on("mouseover", function (d) {
        //     d3.select(this)
        //         .attr('fill', "#118110") //lighter green
        //     draw();
        // })
        // .on("mouseout", function (d) {
        //     d3.select(this)
        //         .attr('fill', "darkGreen");
        //     draw();
        // })
        .on("click", function (d) {
            console.log("bullseye tooltip", bullseyeTooltip)
            bullseyeTooltip.text("not a valid checkout");
            return bullseyeTooltip
                .style("visibility", "visible");
        });
    
    //double bullseye
    const spider6 = circles
        .select('svg')
        .data(data_ready3)
        .enter()
        .append('path')
        .attr("d", d3.arc()
            .innerRadius(0)
            .outerRadius(r)
        )
        .attr('fill', '#e63328') //red
        .attr("opacity", "1")
        .attr('transform', `translate(${width * .45}, ${height / 2}) rotate (-9)`)
        .attr('stroke', 'white')
        .style('stroke-width', '1.5px')
        .on("mouseover", function (d) {
            d3.select(this)
                .attr('fill', "#fe5843") //lighter red
            draw();
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .attr('fill', "#e63328"); //red
            draw();
        })
        .on("click", function (d) {
            console.log("bullseye tooltip", bullseyeTooltip)
            bullseyeTooltip.text("Ooooh, a showy checkout!");
            return bullseyeTooltip
                .style("visibility", "visible");
        });
    
    
    
    
    svgContainer.on("mousemove", () => {
        const [mx, my] = d3.mouse(svgContainer.node());
        state.hover["mx"] = mx;
        state.hover["my"] = my;
        //console.log("mx", mx)
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
            bullseyeTooltip
                .html(
                    //   <div>Mouse x: ${state.hover.mx}</div>
                    //    <div>Mouse y: ${state.hover.my}</div>
                    //   `<div>Points: ${state.hover.points}</div> `
                );
        }
    
    }
    /** END DRAW FUNCTION */
    
    } //export chart here
    
    
    
    
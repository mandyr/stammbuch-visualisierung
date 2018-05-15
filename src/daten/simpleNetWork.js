import * as d3 from "d3";

var nodes = [{}, {}, {}, {}, {}];

function visualizeNetwork() {
    let height = 800;
    let width = 800;

    let vizContainer = d3
        .select("#vizContainer")
        .append("svg:svg")
        .attr("width", height)
        .attr("height", width);

    var simulation = d3
        .forceSimulation(nodes)
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);
}

function ticked() {
    var u = d3
        .select("svg")
        .selectAll("circle")
        .data(nodes);

    u
        .enter()
        .append("circle")
        .attr("r", 5)
        .merge(u)
        .attr("cx", function(d) {
            return d.x;
        })
        .attr("cy", function(d) {
            return d.y;
        });

    u.exit().remove();
}

export { visualizeNetwork };

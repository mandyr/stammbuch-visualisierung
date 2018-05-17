import * as d3 from "d3";
import { graph } from "./graphData.js";

function visualizeNetwork() {
    let height = 800;
    let width = 800;

    let svg = d3
        .select("#vizContainer")
        .append("svg")
        .attr("width", height)
        .attr("height", width);

    var simulation = d3
        .forceSimulation()
        .force("charge", d3.forceManyBody().strength(-0.5))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force(
            "link",
            d3
                .forceLink()
                .id(function(d) {
                    return d.id;
                })
                .distance(0.1)
        );

    var link = svg
        .append("g")
        .selectAll("line")
        .data(graph.links)
        .enter()
        .append("line");

    var node = svg
        .append("g")
        .selectAll("circle")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("r", 5);

    simulation.nodes(graph.nodes).on("tick", ticked);

    simulation.force("link").links(graph.links);

    function ticked() {
        link
            .attr("x1", function(d) {
                return d.source.x;
            })
            .attr("y1", function(d) {
                return d.source.y;
            })
            .attr("x2", function(d) {
                return d.target.x;
            })
            .attr("y2", function(d) {
                return d.target.y;
            });

        node
            .attr("cx", function(d) {
                return d.x;
            })
            .attr("cy", function(d) {
                return d.y;
            });
    }
}

export { visualizeNetwork };

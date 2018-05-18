//an example of how data needs to be sent to the files that makes the visualization.
//Note that this is a made-up network - I just needed some sample data.

export const graph = {
    nodes: [
        { id: "100154042" },
        { id: "100541496" },
        { id: "100208681" },
        { id: "100279090" },
        { id: "100541496" },
        { id: "100596533" },
        { id: "100687741" },
        { id: "100793592" },
        { id: "100803997" }
    ],
    links: [
        { source: "100154042", target: "100208681" },
        { source: "100154042", target: "100279090" },
        { source: "100154042", target: "100541496" },
        { source: "100154042", target: "100541496" },
        { source: "100279090", target: "100803997" },
        { source: "100793592", target: "100208681" },
        { source: "100793592", target: "100803997" },
        { source: "100208681", target: "100541496" }
    ]
};

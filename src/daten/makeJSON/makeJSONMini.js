const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);

const graph = {
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

let output = "export const graph = " + JSON.stringify(graph) + ";";
fs.writeFile("../smallGraphData.js", output, function(err) {
    if (err) return console.log(err);
    console.log("JSON file has been created.");
});

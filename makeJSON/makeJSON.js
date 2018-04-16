const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);

//Prints the header and first 5 lines of the data object
function printHead(object) {
  let outputString = "";
  for (var key in object) {
    outputString += key + "\t";
  }
  outputString += "\n";

  for (let i = 0; i < 5; i++) {
    for (var key in object) outputString += object[key][i] + "\t";

    outputString += "\n";
  }

  console.log(outputString);
}

function csvToObject(csv) {
  //remove quotes from csv entries and \r signs
  let csvNoReturns = csv.replace(/\r/g, "");
  let csvNoQuotes = csvNoReturns.replace(/\"/g, "");

  let resultObject = {};
  let lines = csvNoQuotes.split("\n");
  let cells = [];

  for (let i = 0; i < lines.length; i++) {
    //if statement makes sure there aren't any empty lines, at the end, z.B.
    if (lines[i] !== "") {
      let line = lines[i].split(",");
      cells.push(line);
    }
  }

  //Intialize resultObject with key and empty array.
  for (let j = 0; j < cells[0].length; j++) {
    resultObject[cells[0][j]] = [];
  }

  for (let k = 1; k < cells.length; k++) {
    for (let j = 0; j < cells[0].length; j++) {
      resultObject[cells[0][j]].push(cells[k][j]);
    }
  }
  return resultObject;
}

async function main() {
  let nodeData = await readFile(process.argv[2], "utf8");
  let nodes = csvToObject(nodeData);

  let linkData = await readFile(process.argv[3], "utf8");
  let links = csvToObject(linkData);

  let jsonData = {
    nodes: [],
    links: []
  };

  let nodesForJSON = [];
  let nodeKey = Object.keys(nodes)[0];
  for (let k = 0; k < nodes[nodeKey].length; k++) {
    nodesForJSON.push({ id: nodes[nodeKey][k] });
  }

  jsonData.nodes = nodesForJSON;

  let linksForJSON = [];
  let linkKey1 = Object.keys(links)[0];
  let linkKey2 = Object.keys(links)[1];

  for (let k = 0; k < links[linkKey1].length; k++) {
    let link = {
      source: links[linkKey1][k],
      target: links[linkKey2][k]
    };

    linksForJSON.push(link);
  }

  jsonData.links = linksForJSON;

  const output = JSON.stringify(jsonData);

  fs.writeFile("../stammbuch.json", output, function(err) {
    if (err) return console.log(err);

    console.log("JSON file has been created.");
  });
}

main();

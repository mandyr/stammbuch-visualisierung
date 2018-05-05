const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);

//Reads in a csv where the first row contains the keys
//And all subsequent rows are values.
//Creates an array of objects, where each object contains values
//(and their keys) for that row.
function csvToObject(csv) {
    let data = [];

    //remove quotes from csv entries
    csv = csv.replace(/\"/g, "");

    let lines = csv.split("\n");
    let header = lines[0].split("\t");
    for (let i = 1; i < lines.length; i++) {
        if (lines[i] !== "") {
            let object = {};
            let line = lines[i].split("\t");
            for (let j = 0; j < header.length; j++) {
                object[header[j]] = line[j];
            }
            data.push(object);
        }
    }
    return data;
}

//auxilary to sort function.  Compares the PPN values.
function comparePPN(entryA, entryB) {
    const ppnA = entryA.PPN;
    const ppnB = entryB.PPN;
    if (ppnA < ppnB) return -1;
    else if (ppnA > ppnB) return 1;
    return 0;
}

async function main() {
    let stammbuchDaten = await readFile(process.argv[2], "utf8");
    let stammbücher = csvToObject(stammbuchDaten);

    //make clean GND field for each Stammbuch
    stammbücher.forEach(stammbuch => {
        const gndMatch = stammbuch.Verfasser.match(/(?<=gnd\/).*/);
        stammbuch.GND = gndMatch != null ? gndMatch[0] : "";
    });

    stammbücher.sort(comparePPN);
    //Print first 4 entries;
    for (let i = 0; i < 4; i++) console.log(stammbücher[i]);

    let eintragDaten = await readFile(process.argv[3], "utf8");
    let einträge = csvToObject(eintragDaten);

    //make clean GND field for each eintrag
    einträge.forEach(eintrag => {
        const s = eintrag.Einträger_GND;
        var n = s.indexOf("$");
        eintrag.GND = s.substring(0, n != -1 ? n : s.length);
    });

    // Print first 4 entries;
    for (let i = 0; i < 4; i++) console.log(einträge[i]);

    // let jsonData = {
    //     nodes: [],
    //     links: []
    // };
    //
    // let nodesForJSON = [];
    // let nodeKey = Object.keys(nodes)[0];
    // for (let k = 0; k < nodes[nodeKey].length; k++) {
    //     nodesForJSON.push({ id: nodes[nodeKey][k] });
    // }
    //
    // jsonData.nodes = nodesForJSON;
    //
    // let linksForJSON = [];
    // let linkKey1 = Object.keys(links)[0];
    // let linkKey2 = Object.keys(links)[1];
    //
    // for (let k = 0; k < links[linkKey1].length; k++) {
    //     let link = {
    //         source: links[linkKey1][k],
    //         target: links[linkKey2][k]
    //     };
    //
    //     linksForJSON.push(link);
    // }
    //
    // jsonData.links = linksForJSON;
    //
    // const output = JSON.stringify(jsonData);
    //
    // fs.writeFile("../stammbuch.json", output, function(err) {
    //     if (err) return console.log(err);
    //
    //     console.log("JSON file has been created.");
    // });
}

main();

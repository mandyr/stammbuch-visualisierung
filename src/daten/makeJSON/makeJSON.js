//This file writes to "../graphData.js" a javascript file that exports a
//javascript object.
// To run the file on your computer type: "node makeJSON.js stammbücher.csv einträge.csv"
//Note that the program is slow.  It has not been programmed to run efficiently.

const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const csvToObject = require("./csvToObject").csvToObject;

function returnUnqiueGNDs(einträge, stammbücher) {
    let allGNDs = [];
    einträge.forEach(eintrag => {
        if (eintrag.GND != "") allGNDs.push(eintrag.GND);
        if (eintrag.GND === "100001394")
            console.log("Just pushed entry 100001394");
    });
    stammbücher.forEach(stammbuch => {
        if (stammbuch.GND != "") allGNDs.push(stammbuch.GND);
    });
    // console.log("All GNDs total: ", allGNDs.length);
    // let empties = allGNDs.filter(entry => entry == "");
    // console.log("Empty GNDs: ", empties.length);
    allGNDs.sort();
    var allUniqueGNDs = [];
    allGNDs.forEach((gnd, index, allGNDs) => {
        if (gnd === "100001394")
            console.log("Looking at 100001394 with index ", index);
        if (gnd != allGNDs[index - 1]) allUniqueGNDs.push({ id: gnd });
    });
    return allUniqueGNDs;
}

async function main() {
    let stammbuchDaten = await readFile(process.argv[2], "utf8");
    let stammbücher = csvToObject(stammbuchDaten);

    //make clean GND field for each Stammbuch
    stammbücher.forEach(stammbuch => {
        const gndMatch = stammbuch.Verfasser.match(/(?<=gnd\/).*/);
        stammbuch.GND = gndMatch != null ? gndMatch[0] : "";
        stammbuch.GND = stammbuch.GND.trim();
    });

    //Print first 4 entries;
    // for (let i = 0; i < 4; i++) console.log(stammbücher[i]);

    let eintragDaten = await readFile(process.argv[3], "utf8");
    let einträge = csvToObject(eintragDaten);

    //make clean GND field for each eintrag
    einträge.forEach(eintrag => {
        const s = eintrag.Einträger_GND;
        var n = s.indexOf("$");
        eintrag.GND = s.substring(0, n != -1 ? n : s.length);
        eintrag.Stammbuch_PPN = eintrag.Stammbuch_PPN.replace(/\s/g, "");
        eintrag.GND = eintrag.GND.replace(/\s/g, "");
    });

    // Print first n entries;
    for (let i = 0; i < 2; i++) console.log(einträge[i]);

    //make unique list of all GNDs
    const nodes = returnUnqiueGNDs(einträge, stammbücher);
    for (let i = 0; i < 5; i++) console.log(nodes[i]);

    console.log("Total number of nodes (i.e. unique GNDs): ", nodes.length);
    console.log("The first node is: " + JSON.stringify(nodes[0]));

    let links = [];
    einträge.forEach((eintrag, index) => {
        const source = eintrag.GND;
        const sourceInReducedList = nodes.findIndex(node => {
            return node.id === source;
        });

        if (sourceInReducedList != -1) {
            const indexOfSB = stammbücher.findIndex(sb => {
                return sb.PPN === eintrag.Stammbuch_PPN;
            });
            const target = stammbücher[indexOfSB].GND;
            if (target !== "") links.push({ source, target });
        }
    });
    for (let i = 0; i < 5; i++) {
        console.log(links[i]);
    }
    console.log("Total number of links: ", links.length);

    console.log("Checking that all links contain valid nodes...");

    links.forEach(link => {
        const sourceFound = nodes.findIndex(node => {
            return node.id === link.source;
        });
        const targetFound = nodes.findIndex(node => {
            return node.id === link.target;
        });
        if (link.source === "100001394")
            console.log("Source found for 100001394", sourceFound);
        if (sourceFound == -1 || targetFound == -1) {
            console.log(
                "WarningL Link ",
                JSON.stringify(link),
                " contains an invalid node"
            );
        }
    });

    const graph = { nodes, links };
    console.log("The first node is: " + graph.nodes[0].id);
    const output = "export const graph = " + JSON.stringify(graph) + ";";
    fs.writeFile("../graphData.js", output, function(err) {
        if (err) return console.log(err);
        console.log("JSON file has been created.");
    });
}

main();

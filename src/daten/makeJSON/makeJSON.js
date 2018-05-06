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

//make sure field contains has no empty spaces
function checkForEmptySpace(entry) {
    if (entry != null) {
        if (entry.indexOf(" ") != -1)
            console.log(
                "Warning: empty space in entry:",
                entry,
                " at ",
                entry.indexOf(" ")
            );
    }
}

//auxilary to sort function.  Compares the PPN values.
function comparePPN(entryA, entryB) {
    const ppnA = entryA.PPN;
    const ppnB = entryB.PPN;
    if (ppnA < ppnB) return -1;
    else if (ppnA > ppnB) return 1;
    return 0;
}

//
function returnUnqiueGNDs(einträge, stammbücher) {
    let allGNDs = [];
    einträge.forEach(eintrag => {
        if (eintrag.GND != "") allGNDs.push(eintrag.GND);
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
    });

    //sort is not necessarilly needed, since findIndex doesn't sort
    // stammbücher.sort(comparePPN);
    //Print first 4 entries;
    for (let i = 0; i < 4; i++) console.log(stammbücher[i]);

    let eintragDaten = await readFile(process.argv[3], "utf8");
    let einträge = csvToObject(eintragDaten);

    //make clean GND field for each eintrag
    einträge.forEach(eintrag => {
        const s = eintrag.Einträger_GND;
        var n = s.indexOf("$");
        eintrag.GND = s.substring(0, n != -1 ? n : s.length);
        eintrag.Stammbuch_PPN = eintrag.Stammbuch_PPN.replace(/\s/g, "");
        // checkForEmptySpace(eintrag.Stammbuch_PPN);
    });

    // Print first 4 entries;
    for (let i = 0; i < 4; i++) console.log(einträge[i]);

    //make unique list of all GNDs
    const nodes = returnUnqiueGNDs(einträge, stammbücher);
    // console.log("Unique GNDs: ", nodes.length);

    let links = [];
    einträge.forEach(eintrag => {
        const source = eintrag.GND;
        const indexOfSB = stammbücher.findIndex(
            sb => sb.PPN === eintrag.Stammbuch_PPN
        );
        const target = stammbücher[indexOfSB].GND;
        if (target != "") links.push({ source, target });
    });

    for (let i = 0; i < 5; i++) {
        console.log(nodes[i]);
        console.log(links[i]);
    }
    const jsonData = { nodes, links };
    const output = JSON.stringify(jsonData);
    fs.writeFile("../stammbuch.json", output, function(err) {
        if (err) return console.log(err);
        console.log("JSON file has been created.");
    });
}

main();

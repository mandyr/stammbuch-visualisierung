const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const csvToObject = require("./csvToObject").csvToObject;

function returnGNDsTenTimesOrMore(einträge, stammbücher) {
    let allGNDs = [];
    einträge.forEach(eintrag => {
        if (eintrag.GND != "") allGNDs.push(eintrag.GND);
    });
    allGNDs.sort();
    let commonGNDs = [];
    let counter = 0;
    for (let i = 0; i < allGNDs.length; i++) {
        if (allGNDs[i] === allGNDs[i - 1]) counter++;
        else if (counter >= 10) {
            commonGNDs.push({ id: allGNDs[i] });
            counter = 0;
        } else {
            counter = 0;
        }
    }

    stammbücher.forEach(stammbuch => {
        if (stammbuch.GND != "") commonGNDs.push({ id: stammbuch.GND });
    });

    return commonGNDs;
}

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

    // Print first 4 entries;
    // for (let i = 0; i < 4; i++) console.log(einträge[i]);

    returnGNDsTenTimesOrMore(einträge, stammbücher);
    //make unique list of all GNDs
    const nodes = returnGNDsTenTimesOrMore(einträge, stammbücher);
    for (let i = 0; i < 5; i++) console.log(nodes[i]);
    // console.log(nodes.length);
    console.log("Unique GNDs: ", nodes.length);

    let links = [];
    einträge.forEach((eintrag, index) => {
        if (index < 1000) {
            const source = eintrag.GND;
            const sourceInReducedList = nodes.findIndex(node => {
                return node.id === source;
            });

            if (sourceInReducedList != -1) {
                const indexOfSB = stammbücher.findIndex(sb => {
                    return sb.PPN === eintrag.Stammbuch_PPN;
                });
                const target = stammbücher[indexOfSB].GND;
                links.push({ source, target });
            }
        }
    });

    for (let i = 0; i < 5; i++) {
        console.log(nodes[i]);
        console.log(links[i]);
    }
    const jsonData = { nodes };
    const output = JSON.stringify(jsonData);
    fs.writeFile("../stammbuch.json", output, function(err) {
        if (err) return console.log(err);
        console.log("JSON file has been created.");
    });
}

main();

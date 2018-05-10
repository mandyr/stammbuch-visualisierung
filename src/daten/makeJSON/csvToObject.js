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

module.exports = { csvToObject };

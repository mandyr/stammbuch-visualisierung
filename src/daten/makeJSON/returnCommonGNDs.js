export function returnGNDsTenTimesOrMore(einträge, stammbücher) {
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

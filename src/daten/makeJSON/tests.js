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

function filterName() {
    let input, filter, ul, li, a, i;
    input = document.getElementById("name");
    filter = input.value.toUpperCase();
    ul = document.getElementById("ulNames");
    li = ul.getElementsByTagName("li");

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function handleNameSearch() {
    const nameField = document.getElementById("name");
    nameField.onkeyup = filterName();
}
export { handleNameSearch };

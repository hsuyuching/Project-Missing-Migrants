function renderButton(div, labelText) {
    let button = div.append("button").text(labelText);
    button.classed("btn btn-outline-primary", true);
    button.style("margin-left", "20px");

    return button;
}

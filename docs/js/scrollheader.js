// function scrollToElement(element, duration = 400, delay = 0, easing = 'cubic-in-out', endCallback = () => {}) {
//     var offsetTop = window.pageYOffset || document.documentElement.scrollTop
//     d3.transition()
//         // .each("end", endCallback)
//         .delay(delay)
//         .duration(duration)
//         // .ease(easing)
//         .tween("scroll", (offset => () => {
//             var i = d3.interpolateNumber(offsetTop, offset);
//             return t => scrollTo(0, i(t))
//         })(offsetTop + element.getBoundingClientRect().top));
// }
// var el = document.getElementById('header')
// scrollToElement(el, undefined, undefined, undefined, () => alert('done'))

function parallax_height() {
    var scroll_top = this.scrollTop();
    var sample_section_top = d3.select(".sample-section").offset().top;
    var header_height = d3.select(".sample-header-section").outerHeight();
    d3.select(".sample-section").css({ "margin-top": header_height });
    d3.select(".sample-header").css({ height: header_height - scroll_top });
}
parallax_height();
window.scroll(function() {
    parallax_height();
});
window.resize(function() {
    parallax_height();
});


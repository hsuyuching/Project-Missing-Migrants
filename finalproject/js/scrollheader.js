function scrollToElement(element, duration = 400, delay = 0, easing = 'cubic-in-out', endCallback = () => {}) {
    var offsetTop = window.pageYOffset || document.documentElement.scrollTop
    d3.transition()
        // .each("end", endCallback)
        .delay(delay)
        .duration(duration)
        // .ease(easing)
        .tween("scroll", (offset => () => {
            var i = d3.interpolateNumber(offsetTop, offset);
            return t => scrollTo(0, i(t))
        })(offsetTop + element.getBoundingClientRect().top));
}
var el = document.getElementById('header')
scrollToElement(el, undefined, undefined, undefined, () => alert('done'))
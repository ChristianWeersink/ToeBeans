document.addEventListener("DOMContentLoaded", function () {
    var homepagePetCarousel = new bootstrap.Carousel(document.querySelector("#petCarousel"), {
        interval: 8000,
        ride: false,
        pause: "hover",
        wrap: true
    });


setTimeout(function () {
    homepagePetCarousel.cycle();
}, 500);

});
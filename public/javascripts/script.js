bsCustomFileInput.init();

//smooth scroll
document.querySelectorAll('a[href^="#seeding-projects"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

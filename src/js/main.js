import Comments from "./comments.js";
import Alpine from "https://esm.sh/alpinejs";
import collapse from "https://esm.sh/@alpinejs/collapse";

// Initialize Alpine
window.Alpine = Alpine;
Alpine.plugin(collapse);

// Custom comment element + Alpine start
customElements.define("mastodon-comments", Comments);

Alpine.start();

// DOMContentLoaded - Wait for DOM to be ready before running UI scripts
document.addEventListener("DOMContentLoaded", () => {

  // Navbar scroll background toggle
  const navbar = document.getElementById("navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 10) {
        navbar.classList.add("scroll");
        navbar.classList.add("bg-ivory");
        navbar.classList.remove("bg-sand");
        navbar.classList.remove("initial");
      } else {
        navbar.classList.add("bg-sand");
        navbar.classList.remove("bg-ivory");
        navbar.classList.remove("scroll");
      }
    });
  }

  // Membership tab toggle
  const tab12 = document.getElementById("tab-12mo");
  const tab6 = document.getElementById("tab-6mo");
  const panel12 = document.getElementById("panel-12mo");
  const panel6 = document.getElementById("panel-6mo");

  if (tab12 && tab6 && panel12 && panel6) {
    tab12.addEventListener("click", () => {
      tab12.classList.add("active");
      tab12.classList.remove("inactive");
      tab6.classList.add("inactive");
      tab6.classList.remove("active");
      panel12.classList.remove("hidden");
      panel6.classList.add("hidden");
    });

    tab6.addEventListener("click", () => {
      tab6.classList.add("active");
      tab6.classList.remove("inactive");
      tab12.classList.add("inactive");
      tab12.classList.remove("active");
      panel6.classList.remove("hidden");
      panel12.classList.add("hidden");
    });
  }
  // Unwrap <p><picture></p> and <p><img></p>
  const allPTags = document.querySelectorAll("p");
  allPTags.forEach((elem) => {
    const onlyChild = elem.childNodes[0];
    if (
      elem.innerText.trim() === "" &&
      elem.childNodes.length === 1 &&
      onlyChild.nodeType === Node.ELEMENT_NODE &&
      (onlyChild.tagName === "PICTURE" || onlyChild.tagName === "IMG")
    ) {
      elem.parentNode.insertBefore(onlyChild, elem);
      elem.remove();
    }
  });

});

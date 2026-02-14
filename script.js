let mobile_media_query = window.matchMedia("(max-width: 400px)");
let tablet_media_query = window.matchMedia("(min-width: 400px) and (max-width: 600px)");
const notes = document.querySelectorAll(".js-note");

function recize_notes() {
  notes.forEach(note => {
    if (note.classList.contains("active")) {
      note.classList.remove("active");
      gsap.to(note, { height: "30%", duration: 0.5 });
    }
  });
}

function notes_ready() {
  gsap.to(".js-envelop-content", {
    height: "110%",
    duration: 0.5
  });

  notes.forEach((note, i) => {
    // This calculates the original starting height for each note (60%, 40%, 20%)
    let origBottom = (60 - (i * 20)) + "%"; 

    note.addEventListener("click", function () {
      if (this.classList.contains("active")) {
        // Close the note and return it to its original staggered position
        this.classList.remove("active");
        gsap.to(this, { height: "30%", bottom: origBottom, duration: 0.5, ease: "power2.out" });
      } else {
        // Close all other notes first
        notes.forEach((n, index) => {
          n.classList.remove("active");
          let b = (60 - (index * 20)) + "%";
          gsap.to(n, { height: "30%", bottom: b, duration: 0.5, ease: "power2.out" });
        });

        // Open the clicked note
        this.classList.add("active");
        
        // THE MAGIC FIX: 
        // We make the height 110%, but pull the bottom down to 20%. 
        // This keeps the top of the paper safely on the screen while you scroll!
        gsap.to(this, { 
          height: "110%", 
          bottom: "20%",  
          duration: 0.5, 
          ease: "power2.out" 
        });

        // Automatically scroll back to the top of the note when opened
        this.scrollTop = 0;
      }
    });
  });
}

function set_up_paper() {
  var arr = [0, 0, 100, 0, 50, 61];
  gsap.set(".js-up-paper", {
    bottom: "97%",
    rotation: 180,
    zIndex: 200,
    clipPath: `polygon(${arr[0]}% ${arr[1]}%, ${arr[2]}% ${arr[3]}%, ${arr[4]}% ${arr[5]}%)`,
    onComplete: notes_ready
  });
}

function envelop_transition() {
  gsap.to(".js-up-paper", {
    bottom: "1%",
    duration: 0.25,
    onComplete: set_up_paper
  });
  const upPaper = document.querySelector(".js-up-paper");
  upPaper.removeEventListener("click", envelop_transition);
  upPaper.classList.remove("cursor");
}

function sticker() {
  gsap.set(".js-sticker", { width: "20%", left: "-80%" });
  document.body.classList.remove("scissors");
  document.querySelector(".js-sticker").removeEventListener("click", sticker);
  const upPaper = document.querySelector(".js-up-paper");
  upPaper.addEventListener("click", envelop_transition);
  upPaper.classList.add("cursor");
}

document.querySelector(".js-sticker").addEventListener("click", sticker);

window.onresize = function () {
  recize_notes();
};
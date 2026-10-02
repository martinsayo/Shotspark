const ideas = [
  { format: "POV", hook: "Film a day in the life, but only the 5 worst moments.", twist: "Caption each clip with what you SHOULD have done instead." },
  { format: "Tutorial", hook: "Show the one setting in your editing app nobody uses.", twist: "Before/after the same clip, side by side." },
  { format: "Storytime", hook: "Tell the story of your most embarrassing client feedback.", twist: "Reenact their exact words on screen." },
  { format: "Review", hook: "Rate 3 tools you use every week out of 10.", twist: "Be brutally honest about the one you'd drop." },
  { format: "Challenge", hook: "Edit the same 10-second clip in 3 completely different styles.", twist: "Let viewers vote on which style wins." },
  { format: "Myth-bust", hook: "Debunk a 'rule' beginners think they have to follow.", twist: "Show a popular video that breaks it on purpose." },
  { format: "Behind the scenes", hook: "Show your actual messy project file, unedited.", twist: "Count how many unused layers/takes are in there." },
  { format: "Listicle", hook: "3 beginner mistakes you used to make.", twist: "Show the exact clip where you made one." },
  { format: "Duet/Reaction", hook: "React to your own oldest uploaded video.", twist: "Pause to explain what past-you got wrong." },
  { format: "Tutorial", hook: "Recreate a trending effect in under 60 seconds.", twist: "Speed-run it with a visible timer on screen." },
  { format: "Q&A", hook: "Answer the question you get asked the most in comments.", twist: "Show, don't just tell — demo it live." },
  { format: "Before/After", hook: "Take your worst old edit and redo it with today's skills.", twist: "Play both side by side, no commentary needed." },
];

const sparkBtn = document.getElementById("sparkBtn");
const slateEmpty = document.getElementById("slateEmpty");
const slateCard = document.getElementById("slateCard");
const cardFormat = document.getElementById("cardFormat");
const cardHook = document.getElementById("cardHook");
const cardTwist = document.getElementById("cardTwist");
const saveBtn = document.getElementById("saveBtn");
const savedSection = document.getElementById("savedSection");
const savedList = document.getElementById("savedList");
const clearBtn = document.getElementById("clearBtn");

let currentIdea = null;
let lastIndex = -1;

function getSaved() {
  try {
    return JSON.parse(localStorage.getItem("shotspark-saved")) || [];
  } catch {
    return [];
  }
}

function setSaved(list) {
  localStorage.setItem("shotspark-saved", JSON.stringify(list));
}

function renderSaved() {
  const saved = getSaved();
  savedList.innerHTML = "";

  if (saved.length === 0) {
    savedSection.hidden = true;
    return;
  }

  savedSection.hidden = false;
  saved.forEach((idea, i) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.className = "idea-text";
    span.textContent = idea.hook;

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-saved";
    removeBtn.setAttribute("aria-label", "Remove saved idea");
    removeBtn.textContent = "✕";
    removeBtn.addEventListener("click", () => {
      const updated = getSaved().filter((_, idx) => idx !== i);
      setSaved(updated);
      renderSaved();
    });

    li.appendChild(span);
    li.appendChild(removeBtn);
    savedList.appendChild(li);
  });
}

function updateSaveButtonState() {
  if (!currentIdea) return;
  const saved = getSaved();
  const isSaved = saved.some(i => i.hook === currentIdea.hook);
  saveBtn.textContent = isSaved ? "★" : "☆";
  saveBtn.classList.toggle("saved", isSaved);
}

function sparkIdea() {
  let index;
  do {
    index = Math.floor(Math.random() * ideas.length);
  } while (index === lastIndex && ideas.length > 1);
  lastIndex = index;

  currentIdea = ideas[index];

  cardFormat.textContent = currentIdea.format;
  cardHook.textContent = currentIdea.hook;
  cardTwist.textContent = currentIdea.twist;

  slateEmpty.hidden = true;
  slateCard.hidden = false;

  updateSaveButtonState();
}

saveBtn.addEventListener("click", () => {
  if (!currentIdea) return;
  const saved = getSaved();
  const exists = saved.some(i => i.hook === currentIdea.hook);

  if (exists) {
    setSaved(saved.filter(i => i.hook !== currentIdea.hook));
  } else {
    setSaved([...saved, currentIdea]);
  }

  updateSaveButtonState();
  renderSaved();
});

clearBtn.addEventListener("click", () => {
  setSaved([]);
  renderSaved();
});

sparkBtn.addEventListener("click", sparkIdea);

renderSaved();

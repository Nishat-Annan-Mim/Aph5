const loginBtn = document.getElementById("loginBtn");

const loginPage = document.getElementById("loginPage");
const mainPage = document.getElementById("mainPage");

const issuesContainer = document.getElementById("issuesContainer");

const tabs = document.querySelectorAll(".tab");

const loader = document.getElementById("loader");

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

const issueCount = document.getElementById("issueCount");

const modal = document.getElementById("issueModal");

const closeModal = document.getElementById("closeModal");

const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalStatus = document.getElementById("modalStatus");
const modalPriority = document.getElementById("modalPriority");
const modalAuthor = document.getElementById("modalAuthor");
const modalAssignee = document.getElementById("modalAssignee");
const modalDate = document.getElementById("modalDate");

let allIssues = [];

/* LOGIN */

loginBtn.addEventListener("click", () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "admin123") {
    loginPage.classList.add("hidden");
    mainPage.classList.remove("hidden");

    loadIssues();
  } else {
    alert("Invalid credentials");
  }
});

/* FETCH ALL ISSUES */

async function loadIssues() {
  loader.classList.remove("hidden");

  const res = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues",
  );

  const data = await res.json();

  allIssues = data.data;

  displayIssues(allIssues);

  loader.classList.add("hidden");
}

/* DISPLAY ISSUES */

function displayIssues(issues) {
  issuesContainer.innerHTML = "";

  issueCount.innerText = issues.length + " Issues";

  issues.forEach((issue) => {
    const card = document.createElement("div");

    card.classList.add("issue-card");

    if (issue.status === "open") {
      card.classList.add("issue-open");
    } else {
      card.classList.add("issue-closed");
    }

    card.innerHTML = `

<h4>${issue.title}</h4>
<p>${issue.description.substring(0, 80)}...</p>

<p>Status: ${issue.status}</p>
<p>Priority: ${issue.priority}</p>
<p>Author: ${issue.author}</p>

`;

    card.addEventListener("click", () => openModal(issue.id));

    issuesContainer.appendChild(card);
  });
}

/

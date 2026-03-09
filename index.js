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
document.addEventListener("DOMContentLoaded", () => {
  loginPage.classList.remove("hidden");
  mainPage.classList.add("hidden");
  modal.classList.add("hidden");
});

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

  try {
    const res = await fetch(
      "https://phi-lab-server.vercel.app/api/v1/lab/issues",
    );
    const data = await res.json();
    allIssues = data.data;
    displayIssues(allIssues);
  } catch (error) {
    console.error("Error fetching issues:", error);
    issuesContainer.innerHTML = "<p>Error loading issues</p>";
  } finally {
    loader.classList.add("hidden");
  }
}

/* DISPLAY ISSUES */
function displayIssues(issues) {
  issuesContainer.innerHTML = "";
  issueCount.innerText = issues.length + " Issues";

  issues.forEach((issue) => {
    const card = document.createElement("div");
    card.classList.add("issue-card");

    if (issue.status === "open") card.classList.add("issue-open");
    else card.classList.add("issue-closed");

    // Priority
    let priorityClass = "";
    if (issue.priority.toLowerCase() === "high") priorityClass = "high";
    else if (issue.priority.toLowerCase() === "medium")
      priorityClass = "medium";
    else priorityClass = "low";

    // Labels
    const labels = issue.labels
      ? issue.labels
          .map((l) => {
            let cls = l.toLowerCase() === "bug" ? "bug" : "help-wanted";
            return `<span class="label ${cls}">${l}</span>`;
          })
          .join("")
      : "";

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h4>${issue.title}</h4>
        <span class="priority ${priorityClass}">${issue.priority}</span>
      </div>
      <p>${issue.description.substring(0, 80)}...</p>
      <div>${labels}</div>
      <div class="issue-footer">
        #${issue.id} by ${issue.author} <br>
        ${new Date(issue.createdAt).toLocaleDateString()}
      </div>
    `;

    card.addEventListener("click", () => openModal(issue.id));
    issuesContainer.appendChild(card);
  });
}

/* TABS */
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    const status = tab.dataset.status;
    if (status === "all") displayIssues(allIssues);
    else {
      const filtered = allIssues.filter((i) => i.status === status);
      displayIssues(filtered);
    }
  });
});

/* SEARCH */
searchBtn.addEventListener("click", searchIssues);

async function searchIssues() {
  const text = searchInput.value;
  if (!text) return loadIssues();

  loader.classList.remove("hidden");

  try {
    const res = await fetch(
      `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`,
    );
    const data = await res.json();
    displayIssues(data.data);
  } catch (error) {
    console.error("Error searching issues:", error);
  } finally {
    loader.classList.add("hidden");
  }
}

/* MODAL */
async function openModal(id) {
  modal.classList.remove("hidden");

  try {
    const res = await fetch(
      `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`,
    );
    const data = await res.json();
    const issue = data.data;

    modalTitle.innerText = issue.title;
    modalDescription.innerText = issue.description;
    modalStatus.innerText = issue.status;
    modalPriority.innerText = issue.priority;
    modalAuthor.innerText = issue.author;
    modalAssignee.innerText = issue.assignee || "None";
    modalDate.innerText = new Date(issue.createdAt).toLocaleDateString();
  } catch (error) {
    console.error("Error fetching issue:", error);
  }
}

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

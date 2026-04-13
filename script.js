const STORAGE_KEY = "portfolio-projects";

const projectList = document.getElementById("projectList");
const emptyState = document.getElementById("emptyState");

const defaultProjects = [
  {
    id: crypto.randomUUID(),
    title: "Typing Practice Web App",
    description: "A responsive typing app that tracks speed and accuracy in real-time.",
    link: "",
    image: "assets/project-typing.svg"
  },
  {
    id: crypto.randomUUID(),
    title: "Weather Forecasting",
    description: "A clean weather forecasting project with current conditions and forecast view.",
    link: "https://weather.com/weather/today",
    image: "assets/project-weather.svg"
  }
];

function loadProjects() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultProjects;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaultProjects;
    return parsed;
  } catch (_error) {
    return defaultProjects;
  }
}

function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function ensureDefaultProjects() {
  const projects = loadProjects();
  let changed = false;

  defaultProjects.forEach((seedProject) => {
    const exists = projects.some(
      (project) => project.title.toLowerCase() === seedProject.title.toLowerCase()
    );

    if (!exists) {
      projects.push(seedProject);
      changed = true;
    }
  });

  projects.forEach((project) => {
    if (!project.image) {
      if (project.title.toLowerCase().includes("typing")) {
        project.image = "assets/project-typing.svg";
      } else if (project.title.toLowerCase().includes("weather")) {
        project.image = "assets/project-weather.svg";
      } else {
        project.image = "assets/project-default.svg";
      }
      changed = true;
    }
  });

  if (changed) {
    saveProjects(projects);
  }

  return projects;
}

function normalizeProjectUrl(rawUrl) {
  const url = rawUrl.trim();
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (url.startsWith("localhost:") || url.startsWith("127.0.0.1:")) {
    return `http://${url}`;
  }

  return `https://${url}`;
}

function createProjectCard(project) {
  const article = document.createElement("article");
  article.className = "project-card";

  const preview = document.createElement("img");
  preview.className = "project-preview";
  preview.src = project.image || "assets/project-default.svg";
  preview.alt = `${project.title} preview`;
  preview.loading = "lazy";

  const title = document.createElement("h3");
  title.textContent = project.title;

  const description = document.createElement("p");
  description.textContent = project.description;

  const actions = document.createElement("div");
  actions.className = "project-actions";

  const runBtn = document.createElement("a");
  runBtn.className = "btn btn-run";
  runBtn.textContent = "Run";
  if (project.link) {
    runBtn.href = normalizeProjectUrl(project.link);
    runBtn.target = "_blank";
    runBtn.rel = "noopener noreferrer";
  } else {
    runBtn.href = "#projects";
    runBtn.title = "Project URL not available.";
  }
  actions.appendChild(runBtn);

  article.appendChild(preview);
  article.appendChild(title);
  article.appendChild(description);
  article.appendChild(actions);

  return article;
}

function renderProjects() {
  const projects = ensureDefaultProjects();
  projectList.innerHTML = "";

  projects.forEach((project) => {
    projectList.appendChild(createProjectCard(project));
  });

  emptyState.classList.toggle("hidden", projects.length > 0);
}

renderProjects();

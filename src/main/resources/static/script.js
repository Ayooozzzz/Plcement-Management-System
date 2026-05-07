const API = "http://localhost:8080";

let jobChartInstance;
let studentChartInstance;

function checkAuth(requiredRole = null) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  if (requiredRole && user.role !== requiredRole) {
    alert("Unauthorized Access");
    window.location.href = "login.html";
  }
}



// LOAD JOBS AUTO

  window.addEventListener("DOMContentLoaded", () => {

  if (document.getElementById("stats")) {
    showSection("stats");
    loadStats();
  }

  if (document.getElementById("jobs") && window.location.pathname.includes("dashboard")) {
    loadJobs();
  }

});

// GLOBAL FUNCTIONS
function goToRegister() {
  window.location.href = "register.html";
}

function goStudent() {
  window.location.href = "index.html";
}

function goRecruiter() {
  window.location.href = "recruiter.html";
}

function goAdmin() {
  window.location.href = "admin.html";
}

function goToDashboard() {
  window.location.href = "dashboard.html";
}


// LOGIN
function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const box = document.querySelector(".login-box");

  // EMAIL VALIDATION
  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

  if (!emailPattern.test(email)) {
    shake(box);
    alert("Invalid Email Format");
    return;
  }

  if (password.length < 6) {
    shake(box);
    alert("Password must be at least 6 characters");
    return;
  }

  showLoader();

  fetch("http://localhost:8080/users/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ email, password })
})
.then(res => {
  if (!res.ok) {
    throw new Error("Invalid Credentials");
  }
  return res.json();
})
.then(data => {

  hideLoader();

  localStorage.setItem("user", JSON.stringify(data));
  localStorage.setItem("role", data.role);

  successAnim();

  setTimeout(() => {
   if (data.role === "ADMIN") {
  window.location.href = "admin.html";
} 
else if (data.role === "RECRUITER") {
  window.location.href = "recruiter.html";
}
else {
  window.location.href = "dashboard.html";
}
  }, 800);
})
.catch(err => {
  hideLoader();
  shake(document.querySelector(".login-box"));
  alert("Wrong Email or Password");
});

}
// LOADER
function showLoader() {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.display = "block";
  }
}

function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.display = "none";
  }
}
// SUCCESS ANIMATION
function shake(el) {
  el.classList.add("shake");
  setTimeout(() => el.classList.remove("shake"), 400);
}

// SUCCESS ANIMATION
function successAnim() {
  document.querySelector(".login-box").classList.add("success");
}

/// card hide
function showSection(sectionId) {

  // hide all sections safely
  const sections = ["stats", "jobs", "applications"];
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });

  // show selected
  const active = document.getElementById(sectionId);
  if (active) active.style.display = "block";

  // load data
  if (sectionId === "jobs") {
    const container = document.getElementById("adminJobs");
    if (container) container.innerHTML = "Loading...";
    loadAdminJobs();
  }

  if (sectionId === "applications") {
    const table = document.getElementById("applicationsData");
    if (table) table.innerHTML = "<tr><td colspan='6'>Loading...</td></tr>";
    loadApplications();
  }
}

// LOGOUT
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}


//stats 
async function loadStats() {
  try {
    const jobs = await fetch(`${API}/jobs/all`).then(r => r.json());
    const apps = await fetch(`${API}/applications/all`).then(r => r.json());

    document.getElementById("totalJobs").innerText = jobs.length + "+";

    let selected = apps.filter(a => a.status === "SELECTED").length;
    document.getElementById("selectedStudents").innerText = selected + "+";

    // dummy (ya future me backend se la sakti hai)
    document.getElementById("companies").innerText = "300+";

  } catch (e) {
    console.log("Stats error", e);
  }
}



// REGISTER
function registerUser() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("emailReg").value.trim();
  const password = document.getElementById("passwordReg").value.trim();
  const role = document.getElementById("role").value;

  if (!name || !email || !password) {
    alert("All fields required");
    return;
  }

  fetch(`${API}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, password, role })
  })
  .then(res => {
    if (!res.ok) throw new Error("Registration failed");
    return res.json();
  })
  .then(() => {
    alert("Registered Successfully");

    toggleForm();  // back to login
  })
  .catch(() => {
    alert("Error registering user");
  });
}

// LOAD JOBS

  let allJobs = [];

async function loadJobs() {
  try {
    const res = await fetch(`${API}/jobs/all`);
    const data = await res.json();

    allJobs = data; // store globally
    renderJobs(data);

  } catch (error) {
    document.getElementById("jobs").innerHTML = "Error loading jobs";
  }
}

function renderJobs(jobs) {
  const container = document.getElementById("jobs");
  container.innerHTML = "";

  if (jobs.length === 0) {
    container.innerHTML = "No jobs found";
    return;
  }

  jobs.forEach(item => {
  const job = item.job || item;

  container.innerHTML += `
    <div class="card">
      <h3>${job.company}</h3>
      <p>${job.role}</p>
      <p>${job.criteria}</p>
      <button onclick="applyJob(${job.id})">Apply</button>
    </div>
  `;
});
}

// FILTER JOBS
function filterJobs(type) {

  if (type === "ALL") {
    renderJobs(allJobs);
    return;
  }

  const filtered = allJobs.filter(job =>
    job.role.toLowerCase().includes(type.toLowerCase())
  );

  renderJobs(filtered);
}


// APPLY JOB
function applyJob(jobId) {
  localStorage.setItem("jobId", jobId);
  window.location.href = "apply.html";
}


///admIn
// LOAD JOBS FOR ADMIN
async function loadAdminJobs() {
  const res = await fetch("http://localhost:8080/jobs/all");
  const jobs = await res.json();

  let html = `
    <table style="width:80%; margin:auto; border-collapse:collapse;">
      <tr style="color:#facc15;">
        <th>Company</th>
        <th>Role</th>
        <th>Criteria</th>
        <th>Action</th>
      </tr>
  `;

 jobs.forEach(item => {
  const job = item.job || item;

  html += `
    <tr style="text-align:center;">
      <td>${job.company}</td>
      <td>${job.role}</td>
      <td>${job.criteria}</td>
      <td>
        <button onclick="deleteJob(${job.id})">Delete</button>
      </td>
    </tr>
  `;
});

  html += `</table>`;

 const container = document.getElementById("adminJobs");
if (!container) return;
container.innerHTML = html;
}
// ADD JOB
async function addJob() {
  const company = document.getElementById("company").value;
  const role = document.getElementById("role").value;
  const criteria = document.getElementById("criteria").value;

  await fetch(`${API}/jobs/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ company, role, criteria })
  });

  alert("Job Added");

  document.getElementById("company").value = "";
  document.getElementById("role").value = "";
  document.getElementById("criteria").value = "";

  loadAdminJobs();
}

// DELETE JOB
async function deleteJob(id) {
  await fetch(`http://localhost:8080/jobs/delete/${id}`, {
    method: "DELETE"
  });

  loadAdminJobs(); // refresh
}



//apliocaytion of ptudent for admin 
async function loadApplications() {
  const res = await fetch("http://localhost:8080/applications/all");
  const apps = await res.json();

  let html = "";

  apps.forEach(app => {
    html += `
      <tr>
        <td>${app.user?.name || "N/A"}</td>
        <td>${app.user?.semester || "N/A"}</td>
        <td>${app.user?.phone || "N/A"}</td>
        <td>${app.user?.email || "N/A"}</td>
        <td>${app.job?.role || "N/A"} (${app.job?.company || "N/A"})</td>
        <td>${app.status}</td>
      </tr>
    `;
  });

  const appTable = document.getElementById("applicationsData");
if (!appTable) return;
appTable.innerHTML = html;
}

//student form 
async function submitApplication() {
  const jobId = localStorage.getItem("jobId");

  await fetch(`${API}/applications/apply?userId=1&jobId=${jobId}`, {
    method: "POST"
  });

  alert("Applied Successfully! Waiting for response...");

  window.location.href = "dashboard.html";
}


//Scoller animation
const elements = document.querySelectorAll("section");

window.addEventListener("scroll", () => {
  elements.forEach(el => {
    const pos = el.getBoundingClientRect().top;

    if (pos < window.innerHeight - 100) {
      el.style.opacity = 1;
      el.style.transform = "translateY(0)";
    }
  });
});

//animated background
document.addEventListener("mousemove", (e) => {
  document.body.style.setProperty("--x", e.clientX + "px");
  document.body.style.setProperty("--y", e.clientY + "px");
});


//topbar scroll effect
window.addEventListener("scroll", () => {
  const topbar = document.querySelector(".topbar");

  if (window.scrollY > 50) {
    topbar.style.background = "rgba(2,6,23,0.85)";
    topbar.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
  } else {
    topbar.style.background = "rgba(2,6,23,0.4)";
    topbar.style.boxShadow = "none";
  }
});


//admin menu toggle
function toggleAdminMenu() {
  const menu = document.getElementById("adminMenu");
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

function adminLogin() {
  window.location.href = "login.html";
}

function adminRegister() {
  window.location.href = "register.html";
}
// LOGIN/REGISTER TOGGLE
let isLogin = true;

function toggleForm() {
  isLogin = !isLogin;

  document.getElementById("loginForm").style.display = isLogin ? "block" : "none";
  document.getElementById("registerForm").style.display = isLogin ? "none" : "block";

  document.getElementById("formTitle").innerText = isLogin ? "Login" : "Register";

  document.getElementById("toggleText").innerText =
    isLogin ? "Don't have an account? Register" : "Already have an account? Login";
}



//student dashboard stats

// PROFILE DROPDOWN
function toggleProfile() {
  const menu = document.getElementById("profileMenu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function editProfile() {
  window.location.href = "profile.html";
}

function loadProfile() {
  const user = JSON.parse(localStorage.getItem("user"));

  document.getElementById("name").value = user.name || "";
  document.getElementById("email").value = user.email || "";
  document.getElementById("phone").value = user.phone || "";
  document.getElementById("dob").value = user.dob || "";
  document.getElementById("enrollment").value = user.enrollment || "";
  document.getElementById("resume").value = user.resume || "";
}

async function saveProfile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const updated = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    dob: document.getElementById("dob").value,
    enrollment: document.getElementById("enrollment").value,
    resume: document.getElementById("resume").value,
  };

  const res = await fetch(`${API}/users/update/${user.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updated)
  });

  const data = await res.json();

  localStorage.setItem("user", JSON.stringify(data));

  alert("Profile Saved");
window.location.href = "dashboard.html";
}


async function submitApplication() {
  const jobId = localStorage.getItem("jobId");
  const user = JSON.parse(localStorage.getItem("user"));

  await fetch(`${API}/applications/apply?userId=${user.id}&jobId=${jobId}`, {
    method: "POST"
  });

  alert("Applied Successfully!");
  window.location.href = "dashboard.html";
}




///reset func

async function resetPassword() {

  const enrollment = document.getElementById("enrollment").value;
  const email = document.getElementById("email").value;
  const newPassword = document.getElementById("newPassword").value;

  if (!enrollment || !email || !newPassword) {
    alert("All fields required");
    return;
  }

  const res = await fetch(`${API}/users/reset-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ enrollment, email, password: newPassword })
  });

  if (res.ok) {
    alert("Password Updated Successfully");
    window.location.href = "slogin.html";
  } else {
    alert("Invalid Enrollment or Email");
  }
}
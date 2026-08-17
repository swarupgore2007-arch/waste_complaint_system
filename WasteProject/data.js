/**
 * data.js — Centralized demo data for the Smart Waste Segregation prototype.
 *
 * This file is the single source of truth for societies, users, flats,
 * complaints, escalations, and resolutions across all pages.
 *
 * IMPORTANT: All data here is fictional/demo data for a college project.
 */

/* ───────────────── Constants ───────────────── */
var STORAGE_KEYS = {
  complaints: "waste-demo-complaints",
  escalations: "waste-demo-escalations",
  resolutions: "waste-demo-resolutions",
  flats: "waste-demo-flats",
  users: "waste-demo-users",
  theme: "waste-dashboard-theme",
  adminSession: "waste-demo-admin",
  societySession: "waste-demo-society",
  userSession: "waste-demo-user",
  roleSession: "waste-demo-role"
};

/* ───────────────── Societies ───────────────── */
var societies = [
  { id: "S001", name: "Shree Ganesh Society", lat: 19.0747, lng: 72.8795, segregationRate: 90, wasteIssue: "Proper segregation followed", status: "GREEN" },
  { id: "S002", name: "ABC Heights", lat: 19.0413, lng: 72.8648, segregationRate: 45, wasteIssue: "Needs attention", status: "RED" },
  { id: "S003", name: "Green Valley Society", lat: 19.1115, lng: 72.9280, segregationRate: 85, wasteIssue: "Proper segregation followed", status: "GREEN" },
  { id: "S004", name: "Laxmi Residency", lat: 19.1454, lng: 72.9372, segregationRate: 55, wasteIssue: "Needs attention", status: "RED" },
  { id: "S005", name: "Sai Residency", lat: 19.1176, lng: 72.9060, segregationRate: 88, wasteIssue: "Proper segregation followed", status: "GREEN" },
  { id: "S006", name: "Krishna Apartments", lat: 19.0990, lng: 72.8470, segregationRate: 42, wasteIssue: "Needs attention", status: "RED" }
];

/* ───────────────── Default Users ───────────────── */
var defaultUsers = [
  // Flat Owners / Residents
  { id: "U001", name: "Rahul Sharma", role: "resident", roleType: "flat_owner", societyId: "S001", flat: "A-203", flatId: "F003", username: "rahul.a203", email: "rahul@example.com", phone: "9876543210", password: "demo123" },
  { id: "U002", name: "Priya Shah", role: "resident", roleType: "flat_owner", societyId: "S003", flat: "B-104", flatId: "F008", username: "priya.b104", email: "priya@example.com", phone: "9823456789", password: "demo123" },
  { id: "U003", name: "Amit Patil", role: "resident", roleType: "flat_owner", societyId: "S004", flat: "C-302", flatId: "F010", username: "amit.c302", email: "amit@example.com", phone: "9765432100", password: "demo123" },
  { id: "U006", name: "Sneha Desai", role: "resident", roleType: "flat_owner", societyId: "S002", flat: "A-101", flatId: "F005", username: "sneha.a101", email: "sneha@example.com", phone: "9812345670", password: "demo123" },
  { id: "U007", name: "Vikram Mehta", role: "resident", roleType: "flat_owner", societyId: "S001", flat: "A-101", flatId: "F001", username: "vikram.a101", email: "vikram@example.com", phone: "9834567890", password: "demo123" },
  // Secretaries
  { id: "U004", name: "Meena Joshi", role: "secretary", societyId: "S001", email: "meena@example.com", username: "meena.sec", password: "demo123" },
  { id: "U005", name: "Suresh Kulkarni", role: "secretary", societyId: "S002", email: "suresh@example.com", username: "suresh.sec", password: "demo123" },
  { id: "U008", name: "Rajesh Nair", role: "secretary", societyId: "S003", email: "rajesh@example.com", username: "rajesh.sec", password: "demo123" },
  { id: "U009", name: "Sunita Rao", role: "secretary", societyId: "S004", email: "sunita@example.com", username: "sunita.sec", password: "demo123" },
  { id: "U010", name: "Deepak Verma", role: "secretary", societyId: "S005", email: "deepak@example.com", username: "deepak.sec", password: "demo123" },
  { id: "U011", name: "Kavita Shinde", role: "secretary", societyId: "S006", email: "kavita@example.com", username: "kavita.sec", password: "demo123" },
  // Admin
  { id: "ADMIN", name: "Admin", role: "admin", email: "admin", username: "admin", password: "admin123" }
];

/* ───────────────── Default Flats ───────────────── */
var defaultFlats = [
  { id: "F001", societyId: "S001", number: "A-101", building: "Building A", floor: "1", residentId: "U007", status: "Registered" },
  { id: "F002", societyId: "S001", number: "A-102", building: "Building A", floor: "1", residentId: null, status: "Vacant" },
  { id: "F003", societyId: "S001", number: "A-203", building: "Building A", floor: "2", residentId: "U001", status: "Registered" },
  { id: "F004", societyId: "S001", number: "A-204", building: "Building A", floor: "2", residentId: null, status: "Vacant" },
  { id: "F005", societyId: "S002", number: "A-101", building: "Tower 1", floor: "1", residentId: "U006", status: "Registered" },
  { id: "F006", societyId: "S002", number: "A-102", building: "Tower 1", floor: "1", residentId: null, status: "Vacant" },
  { id: "F007", societyId: "S002", number: "B-201", building: "Tower 2", floor: "2", residentId: null, status: "Vacant" },
  { id: "F008", societyId: "S003", number: "B-104", building: "Wing B", floor: "1", residentId: "U002", status: "Registered" },
  { id: "F009", societyId: "S003", number: "B-105", building: "Wing B", floor: "1", residentId: null, status: "Vacant" },
  { id: "F010", societyId: "S004", number: "C-302", building: "Block C", floor: "3", residentId: "U003", status: "Registered" },
  { id: "F011", societyId: "S004", number: "C-303", building: "Block C", floor: "3", residentId: null, status: "Vacant" },
  { id: "F012", societyId: "S005", number: "D-101", building: "Wing D", floor: "1", residentId: null, status: "Vacant" },
  { id: "F013", societyId: "S006", number: "E-101", building: "East Wing", floor: "1", residentId: null, status: "Vacant" }
];

/* ───────────────── Default Complaints ───────────────── */
var defaultComplaints = [
  { id: "C-101", societyId: "S001", residentId: "U001", userId: "U001", flatId: "F003", flat: "A-203", society: "Shree Ganesh Society", area: "Shree Ganesh Society", lat: 19.0747, lng: 72.8795, type: "Mixed Waste", description: "Wet and dry waste being mixed.", priority: "High", status: "Pending", date: "2026-08-08" },
  { id: "C-102", societyId: "S001", residentId: "U007", userId: "U007", flatId: "F001", flat: "A-101", society: "Shree Ganesh Society", area: "Shree Ganesh Society", lat: 19.0748, lng: 72.8802, type: "Overflowing Bin", description: "Collection bin is overflowing after rain.", priority: "Medium", status: "Resolved", date: "2026-08-07" },
  { id: "C-103", societyId: "S002", residentId: "U006", userId: "U006", flatId: "F005", flat: "A-101", society: "ABC Heights", area: "ABC Heights", lat: 19.0413, lng: 72.8648, type: "Mixed Waste", description: "Wet and dry waste being mixed.", priority: "High", status: "Pending", date: "2026-08-09" },
  { id: "C-104", societyId: "S002", residentId: "U006", userId: "U006", flatId: "F005", flat: "A-101", society: "ABC Heights", area: "ABC Heights", lat: 19.0422, lng: 72.8660, type: "Illegal Dumping", description: "Waste dumped near the society entrance.", priority: "High", status: "Pending", date: "2026-08-08" },
  { id: "C-105", societyId: "S002", residentId: "U006", userId: "U006", flatId: "F005", flat: "A-101", society: "ABC Heights", area: "ABC Heights", lat: 19.0405, lng: 72.8642, type: "Waste Burning", description: "Leaf litter and dry waste were burnt near the gate.", priority: "High", status: "Escalated", date: "2026-08-06", escalationReason: "Repeated burning incidents; needs municipal intervention.", escalatedBy: "Society Secretary", escalationDate: "2026-08-07" },
  { id: "C-106", societyId: "S002", residentId: "U006", userId: "U006", flatId: "F005", flat: "A-101", society: "ABC Heights", area: "ABC Heights", lat: 19.0420, lng: 72.8654, type: "Drain Blockage", description: "Drain inlet covered with plastic and mixed waste.", priority: "Medium", status: "Resolved", date: "2026-08-05" },
  { id: "C-107", societyId: "S003", residentId: "U002", userId: "U002", flatId: "F008", flat: "B-104", society: "Green Valley Society", area: "Green Valley Society", lat: 19.1115, lng: 72.9280, type: "Overflowing Bin", description: "Waste bin filled beyond capacity.", priority: "Low", status: "Resolved", date: "2026-08-07" },
  { id: "C-108", societyId: "S004", residentId: "U003", userId: "U003", flatId: "F010", flat: "C-302", society: "Laxmi Residency", area: "Laxmi Residency", lat: 19.1454, lng: 72.9372, type: "Illegal Dumping", description: "Mixed waste dumped outside the back gate.", priority: "Medium", status: "Pending", date: "2026-08-08" },
  { id: "C-109", societyId: "S004", residentId: "U003", userId: "U003", flatId: "F010", flat: "C-302", society: "Laxmi Residency", area: "Laxmi Residency", lat: 19.1462, lng: 72.9379, type: "Waste Burning", description: "Dry waste burning observed near the service lane.", priority: "High", status: "Pending", date: "2026-08-09" },
  { id: "C-110", societyId: "S005", residentId: null, userId: null, flatId: null, flat: null, society: "Sai Residency", area: "Sai Residency", lat: 19.1176, lng: 72.9060, type: "Mixed Waste", description: "Resident bins are properly labelled and separated.", priority: "Low", status: "Resolved", date: "2026-08-04" },
  { id: "C-111", societyId: "S006", residentId: null, userId: null, flatId: null, flat: null, society: "Krishna Apartments", area: "Krishna Apartments", lat: 19.0990, lng: 72.8470, type: "Mixed Waste", description: "No segregation bins provided.", priority: "High", status: "Pending", date: "2026-08-09" },
  { id: "C-112", societyId: "S006", residentId: null, userId: null, flatId: null, flat: null, society: "Krishna Apartments", area: "Krishna Apartments", lat: 19.0985, lng: 72.8475, type: "Drain Blockage", description: "Waste debris blocking basement drainage.", priority: "High", status: "Escalated", date: "2026-08-07", escalationReason: "Basement drain blockage causing flooding risk.", escalatedBy: "Society Secretary", escalationDate: "2026-08-08" }
];

/* ───────────────── Default Escalations ───────────────── */
var defaultEscalations = [
  { id: "E-001", complaintId: "C-105", societyId: "S002", reason: "Repeated burning incidents; needs municipal intervention.", date: "2026-08-07", escalatedBy: "U005" },
  { id: "E-002", complaintId: "C-112", societyId: "S006", reason: "Basement drain blockage causing flooding risk.", date: "2026-08-08", escalatedBy: "U005" }
];

/* ───────────────── Default Resolutions ───────────────── */
var defaultResolutions = [];

/* ───────────────── Storage Helpers ───────────────── */
function normalizeComplaintRecord(complaint) {
  if (!complaint || typeof complaint !== "object") return null;
  var lat = Number.isFinite(Number(complaint.lat)) ? Number(complaint.lat) : 19.0760;
  var lng = Number.isFinite(Number(complaint.lng)) ? Number(complaint.lng) : 72.8777;
  return Object.assign({}, complaint, {
    id: complaint.id || "C-" + Date.now(),
    societyId: complaint.societyId || "S000",
    residentId: complaint.residentId || complaint.userId || null,
    userId: complaint.userId || complaint.residentId || null,
    flatId: complaint.flatId || null,
    flat: complaint.flat || null,
    society: complaint.society || "Unknown Society",
    area: complaint.area || complaint.society || "Unknown Society",
    type: complaint.type || "Mixed Waste",
    description: complaint.description || "Waste issue reported.",
    priority: complaint.priority || "Medium",
    status: complaint.status || "Pending",
    date: complaint.date || new Date().toISOString().slice(0, 10),
    escalationReason: complaint.escalationReason || null,
    escalatedBy: complaint.escalatedBy || null,
    escalationDate: complaint.escalationDate || null,
    lat: lat,
    lng: lng
  });
}

function readStoredComplaints() {
  try {
    var storedValue = window.localStorage.getItem(STORAGE_KEYS.complaints);
    if (!storedValue) return defaultComplaints.map(function (c) { return Object.assign({}, c); });
    var parsedValue = JSON.parse(storedValue);
    if (!Array.isArray(parsedValue) || parsedValue.length === 0) {
      return defaultComplaints.map(function (c) { return Object.assign({}, c); });
    }
    var validComplaints = parsedValue.map(normalizeComplaintRecord).filter(Boolean);
    return validComplaints.length ? validComplaints : defaultComplaints.map(function (c) { return Object.assign({}, c); });
  } catch (e) {
    return defaultComplaints.map(function (c) { return Object.assign({}, c); });
  }
}

function persistComplaints(complaintList) {
  try {
    var sanitized = complaintList.map(normalizeComplaintRecord).filter(Boolean);
    window.localStorage.setItem(STORAGE_KEYS.complaints, JSON.stringify(sanitized));
  } catch (e) {
    /* Storage may be unavailable in restricted browsers */
  }
}

function readStoredEscalations() {
  try {
    var stored = window.localStorage.getItem(STORAGE_KEYS.escalations);
    if (!stored) return defaultEscalations.map(function (e) { return Object.assign({}, e); });
    var parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length ? parsed : defaultEscalations.map(function (e) { return Object.assign({}, e); });
  } catch (e) {
    return defaultEscalations.map(function (e) { return Object.assign({}, e); });
  }
}

function persistEscalations(list) {
  try {
    window.localStorage.setItem(STORAGE_KEYS.escalations, JSON.stringify(list));
  } catch (e) { /* ignore */ }
}

function readStoredResolutions() {
  try {
    var stored = window.localStorage.getItem(STORAGE_KEYS.resolutions);
    if (!stored) return defaultResolutions.map(function (r) { return Object.assign({}, r); });
    var parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function persistResolutions(list) {
  try {
    window.localStorage.setItem(STORAGE_KEYS.resolutions, JSON.stringify(list));
  } catch (e) { /* ignore */ }
}

/* ───────────────── Flats & Users Storage ───────────────── */
function readStoredFlats() {
  try {
    var stored = window.localStorage.getItem(STORAGE_KEYS.flats);
    if (!stored) return defaultFlats.map(function (f) { return Object.assign({}, f); });
    var parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length ? parsed : defaultFlats.map(function (f) { return Object.assign({}, f); });
  } catch (e) {
    return defaultFlats.map(function (f) { return Object.assign({}, f); });
  }
}

function persistFlats(list) {
  try {
    window.localStorage.setItem(STORAGE_KEYS.flats, JSON.stringify(list));
  } catch (e) {}
}

function readStoredUsers() {
  try {
    var stored = window.localStorage.getItem(STORAGE_KEYS.users);
    if (!stored) return defaultUsers.map(function (u) { return Object.assign({}, u); });
    var parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length ? parsed : defaultUsers.map(function (u) { return Object.assign({}, u); });
  } catch (e) {
    return defaultUsers.map(function (u) { return Object.assign({}, u); });
  }
}

function persistUsers(list) {
  try {
    window.localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(list));
  } catch (e) {}
}

/* ───────────────── Society Status Logic ───────────────── */
function getSocietyComplaints(societyId, complaintList) {
  return (complaintList || []).filter(function (c) { return c.societyId === societyId; });
}

function getSocietyComplaintSummary(societyId, complaintList) {
  var sc = getSocietyComplaints(societyId, complaintList);
  var unresolved = sc.filter(function (c) { return c.status !== "Resolved"; });
  return {
    total: sc.length,
    pending: sc.filter(function (c) { return c.status === "Pending"; }).length,
    inProgress: sc.filter(function (c) { return c.status === "In Progress"; }).length,
    escalated: sc.filter(function (c) { return c.status === "Escalated"; }).length,
    resolved: sc.filter(function (c) { return c.status === "Resolved"; }).length,
    unresolved: unresolved.length,
    highPriority: sc.filter(function (c) { return c.priority === "High" && c.status !== "Resolved"; }).length,
    recentIssue: (sc.find(function (c) { return c.status !== "Resolved"; }) || {}).type || "Proper segregation followed"
  };
}

function calculateSocietyStatus(societyId, complaintList) {
  var summary = getSocietyComplaintSummary(societyId, complaintList);
  if (summary.highPriority > 0 || summary.unresolved > 2) {
    return "RED";
  }
  return "GREEN";
}

function refreshAllSocietyStatuses(complaintList) {
  societies.forEach(function (society) {
    var next = calculateSocietyStatus(society.id, complaintList);
    society.status = next;
    society.wasteIssue = next === "GREEN" ? "Proper segregation followed" : "Needs attention";
  });
}

/* ───────────────── User / Auth Helpers ───────────────── */
function getSocietyById(id) {
  return societies.find(function (s) { return s.id === id; }) || null;
}

function getUserById(id) {
  var list = readStoredUsers();
  return list.find(function (u) { return u.id === id; }) || null;
}

function getUserByEmail(email) {
  var list = readStoredUsers();
  return list.find(function (u) { return u.email && u.email.toLowerCase() === email.toLowerCase(); }) || null;
}

function getResidentName(residentId) {
  var u = getUserById(residentId);
  return u ? u.name : "—";
}

function getFlatsForSociety(societyId) {
  var list = readStoredFlats();
  return list.filter(function (f) { return f.societyId === societyId; });
}

function getResidentsForSociety(societyId) {
  var list = readStoredUsers();
  return list.filter(function (u) { return u.societyId === societyId && (u.role === "resident" || u.role === "flat_owner"); });
}

/* ───────────────── Session Helpers ───────────────── */
function setLoginSession(role, userId, societyName) {
  // Clear all role-specific keys first to prevent stale data
  sessionStorage.removeItem(STORAGE_KEYS.adminSession);
  sessionStorage.removeItem(STORAGE_KEYS.societySession);
  sessionStorage.setItem(STORAGE_KEYS.roleSession, role);
  sessionStorage.setItem(STORAGE_KEYS.userSession, userId);
  if (role === "admin") {
    sessionStorage.setItem(STORAGE_KEYS.adminSession, "true");
  } else if (societyName) {
    sessionStorage.setItem(STORAGE_KEYS.societySession, societyName);
  }
}

function clearLoginSession() {
  sessionStorage.removeItem(STORAGE_KEYS.roleSession);
  sessionStorage.removeItem(STORAGE_KEYS.userSession);
  sessionStorage.removeItem(STORAGE_KEYS.societySession);
  sessionStorage.removeItem(STORAGE_KEYS.adminSession);
}

function getLoggedInUser() {
  var userId = sessionStorage.getItem(STORAGE_KEYS.userSession);
  var role = sessionStorage.getItem(STORAGE_KEYS.roleSession);
  if (!userId || !role) return null;
  var user = getUserById(userId);
  if (!user) return null;
  return { user: user, role: role };
}

/* ───────────────── Theme Helpers ───────────────── */
function getSavedTheme() {
  try { return sessionStorage.getItem(STORAGE_KEYS.theme); } catch (e) { return null; }
}

function saveTheme(theme) {
  try { sessionStorage.setItem(STORAGE_KEYS.theme, theme); } catch (e) { /* ignore */ }
}

function applyThemeOnLoad() {
  if (getSavedTheme() === "dark") document.body.classList.add("dark-mode");
}

function setupThemeToggle(toggleBtn, labelEl, onAfterToggle) {
  if (!toggleBtn || !labelEl) return;
  function sync() {
    var dark = document.body.classList.contains("dark-mode");
    toggleBtn.setAttribute("aria-pressed", String(dark));
    labelEl.textContent = dark ? "Dark" : "Light";
  }
  sync();
  toggleBtn.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    saveTheme(document.body.classList.contains("dark-mode") ? "dark" : "light");
    sync();
    if (typeof onAfterToggle === "function") onAfterToggle();
  });
}

/* ───────────────── Next ID Helpers ───────────────── */
function nextComplaintId(complaintList) {
  var max = 100;
  complaintList.forEach(function (c) {
    var num = parseInt((c.id || "").replace("C-", "").replace("C", ""), 10);
    if (!isNaN(num) && num > max) max = num;
  });
  return "C-" + String(max + 1).padStart(3, "0");
}

function nextEscalationId(escalationList) {
  var max = 0;
  escalationList.forEach(function (e) {
    var num = parseInt((e.id || "").replace("E-", "").replace("E", ""), 10);
    if (!isNaN(num) && num > max) max = num;
  });
  return "E-" + String(max + 1).padStart(3, "0");
}

function nextResolutionId(resolutionList) {
  var max = 0;
  resolutionList.forEach(function (r) {
    var num = parseInt((r.id || "").replace("R-", "").replace("R", ""), 10);
    if (!isNaN(num) && num > max) max = num;
  });
  return "R-" + String(max + 1).padStart(3, "0");
}

function nextFlatId(flatList) {
  var max = 0;
  flatList.forEach(function (f) {
    var num = parseInt((f.id || "").replace("F-", "").replace("F", ""), 10);
    if (!isNaN(num) && num > max) max = num;
  });
  return "F" + String(max + 1).padStart(3, "0");
}

function nextUserId(userList) {
  var max = 0;
  userList.forEach(function (u) {
    var num = parseInt((u.id || "").replace("U-", "").replace("U", ""), 10);
    if (!isNaN(num) && num > max) max = num;
  });
  return "U" + String(max + 1).padStart(3, "0");
}

/* ───────────────── Demo Credentials Generator ───────────────── */
function generateDemoCredentials(ownerName, flatNumber, existingUsers) {
  var cleanName = (ownerName || "owner").trim().toLowerCase().split(/\s+/)[0].replace(/[^a-z0-9]/g, "");
  var cleanFlat = (flatNumber || "flat").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  var baseUsername = cleanName + "." + cleanFlat;
  var username = baseUsername;

  var userList = existingUsers || readStoredUsers();
  var count = 1;
  while (userList.some(function (u) { return u.username && u.username.toLowerCase() === username.toLowerCase(); })) {
    username = baseUsername + "." + count;
    count++;
  }

  // Password: initials uppercase + @ + flat number e.g. RS@101
  var words = (ownerName || "RS").trim().split(/\s+/);
  var initials = words.map(function (w) { return w.charAt(0).toUpperCase(); }).join("");
  var flatDigits = (flatNumber || "101").replace(/[^0-9]/g, "") || "101";
  var password = (initials || "RS") + "@" + flatDigits;

  return {
    username: username,
    password: password
  };
}

/* ───────────────── Expose globally ───────────────── */
window.DEMO_DATA = {
  STORAGE_KEYS: STORAGE_KEYS,
  societies: societies,
  defaultUsers: defaultUsers,
  defaultFlats: defaultFlats,
  defaultComplaints: defaultComplaints,
  defaultEscalations: defaultEscalations,
  defaultResolutions: defaultResolutions,
  normalizeComplaintRecord: normalizeComplaintRecord,
  readStoredComplaints: readStoredComplaints,
  persistComplaints: persistComplaints,
  readStoredEscalations: readStoredEscalations,
  persistEscalations: persistEscalations,
  readStoredResolutions: readStoredResolutions,
  persistResolutions: persistResolutions,
  readStoredFlats: readStoredFlats,
  persistFlats: persistFlats,
  readStoredUsers: readStoredUsers,
  persistUsers: persistUsers,
  getSocietyComplaints: getSocietyComplaints,
  getSocietyComplaintSummary: getSocietyComplaintSummary,
  calculateSocietyStatus: calculateSocietyStatus,
  refreshAllSocietyStatuses: refreshAllSocietyStatuses,
  getSocietyById: getSocietyById,
  getUserById: getUserById,
  getUserByEmail: getUserByEmail,
  getResidentName: getResidentName,
  getFlatsForSociety: getFlatsForSociety,
  getResidentsForSociety: getResidentsForSociety,
  setLoginSession: setLoginSession,
  clearLoginSession: clearLoginSession,
  getLoggedInUser: getLoggedInUser,
  getSavedTheme: getSavedTheme,
  saveTheme: saveTheme,
  applyThemeOnLoad: applyThemeOnLoad,
  setupThemeToggle: setupThemeToggle,
  nextComplaintId: nextComplaintId,
  nextEscalationId: nextEscalationId,
  nextResolutionId: nextResolutionId,
  nextFlatId: nextFlatId,
  nextUserId: nextUserId,
  generateDemoCredentials: generateDemoCredentials
};


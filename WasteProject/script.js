/* Mumbai waste-segregation sample data, dashboard statistics, charts, and Leaflet layers. */
var DEFAULT_VIEW = [19.0760, 72.8777];
var DEFAULT_ZOOM = 12;
var FOLLOWING = "following";
var NOT_FOLLOWING = "not-following";
var PROTOTYPE_STATUS_NOTE = "Prototype/demo status logic - not an official municipal classification.";

var D = window.DEMO_DATA || {};

var defaultSocieties = [
  { id: "S001", name: "Shree Ganesh Society", lat: 19.0747, lng: 72.8795, segregationRate: 90, wasteIssue: "Proper segregation followed", status: "GREEN" },
  { id: "S002", name: "ABC Heights", lat: 19.0413, lng: 72.8648, segregationRate: 45, wasteIssue: "Needs attention", status: "RED" },
  { id: "S003", name: "Green Valley Society", lat: 19.1115, lng: 72.9280, segregationRate: 85, wasteIssue: "Proper segregation followed", status: "GREEN" },
  { id: "S004", name: "Laxmi Residency", lat: 19.1454, lng: 72.9372, segregationRate: 55, wasteIssue: "Needs attention", status: "RED" },
  { id: "S005", name: "Sai Residency", lat: 19.1176, lng: 72.9060, segregationRate: 88, wasteIssue: "Proper segregation followed", status: "GREEN" },
  { id: "S006", name: "Krishna Apartments", lat: 19.0990, lng: 72.8470, segregationRate: 42, wasteIssue: "Needs attention", status: "RED" }
];

var societies = (D.societies && D.societies.length) ? D.societies : defaultSocieties;

function normalizeComplaintRecord(c) {
  if (D.normalizeComplaintRecord) return D.normalizeComplaintRecord(c);
  if (!c || typeof c !== "object") return null;
  var lat = Number.isFinite(Number(c.lat)) ? Number(c.lat) : 19.0760;
  var lng = Number.isFinite(Number(c.lng)) ? Number(c.lng) : 72.8777;
  return Object.assign({}, c, {
    id: c.id || "C-" + Date.now(),
    societyId: c.societyId || "S000",
    residentId: c.residentId || null,
    society: c.society || "Unknown Society",
    area: c.area || c.society || "Unknown Society",
    type: c.type || "Mixed Waste",
    description: c.description || "Waste issue reported.",
    priority: c.priority || "Medium",
    status: c.status || "Pending",
    date: c.date || new Date().toISOString().slice(0, 10),
    lat: lat,
    lng: lng
  });
}

function readStoredComplaints() {
  if (D.readStoredComplaints) return D.readStoredComplaints();
  try {
    var stored = window.localStorage.getItem("waste-demo-complaints");
    if (!stored) return [];
    var parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.map(normalizeComplaintRecord).filter(Boolean) : [];
  } catch (e) {
    return [];
  }
}

function persistComplaints(list) {
  if (D.persistComplaints) {
    D.persistComplaints(list);
    return;
  }
  try {
    window.localStorage.setItem("waste-demo-complaints", JSON.stringify(list));
  } catch (e) {}
}

var complaints = readStoredComplaints().map(normalizeComplaintRecord).filter(Boolean);
if (!complaints.length && D.defaultComplaints) {
  complaints = D.defaultComplaints.map(function (c) { return Object.assign({}, c); });
}

var wasteAreas = societies.map(function (society) {
  return {
    id: society.id,
    name: society.name,
    lat: society.lat,
    lng: society.lng,
    segregationRate: society.segregationRate,
    ward: society.name.split(" ")[0] || "Society",
    status: society.status === "GREEN" ? FOLLOWING : NOT_FOLLOWING,
    description: society.wasteIssue,
    wasteIssue: society.wasteIssue
  };
});

var floodZones = [
  { area: "Kurla", risk: "high", lat: 19.0740, lng: 72.8830, radius: 950, reason: "Low-lying area and drainage blockage.", drainage: "Needs maintenance" },
  { area: "Sion", risk: "high", lat: 19.0431, lng: 72.8614, radius: 820, reason: "Waterlogging-prone junctions with heavy runoff.", drainage: "Needs maintenance" },
  { area: "Chembur", risk: "high", lat: 19.0626, lng: 72.9005, radius: 880, reason: "Dense built-up area with slow storm-water discharge.", drainage: "Requires desilting" },
  { area: "Ghatkopar", risk: "medium", lat: 19.0820, lng: 72.9045, radius: 850, reason: "Moderate runoff near low-lying road pockets.", drainage: "Partially maintained" },
  { area: "Bhandup", risk: "medium", lat: 19.1454, lng: 72.9372, radius: 780, reason: "Drain capacity pressure during heavy rainfall.", drainage: "Partially maintained" },
  { area: "Powai", risk: "low", lat: 19.1176, lng: 72.9060, radius: 780, reason: "Better elevation and fewer reported blockages.", drainage: "Maintained" },
  { area: "Vikhroli", risk: "low", lat: 19.1115, lng: 72.9280, radius: 720, reason: "Relatively stable runoff pathways in this demo data.", drainage: "Maintained" }
];

var drainageRoutes = [
  { label: "Main Drainage Line", condition: "Needs maintenance", points: [[19.173, 72.957], [19.145, 72.937], [19.117, 72.906], [19.078, 72.908], [19.063, 72.901], [19.043, 72.861]] },
  { label: "Main Drainage Line", condition: "Partially maintained", points: [[19.186, 72.848], [19.165, 72.849], [19.137, 72.848], [19.120, 72.847], [19.081, 72.841], [19.054, 72.840]] },
  { label: "Secondary Drainage Line", condition: "Needs maintenance", points: [[19.130, 72.936], [19.112, 72.928], [19.117, 72.906], [19.073, 72.883], [19.043, 72.861]] },
  { label: "Secondary Drainage Line", condition: "Maintained", points: [[19.060, 72.830], [19.054, 72.840], [19.043, 72.861], [19.018, 72.857], [18.998, 72.830]] }
];

var map = null;
var openStreetMap = null;
var wasteLayer = null;
var drainageLayer = null;
var complaintLayer = null;
var floodRiskLayer = null;
var areaMarkers = new Map();
var complaintMarkers = new Map();
var activeWasteFilter = "all";
var pieChart = null;
var barChart = null;

function hasLeaflet() {
  return typeof window !== "undefined" && !!window.L;
}

function initMap() {
  if (!hasLeaflet()) return;
  var mapContainer = document.getElementById("map");
  if (!mapContainer) return;

  if (map) return; // already initialized

  try {
    map = window.L.map("map", { zoomControl: false }).setView(DEFAULT_VIEW, DEFAULT_ZOOM);
    window.L.control.zoom({ position: "bottomright" }).addTo(map);

    openStreetMap = window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    wasteLayer = window.L.layerGroup().addTo(map);
    drainageLayer = window.L.layerGroup().addTo(map);
    complaintLayer = window.L.layerGroup().addTo(map);
    floodRiskLayer = window.L.layerGroup().addTo(map);
  } catch (e) {
    console.warn("Map initialization warning:", e);
  }
}

function statusLabel(status) {
  return status === FOLLOWING ? "Following Waste Segregation" : "Not Following Waste Segregation";
}

function makeMarkerIcon(markerClass) {
  if (!hasLeaflet() || !window.L.divIcon) return null;
  return window.L.divIcon({
    className: "custom-marker",
    html: '<div class="marker-pin ' + markerClass + '"></div>',
    iconSize: [27, 27],
    iconAnchor: [13, 27],
    popupAnchor: [0, -27]
  });
}

function makeComplaintIcon(priority) {
  if (!hasLeaflet() || !window.L.divIcon) return null;
  return window.L.divIcon({
    className: "complaint-marker",
    html: '<div class="complaint-badge priority-' + (priority || "medium").toLowerCase() + '">!</div>',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18]
  });
}

function getSocietyComplaints(societyId) {
  return complaints.filter(function (c) { return c.societyId === societyId; });
}

function getSocietyComplaintSummary(societyId) {
  var sc = getSocietyComplaints(societyId);
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

function getSocietyStatusFromComplaints(societyId) {
  var summary = getSocietyComplaintSummary(societyId);
  if (summary.highPriority > 0 || summary.unresolved > 2) {
    return "RED";
  }
  return "GREEN";
}

function refreshSocietyStatuses() {
  societies.forEach(function (society) {
    var nextStatus = getSocietyStatusFromComplaints(society.id);
    society.status = nextStatus;
    society.wasteIssue = nextStatus === "GREEN" ? "Proper segregation followed" : "Needs attention";
    var match = wasteAreas.find(function (area) { return area.id === society.id; });
    if (match) {
      match.status = nextStatus === "GREEN" ? FOLLOWING : NOT_FOLLOWING;
      match.description = society.wasteIssue;
      match.segregationRate = society.segregationRate;
    }
  });
}

function areaPopupMarkup(area) {
  var society = societies.find(function (entry) { return entry.id === area.id; }) || area;
  var stats = getSocietyComplaintSummary(society.id);
  var statusClass = area.status === FOLLOWING ? "status-following" : "status-not-following";
  var statusEmoji = society.status === "GREEN" ? "🟢" : "🔴";
  var wasteStatus = society.status === "GREEN" ? "Proper segregation followed" : "Needs attention";
  var mainIssue = society.status === "RED" ? '<p class="popup-row"><b>Main Issue:</b> ' + stats.recentIssue + '</p>' : "";

  return '<h2 class="popup-title">🏢 ' + society.name + '</h2>' +
    '<p class="popup-row"><b>Status:</b> <span class="' + statusClass + '">' + statusEmoji + ' ' + society.status + '</span></p>' +
    '<p class="popup-row"><b>Segregation:</b> ' + (society.segregationRate || area.segregationRate || 0) + '%</p>' +
    '<p class="popup-row"><b>Complaints:</b> ' + stats.total + '</p>' +
    '<p class="popup-row"><b>Pending:</b> ' + stats.pending + '</p>' +
    (stats.highPriority > 0 ? '<p class="popup-row"><b>High Priority:</b> ' + stats.highPriority + '</p>' : '') +
    '<p class="popup-row"><b>Resolved:</b> ' + stats.resolved + '</p>' +
    '<p class="popup-row"><b>Waste Status:</b> ' + wasteStatus + '</p>' +
    mainIssue +
    '<button class="popup-action-button" type="button" data-view-society="' + encodeURIComponent(society.name) + '">View Complaints</button>';
}

function complaintPopupMarkup(complaint) {
  var resident = complaint.residentId ? (D.getUserById ? D.getUserById(complaint.residentId) : null) : null;
  var residentName = resident ? resident.name : (complaint.residentId ? (D.getResidentName ? D.getResidentName(complaint.residentId) : "Resident") : "Resident");
  var flatInfo = complaint.flat ? complaint.flat : (complaint.flatId ? "Flat " + complaint.flatId : "—");
  var statusUpper = (complaint.status || "PENDING").toUpperCase().replace(" ", "_");
  var statusClass = complaint.status === "Resolved" ? "status-resolved" : (complaint.status === "In Progress" || complaint.status === "IN_PROGRESS") ? "status-progress" : complaint.status === "Escalated" ? "status-escalated" : "status-pending";
  var priorityClass = "priority-label-" + (complaint.priority || "medium").toLowerCase();
  var reason = complaint.escalationReason || "Repeated waste accumulation requiring municipal intervention.";
  var escalatedBy = complaint.escalatedBy || "Society Secretary";
  var escDate = complaint.escalationDate || complaint.date;

  var isResolved = complaint.status === "Resolved";
  var isInProgress = complaint.status === "In Progress" || complaint.status === "IN_PROGRESS";

  var actions = "";
  if (!isResolved) {
    actions = '<div class="popup-actions" style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap;">' +
      (!isInProgress ? '<button class="action-btn action-status" type="button" data-admin-progress="' + complaint.id + '">Mark In Progress</button>' : '') +
      '<button class="action-btn action-verify" type="button" data-admin-resolve="' + complaint.id + '">Mark Resolved</button>' +
    '</div>';
  }

  return '<div class="escalated-popup">' +
    '<h2 class="popup-title">⚠️ Escalated Complaint</h2>' +
    '<p class="popup-row"><b>Complaint ID:</b> ' + complaint.id + '</p>' +
    '<p class="popup-row"><b>Society:</b> ' + (complaint.society || complaint.area) + '</p>' +
    '<p class="popup-row"><b>Flat:</b> ' + flatInfo + '</p>' +
    '<p class="popup-row"><b>Resident:</b> ' + residentName + '</p>' +
    '<p class="popup-row"><b>Complaint:</b> ' + complaint.type + '</p>' +
    '<p class="popup-row"><b>Description:</b> ' + complaint.description + '</p>' +
    '<p class="popup-row"><b>Priority:</b> <span class="' + priorityClass + '">' + complaint.priority + '</span></p>' +
    '<p class="popup-row"><b>Status:</b> <span class="' + statusClass + '">' + statusUpper + '</span></p>' +
    '<p class="popup-row"><b>Reason:</b> ' + reason + '</p>' +
    '<p class="popup-row"><b>Escalated By:</b> ' + escalatedBy + '</p>' +
    '<p class="popup-row"><b>Date:</b> ' + escDate + '</p>' +
    actions +
  '</div>';
}

function floodPopupMarkup(zone) {
  return '<h2 class="popup-title">' + zone.area + '</h2>' +
    '<p class="popup-row"><b>Flood Risk:</b> <span class="risk-' + zone.risk + '">' + zone.risk.toUpperCase() + '</span></p>' +
    '<p class="popup-row"><b>Area:</b> ' + zone.area + '</p>' +
    '<p class="popup-row"><b>Reason:</b> ' + zone.reason + '</p>' +
    '<p class="popup-row"><b>Drainage Condition:</b> ' + zone.drainage + '</p>' +
    '<p class="popup-row"><b>Note:</b> Illustrative flood-risk zone for demo use only.</p>';
}

function addWasteMarkers() {
  if (!hasLeaflet() || !wasteLayer || !map) return;
  wasteLayer.clearLayers();
  areaMarkers.clear();
  var greenIcon = makeMarkerIcon("marker-green");
  var redIcon = makeMarkerIcon("marker-red");

  wasteAreas.forEach(function (area) {
    if (activeWasteFilter !== "all" && area.status !== activeWasteFilter) return;
    var marker = window.L.marker([area.lat, area.lng], {
      icon: area.status === FOLLOWING ? greenIcon : redIcon,
      title: area.name
    }).bindPopup(areaPopupMarkup(area), { closeButton: true, autoPanPadding: [25, 25] });

    marker.addTo(wasteLayer);
    areaMarkers.set(area.name.toLowerCase(), { area: area, marker: marker, layer: wasteLayer });
  });
}

function addDrainageRoutes() {
  if (!hasLeaflet() || !drainageLayer || !map) return;
  drainageRoutes.forEach(function (route) {
    window.L.polyline(route.points, {
      color: "#2176c9",
      weight: 5,
      opacity: .82,
      lineJoin: "round"
    })
      .bindPopup('<strong>' + route.label + '</strong><br>Storm-water drainage network<br><strong>Condition:</strong> ' + route.condition)
      .addTo(drainageLayer);
  });
}

var activeComplaintFilter = "active-municipal";

function addComplaintMarkers() {
  if (!hasLeaflet() || !complaintLayer || !map) return;
  complaintLayer.clearLayers();
  complaintMarkers.clear();

  // Municipal map displays active escalated and in-progress complaints by default
  var visibleComplaints = complaints.filter(function (complaint) {
    if (activeComplaintFilter === "active-municipal") {
      return complaint.status === "Escalated" || complaint.status === "In Progress" || complaint.status === "IN_PROGRESS";
    }
    if (activeComplaintFilter === "escalated") {
      return complaint.status === "Escalated";
    }
    if (activeComplaintFilter === "in-progress") {
      return complaint.status === "In Progress" || complaint.status === "IN_PROGRESS";
    }
    if (activeComplaintFilter === "pending") {
      return complaint.status === "Pending";
    }
    if (activeComplaintFilter === "resolved") {
      return complaint.status === "Resolved";
    }
    return true; // "all"
  });

  visibleComplaints.forEach(function (complaint) {
    var marker = window.L.marker([complaint.lat, complaint.lng], {
      icon: makeComplaintIcon(complaint.priority),
      title: complaint.id + " - " + complaint.type + " (" + complaint.status + ")"
    }).bindPopup(complaintPopupMarkup(complaint), { closeButton: true, autoPanPadding: [25, 25] });

    marker.addTo(complaintLayer);
    complaintMarkers.set(complaint.id.toLowerCase(), { complaint: complaint, marker: marker });
  });
}

function riskStyle(risk) {
  var styles = {
    low: { color: "#1f9d63", fillColor: "#1f9d63" },
    medium: { color: "#e89a20", fillColor: "#e89a20" },
    high: { color: "#d84955", fillColor: "#d84955" }
  };
  return Object.assign({}, styles[risk] || styles.medium, {
    weight: 2,
    opacity: .9,
    fillOpacity: .2
  });
}

function addFloodZones() {
  if (!hasLeaflet() || !floodRiskLayer || !map) return;
  floodZones.forEach(function (zone) {
    window.L.circle([zone.lat, zone.lng], Object.assign({
      radius: zone.radius
    }, riskStyle(zone.risk)))
      .bindPopup(floodPopupMarkup(zone), { closeButton: true, autoPanPadding: [25, 25] })
      .addTo(floodRiskLayer);
  });
}

function calculateStats() {
  var greenSocieties = societies.filter(function (s) { return s.status === "GREEN"; }).length;
  var redSocieties = societies.filter(function (s) { return s.status === "RED"; }).length;
  var escalatedCount = complaints.filter(function (c) { return c.status === "Escalated"; }).length;
  var inProgressCount = complaints.filter(function (c) { return c.status === "In Progress" || c.status === "IN_PROGRESS"; }).length;
  var resolvedCount = complaints.filter(function (c) { return c.status === "Resolved"; }).length;
  var pendingCount = complaints.filter(function (c) { return c.status === "Pending"; }).length;
  var highPriorityCount = complaints.filter(function (c) {
    var isActiveEsc = c.status === "Escalated" || c.status === "In Progress" || c.status === "IN_PROGRESS";
    return isActiveEsc && c.priority === "High";
  }).length;

  return {
    totalSocieties: societies.length,
    greenSocieties: greenSocieties,
    redSocieties: redSocieties,
    totalComplaints: complaints.length,
    pendingComplaints: pendingCount,
    escalatedComplaints: escalatedCount,
    inProgressComplaints: inProgressCount,
    resolvedComplaints: resolvedCount,
    highPriorityComplaints: highPriorityCount,
    highFloodRiskAreas: floodZones.filter(function (z) { return z.risk === "high"; }).length,
    drainageIssues: drainageRoutes.filter(function (r) { return r.condition.toLowerCase().indexOf("needs") !== -1 || r.condition.toLowerCase().indexOf("requires") !== -1; }).length
  };
}

function updateStatistics() {
  var stats = calculateStats();
  var setEl = function (id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = String(val);
  };
  setEl("totalAreas", stats.totalSocieties);
  setEl("followingAreas", stats.greenSocieties);
  setEl("notFollowingAreas", stats.redSocieties);
  setEl("totalComplaints", stats.totalComplaints);
  setEl("pendingComplaints", stats.pendingComplaints);
  setEl("highPriorityComplaints", stats.highPriorityComplaints);
  setEl("escalatedComplaints", stats.escalatedComplaints);
  setEl("inProgressComplaints", stats.inProgressComplaints);
  setEl("resolvedComplaints", stats.resolvedComplaints);
  setEl("highFloodRiskAreas", stats.highFloodRiskAreas);
  setEl("drainageIssues", stats.drainageIssues);
  setEl("greenCount", stats.greenSocieties);
  setEl("redCount", stats.redSocieties);
}

function getSocietyPerformance() {
  return societies
    .map(function (society) {
      return { label: society.name, rate: society.segregationRate };
    })
    .sort(function (a, b) { return b.rate - a.rate; });
}

function chartTheme() {
  var dark = document.body.classList.contains("dark-mode");
  return {
    text: dark ? "#edf5f7" : "#1f3341",
    muted: dark ? "#a7bac4" : "#647985",
    grid: dark ? "rgba(167, 186, 196, .22)" : "rgba(100, 121, 133, .18)"
  };
}

function renderCharts() {
  if (typeof Chart === "undefined") return;
  var pieCanvas = document.getElementById("segregationPieChart");
  var barCanvas = document.getElementById("performanceBarChart");
  if (!pieCanvas || !barCanvas) return;

  var stats = calculateStats();
  var theme = chartTheme();
  var performance = getSocietyPerformance();

  if (pieChart && typeof pieChart.destroy === "function") pieChart.destroy();
  if (barChart && typeof barChart.destroy === "function") barChart.destroy();

  try {
    if (Chart.defaults) {
      if (Chart.defaults.font) {
        Chart.defaults.font.family = 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      }
      Chart.defaults.color = theme.text;
    }
  } catch (e) {}

  try {
    pieChart = new Chart(pieCanvas, {
      type: "doughnut",
      data: {
        labels: ["Green Societies", "Red Societies"],
        datasets: [{
          data: [stats.greenSocieties, stats.redSocieties],
          backgroundColor: ["#1f9d63", "#d84955"],
          borderColor: document.body.classList.contains("dark-mode") ? "#18232b" : "#ffffff",
          borderWidth: 4,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "62%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: theme.text,
              boxWidth: 14,
              padding: 16
            }
          },
          tooltip: {
            callbacks: {
              label: function (context) { return context.label + ": " + context.parsed; }
            }
          }
        }
      }
    });
  } catch (e) {
    console.warn("Pie chart render warning:", e);
  }

  try {
    barChart = new Chart(barCanvas, {
      type: "bar",
      data: {
        labels: performance.map(function (item) { return item.label; }),
        datasets: [{
          label: "Society Segregation Percentage",
          data: performance.map(function (item) { return item.rate; }),
          backgroundColor: performance.map(function (item) { return item.rate >= 75 ? "#1f9d63" : item.rate >= 60 ? "#e89a20" : "#d84955"; }),
          borderRadius: 6,
          maxBarThickness: 34
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              color: theme.muted,
              callback: function (value) { return value + "%"; }
            },
            grid: { color: theme.grid },
            title: {
              display: true,
              text: "Segregation Percentage",
              color: theme.text,
              font: { weight: "bold" }
            }
          },
          x: {
            ticks: {
              color: theme.muted,
              maxRotation: 45,
              minRotation: 0
            },
            grid: { display: false }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context) { return (context.parsed ? context.parsed.y : "") + "% segregation compliance"; }
            }
          }
        }
      }
    });
  } catch (e) {
    console.warn("Bar chart render warning:", e);
  }
}

function showSearchMessage(message) {
  var searchMessage = document.getElementById("searchMessage");
  if (!searchMessage) return;
  searchMessage.textContent = message;
  searchMessage.classList.add("visible");
  window.clearTimeout(showSearchMessage.timer);
  showSearchMessage.timer = window.setTimeout(function () { searchMessage.classList.remove("visible"); }, 3600);
}

function findWasteArea(query) {
  return wasteAreas.find(function (area) { return area.name.toLowerCase() === query; })
    || wasteAreas.find(function (area) { return area.ward.toLowerCase() === query; })
    || wasteAreas.find(function (area) { return area.name.toLowerCase().indexOf(query) !== -1 || area.ward.toLowerCase().indexOf(query) !== -1; });
}

function findComplaint(query) {
  return complaints.find(function (c) { return c.id.toLowerCase() === query; })
    || complaints.find(function (c) { return c.area.toLowerCase().indexOf(query) !== -1 || c.type.toLowerCase().indexOf(query) !== -1; });
}

function focusWasteArea(area) {
  if (!hasLeaflet() || !map || !wasteLayer) return;
  if (!map.hasLayer(wasteLayer)) map.addLayer(wasteLayer);
  if (activeWasteFilter !== "all" && area.status !== activeWasteFilter) {
    setWasteFilter("all");
  }
  var markerEntry = areaMarkers.get(area.name.toLowerCase());
  map.flyTo([area.lat, area.lng], 15, { duration: .75 });
  if (markerEntry) {
    window.setTimeout(function () { markerEntry.marker.openPopup(); }, 800);
  }
}

function focusComplaint(complaint) {
  if (!hasLeaflet() || !map || !complaintLayer) return;
  if (!map.hasLayer(complaintLayer)) map.addLayer(complaintLayer);
  var markerEntry = complaintMarkers.get(complaint.id.toLowerCase());
  map.flyTo([complaint.lat, complaint.lng], 15, { duration: .75 });
  if (markerEntry) {
    window.setTimeout(function () { markerEntry.marker.openPopup(); }, 800);
  }
}

function setWasteFilter(filter) {
  activeWasteFilter = filter;
  document.querySelectorAll(".filter-button").forEach(function (button) {
    button.classList.toggle("active", button.dataset.filter === filter);
  });
  addWasteMarkers();
}

function setupSearch() {
  var searchInput = document.getElementById("areaSearch");
  var searchForm = document.getElementById("searchForm");
  if (!searchInput || !searchForm) return;

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var query = searchInput.value.trim().toLowerCase();
    if (!query) return;

    var areaMatch = findWasteArea(query);
    if (areaMatch) {
      focusWasteArea(areaMatch);
      return;
    }

    var complaintMatch = findComplaint(query);
    if (complaintMatch) {
      focusComplaint(complaintMatch);
      return;
    }

    showSearchMessage('No monitored area or complaint found for "' + searchInput.value.trim() + '".');
  });
}

function setComplaintFilter(filter) {
  activeComplaintFilter = filter;
  document.querySelectorAll(".complaint-filter-btn").forEach(function (button) {
    button.classList.toggle("active", button.dataset.cfilter === filter);
  });
  addComplaintMarkers();
}

function setupFilters() {
  document.querySelectorAll(".filter-button:not(.complaint-filter-btn)").forEach(function (button) {
    button.addEventListener("click", function () { setWasteFilter(button.dataset.filter); });
  });

  document.querySelectorAll(".complaint-filter-btn").forEach(function (button) {
    button.addEventListener("click", function () { setComplaintFilter(button.dataset.cfilter); });
  });
}

function setupTheme() {
  var themeToggle = document.getElementById("themeToggle");
  var themeLabel = document.getElementById("themeLabel");
  if (!themeToggle || !themeLabel) return;

  var saved = null;
  try { saved = sessionStorage.getItem("waste-dashboard-theme"); } catch (e) {}
  if (saved === "dark") {
    document.body.classList.add("dark-mode");
  }

  function sync() {
    var isDark = document.body.classList.contains("dark-mode");
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeLabel.textContent = isDark ? "Dark" : "Light";
  }

  sync();

  themeToggle.onclick = function () {
    document.body.classList.toggle("dark-mode");
    var isDark = document.body.classList.contains("dark-mode");
    try { sessionStorage.setItem("waste-dashboard-theme", isDark ? "dark" : "light"); } catch (e) {}
    sync();
    renderCharts();
  };
}

function setupLayerControl() {
  if (!hasLeaflet() || !map || !openStreetMap || !wasteLayer || !drainageLayer || !complaintLayer || !floodRiskLayer) return;
  try {
    window.L.control.layers(
      { "OpenStreetMap": openStreetMap },
      {
        "Societies (Green/Red)": wasteLayer,
        "Drainage System": drainageLayer,
        "Active Escalated Complaints": complaintLayer,
        "Flood Risk": floodRiskLayer
      },
      { position: "topright", collapsed: false }
    ).addTo(map);
  } catch (e) {}
}

function attachPopupActions() {
  document.addEventListener("click", function (event) {
    var trigger = event.target.closest("[data-view-society]");
    if (trigger) {
      var societyName = decodeURIComponent(trigger.dataset.viewSociety);
      showSearchMessage("Showing complaints for " + societyName + ".");
    }

    // Admin action: Mark In Progress directly from popup
    var progressBtn = event.target.closest("[data-admin-progress]");
    if (progressBtn) {
      var cid = progressBtn.dataset.adminProgress;
      var c = complaints.find(function (x) { return x.id === cid; });
      if (c) {
        c.status = "In Progress";
        persistComplaints(complaints);
        refreshSocietyStatuses();
        addComplaintMarkers();
        updateStatistics();
        renderCharts();
        showSearchMessage("Complaint " + cid + " marked as In Progress.");
        var entry = complaintMarkers.get(cid.toLowerCase());
        if (entry) {
          window.setTimeout(function () { entry.marker.openPopup(); }, 100);
        }
      }
    }

    // Admin resolve action from complaint popups
    var resolveBtn = event.target.closest("[data-admin-resolve]");
    if (resolveBtn) {
      var cid = resolveBtn.dataset.adminResolve;
      openAdminResolveModal(cid);
    }
  });
}

/* ─── Admin Resolve Modal ─── */
function openAdminResolveModal(cid) {
  var c = complaints.find(function (x) { return x.id === cid; });
  if (!c) return;
  var cidEl = document.getElementById("adminResolveComplaintId");
  var infoEl = document.getElementById("adminResolveInfo");
  var remarksEl = document.getElementById("adminResolveRemarks");
  if (cidEl) cidEl.value = cid;
  if (infoEl) infoEl.textContent = "Complaint " + cid + " — " + c.type + " (" + (c.society || c.area) + ") — Current Status: " + c.status;
  if (remarksEl) remarksEl.value = "";
  var m = document.getElementById("adminResolveModal");
  if (m) {
    m.classList.remove("hidden");
    m.setAttribute("aria-hidden", "false");
  }
}

function closeAdminResolveModal() {
  var m = document.getElementById("adminResolveModal");
  if (m) {
    m.classList.add("hidden");
    m.setAttribute("aria-hidden", "true");
  }
}

function setupAdminResolve() {
  document.querySelectorAll("[data-close-admin-resolve='true']").forEach(function (el) {
    el.addEventListener("click", closeAdminResolveModal);
  });

  var form = document.getElementById("adminResolveForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var cid = document.getElementById("adminResolveComplaintId").value;
    var newStatus = document.getElementById("adminResolveStatus").value;
    var remarks = (document.getElementById("adminResolveRemarks").value || "").trim();

    var c = complaints.find(function (x) { return x.id === cid; });
    if (c) {
      c.status = newStatus;
      persistComplaints(complaints);

      // If resolved, create a resolution record
      if (newStatus === "Resolved" && D.readStoredResolutions && D.persistResolutions) {
        var resolutions = D.readStoredResolutions();
        resolutions.push({
          id: (D.nextResolutionId ? D.nextResolutionId(resolutions) : "R-" + Date.now()),
          complaintId: cid,
          remarks: remarks || "Issue resolved by municipal authority.",
          date: new Date().toISOString().slice(0, 10),
          resolvedBy: "ADMIN (Municipal Authority)",
          verified: false
        });
        D.persistResolutions(resolutions);
      }

      // Refresh dashboard view
      refreshSocietyStatuses();
      addWasteMarkers();
      addComplaintMarkers();
      updateStatistics();
      renderCharts();
      closeAdminResolveModal();
      window.alert("Complaint " + cid + " marked as " + newStatus + (newStatus === "Resolved" ? ". It has been resolved and removed from the active map markers." : "."));
    }
  });
}

function refreshDashboard() {
  refreshSocietyStatuses();
  addWasteMarkers();
  addComplaintMarkers();
  updateStatistics();
  renderCharts();
}

function initDashboard() {
  // 1. Theme first
  setupTheme();

  // 2. Statistics and status calculations
  refreshSocietyStatuses();
  updateStatistics();

  // 3. Charts
  renderCharts();

  // 4. Map & layers
  initMap();
  addWasteMarkers();
  addDrainageRoutes();
  addComplaintMarkers();
  addFloodZones();
  setupLayerControl();

  // 5. Interactions
  setupSearch();
  setupFilters();
  attachPopupActions();
  setupAdminResolve();

  // 6. Action buttons
  var logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.onclick = function () {
      if (D.clearLoginSession) {
        D.clearLoginSession();
      } else {
        try {
          sessionStorage.clear();
        } catch (e) {}
      }
      window.location.href = "index.html";
    };
  }

  var resetButton = document.getElementById("resetMapButton");
  if (resetButton) {
    resetButton.onclick = function () {
      if (map) map.flyTo(DEFAULT_VIEW, DEFAULT_ZOOM, { duration: .7 });
    };
  }
}

globalThis.societies = societies;
globalThis.complaints = complaints;

function startupDashboard() {
  var persistedComplaints = readStoredComplaints();
  if (persistedComplaints && persistedComplaints.length) {
    complaints.splice(0, complaints.length);
    persistedComplaints.forEach(function (c) { complaints.push(c); });
    globalThis.complaints = complaints;
    persistComplaints(complaints);
  }
  initDashboard();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startupDashboard);
} else {
  startupDashboard();
}


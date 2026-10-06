"use strict";

// ============================================================================
// ROLE SYSTEM CONFIGURATION
// Exactly two roles: PM Admin and PM.
// ============================================================================

const ROLES = {
  ADMIN: "pm-admin",
  PM: "pm",
};

const ROLE_LABELS = {
  [ROLES.ADMIN]: "PM Admin",
  [ROLES.PM]: "PM",
};

const ROLE_CONFIG = {
  [ROLES.ADMIN]: {
    id: ROLES.ADMIN,
    label: "PM Admin",
    tagClass: "role-tag--admin",
    navDescription: "PM Admin · Oversight & Admin Operations",
    quickActionCategories: [
      "design-handover",
      "se-updates",
      "money-payments",
      "qa-requests",
      "schedule",
      "tickets",
      "pm-missed-work",
    ],
    permissions: {
      canReviewDocuments: true,
      canApproveRejectDocuments: true,
      canAddRemarks: true,
      canAssignPM: true,
      canAssignSE: true,
      canSendToPM: true,
      canViewMissedWork: true,
      canPerformAdminActions: true,
    },
  },
  [ROLES.PM]: {
    id: ROLES.PM,
    label: "PM",
    tagClass: "role-tag--pm",
    navDescription: "PM · Site Execution & Project Scope",
    quickActionCategories: [
      "design-handover",
      "se-updates",
      "money-payments",
      "qa-requests",
      "schedule",
      "tickets",
    ],
    permissions: {
      canReviewDocuments: true,
      canApproveRejectDocuments: true,
      canAddRemarks: true,
      canAssignPM: false,
      canAssignSE: true, // "Assign SE where applicable"
      canSendToPM: false,
      canViewMissedWork: false,
      canPerformAdminActions: false,
    },
  },
};

function normalizeRole(role) {
  if (role === ROLES.PM || role === "PM" || role === "pm") {
    return ROLES.PM;
  }
  return ROLES.ADMIN;
}

function getCurrentRoleConfig() {
  const normalized = normalizeRole(productState.currentRole);
  return ROLE_CONFIG[normalized] ?? ROLE_CONFIG[ROLES.ADMIN];
}

function hasPermission(permissionKey) {
  const config = getCurrentRoleConfig();
  return Boolean(config.permissions?.[permissionKey]);
}

// ============================================================================
// PROTOTYPE FLOWS & STATE
// ============================================================================

const flows = [
  { id: "flow-1", label: "Quick Actions", screen: "quick-actions" },
  { id: "flow-2", label: "Design Handover", screen: "design-handover-records" },
  { id: "flow-3", label: "Ongoing Projects", screen: "ongoing-projects" },
  { id: "flow-4", label: "Completed Projects", screen: "completed-projects" },
  { id: "flow-5", label: "Insights", screen: "insights" },
];

const prototypeState = {
  currentFlowId: flows[0]?.id ?? null,
  flowAreaCollapsed: false,
};

const productState = {
  currentRole: ROLES.ADMIN, // "pm-admin" or "pm" stored in frontend state
  currentScreen: flows[0]?.screen ?? "quick-actions",
  recordsExpanded: true,
  activeDrawerId: null,
  currentProjectSection: null,
  contextActionId: null,
  returnScreen: "quick-actions",
  selectedHandoverId: "dh-willow-park",
  reviewingDocId: null, // id of document currently open in review modal
  toastMessage: "",
};

// Quick action categories in product order
const actionCategories = [
  { id: "design-handover", label: "Design Handover" },
  { id: "se-updates", label: "SE Updates" },
  { id: "money-payments", label: "Money / Payments" },
  { id: "qa-requests", label: "QA Requests" },
  { id: "schedule", label: "Schedule" },
  { id: "tickets", label: "Tickets" },
  { id: "pm-missed-work", label: "PM Missed Work", adminOnly: true },
];

const projectSections = [
  "Project Details",
  "Schedule",
  "SE Updates",
  "Finances",
  "Documents",
  "QA Reports",
  "Client Tickets",
];

// Assigned person options
const PM_OPTIONS = [
  "Project PM",
  "Sarah Jenkins",
  "Alex Rivera",
  "David Chen",
  "Unassigned",
];

const SE_OPTIONS = [
  "Dave Miller (Lead SE)",
  "SE Team Alpha",
  "Elena Rostova (SE)",
  "Vikram Patel (Structural)",
  "Unassigned",
];

// ============================================================================
// DUMMY DATA FOR SHARED DESIGN HANDOVER
// ============================================================================

const designHandoverPackages = [
  {
    id: "dh-willow-park",
    projectId: "willow-park",
    project: "Willow Park Villa",
    projectCode: "WP-024",
    stage: "G+2 Residential Villa · Issued for Mobilisation",
    location: "Sector 48, Gurgaon",
    assignedPM: "Project PM",
    assignedSE: "SE Team Alpha",
    status: "under-review", // "under-review" | "dispatched" | "approved"
    dispatchedToPM: false,
    dispatchedDate: null,
    packageVersion: "v2.1 Final Issued",
    documents: [
      {
        id: "doc-wp-1",
        name: "Architectural Working Drawings",
        code: "ARC-WP-01",
        type: "PDF",
        size: "14.2 MB",
        sheets: "18 sheets",
        status: "pending",
        date: "Oct 5, 2026",
        description: "Coordinated floor plans, elevations, section details, and finish schedules for site execution.",
      },
      {
        id: "doc-wp-2",
        name: "Structural Foundation & Columns",
        code: "STR-WP-04",
        type: "DWG",
        size: "9.8 MB",
        sheets: "12 sheets",
        status: "approved",
        date: "Oct 4, 2026",
        description: "Sub-structure reinforcement details, column schedules, footing layout, and rebar lap notes.",
      },
      {
        id: "doc-wp-3",
        name: "MEP Coordinated Riser Layout",
        code: "MEP-WP-02",
        type: "PDF",
        size: "6.4 MB",
        sheets: "8 sheets",
        status: "pending",
        date: "Oct 5, 2026",
        description: "Sanitary drainage, domestic water supply layout, electrical conduit routing.",
      },
      {
        id: "doc-wp-4",
        name: "Material Specifications & Finish Schedule",
        code: "FNS-WP-01",
        type: "XLSX",
        size: "2.1 MB",
        sheets: "Schedule",
        status: "approved",
        date: "Oct 3, 2026",
        description: "Approved flooring, wall finishes, sanitary fixture codes, and hardware specifications.",
      },
    ],
    remarks: [
      {
        id: "rem-1",
        authorRole: "PM Admin",
        authorName: "Admin Operations",
        text: "Coordinated package issued by architecture firm. SE Team Alpha assigned for structural compliance.",
        timestamp: "Yesterday, 16:40",
      },
      {
        id: "rem-2",
        authorRole: "PM",
        authorName: "Project PM",
        text: "Footing drawings cross-checked on site. Waiting on final MEP riser approval before site mobilization.",
        timestamp: "Today, 09:15",
      },
    ],
  },
  {
    id: "dh-cedar-ridge",
    projectId: "cedar-ridge",
    project: "Cedar Ridge Residence",
    projectCode: "CR-018",
    stage: "Multi-level Villa · Foundation & Plinth Package",
    location: "Hillview Zone B",
    assignedPM: "Sarah Jenkins",
    assignedSE: "Dave Miller (Lead SE)",
    status: "under-review",
    dispatchedToPM: false,
    dispatchedDate: null,
    packageVersion: "v1.4",
    documents: [
      {
        id: "doc-cr-1",
        name: "Retaining Wall & Foundation Plan",
        code: "STR-CR-01",
        type: "PDF",
        size: "11.1 MB",
        sheets: "14 sheets",
        status: "approved",
        date: "Oct 2, 2026",
        description: "Retaining wall reinforcement and foundation pile layout with soil bearing guidelines.",
      },
      {
        id: "doc-cr-2",
        name: "Facade & External Glazing Details",
        code: "ARC-CR-02",
        type: "PDF",
        size: "7.5 MB",
        sheets: "9 sheets",
        status: "pending",
        date: "Oct 4, 2026",
        description: "Curtain wall structural calculations and sliding window joinery profiles.",
      },
    ],
    remarks: [
      {
        id: "rem-3",
        authorRole: "PM Admin",
        authorName: "Admin Operations",
        text: "SE Dave Miller assigned for structural soil load tests.",
        timestamp: "Oct 3, 11:20",
      },
    ],
  },
  {
    id: "dh-maple-grove",
    projectId: "maple-grove",
    project: "Maple Grove Villas",
    projectCode: "MG-031",
    stage: "Cluster Housing · Framing & Shell Construction",
    location: "Greenway Plot 12",
    assignedPM: "Alex Rivera",
    assignedSE: "Elena Rostova (SE)",
    status: "dispatched",
    dispatchedToPM: true,
    dispatchedDate: "Sep 29, 2026",
    packageVersion: "v3.0 Complete",
    documents: [
      {
        id: "doc-mg-1",
        name: "General Framing & Slab Layout",
        code: "STR-MG-08",
        type: "PDF",
        size: "8.3 MB",
        sheets: "10 sheets",
        status: "approved",
        date: "Sep 28, 2026",
        description: "First floor slab reinforcement and shear wall placement details.",
      },
      {
        id: "doc-mg-2",
        name: "Site Drainage & External Boundary",
        code: "ARC-MG-05",
        type: "PDF",
        size: "5.2 MB",
        sheets: "6 sheets",
        status: "approved",
        date: "Sep 29, 2026",
        description: "Stormwater runoff paths, invert levels, and perimeter compound wall details.",
      },
    ],
    remarks: [
      {
        id: "rem-4",
        authorRole: "PM Admin",
        authorName: "Admin Operations",
        text: "Full design handover formally dispatched to Alex Rivera by PM Admin.",
        timestamp: "Sep 29, 14:00",
      },
    ],
  },
];

// ============================================================================
// DUMMY DATA FOR ONGOING & COMPLETED PROJECTS
// ============================================================================

const ongoingProjects = [
  {
    code: "WP-024",
    name: "Willow Park Villa",
    stage: "Site Mobilisation",
    pm: "Project PM",
    se: "SE Team Alpha",
    progress: "15%",
    health: "On track",
    healthTone: "soon",
    dueDate: "Nov 2026",
  },
  {
    code: "CR-018",
    name: "Cedar Ridge Residence",
    stage: "Foundation & Plinth",
    pm: "Sarah Jenkins",
    se: "Dave Miller (Lead SE)",
    progress: "32%",
    health: "Attention needed",
    healthTone: "due",
    dueDate: "Dec 2026",
  },
  {
    code: "MG-031",
    name: "Maple Grove Villas",
    stage: "Framing & Shell",
    pm: "Alex Rivera",
    se: "Elena Rostova (SE)",
    progress: "58%",
    health: "On track",
    healthTone: "soon",
    dueDate: "Jan 2027",
  },
  {
    code: "HV-007",
    name: "Harbor View Apartments",
    stage: "Electrical First Fix",
    pm: "Project PM",
    se: "SE Team Alpha",
    progress: "74%",
    health: "Delayed",
    healthTone: "overdue",
    dueDate: "Nov 2026",
  },
];

const completedProjects = [
  {
    code: "OH-012",
    name: "Orchid Heights",
    stage: "Delivered & Handed Over",
    pm: "Project PM",
    se: "Dave Miller (Lead SE)",
    completedDate: "Sep 15, 2026",
    status: "Completed",
    statusTone: "soon",
  },
  {
    code: "SP-003",
    name: "Silverline Plaza",
    stage: "Delivered & Handed Over",
    pm: "Sarah Jenkins",
    se: "Elena Rostova (SE)",
    completedDate: "Aug 22, 2026",
    status: "Completed",
    statusTone: "soon",
  },
  {
    code: "GL-005",
    name: "Green Lake Residency",
    stage: "Delivered & Handed Over",
    pm: "Alex Rivera",
    se: "SE Team Alpha",
    completedDate: "Jul 10, 2026",
    status: "Completed",
    statusTone: "soon",
  },
];

// ============================================================================
// QUICK ACTIONS DATA
// ============================================================================

const actions = [
  {
    id: "handover-willow-park",
    category: "design-handover",
    projectId: "willow-park",
    project: "Willow Park Villa",
    projectCode: "WP-024",
    title: "Confirm design handover",
    summary: "The construction package is ready; confirm the issued drawings before site mobilisation.",
    details: "The coordinated drawing set and finish schedule are ready for handover. Review the package, verify SE updates, and confirm the PM owner before site work proceeds.",
    involvement: "Design team · 4 drawing sets",
    timing: "Due today",
    urgency: "due",
    assignedPM: "Project PM",
    assignedSE: "SE Team Alpha",
    projectSection: "Documents",
    operation: "confirm-handover",
    primaryLabel: "Confirm handover",
    priority: 2,
    status: "pending",
  },
  {
    id: "se-update-cedar-ridge",
    category: "se-updates",
    projectId: "cedar-ridge",
    project: "Cedar Ridge Residence",
    projectCode: "CR-018",
    title: "Approve revised beam details",
    summary: "A Structural Engineer revision is waiting for PM approval.",
    details: "Beam reinforcement details at grid B-4 changed in revision 04. Review the update before the site team uses the revised drawing.",
    involvement: "Structural Engineer · Revision 04",
    timing: "1 day overdue",
    urgency: "overdue",
    assignedPM: "Project PM",
    projectSection: "SE Updates",
    operation: "approve-se-update",
    primaryLabel: "Approve update",
    priority: 1,
    status: "pending",
  },
  {
    id: "client-stage-payment-maple",
    category: "money-payments",
    projectId: "maple-grove",
    project: "Maple Grove Villas",
    projectCode: "MG-031",
    title: "Request stage payment",
    summary: "The next construction stage starts in 10 days; request the customer's payment now.",
    details: "The Civil Works stage is approaching. Send the customer the stage payment request so funds are ready before work starts.",
    involvement: "Civil Works · ₹4,80,000",
    timing: "Stage starts in 10 days",
    urgency: "due",
    assignedPM: "Project PM",
    projectSection: "Finances",
    operation: "request-client-payment",
    primaryLabel: "Request customer payment",
    priority: 2,
    status: "pending",
  },
  {
    id: "contractor-payout-harbor",
    category: "money-payments",
    projectId: "harbor-view",
    project: "Harbor View Apartments",
    projectCode: "HV-007",
    title: "Send contractor payout request",
    summary: "The sub-stage completed yesterday; send the payout request to Finance.",
    details: "Electrical first fix was marked complete one day ago. Review the amount and initiate the contractor payout request for Finance.",
    involvement: "Electrical first fix · ₹1,20,000",
    timing: "Completed 1 day ago",
    urgency: "overdue",
    assignedPM: "Project PM",
    projectSection: "Finances",
    operation: "send-contractor-payout",
    primaryLabel: "Send to Finance",
    priority: 1,
    status: "pending",
  },
  {
    id: "qa-report-cedar-ridge",
    category: "qa-requests",
    projectId: "cedar-ridge",
    project: "Cedar Ridge Residence",
    projectCode: "CR-018",
    title: "Review slab inspection report",
    summary: "The QA report is ready for review before the next pour.",
    details: "The site team submitted the slab inspection report. Review the findings and record the close-out decision before work continues.",
    involvement: "Inspection 06 · Site team",
    timing: "Submitted 2 hours ago",
    urgency: "due",
    assignedPM: "Project PM",
    projectSection: "QA Reports",
    operation: "close-qa-request",
    primaryLabel: "Close QA request",
    priority: 2,
    status: "pending",
  },
  {
    id: "schedule-electrical",
    category: "schedule",
    projectId: "harbor-view",
    project: "Harbor View Apartments",
    projectCode: "HV-007",
    title: "Mark sub-stage complete",
    summary: "Electrical first fix has reached its planned completion point.",
    details: "Confirm the sub-stage is complete in the schedule. This action updates the project schedule and clears the reminder.",
    involvement: "Electrical first fix · Planned today",
    timing: "Due today",
    urgency: "due",
    assignedPM: "Project PM",
    projectSection: "Schedule",
    operation: "complete-substage",
    primaryLabel: "Mark sub-stage complete",
    priority: 2,
    status: "pending",
  },
  {
    id: "schedule-waterproofing",
    category: "schedule",
    projectId: "maple-grove",
    project: "Maple Grove Villas",
    projectCode: "MG-031",
    title: "Start next sub-stage",
    summary: "The previous sub-stage is complete; waterproofing can now begin.",
    details: "The prerequisite sub-stage has been completed. Mark waterproofing as started to keep the project schedule current.",
    involvement: "Terrace waterproofing · Ready to start",
    timing: "Ready now",
    urgency: "soon",
    assignedPM: "Project PM",
    projectSection: "Schedule",
    operation: "start-substage",
    primaryLabel: "Mark as started",
    priority: 3,
    status: "pending",
  },
  {
    id: "client-ticket-orchid",
    category: "tickets",
    projectId: "orchid-heights",
    project: "Orchid Heights",
    projectCode: "OH-012",
    title: "Respond to water-pressure ticket",
    summary: "The client is waiting for an update on a low-pressure issue.",
    details: "The client ticket has been open for two days. Review the issue in the project record and mark it responded when the update is sent.",
    involvement: "Client ticket · Open 2 days",
    timing: "2 days open",
    urgency: "overdue",
    assignedPM: "Project PM",
    projectSection: "Client Tickets",
    operation: "respond-ticket",
    primaryLabel: "Mark responded",
    priority: 1,
    status: "pending",
  },
  {
    id: "missed-daily-report-cedar",
    category: "pm-missed-work",
    projectId: "cedar-ridge",
    project: "Cedar Ridge Residence",
    projectCode: "CR-018",
    title: "Complete missed daily report",
    summary: "Yesterday's site report was not submitted by the assigned PM.",
    details: "The daily report is still missing for the previous site day. An admin can follow up with the PM or complete the record on their behalf.",
    involvement: "Daily report · Sarah Jenkins",
    timing: "1 day overdue",
    urgency: "overdue",
    assignedPM: "Sarah Jenkins",
    projectSection: "Documents",
    operation: "complete-on-behalf",
    primaryLabel: "Complete on behalf",
    priority: 1,
    status: "pending",
    adminOnly: true,
  },
];

const operationResults = {
  "confirm-handover": { status: "confirmed", message: "Design handover confirmed." },
  "approve-se-update": { status: "approved", message: "SE update approved." },
  "request-client-payment": { status: "requested", message: "Customer payment request recorded." },
  "send-contractor-payout": { status: "submitted", message: "Payout request sent to Finance." },
  "close-qa-request": { status: "closed", message: "QA request marked as reviewed." },
  "complete-substage": { status: "completed", message: "Sub-stage marked complete." },
  "start-substage": { status: "started", message: "Next sub-stage marked as started." },
  "respond-ticket": { status: "responded", message: "Client ticket marked as responded." },
  "complete-on-behalf": { status: "completed-on-behalf", message: "Missed work completed on behalf of the PM." },
};

const screenLabels = {
  "quick-actions": "Quick Actions",
  insights: "Insights",
  "design-handover-records": "Design Handover",
  "ongoing-projects": "Ongoing Projects",
  "completed-projects": "Completed Projects",
  "project-context": "Project record",
};

const urgencyOrder = { overdue: 0, due: 1, soon: 2, normal: 3 };

// DOM Cache
const prototypeFrame = document.querySelector(".prototype-frame");
const flowAreaToggle = document.getElementById("flow-area-toggle");
const flowList = document.getElementById("flow-list");
const flowCount = document.getElementById("flow-count");
const activeFlowLabel = document.getElementById("active-flow-label");
const productViewport = document.getElementById("product-viewport");
const productAppRoot = document.getElementById("product-app-root");

let toastTimer = null;

// ============================================================================
// UTILITIES & HELPERS
// ============================================================================

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function getCurrentFlow() {
  return flows.find((flow) => flow.id === prototypeState.currentFlowId) ?? null;
}

function getAction(actionId) {
  return actions.find((action) => action.id === actionId) ?? null;
}

function getCategory(categoryId) {
  return actionCategories.find((category) => category.id === categoryId) ?? null;
}

function getHandoverPackage(packageId) {
  return designHandoverPackages.find((pkg) => pkg.id === packageId) ?? designHandoverPackages[0];
}

function renderIcon(name) {
  const paths = {
    grid: '<rect x="3.2" y="3.2" width="4.1" height="4.1" rx=".8"/><rect x="8.7" y="3.2" width="4.1" height="4.1" rx=".8"/><rect x="3.2" y="8.7" width="4.1" height="4.1" rx=".8"/><rect x="8.7" y="8.7" width="4.1" height="4.1" rx=".8"/>',
    chart: '<path d="M3.2 12.8V8.6h2.4v4.2M6.8 12.8V5.4h2.4v7.4M10.4 12.8V3.5h2.4v9.3"/>',
    folder: '<path d="M2.8 5.2c0-.8.6-1.4 1.4-1.4h3l1.3 1.4h3.3c.8 0 1.4.6 1.4 1.4v5.2c0 .8-.6 1.4-1.4 1.4H4.2c-.8 0-1.4-.6-1.4-1.4V5.2Z"/>',
    file: '<path d="M4.2 2.8h4.7l2.8 2.8v7.1c0 .7-.5 1.2-1.2 1.2H4.2c-.7 0-1.2-.5-1.2-1.2V4c0-.7.5-1.2 1.2-1.2Z"/><path d="M8.7 2.9v3h3"/>',
    chevron: '<path d="m5.5 3.5 4.5 4.5-4.5 4.5"/>',
    down: '<path d="m3.5 5.5 4.5 4.5 4.5-4.5"/>',
    close: '<path d="m4 4 8 8M12 4l-8 8"/>',
    arrow: '<path d="M3 8h9M8 4l4 4-4 4"/>',
    external: '<path d="M8.5 3.5h4v4M12.3 3.7 7 9M11.5 8.7v2.8c0 .6-.4 1-1 1H4.5c-.6 0-1-.4-1-1V5.5c0-.6.4-1 1-1h2.8"/>',
    check: '<path d="m3.5 8.5 3 3 6-6"/>',
  };
  return `<svg class="ui-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">${paths[name] ?? ""}</svg>`;
}

function renderFlowList() {
  const fragment = document.createDocumentFragment();

  flows.forEach((flow, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    const number = document.createElement("span");
    const name = document.createElement("span");
    const chevron = document.createElement("span");
    const isActive = flow.id === prototypeState.currentFlowId;

    button.type = "button";
    button.className = `flow-option${isActive ? " is-active" : ""}`;
    button.dataset.flowId = flow.id;
    button.setAttribute("aria-pressed", String(isActive));
    button.setAttribute("aria-label", `Select ${flow.label}`);
    button.title = flow.label;

    number.className = "flow-number";
    number.textContent = String(index + 1).padStart(2, "0");
    name.className = "flow-name";
    name.textContent = flow.label;
    chevron.className = "flow-chevron";
    chevron.setAttribute("aria-hidden", "true");

    button.append(number, name, chevron);
    item.append(button);
    fragment.append(item);
  });

  flowList.replaceChildren(fragment);
  flowCount.textContent = String(flows.length).padStart(2, "0");
}

function syncProtoRoleController() {
  const isPMAdmin = productState.currentRole === ROLES.ADMIN;
  const adminBtn = document.getElementById("proto-role-admin");
  const pmBtn = document.getElementById("proto-role-pm");
  const activeRoleLabel = document.getElementById("proto-active-role");

  if (adminBtn) {
    adminBtn.classList.toggle("is-active", isPMAdmin);
    adminBtn.setAttribute("aria-pressed", String(isPMAdmin));
  }
  if (pmBtn) {
    pmBtn.classList.toggle("is-active", !isPMAdmin);
    pmBtn.setAttribute("aria-pressed", String(!isPMAdmin));
  }
  if (activeRoleLabel) {
    activeRoleLabel.textContent = ROLE_LABELS[productState.currentRole];
  }
}

function renderStatusBadge(label, tone = "neutral") {
  return `<span class="status-badge status-badge--${escapeHtml(tone)}">${escapeHtml(label)}</span>`;
}

function renderButton(label, command, variant = "secondary", data = {}, extraClass = "") {
  const attributes = Object.entries(data)
    .map(([name, value]) => ` data-${name}="${escapeHtml(value)}"`)
    .join("");
  return `<button type="button" class="app-button app-button--${escapeHtml(variant)} ${escapeHtml(extraClass)}" data-command="${escapeHtml(command)}"${attributes}>${escapeHtml(label)}</button>`;
}

function renderPageHeader(kicker, title, description, aside = "") {
  return `
    <header class="page-heading-row">
      <div class="page-heading-copy">
        <p class="page-kicker">${escapeHtml(kicker)}</p>
        <h1>${escapeHtml(title)}</h1>
        <p class="page-description">${escapeHtml(description)}</p>
      </div>
      ${aside ? `<div class="page-heading-aside">${aside}</div>` : ""}
    </header>`;
}

function renderEmptyState(title, description, compact = false) {
  return `
    <div class="empty-state${compact ? " empty-state--compact" : ""}">
      <span class="empty-state-mark" aria-hidden="true">—</span>
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(description)}</span>
    </div>`;
}

// ============================================================================
// NAVIGATION & HEADER (SHARED PRODUCT UI)
// ============================================================================

function getVisibleActions() {
  const isPMAdmin = productState.currentRole === ROLES.ADMIN;
  const allowedCategories = getCurrentRoleConfig().quickActionCategories;

  return actions.filter((action) => {
    if (action.status !== "pending") return false;
    if (!allowedCategories.includes(action.category)) return false;
    if (action.adminOnly && !isPMAdmin) return false;
    return true;
  });
}

function renderProductSidebar() {
  const currentScreen = productState.currentScreen;
  const quickActionsActive = currentScreen === "quick-actions" || currentScreen === "project-context";
  const recordsOpen = productState.recordsExpanded;
  const roleConfig = getCurrentRoleConfig();
  const openActionCount = getVisibleActions().length;

  const navItem = (screen, label, iconName, active, counter = null) => `
    <button type="button" class="product-nav-item${active ? " is-active" : ""}" data-product-screen="${escapeHtml(screen)}"${active ? ' aria-current="page"' : ""}>
      <span class="nav-icon">${renderIcon(iconName)}</span>
      <span>${escapeHtml(label)}</span>
      ${counter !== null ? `<span class="nav-counter">${escapeHtml(counter)}</span>` : ""}
    </button>`;

  return `
    <aside class="product-sidebar" aria-label="PM Dashboard navigation">
      <div class="product-brand">
        <span class="product-brand-mark" aria-hidden="true">PM</span>
        <span class="product-brand-name">PM Dashboard</span>
      </div>

      <div class="product-role-tag ${roleConfig.tagClass}" title="Active prototype role">
        <span class="role-tag-dot" aria-hidden="true"></span>
        <span>${escapeHtml(roleConfig.label)}</span>
      </div>

      <nav class="product-nav">
        <div class="product-nav-primary">
          ${navItem("quick-actions", "Quick Actions", "grid", quickActionsActive, openActionCount)}
          ${navItem("insights", "Insights", "chart", currentScreen === "insights")}
        </div>
        <div class="product-nav-group">
          <button type="button" class="product-nav-group-toggle" data-command="toggle-records" aria-expanded="${recordsOpen}">
            <span>Records</span>
            <span class="nav-group-chevron${recordsOpen ? " is-open" : ""}">${renderIcon("down")}</span>
          </button>
          <div class="product-nav-children"${recordsOpen ? "" : " hidden"}>
            ${navItem("design-handover-records", "Design Handover", "file", currentScreen === "design-handover-records", designHandoverPackages.length)}
            ${navItem("ongoing-projects", "Ongoing Projects", "folder", currentScreen === "ongoing-projects", ongoingProjects.length)}
            ${navItem("completed-projects", "Completed Projects", "folder", currentScreen === "completed-projects", completedProjects.length)}
          </div>
        </div>
      </nav>

      <div class="product-sidebar-footer">
        <span class="sidebar-footer-dot" aria-hidden="true"></span>
        <span>${escapeHtml(roleConfig.navDescription)}</span>
      </div>
    </aside>`;
}

function renderProductHeader() {
  const screenLabel = screenLabels[productState.currentScreen] ?? "PM Dashboard";
  const isPMAdmin = productState.currentRole === ROLES.ADMIN;

  return `
    <header class="product-topbar">
      <div class="topbar-context">
        <span class="topbar-context-title">${escapeHtml(screenLabel)}</span>
        <span class="sample-data-label">${isPMAdmin ? "PM Admin Mode" : "PM Mode"}</span>
      </div>
      <div class="role-preview">
        <span class="role-preview-label">Role</span>
        <div class="role-switcher" role="group" aria-label="Switch prototype role">
          <button
            type="button"
            class="role-option${isPMAdmin ? " is-active" : ""}"
            data-select-role="${ROLES.ADMIN}"
            aria-pressed="${isPMAdmin}"
          >
            PM Admin
          </button>
          <button
            type="button"
            class="role-option${!isPMAdmin ? " is-active" : ""}"
            data-select-role="${ROLES.PM}"
            aria-pressed="${!isPMAdmin}"
          >
            PM
          </button>
        </div>
      </div>
    </header>`;
}

// ============================================================================
// QUICK ACTIONS SCREEN
// ============================================================================

function renderActionCard(action) {
  const isPM = productState.currentRole === ROLES.PM;
  const assignee = isPM ? "Assigned to you" : `PM · ${action.assignedPM}`;

  return `
    <button type="button" class="action-card" data-command="open-action" data-action-id="${escapeHtml(action.id)}" aria-label="Open ${escapeHtml(action.title)} for ${escapeHtml(action.project)}">
      <span class="action-card-top">
        ${renderStatusBadge(action.timing, action.urgency)}
        <span class="action-card-arrow">${renderIcon("external")}</span>
      </span>
      <span class="action-card-title">${escapeHtml(action.title)}</span>
      <span class="action-project-line">
        <span class="project-code">${escapeHtml(action.projectCode)}</span>
        <span class="action-project-name">${escapeHtml(action.project)}</span>
      </span>
      <span class="action-card-summary">${escapeHtml(action.summary)}</span>
      <span class="action-involvement">${escapeHtml(action.involvement)}</span>
      <span class="action-card-footer">
        <span class="action-assignee">${escapeHtml(assignee)}</span>
        <span class="action-open-label">Open action ${renderIcon("arrow")}</span>
      </span>
    </button>`;
}

function renderActionColumn(category) {
  const categoryActions = getVisibleActions()
    .filter((action) => action.category === category.id)
    .sort((a, b) => (urgencyOrder[a.urgency] ?? 9) - (urgencyOrder[b.urgency] ?? 9) || a.priority - b.priority);

  const content = categoryActions.length
    ? categoryActions.map(renderActionCard).join("")
    : renderEmptyState("All clear", "No actions need attention.", true);

  return `
    <section class="action-column" aria-label="${escapeHtml(category.label)} actions">
      <header class="action-column-header">
        <h2>${escapeHtml(category.label)}</h2>
        <span class="column-count">${categoryActions.length}</span>
      </header>
      <div class="action-card-list">${content}</div>
    </section>`;
}

function renderActionBoard() {
  const allowedCategoryIds = getCurrentRoleConfig().quickActionCategories;
  const visibleCategories = actionCategories.filter((category) => allowedCategoryIds.includes(category.id));
  return visibleCategories.map(renderActionColumn).join("");
}

function renderQuickActionsPage() {
  const openCount = getVisibleActions().length;
  const isPMAdmin = productState.currentRole === ROLES.ADMIN;
  const scopeCopy = isPMAdmin
    ? "Work that needs attention across all projects (including PM Missed Work)."
    : "Work that needs attention across your assigned projects.";

  const summary = `
    <div class="attention-summary" aria-label="${openCount} open actions">
      <span class="attention-count">${openCount}</span>
      <span class="attention-copy"><strong>open actions</strong><small>${isPMAdmin ? "all projects" : "assigned projects"}</small></span>
    </div>`;

  return `
    <section class="quick-actions-page">
      ${renderPageHeader("OPERATIONS", "Quick Actions", scopeCopy, summary)}
      <div class="board-guide">
        <span class="board-guide-indicator" aria-hidden="true"></span>
        <span>Open a card to review details or execute its workflow.</span>
        <span class="board-guide-scroll">Scroll horizontally to see all categories</span>
      </div>
      <div class="action-board" aria-label="Quick Actions board">${renderActionBoard()}</div>
    </section>`;
}

// ============================================================================
// SHARED DESIGN HANDOVER WORKSPACE (RECORDS -> DESIGN HANDOVER)
// Shared between PM Admin and PM with role-specific actions & controls.
// ============================================================================

function renderDesignHandoverPage() {
  const activePackage = getHandoverPackage(productState.selectedHandoverId);
  const isPMAdmin = productState.currentRole === ROLES.ADMIN;

  // Package Switcher Tabs
  const packageTabs = designHandoverPackages
    .map((pkg) => {
      const isActive = pkg.id === activePackage.id;
      return `
        <button
          type="button"
          class="dh-tab-btn${isActive ? " is-active" : ""}"
          data-command="dh-select-package"
          data-package-id="${escapeHtml(pkg.id)}"
        >
          <span class="dh-tab-code">${escapeHtml(pkg.projectCode)}</span>
          <span>${escapeHtml(pkg.project)}</span>
        </button>`;
    })
    .join("");

  // Role Controls Bar
  // 1. Assign PM: PM Admin can select from PMs; PM sees read-only assignment
  const pmControl = isPMAdmin
    ? `
      <label class="dh-control-field">
        <span>Assign PM</span>
        <select class="dh-select" data-command="dh-assign-pm" data-package-id="${escapeHtml(activePackage.id)}">
          ${PM_OPTIONS.map((pm) => `<option value="${escapeHtml(pm)}"${activePackage.assignedPM === pm ? " selected" : ""}>${escapeHtml(pm)}</option>`).join("")}
        </select>
      </label>`
    : `
      <div class="dh-control-field">
        <span>Assigned PM</span>
        <div class="dh-readonly-badge">
          <strong>${escapeHtml(activePackage.assignedPM)}</strong>
          <span class="dh-readonly-note">${activePackage.assignedPM === "Project PM" ? "(You)" : "(Managed by PM Admin)"}</span>
        </div>
      </div>`;

  // 2. Assign SE: Both PM Admin and PM can assign SE where applicable
  const seControl = `
    <label class="dh-control-field">
      <span>Assign SE</span>
      <select class="dh-select" data-command="dh-assign-se" data-package-id="${escapeHtml(activePackage.id)}">
        ${SE_OPTIONS.map((se) => `<option value="${escapeHtml(se)}"${activePackage.assignedSE === se ? " selected" : ""}>${escapeHtml(se)}</option>`).join("")}
      </select>
    </label>`;

  // 3. Send project to selected PM: PM Admin only! PM cannot send project to PM.
  const sendToPMAction = isPMAdmin
    ? `
      <div class="dh-send-action">
        <button
          type="button"
          class="app-button app-button--primary"
          data-command="dh-send-to-pm"
          data-package-id="${escapeHtml(activePackage.id)}"
        >
          ${activePackage.dispatchedToPM ? `✓ Sent to ${escapeHtml(activePackage.assignedPM)}` : "Send project to selected PM"}
        </button>
      </div>`
    : "";

  // Documents list
  const approvedDocs = activePackage.documents.filter((d) => d.status === "approved").length;
  const docCards = activePackage.documents
    .map((doc) => {
      const tone = doc.status === "approved" ? "approved" : doc.status === "rejected" ? "rejected" : "pending";
      const statusLabel = doc.status === "approved" ? "Approved" : doc.status === "rejected" ? "Rejected" : "Pending review";

      return `
        <article class="dh-doc-card">
          <div class="dh-doc-header">
            <div>
              <h4 class="dh-doc-title">${escapeHtml(doc.name)}</h4>
              <p class="dh-doc-sub">${escapeHtml(doc.code)} · ${escapeHtml(doc.type)} · ${escapeHtml(doc.size)} · ${escapeHtml(doc.sheets)}</p>
            </div>
            ${renderStatusBadge(statusLabel, tone)}
          </div>
          <p class="dh-doc-desc">${escapeHtml(doc.description)}</p>
          <div class="dh-doc-actions">
            <button
              type="button"
              class="doc-btn doc-btn--review"
              data-command="dh-review-doc"
              data-package-id="${escapeHtml(activePackage.id)}"
              data-doc-id="${escapeHtml(doc.id)}"
            >
              Review document
            </button>
            <button
              type="button"
              class="doc-btn doc-btn--approve"
              data-command="dh-approve-doc"
              data-package-id="${escapeHtml(activePackage.id)}"
              data-doc-id="${escapeHtml(doc.id)}"
            >
              Approve
            </button>
            <button
              type="button"
              class="doc-btn doc-btn--reject"
              data-command="dh-reject-doc"
              data-package-id="${escapeHtml(activePackage.id)}"
              data-doc-id="${escapeHtml(doc.id)}"
            >
              Reject
            </button>
          </div>
        </article>`;
    })
    .join("");

  // Remarks timeline
  const remarksList = activePackage.remarks.length
    ? activePackage.remarks
        .map((rem) => {
          const roleBadgeClass = rem.authorRole === "PM Admin" ? "role-badge--admin" : "role-badge--pm";
          return `
            <div class="dh-remark-bubble">
              <div class="dh-remark-head">
                <span class="dh-remark-author">${escapeHtml(rem.authorName)}</span>
                <span class="dh-remark-role-badge ${roleBadgeClass}">${escapeHtml(rem.authorRole)}</span>
                <span class="dh-remark-time">${escapeHtml(rem.timestamp)}</span>
              </div>
              <p class="dh-remark-body">${escapeHtml(rem.text)}</p>
            </div>`;
        })
        .join("")
    : `<p class="dh-doc-desc">No remarks logged yet.</p>`;

  // Role info banner
  const roleBanner = isPMAdmin
    ? `<div class="dh-role-banner dh-role-banner--admin">
        <strong>PM Admin Controls:</strong> Review & approve/reject documents, add remarks, assign PM, assign SE, and send project to selected PM.
      </div>`
    : `<div class="dh-role-banner dh-role-banner--pm">
        <strong>PM Execution Controls:</strong> Review & approve/reject documents, add remarks, and assign SE where applicable. (PM assignment and dispatch are managed by PM Admin).
      </div>`;

  const aside = `
    <div class="attention-summary" aria-label="Handover progress">
      <span class="attention-count">${approvedDocs}/${activePackage.documents.length}</span>
      <span class="attention-copy"><strong>docs approved</strong><small>${escapeHtml(activePackage.packageVersion)}</small></span>
    </div>`;

  return `
    <div class="dh-page">
      ${renderPageHeader("RECORDS", "Design Handover", "Shared drawing package review, structural engineer coordination, and PM handover management.", aside)}

      <div class="dh-package-tabs" role="tablist" aria-label="Handover packages">
        ${packageTabs}
      </div>

      <section class="dh-meta-card">
        <div class="dh-meta-header">
          <div class="dh-meta-title-group">
            <span class="dh-project-code">${escapeHtml(activePackage.projectCode)}</span>
            <div>
              <h2>${escapeHtml(activePackage.project)}</h2>
              <p class="dh-meta-sub">${escapeHtml(activePackage.stage)} · ${escapeHtml(activePackage.location)}</p>
            </div>
          </div>
          <div>
            ${renderStatusBadge(
              activePackage.dispatchedToPM ? `Dispatched to ${activePackage.assignedPM}` : "Under Review",
              activePackage.dispatchedToPM ? "approved" : "due"
            )}
          </div>
        </div>

        ${roleBanner}

        <div class="dh-controls-strip">
          <div class="dh-controls-group">
            ${pmControl}
            ${seControl}
          </div>
          ${sendToPMAction}
        </div>
      </section>

      <div class="dh-layout-grid">
        <!-- Documents Section -->
        <section class="dh-panel" aria-label="Handover documents">
          <div class="dh-panel-header">
            <h3>Package Documents</h3>
            <span class="dh-count-pill">${approvedDocs} of ${activePackage.documents.length} approved</span>
          </div>
          <div class="dh-doc-list">${docCards}</div>
        </section>

        <!-- Remarks Section -->
        <section class="dh-panel" aria-label="Remarks and activity">
          <div class="dh-panel-header">
            <h3>Remarks & Communication</h3>
            <span class="dh-count-pill">${activePackage.remarks.length} remarks</span>
          </div>
          <div class="dh-remarks-feed">${remarksList}</div>

          <form class="dh-add-remark-box" data-form="add-remark" data-package-id="${escapeHtml(activePackage.id)}">
            <textarea
              class="dh-remark-input"
              id="remark-input-${escapeHtml(activePackage.id)}"
              placeholder="Add remark or coordination feedback..."
              aria-label="Add remark"
              rows="3"
            ></textarea>
            <div class="dh-remark-submit-row">
              <span class="dh-posting-as">Posting as <strong>${escapeHtml(getCurrentRoleConfig().label)}</strong></span>
              <button
                type="button"
                class="app-button app-button--secondary"
                data-command="dh-add-remark"
                data-package-id="${escapeHtml(activePackage.id)}"
              >
                Add remark
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>`;
}

// ============================================================================
// DOCUMENT REVIEW MODAL (SHARED)
// ============================================================================

function renderDocumentReviewModal() {
  if (!productState.reviewingDocId) return "";

  let activePkg = null;
  let activeDoc = null;

  for (const pkg of designHandoverPackages) {
    const doc = pkg.documents.find((d) => d.id === productState.reviewingDocId);
    if (doc) {
      activePkg = pkg;
      activeDoc = doc;
      break;
    }
  }

  if (!activePkg || !activeDoc) return "";

  const tone = activeDoc.status === "approved" ? "approved" : activeDoc.status === "rejected" ? "rejected" : "pending";
  const statusLabel = activeDoc.status === "approved" ? "Approved" : activeDoc.status === "rejected" ? "Rejected" : "Pending review";

  return `
    <div class="doc-review-backdrop" role="dialog" aria-modal="true" aria-labelledby="review-modal-title">
      <div class="doc-review-card">
        <header class="doc-review-head">
          <div>
            <h3 id="review-modal-title">${escapeHtml(activeDoc.name)}</h3>
            <small style="color:#777671;">${escapeHtml(activePkg.project)} (${escapeHtml(activePkg.projectCode)})</small>
          </div>
          <button
            type="button"
            class="icon-button"
            data-command="dh-close-review"
            aria-label="Close document review"
          >
            ${renderIcon("close")}
          </button>
        </header>

        <div class="doc-review-body">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong>Document Specification</strong>
            ${renderStatusBadge(statusLabel, tone)}
          </div>

          <dl class="doc-review-facts">
            <div>
              <dt>Drawing Code</dt>
              <dd>${escapeHtml(activeDoc.code)}</dd>
            </div>
            <div>
              <dt>Format / Size</dt>
              <dd>${escapeHtml(activeDoc.type)} · ${escapeHtml(activeDoc.size)}</dd>
            </div>
            <div>
              <dt>Sheets / Volume</dt>
              <dd>${escapeHtml(activeDoc.sheets)}</dd>
            </div>
            <div>
              <dt>Issued Date</dt>
              <dd>${escapeHtml(activeDoc.date)}</dd>
            </div>
          </dl>

          <div>
            <strong style="font-size:11px;">Scope & Description</strong>
            <p style="margin:4px 0 0; font-size:11px; color:#595853; line-height:1.45;">${escapeHtml(activeDoc.description)}</p>
          </div>

          <div>
            <strong style="font-size:11px;">Verification Checklist</strong>
            <div class="doc-checklist">
              <label style="display:flex; align-items:center; gap:7px;">
                <input type="checkbox" checked disabled>
                <span>Architect & MEP coordination check</span>
              </label>
              <label style="display:flex; align-items:center; gap:7px;">
                <input type="checkbox" checked disabled>
                <span>Structural Engineer review alignment (${escapeHtml(activePkg.assignedSE)})</span>
              </label>
              <label style="display:flex; align-items:center; gap:7px;">
                <input type="checkbox" ${activeDoc.status === "approved" ? "checked" : ""} disabled>
                <span>Site mobilization package clearance</span>
              </label>
            </div>
          </div>
        </div>

        <footer class="doc-review-footer">
          <button
            type="button"
            class="app-button app-button--secondary"
            data-command="dh-close-review"
          >
            Close
          </button>
          <button
            type="button"
            class="doc-btn doc-btn--reject"
            data-command="dh-reject-doc"
            data-package-id="${escapeHtml(activePkg.id)}"
            data-doc-id="${escapeHtml(activeDoc.id)}"
          >
            Reject Document
          </button>
          <button
            type="button"
            class="doc-btn doc-btn--approve"
            data-command="dh-approve-doc"
            data-package-id="${escapeHtml(activePkg.id)}"
            data-doc-id="${escapeHtml(activeDoc.id)}"
          >
            Approve Document
          </button>
        </footer>
      </div>
    </div>`;
}

// ============================================================================
// ONGOING & COMPLETED PROJECTS AND INSIGHTS SCREENS
// ============================================================================

function renderOngoingProjectsPage() {
  const rows = ongoingProjects
    .map(
      (p) => `
      <tr>
        <td><strong>${escapeHtml(p.code)}</strong></td>
        <td>${escapeHtml(p.name)}</td>
        <td>${escapeHtml(p.pm)}</td>
        <td>${escapeHtml(p.se)}</td>
        <td>${escapeHtml(p.stage)}</td>
        <td><strong>${escapeHtml(p.progress)}</strong></td>
        <td>${renderStatusBadge(p.health, p.healthTone)}</td>
        <td>${escapeHtml(p.dueDate)}</td>
      </tr>`
    )
    .join("");

  return `
    <div class="records-table-page">
      ${renderPageHeader("RECORDS", "Ongoing Projects", "Active construction sites, stage progress, and assigned project teams.")}
      <div class="records-table-container">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Project</th>
              <th>Assigned PM</th>
              <th>Assigned SE</th>
              <th>Current Stage</th>
              <th>Progress</th>
              <th>Health</th>
              <th>Target Finish</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
}

function renderCompletedProjectsPage() {
  const rows = completedProjects
    .map(
      (p) => `
      <tr>
        <td><strong>${escapeHtml(p.code)}</strong></td>
        <td>${escapeHtml(p.name)}</td>
        <td>${escapeHtml(p.stage)}</td>
        <td>${escapeHtml(p.pm)}</td>
        <td>${escapeHtml(p.se)}</td>
        <td>${escapeHtml(p.completedDate)}</td>
        <td>${renderStatusBadge(p.status, p.statusTone)}</td>
      </tr>`
    )
    .join("");

  return `
    <div class="records-table-page">
      ${renderPageHeader("RECORDS", "Completed Projects", "Archive of successfully delivered construction projects and finalized handovers.")}
      <div class="records-table-container">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Project</th>
              <th>Stage</th>
              <th>Lead PM</th>
              <th>Structural Engineer</th>
              <th>Completion Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
}

function renderInsightsPage() {
  const isPMAdmin = productState.currentRole === ROLES.ADMIN;
  const openActions = getVisibleActions().length;

  return `
    <div class="insights-workspace">
      ${renderPageHeader("ANALYTICS", "Insights", "Operations intelligence, engineering response cycles, and delivery turnaround metrics.")}

      <div class="insights-kpis">
        <div class="kpi-card">
          <span class="kpi-label">Active Projects</span>
          <span class="kpi-value">${ongoingProjects.length}</span>
          <span class="kpi-sub">Across 4 zones</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Open Quick Actions</span>
          <span class="kpi-value">${openActions}</span>
          <span class="kpi-sub">${isPMAdmin ? "All categories (incl. missed work)" : "Your assigned scope"}</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Design Handovers</span>
          <span class="kpi-value">${designHandoverPackages.length}</span>
          <span class="kpi-sub">1 dispatched · 2 under review</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Avg SE Turnaround</span>
          <span class="kpi-value">1.4d</span>
          <span class="kpi-sub">Structural updates resolution</span>
        </div>
      </div>

      <div class="insights-grid">
        <section class="insights-panel">
          <h3>Quick Action Workload by Category</h3>
          <div class="bar-row">
            <div class="bar-head"><span>Design Handover</span><strong>1</strong></div>
            <div class="bar-track"><div class="bar-fill" style="width: 25%;"></div></div>
          </div>
          <div class="bar-row">
            <div class="bar-head"><span>SE Updates</span><strong>1</strong></div>
            <div class="bar-track"><div class="bar-fill" style="width: 25%;"></div></div>
          </div>
          <div class="bar-row">
            <div class="bar-head"><span>Money / Payments</span><strong>2</strong></div>
            <div class="bar-track"><div class="bar-fill" style="width: 50%;"></div></div>
          </div>
          <div class="bar-row">
            <div class="bar-head"><span>QA Requests</span><strong>1</strong></div>
            <div class="bar-track"><div class="bar-fill" style="width: 25%;"></div></div>
          </div>
          <div class="bar-row">
            <div class="bar-head"><span>Schedule</span><strong>2</strong></div>
            <div class="bar-track"><div class="bar-fill" style="width: 50%;"></div></div>
          </div>
          <div class="bar-row">
            <div class="bar-head"><span>Tickets</span><strong>1</strong></div>
            <div class="bar-track"><div class="bar-fill" style="width: 25%;"></div></div>
          </div>
          ${
            isPMAdmin
              ? `
          <div class="bar-row">
            <div class="bar-head"><span>PM Missed Work (Admin only)</span><strong>1</strong></div>
            <div class="bar-track"><div class="bar-fill" style="width: 25%; background:#A94A44;"></div></div>
          </div>`
              : ""
          }
        </section>

        <section class="insights-panel">
          <h3>Role Scope & Handover Readiness</h3>
          <p style="margin:0; font-size:11px; color:#63625E; line-height:1.5;">
            ${
              isPMAdmin
                ? "As <strong>PM Admin</strong>, you have full administrative oversight across all ongoing projects, can review and approve drawings, assign PMs, assign Structural Engineers, complete missed work on behalf of PMs, and dispatch packages."
                : "As <strong>PM</strong>, you oversee project execution, review and approve/reject drawings, add coordination remarks, assign SEs where applicable, and complete day-to-day site operations."
            }
          </p>
          <div style="margin-top:10px; padding:10px; background:#FAFBF9; border:1px solid #EAEAE6; border-radius:6px; font-size:11px;">
            <strong>Willow Park Villa (WP-024) Readiness:</strong>
            <p style="margin:4px 0 0; color:#787771;">2 of 4 documents approved. Ready for site mobilisation once MEP drawings are cleared.</p>
          </div>
        </section>
      </div>
    </div>`;
}

// ============================================================================
// PROJECT CONTEXT PAGE
// ============================================================================

function renderTabs(items, activeItem) {
  return `
    <nav class="project-navigation" role="tablist" aria-label="Project sections" aria-orientation="vertical">
      ${items
        .map(
          (item) => `
        <button type="button" class="project-tab${item === activeItem ? " is-active" : ""}" role="tab" aria-selected="${item === activeItem}" data-project-section="${escapeHtml(item)}">
          <span class="project-tab-marker" aria-hidden="true"></span>
          <span>${escapeHtml(item)}</span>
        </button>`
        )
        .join("")}
    </nav>`;
}

function renderProjectNavigation(activeSection) {
  return renderTabs(projectSections, activeSection);
}

function renderProjectContextAction(action) {
  if (!action) return renderEmptyState("Project section", "Project content will be added in a later iteration.");
  const operation = operationResults[action.operation];
  if (!operation) return renderEmptyState("Project section", "Project content will be added in a later iteration.");

  return `
    <article class="project-action-context">
      <div class="project-action-context-top">
        ${renderStatusBadge("Opened from Quick Actions", "info")}
        <span class="project-action-timing">${escapeHtml(action.timing)}</span>
      </div>
      <h3>${escapeHtml(action.title)}</h3>
      <p>${escapeHtml(action.details)}</p>
      <dl class="project-action-facts">
        <div><dt>Involved</dt><dd>${escapeHtml(action.involvement)}</dd></div>
        <div><dt>Assigned PM</dt><dd>${escapeHtml(action.assignedPM)}</dd></div>
      </dl>
      <div class="project-action-context-footer">
        ${renderButton("Back to Quick Actions", "back-to-quick-actions", "secondary")}
        ${renderButton(action.primaryLabel, "perform-action", "primary", { "action-id": action.id, operation: action.operation })}
      </div>
    </article>`;
}

function renderProjectContextPage() {
  const action = getAction(productState.contextActionId);
  if (!action) return renderEmptyState("Project not selected", "Open an action from Quick Actions to see its project context.");

  const activeSection = productState.currentProjectSection || action.projectSection;
  const sectionContent =
    activeSection === action.projectSection
      ? renderProjectContextAction(action)
      : renderEmptyState("Section view not built yet", "This project section will be added in a later iteration.");
  const backButton = renderButton("Back to Quick Actions", "back-to-quick-actions", "secondary", {}, "project-back-button");

  return `
    <section class="project-context-page">
      ${renderPageHeader(`${action.projectCode} · PROJECT`, action.project, "Project record opened from the selected action.", backButton)}
      <div class="project-context-layout">
        ${renderProjectNavigation(activeSection)}
        <section class="project-section-panel" role="tabpanel">
          <div class="project-section-heading">
            <p class="page-kicker">PROJECT RECORD</p>
            <h2>${escapeHtml(activeSection)}</h2>
            <p>Relevant context for ${escapeHtml(action.project)}.</p>
          </div>
          ${sectionContent}
        </section>
      </div>
    </section>`;
}

function renderCurrentScreen() {
  if (productState.currentScreen === "quick-actions") return renderQuickActionsPage();
  if (productState.currentScreen === "design-handover-records") return renderDesignHandoverPage();
  if (productState.currentScreen === "ongoing-projects") return renderOngoingProjectsPage();
  if (productState.currentScreen === "completed-projects") return renderCompletedProjectsPage();
  if (productState.currentScreen === "insights") return renderInsightsPage();
  if (productState.currentScreen === "project-context") return renderProjectContextPage();
  return renderQuickActionsPage();
}

// ============================================================================
// ACTION DRAWER (WITH ROLE-SPECIFIC CONTROLS)
// ============================================================================

function renderActionDrawer(action) {
  const category = getCategory(action.category);
  const isPMAdmin = productState.currentRole === ROLES.ADMIN;
  const isHandover = action.category === "design-handover";
  const pkg = isHandover ? getHandoverPackage("dh-willow-park") : null;

  // Shared Design Handover Controls inside Drawer
  let handoverControlsMarkup = "";
  if (isHandover && pkg) {
    const pmControl = isPMAdmin
      ? `
        <label class="assignment-field" for="drawer-assign-pm">
          <span>Assign PM</span>
          <select id="drawer-assign-pm" data-command="dh-assign-pm" data-package-id="${escapeHtml(pkg.id)}" data-action-id="${escapeHtml(action.id)}">
            ${PM_OPTIONS.map((pm) => `<option value="${escapeHtml(pm)}"${pkg.assignedPM === pm ? " selected" : ""}>${escapeHtml(pm)}</option>`).join("")}
          </select>
        </label>`
      : `
        <div class="assignment-readonly">
          <span>Assigned PM</span>
          <strong>${escapeHtml(pkg.assignedPM)} ${pkg.assignedPM === "Project PM" ? "(You)" : "(Managed by PM Admin)"}</strong>
        </div>`;

    const seControl = `
      <label class="assignment-field" for="drawer-assign-se">
        <span>Assign SE (Structural Engineer)</span>
        <select id="drawer-assign-se" data-command="dh-assign-se" data-package-id="${escapeHtml(pkg.id)}">
          ${SE_OPTIONS.map((se) => `<option value="${escapeHtml(se)}"${pkg.assignedSE === se ? " selected" : ""}>${escapeHtml(se)}</option>`).join("")}
        </select>
      </label>`;

    const sendToPMBtn = isPMAdmin
      ? `
        <div style="margin-top:14px;">
          <button
            type="button"
            class="app-button app-button--secondary"
            style="width:100%;"
            data-command="dh-send-to-pm"
            data-package-id="${escapeHtml(pkg.id)}"
          >
            ${pkg.dispatchedToPM ? `✓ Sent to ${escapeHtml(pkg.assignedPM)}` : "Send project to selected PM"}
          </button>
        </div>`
      : "";

    // Mini doc list inside drawer
    const docsMini = pkg.documents
      .map((doc) => {
        const tone = doc.status === "approved" ? "approved" : doc.status === "rejected" ? "rejected" : "pending";
        return `
          <div style="display:flex; align-items:center; justify-content:space-between; padding:8px 0; border-bottom:1px solid #F0F0ED;">
            <div>
              <strong style="font-size:11px; display:block;">${escapeHtml(doc.name)}</strong>
              <small style="color:#807F7A;">${escapeHtml(doc.code)} · ${escapeHtml(doc.type)}</small>
            </div>
            <div style="display:flex; align-items:center; gap:5px;">
              ${renderStatusBadge(doc.status, tone)}
              <button
                type="button"
                class="doc-btn doc-btn--review"
                style="padding:2px 6px; font-size:10px;"
                data-command="dh-review-doc"
                data-package-id="${escapeHtml(pkg.id)}"
                data-doc-id="${escapeHtml(doc.id)}"
              >
                Review
              </button>
            </div>
          </div>`;
      })
      .join("");

    handoverControlsMarkup = `
      <section class="drawer-detail-section" style="border-top:1px solid #ECECE8; margin-top:14px; padding-top:14px;">
        <h3>Design Handover Package Details</h3>
        <p style="margin-bottom:10px;">${escapeHtml(pkg.stage)} · ${escapeHtml(pkg.packageVersion)}</p>
        ${pmControl}
        ${seControl}
        ${sendToPMBtn}
      </section>

      <section class="drawer-detail-section">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <h3 style="margin:0;">Handover Documents</h3>
          <button
            type="button"
            class="app-button app-button--quiet"
            style="padding:2px 6px; font-size:10.5px;"
            data-command="dh-open-records"
            data-package-id="${escapeHtml(pkg.id)}"
          >
            Open in Records ${renderIcon("external")}
          </button>
        </div>
        <div style="display:flex; flex-direction:column;">
          ${docsMini}
        </div>
      </section>`;
  } else {
    // Non-handover action
    const assignmentMarkup = `
      <div class="assignment-readonly">
        <span>Assigned PM</span>
        <strong>${isPM ? "You" : escapeHtml(action.assignedPM)}</strong>
      </div>`;
    handoverControlsMarkup = assignmentMarkup;
  }

  return `
    <div class="drawer-layer">
      <button type="button" class="drawer-scrim" data-command="close-drawer" aria-label="Close action details"></button>
      <aside class="action-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <header class="drawer-header">
          <div>
            <p class="drawer-eyebrow">${escapeHtml(category?.label ?? "Quick Action")}</p>
            <span class="drawer-status-label">Action details</span>
          </div>
          <button type="button" class="icon-button" id="drawer-close" data-command="close-drawer" aria-label="Close action details">${renderIcon("close")}</button>
        </header>

        <div class="drawer-scroll-area">
          <div class="drawer-primary-context">
            ${renderStatusBadge(action.timing, action.urgency)}
            <h2 id="drawer-title">${escapeHtml(action.title)}</h2>
            <p class="drawer-summary">${escapeHtml(action.summary)}</p>
            <button type="button" class="project-context-link" data-command="open-in-project" data-action-id="${escapeHtml(action.id)}">
              <span class="project-context-link-icon">${renderIcon("folder")}</span>
              <span class="project-context-link-copy">
                <strong>${escapeHtml(action.project)}</strong>
                <small>${escapeHtml(action.projectCode)} <span aria-hidden="true">·</span> Open ${escapeHtml(action.projectSection)}</small>
              </span>
              <span class="project-context-link-arrow">${renderIcon("external")}</span>
            </button>
          </div>

          <dl class="drawer-facts">
            <div><dt>Why now</dt><dd>${escapeHtml(action.timing)}</dd></div>
            <div><dt>People / item</dt><dd>${escapeHtml(action.involvement)}</dd></div>
            ${isPMAdmin ? `<div><dt>Assigned PM</dt><dd>${escapeHtml(action.assignedPM)}</dd></div>` : ""}
          </dl>

          <section class="drawer-detail-section">
            <h3>Review context</h3>
            <p>${escapeHtml(action.details)}</p>
          </section>

          ${handoverControlsMarkup}
        </div>

        <footer class="drawer-footer">
          ${renderButton("Close", "close-drawer", "secondary")}
          ${renderButton(action.primaryLabel, "perform-action", "primary", { "action-id": action.id, operation: action.operation })}
        </footer>
      </aside>
    </div>`;
}

function renderToast() {
  if (!productState.toastMessage) return "";
  return `<div class="product-toast" role="status">${escapeHtml(productState.toastMessage)}</div>`;
}

function renderProductApp() {
  const drawerAction = productState.activeDrawerId ? getAction(productState.activeDrawerId) : null;

  productAppRoot.innerHTML = `
    <div class="pm-app-shell">
      ${renderProductSidebar()}
      <div class="product-main">
        ${renderProductHeader()}
        <div class="product-screen-content">${renderCurrentScreen()}</div>
      </div>
      ${drawerAction ? renderActionDrawer(drawerAction) : ""}
      ${renderDocumentReviewModal()}
      ${renderToast()}
    </div>`;

  productViewport.dataset.role = productState.currentRole;
  productViewport.dataset.screen = productState.currentScreen;
  syncProtoRoleController();
}

function renderProductViewport() {
  const flow = getCurrentFlow();
  const flowLabel = flow?.label ?? "No flow selected";
  activeFlowLabel.textContent = flowLabel;
  productViewport.dataset.flowId = flow?.id ?? "";
  if (!productState.currentScreen && flow?.screen) productState.currentScreen = flow.screen;
  renderProductApp();
}

// ============================================================================
// ACTIONS & EVENT DISPATCHERS
// ============================================================================

function selectFlow(flowId) {
  const flow = flows.find((item) => item.id === flowId);
  if (!flow || prototypeState.currentFlowId === flowId) return;

  prototypeState.currentFlowId = flowId;
  productState.currentScreen = flow.screen ?? "quick-actions";
  productState.activeDrawerId = null;
  productState.contextActionId = null;
  productState.reviewingDocId = null;
  renderFlowList();
  renderProductViewport();
}

function setFlowAreaCollapsed(collapsed) {
  prototypeState.flowAreaCollapsed = collapsed;
  prototypeFrame.classList.toggle("is-controller-collapsed", collapsed);

  const actionLabel = collapsed ? "Expand flow area" : "Collapse flow area";
  flowAreaToggle.setAttribute("aria-expanded", String(!collapsed));
  flowAreaToggle.setAttribute("aria-label", actionLabel);
  flowAreaToggle.title = actionLabel;
}

function showToast(message) {
  productState.toastMessage = message;
  renderProductApp();
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    productState.toastMessage = "";
    renderProductApp();
  }, 2800);
}

function setRole(role) {
  const normalized = normalizeRole(role);
  if (productState.currentRole === normalized) return;

  productState.currentRole = normalized;

  // If switched to PM, close drawer if on admin-only action
  const openAction = productState.activeDrawerId ? getAction(productState.activeDrawerId) : null;
  if (normalized === ROLES.PM && openAction?.adminOnly) {
    productState.activeDrawerId = null;
  }

  // If in project context for admin-only action, navigate back to quick actions
  const contextAction = productState.currentScreen === "project-context" ? getAction(productState.contextActionId) : null;
  if (normalized === ROLES.PM && contextAction?.adminOnly) {
    productState.currentScreen = "quick-actions";
    productState.contextActionId = null;
    productState.currentProjectSection = null;
  }

  syncProtoRoleController();
  renderProductApp();
  showToast(`Switched active role to ${ROLE_LABELS[normalized]}`);
}

function navigateProductScreen(screen) {
  productState.currentScreen = screen;
  productState.activeDrawerId = null;
  productState.contextActionId = null;
  productState.currentProjectSection = null;
  productState.reviewingDocId = null;
  productState.toastMessage = "";

  if (["design-handover-records", "ongoing-projects", "completed-projects"].includes(screen)) {
    productState.recordsExpanded = true;
  }

  // Update active flow label if matched
  const matchedFlow = flows.find((f) => f.screen === screen);
  if (matchedFlow) {
    prototypeState.currentFlowId = matchedFlow.id;
    activeFlowLabel.textContent = matchedFlow.label;
    renderFlowList();
  }

  renderProductApp();
}

function openAction(actionId) {
  const action = getAction(actionId);
  if (!action || !getVisibleActions().some((visibleAction) => visibleAction.id === action.id)) return;
  productState.activeDrawerId = action.id;
  renderProductApp();
  document.getElementById("drawer-close")?.focus();
}

function closeDrawer(restoreFocus = true) {
  const previousActionId = productState.activeDrawerId;
  if (!previousActionId) return;
  productState.activeDrawerId = null;
  renderProductApp();
  if (restoreFocus) {
    const card = Array.from(productAppRoot.querySelectorAll('[data-command="open-action"]')).find(
      (element) => element.dataset.actionId === previousActionId
    );
    card?.focus();
  }
}

function openInProject(actionId) {
  const action = getAction(actionId);
  if (!action) return;
  productState.returnScreen = productState.currentScreen;
  productState.contextActionId = action.id;
  productState.currentProjectSection = action.projectSection;
  productState.currentScreen = "project-context";
  productState.activeDrawerId = null;
  productState.toastMessage = "";
  renderProductApp();
}

function returnToQuickActions() {
  const returnScreen = productState.returnScreen || "quick-actions";
  productState.currentScreen = returnScreen === "project-context" ? "quick-actions" : returnScreen;
  productState.activeDrawerId = null;
  productState.contextActionId = null;
  productState.currentProjectSection = null;
  renderProductApp();
}

function performAction(actionId, operation) {
  const action = getAction(actionId);
  const result = operationResults[operation];
  if (!action || !result || action.operation !== operation || action.status !== "pending") return;
  if (!getVisibleActions().some((visibleAction) => visibleAction.id === action.id)) return;
  if (operation === "complete-on-behalf" && !hasPermission("canPerformAdminActions")) return;

  action.status = result.status;
  productState.activeDrawerId = null;

  if (productState.currentScreen === "project-context" && productState.contextActionId === action.id) {
    productState.currentScreen = productState.returnScreen === "project-context" ? "quick-actions" : productState.returnScreen;
    productState.contextActionId = null;
    productState.currentProjectSection = null;
  }
  showToast(result.message);
}

// ============================================================================
// DESIGN HANDOVER ROLE-SPECIFIC OPERATIONS
// ============================================================================

// 1. Assign PM: PM Admin only!
function assignPM(packageId, newPM, actionId = null) {
  if (!hasPermission("canAssignPM")) return;
  if (!PM_OPTIONS.includes(newPM)) return;

  const pkg = getHandoverPackage(packageId);
  if (pkg) {
    pkg.assignedPM = newPM;
    pkg.remarks.unshift({
      id: "rem-" + Date.now(),
      authorRole: "PM Admin",
      authorName: "Admin Operations",
      text: `Assigned PM updated to ${newPM}.`,
      timestamp: "Just now",
    });
  }

  // Sync associated action card if present
  if (actionId) {
    const act = getAction(actionId);
    if (act) act.assignedPM = newPM;
  } else if (packageId === "dh-willow-park") {
    const act = getAction("handover-willow-park");
    if (act) act.assignedPM = newPM;
  }

  showToast(`Assigned PM updated to ${newPM}`);
}

// 2. Assign SE: PM Admin & PM (where applicable)
function assignSE(packageId, newSE) {
  if (!hasPermission("canAssignSE")) return;
  if (!SE_OPTIONS.includes(newSE)) return;

  const pkg = getHandoverPackage(packageId);
  if (pkg) {
    pkg.assignedSE = newSE;
    pkg.remarks.unshift({
      id: "rem-" + Date.now(),
      authorRole: getCurrentRoleConfig().label,
      authorName: productState.currentRole === ROLES.PM ? "Project PM" : "Admin Operations",
      text: `Structural Engineer assigned to ${newSE}.`,
      timestamp: "Just now",
    });
  }

  if (packageId === "dh-willow-park") {
    const act = getAction("handover-willow-park");
    if (act) act.assignedSE = newSE;
  }

  showToast(`Assigned SE updated to ${newSE}`);
}

// 3. Send project to selected PM: PM Admin only!
function sendProjectToPM(packageId) {
  if (!hasPermission("canSendToPM")) return;

  const pkg = getHandoverPackage(packageId);
  if (!pkg) return;

  if (!pkg.assignedPM || pkg.assignedPM === "Unassigned") {
    showToast("Please assign a PM before sending the project.");
    return;
  }

  pkg.dispatchedToPM = true;
  pkg.status = "dispatched";
  pkg.dispatchedDate = "Oct 6, 2026";
  pkg.remarks.unshift({
    id: "rem-" + Date.now(),
    authorRole: "PM Admin",
    authorName: "Admin Operations",
    text: `Design handover formally dispatched to ${pkg.assignedPM} by PM Admin. All issued packages approved for site mobilization.`,
    timestamp: "Just now",
  });

  showToast(`Project ${pkg.projectCode} sent to ${pkg.assignedPM}`);
}

// 4. Review document: Both PM Admin & PM
function reviewDocument(docId) {
  productState.reviewingDocId = docId;
  renderProductApp();
}

function closeDocReview() {
  productState.reviewingDocId = null;
  renderProductApp();
}

// 5. Approve document: Both PM Admin & PM
function approveDocument(packageId, docId) {
  const pkg = getHandoverPackage(packageId);
  if (!pkg) return;
  const doc = pkg.documents.find((d) => d.id === docId);
  if (!doc) return;

  doc.status = "approved";
  pkg.remarks.unshift({
    id: "rem-" + Date.now(),
    authorRole: getCurrentRoleConfig().label,
    authorName: productState.currentRole === ROLES.PM ? "Project PM" : "Admin Operations",
    text: `Approved document: ${doc.name} (${doc.code}).`,
    timestamp: "Just now",
  });

  showToast(`Approved ${doc.name}`);
}

// 6. Reject document: Both PM Admin & PM
function rejectDocument(packageId, docId) {
  const pkg = getHandoverPackage(packageId);
  if (!pkg) return;
  const doc = pkg.documents.find((d) => d.id === docId);
  if (!doc) return;

  doc.status = "rejected";
  pkg.remarks.unshift({
    id: "rem-" + Date.now(),
    authorRole: getCurrentRoleConfig().label,
    authorName: productState.currentRole === ROLES.PM ? "Project PM" : "Admin Operations",
    text: `Rejected document: ${doc.name} (${doc.code}) for revision.`,
    timestamp: "Just now",
  });

  showToast(`Rejected ${doc.name} — sent for revision`);
}

// 7. Add remarks: Both PM Admin & PM
function addRemark(packageId) {
  const input = document.getElementById(`remark-input-${packageId}`);
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  const pkg = getHandoverPackage(packageId);
  if (!pkg) return;

  pkg.remarks.unshift({
    id: "rem-" + Date.now(),
    authorRole: getCurrentRoleConfig().label,
    authorName: productState.currentRole === ROLES.PM ? "Project PM" : "Admin Operations",
    text: text,
    timestamp: "Just now",
  });

  input.value = "";
  showToast("Remark added to design handover");
}

// ============================================================================
// EVENT DELEGATION
// ============================================================================

function handleProductClick(event) {
  const target = event.target;
  if (!(target instanceof Element)) return;

  // Role switcher buttons inside product header
  const roleButton = target.closest("[data-select-role]");
  if (roleButton) {
    setRole(roleButton.dataset.selectRole);
    return;
  }

  // Prototype role switcher in Layer A
  const protoRoleBtn = target.closest("[data-proto-role]");
  if (protoRoleBtn) {
    setRole(protoRoleBtn.dataset.protoRole);
    return;
  }

  // Screen navigation
  const screenButton = target.closest("[data-product-screen]");
  if (screenButton) {
    navigateProductScreen(screenButton.dataset.productScreen);
    return;
  }

  // Project context section tab
  const projectTab = target.closest("[data-project-section]");
  if (projectTab) {
    productState.currentProjectSection = projectTab.dataset.projectSection;
    renderProductApp();
    return;
  }

  // Generic command button
  const commandButton = target.closest("[data-command]");
  if (!commandButton) return;

  const command = commandButton.dataset.command;
  const actionId = commandButton.dataset.actionId;
  const packageId = commandButton.dataset.packageId;
  const docId = commandButton.dataset.docId;

  switch (command) {
    case "toggle-records":
      productState.recordsExpanded = !productState.recordsExpanded;
      renderProductApp();
      break;

    case "open-action":
      openAction(actionId);
      break;

    case "close-drawer":
      closeDrawer();
      break;

    case "open-in-project":
      openInProject(actionId);
      break;

    case "perform-action":
      performAction(actionId, commandButton.dataset.operation);
      break;

    case "back-to-quick-actions":
      returnToQuickActions();
      break;

    // Design Handover Commands
    case "dh-select-package":
      productState.selectedHandoverId = packageId;
      renderProductApp();
      break;

    case "dh-review-doc":
      reviewDocument(docId);
      break;

    case "dh-close-review":
      closeDocReview();
      break;

    case "dh-approve-doc":
      approveDocument(packageId, docId);
      break;

    case "dh-reject-doc":
      rejectDocument(packageId, docId);
      break;

    case "dh-add-remark":
      addRemark(packageId);
      break;

    case "dh-send-to-pm":
      sendProjectToPM(packageId);
      break;

    case "dh-open-records":
      closeDrawer(false);
      productState.selectedHandoverId = packageId || "dh-willow-park";
      navigateProductScreen("design-handover-records");
      break;

    default:
      break;
  }
}

function handleProductChange(event) {
  const target = event.target;
  if (!(target instanceof HTMLSelectElement)) return;

  const command = target.dataset.command;
  const packageId = target.dataset.packageId || productState.selectedHandoverId;
  const actionId = target.dataset.actionId;

  if (command === "dh-assign-pm" || command === "assign-pm") {
    assignPM(packageId, target.value, actionId);
  } else if (command === "dh-assign-se") {
    assignSE(packageId, target.value);
  }
}

function handleProductKeydown(event) {
  if (event.key === "Escape") {
    if (productState.reviewingDocId) {
      closeDocReview();
      return;
    }
    if (productState.activeDrawerId) {
      closeDrawer();
      return;
    }
  }

  if (event.key === "Tab" && productState.activeDrawerId) {
    const drawer = productAppRoot.querySelector(".action-drawer");
    const focusable = drawer ? Array.from(drawer.querySelectorAll("button:not([disabled]), select:not([disabled])")) : [];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}

// Global listeners
flowAreaToggle.addEventListener("click", () => {
  setFlowAreaCollapsed(!prototypeState.flowAreaCollapsed);
});

flowList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-flow-id]");
  if (!button || !flowList.contains(button)) return;
  selectFlow(button.dataset.flowId);
});

// Listen across whole document for prototype and product interactions
document.addEventListener("click", handleProductClick);
document.addEventListener("change", handleProductChange);
document.addEventListener("keydown", handleProductKeydown);

// Initial bootstrap
renderFlowList();
syncProtoRoleController();
renderProductViewport();

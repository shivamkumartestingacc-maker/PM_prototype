"use strict";

// Prototype flows select an embedded product screen. Keep this state separate
// from the role, navigation, records, and action state inside the product UI.
const flows = [
  {
    id: "flow-1",
    label: "Flow 01",
    screen: "quick-actions",
  },
];

const prototypeState = {
  currentFlowId: flows[0]?.id ?? null,
  flowAreaCollapsed: false,
};

const productState = {
  currentRole: "PM Admin",
  currentScreen: flows[0]?.screen ?? "quick-actions",
  recordsExpanded: true,
  activeDrawerId: null,
  currentProjectSection: null,
  contextActionId: null,
  returnScreen: "quick-actions",
  toastMessage: "",
};

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

// Local sample records make each Quick Actions card demonstrate a real path.
const actions = [
  {
    id: "handover-willow-park",
    category: "design-handover",
    projectId: "willow-park",
    project: "Willow Park Villa",
    projectCode: "WP-024",
    title: "Confirm design handover",
    summary: "The construction package is ready; confirm the issued drawings before site mobilisation.",
    details: "The coordinated drawing set and finish schedule are ready for handover. Review the package and confirm the PM owner before site work proceeds.",
    involvement: "Design team · 8 files",
    timing: "Due today",
    urgency: "due",
    assignedPM: "Project PM",
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
    involvement: "Daily report · Project PM",
    timing: "1 day overdue",
    urgency: "overdue",
    assignedPM: "Project PM",
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

const screenDescriptions = {
  insights: "Project insights will be added in a later iteration.",
  "design-handover-records": "The Design Handover records view will be added in a later iteration.",
  "ongoing-projects": "The Ongoing Projects records view will be added in a later iteration.",
  "completed-projects": "The Completed Projects records view will be added in a later iteration.",
};

const urgencyOrder = { overdue: 0, due: 1, soon: 2, normal: 3 };

const prototypeFrame = document.querySelector(".prototype-frame");
const flowAreaToggle = document.getElementById("flow-area-toggle");
const flowList = document.getElementById("flow-list");
const flowCount = document.getElementById("flow-count");
const activeFlowLabel = document.getElementById("active-flow-label");
const productViewport = document.getElementById("product-viewport");
const productAppRoot = document.getElementById("product-app-root");

let toastTimer = null;

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>\"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
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

// Shared table renderer for upcoming record screens; no invented records are shown yet.
function renderDataTable(columns, rows, emptyTitle = "No records yet") {
  if (!rows.length) return renderEmptyState(emptyTitle, "Records will appear here when this screen is defined.");
  return `
    <div class="table-scroll">
      <table class="product-table">
        <thead><tr>${columns.map((column) => `<th scope="col">${escapeHtml(column.label)}</th>`).join("")}</tr></thead>
        <tbody>${rows.map((row) => `<tr>${columns.map((column) => `<td>${escapeHtml(row[column.key])}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>
    </div>`;
}

function renderProductSidebar() {
  const currentScreen = productState.currentScreen;
  const quickActionsActive = currentScreen === "quick-actions" || currentScreen === "project-context";
  const recordsOpen = productState.recordsExpanded;

  const navItem = (screen, label, iconName, active) => `
    <button type="button" class="product-nav-item${active ? " is-active" : ""}" data-product-screen="${escapeHtml(screen)}"${active ? ' aria-current="page"' : ""}>
      <span class="nav-icon">${renderIcon(iconName)}</span>
      <span>${escapeHtml(label)}</span>
    </button>`;

  return `
    <aside class="product-sidebar" aria-label="PM Dashboard navigation">
      <div class="product-brand">
        <span class="product-brand-mark" aria-hidden="true">PM</span>
        <span class="product-brand-name">PM Dashboard</span>
      </div>
      <nav class="product-nav">
        <div class="product-nav-primary">
          ${navItem("quick-actions", "Quick Actions", "grid", quickActionsActive)}
          ${navItem("insights", "Insights", "chart", currentScreen === "insights")}
        </div>
        <div class="product-nav-group">
          <button type="button" class="product-nav-group-toggle" data-command="toggle-records" aria-expanded="${recordsOpen}">
            <span>Records</span>
            <span class="nav-group-chevron${recordsOpen ? " is-open" : ""}">${renderIcon("down")}</span>
          </button>
          <div class="product-nav-children"${recordsOpen ? "" : " hidden"}>
            ${navItem("design-handover-records", "Design Handover", "file", currentScreen === "design-handover-records")}
            ${navItem("ongoing-projects", "Ongoing Projects", "folder", currentScreen === "ongoing-projects")}
            ${navItem("completed-projects", "Completed Projects", "folder", currentScreen === "completed-projects")}
          </div>
        </div>
      </nav>
      <div class="product-sidebar-footer">
        <span class="sidebar-footer-dot" aria-hidden="true"></span>
        <span>Construction operations</span>
      </div>
    </aside>`;
}

function renderProductHeader() {
  const screenLabel = screenLabels[productState.currentScreen] ?? "PM Dashboard";
  return `
    <header class="product-topbar">
      <div class="topbar-context">
        <span class="topbar-context-title">${escapeHtml(screenLabel)}</span>
        <span class="sample-data-label">Sample data</span>
      </div>
      <div class="role-preview">
        <span class="role-preview-label">Preview as</span>
        <div class="role-switcher" role="group" aria-label="Preview role">
          <button type="button" class="role-option${productState.currentRole === "PM Admin" ? " is-active" : ""}" data-select-role="PM Admin" aria-pressed="${productState.currentRole === "PM Admin"}">PM Admin</button>
          <button type="button" class="role-option${productState.currentRole === "PM" ? " is-active" : ""}" data-select-role="PM" aria-pressed="${productState.currentRole === "PM"}">PM</button>
        </div>
      </div>
    </header>`;
}

function getVisibleActions() {
  return actions.filter((action) => {
    if (action.status !== "pending") return false;
    if (productState.currentRole === "PM Admin") return true;
    if (action.adminOnly) return false;
    if (action.category === "design-handover") return action.assignedPM === "Project PM";
    return action.assignedPM === "Project PM";
  });
}

function renderActionCard(action) {
  const assignee = productState.currentRole === "PM" ? "Assigned to you" : `PM · ${action.assignedPM}`;
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
  const visibleCategories = actionCategories.filter((category) => !category.adminOnly || productState.currentRole === "PM Admin");
  return visibleCategories.map(renderActionColumn).join("");
}

function renderQuickActionsPage() {
  const openCount = getVisibleActions().length;
  const summary = `
    <div class="attention-summary" aria-label="${openCount} open actions">
      <span class="attention-count">${openCount}</span>
      <span class="attention-copy"><strong>open actions</strong><small>across your projects</small></span>
    </div>`;

  return `
    <section class="quick-actions-page">
      ${renderPageHeader("OPERATIONS", "Quick Actions", "Work that needs attention across your projects.", summary)}
      <div class="board-guide">
        <span class="board-guide-indicator" aria-hidden="true"></span>
        <span>Open a card to review the action or jump to its project section.</span>
        <span class="board-guide-scroll">Scroll horizontally to see all categories</span>
      </div>
      <div class="action-board" aria-label="Quick Actions board">${renderActionBoard()}</div>
    </section>`;
}

function renderTabs(items, activeItem) {
  return `
    <nav class="project-navigation" role="tablist" aria-label="Project sections" aria-orientation="vertical">
      ${items.map((item) => `
        <button type="button" class="project-tab${item === activeItem ? " is-active" : ""}" role="tab" aria-selected="${item === activeItem}" data-project-section="${escapeHtml(item)}">
          <span class="project-tab-marker" aria-hidden="true"></span>
          <span>${escapeHtml(item)}</span>
        </button>`).join("")}
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
  const sectionContent = activeSection === action.projectSection
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

function renderUnbuiltScreen(screen) {
  const title = screenLabels[screen] ?? "Product screen";
  const description = screenDescriptions[screen] ?? "This screen will be added in a later iteration.";
  return `
    <section class="unbuilt-screen">
      ${renderPageHeader("RECORDS & INSIGHTS", title, description)}
      ${renderEmptyState("Screen scaffold ready", "This area is reserved for the next product screen.")}
    </section>`;
}

function renderCurrentScreen() {
  if (productState.currentScreen === "quick-actions") return renderQuickActionsPage();
  if (productState.currentScreen === "project-context") return renderProjectContextPage();
  return renderUnbuiltScreen(productState.currentScreen);
}

function renderActionDrawer(action) {
  const category = getCategory(action.category);
  const showPMAssignment = action.category === "design-handover" && productState.currentRole === "PM Admin";
  const assignmentMarkup = showPMAssignment
    ? `
      <label class="assignment-field" for="assign-pm-select">
        <span>Assign PM</span>
        <select id="assign-pm-select" data-command="assign-pm" data-action-id="${escapeHtml(action.id)}">
          <option value="Project PM"${action.assignedPM === "Project PM" ? " selected" : ""}>Project PM</option>
          <option value="Unassigned"${action.assignedPM === "Unassigned" ? " selected" : ""}>Unassigned</option>
        </select>
      </label>`
    : `
      <div class="assignment-readonly">
        <span>Assigned PM</span>
        <strong>${productState.currentRole === "PM" ? "You" : escapeHtml(action.assignedPM)}</strong>
      </div>`;

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
            ${productState.currentRole === "PM Admin" ? `<div><dt>Assigned PM</dt><dd>${escapeHtml(action.assignedPM)}</dd></div>` : ""}
          </dl>
          <section class="drawer-detail-section">
            <h3>Review context</h3>
            <p>${escapeHtml(action.details)}</p>
          </section>
          ${assignmentMarkup}
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
      ${renderToast()}
    </div>`;
  productViewport.dataset.role = productState.currentRole;
  productViewport.dataset.screen = productState.currentScreen;
}

function renderProductViewport() {
  const flow = getCurrentFlow();
  const flowLabel = flow?.label ?? "No flow selected";
  activeFlowLabel.textContent = flowLabel;
  productViewport.dataset.flowId = flow?.id ?? "";
  if (!productState.currentScreen && flow?.screen) productState.currentScreen = flow.screen;
  renderProductApp();
}

function selectFlow(flowId) {
  const flow = flows.find((item) => item.id === flowId);
  if (!flow || prototypeState.currentFlowId === flowId) return;

  prototypeState.currentFlowId = flowId;
  productState.currentScreen = flow.screen ?? "quick-actions";
  productState.activeDrawerId = null;
  productState.contextActionId = null;
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
  if (!["PM Admin", "PM"].includes(role) || productState.currentRole === role) return;
  productState.currentRole = role;

  const openAction = productState.activeDrawerId ? getAction(productState.activeDrawerId) : null;
  if (role === "PM" && (openAction?.adminOnly || (openAction?.category === "design-handover" && openAction.assignedPM !== "Project PM"))) {
    productState.activeDrawerId = null;
  }
  const contextAction = productState.currentScreen === "project-context" ? getAction(productState.contextActionId) : null;
  if (role === "PM" && (contextAction?.adminOnly || (contextAction?.category === "design-handover" && contextAction.assignedPM !== "Project PM"))) {
    productState.currentScreen = "quick-actions";
    productState.contextActionId = null;
    productState.currentProjectSection = null;
  }
  renderProductApp();
}

function navigateProductScreen(screen) {
  productState.currentScreen = screen;
  productState.activeDrawerId = null;
  productState.contextActionId = null;
  productState.currentProjectSection = null;
  productState.toastMessage = "";
  if (["design-handover-records", "ongoing-projects", "completed-projects"].includes(screen)) {
    productState.recordsExpanded = true;
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
    const card = Array.from(productAppRoot.querySelectorAll('[data-command="open-action"]'))
      .find((element) => element.dataset.actionId === previousActionId);
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
  if (operation === "complete-on-behalf" && productState.currentRole !== "PM Admin") return;

  action.status = result.status;
  productState.activeDrawerId = null;
  if (productState.currentScreen === "project-context" && productState.contextActionId === action.id) {
    productState.currentScreen = productState.returnScreen === "project-context" ? "quick-actions" : productState.returnScreen;
    productState.contextActionId = null;
    productState.currentProjectSection = null;
  }
  showToast(result.message);
}

function assignPM(actionId, assignedPM) {
  const action = getAction(actionId);
  if (!action || action.category !== "design-handover" || productState.currentRole !== "PM Admin") return;
  if (!["Project PM", "Unassigned"].includes(assignedPM)) return;
  action.assignedPM = assignedPM;
  productState.toastMessage = "PM assignment updated.";
  renderProductApp();
  document.getElementById("assign-pm-select")?.focus();
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    productState.toastMessage = "";
    renderProductApp();
  }, 2200);
}

function handleProductClick(event) {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const roleButton = target.closest("[data-select-role]");
  if (roleButton) {
    setRole(roleButton.dataset.selectRole);
    return;
  }

  const screenButton = target.closest("[data-product-screen]");
  if (screenButton) {
    navigateProductScreen(screenButton.dataset.productScreen);
    return;
  }

  const projectTab = target.closest("[data-project-section]");
  if (projectTab) {
    productState.currentProjectSection = projectTab.dataset.projectSection;
    renderProductApp();
    return;
  }

  const commandButton = target.closest("[data-command]");
  if (!commandButton || !productAppRoot.contains(commandButton)) return;

  const actionId = commandButton.dataset.actionId;
  switch (commandButton.dataset.command) {
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
    default:
      break;
  }
}

function handleProductChange(event) {
  const target = event.target;
  if (!(target instanceof HTMLSelectElement) || target.dataset.command !== "assign-pm") return;
  assignPM(target.dataset.actionId, target.value);
}

function handleProductKeydown(event) {
  if (event.key === "Escape" && productState.activeDrawerId) {
    closeDrawer();
    return;
  }

  if (event.key === "Tab" && productState.activeDrawerId) {
    const drawer = productAppRoot.querySelector(".action-drawer");
    const focusable = drawer ? Array.from(drawer.querySelectorAll('button:not([disabled]), select:not([disabled])')) : [];
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

flowAreaToggle.addEventListener("click", () => {
  setFlowAreaCollapsed(!prototypeState.flowAreaCollapsed);
});

flowList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-flow-id]");
  if (!button || !flowList.contains(button)) return;
  selectFlow(button.dataset.flowId);
});

productAppRoot.addEventListener("click", handleProductClick);
productAppRoot.addEventListener("change", handleProductChange);
productAppRoot.addEventListener("keydown", handleProductKeydown);

renderFlowList();
renderProductViewport();

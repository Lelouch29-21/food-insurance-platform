const STORAGE_KEY = "pixelTaskNexus::state";
const SESSION_KEY = "pixelTaskNexus::session";
const FLASH_TIMEOUT_MS = 2800;

const appRoot = document.getElementById("app");

const STATUS_META = {
  bucket: { label: "Bucket", className: "status-bucket" },
  in_progress: { label: "In Progress", className: "status-in_progress" },
  blocked: { label: "Blocked", className: "status-blocked" },
  done: { label: "Done", className: "status-done" },
};

const PRIORITY_META = {
  low: { label: "Low", className: "priority-low" },
  medium: { label: "Medium", className: "priority-medium" },
  high: { label: "High", className: "priority-high" },
};

const BOARD_STATUSES = ["in_progress", "blocked", "done"];

const uiState = {
  selectedTaskId: null,
  loginError: "",
  flash: null,
};

let flashTimerId = null;
let state = loadState();

appRoot.addEventListener("click", handleClick);
appRoot.addEventListener("submit", handleSubmit);
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && uiState.selectedTaskId) {
    uiState.selectedTaskId = null;
    render();
  }
});

render();

function createSeedState() {
  const now = new Date();
  const iso = now.toISOString();
  const users = [
    {
      id: "u-admin",
      name: "Avery Admin",
      username: "admin",
      password: "admin123",
      role: "admin",
    },
    {
      id: "u-manager",
      name: "Mia Manager",
      username: "manager",
      password: "manager123",
      role: "manager",
    },
    {
      id: "u-alex",
      name: "Alex Kim",
      username: "alex",
      password: "alex123",
      role: "member",
    },
    {
      id: "u-sam",
      name: "Sam Rivera",
      username: "sam",
      password: "sam123",
      role: "member",
    },
    {
      id: "u-rina",
      name: "Rina Das",
      username: "rina",
      password: "rina123",
      role: "member",
    },
  ];

  const taskA = {
    id: "t-onboarding",
    title: "Design onboarding checklist",
    description:
      "Create a collaborative onboarding checklist that new members can follow during their first week.",
    priority: "medium",
    status: "bucket",
    createdBy: "u-manager",
    assignedTo: null,
    dueDate: dateOffset(3),
    internalEstimate: estimateFromDetails("medium", "onboarding checklist"),
    comments: [],
    history: [
      {
        id: "h-a-1",
        actorId: "u-manager",
        message: "Task created in the pending bucket.",
        createdAt: iso,
      },
    ],
    createdAt: iso,
    updatedAt: iso,
  };

  const taskB = {
    id: "t-handbook",
    title: "Update policy handbook visuals",
    description:
      "Refresh handbook diagrams, improve section headers, and align with the new visual baseline.",
    priority: "high",
    status: "in_progress",
    createdBy: "u-manager",
    assignedTo: "u-alex",
    dueDate: dateOffset(5),
    internalEstimate: estimateFromDetails("high", "visual system update"),
    comments: [
      {
        id: "c-b-1",
        userId: "u-rina",
        body: "I can review icon consistency once the first draft is up.",
        createdAt: pastHours(10),
      },
    ],
    history: [
      {
        id: "h-b-1",
        actorId: "u-manager",
        message: "Task created and assigned to Alex.",
        createdAt: pastHours(14),
      },
      {
        id: "h-b-2",
        actorId: "u-alex",
        message: "Started work and opened collaboration thread.",
        createdAt: pastHours(9),
      },
    ],
    createdAt: pastHours(14),
    updatedAt: pastHours(9),
  };

  const taskC = {
    id: "t-kb",
    title: "Compile FAQ knowledge base",
    description:
      "Pull repeated support questions into a concise FAQ and mark unresolved items for follow-up.",
    priority: "low",
    status: "blocked",
    createdBy: "u-manager",
    assignedTo: "u-sam",
    dueDate: dateOffset(4),
    internalEstimate: estimateFromDetails("low", "faq compilation"),
    comments: [
      {
        id: "c-c-1",
        userId: "u-sam",
        body: "Waiting for two pending answers from legal before final pass.",
        createdAt: pastHours(5),
      },
    ],
    history: [
      {
        id: "h-c-1",
        actorId: "u-manager",
        message: "Task moved to blocked until dependencies arrive.",
        createdAt: pastHours(5),
      },
    ],
    createdAt: pastHours(18),
    updatedAt: pastHours(5),
  };

  const taskD = {
    id: "t-retro",
    title: "Ship sprint retrospective note",
    description: "Capture key wins, misses, and action items from the sprint closure.",
    priority: "medium",
    status: "done",
    createdBy: "u-manager",
    assignedTo: "u-rina",
    dueDate: dateOffset(-1),
    internalEstimate: estimateFromDetails("medium", "retrospective notes"),
    comments: [
      {
        id: "c-d-1",
        userId: "u-manager",
        body: "Approved. Please archive in the team wiki folder.",
        createdAt: pastHours(2),
      },
    ],
    history: [
      {
        id: "h-d-1",
        actorId: "u-rina",
        message: "Task completed and handed off to manager.",
        createdAt: pastHours(2),
      },
    ],
    createdAt: pastHours(26),
    updatedAt: pastHours(2),
  };

  return {
    version: 1,
    users,
    tasks: [taskA, taskB, taskC, taskD],
    nudges: [
      {
        id: "n-1",
        taskId: "t-kb",
        fromUserId: "u-manager",
        toUserId: "u-sam",
        message: "Please share an ETA update in the thread before standup.",
        createdAt: pastHours(1),
        readAt: null,
      },
    ],
  };
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seed = createSeedState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.users) || !Array.isArray(parsed.tasks) || !Array.isArray(parsed.nudges)) {
      throw new Error("Invalid state");
    }
    return parsed;
  } catch {
    const seed = createSeedState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getCurrentUser() {
  const userId = localStorage.getItem(SESSION_KEY);
  if (!userId) {
    return null;
  }
  return state.users.find((user) => user.id === userId) || null;
}

function setCurrentUser(userId) {
  if (!userId) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }
  localStorage.setItem(SESSION_KEY, userId);
}

function render() {
  const user = getCurrentUser();
  if (!user) {
    appRoot.innerHTML = renderLogin();
    return;
  }

  const bucketTasks = sortedTasks().filter((task) => task.status === "bucket");
  const board = {
    in_progress: sortedTasks().filter((task) => task.status === "in_progress"),
    blocked: sortedTasks().filter((task) => task.status === "blocked"),
    done: sortedTasks().filter((task) => task.status === "done"),
  };

  const unreadNudges = state.nudges.filter((nudge) => nudge.toUserId === user.id && !nudge.readAt).length;
  const myOpenTasks = state.tasks.filter(
    (task) => task.assignedTo === user.id && task.status !== "done" && task.status !== "bucket"
  ).length;

  appRoot.innerHTML = `
    <div class="screen">
      <header class="app-header pixel-panel animate-rise">
        <div class="header-left">
          <h1 class="header-title">Pixel Task Nexus</h1>
          <p class="header-subtitle">Shared task board with manager nudges, collaboration threads, and admin controls.</p>
        </div>
        <div class="header-right">
          <span class="role-chip ${escapeHtml(user.role)}">${escapeHtml(user.name)} · ${escapeHtml(user.role)}</span>
          <button class="btn small" data-action="reset-data" type="button">Reset Demo Data</button>
          <button class="btn small" data-action="logout" type="button">Logout</button>
        </div>
      </header>

      ${renderFlash()}

      <section class="stats-grid">
        <article class="stat-card pixel-panel">
          <span class="stat-label">All Tasks</span>
          <span class="stat-value">${state.tasks.length}</span>
        </article>
        <article class="stat-card pixel-panel">
          <span class="stat-label">Bucket Ready</span>
          <span class="stat-value">${bucketTasks.length}</span>
        </article>
        <article class="stat-card pixel-panel">
          <span class="stat-label">My Active</span>
          <span class="stat-value">${myOpenTasks}</span>
        </article>
        <article class="stat-card pixel-panel">
          <span class="stat-label">Unread Nudges</span>
          <span class="stat-value">${unreadNudges}</span>
        </article>
      </section>

      <section class="workspace-grid">
        <main class="main-column">
          ${canManage(user) ? renderManagerPanel() : ""}
          ${renderBucketSection(bucketTasks, user)}
          ${renderBoard(board, user)}
        </main>

        <aside class="side-column">
          ${renderNudgeInbox(user)}
          ${renderActivityFeed()}
          ${isAdmin(user) ? renderAdminPanel() : ""}
        </aside>
      </section>
    </div>

    ${uiState.selectedTaskId ? renderTaskModal(user) : ""}
  `;
}

function renderFlash() {
  if (!uiState.flash) {
    return "";
  }
  return `<div class="flash ${escapeHtml(uiState.flash.type)}">${escapeHtml(uiState.flash.message)}</div>`;
}

function renderLogin() {
  const demoUsers = state.users.filter((user) => ["admin", "manager", "member"].includes(user.role));

  return `
    <section class="login-layout">
      <div class="login-panel pixel-panel animate-rise">
        <div class="login-left">
          <h1 class="login-title">Pixel Task Nexus</h1>
          <p class="login-subtitle">
            Professional, light-mode task collaboration with shared visibility, pending task bucket pickup,
            manager nudges, and admin-level controls.
          </p>
          <div class="credential-grid">
            ${demoUsers
              .map(
                (user) => `
                <div class="credential-row">
                  <div>
                    <strong>${escapeHtml(user.role.toUpperCase())}</strong> · ${escapeHtml(user.name)}
                    <div class="text-muted">${escapeHtml(user.username)} / ${escapeHtml(user.username)}123</div>
                  </div>
                  <button class="btn small" type="button" data-action="login-demo" data-username="${escapeHtml(
                    user.username
                  )}">Use</button>
                </div>
              `
              )
              .join("")}
          </div>
          <p class="footer-note">
            Internal task estimates are saved per task for planning, but intentionally hidden from UI surfaces.
          </p>
        </div>

        <div class="login-right">
          <h2 class="panel-title">Secure Login</h2>
          ${uiState.loginError ? `<div class="login-error">${escapeHtml(uiState.loginError)}</div>` : ""}
          <form id="login-form" class="login-form">
            <div class="field">
              <label for="username">Username</label>
              <input id="username" name="username" autocomplete="username" required />
            </div>
            <div class="field">
              <label for="password">Password</label>
              <input id="password" name="password" type="password" autocomplete="current-password" required />
            </div>
            <button class="btn primary" type="submit">Login</button>
          </form>
        </div>
      </div>
    </section>
  `;
}

function renderManagerPanel() {
  const assignableTasks = sortedTasks().filter((task) => task.assignedTo && task.status !== "done");

  return `
    <section class="panel pixel-panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Manager Controls</h2>
          <p class="panel-subtitle">Create bucket tasks and nudge assignees when progress stalls.</p>
        </div>
      </div>

      <form id="create-task-form" class="form-grid">
        <div class="field">
          <label for="taskTitle">Task Title</label>
          <input id="taskTitle" name="title" maxlength="90" required />
        </div>
        <div class="field">
          <label for="taskPriority">Priority</label>
          <select id="taskPriority" name="priority" required>
            <option value="low">Low</option>
            <option value="medium" selected>Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div class="field full">
          <label for="taskDescription">Description</label>
          <textarea id="taskDescription" name="description" maxlength="360" required></textarea>
        </div>
        <div class="field">
          <label for="taskDueDate">Due Date</label>
          <input id="taskDueDate" name="dueDate" type="date" />
        </div>
        <div class="field">
          <label for="taskLabel">Label (Optional)</label>
          <input id="taskLabel" name="label" maxlength="28" placeholder="Ops, Design, Policy" />
        </div>
        <div class="field full">
          <button class="btn primary" type="submit">Add To Bucket</button>
        </div>
      </form>

      <form id="nudge-form" class="inline-form">
        <h3>Send Nudge</h3>
        <div class="split">
          <select name="taskId" required>
            <option value="">Select assigned task</option>
            ${assignableTasks
              .map(
                (task) =>
                  `<option value="${escapeHtml(task.id)}">${escapeHtml(task.title)} · ${escapeHtml(
                    displayUserName(task.assignedTo)
                  )}</option>`
              )
              .join("")}
          </select>
          <button class="btn warn" type="submit">Nudge Assignee</button>
        </div>
        <div class="field">
          <label for="nudgeMessage">Message</label>
          <input
            id="nudgeMessage"
            name="message"
            maxlength="140"
            placeholder="Share progress before EOD and update blockers"
            required
          />
        </div>
      </form>
    </section>
  `;
}

function renderBucketSection(bucketTasks, user) {
  return `
    <section class="panel pixel-panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Task Bucket</h2>
          <p class="panel-subtitle">Pending tasks managers dropped in. Team members can pick what they want to execute.</p>
        </div>
      </div>

      ${
        bucketTasks.length
          ? `<div class="bucket-grid">${bucketTasks
              .map((task) => renderTaskCard(task, user, "bucket"))
              .join("")}</div>`
          : '<div class="empty-state">Bucket is clear. Manager can add new tasks using the control panel.</div>'
      }
    </section>
  `;
}

function renderBoard(board, user) {
  return `
    <section class="panel pixel-panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Team Workflow Board</h2>
          <p class="panel-subtitle">Everyone can see every task and collaborate in each task thread.</p>
        </div>
      </div>

      <div class="task-columns">
        ${BOARD_STATUSES.map((status) => renderColumn(status, board[status], user)).join("")}
      </div>
    </section>
  `;
}

function renderColumn(status, tasks, user) {
  return `
    <div class="column">
      <div class="column-title">
        <span>${STATUS_META[status].label}</span>
        <span class="count-badge">${tasks.length}</span>
      </div>
      ${
        tasks.length
          ? `<div class="task-list">${tasks.map((task) => renderTaskCard(task, user, status)).join("")}</div>`
          : '<div class="empty-state">No tasks here.</div>'
      }
    </div>
  `;
}

function renderTaskCard(task, user, section) {
  const assignee = displayUserName(task.assignedTo);
  const creator = displayUserName(task.createdBy);
  const priorityMeta = PRIORITY_META[task.priority] || PRIORITY_META.medium;
  const statusMeta = STATUS_META[task.status] || STATUS_META.bucket;

  return `
    <article class="task-card">
      <div class="task-head">
        <h3 class="task-title">${escapeHtml(task.title)}</h3>
        <div class="meta-row">
          <span class="priority-pill ${priorityMeta.className}">${priorityMeta.label}</span>
          <span class="status-pill ${statusMeta.className}">${statusMeta.label}</span>
        </div>
      </div>

      <p class="task-description">${escapeHtml(task.description)}</p>

      <div class="meta-row text-muted">
        <span>Assignee: ${escapeHtml(assignee)}</span>
        <span>Due: ${escapeHtml(formatDate(task.dueDate))}</span>
        <span>By: ${escapeHtml(creator)}</span>
      </div>

      <div class="task-footer">
        <div class="task-actions">
          <button class="btn small ghost" data-action="open-task" data-task-id="${escapeHtml(task.id)}" type="button">Thread</button>
          ${renderTaskActions(task, user, section)}
        </div>
        <span class="text-muted">${task.comments.length} comments</span>
      </div>
    </article>
  `;
}

function renderTaskActions(task, user, section) {
  const isAssignee = task.assignedTo === user.id;
  const manager = canManage(user);
  const canOperate = isAssignee || manager;

  if (section === "bucket") {
    return `<button class="btn small success" data-action="pick-task" data-task-id="${escapeHtml(
      task.id
    )}" type="button">Take Task</button>`;
  }

  if (!canOperate) {
    return "";
  }

  if (task.status === "in_progress") {
    return `
      <button class="btn small warn" data-action="move-status" data-task-id="${escapeHtml(
        task.id
      )}" data-next-status="blocked" type="button">Block</button>
      <button class="btn small success" data-action="move-status" data-task-id="${escapeHtml(
        task.id
      )}" data-next-status="done" type="button">Complete</button>
      ${
        manager
          ? `<button class="btn small" data-action="quick-nudge" data-task-id="${escapeHtml(
              task.id
            )}" type="button">Nudge</button>`
          : ""
      }
    `;
  }

  if (task.status === "blocked") {
    return `
      <button class="btn small" data-action="move-status" data-task-id="${escapeHtml(
        task.id
      )}" data-next-status="in_progress" type="button">Resume</button>
      <button class="btn small success" data-action="move-status" data-task-id="${escapeHtml(
        task.id
      )}" data-next-status="done" type="button">Complete</button>
      ${
        manager
          ? `<button class="btn small" data-action="quick-nudge" data-task-id="${escapeHtml(
              task.id
            )}" type="button">Nudge</button>`
          : ""
      }
    `;
  }

  if (task.status === "done") {
    return `<button class="btn small" data-action="move-status" data-task-id="${escapeHtml(
      task.id
    )}" data-next-status="in_progress" type="button">Reopen</button>`;
  }

  return "";
}

function renderNudgeInbox(user) {
  const nudges = [...state.nudges]
    .filter((item) => item.toUserId === user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return `
    <section class="panel pixel-panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Nudge Inbox</h2>
          <p class="panel-subtitle">Manager nudges targeted to you.</p>
        </div>
      </div>

      ${
        nudges.length
          ? `<div class="inbox-list">${nudges
              .map((nudge) => {
                const task = state.tasks.find((item) => item.id === nudge.taskId);
                const fromUser = displayUserName(nudge.fromUserId);
                return `
                  <article class="notice ${nudge.readAt ? "" : "unread"}">
                    <div class="notice-head">
                      <strong>${escapeHtml(task ? task.title : "Task")}</strong>
                      <span class="text-muted">${escapeHtml(timeAgo(nudge.createdAt))}</span>
                    </div>
                    <p>${escapeHtml(nudge.message)}</p>
                    <div class="row-top">
                      <span class="text-muted">From ${escapeHtml(fromUser)}</span>
                      ${
                        nudge.readAt
                          ? '<span class="pill">Read</span>'
                          : `<button class="btn small" data-action="mark-nudge-read" data-nudge-id="${escapeHtml(
                              nudge.id
                            )}" type="button">Mark Read</button>`
                      }
                    </div>
                  </article>
                `;
              })
              .join("")}</div>`
          : '<div class="empty-state">No nudges assigned to you.</div>'
      }
    </section>
  `;
}

function renderActivityFeed() {
  const feed = state.tasks
    .flatMap((task) =>
      (task.history || []).map((entry) => ({
        ...entry,
        taskId: task.id,
        taskTitle: task.title,
      }))
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  return `
    <section class="panel pixel-panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Activity Feed</h2>
          <p class="panel-subtitle">Latest team actions across tasks.</p>
        </div>
      </div>

      ${
        feed.length
          ? `<div class="activity-list">${feed
              .map(
                (entry) => `
                <article class="activity-item">
                  <div class="row-top">
                    <strong>${escapeHtml(entry.taskTitle)}</strong>
                    <span class="text-muted">${escapeHtml(timeAgo(entry.createdAt))}</span>
                  </div>
                  <p>${escapeHtml(entry.message)}</p>
                  <div class="inline-actions">
                    <button class="btn small ghost" data-action="open-task" data-task-id="${escapeHtml(
                      entry.taskId
                    )}" type="button">Open Thread</button>
                  </div>
                </article>
              `
              )
              .join("")}</div>`
          : '<div class="empty-state">No activity yet.</div>'
      }
    </section>
  `;
}

function renderAdminPanel() {
  const users = [...state.users].sort((a, b) => a.name.localeCompare(b.name));

  return `
    <section class="panel pixel-panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Admin Access</h2>
          <p class="panel-subtitle">Manage users and role levels.</p>
        </div>
      </div>

      <div class="user-list">
        ${users
          .map(
            (user) => `
            <article class="user-row">
              <div class="row-top">
                <strong>${escapeHtml(user.name)}</strong>
                <span class="role-chip ${escapeHtml(user.role)}">${escapeHtml(user.role)}</span>
              </div>
              <div class="text-muted">@${escapeHtml(user.username)}</div>
              <form data-form="role-update" class="split">
                <input type="hidden" name="userId" value="${escapeHtml(user.id)}" />
                <select name="role" required>
                  <option value="member" ${user.role === "member" ? "selected" : ""}>Member</option>
                  <option value="manager" ${user.role === "manager" ? "selected" : ""}>Manager</option>
                  <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
                </select>
                <button class="btn small" type="submit">Update Role</button>
              </form>
            </article>
          `
          )
          .join("")}
      </div>

      <form id="create-user-form" class="form-grid">
        <div class="field">
          <label for="newName">Name</label>
          <input id="newName" name="name" maxlength="56" required />
        </div>
        <div class="field">
          <label for="newUsername">Username</label>
          <input id="newUsername" name="username" maxlength="28" required />
        </div>
        <div class="field">
          <label for="newPassword">Password</label>
          <input id="newPassword" name="password" maxlength="28" required />
        </div>
        <div class="field">
          <label for="newRole">Role</label>
          <select id="newRole" name="role" required>
            <option value="member">Member</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div class="field full">
          <button class="btn primary" type="submit">Create User</button>
        </div>
      </form>
    </section>
  `;
}

function renderTaskModal(user) {
  const task = state.tasks.find((item) => item.id === uiState.selectedTaskId);
  if (!task) {
    uiState.selectedTaskId = null;
    return "";
  }

  const comments = [...task.comments].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const canAssign = canManage(user);
  const assigneeOptions = state.users
    .map(
      (candidate) =>
        `<option value="${escapeHtml(candidate.id)}" ${task.assignedTo === candidate.id ? "selected" : ""}>${escapeHtml(
          candidate.name
        )} (${escapeHtml(candidate.role)})</option>`
    )
    .join("");

  return `
    <div class="modal-backdrop" data-action="dismiss-modal">
      <article class="modal" role="dialog" aria-modal="true" aria-label="Task details">
        <div class="row-top">
          <h3>${escapeHtml(task.title)}</h3>
          <button class="btn small" type="button" data-action="close-task-modal">Close</button>
        </div>

        <p class="task-description">${escapeHtml(task.description)}</p>

        <div class="meta-row">
          <span class="status-pill ${(STATUS_META[task.status] || STATUS_META.bucket).className}">${
    (STATUS_META[task.status] || STATUS_META.bucket).label
  }</span>
          <span class="priority-pill ${(PRIORITY_META[task.priority] || PRIORITY_META.medium).className}">${
    (PRIORITY_META[task.priority] || PRIORITY_META.medium).label
  }</span>
          <span class="pill">Assignee: ${escapeHtml(displayUserName(task.assignedTo))}</span>
          <span class="pill">Due: ${escapeHtml(formatDate(task.dueDate))}</span>
        </div>

        ${
          canAssign
            ? `
            <form id="assign-form" class="inline-form">
              <input type="hidden" name="taskId" value="${escapeHtml(task.id)}" />
              <div class="split">
                <select name="assigneeId">
                  <option value="">Return to bucket (unassigned)</option>
                  ${assigneeOptions}
                </select>
                <button class="btn" type="submit">Apply Assignment</button>
              </div>
            </form>
          `
            : ""
        }

        <section>
          <h4>Collaboration Thread</h4>
          ${
            comments.length
              ? `<div class="comments">${comments
                  .map(
                    (comment) => `
                    <article class="comment-row">
                      <div class="row-top">
                        <strong>${escapeHtml(displayUserName(comment.userId))}</strong>
                        <span class="text-muted">${escapeHtml(timeAgo(comment.createdAt))}</span>
                      </div>
                      <p>${escapeHtml(comment.body)}</p>
                    </article>
                  `
                  )
                  .join("")}</div>`
              : '<div class="empty-state">No comments yet. Start collaborating on this task.</div>'
          }

          <form id="comment-form" class="inline-form">
            <input type="hidden" name="taskId" value="${escapeHtml(task.id)}" />
            <div class="field">
              <label for="commentBody">Add Comment</label>
              <textarea id="commentBody" name="body" maxlength="260" required></textarea>
            </div>
            <button class="btn primary" type="submit">Post Comment</button>
          </form>
        </section>
      </article>
    </div>
  `;
}

function handleClick(event) {
  const target = event.target.closest("[data-action]");
  if (!target) {
    return;
  }

  const action = target.dataset.action;
  const user = getCurrentUser();

  if (action === "login-demo") {
    const username = target.dataset.username;
    const account = state.users.find((item) => item.username === username);
    if (!account) {
      return;
    }
    uiState.loginError = "";
    setCurrentUser(account.id);
    setFlash(`Logged in as ${account.name}.`, "success");
    render();
    return;
  }

  if (action === "logout") {
    setCurrentUser("");
    uiState.selectedTaskId = null;
    uiState.loginError = "";
    uiState.flash = null;
    render();
    return;
  }

  if (!user) {
    return;
  }

  if (action === "reset-data") {
    if (!window.confirm("Reset all local demo data for this app?")) {
      return;
    }
    const currentUsername = user.username;
    state = createSeedState();
    saveState();
    const mapped = state.users.find((candidate) => candidate.username === currentUsername);
    setCurrentUser(mapped ? mapped.id : "");
    uiState.selectedTaskId = null;
    setFlash("Demo state reset.", "success");
    render();
    return;
  }

  if (action === "open-task") {
    uiState.selectedTaskId = target.dataset.taskId || null;
    render();
    return;
  }

  if (action === "close-task-modal") {
    uiState.selectedTaskId = null;
    render();
    return;
  }

  if (action === "dismiss-modal") {
    if (event.target === target) {
      uiState.selectedTaskId = null;
      render();
    }
    return;
  }

  if (action === "pick-task") {
    const taskId = target.dataset.taskId;
    const task = state.tasks.find((item) => item.id === taskId);
    if (!task || task.status !== "bucket") {
      setFlash("Task is no longer available in the bucket.", "error");
      render();
      return;
    }
    task.assignedTo = user.id;
    task.status = "in_progress";
    task.updatedAt = new Date().toISOString();
    addHistory(task, user.id, `${user.name} picked up the task from the bucket.`);
    saveState();
    setFlash("Task assigned to you.", "success");
    render();
    return;
  }

  if (action === "move-status") {
    const taskId = target.dataset.taskId;
    const nextStatus = target.dataset.nextStatus;
    const task = state.tasks.find((item) => item.id === taskId);
    if (!task || !STATUS_META[nextStatus]) {
      return;
    }

    const isAssignee = task.assignedTo === user.id;
    if (!canManage(user) && !isAssignee) {
      setFlash("Only assignee, manager, or admin can update this task.", "error");
      render();
      return;
    }

    task.status = nextStatus;
    if (nextStatus !== "bucket" && !task.assignedTo) {
      task.assignedTo = user.id;
    }
    task.updatedAt = new Date().toISOString();
    addHistory(task, user.id, `${user.name} changed status to ${STATUS_META[nextStatus].label}.`);
    saveState();
    setFlash(`Task moved to ${STATUS_META[nextStatus].label}.`, "success");
    render();
    return;
  }

  if (action === "quick-nudge") {
    if (!canManage(user)) {
      return;
    }
    const task = state.tasks.find((item) => item.id === target.dataset.taskId);
    if (!task || !task.assignedTo) {
      setFlash("Task needs an assignee before nudging.", "error");
      render();
      return;
    }

    const message = "Please share a progress update on this task.";
    state.nudges.push({
      id: uniqueId("nudge"),
      taskId: task.id,
      fromUserId: user.id,
      toUserId: task.assignedTo,
      message,
      createdAt: new Date().toISOString(),
      readAt: null,
    });
    addHistory(task, user.id, `${user.name} nudged ${displayUserName(task.assignedTo)} for an update.`);
    task.updatedAt = new Date().toISOString();
    saveState();
    setFlash("Nudge sent.", "success");
    render();
    return;
  }

  if (action === "mark-nudge-read") {
    const nudge = state.nudges.find((item) => item.id === target.dataset.nudgeId);
    if (!nudge || nudge.toUserId !== user.id) {
      return;
    }
    nudge.readAt = new Date().toISOString();
    saveState();
    render();
  }
}

function handleSubmit(event) {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  event.preventDefault();

  if (form.id === "login-form") {
    const formData = new FormData(form);
    const username = String(formData.get("username") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "").trim();

    const account = state.users.find((item) => item.username.toLowerCase() === username && item.password === password);
    if (!account) {
      uiState.loginError = "Invalid username or password.";
      render();
      return;
    }

    uiState.loginError = "";
    setCurrentUser(account.id);
    setFlash(`Welcome ${account.name}.`, "success");
    render();
    return;
  }

  const user = getCurrentUser();
  if (!user) {
    return;
  }

  if (form.id === "create-task-form") {
    if (!canManage(user)) {
      setFlash("Only manager/admin can create bucket tasks.", "error");
      render();
      return;
    }

    const formData = new FormData(form);
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const priority = String(formData.get("priority") || "medium");
    const dueDate = String(formData.get("dueDate") || "").trim();
    const label = String(formData.get("label") || "").trim();

    if (!title || !description) {
      setFlash("Title and description are required.", "error");
      render();
      return;
    }

    const now = new Date().toISOString();
    const finalDescription = label ? `[${label}] ${description}` : description;
    const task = {
      id: uniqueId("task"),
      title,
      description: finalDescription,
      priority: PRIORITY_META[priority] ? priority : "medium",
      status: "bucket",
      createdBy: user.id,
      assignedTo: null,
      dueDate: dueDate || null,
      internalEstimate: estimateFromDetails(priority, description),
      comments: [],
      history: [],
      createdAt: now,
      updatedAt: now,
    };

    addHistory(task, user.id, `${user.name} created the task in the pending bucket.`);
    state.tasks.push(task);
    saveState();
    form.reset();
    setFlash("Task added to bucket.", "success");
    render();
    return;
  }

  if (form.id === "nudge-form") {
    if (!canManage(user)) {
      return;
    }

    const formData = new FormData(form);
    const taskId = String(formData.get("taskId") || "");
    const message = String(formData.get("message") || "").trim();
    const task = state.tasks.find((item) => item.id === taskId);

    if (!task || !task.assignedTo) {
      setFlash("Select an assigned task before nudging.", "error");
      render();
      return;
    }

    if (!message) {
      setFlash("Nudge message cannot be empty.", "error");
      render();
      return;
    }

    state.nudges.push({
      id: uniqueId("nudge"),
      taskId: task.id,
      fromUserId: user.id,
      toUserId: task.assignedTo,
      message,
      createdAt: new Date().toISOString(),
      readAt: null,
    });
    addHistory(task, user.id, `${user.name} nudged ${displayUserName(task.assignedTo)}.`);
    task.updatedAt = new Date().toISOString();
    saveState();
    form.reset();
    setFlash("Nudge sent to assignee.", "success");
    render();
    return;
  }

  if (form.id === "comment-form") {
    const formData = new FormData(form);
    const taskId = String(formData.get("taskId") || "");
    const body = String(formData.get("body") || "").trim();
    const task = state.tasks.find((item) => item.id === taskId);

    if (!task || !body) {
      return;
    }

    task.comments.push({
      id: uniqueId("comment"),
      userId: user.id,
      body,
      createdAt: new Date().toISOString(),
    });
    task.updatedAt = new Date().toISOString();
    addHistory(task, user.id, `${user.name} added a comment.`);
    saveState();
    form.reset();
    setFlash("Comment posted.", "success");
    render();
    return;
  }

  if (form.id === "assign-form") {
    if (!canManage(user)) {
      return;
    }

    const formData = new FormData(form);
    const taskId = String(formData.get("taskId") || "");
    const assigneeId = String(formData.get("assigneeId") || "").trim();
    const task = state.tasks.find((item) => item.id === taskId);

    if (!task) {
      return;
    }

    task.assignedTo = assigneeId || null;
    task.status = task.assignedTo ? (task.status === "done" ? "done" : "in_progress") : "bucket";
    task.updatedAt = new Date().toISOString();

    if (task.assignedTo) {
      addHistory(task, user.id, `${user.name} assigned this task to ${displayUserName(task.assignedTo)}.`);
      setFlash("Task assignment updated.", "success");
    } else {
      addHistory(task, user.id, `${user.name} returned this task to the pending bucket.`);
      setFlash("Task returned to bucket.", "success");
    }

    saveState();
    render();
    return;
  }

  if (form.dataset.form === "role-update") {
    if (!isAdmin(user)) {
      return;
    }

    const formData = new FormData(form);
    const userId = String(formData.get("userId") || "");
    const role = String(formData.get("role") || "member");
    const target = state.users.find((item) => item.id === userId);

    if (!target || !["member", "manager", "admin"].includes(role)) {
      return;
    }

    if (target.role === "admin" && role !== "admin") {
      const adminCount = state.users.filter((member) => member.role === "admin").length;
      if (adminCount <= 1) {
        setFlash("At least one admin account must remain.", "error");
        render();
        return;
      }
    }

    target.role = role;
    saveState();
    setFlash(`Role updated for ${target.name}.`, "success");
    render();
    return;
  }

  if (form.id === "create-user-form") {
    if (!isAdmin(user)) {
      return;
    }

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const username = String(formData.get("username") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "").trim();
    const role = String(formData.get("role") || "member");

    if (!name || !username || !password) {
      setFlash("All user fields are required.", "error");
      render();
      return;
    }

    if (state.users.some((item) => item.username.toLowerCase() === username)) {
      setFlash("Username already exists.", "error");
      render();
      return;
    }

    state.users.push({
      id: uniqueId("user"),
      name,
      username,
      password,
      role: ["member", "manager", "admin"].includes(role) ? role : "member",
    });

    saveState();
    form.reset();
    setFlash("User created.", "success");
    render();
  }
}

function addHistory(task, actorId, message) {
  if (!Array.isArray(task.history)) {
    task.history = [];
  }

  task.history.push({
    id: uniqueId("history"),
    actorId,
    message,
    createdAt: new Date().toISOString(),
  });
}

function sortedTasks() {
  return [...state.tasks].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

function displayUserName(userId) {
  if (!userId) {
    return "Unassigned";
  }
  const user = state.users.find((member) => member.id === userId);
  return user ? user.name : "Unknown";
}

function canManage(user) {
  return user.role === "manager" || user.role === "admin";
}

function isAdmin(user) {
  return user.role === "admin";
}

function uniqueId(prefix) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
}

function setFlash(message, type) {
  uiState.flash = {
    message,
    type,
    token: Date.now(),
  };

  const token = uiState.flash.token;
  if (flashTimerId) {
    clearTimeout(flashTimerId);
  }

  flashTimerId = window.setTimeout(() => {
    if (uiState.flash && uiState.flash.token === token) {
      uiState.flash = null;
      render();
    }
  }, FLASH_TIMEOUT_MS);
}

function estimateFromDetails(priority, details) {
  const safePriority = PRIORITY_META[priority] ? priority : "medium";
  const baseByPriority = {
    low: 3,
    medium: 6,
    high: 10,
  };

  const complexityBonus = Math.min(6, Math.floor(String(details || "").length / 70));
  const expected = baseByPriority[safePriority] + complexityBonus;

  return {
    optimisticHours: Math.max(1, expected - 2),
    expectedHours: expected,
    pessimisticHours: expected + Math.max(3, Math.ceil(expected * 0.45)),
  };
}

function dateOffset(days) {
  const base = new Date();
  base.setHours(12, 0, 0, 0);
  base.setDate(base.getDate() + days);
  return base.toISOString().slice(0, 10);
}

function pastHours(hours) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function formatDate(dateString) {
  if (!dateString) {
    return "No date";
  }
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "No date";
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function timeAgo(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "just now";
  }

  const elapsedSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  if (Math.abs(elapsedSeconds) < 60) {
    return "just now";
  }

  const intervals = [
    [60, "second"],
    [3600, "minute"],
    [86400, "hour"],
    [604800, "day"],
    [2629800, "week"],
    [31557600, "month"],
    [Infinity, "year"],
  ];

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (let index = 1; index < intervals.length; index += 1) {
    const [threshold, unit] = intervals[index];
    if (Math.abs(elapsedSeconds) < threshold) {
      const [baseSeconds] = intervals[index - 1];
      const value = Math.round(elapsedSeconds / baseSeconds);
      return formatter.format(value, unit);
    }
  }

  return "just now";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const STORAGE_KEY = "zentiers.players";

const modes = [
  { name: "Overall", icon: "icons/overall.svg" },
  { name: "LTMs", icon: "icons/ltms.svg" },
  { name: "Vanilla", icon: "icons/vanilla.svg" },
  { name: "UHC", icon: "icons/uhc.svg" },
  { name: "Pot", icon: "icons/pot.svg" },
  { name: "NethOP", icon: "icons/nethop.svg" },
  { name: "SMP", icon: "icons/smp.svg" },
  { name: "Sword", icon: "icons/sword.svg" },
  { name: "Axe", icon: "icons/axe.svg" },
  { name: "Mace", icon: "icons/mace.svg" },
];

const tierIcons = {
  UHC: "icons/uhc.svg",
  Pot: "icons/pot.svg",
  NethOP: "icons/nethop.svg",
  SMP: "icons/smp.svg",
  Sword: "icons/sword.svg",
  Axe: "icons/axe.svg",
  Mace: "icons/mace.svg",
  Vanilla: "icons/vanilla.svg",
  LTMs: "icons/ltms.svg",
};

const defaultPlayers = [];

let selectedMode = "Overall";
const modeTabs = document.getElementById("modeTabs");
const playerRows = document.getElementById("playerRows");
const searchInput = document.getElementById("searchInput");

function storedPlayers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function allPlayers() {
  return [...defaultPlayers, ...storedPlayers()];
}

function avatar(player) {
  return player.skin || `https://minotar.net/avatar/${encodeURIComponent(player.name)}/64`;
}

function tierClass(tier) {
  return String(tier || "LT5").toLowerCase();
}

function renderTabs() {
  modeTabs.innerHTML = modes.map((mode) => `
    <button class="tab ${selectedMode === mode.name ? "active" : ""}" data-mode="${mode.name}" type="button">
      <img src="${mode.icon}" alt="" aria-hidden="true">
      <span>${mode.name}</span>
    </button>
  `).join("");
}

function visiblePlayers() {
  const query = searchInput.value.trim().toLowerCase();
  return allPlayers()
    .filter((player) => {
      if (!query) return true;
      return [player.name, player.region, player.title].join(" ").toLowerCase().includes(query);
    })
    .filter((player) => selectedMode === "Overall" || selectedMode === "LTMs" || player.tiers[selectedMode])
    .sort((a, b) => b.points - a.points);
}

function tierChips(player) {
  const order = ["Sword", "Pot", "Vanilla", "NethOP", "SMP", "Axe", "Mace", "UHC"];
  return order.map((mode) => {
    const tier = player.tiers[mode] || "LT5";
    return `
      <span class="tier-chip ${tierClass(tier)}" title="${mode} ${tier}">
        <em><img src="${tierIcons[mode]}" alt="" aria-hidden="true"></em>
        <strong>${tier}</strong>
      </span>
    `;
  }).join("");
}

function rankMedal(player, index) {
  return `
    <div class="rank-plate ${player.accent || "dark"}">
      <b>${index + 1}.</b>
      <img src="${avatar(player)}" alt="${player.name} avatar" loading="lazy">
    </div>
  `;
}

function renderRows() {
  const players = visiblePlayers();

  if (!players.length) {
    playerRows.innerHTML = '<p class="empty-list">No players added yet. Open manage.html to add your first player.</p>';
    return;
  }

  playerRows.innerHTML = players.map((player, index) => `
    <article class="rank-row">
      <div class="rank-cell">${rankMedal(player, index)}</div>
      <div class="player">
        <h2>${player.name}</h2>
        <p><span class="rank-gem">◈</span>${player.title} <small>(${player.points} points)</small></p>
      </div>
      <div class="region-cell"><span class="region ${player.region.toLowerCase()}">${player.region}</span></div>
      <div class="tiers">${tierChips(player)}</div>
    </article>
  `).join("");
}

modeTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-mode]");
  if (!button) return;
  selectedMode = button.dataset.mode;
  renderTabs();
  renderRows();
});

searchInput.addEventListener("input", renderRows);
window.addEventListener("storage", renderRows);

renderTabs();
renderRows();

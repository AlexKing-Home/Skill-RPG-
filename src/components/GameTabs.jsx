const tabs = [
  { id: "map", label: "Карта", icon: "◇" },
  { id: "location", label: "Локация", icon: "⌖" },
  { id: "character", label: "Персонаж", icon: "♜" },
];

export default function GameTabs({ activeTab, onChange }) {
  return (
    <nav className="game-tabs" aria-label="Разделы героя">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`game-tab ${activeTab === tab.id ? "is-active" : ""}`}
          onClick={() => onChange(tab.id)}
          aria-pressed={activeTab === tab.id}
        >
          <span className="game-tab__icon" aria-hidden="true">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

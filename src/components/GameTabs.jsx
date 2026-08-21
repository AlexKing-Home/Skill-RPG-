const tabs = [
  { id: "map", label: "Карта", icon: "◇" },
  { id: "location", label: "Локация", icon: "⌖" },
  { id: "battle", label: "Бой", icon: "⚔" },
  { id: "character", label: "Персонаж", icon: "♜" },
];

export default function GameTabs({ activeTab, onChange, locked = false }) {
  return (
    <nav
      className={`game-tabs game-tabs--${activeTab}`}
      style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
      aria-label="Разделы героя"
    >
      {tabs.map((tab) => {
        const disabled = locked && tab.id !== activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            className={`game-tab ${activeTab === tab.id ? "is-active" : ""}`}
            onClick={() => onChange(tab.id)}
            aria-pressed={activeTab === tab.id}
            aria-disabled={disabled}
            disabled={disabled}
          >
            <span className="game-tab__icon" aria-hidden="true">
              {tab.icon}
            </span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

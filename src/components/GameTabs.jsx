const tabs = [
  { id: "map", label: "Карта" },
  { id: "location", label: "Локация" },
  { id: "character", label: "Персонаж" },
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
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

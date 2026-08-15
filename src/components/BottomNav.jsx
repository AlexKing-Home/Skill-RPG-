const mainItems = [
  { id: "home", label: "Главная", icon: "♜" },
  { id: "tasks", label: "Задания", icon: "⚔" },
  { id: "map", label: "Карта", icon: "✥" },
  { id: "inventory", label: "Инвентарь", icon: "▣" },
  { id: "character", label: "Персонаж", icon: "♚" },
];

const characterItems = [
  { id: "map", label: "Карта", icon: "▧" },
  { id: "location", label: "Локация", icon: "⌖" },
  { id: "home", label: "Главная", icon: "♜" },
  { id: "character", label: "Персонаж", icon: "♚" },
];

export default function BottomNav({ active, onChange, onHome, variant = "main" }) {
  const items = variant === "character" ? characterItems : mainItems;

  return (
    <nav className={`bottom-nav bottom-nav--${variant}`} aria-label="Основная навигация">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`bottom-nav__item ${active === item.id ? "is-active" : ""}`}
          onClick={() => (item.id === "home" ? onHome() : onChange(item.id))}
          aria-pressed={active === item.id}
        >
          <span className="bottom-nav__icon" aria-hidden="true">
            {item.icon}
          </span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

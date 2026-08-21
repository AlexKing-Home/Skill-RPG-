import characterNavPart1 from "../assets/character-nav-hq/part-01.b64?raw";
import characterNavPart2 from "../assets/character-nav-hq/part-02.b64?raw";
import characterNavPart3 from "../assets/character-nav-hq/part-03.b64?raw";
import characterNavPart4 from "../assets/character-nav-hq/part-04.b64?raw";

const characterNavSprite = `data:image/webp;base64,${characterNavPart1}${characterNavPart2}${characterNavPart3}${characterNavPart4}`;

const mainItems = [
  { id: "home", label: "Главная", icon: "♜" },
  { id: "tasks", label: "Задания", icon: "⚔" },
  { id: "map", label: "Карта", icon: "✥" },
  { id: "inventory", label: "Инвентарь", icon: "▣" },
  { id: "character", label: "Персонаж", icon: "♚" },
];

// Character mode has its own four-section navigation.
const characterItems = [
  { id: "skills", label: "Навыки", icon: "✦" },
  { id: "inventory", label: "Инвентарь", icon: "▣" },
  { id: "stats", label: "Характеристики", icon: "◆" },
  { id: "character", label: "Персонаж", icon: "♚" },
];

export default function BottomNav({ active, onChange, onHome, variant = "main", locked = false }) {
  const items = variant === "character" ? characterItems : mainItems;
  const style =
    variant === "character"
      ? { "--character-nav-sprite": `url("${characterNavSprite}")` }
      : undefined;

  function handleItemClick(item) {
    if (locked) return;
    if (item.id === "home") onHome();
    else onChange(item.id);
  }

  return (
    <nav
      className={`bottom-nav bottom-nav--${variant} bottom-nav--active-${active}`}
      style={style}
      aria-label="Основная навигация"
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`bottom-nav__item ${active === item.id ? "is-active" : ""}`}
          onClick={() => handleItemClick(item)}
          aria-pressed={active === item.id}
          aria-disabled={locked}
          disabled={locked}
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

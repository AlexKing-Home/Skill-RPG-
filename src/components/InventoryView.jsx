import { useState } from "react";
import { isEquippableItem } from "../data/equipment.js";

export default function InventoryView({ character, onEquip }) {
  const [message, setMessage] = useState("");
  const inventory = Array.isArray(character.inventory) ? character.inventory : [];
  const coins = Math.max(0, Math.floor(Number(character.coins) || 0));

  function handleEquip(item) {
    if (!onEquip) return;
    if (onEquip(item.id)) {
      setMessage(`«${item.name}» экипирован.`);
    }
  }

  return (
    <section className="game-view inventory-view" aria-labelledby="inventory-title">
      <span className="game-view__eyebrow">Сумка героя</span>
      <div className="inventory-view__heading">
        <h1 id="inventory-title">Инвентарь</h1>
        <strong className="inventory-view__coins">Монеты: {coins}</strong>
      </div>

      {character.lastLoot ? (
        <div className="inventory-loot-note" role="status">
          <strong>Последняя добыча: {character.lastLoot.enemyName}</strong>
          <span>Монеты: +{character.lastLoot.coins}</span>
          {character.lastLoot.items.length ? (
            <span>
              {character.lastLoot.items
                .map((item) =>
                  item.stackable ? `${item.name} ×${item.quantity ?? 1}` : item.name,
                )
                .join(", ")}
            </span>
          ) : (
            <span>Предметов не выпало.</span>
          )}
        </div>
      ) : null}

      <div className="inventory-list">
        {inventory.length ? (
          inventory.map((item, index) => (
            <article key={`${item.id}-${index}`} className="inventory-item">
              <div>
                <span className="inventory-item__rarity">{item.rarityLabel ?? "Обычный"}</span>
                <h2>{item.name}</h2>
                {item.effect?.type === "heal" ? (
                  <p>Восстанавливает {item.effect.amount} HP.</p>
                ) : null}
                {item.baseStats?.attack ? <p>Атака: +{item.baseStats.attack}</p> : null}
                {item.baseStats?.defense ? <p>Защита: +{item.baseStats.defense}</p> : null}
              </div>
              <div className="inventory-item__actions">
                {item.quantity ? (
                  <strong className="inventory-item__quantity">×{item.quantity}</strong>
                ) : null}
                {isEquippableItem(item) && onEquip ? (
                  <button
                    type="button"
                    className="inventory-equip-button"
                    onClick={() => handleEquip(item)}
                  >
                    Надеть
                  </button>
                ) : null}
              </div>
            </article>
          ))
        ) : (
          <p className="inventory-view__empty">Инвентарь пуст.</p>
        )}
      </div>

      {message ? (
        <p className="inventory-message" role="status">
          {message}
        </p>
      ) : null}
    </section>
  );
}

export default function InventoryView({ character }) {
  const inventory = Array.isArray(character.inventory) ? character.inventory : [];
  const coins = Math.max(0, Math.floor(Number(character.coins) || 0));

  return (
    <section className="game-view inventory-view" aria-labelledby="inventory-title">
      <span className="game-view__eyebrow">Сумка героя</span>
      <div className="inventory-view__heading">
        <h1 id="inventory-title">Инвентарь</h1>
        <strong className="inventory-view__coins">Монеты: {coins}</strong>
      </div>

      <div className="inventory-list">
        {inventory.length ? (
          inventory.map((item) => (
            <article key={item.id} className="inventory-item">
              <div>
                <span className="inventory-item__rarity">{item.rarityLabel ?? "Обычный"}</span>
                <h2>{item.name}</h2>
                {item.effect?.type === "heal" ? (
                  <p>Восстанавливает {item.effect.amount} HP.</p>
                ) : null}
              </div>
              <strong className="inventory-item__quantity">×{item.quantity ?? 1}</strong>
            </article>
          ))
        ) : (
          <p className="inventory-view__empty">Инвентарь пуст.</p>
        )}
      </div>
    </section>
  );
}

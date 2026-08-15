const copy = {
  tasks: {
    title: "Задания",
    text: "Раздел заданий подключён к навигации и будет наполнен игровыми заданиями.",
  },
  inventory: {
    title: "Инвентарь",
    text: "Раздел инвентаря подключён. Здесь будет список предметов и экипировка героя.",
  },
};

export default function PlaceholderView({ type }) {
  const content = copy[type] ?? copy.tasks;
  return (
    <section className="game-view utility-view">
      <span className="game-view__eyebrow">Раздел игры</span>
      <h1>{content.title}</h1>
      <div className="utility-card">
        <span aria-hidden="true">✦</span>
        <p>{content.text}</p>
      </div>
    </section>
  );
}

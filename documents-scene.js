const Stage = require("telegraf/stage");
const Scene = require("telegraf/scenes/base");

function documentsSceneGenerate() {
  const documents = new Scene("documents");
  documents.enter((ctx) => {
    ctx.replyWithHTML(
      `📄 <b>Список приложенных документов:</b>` +
        "\n\n🔹 Индивидуальное задание.docx" +
        "\n🔹 Оформление отчёта с пояснениями.docx" +
        "\n🔹 Пример полного отчёта.pdf" +
        "\n🔹 Рецензия.docx" +
        "\n🔹 Титульный лист.docx" +
        "\n🔹 Указания к курсовой работе.doc" +
        `\n\n❗️ <b>К сдаче проекта нужно подготовить:</b>` +
        "\n\n🔸 Индивидуальное задание" +
        "\n🔸 Отчёт с титульным листом" +
        "\n🔸 Рецензия"
    );
    ctx.replyWithDocument({ source: "./content/Документы.zip" });
  });
  return documents;
}

module.exports = documentsSceneGenerate;

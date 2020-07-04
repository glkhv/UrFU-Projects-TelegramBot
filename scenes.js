const Scene = require("telegraf/scenes/base");

class SceneGenerator {
  //Сцена "Документы"
  GenDocumentsScene() {
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

  //Сцена "Контакты"
  GenContactsScene() {
    const contacts = new Scene("contacts");
    contacts.enter((ctx) => {
      ctx.replyWithHTML(`<b>Раздел ещё в разработке :(</b>`);
    });
    return contacts;
  }

  //Сцена "FAQ"
  GenFAQScene() {
    const faq = new Scene("faq");
    faq.enter((ctx) => {
      ctx.replyWithHTML(`<b>Раздел ещё в разработке :(</b>`);
    });
    return faq;
  }

  //Сцена "Запись на защиту"
  GenDefProjectsScene() {
    const defprojects = new Scene("defprojects");
    defprojects.enter((ctx) => {
      ctx.replyWithHTML(`<b>Раздел ещё в разработке :(</b>`);
    });
    return defprojects;
  }
}

module.exports = SceneGenerator;

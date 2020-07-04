const Scene = require("telegraf/scenes/base");

class SceneGenerator {
  //Сцена "Документы"
  GenDocumentsScene() {
    const documents = new Scene("documents");
    documents.enter((ctx) => {
      ctx.replyWithHTML(`<b>Все нужные документы: </b>`, backKeyboard.draw());
      docs.forEach((item) => {
        ctx.replyWithDocument({ source: `${item}` });
      });
    });
    documents.leave((ctx) =>
      ctx.reply("Выбери, что нужно: ", mainKeyboard.draw())
    );
  }

  //Сцена "Контакты"
  //   GenContactsScene() {}

  //Сцена "FAQ"
  //   GenFAQScene() { }

  //Сцена "Запись на защиту"
  //   GenDefProjectScene() { }
}

module.exports = SceneGenerator;

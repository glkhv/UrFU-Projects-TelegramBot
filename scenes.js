const Scene = require("telegraf/scenes/base");
const WizardScene = require("telegraf/scenes/wizard");
const Composer = require("telegraf/composer");
const Markup = require("telegraf/markup");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "telegraf",
});

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
    const stepHandler = new Composer();

    const contacts = new WizardScene(
      "contacts",
      (ctx) => {
        ctx.reply(
          "Чьи контакты тебе нужны?",
          Markup.inlineKeyboard([
            Markup.callbackButton("Ораганизаторы", "organizers"),
            Markup.callbackButton("Куратор/Заказчик", "clients"),
          ]).extra()
        );
        console.log(ctx.wizard.cursor);
        ctx.wizard.next();
      },
      stepHandler.on("callback_query", (ctx) => {
        ctx.wizard.state.contact_type = ctx.update.callback_query.data;
        console.log(ctx.wizard.cursor);
        console.log(ctx.wizard.state.contact_type);
        ctx.wizard.next();
      }),
      (ctx) => {
        console.log(ctx.wizard.cursor);
        if (ctx.wizard.state.contact_type == "organizers") {
          (ctx) => {
            ctx.reply("Название команды:");
            ctx.wizard.state.team = ctx.message.text;
            console.log(ctx.wizard.state.wizard);
          };
          ctx.scene.leave();
        } else {
          (ctx) => {
            ctx.reply("s");
            ctx.scene.leave();
          };
        }
      }
    );
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
    const stepHandler = new Composer();

    const defprojects = new WizardScene(
      "defprojects",
      (ctx) => {
        ctx.reply(
          "1. Выберите направление: ",
          Markup.inlineKeyboard([
            [Markup.callbackButton("application", "application")],
            [Markup.callbackButton("web", "web")],
            [Markup.callbackButton("ai/ml", "aiml")],
            [Markup.callbackButton("smm", "smm")],
          ]).extra()
        );
        ctx.wizard.next();
      },
      stepHandler.on("callback_query", (ctx) => {
        ctx.wizard.state.data = ctx.update.callback_query.data;
        ctx.wizard.next();
      }),
      (ctx) => {
        ctx.reply("2. Напишите название команды: ");
        ctx.wizard.next();
        ctx.wizard.state.flag = true;
      },
      (ctx) => {
        ctx.reply("3. Напишите желаемое время защиты (Формат - 00:00)");
        ctx.wizard.next();
        if (ctx.wizard.state.flag) {
          ctx.wizard.state.team = ctx.message.text;
        }
      },
      (ctx) => {
        ctx.wizard.state.time = ctx.message.text.replace(" ", "");
        
        if (!regexp.test(ctx.wizard.state.time)) {
          ctx.reply(
            "Ошибка в формате времени 😾,\nвведите любой символ для продолжения"
          );
          ctx.wizard.back();
          ctx.wizard.state.flag = false;
        }

        // dataTime = []
        // connection.query("SELECT time FROM schedule", (err, res) => {
        //   if(err) throw err

        //   res.forEach(item => {
        //     dataTime.push(
        //       item.time.replace(':00','')
        //     )
        //   })

        //   dataTime.forEach(elem => {
        //     if(elem == ctx.wizard.state.time){
        //       console.log('Ошибка епт');
        //     }
        //   })
        //   console.log(dataTime)
        // })

        else {
          ctx.reply("Ответ записан!");

          connection.connect(() => {
            connection.query(
              `INSERT INTO schedule (id, team, data, time) VALUES (NULL, '${ctx.wizard.state.team}', '${ctx.wizard.state.data}', '${ctx.wizard.state.time}')`
            );
            connection.query("SET SESSION wait_timeout = 604800");
          });
          ctx.scene.leave();
          console.log(ctx.wizard.state);
        }
      }
    );
    return defprojects;
  }
}

module.exports = SceneGenerator;

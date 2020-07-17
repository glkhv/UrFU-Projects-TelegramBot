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

    stepHandler.action("clients", (ctx) => {
      ctx.reply("Введи название своей команды:");
      return ctx.wizard.next();
    });
    stepHandler.action("organizers", (ctx) => {
      ctx.replyWithHTML(
        `Если у тебя возник вопрос, связанный с организацией "Проектного практикума",` +
          ` предварительно изучи FAQ. Если ты не нашёл ответ на свой вопрос, смело пиши` +
          ` организаторам. Вся важная информация о защитах, проектах и AirTable будет` +
          ` прописана в общих чатах\n\n<b>Контакты организаторов курса "Проектный Практикум</b>":`,
        Markup.inlineKeyboard([
          Markup.urlButton(
            "Написать Глухову Антону",
            "https://t.me/double_telegram"
          ),
        ]).extra()
      );
      return ctx.scene.leave();
    });

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
        ctx.wizard.next();
      },
      stepHandler,
      (ctx) => {
        ctx.wizard.state.team = ctx.message.text;
        connection.connect(() => {
          connection.query(`SELECT * FROM contacts `, (err, res) => {
            if (err) throw err;
            ctx.replyWithHTML(
              `Имя и фамилия куратора - <b>${res[0].name} ${res[0].surname}</b>\nТелефон - <b>${res[0].number}</b>`
            );
          });
          connection.query("SET SESSION wait_timeout = 604800");
        });
        return ctx.scene.leave();
      }
    );
    return contacts;
  }

  //Сцена "FAQ"
  GenFAQScene() {
    const faq = new Scene("faq");
    faq.enter((ctx) => {
      ctx.replyWithHTML(
        `<b>Часто задаваемые вопросы:</b>` +
          `\n\n❓<b>На какую почту отправлять отчёт?</b>` +
          `\n❗daria.isakova@urfu.ru или normokontrol002@gmail.com` +
          `(организаторы сообщат позже)` +
          `\n\n❓<b>На каком сайте записываться на проект?</b>` +
          `\n❗Прокомпетенции.рф` +
          `\n\n❓<b>По какой формуле считается итоговый балл?</b>` +
          `\n❗Итоговый балл = КР*4 + ОЭ*5 +АТ+ Бонусы, где АТ` +
          `– Заполнение AirTable (10 баллов), КР – Оценка куратора ` +
          `(10 баллов), ОЭ – Оценка экспертов (10 баллов)` +
          `\n\n❓<b>Можно ли менять ответы в карточках в Airtable?</b>` +
          `\n❗Да, но перед этим нужно сообщить одному из организаторов ` +
          `о намерении изменить ответ` +
          `\n\n❓<b>Что делать для получения бонусных баллов?</b>` +
          `\n❗Для получения бонусных баллов необходимо прислать данные ` +
          `об участии в мероприятиях на почту kuklin.ilya@urfu.ru по ` +
          `следующему шаблону (в теме письма указать «Участие в мероприятиях»):` +
          `\n\n    1. Название мероприятия` +
          `\n    2. Дата и место проведения` +
          `\n    3. Тип мероприятия (хакатон, олимпиада, конференция и т.д.)` +
          `\n    4. Тип участия (очное/заочное, индивидуальное/командное)` +
          `\n    5. Результат (место, категория, победа в номинации)` +
          `\n    6. Подтверждающий документ Фотографию/скан сертификата участника ` +
          `или диплом (или другой аналогичный документ)` +
          `\n    7. Название вашего проекта` +
          `\n\nДополнительные фото с места проведения конкурса приветствуются.` +
          `\n\nВ результате рассмотрения заявки баллы будут зачислены: +5 за участие ` +
          `в мероприятии, +5 за победу в номинации (максимум +10 за одно мероприятие на одного человека).`
      );
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
            [Markup.callbackButton("Application", "application")],
            [Markup.callbackButton("Web", "web")],
            [Markup.callbackButton("AI/ML", "aiml")],
            [Markup.callbackButton("SMM", "smm")],
          ]).extra()
        );
        ctx.wizard.next();
      },
      stepHandler.on("callback_query", (ctx) => {
        ctx.wizard.state.data = ctx.update.callback_query.data;
        ctx.reply("2. Введи название своей команды:");
        ctx.wizard.state.flag = true;
        return ctx.wizard.next();
      }),
      (ctx) => {
        if (ctx.wizard.state.flag) {
          ctx.wizard.state.team = ctx.message.text;
        }
        ctx.reply("3. Напишите желаемое время защиты (Формат - 00:00)");
        ctx.wizard.next();
      },
      (ctx) => {
        ctx.wizard.state.time = ctx.message.text.replace(" ", "");

        if (!regexp.test(ctx.wizard.state.time)) {
          ctx.reply(
            "Ошибка в формате времени 😾\nВведите любой символ для продолжения"
          );
          ctx.wizard.selectStep(2);
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

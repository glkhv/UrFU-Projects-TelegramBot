const { Telegraf } = require("telegraf");
const { Markup } = Telegraf;
const Composer = require("telegraf/composer");
const Stage = require("telegraf/stage");
const WizardScene = require("telegraf/scenes/wizard");
const mysql = require("mysql");
const { leave } = Stage;

function contactsSceneGenerate() {
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "telegraf",
  });

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

module.exports = contactsSceneGenerate;

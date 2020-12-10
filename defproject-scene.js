const { Telegraf } = require("telegraf");
const { Markup } = Telegraf;
const Composer = require("telegraf/composer");
const Stage = require("telegraf/stage");
const WizardScene = require("telegraf/scenes/wizard");
const mysql = require("mysql");
const { leave } = Stage;

const connection = mysql.createConnection({
  socketPath: "/var/run/mysqld/mysqld.sock",
  user: "c27887_urfu_bot_ru",
  password: "QuJnuYirwawub45",
  database: "c27887_urfu_bot_ru",
});

connection.query("SELECT * FROM `schedule`", (err, res) => console.log(err));
connection.query("SET SESSION wait_timeout = 604800");

function defprojectSceneGenerate() {
  const stepHandler = new Composer();

  const defproject = new WizardScene(
    "defproject",
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
      ctx.reply("2. Напишите название команды: ");
      ctx.wizard.state.flag = true;
      ctx.wizard.next();
    }),
    (ctx) => {
      if (ctx.wizard.state.flag) {
        ctx.wizard.state.team = ctx.message.text;
      }
      connection.query(`SELECT * FROM schedule WHERE team = '${ctx.wizard.state.team}'`, (err, res) => {
        if (err) throw err;
        if (res[0] != undefined) {
          ctx.replyWithHTML("❗️ Ваша команда уже создана\nПосмотрите свою запись\n\n🔹<b>Выбери, что нужно:</b>");
          ctx.scene.leave();
          return false;
        }
        else {
          ctx.replyWithHTML("3. Напишите желаемое время защиты (<b>Формат - 00:00</b>)\n\n❗️ Или напишите \"Выйти\", если хотите выйти из записи на защиту");
          ctx.wizard.next();
        }
      });
    },
    (ctx) => {
      if (ctx.message.text.replace(" ", "").toLowerCase() == 'выйти') {
        ctx.replyWithHTML("🔹<b>Выбери, что нужно:</b>");
        ctx.scene.leave();
        return false;
      }
      ctx.wizard.state.time = ctx.message.text.replace(" ", "");
      const data = ctx.wizard.state.data;
      let time = ctx.wizard.state.time;
      const regexp = /\d{2}:\d{2}/;

      if (!regexp.test(ctx.wizard.state.time)) {
        ctx.replyWithHTML(
          "Ошибка в формате времени 😾,\n\n<i>Введите любой символ для продолжения</i>"
        );
        ctx.wizard.selectStep(2);
        ctx.wizard.state.flag = false;
      } else {
        connection.query(
          `SELECT time FROM schedule WHERE data = '${data}'`,
          (err, res) => {
            if (res.length == 0) {
              ctx.reply("Ответ записан!");

              connection.connect(() => {
                connection.query(
                  `INSERT INTO schedule (id, team, data, time) VALUES (NULL, '${ctx.wizard.state.team}', '${ctx.wizard.state.data}', '${ctx.wizard.state.time}')`
                );
              });
              ctx.scene.leave();
            } else if (res.some((elem) => elem.time == time)) {
              ctx.replyWithHTML(
                `К сожалению, это время уже занято 😾\n<b>Время должно отличаться на 15 минут</b>\n\n❗️ Или проверьте на http://site, что вы ранее не записывались на данное время\n\n<i>Введите любой символ для продолжения</i>`
              );
              ctx.wizard.selectStep(2);
              ctx.wizard.state.flag = false;
            } else {
              ctx.replyWithHTML("Ответ записан!\n\n🔹<b>Выбери, что нужно:</b>");

              connection.query(
                `INSERT INTO schedule (id, team, data, time) VALUES (NULL, '${ctx.wizard.state.team}', '${ctx.wizard.state.data}', '${ctx.wizard.state.time}')`
              );
              ctx.scene.leave();
            }
          }
        );
      }
    }
  );

  return defproject;
}

module.exports = defprojectSceneGenerate;

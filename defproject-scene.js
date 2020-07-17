const { Telegraf } = require("telegraf");
const { Markup } = Telegraf;
const Composer = require("telegraf/composer");
const Stage = require("telegraf/stage");
const WizardScene = require("telegraf/scenes/wizard");
const mysql = require("mysql");
const { leave } = Stage;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "telegraf",
});

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
      ctx.reply("3. Напишите желаемое время защиты (Формат - 00:00)");
      ctx.wizard.next();
    },
    (ctx) => {
      ctx.wizard.state.time = ctx.message.text.replace(" ", "");
      const data = ctx.wizard.state.data;
      let time = ctx.wizard.state.time;
      const regexp = /\d{2}:\d{2}/;

      if (!regexp.test(ctx.wizard.state.time)) {
        ctx.reply(
          "Ошибка в формате времени 😾,\nвведите любой символ для продолжения"
        );
        ctx.wizard.selectStep(2);
        ctx.wizard.state.flag = false;
      } else {
        connection.query(
          `SELECT time FROM schedule WHERE data = '${data}'`,
          (err, res) => {
            console.log(res);
            if (res.length == 0) {
              ctx.reply("Ответ записан!");

              connection.connect(() => {
                connection.query(
                  `INSERT INTO schedule (id, team, data, time) VALUES (NULL, '${ctx.wizard.state.team}', '${ctx.wizard.state.data}', '${ctx.wizard.state.time}')`
                );
                connection.query("SET SESSION wait_timeout = 604800");
              });
              ctx.scene.leave();
              console.log(ctx.wizard.state);
            } else if (res.some((elem) => elem.time == time)) {
              ctx.reply(
                "К сожалению, это время уже занято\nвведите любой символ для продолжения"
              );
              ctx.wizard.selectStep(2);
              ctx.wizard.state.flag = false;
            } else {
              ctx.reply("Ответ записан!");

              connection.query(
                `INSERT INTO schedule (id, team, data, time) VALUES (NULL, '${ctx.wizard.state.team}', '${ctx.wizard.state.data}', '${ctx.wizard.state.time}')`
              );
              connection.query("SET SESSION wait_timeout = 604800");
              ctx.scene.leave();
              console.log(ctx.wizard.state);
            }
          }
        );
      }
    }
  );

  return defproject;
}

module.exports = defprojectSceneGenerate;

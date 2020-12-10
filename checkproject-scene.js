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

function checkprojectSceneGenerate() {
    const stepHandler = new Composer();

    const checkproject = new WizardScene(
        "checkproject",
        (ctx) => {
            ctx.reply("1. Напишите название команды: ");
            ctx.wizard.next();
        },
        (ctx) => {
            ctx.wizard.state.team = ctx.message.text;
            connection.query(`SELECT * FROM schedule WHERE team = '${ctx.wizard.state.team.toLowerCase()}'`, (err, res) => {
                if (res[0] == undefined) {
                    ctx.replyWithHTML("❗️ Вашей команды нет в списке\n\n🔹<b>Выбери, что нужно:</b>");
                    ctx.scene.leave();
                }
                else {
                    ctx.replyWithHTML(`Ваше время: <b>${res[0].time}</b>\nВаше направление: <b>${res[0].data}</b>\n\n🔹<b>Выбери, что нужно:</b>`);
                    ctx.scene.leave();
                }
            });
        }
    );

    return checkproject;
}



module.exports = checkprojectSceneGenerate;

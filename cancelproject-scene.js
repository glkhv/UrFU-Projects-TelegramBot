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
    database: "practice",
});

connection.query("SELECT * FROM `schedule`", (err, res) => console.log(err));
connection.query("SET SESSION wait_timeout = 604800");

function cancelprojectSceneGenerate() {
    const stepHandler = new Composer();

    const cancelproject = new WizardScene(
        "cancelproject",
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
                    ctx.reply("Вы хотите удалить запись ? (Да/Нет)");
                    ctx.wizard.next();
                }
            });
        },
        (ctx) => {
            if (ctx.message.text.toLowerCase() == "да") {
                connection.query(`DELETE FROM schedule WHERE team = '${ctx.wizard.state.team}'`, (err, res) => {
                    ctx.replyWithHTML("Ваша запись удалена...\n\n🔹<b>Выбери, что нужно:</b>");
                });
            }
            else if (ctx.message.text.toLowerCase() == "нет") {
                ctx.replyWithHTML("Так зачем нажал тогда?...\nЯ ухожу...\n\n🔹<b>Выбери, что нужно:</b>");
            }
            else {
                ctx.replyWithPhoto({ source: 'кот.jpg' });
                // ctx.replyWithHTML("Запись не удалена...\n\n🔹<b>Выбери, что нужно:</b>")
            }
            ctx.scene.leave();
        }
    );

    return cancelproject;
}



module.exports = cancelprojectSceneGenerate;

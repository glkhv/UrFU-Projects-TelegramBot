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
            connection.query(`SELECT * FROM schedule WHERE team = '${ctx.wizard.state.team}'`, (err, res) => {
                if (res[0] == undefined) {
                    ctx.reply("Ну ка пшол отсюда, нет тут твоей команды дэбилов");
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
                    ctx.reply("Ваша запись удалена...");
                    console.log(res);
                });
            }
            if (ctx.message.text.toLowerCase() == "нет") {
                ctx.reply("Ну так если нет, то чо нажал сюда?");
            }
            ctx.scene.leave();
        }
    );

    return cancelproject;
}



module.exports = cancelprojectSceneGenerate;
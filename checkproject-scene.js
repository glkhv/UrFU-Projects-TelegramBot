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
            connection.query(`SELECT * FROM schedule WHERE team = '${ctx.wizard.state.team}'`, (err, res) => {
                if (res[0] == undefined) {
                    ctx.reply("Ну ка пшол отсюда, нет тут твоей команды дэбилов");
                    ctx.scene.leave();
                }
                else {
                    ctx.replyWithHTML(`Ваше время: <b>${res[0].time}</b>\nВаше направление: <b>${res[0].data}</b>`);
                    ctx.scene.leave();
                }
            });
        }
    );

    return checkproject;
}



module.exports = checkprojectSceneGenerate;
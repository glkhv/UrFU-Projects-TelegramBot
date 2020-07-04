const Telegraf = require("telegraf");
const Keyboard = require("telegraf-keyboard");
const config = require("config");
const SceneGenerator = require("./scenes");
const { Extra, Markup, Stage, session, leave } = Telegraf;

const token = config.get("token");
const webHookServer = config.get("webHook");

const bot = new Telegraf(token);

const curScene = new SceneGenerator();
const documentScene = curScene.GenDocumentsScene();
// const contactsScene = curScene.GenContactsScene();
// const faqScene = curScene.GenFAQScene();
// const defprojectScene = curScene.GenDefProjectScene();

const stage = new Stage([documentScene]);

bot.use(session());
bot.use(stage.middleware());

bot.command("scene", async (ctx) => {
  ctx.scene.enter("age");
});

const mainKeyboard = new Keyboard();
mainKeyboard
  .add("Документы")
  .add("Записаться на защиту")
  .add("Контакты", "FAQ");

const backKeyboard = new Keyboard();
backKeyboard.add("Назад");

bot.start((ctx) => {
  return ctx.reply(
    `Добро пожаловать в Проектный Практикум, ${ctx.from.username}!
    \nЯ твой бот-помощник. Выбери, что тебе нужно 🤩`,
    mainKeyboard.draw()
  );
});

require("http").createServer(bot.webhookCallback(webHookServer)).listen(3000);

bot.launch();

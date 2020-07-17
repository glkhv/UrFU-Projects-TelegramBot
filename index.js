const Telegraf = require("telegraf");
const Keyboard = require("telegraf-keyboard");
const config = require("config");
const SceneGenerator = require("./scenes");
const { Extra, Markup, Stage, session, leave } = Telegraf;
const defprojectSceneGenerate = require("./defproject-scene");
const faqSceneGenerate = require("./faq-scene");
const documentsSceneGenerate = require("./documents-scene");
const contactsSceneGenerate = require("./contacts-scene");

const token = config.get("token");
const webHookServer = config.get("webHook");

const bot = new Telegraf(token);

const mainKeyboard = new Keyboard();
mainKeyboard
  .add("Документы")
  .add("Записаться на защиту")
  .add("Контакты", "FAQ");

const defproject = defprojectSceneGenerate();
const faq = faqSceneGenerate();
const documents = documentsSceneGenerate();
const contacts = contactsSceneGenerate();

const stage = new Stage([documents, contacts, faq, defproject]);

bot.start((ctx) => {
  return ctx.reply(
    `Добро пожаловать в Проектный Практикум, ${ctx.from.username}!
    \nЯ твой бот-помощник. Выбери, что тебе нужно 🤩`,
    mainKeyboard.draw()
  );
});

bot.use(session());
bot.use(stage.middleware());

bot.hears("Документы", (ctx) => {
  ctx.scene.enter("documents");
});

bot.hears("Контакты", (ctx) => {
  ctx.scene.enter("contacts");
});

bot.hears("FAQ", (ctx) => {
  ctx.scene.enter("faq");
});

bot.hears("Записаться на защиту", (ctx) => {
  ctx.scene.enter("defprojects");
});

require("http").createServer(bot.webhookCallback(webHookServer)).listen(3000);

bot.launch();

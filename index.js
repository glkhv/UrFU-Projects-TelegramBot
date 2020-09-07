const { Telegraf } = require("telegraf");
const Keyboard = require("telegraf-keyboard");
const session = require("telegraf/session");
const Stage = require("telegraf/stage");
const Scene = require("telegraf/scenes/base");
const { leave } = Stage;
const defprojectSceneGenerate = require("./defproject-scene");
const faqSceneGenerate = require("./faq-scene");
const documentsSceneGenerate = require("./documents-scene");
const contactsSceneGenerate = require("./contacts-scene");
const cancelprojectSceneGenerate = require("./cancelproject-scene");
const checkprojectSceneGenerate = require("./checkproject-scene");

const TOKEN = "1394592988:AAEGt-VkIR1nMPXbZwTGqi22MpF8b3zipdo";
const bot = new Telegraf(TOKEN);

const mainKeyboard = new Keyboard();
mainKeyboard
  .add("Документы")
  .add("Контакты", "FAQ")
  .add("Записаться на защиту", "Отменить запись")
  .add("Посмотреть время записи");

const defproject = defprojectSceneGenerate();
const faq = faqSceneGenerate();
const documents = documentsSceneGenerate();
const contacts = contactsSceneGenerate();
const cancel = cancelprojectSceneGenerate();
const check = checkprojectSceneGenerate();

const stage = new Stage([documents, contacts, faq, defproject, cancel, check]);

bot.use(session());
bot.use(stage.middleware());

require("http")
  .createServer(bot.webhookCallback("https://server101.hosting.reg.ru"))
  .listen(8080);

bot.start((ctx) =>
  ctx.reply(
    "Привет! Я бот-помощник\nВыбери,что тебе нужно",
    mainKeyboard.draw()
  )
);

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
  ctx.scene.enter("defproject");
});

bot.hears("Отменить запись", (ctx) => {
  ctx.scene.enter("cancelproject");
});

bot.hears("Посмотреть время записи", (ctx) => {
  ctx.scene.enter("checkproject");
});

bot.launch();

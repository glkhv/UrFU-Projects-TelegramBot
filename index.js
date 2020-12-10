const { Telegraf } = require("telegraf");
const { Markup } = Telegraf;
const Keyboard = require("telegraf-keyboard");
const session = require("telegraf/session");
const Stage = require("telegraf/stage");
const Scene = require("telegraf/scenes/base");
const fetch = require("node-fetch");
const { leave } = Stage;
const Telegram = require('telegraf/telegram')
const mysql = require("mysql");
const defprojectSceneGenerate = require("./defproject-scene");
const faqSceneGenerate = require("./faq-scene");
const documentsSceneGenerate = require("./documents-scene");
const contactsSceneGenerate = require("./contacts-scene");
const cancelprojectSceneGenerate = require("./cancelproject-scene");
const checkprojectSceneGenerate = require("./checkproject-scene");

// 1394592988:AAEGt-VkIR1nMPXbZwTGqi22MpF8b3zipdo
const TOKEN = "1382052635:AAFtnA42bgR-_QNv3dHcOmFpOCoI19n3uv8";
const bot = new Telegraf(TOKEN);
const telegram = new Telegram(TOKEN);


const connection = mysql.createConnection({
  socketPath: "/var/run/mysqld/mysqld.sock",
  user: "c27887_urfu_bot_ru",
  password: "QuJnuYirwawub45",
  database: "c27887_urfu_bot_ru",
});

// U23uXoV8GbP8P9uZ

// const mainKeyboard = new Keyboard();
// mainKeyboard
//   .add("Документы")
//   .add("Контакты", "FAQ")
//   .add("Записаться на защиту", "Отменить запись")
//   .add("Посмотреть время записи");

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
  .createServer(bot.webhookCallback("https://h19.netangels.ru"))
  .listen(80);

bot.start((ctx) =>
  ctx.reply(
    "Привет! Я бот-помощник\nВыберите,что тебе нужно", Markup.keyboard([
        ["Документы"],
        ["Контакты", "FAQ"],
        ["Записаться на защиту", "Отменить запись"],
        ["Посмотреть время записи"]
    ]).extra()  
    // mainKeyboard.draw()
  )
);


setInterval(() => {
  
  let time = new Date().getTime().toString();
  time = time.slice(0, -3);
  time = parseInt(time);
  
  
  connection.query("SELECT time FROM `notifications`", (err, res) => {
    res.forEach(item => {
      if((item.time - time) == 0){
        telegram.sendMessage(739870817, item.text);
      }
    });
  });
}, 1000);



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

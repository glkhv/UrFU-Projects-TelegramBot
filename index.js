const Telegraf = require("telegraf");
const config = require("config");

const token = config.get("token");
const bot = new Telegraf(token);

bot.start((ctx) => {
  return ctx.reply(
    "Добро пожаловать в Проектный Практикум, " + ctx.from.username
  );
});

bot.command("image", (ctx) =>
  ctx.replyWithPhoto({ url: "https://picsum.photos/200/300/?random" })
);

require("http")
  .createServer(bot.webhookCallback("https://e761c7992136.ngrok.io"))
  .listen(3000);

bot.launch();

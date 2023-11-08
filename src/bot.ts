import { config } from "dotenv";
import { Client, GatewayIntentBits, Message, Partials } from "discord.js";
import { prefix } from "./config.json";
import { openWebPage } from "./overview";

config();

const client: Client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
  partials: [Partials.Channel],
});

client.on("ready", (c) => {
  console.log(`${c.user.username} is online.`);
});

client.on("messageCreate", (message: Message) => {
  const messageContent: string = message.content;

  if (messageContent.startsWith(`${prefix}`)) {
    console.log(messageContent);
    if (messageContent === `${prefix}ping`) {
      message.reply("kevin gei");
    }

    if (messageContent.startsWith(`${prefix}start`)) {
      const serverName: string = messageContent.replace(`${prefix}start `, "");
      openWebPage(serverName, "start");
    }

    if (messageContent.startsWith(`${prefix}stop`)) {
      const serverName: string = messageContent.replace(`${prefix}stop `, "");
      openWebPage(serverName, "stop");
    }

    if (messageContent.startsWith(`${prefix}restart`)) {
      const serverName: string = messageContent.replace(
        `${prefix}restart `,
        ""
      );
      openWebPage(serverName, "restart");
    }
  }
});

client.login(process.env.BOT_TOKEN);

import { Browser, Page } from "puppeteer";
import Puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { config } from "dotenv";
import { LoggerInterface, serverOption } from "./interface/logger-interface";

config();

Puppeteer.use(StealthPlugin());

const url: string = "https://aternos.org/go";

const loggerObject: LoggerInterface = {
  name: process.env.ATERNOS_NAME_TOKEN || "",
  password: process.env.ATERNOS_PASSWORD_TOKEN || "",
};

// Función principal para abrir la pagina web
export async function openWebPage(
  serverName: string,
  serverOption: serverOption
): Promise<void> {
  const browser: Browser = await Puppeteer.launch({
    headless: false,
    slowMo: 0,
  });
  const page: Page = await browser.newPage();

  await page.goto(url);

  await logger(page, loggerObject, serverName);

  switch (serverOption) {
    case "start":
      await startServer(page);
      break;
    case "stop":
      await stopServer(page);
      break;
    case "restart":
      await restartServer(page);
      break;
    default:
      console.log("Opción inválida");
      break;
  }

  console.log("Se inició el servidor correctamente");
  await page.waitForNavigation({ waitUntil: "domcontentloaded" });

  await browser.close();
}

// Función para loggearse
async function logger(
  page: Page,
  loggerObject: LoggerInterface,
  serverName: string
): Promise<void> {
  await page.evaluate((loggerObject: LoggerInterface) => {
    const userInput: HTMLInputElement | null =
      document.querySelector(".username");

    const passwordInput: HTMLInputElement | null =
      document.querySelector(".password");

    const loginButton: HTMLButtonElement | null =
      document.querySelector(".login-button");

    if (!userInput || !passwordInput || !loginButton)
      throw new Error("Error al iniciar sesión");

    userInput.value = loggerObject.name;
    passwordInput.value = loggerObject.password;
    loginButton.click();
  }, loggerObject);

  await page.waitForNavigation({ waitUntil: "domcontentloaded" });

  await page.evaluate((serverName: string) => {
    const serverNameInput: HTMLInputElement | null = document.querySelector(
      `div[title="${serverName}"]`
    );

    if (!serverNameInput)
      throw new Error(
        "No se encontró el servidor, digite el nombre correctamente"
      );

    serverNameInput.click();
  }, serverName);

  await page.waitForNavigation({ waitUntil: "domcontentloaded" });

  console.log("Se inició sesión correctamente");
}

// Función para iniciar el servidor
async function startServer(page: Page): Promise<void> {
  await page.evaluate((): void => {
    const startButton: HTMLButtonElement | null =
      document.querySelector("#start");

    if (!startButton) {
      throw new Error("No se encontró el botón de inicio");
    }

    startButton.click();
  });

  await page.waitForNavigation();
}

// Función para detener el servidor
async function stopServer(page: Page): Promise<void> {
  await page.evaluate((): void => {
    const stopButton: HTMLButtonElement | null =
      document.querySelector("#stop");

    if (!stopButton) {
      throw new Error("No se encontró el botón de inicio");
    }

    stopButton.click();
  });

  await page.waitForNavigation();
}

// Función para reiniciar el servidor
async function restartServer(page: Page): Promise<void> {
  await page.evaluate((): void => {
    const restartButton: HTMLButtonElement | null =
      document.querySelector("#restart");

    if (!restartButton) {
      throw new Error("No se encontró el botón de inicio");
    }

    restartButton.click();
  });

  await page.waitForNavigation();
}

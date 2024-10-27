import puppeteer from "puppeteer";
import fs from "fs";
/**
 * @typedef {Object} MailCredentials
 * @property {string} mail
 * @property {string} password
 */

const jsonFilePath = "./data.dev.json";
/**
 * Function to read mail credentials from JSON file
 * @returns {MailCredentials[]}
 */
function readMailCredentialsJson() {
    const data = fs.readFileSync(jsonFilePath);
    const json = JSON.parse(data);
    return json;
}

/**
 * Login to Gmail
 * @param {string} email
 * @param {string} password
 */
async function loginToGmail(email, password) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto("https://accounts.google.com/signin");
        await page.waitForSelector('input[type="email"]');
        await page.type('input[type="email"]', email);
        await page.click("#identifierNext");
        await page.waitForSelector('input[type="password"]');
        await page.waitForTimeout(2000);
        await page.type('input[type="password"]', password);
        await page.click("#passwordNext");
    } catch (error) {
        console.error(error);
    } finally {
        await browser.close();
    }
}

// Main function to run the script
(async () => {
    const credentials = readMailCredentialsJson();
    var promises = credentials.map(async (credential) => {
        await loginToGmail(credential.mail, credential.password);
    });
    await Promise.allSettled(promises);
})();

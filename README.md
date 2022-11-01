# Visa Expiry Notifier

This project is a telegram bot whose purpose is to notify international students at Innopolis
University about the expiration of their visa and registration cards.

## Running the app

To run this bot, you need to have [Node.js](https://nodejs.org/en/) installed on your machine.
Then, you need to install the dependencies by running `npm install` in the project directory.
After that, you need to create a `.env` file in the project directory and fill it with the following variables:

```bash
BOT_TOKEN= # Telegram bot token
SHEETS_API_KEY= # Google Sheets API key
```

Then, run `npm run build` to build the project and `npm start` to run it.

const { App } = require('@slack/bolt');
const fs = require('fs');
const axios = require('axios');
const path = require('path');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});


app.event('app_mention', async ({ event, say }) => {
  try {
    if (event.files && event.files.length > 0) {
      const fileInfo = event.files[0];
      const fileUrl = fileInfo.url_private;
      const fileName = fileInfo.name;
      const savePath = path.join(__dirname, '..', fileName);

      const fileResponse = await axios.get(fileUrl, {
        headers: { Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}` },
        responseType: 'stream'
      });

      const writer = fs.createWriteStream(savePath);
      fileResponse.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      await say({
        text: `Arquivo "${fileName}" foi salvo com sucesso no servidor!`,
        channel: event.channel
      });
    }
  } catch (error) {
    console.error('Erro ao processar o evento:', error);
  }
});

(async () => {
  await app.start();

  app.logger.info('⚡️ Bolt app is running!');
})();

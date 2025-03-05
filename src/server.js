require('dotenv').config();

const { App } = require('@slack/bolt');
const fs = require('fs');
const axios = require('axios');
const path = require('path');

const HOME_DIR_SCRIPT = process.env.HOME_DIR_SCRIPT || '/home/agtk-sftp/files/monitoratoken_pipeline';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

app.message('ping', async ({ event, say }) => {
  await say({
    text: `pong`,
    channel: event.channel_id
  });
})



app.event('file_shared', async ({ event, say, client }) => {
  try {
    const fileInfo = await client.files.info({
      file: event.file_id
    });

    if (fileInfo.file) {
      const fileUrl = fileInfo.file.url_private;
      const fileName = fileInfo.file.name;

      const interestFiles = [
        'Agrotoken Cycle - harvest estimate',
        'input_vega'
      ]

      const isInterestFile = interestFiles.some((interest) => fileName.includes(interest));

      if (isInterestFile === false) {
        console.log(`${fileName} não é para ser salvo! ❌`)
        return
      }

      console.log(`${fileName} é para ser salvo! ✅`)

      const fileResponse = await axios.get(fileUrl, {
        headers: { Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}` },
        responseType: 'stream'
      });

      const outputFileName = fileName.includes('Agrotoken Cycle - harvest estimate') ? 'input_eda.xlsx' : fileName
      const savePath = path.join(HOME_DIR_SCRIPT, 'AutomatizacionCM', 'input', outputFileName);

      const writer = fs.createWriteStream(savePath);
      fileResponse.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      await say({
        text: `Arquivo "${fileName}" foi salvo com sucesso no servidor com nome ${outputFileName}!`,
        channel: event.channel_id
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

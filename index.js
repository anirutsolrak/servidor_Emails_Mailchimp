// index.js

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.use(bodyParser.json());

// Captura variáveis de ambiente (o Vercel irá fornecê-las)
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY; 
const LIST_ID = process.env.LIST_ID;
const DATA_CENTER = MAILCHIMP_API_KEY ? MAILCHIMP_API_KEY.split('-')[1] : 'us1'; // Extrai o data center da chave da API

app.post('/enviar_email', (req, res) => {
  const { nome, email } = req.body;

  if (!MAILCHIMP_API_KEY || !LIST_ID) {
    console.error('Erro: MAILCHIMP_API_KEY e LIST_ID devem ser definidos como variáveis de ambiente.');
    return res.status(500).send('Erro interno do servidor.'); 
  }

  const url = `https://${DATA_CENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members/`;

  const data = {
    email_address: email,
    status: 'subscribed', 
    merge_fields: {
      FNAME: nome 
    }
  };

  const options = {
    url: url,
    method: 'POST',
    headers: {
      'Authorization': `apikey ${MAILCHIMP_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  request(options, (error, response, body) => {
    if (error) {
      console.error('Erro ao adicionar email à lista:', error);
      return res.status(500).send('Erro ao processar a requisição.');
    } 

    console.log('Email adicionado à lista com sucesso:', body); 
    res.status(200).send('Obrigado pelo interesse! Entraremos em contato em breve.'); 
  });
});

// Rota para testar o servidor (opcional)
app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

const port = process.env.PORT || 3000; // Porta definida pelo Vercel ou 3000
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
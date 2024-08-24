const express = require('express');
const bodyParser = require('body-parser');
const request = require('request'); // Certifique-se de ter instalado a biblioteca 'request'

const app = express();
app.use(bodyParser.json()); 

// Substitua pelos seus dados reais
const MAILCHIMP_API_KEY = 'SUA_CHAVE_DE_API_MAILCHIMP';
const LIST_ID = 'SEU_ID_DA_LISTA_MAILCHIMP'; 
const DATA_CENTER = MAILCHIMP_API_KEY.split('-')[1]; // Extrai o data center da chave da API

app.post('/enviar_email', (req, res) => {
  const { nome, email } = req.body;

  // Construindo a URL da API do Mailchimp
  const url = `https://${DATA_CENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members/`;

  // Construindo os dados para a requisição
  const data = {
    email_address: email,
    status: 'subscribed', // 'subscribed' ou 'pending' 
    merge_fields: {
      FNAME: nome // 'FNAME' é o nome do campo "Nome" na sua lista do Mailchimp
    }
  };

  // Opções da requisição para a API do Mailchimp
  const options = {
    url: url,
    method: 'POST',
    headers: {
      'Authorization': `apikey ${MAILCHIMP_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  // Fazendo a requisição para a API do Mailchimp
  request(options, (error, response, body) => {
    if (error) {
      console.error('Erro ao adicionar email à lista:', error);
      res.status(500).send('Erro ao processar a requisição.');
    } else {
      console.log('Email adicionado à lista com sucesso:', body); 
      res.status(200).send('Obrigado pelo interesse! Entraremos em contato em breve.'); 
    }
  });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000')); 
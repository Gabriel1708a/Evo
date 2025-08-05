require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configurações da Evolution API
const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
const API_KEY = process.env.EVOLUTION_API_KEY;
const INSTANCE_NAME = process.env.INSTANCE_NAME || 'bot_atendimento';

// Headers para requisições
const headers = {
  'Content-Type': 'application/json',
  'apikey': API_KEY
};

// Estados dos usuários (em produção usar um banco de dados)
const userStates = new Map();

// Menu principal em formato de enquete
const createMainMenu = () => {
  return {
    poll: {
      name: "🤖 Bem-vindo ao Atendimento Automático! 🤖\n\nEscolha uma das opções abaixo:",
      options: [
        "ℹ️ Informações do Bot",
        "⚙️ Comandos",
        "🎧 Suporte"
      ],
      selectableCount: 1
    }
  };
};

// Função para enviar mensagem
async function sendMessage(remoteJid, message) {
  try {
    const response = await axios.post(
      `${EVOLUTION_API_URL}/message/sendText/${INSTANCE_NAME}`,
      {
        number: remoteJid,
        text: message
      },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error.response?.data || error.message);
    throw error;
  }
}

// Função para enviar enquete
async function sendPoll(remoteJid, pollData) {
  try {
    const response = await axios.post(
      `${EVOLUTION_API_URL}/message/sendPoll/${INSTANCE_NAME}`,
      {
        number: remoteJid,
        ...pollData
      },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar enquete:', error.response?.data || error.message);
    throw error;
  }
}

// Handlers para cada opção do menu
const menuHandlers = {
  'informacoes': async (remoteJid) => {
    const message = `
🤖 *INFORMAÇÕES DO BOT*

📋 *Sobre:*
• Bot de atendimento automático
• Desenvolvido com Evolution API
• Disponível 24/7 para te ajudar

🚀 *Funcionalidades:*
• Menu interativo com enquetes
• Respostas automáticas
• Suporte técnico
• Comandos úteis

⚡ *Versão:* 1.0.0
🔧 *Status:* Online

Digite *menu* para voltar ao menu principal.
    `;
    await sendMessage(remoteJid, message);
  },

  'comandos': async (remoteJid) => {
    const message = `
⚙️ *COMANDOS DISPONÍVEIS*

📝 *Comandos Básicos:*
• *menu* - Exibe o menu principal
• *info* - Informações do bot
• *suporte* - Contato do suporte
• *help* - Lista de comandos

🎯 *Comandos Úteis:*
• *status* - Status do sistema
• *ping* - Teste de conexão
• *reset* - Reiniciar conversa

💡 *Dica:* Digite qualquer comando a qualquer momento!

Digite *menu* para voltar ao menu principal.
    `;
    await sendMessage(remoteJid, message);
  },

  'suporte': async (remoteJid) => {
    const message = `
🎧 *SUPORTE TÉCNICO*

👨‍💻 *Contato:*
• WhatsApp: (11) 99999-9999
• Email: suporte@empresa.com
• Horário: Segunda à Sexta, 9h às 18h

🆘 *Para Emergências:*
• WhatsApp: (11) 88888-8888
• Disponível 24h

📋 *Antes de entrar em contato:*
• Descreva o problema detalhadamente
• Informe o horário do ocorrido
• Anexe prints se necessário

⏰ *Tempo médio de resposta:*
• Horário comercial: 30 minutos
• Fora do horário: 2 horas

Digite *menu* para voltar ao menu principal.
    `;
    await sendMessage(remoteJid, message);
  }
};

// Processar mensagens recebidas
async function processMessage(messageData) {
  const { remoteJid, message } = messageData;
  const messageText = message?.conversation || message?.extendedTextMessage?.text || '';
  const messageType = message?.messageType;

  console.log(`Mensagem recebida de ${remoteJid}: ${messageText}`);

  // Verificar se é resposta de enquete
  if (messageType === 'pollUpdateMessage') {
    const selectedOption = message.pollUpdateMessage?.vote?.selectedOptions?.[0];
    await handlePollResponse(remoteJid, selectedOption);
    return;
  }

  // Processar comandos de texto
  const command = messageText.toLowerCase().trim();

  switch (command) {
    case '/start':
    case 'menu':
    case 'início':
    case 'oi':
    case 'olá':
    case 'hello':
      await sendWelcomeMessage(remoteJid);
      break;

    case 'info':
    case 'informações':
      await menuHandlers.informacoes(remoteJid);
      break;

    case 'comandos':
    case 'help':
    case 'ajuda':
      await menuHandlers.comandos(remoteJid);
      break;

    case 'suporte':
    case 'atendimento':
      await menuHandlers.suporte(remoteJid);
      break;

    case 'status':
      await sendMessage(remoteJid, '✅ *Sistema Online* - Funcionando perfeitamente!');
      break;

    case 'ping':
      await sendMessage(remoteJid, '🏓 *Pong!* - Bot respondendo normalmente.');
      break;

    case 'reset':
      userStates.delete(remoteJid);
      await sendMessage(remoteJid, '🔄 *Conversa reiniciada!* Digite *menu* para começar.');
      break;

    default:
      if (messageText.length > 0) {
        await sendDefaultResponse(remoteJid);
      }
      break;
  }
}

// Enviar mensagem de boas-vindas com menu
async function sendWelcomeMessage(remoteJid) {
  const welcomeText = `
🤖 *Olá! Bem-vindo ao nosso atendimento automático!*

Eu sou seu assistente virtual e estou aqui para ajudá-lo.

Escolha uma das opções na enquete abaixo:
  `;

  await sendMessage(remoteJid, welcomeText);
  
  // Aguardar um pouco antes de enviar a enquete
  setTimeout(async () => {
    await sendPoll(remoteJid, createMainMenu());
  }, 1000);
}

// Processar resposta da enquete
async function handlePollResponse(remoteJid, selectedOption) {
  console.log(`Opção selecionada: ${selectedOption}`);

  switch (selectedOption) {
    case 0: // Informações do Bot
      await menuHandlers.informacoes(remoteJid);
      break;
    case 1: // Comandos
      await menuHandlers.comandos(remoteJid);
      break;
    case 2: // Suporte
      await menuHandlers.suporte(remoteJid);
      break;
    default:
      await sendDefaultResponse(remoteJid);
      break;
  }
}

// Resposta padrão para mensagens não reconhecidas
async function sendDefaultResponse(remoteJid) {
  const message = `
❓ *Desculpe, não entendi sua mensagem.*

Digite uma das opções:
• *menu* - Ver menu principal
• *help* - Ver comandos disponíveis
• *suporte* - Falar com atendente

Ou responda a enquete que enviei anteriormente.
  `;
  await sendMessage(remoteJid, message);
}

// Webhook para receber mensagens
app.post('/webhook', async (req, res) => {
  try {
    const data = req.body;
    console.log('Webhook recebido:', JSON.stringify(data, null, 2));

    // Verificar se é uma mensagem
    if (data.event === 'messages.upsert' && data.data?.messages) {
      for (const message of data.data.messages) {
        if (!message.key.fromMe) { // Não processar mensagens enviadas pelo próprio bot
          await processMessage({
            remoteJid: message.key.remoteJid,
            message: message.message
          });
        }
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota de teste
app.get('/test', async (req, res) => {
  try {
    const testNumber = req.query.number;
    if (!testNumber) {
      return res.status(400).json({ error: 'Número não fornecido' });
    }

    await sendWelcomeMessage(testNumber);
    res.json({ success: true, message: 'Mensagem de teste enviada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota de status
app.get('/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🤖 Bot de atendimento rodando na porta ${PORT}`);
  console.log(`📱 Webhook: http://localhost:${PORT}/webhook`);
  console.log(`🔍 Teste: http://localhost:${PORT}/test?number=5511999999999`);
  console.log(`📊 Status: http://localhost:${PORT}/status`);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception thrown:', error);
  process.exit(1);
});
# 🤖 Bot de Atendimento - Evolution API

Bot de atendimento automático desenvolvido com Evolution API que utiliza **menu em formato de enquete** para interação com usuários.

## 📋 Funcionalidades

- ✅ Menu interativo com enquetes do WhatsApp
- ✅ Três opções principais: **Informações do Bot**, **Comandos** e **Suporte**
- ✅ Respostas automáticas inteligentes
- ✅ Comandos de texto tradicionais
- ✅ Webhook para receber mensagens
- ✅ Sistema de estados de usuário
- ✅ Logs detalhados

## 🚀 Menu Principal (Enquete)

O bot apresenta um menu em formato de enquete com as seguintes opções:

```
🤖 Bem-vindo ao Atendimento Automático! 🤖

Escolha uma das opções abaixo:

📊 ENQUETE:
┌─────────────────────────────┐
│ ℹ️ Informações do Bot        │
│ ⚙️ Comandos                  │
│ 🎧 Suporte                   │
└─────────────────────────────┘
```

### Opções do Menu:

1. **ℹ️ Informações do Bot**: Exibe detalhes sobre o bot, funcionalidades e versão
2. **⚙️ Comandos**: Lista todos os comandos disponíveis e suas funções
3. **🎧 Suporte**: Informações de contato para suporte técnico

## 🛠️ Instalação

### Pré-requisitos

- Node.js (v16 ou superior)
- Evolution API configurada e rodando
- NPM ou Yarn

### Passos de Instalação

1. **Clone o repositório:**
```bash
git clone <url-do-repositorio>
cd bot-atendimento-evolution
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
```

4. **Edite o arquivo `.env` com suas configurações:**
```env
# Evolution API Configuration
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=sua_chave_api_aqui
INSTANCE_NAME=nome_da_instancia

# Server Configuration
PORT=3001
```

5. **Execute o bot:**
```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm start
```

## ⚙️ Configuração da Evolution API

### 1. Configurar Webhook

Configure o webhook na sua instância da Evolution API para receber mensagens:

```bash
# URL do webhook
http://seu-servidor.com:3001/webhook
```

### 2. Endpoints da Evolution API

O bot utiliza os seguintes endpoints:

- `POST /message/sendText/{instance}` - Enviar mensagens de texto
- `POST /message/sendPoll/{instance}` - Enviar enquetes

## 📱 Como Usar

### Iniciando o Bot

O usuário pode iniciar o bot enviando qualquer uma dessas mensagens:
- `oi`, `olá`, `hello`
- `menu`
- `/start`
- `início`

### Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `menu` | Exibe o menu principal com enquete |
| `info` | Informações detalhadas do bot |
| `comandos` | Lista todos os comandos |
| `suporte` | Informações de contato |
| `status` | Status do sistema |
| `ping` | Teste de conexão |
| `reset` | Reinicia a conversa |

## 🔧 API Endpoints

### Webhook
```
POST /webhook
```
Recebe mensagens da Evolution API

### Teste
```
GET /test?number=5511999999999
```
Envia mensagem de teste para um número

### Status
```
GET /status
```
Verifica status do bot

## 📊 Estrutura do Projeto

```
bot-atendimento-evolution/
├── index.js           # Arquivo principal do bot
├── package.json       # Dependências e scripts
├── .env.example       # Exemplo de variáveis de ambiente
├── .env              # Suas variáveis de ambiente (não versionar)
└── README.md         # Documentação
```

## 🎯 Fluxo de Funcionamento

1. **Usuário inicia conversa** → Bot envia mensagem de boas-vindas
2. **Bot envia enquete** → Menu com 3 opções
3. **Usuário seleciona opção** → Bot processa resposta da enquete
4. **Bot responde** → Conteúdo específico da opção selecionada
5. **Usuário pode voltar ao menu** → Digite "menu"

## 🔍 Logs e Monitoramento

O bot registra todas as interações:

```javascript
// Logs automáticos
- Mensagens recebidas
- Respostas de enquetes
- Erros de API
- Status de envio
```

## 🚨 Tratamento de Erros

- ✅ Timeout de requisições
- ✅ Erros de conexão com Evolution API
- ✅ Mensagens malformadas
- ✅ Fallback para comandos não reconhecidos

## 📝 Personalização

### Modificar Menu da Enquete

Edite a função `createMainMenu()` em `index.js`:

```javascript
const createMainMenu = () => {
  return {
    poll: {
      name: "Seu título personalizado aqui",
      options: [
        "Sua opção 1",
        "Sua opção 2", 
        "Sua opção 3"
      ],
      selectableCount: 1
    }
  };
};
```

### Adicionar Novas Opções

1. Adicione a opção no array `options`
2. Crie o handler correspondente em `menuHandlers`
3. Adicione o case no `handlePollResponse()`

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🆘 Suporte

Para suporte técnico:
- WhatsApp: (11) 99999-9999
- Email: suporte@empresa.com

---

**Desenvolvido com ❤️ usando Evolution API**
// src/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ============================================
// ROTAS DE HEALTH CHECK
// ============================================
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'WhatsApp Automation API está rodando!',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// ROTAS DE AUTENTICAÇÃO
// ============================================
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Validações básicas
    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'Email, senha e nome são obrigatórios' 
      });
    }
    
    // TODO: Salvar no banco de dados
    // Por enquanto, simulando sucesso
    
    const user = {
      id: 'user_' + Date.now(),
      email,
      name,
      createdAt: new Date()
    };
    
    const token = 'token_' + Date.now(); // TODO: Gerar JWT real
    
    res.status(201).json({
      success: true,
      user,
      token,
      message: 'Usuário registrado com sucesso'
    });
    
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validações
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email e senha são obrigatórios' 
      });
    }
    
    // TODO: Validar credenciais no banco
    // Por enquanto, aceita qualquer login
    
    const user = {
      id: 'user_123',
      email,
      name: 'Usuário Teste'
    };
    
    const token = 'token_' + Date.now(); // TODO: Gerar JWT real
    
    res.json({
      success: true,
      user,
      token,
      message: 'Login realizado com sucesso'
    });
    
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// ============================================
// ROTAS DE WHATSAPP
// ============================================
app.post('/api/whatsapp/connect', async (req, res) => {
  try {
    const userId = req.headers['user-id'] || 'user_123';
    
    // TODO: Integrar com Evolution API
    // Por enquanto, retorna QR Code fake
    
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=whatsapp_${userId}_${Date.now()}`;
    
    res.json({
      success: true,
      qrCode,
      message: 'QR Code gerado. Escaneie com seu WhatsApp'
    });
    
  } catch (error) {
    console.error('Erro ao conectar WhatsApp:', error);
    res.status(500).json({ error: 'Erro ao conectar WhatsApp' });
  }
});

app.get('/api/whatsapp/status', async (req, res) => {
  try {
    const userId = req.headers['user-id'] || 'user_123';
    
    // TODO: Verificar status real com Evolution API
    
    res.json({
      connected: true,
      phoneNumber: '+55 11 99999-9999',
      status: 'online',
      lastSeen: new Date()
    });
    
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    res.status(500).json({ error: 'Erro ao verificar status' });
  }
});

app.post('/api/whatsapp/disconnect', async (req, res) => {
  try {
    // TODO: Desconectar da Evolution API
    
    res.json({
      success: true,
      message: 'WhatsApp desconectado com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao desconectar:', error);
    res.status(500).json({ error: 'Erro ao desconectar' });
  }
});

// ============================================
// ROTAS DE AUTOMAÇÕES
// ============================================

// Banco de dados fake em memória (só para desenvolvimento)
let automations = [
  {
    id: '1',
    name: 'Boas-vindas',
    trigger: 'keyword',
    condition: 'oi',
    response: 'Olá! Bem-vindo ao nosso atendimento. Como posso ajudar?',
    active: true,
    executionCount: 45,
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'Horário de Atendimento',
    trigger: 'keyword',
    condition: 'horário',
    response: 'Nosso horário de atendimento é de segunda a sexta, das 9h às 18h.',
    active: true,
    executionCount: 23,
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'Catálogo de Produtos',
    trigger: 'keyword',
    condition: 'produtos',
    response: 'Temos diversos produtos disponíveis! Acesse nosso catálogo: https://exemplo.com/catalogo',
    active: false,
    executionCount: 12,
    createdAt: new Date()
  }
];

app.get('/api/automations', async (req, res) => {
  try {
    const userId = req.headers['user-id'] || 'user_123';
    
    // TODO: Buscar do banco filtrado por userId
    
    res.json(automations);
    
  } catch (error) {
    console.error('Erro ao listar automações:', error);
    res.status(500).json({ error: 'Erro ao listar automações' });
  }
});

app.post('/api/automations', async (req, res) => {
  try {
    const userId = req.headers['user-id'] || 'user_123';
    const { name, trigger, condition, response, active } = req.body;
    
    // Validações
    if (!name || !trigger || !response) {
      return res.status(400).json({ 
        error: 'Nome, gatilho e resposta são obrigatórios' 
      });
    }
    
    const newAutomation = {
      id: 'auto_' + Date.now(),
      name,
      trigger,
      condition,
      response,
      active: active !== false, // default true
      executionCount: 0,
      createdAt: new Date()
    };
    
    // TODO: Salvar no banco
    automations.push(newAutomation);
    
    res.status(201).json({
      success: true,
      automation: newAutomation,
      message: 'Automação criada com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao criar automação:', error);
    res.status(500).json({ error: 'Erro ao criar automação' });
  }
});

app.put('/api/automations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // TODO: Atualizar no banco
    const index = automations.findIndex(a => a.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Automação não encontrada' });
    }
    
    automations[index] = { ...automations[index], ...updates };
    
    res.json({
      success: true,
      automation: automations[index],
      message: 'Automação atualizada com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao atualizar automação:', error);
    res.status(500).json({ error: 'Erro ao atualizar automação' });
  }
});

app.delete('/api/automations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // TODO: Deletar do banco
    automations = automations.filter(a => a.id !== id);
    
    res.json({
      success: true,
      message: 'Automação deletada com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao deletar automação:', error);
    res.status(500).json({ error: 'Erro ao deletar automação' });
  }
});

// ============================================
// ROTAS DE MENSAGENS
// ============================================

let scheduledMessages = [
  {
    id: '1',
    to: '+5511999999999',
    message: 'Olá! Não esqueça da sua consulta amanhã às 14h.',
    scheduledAt: new Date(Date.now() + 86400000), // +1 dia
    recurrence: 'once',
    status: 'pending'
  }
];

app.post('/api/messages/send', async (req, res) => {
  try {
    const { to, message } = req.body;
    
    if (!to || !message) {
      return res.status(400).json({ 
        error: 'Número de destino e mensagem são obrigatórios' 
      });
    }
    
    // TODO: Enviar via Evolution API
    
    res.json({
      success: true,
      messageId: 'msg_' + Date.now(),
      message: 'Mensagem enviada com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
});

app.post('/api/messages/schedule', async (req, res) => {
  try {
    const { to, message, scheduledAt, recurrence } = req.body;
    
    if (!to || !message || !scheduledAt) {
      return res.status(400).json({ 
        error: 'Número, mensagem e data são obrigatórios' 
      });
    }
    
    const newScheduled = {
      id: 'sched_' + Date.now(),
      to,
      message,
      scheduledAt: new Date(scheduledAt),
      recurrence: recurrence || 'once',
      status: 'pending',
      createdAt: new Date()
    };
    
    // TODO: Salvar no banco e agendar job
    scheduledMessages.push(newScheduled);
    
    res.status(201).json({
      success: true,
      scheduledMessage: newScheduled,
      message: 'Mensagem agendada com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao agendar mensagem:', error);
    res.status(500).json({ error: 'Erro ao agendar mensagem' });
  }
});

app.get('/api/messages/scheduled', async (req, res) => {
  try {
    // TODO: Buscar do banco
    res.json(scheduledMessages);
  } catch (error) {
    console.error('Erro ao listar mensagens agendadas:', error);
    res.status(500).json({ error: 'Erro ao listar mensagens' });
  }
});

// ============================================
// ROTAS DE CONTATOS
// ============================================

const contacts = [
  {
    id: '1',
    name: 'João Silva',
    phone: '+5511999999999',
    tags: ['cliente', 'vip'],
    lastMessage: 'Obrigado pelo atendimento!',
    lastMessageAt: new Date()
  },
  {
    id: '2',
    name: 'Maria Santos',
    phone: '+5511888888888',
    tags: ['lead'],
    lastMessage: 'Gostaria de mais informações sobre os produtos',
    lastMessageAt: new Date(Date.now() - 3600000)
  }
];

app.get('/api/contacts', async (req, res) => {
  try {
    // TODO: Buscar contatos sincronizados do WhatsApp
    res.json(contacts);
  } catch (error) {
    console.error('Erro ao listar contatos:', error);
    res.status(500).json({ error: 'Erro ao listar contatos' });
  }
});

// ============================================
// ROTAS DE ESTATÍSTICAS
// ============================================

app.get('/api/stats/dashboard', async (req, res) => {
  try {
    // TODO: Calcular estatísticas reais do banco
    
    res.json({
      messagesSentToday: 127,
      messagesReceivedToday: 89,
      activeAutomations: 3,
      connectionStatus: 'connected',
      messagesLast7Days: [
        { date: '14 Jan', sent: 45, received: 38 },
        { date: '15 Jan', sent: 52, received: 45 },
        { date: '16 Jan', sent: 48, received: 32 },
        { date: '17 Jan', sent: 65, received: 48 },
        { date: '18 Jan', sent: 58, received: 42 },
        { date: '19 Jan', sent: 135, received: 95 },
        { date: '20 Jan', sent: 127, received: 89 }
      ]
    });
    
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// ============================================
// TRATAMENTO DE ERROS E ROTA 404
// ============================================

app.use((req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    path: req.path 
  });
});

app.use((error, req, res, next) => {
  console.error('Erro no servidor:', error);
  res.status(500).json({ 
    error: 'Erro interno do servidor' 
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ============================================');
  console.log('🚀  Servidor WhatsApp Automation API');
  console.log('🚀 ============================================');
  console.log(`🚀  Rodando na porta: ${PORT}`);
  console.log(`🚀  URL: http://localhost:${PORT}`);
  console.log(`🚀  Health check: http://localhost:${PORT}/health`);
  console.log(`🚀  Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log('🚀 ============================================');
  console.log('');
});
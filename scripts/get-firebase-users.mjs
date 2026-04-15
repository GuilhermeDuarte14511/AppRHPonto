#!/usr/bin/env node

/**
 * Script para buscar todos os usuários do Firebase Authentication
 * 
 * Uso:
 *   node scripts/get-firebase-users.mjs
 *   node scripts/get-firebase-users.mjs --format json
 *   node scripts/get-firebase-users.mjs --format table
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuração
const SERVICE_ACCOUNT_PATH = resolve(__dirname, '../firebase-service-account.json');
const args = process.argv.slice(2);
const format = args.includes('--format') 
  ? args[args.indexOf('--format') + 1] 
  : 'table';

console.log('🔥 Firebase Users Fetcher\n');

// Verificar se o service account existe
if (!existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error('❌ Erro: Arquivo firebase-service-account.json não encontrado!');
  console.log('\n📝 Para criar o arquivo:');
  console.log('1. Acesse: https://console.firebase.google.com/');
  console.log('2. Selecione seu projeto');
  console.log('3. Vá em: Configurações do Projeto > Contas de Serviço');
  console.log('4. Clique em "Gerar nova chave privada"');
  console.log('5. Salve o arquivo como: firebase-service-account.json');
  console.log(`6. Coloque em: ${SERVICE_ACCOUNT_PATH}\n`);
  process.exit(1);
}

try {
  // Inicializar Firebase Admin
  const serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));
  
  initializeApp({
    credential: cert(serviceAccount),
  });

  const auth = getAuth();
  
  console.log('✅ Conectado ao Firebase Authentication\n');
  console.log('📥 Buscando usuários...\n');

  // Buscar todos os usuários
  const listAllUsers = async (nextPageToken) => {
    const result = await auth.listUsers(1000, nextPageToken);
    return result;
  };

  const users = [];
  let pageToken;
  
  do {
    const result = await listAllUsers(pageToken);
    users.push(...result.users);
    pageToken = result.pageToken;
  } while (pageToken);

  console.log(`✅ Total de usuários encontrados: ${users.length}\n`);

  // Formatar dados
  const formattedUsers = users.map(user => ({
    uid: user.uid,
    email: user.email || 'N/A',
    displayName: user.displayName || 'N/A',
    emailVerified: user.emailVerified,
    disabled: user.disabled,
    creationTime: user.metadata.creationTime,
    lastSignInTime: user.metadata.lastSignInTime || 'Nunca',
    phoneNumber: user.phoneNumber || 'N/A',
  }));

  // Exibir resultado
  if (format === 'json') {
    console.log(JSON.stringify(formattedUsers, null, 2));
  } else {
    // Formato tabela
    console.log('📋 Lista de Usuários:\n');
    console.log('─'.repeat(120));
    console.log(
      'Email'.padEnd(35) +
      'Nome'.padEnd(25) +
      'UID'.padEnd(30) +
      'Verificado'.padEnd(15) +
      'Status'
    );
    console.log('─'.repeat(120));
    
    formattedUsers.forEach(user => {
      console.log(
        (user.email || 'N/A').padEnd(35).substring(0, 35) +
        (user.displayName || 'N/A').padEnd(25).substring(0, 25) +
        user.uid.padEnd(30).substring(0, 30) +
        (user.emailVerified ? '✅ Sim' : '❌ Não').padEnd(15) +
        (user.disabled ? '🔒 Desabilitado' : '✅ Ativo')
      );
    });
    
    console.log('─'.repeat(120));
    console.log(`\n📊 Estatísticas:`);
    console.log(`   Total: ${users.length}`);
    console.log(`   Verificados: ${formattedUsers.filter(u => u.emailVerified).length}`);
    console.log(`   Não verificados: ${formattedUsers.filter(u => !u.emailVerified).length}`);
    console.log(`   Ativos: ${formattedUsers.filter(u => !u.disabled).length}`);
    console.log(`   Desabilitados: ${formattedUsers.filter(u => u.disabled).length}`);
  }

  console.log('\n✅ Concluído!\n');
  process.exit(0);

} catch (error) {
  console.error('❌ Erro ao buscar usuários:', error.message);
  console.error('\n📝 Detalhes do erro:', error);
  process.exit(1);
}
# 🔥 Guia de Busca de Usuários do Firebase

## 📋 Visão Geral

Este guia explica como buscar todos os usuários (logins) cadastrados no Firebase Authentication do projeto.

## 🚀 Método 1: Script CLI (Recomendado)

### Pré-requisitos

1. **Service Account Key do Firebase**
   - Acesse: https://console.firebase.google.com/
   - Selecione o projeto: `myrh-32b0a`
   - Vá em: **Configurações do Projeto** > **Contas de Serviço**
   - Clique em: **Gerar nova chave privada**
   - Salve o arquivo como: `firebase-service-account.json`
   - Coloque na raiz do projeto: `AppRHPonto/firebase-service-account.json`

2. **Instalar firebase-admin** (se ainda não estiver instalado)
   ```powershell
   cd C:\Projeto\AppRHPonto
   pnpm add -D firebase-admin
   ```

### Como Usar

#### Formato Tabela (Padrão)
```powershell
cd C:\Projeto\AppRHPonto
node scripts/get-firebase-users.mjs
```

**Saída:**
```
🔥 Firebase Users Fetcher

✅ Conectado ao Firebase Authentication

📥 Buscando usuários...

✅ Total de usuários encontrados: 15

📋 Lista de Usuários:

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
Email                              Nome                     UID                           Verificado     Status
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
admin@exemplo.com                  Admin Sistema            abc123def456...               ✅ Sim          ✅ Ativo
joao@empresa.com                   João Silva               xyz789uvw012...               ✅ Sim          ✅ Ativo
maria@empresa.com                  Maria Santos             lmn345opq678...               ❌ Não          ✅ Ativo
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

📊 Estatísticas:
   Total: 15
   Verificados: 12
   Não verificados: 3
   Ativos: 14
   Desabilitados: 1

✅ Concluído!
```

#### Formato JSON
```powershell
node scripts/get-firebase-users.mjs --format json
```

**Saída:**
```json
[
  {
    "uid": "abc123def456...",
    "email": "admin@exemplo.com",
    "displayName": "Admin Sistema",
    "emailVerified": true,
    "disabled": false,
    "creationTime": "2024-01-15T10:30:00.000Z",
    "lastSignInTime": "2024-04-15T14:20:00.000Z",
    "phoneNumber": "N/A"
  },
  {
    "uid": "xyz789uvw012...",
    "email": "joao@empresa.com",
    "displayName": "João Silva",
    "emailVerified": true,
    "disabled": false,
    "creationTime": "2024-02-20T08:15:00.000Z",
    "lastSignInTime": "2024-04-15T09:45:00.000Z",
    "phoneNumber": "+5511999999999"
  }
]
```

### Salvar em Arquivo

```powershell
# Salvar em JSON
node scripts/get-firebase-users.mjs --format json > users.json

# Salvar em TXT (tabela)
node scripts/get-firebase-users.mjs > users.txt
```

---

## 🔧 Método 2: Usar no Código

### Exemplo de Função Reutilizável

```typescript
import { getAuth } from 'firebase-admin/auth';

export async function getAllFirebaseUsers() {
  const auth = getAuth();
  const users = [];
  let pageToken;

  do {
    const result = await auth.listUsers(1000, pageToken);
    users.push(...result.users);
    pageToken = result.pageToken;
  } while (pageToken);

  return users.map(user => ({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    emailVerified: user.emailVerified,
    disabled: user.disabled,
    creationTime: user.metadata.creationTime,
    lastSignInTime: user.metadata.lastSignInTime,
    phoneNumber: user.phoneNumber,
  }));
}
```

### Usar em uma API Route (Next.js)

```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { getAllFirebaseUsers } from '@/lib/firebase-admin';

export async function GET() {
  try {
    const users = await getAllFirebaseUsers();
    return NextResponse.json({ users, total: users.length });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar usuários' },
      { status: 500 }
    );
  }
}
```

---

## 📊 Informações Retornadas

Cada usuário contém:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `uid` | string | ID único do usuário no Firebase |
| `email` | string | Email do usuário |
| `displayName` | string | Nome de exibição |
| `emailVerified` | boolean | Se o email foi verificado |
| `disabled` | boolean | Se a conta está desabilitada |
| `creationTime` | string | Data de criação da conta |
| `lastSignInTime` | string | Último login |
| `phoneNumber` | string | Telefone (se cadastrado) |

---

## 🔒 Segurança

### ⚠️ IMPORTANTE

1. **NUNCA commite o arquivo `firebase-service-account.json`**
   - Já está no `.gitignore`
   - Contém credenciais sensíveis

2. **Permissões necessárias:**
   - O service account precisa ter permissão de **Firebase Authentication Admin**

3. **Uso em produção:**
   - Use variáveis de ambiente para as credenciais
   - Implemente autenticação na API
   - Limite o acesso apenas para administradores

---

## 🐛 Resolução de Problemas

### Erro: "firebase-service-account.json não encontrado"

**Solução:** Baixe a chave do Firebase Console e coloque na raiz do projeto.

### Erro: "Permission denied"

**Solução:** 
1. Verifique se o service account tem permissões corretas
2. No Firebase Console: IAM & Admin > Adicione a role "Firebase Authentication Admin"

### Erro: "Module not found: firebase-admin"

**Solução:**
```powershell
pnpm add -D firebase-admin
```

---

## 📝 Exemplos de Uso

### Listar apenas usuários verificados

```typescript
const users = await getAllFirebaseUsers();
const verified = users.filter(u => u.emailVerified);
console.log(`Usuários verificados: ${verified.length}`);
```

### Encontrar usuário por email

```typescript
const users = await getAllFirebaseUsers();
const user = users.find(u => u.email === 'admin@exemplo.com');
```

### Exportar para CSV

```typescript
import { writeFileSync } from 'fs';

const users = await getAllFirebaseUsers();
const csv = [
  'Email,Nome,UID,Verificado,Status',
  ...users.map(u => 
    `${u.email},${u.displayName},${u.uid},${u.emailVerified},${u.disabled ? 'Desabilitado' : 'Ativo'}`
  )
].join('\n');

writeFileSync('users.csv', csv);
```

---

## 🎯 Casos de Uso

1. **Auditoria:** Ver todos os usuários cadastrados
2. **Relatórios:** Exportar lista de usuários
3. **Sincronização:** Sincronizar com banco de dados local
4. **Migração:** Migrar usuários para outro sistema
5. **Análise:** Estatísticas de usuários ativos/inativos

---

**Criado em:** 15/04/2026  
**Projeto:** AppRHPonto  
**Firebase Project:** myrh-32b0a
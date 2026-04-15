# 🚀 Guia de Instalação - AppRHPonto

## ⚠️ IMPORTANTE: Leia Antes de Começar

Os erros do TypeScript que você está vendo são **NORMAIS** e **ESPERADOS** antes da instalação das dependências. Eles vão desaparecer automaticamente após seguir os passos abaixo.

## 📋 Pré-requisitos

- ✅ Node.js 18+ instalado
- ✅ npm instalado (vem com Node.js)
- ✅ Git instalado

## 🔧 Instalação Passo a Passo

### 1️⃣ Instalar o pnpm (Gerenciador de Pacotes)

Abra o PowerShell e execute:

```powershell
npm install -g pnpm
```

Verifique a instalação:

```powershell
pnpm --version
```

Deve mostrar algo como: `9.x.x`

### 2️⃣ Navegar até o Projeto

```powershell
cd C:\Projeto\AppRHPonto
```

### 3️⃣ Instalar Todas as Dependências

```powershell
pnpm install
```

⏱️ **Aguarde:** Isso pode levar de 2 a 5 minutos dependendo da sua conexão.

### 4️⃣ Recarregar o VS Code

Após a instalação completa:

1. Pressione `Ctrl + Shift + P`
2. Digite: `Reload Window`
3. Pressione `Enter`

### 5️⃣ Verificar se os Erros Desapareceram

Após recarregar o VS Code:

- ✅ Os erros do TypeScript devem desaparecer
- ✅ O IntelliSense deve funcionar
- ✅ Os imports devem ser reconhecidos

## 🎯 Estrutura de Dependências

O projeto é um **monorepo** com:

```
AppRHPonto/
├── apps/
│   ├── admin-web/          # Aplicação principal
│   └── mobile-app/         # App mobile
├── packages/
│   ├── ui/                 # Componentes compartilhados
│   ├── config/             # Configurações
│   └── types/              # Tipos TypeScript
└── package.json            # Dependências raiz
```

## 🚀 Comandos Úteis

### Rodar o Projeto em Desenvolvimento

```powershell
# Rodar apenas o admin-web
pnpm --filter admin-web dev

# Rodar todos os apps
pnpm turbo dev
```

### Build de Produção

```powershell
# Build do admin-web
pnpm --filter admin-web build

# Build de todos os apps
pnpm turbo build
```

### Adicionar Nova Dependência

```powershell
# No workspace root
pnpm add <pacote>

# Em um app específico
pnpm add <pacote> --filter admin-web

# Em um package específico
pnpm add <pacote> --filter @rh-ponto/ui
```

### Limpar e Reinstalar

```powershell
# Remover node_modules
rm -r -fo node_modules

# Reinstalar
pnpm install
```

## 🐛 Resolução de Problemas

### Erro: "pnpm não é reconhecido"

**Solução:** Instale o pnpm globalmente:
```powershell
npm install -g pnpm
```

### Erro: "Cannot find module"

**Solução:** 
1. Certifique-se que rodou `pnpm install`
2. Recarregue o VS Code (`Ctrl+Shift+P` > `Reload Window`)

### Erros do TypeScript Persistem

**Solução:**
1. Delete a pasta `.next` em `apps/admin-web/`
2. Rode `pnpm install` novamente
3. Recarregue o VS Code

### Porta 3000 em Uso

**Solução:** Use outra porta:
```powershell
PORT=3001 pnpm --filter admin-web dev
```

## 📚 Documentação Adicional

- [Documentação do pnpm](https://pnpm.io/)
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Turborepo Docs](https://turbo.build/repo/docs)

## ✅ Checklist de Instalação

- [ ] Node.js 18+ instalado
- [ ] pnpm instalado globalmente
- [ ] Dependências instaladas (`pnpm install`)
- [ ] VS Code recarregado
- [ ] Erros do TypeScript desapareceram
- [ ] Projeto rodando (`pnpm --filter admin-web dev`)

## 🎉 Pronto!

Após seguir todos os passos, seu ambiente estará configurado e pronto para desenvolvimento!

---

**Dúvidas?** Verifique a seção de Resolução de Problemas acima.
# Medly Web

Interface web para o sistema de agendamento de consultas médicas Medly.

> Consome a API [medly-api](https://github.com/italohreis/medly-api).

## Tecnologias

- React, TypeScript, Vite
- TailwindCSS
- Axios
- React Router DOM
- Lucide React

## Pré-requisitos

- Node.js
- Backend (`medly-api`) rodando na porta `8080`

## Como Rodar

```bash
npm install
npm run dev
```

Disponível em `http://localhost:5173`.

## Proxy da API

Configurado em `vite.config.ts`. Requisições para `/api` são redirecionadas para `http://localhost:8080`.

## Estrutura

```
src/
├── pages/          # Telas por perfil (admin, doctor, patient, auth)
├── components/     # Componentes reutilizáveis e específicos por módulo
├── contexts/       # Estado global (Auth, Toast)
├── hooks/          # Custom hooks
├── services/       # Integração com a API (Axios)
├── types/          # Interfaces TypeScript
└── utils/          # Funções utilitárias
```

## Funcionalidades

- **Auth:** Login (JWT) e registro de pacientes
- **Admin:** Cadastro de médicos, gestão de pacientes e consultas
- **Médico:** Janelas de disponibilidade e controle de consultas
- **Paciente:** Busca de horários, agendamento e cancelamento


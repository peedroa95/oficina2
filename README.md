# Sistema da Oficina

Sistema web interno para controle de uma oficina mecânica: clientes, veículos, ordens de serviço, estoque, financeiro e impressão de nota de serviço.

## Tecnologias

Next.js (App Router) · React · TypeScript · Tailwind CSS · PostgreSQL · Prisma ORM

## Configuração local

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Configure a variável `DATABASE_URL` em um arquivo `.env` (veja `.env.example`), apontando para um banco PostgreSQL.

3. Sincronize o schema com o banco:

   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. (Opcional) Popule o banco com dados de exemplo:

   ```bash
   npx prisma db seed
   ```

5. Rode o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

   Acesse [http://localhost:3000](http://localhost:3000).

## Build de produção

```bash
npm run build
npm run start
```

A `DATABASE_URL` precisa apontar para um PostgreSQL real em produção (o `prisma dev` local é apenas para desenvolvimento).

## Estrutura

- `src/app/(app)` — páginas do sistema (dashboard, clientes, veículos, ordens de serviço, estoque, financeiro, configurações).
- `src/app/(print)` — layout enxuto usado apenas na nota de serviço para impressão.
- `src/actions` — Server Actions (mutações: criar, editar, excluir).
- `src/lib` — Prisma client, formatação, constantes e regras de cálculo da OS.
- `prisma/schema.prisma` — modelo de dados.
- `prisma/seed.ts` — dados de exemplo (5 clientes, 5 veículos, 10 serviços, 10 produtos, 5 ordens de serviço).

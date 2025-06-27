# Guia Completo de Tecnologias do Projeto
## Ferramentas utilizadas no sistema

## 1. REACT - A Base da Interface

### O que é?
React é uma biblioteca JavaScript criada pelo Facebook para construir interfaces de usuário. Pense nela como um conjunto de "Legos" digitais - você cria pequenos componentes e os combina para formar uma aplicação completa.

### Como funciona?
- **Componentes**: Cada parte da tela é um componente (botão, formulário, gráfico)
- **JSX**: Permite escrever HTML dentro do JavaScript
- **Virtual DOM**: React cria uma cópia virtual da página em memória para otimizar atualizações

### Onde encontrar no projeto:
```
client/src/
├── App.tsx              # Componente principal
├── pages/
│   └── dashboard.tsx    # Página do painel
└── components/
    ├── ui/              # Componentes de interface
    └── database/        # Componentes específicos do banco
```

### Exemplo prático:
```tsx
// Um componente simples
function MeuBotao() {
  return <button>Clique aqui</button>;
}

// Usando o componente
<MeuBotao />
```

### Por que foi usado?
- Interface reativa (atualiza automaticamente)
- Componentes reutilizáveis
- Ecossistema gigante
- Usado por empresas como Facebook, Netflix, Airbnb

---

## 2. TYPESCRIPT - JavaScript com Superpoderes

### O que é?
TypeScript é JavaScript com "tipos" - ou seja, você pode dizer que uma variável é um número, texto, etc. É como dar "regras" mais claras para seu código.

### Como funciona?
```typescript
// JavaScript normal
let nome = "João";
let idade = 25;

// TypeScript - com tipos definidos
let nome: string = "João";
let idade: number = 25;

// Se tentar fazer algo errado, o editor avisa:
idade = "vinte e cinco"; // ❌ ERRO! idade deve ser número
```

### Onde encontrar:
- **Todos os arquivos `.ts` e `.tsx`** no projeto
- `tsconfig.json` - configurações do TypeScript

### Vantagens:
- Detecta erros antes de executar o código
- Melhor autocompletar no editor
- Código mais fácil de entender e manter
- Usado por Microsoft, Google, Slack

---

## 3. NODE.JS + EXPRESS - O Servidor

### O que é Node.js?
Node.js permite executar JavaScript no servidor (não só no navegador). É como ter um "JavaScript do computador".

### O que é Express?
Express é um framework que torna fácil criar um servidor web. É como ter um "kit de ferramentas" para construir APIs.

### Onde encontrar:
```
server/
├── index.ts         # Arquivo principal do servidor
├── routes.ts        # Define as URLs da API (/api/conflicts, etc)
├── storage.ts       # Funções para salvar/buscar dados
└── vite.ts          # Configuração do servidor de desenvolvimento
```

### Como funciona:
```typescript
// Criando um servidor simples
const app = express();

// Quando alguém acessar /api/hello
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Olá mundo!' });
});

// Inicia o servidor na porta 5000
app.listen(5000);
```

### APIs RESTful:
- `GET /api/conflicts` - Buscar conflitos
- `POST /api/conflicts` - Criar novo conflito
- `PUT /api/conflicts/123` - Atualizar conflito
- `DELETE /api/conflicts/123` - Deletar conflito

---

## 4. POSTGRESQL - O Banco de Dados

### O que é?
PostgreSQL é um banco de dados relacional - como uma planilha Excel gigante e inteligente que pode conectar informações entre diferentes tabelas.

### Como funciona?
```sql
-- Exemplo de tabela
CREATE TABLE conflito (
    id INT PRIMARY KEY,
    nome VARCHAR(50),
    total_mortos INT
);

-- Inserir dados
INSERT INTO conflito (id, nome, total_mortos) 
VALUES (1, 'Guerra Civil', 1000);

-- Buscar dados
SELECT * FROM conflito WHERE total_mortos > 500;
```

### Onde encontrar a estrutura:
- `shared/schema.ts` - Definição das tabelas em código
- `drizzle.config.ts` - Configuração do banco

### Por que PostgreSQL?
- Confiável (usado por bancos, governos)
- Suporte a dados complexos
- Excelente performance
- Padrão ACID (Atomicidade, Consistência, Isolamento, Durabilidade)

---

## 5. DRIZZLE ORM - A Ponte com o Banco

### O que é ORM?
Object-Relational Mapping - traduz entre objetos JavaScript e tabelas SQL. É como ter um "tradutor" entre seu código e o banco de dados.

### Como funciona:
```typescript
// Em vez de escrever SQL assim:
"SELECT * FROM conflito WHERE id = 1"

// Você escreve assim:
db.select().from(conflito).where(eq(conflito.id, 1))
```

### Onde encontrar:
- `shared/schema.ts` - Definição das tabelas
- `server/storage.ts` - Operações no banco
- `server/db.ts` - Conexão com o banco

### Vantagens:
- Type-safe (TypeScript verifica se você está usando as colunas certas)
- Menos erros SQL
- Código mais legível
- Migrações automáticas

---

## 6. TAILWIND CSS - Estilização Rápida

### O que é?
Tailwind é um framework CSS "utility-first" - em vez de escrever CSS customizado, você usa classes pré-definidas.

### Como funciona:
```html
<!-- CSS tradicional -->
<style>
.meu-botao {
  background-color: blue;
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
}
</style>
<button class="meu-botao">Clique</button>

<!-- Tailwind CSS -->
<button class="bg-blue-500 text-white px-6 py-3 rounded">
  Clique
</button>
```

### Onde encontrar:
- `tailwind.config.ts` - Configuração do Tailwind
- `client/src/index.css` - Estilos globais
- Classes nos componentes React

### Classes úteis:
- **Layout**: `flex`, `grid`, `w-full`, `h-64`
- **Cores**: `bg-blue-500`, `text-red-600`
- **Espaçamento**: `p-4`, `m-2`, `px-6`, `py-3`
- **Responsividade**: `md:w-1/2`, `lg:text-xl`

---

## 7. TANSTACK QUERY - Gerenciamento de Estado

### O que é?
TanStack Query gerencia dados que vêm do servidor. É como ter um "assistente inteligente" que busca, armazena e atualiza dados automaticamente.

### Como funciona:
```typescript
// Hook para buscar dados
const { data, isLoading, error } = useQuery({
  queryKey: ['conflicts'],
  queryFn: () => fetch('/api/conflicts').then(res => res.json())
});

// O TanStack Query automaticamente:
// - Faz cache dos dados
// - Revalida quando necessário
// - Gerencia estados de loading/error
```

### Onde encontrar:
- `client/src/lib/queryClient.ts` - Configuração
- Hooks `useQuery` e `useMutation` nos componentes

### Benefícios:
- Cache inteligente
- Sincronização automática
- Estados de loading/error automáticos
- Otimizações de performance

---

## 8. VITE - Ferramenta de Build

### O que é?
Vite é uma ferramenta de desenvolvimento que torna o processo de coding muito mais rápido. É como ter um "turbo" no seu desenvolvimento.

### Como funciona:
- **Hot Reload**: Quando você salva um arquivo, a página atualiza instantaneamente
- **Build otimizado**: Gera arquivos finais compactados para produção
- **ES Modules**: Usa módulos JavaScript modernos

### Onde encontrar:
- `vite.config.ts` - Configuração principal
- `server/vite.ts` - Integração com o servidor

### Comandos importantes:
```bash
npm run dev     # Inicia desenvolvimento
npm run build   # Gera build de produção
npm run preview # Testa o build localmente
```

---

## 9. SHADCN/UI - Componentes Prontos

### O que é?
shadcn/ui é uma coleção de componentes de interface prontos e bonitos. É como ter um "kit de peças" profissionais para construir sua interface.

### Como funciona:
```tsx
// Em vez de criar um botão do zero
<button className="custom-button">Clique</button>

// Você usa um componente pronto
<Button variant="primary" size="lg">Clique</Button>
```

### Onde encontrar:
- `client/src/components/ui/` - Componentes base
- Baseado em Radix UI (acessibilidade) + Tailwind (estilo)

### Componentes disponíveis:
- **Button, Input, Select** - Elementos básicos
- **Dialog, Sheet, Popover** - Modais e overlays
- **Table, Card, Badge** - Componentes de layout
- **Form, Label, Checkbox** - Elementos de formulário

---

## 10. WOUTER - Navegação

### O que é?
Wouter é uma biblioteca de roteamento - permite navegar entre diferentes páginas sem recarregar a página inteira.

### Como funciona:
```tsx
import { Route, Switch, Link } from 'wouter';

function App() {
  return (
    <div>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/sobre">Sobre</Link>
      </nav>
      
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/sobre" component={Sobre} />
      </Switch>
    </div>
  );
}
```

### Onde encontrar:
- `client/src/App.tsx` - Configuração das rotas

---

## 11. ZOD - Validação de Dados

### O que é?
Zod é uma biblioteca para validar dados - garante que as informações estão no formato correto antes de processar.

### Como funciona:
```typescript
import { z } from 'zod';

// Define um esquema
const ConflictSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  totalMortos: z.number().min(0, "Deve ser positivo"),
  lugar: z.string().max(50, "Máximo 50 caracteres")
});

// Valida dados
const dados = { nome: "Guerra Civil", totalMortos: 1000, lugar: "Síria" };
const resultado = ConflictSchema.parse(dados); // ✅ Válido
```

### Onde encontrar:
- `shared/schema.ts` - Esquemas de validação
- Integrado com React Hook Form nos formulários

---

## 12. RECHARTS - Gráficos

### O que é?
Recharts é uma biblioteca para criar gráficos bonitos e interativos em React.

### Como funciona:
```tsx
import { BarChart, Bar, XAxis, YAxis } from 'recharts';

const dados = [
  { nome: 'Janeiro', conflitos: 12 },
  { nome: 'Fevereiro', conflitos: 8 },
];

<BarChart data={dados}>
  <Bar dataKey="conflitos" fill="#8884d8" />
  <XAxis dataKey="nome" />
  <YAxis />
</BarChart>
```

### Tipos de gráficos disponíveis:
- **BarChart** - Gráfico de barras
- **LineChart** - Gráfico de linhas
- **PieChart** - Gráfico de pizza
- **AreaChart** - Gráfico de área

---

## 13. ESTRUTURA DE ARQUIVOS EXPLICADA

```
projeto/
├── client/                    # Frontend (React)
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   │   ├── ui/           # Componentes base (shadcn/ui)
│   │   │   └── database/     # Componentes específicos
│   │   ├── pages/            # Páginas da aplicação
│   │   ├── lib/              # Utilitários e configurações
│   │   └── hooks/            # Custom React hooks
│   └── index.html            # Página HTML principal
│
├── server/                   # Backend (Node.js + Express)
│   ├── index.ts             # Servidor principal
│   ├── routes.ts            # Rotas da API
│   ├── storage.ts           # Operações do banco
│   └── db.ts                # Conexão com PostgreSQL
│
├── shared/                  # Código compartilhado
│   └── schema.ts            # Modelos de dados (Drizzle)
│
├── package.json             # Dependências e scripts
├── tsconfig.json           # Configuração TypeScript
├── tailwind.config.ts      # Configuração Tailwind
├── vite.config.ts          # Configuração Vite
└── drizzle.config.ts       # Configuração banco de dados
```

---

## 14. FLUXO DE DADOS NA APLICAÇÃO

### 1. Usuário interage com a interface (React)
```
Usuário clica em "Ver Conflitos" → Componente React
```

### 2. TanStack Query faz requisição para API
```
useQuery(['conflicts']) → Requisição HTTP para /api/conflicts
```

### 3. Express processa a requisição
```
GET /api/conflicts → routes.ts → storage.ts
```

### 4. Drizzle consulta o PostgreSQL
```
storage.ts → Drizzle ORM → PostgreSQL → Dados retornados
```

### 5. Dados voltam para a interface
```
PostgreSQL → API → TanStack Query → React → Usuário vê os dados
```
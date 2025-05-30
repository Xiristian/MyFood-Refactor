# MyFood

## Descrição

O MyFood é um aplicativo de gerenciamento de refeições que permite aos usuários registrar e acompanhar suas refeições diárias, fornecendo informações nutricionais e sugestões de cardápios.

## Funcionalidades Principais

- Cadastro de usuários com dados pessoais básicos.
- Registro de refeições (tipo, data, horário, descrição dos alimentos e porções).
- Consulta e gerenciamento de refeições registradas.
- Histórico alimentar com visualização por dia ou semana.
- Cálculo de totais diários, como calorias ou outros nutrientes, se fornecidos.
- Validações básicas para garantir consistência nos dados registrados (ex: horário da refeição, campos obrigatórios).

## Problemas Detectados na Versão Original

### 1. Estrutura de Projeto Inconsistente

- Organização dos arquivos não segue uma estrutura modular por funcionalidades.
- Arquivos como `index`, `user`, `user-register`, entre outros, estão dispersos.

### 2. Acoplamento entre Lógica de Negócio e UI

- Funções com lógica de processamento diretamente nos componentes de tela (ex: manipulação de imagem e dados no `TabOneScreen`).
- Dificulta manutenção, testes e reutilização.

### 3. Nomenclatura Inconsistente

- Uso misto de camelCase, PascalCase e outros estilos.
- Classes, funções e variáveis seguem padrões diferentes, o que compromete a legibilidade.

### 4. Ausência de Validações e Tratamento de Erros

- Falta de validações para entradas do usuário e ausência de tratamento de exceções em funções críticas.
- Pode causar falhas inesperadas na aplicação.

### 5. Mistura de Idiomas no Código

- Uso simultâneo de português e inglês em nomes de arquivos, variáveis e funções.
- Ex: CadastroScreen, LoginPage, createFood, UserRepository.
- Reduz a consistência e dificulta a colaboração em equipe, especialmente em ambientes com desenvolvedores internacionais.

## Estratégia de Refatoração

### 1. Adotar Estrutura Modular por Funcionalidade

- Reorganizar os arquivos em pastas agrupadas por funcionalidades (ex: `features/meal`, `features/user`, `features/food`).
- Separar UI, lógica e dados em camadas diferentes por módulo.

### 2. Separar Lógica de Negócio da Camada de Apresentação

- Criar hooks personalizados e serviços que encapsulam a lógica da aplicação.
- Componentes de tela passam a focar exclusivamente na exibição.

### 3. Padronizar Convenções de Nomenclatura

- Definir padrões consistentes para nomes de arquivos, classes, funções e variáveis.
- Aplicar ferramentas de lint e formatação automática.

### 4. Implementar Validações e Tratamento de Erros

- Adicionar validações com bibliotecas como Yup ou regras manuais.
- Incluir tratamento com `try-catch` em chamadas assíncronas e operacionais sensíveis.

## Interface Fluente (Fluent Interface)

A implementação da Interface Fluente no MyFood foi realizada seguindo o padrão de projeto que permite encadear múltiplas chamadas de métodos de forma expressiva e legível. Esta abordagem foi aplicada principalmente nas seguintes áreas:

### Criação de Refeições
```typescript
const meal = new MealBuilder()
    .withName('Almoço')
    .withIcon('sunrise')
    .withPosition(1)
    .build();
```

### Configuração de Usuário
```typescript
const user = new UserBuilder()
    .withName("João Silva")
    .withEmail("joao@email.com")
    .withPassword('123456')
    .build();
```

A Interface Fluente proporciona:
- Código mais legível e autoexplicativo
- Construção de objetos de forma incremental
- Validações em cada etapa da construção
- Redução de erros de configuração

## Instalação e Execução

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm
- Expo CLI

### Passos para Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Xiristian/MyFood-Refactor.git
cd MyFood-Refactor
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

4. Use o aplicativo Expo Go no seu dispositivo móvel para escanear o QR Code exibido no terminal, ou execute em um emulador.

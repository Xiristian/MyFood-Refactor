# Changelog

## [1.0.0] - 2024

### Refatoração do Código

#### Componentes

- Refatoração do componente principal de refeições (`app/(tabs)/index.tsx`):
  - Separação em componentes menores e reutilizáveis:
    - `MealIcon`: Componente para renderização de ícones de refeições
    - `ExpandedActions`: Componente para ações expandidas de cada refeição
    - `MealItem`: Componente para renderização de cada item de refeição
    - `DateSelector`: Componente para seleção de data
  - Implementação de tipos TypeScript mais rigorosos
  - Criação de interfaces e tipos dedicados

#### Hooks Customizados

- Criação do hook `useMealData`:
  - Gerenciamento centralizado do estado das refeições
  - Lógica de carregamento de dados isolada
  - Manipulação de estado de expansão dos itens
  - Gerenciamento de datas

#### Melhorias de Performance

- Otimização de renderização com componentização
- Redução de re-renderizações desnecessárias
- Melhor gerenciamento de estado com hooks customizados

#### Melhorias de UI/UX

- Refatoração do sistema de navegação:
  - Tipagem forte para parâmetros de navegação
  - Melhor organização das rotas
- Aprimoramento do layout:
  - Estilização mais consistente
  - Melhor organização dos estilos
  - Padronização de cores e espaçamentos
  - Melhorias na responsividade

#### Constantes e Configurações

- Extração de dados estáticos para constantes:
  - `INITIAL_MEALS`: Lista inicial de refeições
  - Mapeamento de ícones em objeto dedicado

#### Boas Práticas

- Implementação de componentes funcionais com TypeScript
- Uso de tipos genéricos para navegação
- Melhor organização de imports
- Remoção de códigos comentados e não utilizados
- Implementação de funções auxiliares reutilizáveis

#### Correções

- Remoção de tipagens ignoradas (@ts-ignore)
- Correção de problemas de layout
- Melhoria na estrutura de componentes
- Otimização de estilos

### Melhorias Técnicas

- Migração completa para componentes funcionais
- Uso extensivo de TypeScript
- Implementação de hooks personalizados
- Melhor organização de código
- Padronização de estilos

### Performance

- Otimização de renderização de componentes
- Melhor gerenciamento de estado
- Redução de complexidade de componentes

### Documentação

- Adição de comentários explicativos
- Melhor organização do código
- Tipagem adequada com TypeScript

### Novas Alterações

#### Migração de Banco de Dados

- Remoção de dependências relacionadas ao TypeORM:
  - Removido "@nestjs/typeorm"
  - Removido "reflect-metadata"
  - Removido "typeorm"
- Adicionado script de migração para gerenciamento do banco de dados
- Implementação do SQLite com expo-sqlite
- Criação de tabelas para usuários, refeições e alimentos

#### Refatoração de Arquitetura

- Implementação de novos serviços:
  - `DatabaseService`: Gerenciamento centralizado do banco de dados
  - `AuthService`: Autenticação e gerenciamento de usuários
  - `MealService`: Manipulação de refeições e alimentos
- Criação do `BaseRepository` com métodos comuns de CRUD
- Remoção de entidades TypeORM:
  - Removido `BaseEntity`
  - Removido `FoodEntity`
  - Removido `MealEntity`
  - Removido `UserEntity`

#### Melhorias nos Componentes

- Adição de tipos para nomes de ícones
- Criação do componente `TabNavigator`
- Refatoração do `CustomTabBarButton`
- Implementação do `ErrorMessage` para exibição de erros
- Atualização do `RenderFoods` para usar View em vez de FlatList
- Melhorias no `RenderFoodItem` com tratamento de erros

#### Constantes e Temas

- Adição de constantes para:
  - Cores do tema
  - Espaçamentos
  - Bordas
  - Tamanhos de ícones
  - Tamanhos de imagens
  - Tamanhos de fonte
- Padronização de estilos usando constantes do tema

#### Formulários e Validações

- Atualização do formulário de registro de usuário:
  - Adicionado campos de peso e objetivo
  - Melhorias nos componentes de input
  - Atualização do processo de registro
- Implementação de hooks personalizados:
  - `useAuthService` para gerenciamento de autenticação
  - `useFoodCreation` para criação de alimentos
  - Hook personalizado para MealService

#### Otimizações de Performance

- Refatoração de queries SQL para melhor desempenho
- Atualização de métodos de repositório para usar SQL nativo
- Remoção de cache de queries desnecessário
- Otimização no carregamento de dados

#### Interface do Usuário

- Melhorias na tela de perfil do usuário
- Atualização do modal de criação de refeições
- Implementação de indicador de carregamento
- Atualização de estilos usando temas consistentes

#### Correções e Ajustes

- Remoção de importação 'reflect-metadata'
- Atualização de dependências do projeto
- Correções em comentários e documentação
- Ajustes em tipos e interfaces

#### Configurações de Desenvolvimento

- Adicionadas novas configurações:
  - `.editorconfig` para padronização de estilo
  - `.eslintignore` para exclusão de arquivos
  - `.eslintrc.js` com regras personalizadas
  - `.prettierrc.js` e `.prettierignore` para formatação
  - Configurações atualizadas no `tsconfig.json`
  - Novo plugin module-resolver no `babel.config.js`

#### Melhorias de Componentes

- Atualização do componente `ImagePicker`:
  - Nova API do ExpoImagePicker
  - Funções refatoradas de pickImage e takePhotoWithCamera
  - Melhorias no layout e aparência
- Implementação de background responsivo
- Melhorias no componente Logo com novas constantes de tema
- Atualização do RenderFoodItem com estilos para calorias
- Novo componente SearchBar com ícone de limpar
- Sidebar atualizado com novas propriedades e estilos

#### Serviços e Hooks

- Implementação do logger para mensagens de sistema
- Novo modo WAL para banco de dados SQLite
- Funções para processamento de imagens de alimentos
- Melhorias no AuthService:
  - Validação de credenciais
  - Gerenciamento de sessão
  - Funções de logout

#### Tipos e Interfaces

- Novas interfaces para:
  - Propriedades de componentes
  - Dados de formulários
  - Validação de resultados
  - Transações de banco de dados
- Tipos atualizados para navegação
- Melhorias nas definições de cores e temas

#### Dependências

- Adicionado suporte para Expo Camera
- Novas dependências de desenvolvimento:
  - eslint-config-prettier
  - eslint-plugin-jest
  - Outras ferramentas de linting e formatação

#### Temas e Estilos

- Novas constantes para:
  - Cores light e dark
  - Ícones de navegação
  - Dimensões de componentes
  - Espaçamentos e bordas
  - Configurações de modal e overlay

#### Banco de Dados

- Atualização nas queries SQL:
  - Remoção do campo imagem da tabela de usuários
  - Otimização das consultas
  - Melhorias no tratamento de transações

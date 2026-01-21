# Project TODO

- [x] Implementação inicial da Home com Header e Grid de Produtos
- [x] Estilização baseada no TikTok Shop (cores, tipografia)
- [x] Geração de imagens de produtos
- [x] Conversão para Full-Stack (web-db-user)
- [x] Resolver conflitos de merge após upgrade
- [x] Implementar funcionalidade de armazenamento de arquivos (S3)
- [x] Criar interface de upload de arquivos
- [x] Integrar upload com backend tRPC
- [x] Testar funcionalidade de upload

- [x] Criar página de detalhes do produto (PDP)
- [x] Implementar galeria de imagens do produto
- [x] Implementar seletor de variantes (cor, tamanho)
- [x] Criar página de checkout
- [x] Implementar resumo do pedido
- [x] Implementar seleção de método de pagamento
- [x] Testar fluxo completo
- [x] Empacotar arquivos ZIP separados

## Painel Administrativo
- [x] Criar página de login admin com credenciais padrão
- [x] Implementar sidebar com todos os módulos
- [x] Criar página Dashboard
- [x] Criar página Análise
- [x] Criar página Vendas
- [x] Criar página Carrinhos Abandonados
- [x] Criar página Cartões
- [x] Criar página Produtos
- [x] Criar página Categorias
- [x] Criar página Order Bumps
- [x] Criar página Brinde
- [x] Criar página Frete
- [x] Criar página Taxas
- [x] Criar página Edições em Massa
- [x] Criar página Pixels & Scripts
- [x] Criar página Banco de Dados
- [x] Criar página Configurações
- [x] Implementar botão Sair

## Persistência de Dados - Banco de Dados
- [x] Criar schema de produtos (products)
- [x] Criar schema de categorias (categories)
- [x] Criar schema de vendas/pedidos (orders, order_items)
- [x] Criar schema de carrinhos abandonados (abandoned_carts)
- [x] Criar schema de configurações da loja (store_settings)
- [x] Criar schema de frete (shipping_rules)
- [x] Criar schema de taxas (fees)
- [x] Criar schema de order bumps (order_bumps)
- [x] Criar schema de brindes (gifts)
- [x] Criar schema de pixels/scripts (tracking_pixels)
- [x] Executar migrations (pnpm db:push)

## Rotas tRPC - Backend
- [x] Criar rotas CRUD para produtos
- [x] Criar rotas CRUD para categorias
- [x] Criar rotas CRUD para vendas
- [x] Criar rotas CRUD para carrinhos abandonados
- [x] Criar rotas CRUD para configurações
- [x] Criar rotas para frete, taxas, order bumps, brindes, pixels

## Frontend Admin - Integração
- [x] Conectar página Produtos ao backend
- [x] Conectar página Categorias ao backend
- [x] Conectar página Vendas ao backend
- [x] Conectar página Carrinhos Abandonados ao backend
- [x] Conectar página Configurações ao backend
- [x] Conectar demais páginas ao backend (Frete, Taxas, Order Bumps, Brindes, Pixels)


## Integrações Finais
- [x] Conectar página Frete ao backend
- [x] Conectar página Taxas ao backend
- [x] Conectar página Order Bumps ao backend
- [x] Conectar página Brindes ao backend
- [x] Conectar página Pixels & Scripts ao backend
- [x] Integrar upload de imagens na página de Produtos
- [x] Criar Dashboard dinâmico com queries reais

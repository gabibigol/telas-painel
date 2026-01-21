# Brainstorming de Design: TikTok Shop Clone

<response>
<text>
<idea>
  **Design Movement**: "Gen Z Hyper-Pop"
  **Core Principles**:
  1. **Imersão Visual**: Imagens grandes, vídeos autoplay, foco total no conteúdo visual.
  2. **Minimalismo Funcional**: Interface limpa que desaparece para deixar o produto brilhar.
  3. **Micro-interações Snappy**: Feedback tátil e rápido em cada clique e hover.
  4. **Mobile-First DNA**: Layout pensado para scroll vertical infinito e toque, mesmo no desktop.

  **Color Philosophy**:
  - **Fundo**: Branco puro (`#FFFFFF`) para clareza máxima.
  - **Acento Primário**: TikTok Red (`#FE2C55`) para CTAs e preços, evocando urgência e paixão.
  - **Acento Secundário**: TikTok Cyan (`#25F4EE`) para detalhes sutis e estados de hover.
  - **Texto**: Preto quase total (`#161823`) para legibilidade e contraste forte.

  **Layout Paradigm**:
  - **Grid Masonry Adaptativo**: Produtos organizados em um grid fluido que se adapta a diferentes proporções de imagem (1:1, 3:4), imitando o feed do TikTok.
  - **Sticky Navigation**: Barra lateral ou superior fixa para acesso rápido a categorias e carrinho.

  **Signature Elements**:
  - **Botões "Pill" Arredondados**: Bordas totalmente arredondadas (full pill shape) para botões e tags.
  - **Badges de Desconto Vibrantes**: Etiquetas de preço e desconto com cores sólidas e tipografia bold.
  - **Ícones Outline Finos**: Ícones SVG minimalistas com traço fino (1.5px ou 2px).

  **Interaction Philosophy**:
  - **Hover Reveal**: Ao passar o mouse no card do produto, mostrar opções rápidas (Add to Cart) ou uma segunda imagem/vídeo.
  - **Infinite Scroll**: Carregamento contínuo de produtos sem paginação explícita.

  **Animation**:
  - **Fade-in Up**: Produtos entram suavemente de baixo para cima ao rolar a página.
  - **Scale on Hover**: Imagens de produtos dão um leve zoom (1.05x) ao passar o mouse.

  **Typography System**:
  - **Fonte Principal**: "Proxima Nova" ou similar (Inter/Roboto como fallback), peso Bold para títulos e Regular para corpo.
  - **Hierarquia**: Títulos de produtos curtos e grossos, preços em destaque máximo.
</idea>
</text>
<probability>0.05</probability>
</response>

<response>
<text>
<idea>
  **Design Movement**: "Social Commerce Clean"
  **Core Principles**:
  1. **Confiança e Clareza**: Foco em avaliações, selos de verificação e informações claras.
  2. **Estrutura Organizada**: Grid rígido e alinhado para facilitar a comparação de produtos.
  3. **Navegação Intuitiva**: Categorias bem definidas e filtros acessíveis.

  **Color Philosophy**:
  - **Fundo**: Cinza muito claro (`#F8F8F8`) para separar o conteúdo do fundo.
  - **Cards**: Branco (`#FFFFFF`) com sombras suaves.
  - **Acento**: Azul Royal (`#0057FF`) para confiança, com toques de Rosa TikTok apenas em promoções.

  **Layout Paradigm**:
  - **Card-Based Grid**: Produtos em cards bem definidos com bordas e sombras.
  - **Sidebar de Filtros**: Coluna lateral fixa para filtragem detalhada.

  **Signature Elements**:
  - **Estrelas de Avaliação Douradas**: Destaque visual para a prova social.
  - **Bordas Sutis**: Divisórias finas entre seções.

  **Interaction Philosophy**:
  - **Quick View Modal**: Modal para ver detalhes sem sair da lista.
  - **Add to Cart Slide-in**: Feedback lateral ao adicionar item.

  **Animation**:
  - **Sutil e Rápida**: Transições de 200ms para interações de botão.

  **Typography System**:
  - **Fonte**: "System UI" (San Francisco/Segoe UI) para familiaridade nativa.
</idea>
</text>
<probability>0.03</probability>
</response>

<response>
<text>
<idea>
  **Design Movement**: "Dark Mode Neon"
  **Core Principles**:
  1. **Cinematic Experience**: Fundo escuro para destacar cores vibrantes dos produtos.
  2. **Alto Contraste**: Texto branco sobre fundo preto/cinza escuro.
  3. **Futurista**: Elementos com brilho e gradientes.

  **Color Philosophy**:
  - **Fundo**: Preto Profundo (`#121212`).
  - **Texto**: Branco (`#FFFFFF`).
  - **Acento**: Gradientes de Rosa e Ciano (`linear-gradient(to right, #FE2C55, #25F4EE)`).

  **Layout Paradigm**:
  - **Immersive Grid**: Imagens ocupando o máximo de espaço possível, com pouco texto sobreposto.

  **Signature Elements**:
  - **Bordas Neon**: Efeitos de brilho ao focar em elementos.
  - **Glassmorphism**: Painéis translúcidos para menus e overlays.

  **Interaction Philosophy**:
  - **Fluid Motion**: Animações mais longas e fluidas.

  **Animation**:
  - **Glow Effects**: Pulsação suave em botões de ação.

  **Typography System**:
  - **Fonte**: "Montserrat" ou "Poppins" para um visual geométrico moderno.
</idea>
</text>
<probability>0.02</probability>
</response>

---

## Decisão de Design Escolhida

**Design Movement**: "Gen Z Hyper-Pop"

**Justificativa**: Este estilo é o que melhor representa a identidade visual atual do TikTok Shop (https://www.tiktok.com/shop/br). O objetivo do usuário é um "clone", portanto, a fidelidade visual ao original (fundo branco, acentos em rosa/ciano, layout clean e focado em imagem) é prioritária. O estilo "Gen Z Hyper-Pop" captura a essência vibrante, rápida e visualmente orientada da plataforma.

**Diretrizes para Implementação**:
- Usar a fonte `Inter` (como substituto próximo e gratuito da TikTok Sans/Proxima Nova).
- Cores exatas: Primary `#FE2C55`, Secondary `#25F4EE`, Background `#FFFFFF`, Text `#161823`.
- Layout responsivo com grid de produtos adaptável.
- Foco em cards de produtos com imagem, título truncado, preço em destaque e badge de desconto.

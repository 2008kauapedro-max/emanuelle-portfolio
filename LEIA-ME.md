# Emanuelle Costa — Imagem & Movimento

Portfólio web estático, editorial, minimalista e responsivo. Desenvolvido a partir das fotografias e do conteúdo enviados por Emanuelle.

## Começar (no VS Code)

1. Extraia o ZIP.
2. Abra a pasta **emanuelle-portfolio** no VS Code (`Arquivo > Abrir Pasta`).
3. Abra `index.html` com a extensão **Live Server** (opção *Open with Live Server*). Também funciona abrindo `index.html` diretamente no navegador.
4. Navegue entre seções, clique nas imagens, teste a galeria e os botões do carrossel.

Não exige instalação de pacotes, Node.js nem contas externas. HTML, CSS e JavaScript estão em arquivos separados.

## Estrutura

```text
emanuelle-portfolio/
├── index.html                 # conteúdo, navegação, seções e contato
├── css/
│   └── styles.css            # cores, fontes, layouts, animações e mobile
├── js/
│   └── main.js               # menus, galerias, vídeos, carrossel, scroll
├── assets/
│   ├── favicon.svg
│   ├── images/               # imagens otimizadas extraídas do PDF original
│   └── videos/               # vídeos leves de demonstração
├── LEIA-ME.md
└── NOTAS-DO-PROJETO.md
```

## Personalizar o conteúdo

- **Trocar textos e seções:** edite `index.html`.
- **Trocar cores:** ajuste as variáveis `:root` no começo de `css/styles.css`.
- **Adicionar um ensaio à galeria existente:** em `js/main.js`, procure `const PROJECTS`, adicione os caminhos das fotos ao array `photos` correspondente.
- **Criar novo projeto:** adicione um item a `PROJECTS`, crie um botão HTML com `data-project="nome-do-projeto"` e imagens dentro de `assets/images`.
- **Substituir retrato de capa:** troque `assets/images/emanuel-hero.webp` por outra foto com o mesmo nome. É recomendável exportar como `.webp`.
- **Alterar número do WhatsApp:** pesquise `wa.me/5561982003437` em `index.html` e substitua pelo número correto com DDI (`55`), DDD e número. Confirme com Emanuelle antes de publicar.

## Importante: vídeos da seção 'Em movimento'

**Os quatro vídeos atuais são PRÉVIAS CONCEITUAIS** feitas para demonstrar o site. Foram criados com movimentos discretos em fotos presentes no PDF original. **Não são trabalhos de edição audiovisual atribuídos à Emanuelle.** O site também os identifica como prévias.

Para incluir vídeos reais:

1. Peça a ela vídeos verticais `.mp4` (ideal: **1080×1920, H.264**, compactados para a web; `720×1280` também funciona).
2. Substitua os arquivos:
   - `assets/videos/preview-maternidade.mp4`
   - `assets/videos/preview-infancia.mp4`
   - `assets/videos/preview-natureza.mp4`
   - `assets/videos/preview-olhar.mp4`
3. No `index.html`, troque o texto **PRÉVIA CONCEITUAL** por uma descrição correta dos trabalhos e ajuste os nomes dos vídeos e projetos; atualize os `poster` se quiser outras capas.
4. Remova ou substitua a nota explicativa abaixo do carrossel quando houver somente vídeos de verdade.

Os vídeos são carregados sob demanda (`preload="none"`). Apenas uma prévia por vez toca automaticamente, silenciada, quando a seção está visível. Os demais ficam pausados para poupar processamento. Quem preferir movimento reduzido não recebe reprodução automática.

## Animações e desempenho

- Revelação dos blocos via `IntersectionObserver` (não acompanha cada pixel de rolagem).
- Barra de progresso com `transform`, sem alterar layout.
- Carrossel nativo com `scroll-snap` para deslizar com toque ou mouse.
- Imagens `.webp` compactadas e carregamento preguiçoso nas seções abaixo da capa.
- Sem frameworks e sem bibliotecas de animação pesadas.
- Respeita a preferência do sistema `prefers-reduced-motion`.
- Fonte do Google Fonts quando há conexão; sem rede, o navegador usa fontes alternativas.

## Publicar na Vercel

1. Crie um repositório GitHub com **o conteúdo desta pasta**.
2. Na Vercel, importe esse repositório.
3. Selecione framework **Other**. Como é um site estático, não precisa de comando de build.
4. Publique. O arquivo principal é `index.html`.

Também funciona em hospedagens estáticas equivalentes.

## Antes de publicar para ela

- Confirmar a grafia do nome, os textos biográficos e a aprovação de cada foto.
- Confirmar o número do WhatsApp.
- Substituir as prévias ilustrativas por vídeos verdadeiros, assim que ela enviar.
- Opcional: incluir domínio personalizado e redes sociais verificadas.
- Se houver uso das fotos em contexto comercial, confirmar a autorização das pessoas fotografadas, especialmente crianças.

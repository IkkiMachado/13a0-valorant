# 🏆 13a0 · Road to Champions (Valorant VCT)

Um jogo interativo de estratégia e simulação de esports inspirado em sucessos como **7a0** (Copas do Mundo), **Road to Major** (Counter-Strike) e elementos roguelike de **Balatro**, ambientado no cenário competitivo do **Valorant Champions Tour (VCT)**.

![Valorant VCT](https://img.shields.io/badge/VALORANT-VCT_Simulator-ff4655?style=for-the-badge&logo=riotgames)
![React](https://img.shields.io/badge/React_18-TypeScript-61dafb?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38bdf8?style=for-the-badge&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-646cff?style=for-the-badge&logo=vite)

---

## 🎮 Modos de Jogo

### 1. 🏆 Modo 13 a 0 Clássico
O desafio purista:
* Role o dado para sortear 3 equipes clássicas do VCT (LOUD 2022, Fnatic 2023, Sentinels, Paper Rex, EG 2023, EDG 2024, etc.).
* Monte sua line-up sem ajuda de créditos, perks ou trocas após o draft.
* Enfrente a fase de grupos GSL e os playoffs do Champions até a taça mundial.
* Alcance o mítico **13 a 0 Flawless**!

### 2. ⚡ Modo Manager & Roguelike
Experiência tática aprofundada com economia inspirada em Balatro:
* **Economia VCT Credits**: Ganhe créditos a cada vitória, rounds ganhos e bônus por 13x0.
* **Loja de Perks Táticos**: 12 perks com raridades (*Econômico, Pró-Mira, Anti-Eco, Retake Perfeito, Mestre do Pistol, etc.*).
* **Mercado de Transferências (Scouting)**: Contrate novos pro players entre as fases do torneio para corrigir fraquezas.
* **Bootcamp de Treino**: Invista créditos para aprimorar os atributos de mira e tática dos seus atletas (+1 OVR permanente).

### 3. 📅 Desafio do Dia (Daily Seed)
* Desafio gerado diariamente com line-up fixa e regras temáticas.
* Compare sua pontuação e tente zerar o Champions com o elenco do dia.

---

## 🎯 Regras de Montagem e Funções VCT

Toda line-up deve cumprir as funções obrigatórias do meta competitivo de Valorant:
* 🔴 **Duelista:** Entry fragger, First Bloods e poder de abate (*ex: Aspas, Derke, yay, ZmjjKK, TenZ*).
* 🔵 **Iniciador:** Coleta de informação, flashes e desarticulação defensiva (*ex: Sacy, Leo, Ethan, Chronicle*).
* 🟣 **Controlador:** Smokes, bloqueio de linhas de visão e suporte (*ex: pANcada, Marved, Boaster, MaKo*).
* 🟢 **Sentinela:** Retenção de bomb, armadilhas e anti-flanco (*ex: Less, Alfajer, suygetsu, CHICHOO*).
* ⭐ **IGL (In-Game Leader):** Capitão tático (*ex: Saadhak, Boaster, FNS, Boostio, johnqt*). Ter um IGL ativo concede **+5% de bônus tático** na equipe; a ausência de um IGL acarreta **-8% de penalidade de desorganização**.
* 🚫 **Regra de Unicidade**: O mesmo pro player não pode ser escalado duas vezes no time, mesmo que presente em elencos de anos diferentes.

---

## 🧠 Motor de Simulação Fidedigno

* **Resolução Estrita Round a Round**:
  * Simulação exata: a cada round, o time perdedor sofre no máximo 5 eliminações, e o total de abates do round corresponde com precisão às mortes da equipe derrotada.
  * Estatísticas realistas de KDA por round (sem duplicidades ou mortes fantasmas).
* **Ciclo Econômico Oficial VCT**:
  * Pistols nos rounds 1 e 13.
  * Rodadas Eco, Force-buy, Bônus pós-pistol e Full Buy.
* **Momentos Decisivos**:
  * Killfeed dinâmico com armas e headshots.
  * Clutches 1v1, 1v2, 1v3, Aces e Overtime (12x12 com vantagem de 2 rounds).
  * Selo visual e premiação especial para vitórias por 13 a 0.

---

## 🏅 Conquistas & Hall da Fama

* **16 Conquistas Exclusivas** categorizadas por raridade (*Comum, Rara, Épica e Lendária*), cobrindo feitos como *13-0 Flawless*, *Campeão Invencível*, *Ace Machine*, *Mão de Vaca*, *Tático Perfeito* e *Overtime Hero*.
* **Hall da Fama**: Galeria permanente comemorando todos os elencos que ergueram o troféu do Champions, exibindo as fotos oficiais dos campeões.

---

## 🛠️ Stack Tecnológica

* **Frontend:** [React 18](https://react.dev/) com [TypeScript](https://www.typescriptlang.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
* **Ícones:** [Lucide React](https://lucide.dev/)
* **Animações / Efeitos:** Canvas Confetti, CSS Keyframe Glows e Sound Synthesizer Web Audio API
* **Imagens:** Integração com fotos de pro players de sites oficiais e agentes do Valorant (API oficial)

---

## 🚀 Como Executar Localmente

### Pré-requisitos
* Node.js 18+ instalado
* npm ou yarn

### Instalação e Execução

```bash
# 1. Clone o repositório
git clone https://github.com/IkkiMachado/13a0-valorant.git

# 2. Acesse a pasta do projeto
cd 13a0-valorant

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Abra no navegador em: `http://localhost:5173`

Para gerar a build de produção:
```bash
npm run build
```

---

## 📜 Licença

Desenvolvido para fãs de esports e da comunidade competitiva de Valorant.
Este projeto é não-oficial e sem fins lucrativos, feito para fins educacionais e de entretenimento comunitário. Valorant e VCT são marcas registradas da Riot Games.

import { useState, useEffect, useCallback, useRef } from "react";

// ═══════════════════════════════════════════════════════════
// TRANSLATIONS
// ═══════════════════════════════════════════════════════════
const LANGS = {
  en: { appName:"chess.app", playBot:"vs Bots", playLocal:"Local 2P", playOnline:"Online", puzzles:"Puzzles", yourElo:"Your Rating", selectBot:"Choose your opponent", selectTheme:"Board Theme", createRoom:"Create Room", joinRoom:"Join Room", roomCode:"Room code...", back:"← Back", turn_w:"White to move", turn_b:"Black to move", check:"Check!", checkmate_w:"Checkmate! Black wins 🎉", checkmate_b:"Checkmate! White wins 🎉", stalemate:"Stalemate — Draw 🤝", promote:"Promote pawn", puzzleSolve:"Find the best move!", puzzleCorrect:"✓ Correct!", puzzleWrong:"✗ Try again", puzzleNext:"Next Puzzle", shareCode:"Share code with friend", syncing:"Syncing every 1.5s", newGame:"New Game", resign:"Resign", puzzles_title:"Daily Puzzles", solved:"Solved", theme_classic:"Classic", theme_ocean:"Ocean", theme_forest:"Forest", theme_midnight:"Midnight", theme_rose:"Rose Gold", theme_marble:"Marble" },
  fr: { appName:"chess.app", playBot:"vs Bots", playLocal:"2 Joueurs", playOnline:"En ligne", puzzles:"Puzzles", yourElo:"Votre classement", selectBot:"Choisir un adversaire", selectTheme:"Thème du plateau", createRoom:"Créer un salon", joinRoom:"Rejoindre", roomCode:"Code du salon...", back:"← Retour", turn_w:"Blancs jouent", turn_b:"Noirs jouent", check:"Échec !", checkmate_w:"Échec et mat ! Les Noirs gagnent 🎉", checkmate_b:"Échec et mat ! Les Blancs gagnent 🎉", stalemate:"Pat — Nulle 🤝", promote:"Promotion du pion", puzzleSolve:"Trouvez le meilleur coup !", puzzleCorrect:"✓ Correct !", puzzleWrong:"✗ Réessayez", puzzleNext:"Puzzle suivant", shareCode:"Partagez le code avec votre ami", syncing:"Sync toutes les 1.5s", newGame:"Nouvelle partie", resign:"Abandonner", puzzles_title:"Puzzles du jour", solved:"Résolus", theme_classic:"Classique", theme_ocean:"Océan", theme_forest:"Forêt", theme_midnight:"Minuit", theme_rose:"Or Rose", theme_marble:"Marbre" },
  es: { appName:"chess.app", playBot:"vs Bots", playLocal:"2 Jugadores", playOnline:"En línea", puzzles:"Puzzles", yourElo:"Tu puntuación", selectBot:"Elige tu adversario", selectTheme:"Tema del tablero", createRoom:"Crear sala", joinRoom:"Unirse", roomCode:"Código de sala...", back:"← Volver", turn_w:"Turno blancas", turn_b:"Turno negras", check:"¡Jaque!", checkmate_w:"¡Jaque mate! Ganan negras 🎉", checkmate_b:"¡Jaque mate! Ganan blancas 🎉", stalemate:"Tablas 🤝", promote:"Promoción de peón", puzzleSolve:"¡Encuentra el mejor movimiento!", puzzleCorrect:"✓ ¡Correcto!", puzzleWrong:"✗ Inténtalo de nuevo", puzzleNext:"Siguiente puzzle", shareCode:"Comparte el código con tu amigo", syncing:"Sync cada 1.5s", newGame:"Nueva partida", resign:"Abandonar", puzzles_title:"Puzzles del día", solved:"Resueltos", theme_classic:"Clásico", theme_ocean:"Océano", theme_forest:"Bosque", theme_midnight:"Medianoche", theme_rose:"Oro Rosa", theme_marble:"Mármol" },
  de: { appName:"chess.app", playBot:"vs Bots", playLocal:"2 Spieler", playOnline:"Online", puzzles:"Puzzles", yourElo:"Deine Wertung", selectBot:"Gegner wählen", selectTheme:"Brett-Design", createRoom:"Raum erstellen", joinRoom:"Beitreten", roomCode:"Raumcode...", back:"← Zurück", turn_w:"Weiß am Zug", turn_b:"Schwarz am Zug", check:"Schach!", checkmate_w:"Schachmatt! Schwarz gewinnt 🎉", checkmate_b:"Schachmatt! Weiß gewinnt 🎉", stalemate:"Patt — Remis 🤝", promote:"Bauernumwandlung", puzzleSolve:"Finde den besten Zug!", puzzleCorrect:"✓ Richtig!", puzzleWrong:"✗ Nochmal versuchen", puzzleNext:"Nächstes Puzzle", shareCode:"Code mit Freund teilen", syncing:"Sync alle 1.5s", newGame:"Neues Spiel", resign:"Aufgeben", puzzles_title:"Tages-Puzzles", solved:"Gelöst", theme_classic:"Klassisch", theme_ocean:"Ozean", theme_forest:"Wald", theme_midnight:"Mitternacht", theme_rose:"Rosengold", theme_marble:"Marmor" },
  pt: { appName:"chess.app", playBot:"vs Bots", playLocal:"2 Jogadores", playOnline:"Online", puzzles:"Puzzles", yourElo:"Sua pontuação", selectBot:"Escolha seu adversário", selectTheme:"Tema do tabuleiro", createRoom:"Criar sala", joinRoom:"Entrar", roomCode:"Código da sala...", back:"← Voltar", turn_w:"Brancas jogam", turn_b:"Pretas jogam", check:"Xeque!", checkmate_w:"Xeque-mate! Pretas vencem 🎉", checkmate_b:"Xeque-mate! Brancas vencem 🎉", stalemate:"Empate 🤝", promote:"Promover peão", puzzleSolve:"Encontre o melhor lance!", puzzleCorrect:"✓ Correto!", puzzleWrong:"✗ Tente novamente", puzzleNext:"Próximo puzzle", shareCode:"Compartilhe o código com seu amigo", syncing:"Sync a cada 1.5s", newGame:"Nova partida", resign:"Abandonar", puzzles_title:"Puzzles do dia", solved:"Resolvidos", theme_classic:"Clásico", theme_ocean:"Oceano", theme_forest:"Floresta", theme_midnight:"Meia-noite", theme_rose:"Ouro Rosa", theme_marble:"Mármore" },
};

// ═══════════════════════════════════════════════════════════
// BOARD THEMES
// ═══════════════════════════════════════════════════════════
const THEMES = {
  classic:  { light:"#f0d9b5", dark:"#b58863", border:"#8b6914", bg:"#161008", accent:"#c8a050", name:"theme_classic" },
  ocean:    { light:"#cde8f0", dark:"#3a7a92", border:"#1a5060", bg:"#080f18", accent:"#4ab8d8", name:"theme_ocean" },
  forest:   { light:"#dff0c8", dark:"#4a7030", border:"#2a4818", bg:"#080e04", accent:"#70b030", name:"theme_forest" },
  midnight: { light:"#b8c4e0", dark:"#354068", border:"#1a2040", bg:"#040610", accent:"#7080d0", name:"theme_midnight" },
  rose:     { light:"#fad8d8", dark:"#b05060", border:"#803040", bg:"#150608", accent:"#d87080", name:"theme_rose" },
  marble:   { light:"#f2f2ee", dark:"#888888", border:"#505050", bg:"#101010", accent:"#c0c0b8", name:"theme_marble" },
};

// Piece sets
const PIECE_SETS = {
  classic: { wK:"♔", wQ:"♕", wR:"♖", wB:"♗", wN:"♘", wP:"♙", bK:"♚", bQ:"♛", bR:"♜", bB:"♝", bN:"♞", bP:"♟" },
  letters: { wK:"K", wQ:"Q", wR:"R", wB:"B", wN:"N", wP:"P", bK:"k", bQ:"q", bR:"r", bB:"b", bN:"n", bP:"p" },
  emoji:   { wK:"🤴", wQ:"👸", wR:"🏰", wB:"⛪", wN:"🐴", wP:"⚔️", bK:"🤴", bQ:"👸", bR:"🏰", bB:"⛪", bN:"🐴", bP:"⚔️" },
};
const PIECES_DEFAULT = PIECE_SETS.classic;

// Time controls
const TIME_CONTROLS = [
  { label:"1 min",    base:60,    inc:0  },
  { label:"2 min",    base:120,   inc:0  },
  { label:"3 min",    base:180,   inc:0  },
  { label:"3+2",      base:180,   inc:2  },
  { label:"5 min",    base:300,   inc:0  },
  { label:"5+3",      base:300,   inc:3  },
  { label:"10 min",   base:600,   inc:0  },
  { label:"10+5",     base:600,   inc:5  },
  { label:"15+10",    base:900,   inc:10 },
  { label:"30 min",   base:1800,  inc:0  },
  { label:"1 heure",  base:3600,  inc:0  },
  { label:"1 jour",   base:86400, inc:0  },
  { label:"Sans",     base:0,     inc:0  },
];

// ═══════════════════════════════════════════════════════════
// BOTS CONFIG
// ═══════════════════════════════════════════════════════════
const BOTS = [
  { id:"pawn",    elo:200,  depth:1, name:"Pawn Bot",    emoji:"♟",  random:0.95 },
  { id:"squire",  elo:400,  depth:1, name:"Squire",      emoji:"♞",  random:0.7  },
  { id:"knight",  elo:600,  depth:2, name:"Knight Bot",  emoji:"♘",  random:0.4  },
  { id:"bishop",  elo:800,  depth:2, name:"Bishop Bot",  emoji:"♗",  random:0.15 },
  { id:"rook",    elo:1000, depth:3, name:"Rook Bot",    emoji:"♖",  random:0.05 },
  { id:"queen",   elo:1200, depth:3, name:"Queen Bot",   emoji:"♕",  random:0    },
  { id:"king",    elo:1500, depth:4, name:"King Bot",    emoji:"♔",  random:0    },
  { id:"gm",      elo:2000, depth:4, name:"GrandMaster", emoji:"👑", random:0    },
  { id:"super",   elo:2300, depth:5, name:"Super GM",    emoji:"🔥", random:0    },
  { id:"legend",  elo:2500, depth:5, name:"Legend",      emoji:"⚡", random:0    },
  { id:"titan",   elo:3000, depth:6, name:"Titan",       emoji:"🌩", random:0    },
  { id:"nemesis", elo:3250, depth:6, name:"Nemesis",     emoji:"💀", random:0    },
  { id:"demon",   elo:3500, depth:7, name:"Demon",       emoji:"😈", random:0    },
  { id:"god",     elo:4000, depth:8, name:"God Mode",    emoji:"🌌", random:0    },
];
const BOT_DESCS = {
  pawn:    {en:"Random moves",           fr:"Coups aléatoires",          es:"Movimientos aleatorios",    de:"Zufallszüge",               pt:"Movimentos aleatórios"},
  squire:  {en:"Very easy",              fr:"Très facile",               es:"Muy fácil",                 de:"Sehr leicht",               pt:"Muito fácil"},
  knight:  {en:"Beginner",               fr:"Débutant",                  es:"Principiante",              de:"Anfänger",                  pt:"Iniciante"},
  bishop:  {en:"Casual player",          fr:"Joueur casual",             es:"Jugador casual",            de:"Gelegenheitsspieler",       pt:"Jogador casual"},
  rook:    {en:"Intermediate",           fr:"Intermédiaire",             es:"Intermedio",                de:"Fortgeschritten",           pt:"Intermediário"},
  queen:   {en:"Advanced",               fr:"Avancé",                    es:"Avanzado",                  de:"Fortgeschritten+",          pt:"Avançado"},
  king:    {en:"Expert",                 fr:"Expert",                    es:"Experto",                   de:"Experte",                   pt:"Especialista"},
  gm:      {en:"Grand Master level",     fr:"Niveau Grand Maître",       es:"Nivel Gran Maestro",        de:"Großmeister-Niveau",        pt:"Nível Grão-Mestre"},
  super:   {en:"Super GM · Ruthless",    fr:"Super GM · Impitoyable",    es:"Super GM · Despiadado",     de:"Super GM · Gnadenlos",      pt:"Super GM · Implacável"},
  legend:  {en:"World-class · No mercy", fr:"Niveau mondial · Sans pitié",es:"Clase mundial · Sin piedad",de:"Weltklasse · Kein Erbarmen",pt:"Classe mundial · Sem piedade"},
  titan:   {en:"Titan · Crushing force", fr:"Titan · Force écrasante",   es:"Titán · Fuerza aplastante", de:"Titan · Zermalmende Kraft", pt:"Titã · Força esmagadora"},
  nemesis: {en:"Nemesis · Your doom",    fr:"Némésis · Ta fin",          es:"Némesis · Tu perdición",    de:"Nemesis · Dein Untergang",  pt:"Nemesis · Seu fim"},
  demon:   {en:"Demon · Pure evil",      fr:"Démon · Mal absolu",        es:"Demonio · Mal puro",        de:"Dämon · Reines Böse",       pt:"Demônio · Mal puro"},
  god:     {en:"God Mode · Unbeatable",  fr:"Mode Dieu · Imbattable",    es:"Modo Dios · Imbatible",     de:"Gott-Modus · Unschlagbar",  pt:"Modo Deus · Imbatível"},
};

// ═══════════════════════════════════════════════════════════
// PUZZLES
// ═══════════════════════════════════════════════════════════
const PUZZLES = [
  {
    id:1, elo:700,
    desc:{en:"Checkmate in 1!", fr:"Mat en 1 !", es:"¡Mate en 1!", de:"Matt in 1!", pt:"Mate em 1!"},
    board:[
      [null,null,null,null,"bK",null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,"wP","wP","wP"],
      [null,null,null,null,"wK","wR",null,null],
    ],
    turn:"w", solution:[[7,5],[0,5]],
  },
  {
    id:2, elo:750,
    desc:{en:"Queen delivers mate!", fr:"La dame donne mat !", es:"¡La dama da mate!", de:"Dame gibt Matt!", pt:"Dama dá mate!"},
    board:[
      [null,null,null,null,null,null,"bK",null],
      [null,null,null,null,null,null,"bP","bP"],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,"wK",null,null,"wQ"],
    ],
    turn:"w", solution:[[7,7],[1,7]],
  },
  {
    id:3, elo:800,
    desc:{en:"Rook to the rescue!", fr:"La tour à la rescousse !", es:"¡La torre al rescate!", de:"Turm zur Rettung!", pt:"A torre ao resgate!"},
    board:[
      [null,null,null,null,null,null,"bK",null],
      [null,null,null,null,null,"bP","bP",null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,"wK","wR",null,null],
    ],
    turn:"w", solution:[[7,5],[0,5]],
  },
  {
    id:4, elo:850,
    desc:{en:"Knight fork!", fr:"Fourchette du cavalier !", es:"¡Horquilla de caballo!", de:"Springer-Gabel!", pt:"Garfo do cavalo!"},
    board:[
      [null,null,null,null,"bK",null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,"bQ",null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,"wN",null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,"wK",null,null,null],
    ],
    turn:"w", solution:[[5,2],[3,4]],
  },
  {
    id:5, elo:900,
    desc:{en:"Win the queen!", fr:"Gagnez la dame !", es:"¡Gana la dama!", de:"Dame gewinnen!", pt:"Ganhe a dama!"},
    board:[
      [null,"bK",null,null,null,null,null,null],
      [null,"bQ",null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,"wK",null,"wR",null],
    ],
    turn:"w", solution:[[7,6],[1,6]],
  },
  {
    id:6, elo:950,
    desc:{en:"Bishop checkmate!", fr:"Mat du fou !", es:"¡Mate del alfil!", de:"Läufer-Matt!", pt:"Mate do bispo!"},
    board:[
      [null,null,null,null,null,null,"bK",null],
      [null,null,null,null,null,null,"bP","bP"],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,"wB"],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,"wK",null,null,"wQ"],
    ],
    turn:"w", solution:[[7,7],[1,7]],
  },
  {
    id:7, elo:1000,
    desc:{en:"Back rank mate!", fr:"Mat sur la dernière rangée !", es:"¡Mate en la primera fila!", de:"Grundreihen-Matt!", pt:"Mate na última fileira!"},
    board:[
      [null,null,null,null,null,"bR","bK",null],
      [null,null,null,null,null,"bP","bP","bP"],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,"wP","wP","wP"],
      [null,null,null,null,null,"wR","wK",null],
    ],
    turn:"w", solution:[[7,5],[0,5]],
  },
  {
    id:8, elo:1050,
    desc:{en:"Pin and win!", fr:"Clouez et gagnez !", es:"¡Clavada y ganar!", de:"Fesseln und gewinnen!", pt:"Prender e ganhar!"},
    board:[
      [null,null,null,null,"bK",null,null,null],
      [null,null,null,null,"bR",null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,"wK","wR",null,null],
    ],
    turn:"w", solution:[[7,5],[1,5]],
  },
  {
    id:9, elo:1100,
    desc:{en:"Smothered mate!", fr:"Mat à l'étouffée !", es:"¡Mate del ahogado!", de:"Ersticktes Matt!", pt:"Mate sufocado!"},
    board:[
      [null,null,null,null,null,null,"bK",null],
      [null,null,null,null,null,null,"bP","bP"],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,"wN"],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,"wK",null],
    ],
    turn:"w", solution:[[3,7],[1,6]],
  },
  {
    id:10, elo:1150,
    desc:{en:"Double attack!", fr:"Double attaque !", es:"¡Doble ataque!", de:"Doppelangriff!", pt:"Ataque duplo!"},
    board:[
      [null,null,null,"bK",null,null,null,null],
      [null,null,null,"bP",null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,"wN",null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,"wK",null,null,null,"wR"],
    ],
    turn:"w", solution:[[5,5],[3,4]],
  },
  {
    id:11, elo:1200,
    desc:{en:"Discovered attack!", fr:"Attaque à la découverte !", es:"¡Ataque descubierto!", de:"Entdeckungsangriff!", pt:"Ataque descoberto!"},
    board:[
      [null,null,null,null,"bK",null,null,null],
      [null,null,null,null,"bP",null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,"wB",null,null,null],
      [null,null,null,null,null,"wN",null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,"wK",null,null,null],
    ],
    turn:"w", solution:[[5,5],[3,4]],
  },
  {
    id:12, elo:1250,
    desc:{en:"Queen sacrifice!", fr:"Sacrifice de dame !", es:"¡Sacrificio de dama!", de:"Damensacrifiz!", pt:"Sacrifício de dama!"},
    board:[
      [null,null,null,null,null,"bR","bK",null],
      [null,null,null,null,null,"bP",null,"bP"],
      [null,null,null,null,null,null,"bP",null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,"wP","wP","wP"],
      [null,null,null,null,null,"wR","wK","wQ"],
    ],
    turn:"w", solution:[[7,7],[0,7]],
  },
  {
    id:13, elo:1300,
    desc:{en:"Skewer the king!", fr:"Enfilez le roi !", es:"¡Ensartar al rey!", de:"König aufspießen!", pt:"Espete o rei!"},
    board:[
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,"bK",null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,"wK",null,null,"wB"],
    ],
    turn:"w", solution:[[7,7],[1,1]],
  },
  {
    id:14, elo:1350,
    desc:{en:"Two rooks attack!", fr:"Attaque des deux tours !", es:"¡Ataque de dos torres!", de:"Zwei-Türme-Angriff!", pt:"Ataque das duas torres!"},
    board:[
      [null,null,null,null,null,null,"bK",null],
      [null,null,null,null,null,null,"bP","bP"],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,"wP","wP"],
      [null,null,null,null,"wK","wR",null,"wR"],
    ],
    turn:"w", solution:[[7,5],[0,5]],
  },
  {
    id:15, elo:1400,
    desc:{en:"Zugzwang!", fr:"Zugzwang !", es:"¡Zugzwang!", de:"Zugzwang!", pt:"Zugzwang!"},
    board:[
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,"bK",null],
      [null,null,null,null,null,null,"bP",null],
      [null,null,null,null,null,null,"wP",null],
      [null,null,null,null,null,null,"wK",null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
    ],
    turn:"w", solution:[[5,6],[4,6]],
  },
  {
    id:16, elo:1450,
    desc:{en:"Diagonal mate!", fr:"Mat en diagonale !", es:"¡Mate diagonal!", de:"Diagonales Matt!", pt:"Mate diagonal!"},
    board:[
      [null,null,null,null,null,null,"bK",null],
      [null,null,null,null,null,null,"bP","bP"],
      [null,null,null,null,null,"bP",null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,"wB"],
      [null,null,null,null,null,null,null,null],
      [null,null,null,"wQ",null,null,"wK",null],
    ],
    turn:"w", solution:[[7,3],[3,7]],
  },
  {
    id:17, elo:1500,
    desc:{en:"Knight to the corner!", fr:"Cavalier au coin !", es:"¡Caballo a la esquina!", de:"Springer in die Ecke!", pt:"Cavalo ao canto!"},
    board:[
      [null,null,null,null,null,null,"bK",null],
      [null,null,null,null,null,null,"bP",null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,"wN",null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,"wK",null,null,null],
    ],
    turn:"w", solution:[[3,5],[1,7]],
  },
  {
    id:18, elo:1550,
    desc:{en:"Rook + bishop battery!", fr:"Batterie tour + fou !", es:"¡Batería torre + alfil!", de:"Turm + Läufer Batterie!", pt:"Bateria torre + bispo!"},
    board:[
      [null,null,null,null,null,null,"bK",null],
      [null,null,null,null,null,"bP","bP","bP"],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,"wB"],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,"wK",null,null,"wR"],
    ],
    turn:"w", solution:[[7,7],[0,7]],
  },
  {
    id:19, elo:1600,
    desc:{en:"Promotion wins!", fr:"La promotion gagne !", es:"¡La promoción gana!", de:"Umwandlung gewinnt!", pt:"A promoção vence!"},
    board:[
      [null,null,null,null,"bK",null,null,null],
      [null,null,null,null,null,null,"wP",null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,"wK",null,null,null],
    ],
    turn:"w", solution:[[1,6],[0,6]],
  },
  {
    id:20, elo:1700,
    desc:{en:"Windmill!", fr:"Moulin !", es:"¡Molino!", de:"Windmühle!", pt:"Moinho!"},
    board:[
      [null,null,null,null,null,null,"bK",null],
      [null,null,null,null,null,"bP","bP",null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,"wK","wR",null,null],
    ],
    turn:"w", solution:[[7,5],[0,5]],
  },
];

// ═══════════════════════════════════════════════════════════
// CHESS LOGIC
// ═══════════════════════════════════════════════════════════
function initBoard(){
  const b=Array(8).fill(null).map(()=>Array(8).fill(null));
  ["R","N","B","Q","K","B","N","R"].forEach((p,i)=>{b[0][i]="b"+p;b[7][i]="w"+p;});
  for(let i=0;i<8;i++){b[1][i]="bP";b[6][i]="wP";}
  return b;
}
const cl=(p)=>p?p[0]:null;
function pawnMoves(b,r,c,ep){
  const p=b[r][c],col=cl(p),dir=col==="w"?-1:1,mv=[];
  const nr=r+dir;
  if(nr>=0&&nr<8&&!b[nr][c]){mv.push([nr,c]);if(r===(col==="w"?6:1)&&!b[r+2*dir][c])mv.push([r+2*dir,c]);}
  [[dir,-1],[dir,1]].forEach(([dr,dc])=>{
    const nr2=r+dr,nc=c+dc;
    if(nr2>=0&&nr2<8&&nc>=0&&nc<8){
      if(b[nr2][nc]&&cl(b[nr2][nc])!==col)mv.push([nr2,nc]);
      if(ep&&ep[0]===nr2&&ep[1]===nc)mv.push([nr2,nc]);
    }
  });
  return mv;
}
function slideMoves(b,r,c,dirs){
  const p=b[r][c],mv=[];
  dirs.forEach(([dr,dc])=>{
    let nr=r+dr,nc=c+dc;
    while(nr>=0&&nr<8&&nc>=0&&nc<8){
      if(!b[nr][nc])mv.push([nr,nc]);
      else{if(cl(b[nr][nc])!==cl(p))mv.push([nr,nc]);break;}
      nr+=dr;nc+=dc;
    }
  });
  return mv;
}
function knightMoves(b,r,c){
  const p=b[r][c],mv=[];
  [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc])=>{
    const nr=r+dr,nc=c+dc;
    if(nr>=0&&nr<8&&nc>=0&&nc<8&&cl(b[nr][nc])!==cl(p))mv.push([nr,nc]);
  });
  return mv;
}
function kingMoves(b,r,c,cr){
  const p=b[r][c],col=cl(p),mv=[];
  for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
    if(!dr&&!dc)continue;
    const nr=r+dr,nc=c+dc;
    if(nr>=0&&nr<8&&nc>=0&&nc<8&&cl(b[nr][nc])!==cl(p))mv.push([nr,nc]);
  }
  // Castling
  if(cr){
    const row=col==="w"?7:0;
    if(r===row&&c===4){
      // Kingside: squares f,g must be empty, not in check
      if(cr[col+"K"]&&b[row][5]===null&&b[row][6]===null&&b[row][7]===col+"R"
        &&!isAttacked(b,row,4,col==="w"?"b":"w")
        &&!isAttacked(b,row,5,col==="w"?"b":"w")
        &&!isAttacked(b,row,6,col==="w"?"b":"w"))
        mv.push([row,6]);
      // Queenside: squares b,c,d must be empty, not in check
      if(cr[col+"Q"]&&b[row][3]===null&&b[row][2]===null&&b[row][1]===null&&b[row][0]===col+"R"
        &&!isAttacked(b,row,4,col==="w"?"b":"w")
        &&!isAttacked(b,row,3,col==="w"?"b":"w")
        &&!isAttacked(b,row,2,col==="w"?"b":"w"))
        mv.push([row,2]);
    }
  }
  return mv;
}
function rawMoves(b,r,c,ep,cr){
  const p=b[r][c];if(!p)return[];
  const t=p[1];
  if(t==="P")return pawnMoves(b,r,c,ep);
  if(t==="N")return knightMoves(b,r,c);
  if(t==="K")return kingMoves(b,r,c,cr);
  if(t==="R")return slideMoves(b,r,c,[[0,1],[0,-1],[1,0],[-1,0]]);
  if(t==="B")return slideMoves(b,r,c,[[1,1],[1,-1],[-1,1],[-1,-1]]);
  if(t==="Q")return slideMoves(b,r,c,[[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]]);
  return[];
}
function applyMove(b,fr,fc,tr,tc,promo="Q"){
  const nb=b.map(r=>[...r]);
  const p=nb[fr][fc];
  nb[tr][tc]=p;nb[fr][fc]=null;
  // En passant capture
  if(p[1]==="P"&&fc!==tc&&!b[tr][tc])nb[fr][tc]=null;
  // Promotion
  if(p==="wP"&&tr===0)nb[tr][tc]="w"+promo;
  if(p==="bP"&&tr===7)nb[tr][tc]="b"+promo;
  // Castling: move rook
  if(p[1]==="K"&&Math.abs(tc-fc)===2){
    const row=fr;
    if(tc===6){nb[row][5]=nb[row][7];nb[row][7]=null;} // kingside
    if(tc===2){nb[row][3]=nb[row][0];nb[row][0]=null;} // queenside
  }
  return nb;
}
function findKing(b,col){for(let r=0;r<8;r++)for(let c=0;c<8;c++)if(b[r][c]===col+"K")return[r,c];return null;}
function isAttacked(b,r,c,by){
  for(let fr=0;fr<8;fr++)for(let fc=0;fc<8;fc++)
    if(cl(b[fr][fc])===by&&rawMoves(b,fr,fc,null).some(([mr,mc])=>mr===r&&mc===c))return true;
  return false;
}
function inCheck(b,col){const k=findKing(b,col);return k&&isAttacked(b,k[0],k[1],col==="w"?"b":"w");}
function legalMoves(b,r,c,ep,cr){
  const p=b[r][c];if(!p)return[];
  const col=cl(p);
  return rawMoves(b,r,c,ep,cr).filter(([tr,tc])=>!inCheck(applyMove(b,r,c,tr,tc),col));
}
function allLegal(b,col,ep,cr){
  const mv=[];
  for(let r=0;r<8;r++)for(let c=0;c<8;c++)
    if(cl(b[r][c])===col)legalMoves(b,r,c,ep,cr).forEach(([tr,tc])=>mv.push([r,c,tr,tc]));
  return mv;
}

// ─── AI ───
const PVAL={P:100,N:320,B:330,R:500,Q:900,K:0};
const PST_P=[[0,0,0,0,0,0,0,0],[50,50,50,50,50,50,50,50],[10,10,20,30,30,20,10,10],[5,5,10,25,25,10,5,5],[0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],[5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0]];
const PST_N=[[-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,5,5,0,-20,-40],[-30,5,10,15,15,10,5,-30],[-30,0,15,20,20,15,0,-30],[-30,5,15,20,20,15,5,-30],[-30,0,10,15,15,10,0,-30],[-40,-20,0,0,0,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50]];
const PST_B=[[-20,-10,-10,-10,-10,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,10,10,5,0,-10],[-10,5,5,10,10,5,5,-10],[-10,0,10,10,10,10,0,-10],[-10,10,10,10,10,10,10,-10],[-10,5,0,0,0,0,5,-10],[-20,-10,-10,-10,-10,-10,-10,-20]];
const PSTS={P:PST_P,N:PST_N,B:PST_B};
function evaluate(b){
  let s=0;
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    const p=b[r][c];if(!p)continue;
    const col=cl(p),t=p[1];
    const pv=PVAL[t]||0;
    const row=col==="w"?r:7-r;
    const pst=PSTS[t]?PSTS[t][row][c]:0;
    s+=col==="w"?pv+pst:-(pv+pst);
  }
  return s;
}
function minimax(b,depth,alpha,beta,isMax,ep){
  if(depth===0)return evaluate(b);
  const col=isMax?"w":"b";
  const moves=allLegal(b,col,ep);
  if(!moves.length)return inCheck(b,col)?(isMax?-10000:10000):0;
  if(isMax){
    let best=-Infinity;
    for(const[fr,fc,tr,tc]of moves){
      best=Math.max(best,minimax(applyMove(b,fr,fc,tr,tc),depth-1,alpha,beta,false,null));
      alpha=Math.max(alpha,best);if(beta<=alpha)break;
    }
    return best;
  }else{
    let best=Infinity;
    for(const[fr,fc,tr,tc]of moves){
      best=Math.min(best,minimax(applyMove(b,fr,fc,tr,tc),depth-1,alpha,beta,true,null));
      beta=Math.min(beta,best);if(beta<=alpha)break;
    }
    return best;
  }
}
function getBestMove(b,ep,depth,randomFactor){
  const moves=allLegal(b,"b",ep);
  if(!moves.length)return null;
  if(Math.random()<randomFactor)return moves[Math.floor(Math.random()*moves.length)];
  const shuffled=[...moves].sort(()=>Math.random()-0.5);
  let best=-Infinity,bestMove=shuffled[0];
  for(const[fr,fc,tr,tc]of shuffled){
    const score=minimax(applyMove(b,fr,fc,tr,tc),depth-1,-Infinity,Infinity,true,null);
    if(-score>best){best=-score;bestMove=[fr,fc,tr,tc];}
  }
  return bestMove;
}

function calcElo(playerElo,oppElo,result){
  const K=32,exp=1/(1+Math.pow(10,(oppElo-playerElo)/400));
  return Math.round(K*(result-exp));
}
function genId(){return Math.random().toString(36).slice(2,8).toUpperCase();}

function eloBadge(elo){
  if(elo>=2000)return{label:"GM",color:"#ffd700"};
  if(elo>=1600)return{label:"IM",color:"#e8c040"};
  if(elo>=1400)return{label:"Expert",color:"#c080f0"};
  if(elo>=1200)return{label:"Adv",color:"#60c0f0"};
  if(elo>=1000)return{label:"Inter",color:"#60d080"};
  if(elo>=800)return{label:"Beg",color:"#f0a040"};
  return{label:"Novice",color:"#a0a0a0"};
}

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════
export default function ChessApp(){
  const [lang,setLang]=useState("fr");
  const t=(k)=>LANGS[lang]?.[k]||LANGS.en[k]||k;

  const [screen,setScreen]=useState("menu");
  const [theme,setTheme]=useState("classic");
  const th=THEMES[theme];
  const [pieceSet,setPieceSet]=useState("classic");
  const PIECES=PIECE_SETS[pieceSet]||PIECE_SETS.classic;

  const [userElo,setUserElo]=useState(1000);
  const [gameMode,setGameMode]=useState(null);
  const [selectedBot,setSelectedBot]=useState(null);
  const [selectedTimeCtrl,setSelectedTimeCtrl]=useState(12); // index in TIME_CONTROLS, default "Sans"

  // Clocks: seconds remaining for each color
  const [clockW,setClockW]=useState(0);
  const [clockB,setClockB]=useState(0);
  const clockRef=useRef(null);
  const [timeInc,setTimeInc]=useState(0);

  const [board,setBoard]=useState(initBoard());
  const [turn,setTurn]=useState("w");
  const [selected,setSelected]=useState(null);
  const [highlights,setHighlights]=useState([]);
  const [ep,setEp]=useState(null);
  // castling rights: {wK,wQ,bK,bQ} = can still castle kingside/queenside
  const [castleRights,setCastleRights]=useState({wK:true,wQ:true,bK:true,bQ:true});
  const [status,setStatus]=useState("");
  const [promoModal,setPromoModal]=useState(null);
  const [moveLog,setMoveLog]=useState([]);
  const [capturedW,setCapturedW]=useState([]);
  const [capturedB,setCapturedB]=useState([]);
  const [lastMove,setLastMove]=useState(null);
  const [eloChange,setEloChange]=useState(null);
  const [showEloToast,setShowEloToast]=useState(false);
  const [aiThinking,setAiThinking]=useState(false);
  const [boardFlipped,setBoardFlipped]=useState(false);
  const [dragFrom,setDragFrom]=useState(null); // {r,c,piece}
  const [dragPos,setDragPos]=useState({x:0,y:0}); // mouse position for floating piece
  const [dragOver,setDragOver]=useState(null); // {r,c} square being hovered
  const boardRef=useRef(null);
  const [coachAdvice,setCoachAdvice]=useState("");
  const [coachLoading,setCoachLoading]=useState(false);
  const [dailyCoachDate,setDailyCoachDate]=useState("");
  const [coachUsedToday,setCoachUsedToday]=useState(false);

  const [roomId,setRoomId]=useState("");
  const [inputRoom,setInputRoom]=useState("");
  const [playerColor,setPlayerColor]=useState("w");
  const pollRef=useRef(null);

  const [puzzleIdx,setPuzzleIdx]=useState(0);
  const [puzzleStatus,setPuzzleStatus]=useState(null);
  const [solvedPuzzles,setSolvedPuzzles]=useState([]);
  const [puzzleSel,setPuzzleSel]=useState(null);
  const [puzzleHigh,setPuzzleHigh]=useState([]);
  const [isPremium,setIsPremium]=useState(false);
  const [dailyPuzzleCount,setDailyPuzzleCount]=useState(0);
  const [dailyPuzzleDate,setDailyPuzzleDate]=useState("");
  const DAILY_PUZZLE_LIMIT=4;

  const [showLangMenu,setShowLangMenu]=useState(false);
  const [showThemeMenu,setShowThemeMenu]=useState(false);

  // Persist
  useEffect(()=>{
    window.storage?.get("chess-elo").then(r=>{if(r)setUserElo(parseInt(r.value)||1000);}).catch(()=>{});
    window.storage?.get("chess-solved").then(r=>{if(r)setSolvedPuzzles(JSON.parse(r.value)||[]);}).catch(()=>{});
    window.storage?.get("chess-premium").then(r=>{if(r)setIsPremium(r.value==="1");}).catch(()=>{});
    const today=new Date().toISOString().slice(0,10);
    window.storage?.get("chess-coach-date").then(r=>{
      if(r&&r.value===today){setDailyCoachDate(today);setCoachUsedToday(true);}
    }).catch(()=>{});
    window.storage?.get("chess-daily-count").then(r=>{
      if(r){const d=JSON.parse(r.value);if(d.date===today){setDailyPuzzleCount(d.count);setDailyPuzzleDate(d.date);}}
    }).catch(()=>{});
  },[]);
  const saveElo=async(v)=>{try{await window.storage.set("chess-elo",String(v));}catch(e){}};
  const saveSolved=async(a)=>{try{await window.storage.set("chess-solved",JSON.stringify(a));}catch(e){}};
  const saveDailyCount=async(count)=>{
    const today=new Date().toISOString().slice(0,10);
    try{await window.storage.set("chess-daily-count",JSON.stringify({date:today,count}));}catch(e){}
  };

  // Clock helpers
  const stopClock=useCallback(()=>{if(clockRef.current){clearInterval(clockRef.current);clockRef.current=null;}},[]);
  const startClock=useCallback((color,inc)=>{
    stopClock();
    clockRef.current=setInterval(()=>{
      if(color==="w"){
        setClockW(prev=>{
          if(prev<=1){stopClock();return 0;}
          return prev-1;
        });
      } else {
        setClockB(prev=>{
          if(prev<=1){stopClock();return 0;}
          return prev-1;
        });
      }
    },1000);
  },[stopClock]);

  // Auto-scroll to board when it's player's turn
  useEffect(()=>{
    if(screen==="game"&&boardRef.current){
      setTimeout(()=>{boardRef.current.scrollIntoView({behavior:"smooth",block:"center"});},100);
    }
  },[turn,screen]);

  // Format seconds to mm:ss or hh:mm:ss
  const fmtTime=(s)=>{
    if(s>=3600){const h=Math.floor(s/3600);const m=Math.floor((s%3600)/60);return h+"h"+String(m).padStart(2,"0")+"m";}
    const m=Math.floor(s/60);const sec=s%60;
    return String(m).padStart(2,"0")+":"+String(sec).padStart(2,"0");
  };

  // Online
  const saveRoom=useCallback(async(rid,state)=>{try{await window.storage.set("chess-room-"+rid,JSON.stringify(state),true);}catch(e){};},[]);
  const loadRoom=useCallback(async(rid)=>{try{const r=await window.storage.get("chess-room-"+rid,true);return r?JSON.parse(r.value):null;}catch(e){return null;}},[]);

  const checkStatus=useCallback((b,col,epState,cr)=>{
    const moves=allLegal(b,col,epState,cr);
    if(!moves.length)return inCheck(b,col)?(col==="w"?t("checkmate_w"):t("checkmate_b")):t("stalemate");
    if(inCheck(b,col))return t("check");
    return "";
  },[lang]);

  // grantElo: for bot games use K-factor; for online use fixed amounts
  const grantElo=useCallback((result,oppElo,isOnline=false)=>{
    let change;
    if(isOnline){
      // result: 1=win, 0=loss (checkmate=-15), 0.5=draw
      if(result===1) change=15;
      else if(result===0) change=-15;
      else change=0; // draw: handled separately
    } else {
      change=calcElo(userElo,oppElo,result);
    }
    const newElo=Math.max(100,userElo+change);
    setUserElo(newElo);saveElo(newElo);
    setEloChange((change>=0?"+":"")+change);
    setShowEloToast(true);setTimeout(()=>setShowEloToast(false),3000);
  },[userElo]);

  const execMove=useCallback((b,fr,fc,tr,tc,promo="Q")=>{
    const p=b[fr][fc];
    const captured=b[tr][tc]||(p[1]==="P"&&fc!==tc&&!b[tr][tc]?b[fr][tc]:null);
    const nb=applyMove(b,fr,fc,tr,tc,promo);
    let newEp=null;
    if(p[1]==="P"&&Math.abs(tr-fr)===2)newEp=[(fr+tr)/2,fc];
    if(captured){if(cl(p)==="w")setCapturedB(prev=>[...prev,captured]);else setCapturedW(prev=>[...prev,captured]);}
    // Update castling rights
    setCastleRights(prev=>{
      const cr={...prev};
      if(p==="wK"){cr.wK=false;cr.wQ=false;}
      if(p==="bK"){cr.bK=false;cr.bQ=false;}
      if(p==="wR"&&fr===7&&fc===7)cr.wK=false;
      if(p==="wR"&&fr===7&&fc===0)cr.wQ=false;
      if(p==="bR"&&fr===0&&fc===7)cr.bK=false;
      if(p==="bR"&&fr===0&&fc===0)cr.bQ=false;
      return cr;
    });
    const isCastle=p[1]==="K"&&Math.abs(tc-fc)===2;
    const F=["a","b","c","d","e","f","g","h"],R=["8","7","6","5","4","3","2","1"];
    const moveStr=isCastle?(tc===6?"O-O":"O-O-O"):`${PIECES[p]}${F[fc]}${R[fr]}→${F[tc]}${R[tr]}`;
    setMoveLog(prev=>[...prev,moveStr]);
    setLastMove([fr,fc,tr,tc]);
    if(timeInc>0){
      if(cl(p)==="w") setClockW(prev=>prev+timeInc);
      else setClockB(prev=>prev+timeInc);
    }
    return{nb,newEp};
  },[timeInc]);

  const doAiMove=useCallback((b,epState,bot)=>{
    setAiThinking(true);
    const delay=400+Math.random()*600;
    setTimeout(()=>{
      const mv=getBestMove(b,epState,bot.depth,bot.random);
      setAiThinking(false);
      if(!mv)return;
      const[fr,fc,tr,tc]=mv;
      const{nb,newEp}=execMove(b,fr,fc,tr,tc);
      setBoard(nb);setEp(newEp);setTurn("w");
      const st=checkStatus(nb,"w",newEp,{wK:false,wQ:false,bK:false,bQ:false});
      setStatus(st);
      if(st&&(st.includes("mat")||st.includes("Mate")||st.includes("mate")))grantElo(0,bot.elo);
      else if(st===t("stalemate"))grantElo(0.5,bot.elo);
    },delay);
  },[execMove,checkStatus,grantElo,lang]);

  const handleClick=useCallback((r,c)=>{
    if(status&&status!==t("check"))return;
    if(gameMode==="online"&&turn!==playerColor)return;
    if((gameMode==="bot"||gameMode==="bot-white")&&(turn!=="w"||aiThinking))return;
    const p=board[r][c];
    if(selected){
      const[sr,sc]=selected;
      if(highlights.some(([hr,hc])=>hr===r&&hc===c)){
        const sp=board[sr][sc];
        if(sp[1]==="P"&&((cl(sp)==="w"&&r===0)||(cl(sp)==="b"&&r===7))){
          setPromoModal({fr:sr,fc:sc,tr:r,tc:c});setSelected(null);setHighlights([]);return;
        }
        const{nb,newEp}=execMove(board,sr,sc,r,c);
        const nextTurn=turn==="w"?"b":"w";
        setBoard(nb);setEp(newEp);setTurn(nextTurn);
        setSelected(null);setHighlights([]);
        const st=checkStatus(nb,nextTurn,newEp,castleRights);
        setStatus(st);
        // Flip board for local 2-player mode
        if(gameMode==="local"){setBoardFlipped(f=>!f);}
        // Coach advice after each player move
        if(gameMode==="coach"){
          fetchCoachAdvice(nb,nextTurn,[sr,sc,r,c]);
          if(nextTurn==="b"&&(!st||st===t("check"))){
            doAiMove(nb,newEp,{depth:2,random:0.1,elo:800});
          }
        }
        const gameOver=st&&st!==t("check");
        if(gameOver){
          stopClock();
          if(gameMode==="bot"){
            if(st===t("checkmate_b"))grantElo(1,selectedBot.elo);
            else if(st===t("stalemate"))grantElo(0.5,selectedBot.elo);
          }
          if(gameMode==="online"){
            if(st===t("checkmate_b"))grantElo(1,1000,true); // white wins
            else if(st===t("checkmate_w"))grantElo(0,1000,true); // white loses
            // draw: white+1
            else { const ne=Math.max(100,userElo+1);setUserElo(ne);saveElo(ne);setEloChange("+1");setShowEloToast(true);setTimeout(()=>setShowEloToast(false),3000); }
          }
        } else {
          // Switch clock
          if(clockW>0||clockB>0) startClock(nextTurn,timeInc);
          if(gameMode==="bot"&&nextTurn==="b"){
            doAiMove(nb,newEp,selectedBot);
          }
        }
        if(gameMode==="online")saveRoom(roomId,{board:nb,turn:nextTurn,ep:newEp,status:st,clockW,clockB});
        return;
      }
      if(p&&cl(p)===turn){setSelected([r,c]);setHighlights(legalMoves(board,r,c,ep,castleRights));return;}
      setSelected(null);setHighlights([]);return;
    }
    if(p&&cl(p)===turn){setSelected([r,c]);setHighlights(legalMoves(board,r,c,ep,castleRights));}
  },[board,selected,highlights,turn,ep,castleRights,gameMode,playerColor,roomId,status,aiThinking,t,execMove,checkStatus,doAiMove,selectedBot,grantElo,saveRoom]);

  const handlePromo=useCallback((piece)=>{
    const{fr,fc,tr,tc}=promoModal;
    const{nb,newEp}=execMove(board,fr,fc,tr,tc,piece);
    const nextTurn=turn==="w"?"b":"w";
    setBoard(nb);setEp(newEp);setTurn(nextTurn);setPromoModal(null);
    const st=checkStatus(nb,nextTurn,newEp,castleRights);setStatus(st);
    if(gameMode==="bot"&&nextTurn==="b"&&(!st||st===t("check")))doAiMove(nb,newEp,selectedBot);
    if(gameMode==="online")saveRoom(roomId,{board:nb,turn:nextTurn,ep:newEp,status:st});
  },[promoModal,board,turn,gameMode,roomId,t,execMove,checkStatus,doAiMove,selectedBot,saveRoom]);

  // Clock timeout detection
  useEffect(()=>{
    if(!clockW && clockW===0 && gameMode && screen==="game" && (clockB>0)){
      // White timed out
      setStatus("⏰ Temps écoulé — Les Noirs gagnent!");
      stopClock();
      if(gameMode==="online") grantElo(0,1000,true);
    }
  },[clockW]);

  useEffect(()=>{
    if(!clockB && clockB===0 && gameMode && screen==="game" && (clockW>0)){
      // Black timed out
      setStatus("⏰ Temps écoulé — Les Blancs gagnent!");
      stopClock();
      if(gameMode==="online") grantElo(1,1000,true);
    }
  },[clockB]);

  // Online poll
  useEffect(()=>{
    if(gameMode!=="online"||!roomId)return;
    pollRef.current=setInterval(async()=>{
      const state=await loadRoom(roomId);if(!state)return;
      setBoard(b=>{
        if(JSON.stringify(state.board)!==JSON.stringify(b)){
          setTurn(state.turn);setEp(state.ep);setStatus(state.status||"");return state.board;
        }
        return b;
      });
    },1500);
    return()=>clearInterval(pollRef.current);
  },[gameMode,roomId,loadRoom]);

  // Puzzle
  const handlePuzzleClick=useCallback((r,c)=>{
    if(puzzleStatus==="correct")return;
    const pz=PUZZLES[puzzleIdx];
    const p=pz.board[r][c];
    if(puzzleSel){
      const[sr,sc]=puzzleSel;
      const[esr,esc,etr,etc]=[pz.solution[0],pz.solution[1],pz.solution[2],pz.solution[3]];
      // solution is [fr,fc,tr,tc]
      const[sol_fr,sol_fc]=pz.solution[0]||[];
      const[sol_tr,sol_tc]=pz.solution[1]||[];
      if(sr===sol_fr&&sc===sol_fc&&r===sol_tr&&c===sol_tc){
        setPuzzleStatus("correct");
        if(!solvedPuzzles.includes(pz.id)){
          const ns=[...solvedPuzzles,pz.id];setSolvedPuzzles(ns);saveSolved(ns);
          const ch=calcElo(userElo,pz.elo,1);const ne=Math.max(100,userElo+ch);
          setUserElo(ne);saveElo(ne);setEloChange("+"+ch);setShowEloToast(true);setTimeout(()=>setShowEloToast(false),3000);
          // Daily puzzle tracking
          const today=new Date().toISOString().slice(0,10);
          const newCount=dailyPuzzleDate===today?dailyPuzzleCount+1:1;
          setDailyPuzzleCount(newCount);setDailyPuzzleDate(today);saveDailyCount(newCount);
        }
      }else{
        setPuzzleStatus("wrong");setTimeout(()=>setPuzzleStatus(null),1000);
      }
      setPuzzleSel(null);setPuzzleHigh([]);
    }else{
      if(p&&cl(p)===pz.turn){setPuzzleSel([r,c]);setPuzzleHigh(legalMoves(pz.board,r,c,null));}
    }
  },[puzzleIdx,puzzleSel,puzzleStatus,solvedPuzzles,userElo]);

  // ─── COACH AI ───
  const PIECE_NAMES_C={wK:"Roi blanc",wQ:"Dame blanche",wR:"Tour blanche",wB:"Fou blanc",wN:"Cavalier blanc",wP:"Pion blanc",bK:"Roi noir",bQ:"Dame noire",bR:"Tour noire",bB:"Fou noir",bN:"Cavalier noir",bP:"Pion noir"};
  const FILES_C=["a","b","c","d","e","f","g","h"];
  const RANKS_C=["8","7","6","5","4","3","2","1"];

  const fetchCoachAdvice=useCallback(async(brd,nextTurn,lastMv)=>{
    setCoachLoading(true);setCoachAdvice("");
    const boardStr=brd.map((row,r)=>row.map((p,c)=>p?p+"@"+FILES_C[c]+RANKS_C[r]:"·").join(" ")).join("\n");
    const lastMoveStr=lastMv?FILES_C[lastMv[1]]+RANKS_C[lastMv[0]]+"→"+FILES_C[lastMv[3]]+RANKS_C[lastMv[2]]:"";
    const prompt="Tu es un entraîneur d'échecs expert et bienveillant. Le joueur (Blancs) vient de jouer "+lastMoveStr+".\nPosition actuelle:\n"+boardStr+"\n\nDonne 1-2 conseils courts et pratiques en français. Sois direct et concis (max 2 phrases courtes), comme un vrai entraîneur d'échecs.";
    try{
      const resp=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:120,
          messages:[{role:"user",content:prompt}]
        })
      });
      const data=await resp.json();
      const advice=data.content?.map(b=>b.text||"").join("").trim();
      setCoachAdvice(advice||"Bonne continuation !");
    }catch(e){setCoachAdvice("Continue à bien jouer !");}
    setCoachLoading(false);
  },[]);

  const startGame=(mode,bot=null,tcIdx=null)=>{
    setCoachAdvice("");setCoachLoading(false);
    const tc=TIME_CONTROLS[tcIdx!=null?tcIdx:selectedTimeCtrl];
    setGameMode(mode);setSelectedBot(bot);
    setBoard(initBoard());setTurn("w");setSelected(null);setHighlights([]);
    setEp(null);setStatus("");setMoveLog([]);setCapturedW([]);setCapturedB([]);
    setLastMove(null);setAiThinking(false);setPromoModal(null);
    setCastleRights({wK:true,wQ:true,bK:true,bQ:true});
    setBoardFlipped(false);
    setClockW(tc.base);setClockB(tc.base);setTimeInc(tc.inc);
    stopClock();
    if(tc.base>0) startClock("w",tc.inc);
    setScreen("game");
  };
  const createRoom=async()=>{
    const id=genId();setRoomId(id);setPlayerColor("w");
    const state={board:initBoard(),turn:"w",ep:null,status:""};
    await saveRoom(id,state);
    setBoard(state.board);setTurn("w");setEp(null);setStatus("");setScreen("game");
  };
  const joinRoom=async()=>{
    const id=inputRoom.trim().toUpperCase();if(!id)return;
    const state=await loadRoom(id);
    if(!state){alert("Room not found!");return;}
    setRoomId(id);setPlayerColor("b");
    setBoard(state.board);setTurn(state.turn);setEp(state.ep);setStatus(state.status||"");setScreen("game");
  };
  const goMenu=()=>{setScreen("menu");setGameMode(null);stopClock();if(pollRef.current)clearInterval(pollRef.current);};

  // BOARD RENDERER
  const SQ_SIZE="min(11.2vw, min(calc(100vh - 220px)/8, 68px))";
  const FILES=["a","b","c","d","e","f","g","h"];
  const RANKS=["8","7","6","5","4","3","2","1"];

  const renderBoard=(onClick,brd,selSq,highSqs,lm,isCheckFn,disabled,flipped=false)=>{
    const sqSize=68;
    const handleBoardMouseMove=(e)=>{
      if(dragFrom){
        setDragPos({x:e.clientX,y:e.clientY});
      }
    };
    const handleBoardMouseUp=(e)=>{
      if(dragFrom&&dragOver){
        onClick(dragOver.r,dragOver.c);
      }
      setDragFrom(null);setDragOver(null);
    };
    return(
      <div ref={boardRef}
        onMouseMove={handleBoardMouseMove}
        onMouseUp={handleBoardMouseUp}
        onMouseLeave={()=>{setDragFrom(null);setDragOver(null);}}
        style={{
        display:"inline-block",
        border:`3px solid ${th.border}`,borderRadius:"8px",overflow:"hidden",
        boxShadow:`0 16px 48px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.04)`,
        cursor:dragFrom?"grabbing":"default",
        position:"relative",
      }}>
        <div style={{display:"flex",flexDirection:"column"}}>
          {(flipped?[...RANKS].reverse():RANKS).map((rank,rIdx)=>{
            const ri=flipped?7-rIdx:rIdx;
            return(
            <div key={ri} style={{display:"flex"}}>
              <div style={{
                width:"20px",display:"flex",alignItems:"center",justifyContent:"center",
                background:th.bg,fontSize:"0.6rem",color:th.accent+"99",fontFamily:"monospace",
                flexShrink:0
              }}>{rank}</div>
              {(flipped?[...Array(8).keys()].reverse():[...Array(8).keys()]).map((ci)=>{
                const isLight=(ri+ci)%2===0;
                const isSel=selSq&&selSq[0]===ri&&selSq[1]===ci;
                const isHigh=highSqs&&highSqs.some(([hr,hc])=>hr===ri&&hc===ci);
                const isLM=lm&&((lm[0]===ri&&lm[1]===ci)||(lm[2]===ri&&lm[3]===ci));
                const isChk=isCheckFn&&isCheckFn(ri,ci);
                const p=brd[ri][ci];
                let bg=isLight?th.light:th.dark;
                if(isLM)bg=isLight?"rgba(252,222,48,0.72)":"rgba(195,157,22,0.72)";
                if(isSel)bg="#c8e042";
                if(isChk)bg="#dd4444";
                const isDragHover=dragFrom&&dragFrom[2]===ri&&dragFrom[3]===ci;
                if(isDragHover)bg=isLight?"rgba(120,220,120,0.85)":"rgba(80,170,80,0.85)";
                const isDraggingFromHere=dragFrom&&dragFrom.r===ri&&dragFrom.c===ci;
                const isDragOverHere=dragOver&&dragOver.r===ri&&dragOver.c===ci;
                if(isDragOverHere&&dragFrom)bg=isLight?"rgba(120,220,120,0.85)":"rgba(60,170,60,0.85)";
                return(
                  <div key={ci}
                    onClick={disabled?undefined:(e)=>{
                      if(!dragFrom)onClick(ri,ci);
                    }}
                    onMouseDown={disabled?undefined:(e)=>{
                      e.preventDefault();
                      if(p&&!disabled){
                        setDragFrom({r:ri,c:ci,piece:p});
                        setDragPos({x:e.clientX,y:e.clientY});
                        setDragOver({r:ri,c:ci});
                        onClick(ri,ci);
                      }
                    }}
                    onMouseEnter={disabled?undefined:(e)=>{
                      if(dragFrom)setDragOver({r:ri,c:ci});
                    }}
                    style={{
                    width:SQ_SIZE,height:SQ_SIZE,background:bg,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    position:"relative",
                    cursor:disabled?"default":p&&cl(p)===turn?"grab":"pointer",
                    transition:"background 0.06s",
                    minWidth:"36px",minHeight:"36px",maxWidth:"68px",maxHeight:"68px",
                    userSelect:"none",
                  }}>
                    {isHigh&&(p
                      ?<div style={{position:"absolute",inset:"2px",border:"3px solid rgba(0,0,0,0.28)",borderRadius:"3px",pointerEvents:"none"}}/>
                      :<div style={{position:"absolute",width:"33%",height:"33%",background:"rgba(0,0,0,0.2)",borderRadius:"50%",pointerEvents:"none"}}/>
                    )}
                    {isDragOverHere&&dragFrom&&<div style={{position:"absolute",inset:0,background:"rgba(100,255,100,0.18)",borderRadius:"2px",pointerEvents:"none"}}/>}
                    {p&&(
                      <span style={{
                        fontSize:"clamp(28px,min(8.5vw,7vh),56px)",
                        lineHeight:"1",userSelect:"none",display:"block",
                        color:cl(p)==="w"?"#ffffff":"#0a0a0a",
                        WebkitTextStroke:cl(p)==="w"?"1.5px #1a1a1a":"1.5px #e0d0b0",
                        filter:cl(p)==="w"
                          ?"drop-shadow(0 2px 6px rgba(0,0,0,.9)) drop-shadow(0 0 3px rgba(255,255,255,.4))"
                          :"drop-shadow(0 2px 6px rgba(0,0,0,.95)) drop-shadow(0 0 3px rgba(220,200,120,.3))",
                        opacity:isDraggingFromHere?0.25:1,
                        transition:"opacity 0.1s",
                        fontWeight:"900",
                        pointerEvents:"none",
                      }}>
                        {PIECES[p]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          );})}
          <div style={{display:"flex"}}>
            <div style={{width:"20px",background:th.bg}}/>
            {(flipped?[...FILES].reverse():FILES).map((f,fi)=>(
              <div key={fi} style={{
                width:SQ_SIZE,height:"20px",display:"flex",alignItems:"center",justifyContent:"center",
                background:th.bg,fontSize:"0.6rem",color:th.accent+"99",fontFamily:"monospace",
                minWidth:"36px",maxWidth:"68px",
              }}>{f}</div>
            ))}
          </div>
        </div>
        {/* Floating dragged piece */}
        {dragFrom&&(
          <div style={{
            position:"fixed",
            left:dragPos.x,top:dragPos.y,
            transform:"translate(-50%,-50%) scale(1.35)",
            pointerEvents:"none",zIndex:9999,
            fontSize:"clamp(28px,min(8.5vw,7vh),56px)",
            lineHeight:"1",userSelect:"none",
            color:cl(dragFrom.piece)==="w"?"#ffffff":"#0a0a0a",
            WebkitTextStroke:cl(dragFrom.piece)==="w"?"1.5px #1a1a1a":"1.5px #e0d0b0",
            filter:cl(dragFrom.piece)==="w"
              ?"drop-shadow(0 4px 12px rgba(0,0,0,.9)) drop-shadow(0 0 8px rgba(255,255,255,.5))"
              :"drop-shadow(0 4px 12px rgba(0,0,0,.95)) drop-shadow(0 0 6px rgba(220,200,120,.5))",
            fontWeight:"900",
            transition:"none",
          }}>
            {PIECES[dragFrom.piece]}
          </div>
        )}
      </div>
    );
  };

  const badge=eloBadge(userElo);
  const isGameOver=status&&status!==t("check");

  // ─── HEADER BAR ───
  const HeaderBar=()=>(
    <div style={{
      display:"flex",justifyContent:"space-between",alignItems:"center",
      width:"100%",maxWidth:"640px",padding:"0 0.5rem",marginBottom:"0.7rem",flexWrap:"wrap",gap:"0.4rem"
    }}>
      <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
        <span style={{
          fontFamily:"'Cinzel',serif",fontSize:"1.15rem",letterSpacing:"0.1em",
          fontWeight:700,color:th.accent,
        }}>chess.app</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:"0.4rem",position:"relative"}}>
        <div style={{
          display:"flex",alignItems:"center",gap:"0.4rem",
          background:"rgba(0,0,0,0.45)",border:`1px solid ${th.accent}35`,
          borderRadius:"20px",padding:"0.3rem 0.8rem",fontSize:"0.78rem"
        }}>
          <div style={{width:7,height:7,borderRadius:"50%",background:badge.color}}/>
          <span style={{color:"#ddd"}}>{userElo}</span>
          <span style={{color:badge.color,fontWeight:700,fontSize:"0.68rem"}}>{badge.label}</span>
        </div>
        {/* Theme */}
        <button onClick={()=>{setShowThemeMenu(!showThemeMenu);setShowLangMenu(false);}} style={{
          background:"rgba(0,0,0,0.4)",border:`1px solid ${th.accent}35`,borderRadius:"8px",
          padding:"0.3rem 0.55rem",color:th.accent,cursor:"pointer",fontSize:"0.8rem"
        }}>🎨</button>
        {/* Lang */}
        <button onClick={()=>{setShowLangMenu(!showLangMenu);setShowThemeMenu(false);}} style={{
          background:"rgba(0,0,0,0.4)",border:`1px solid ${th.accent}35`,borderRadius:"8px",
          padding:"0.3rem 0.55rem",color:th.accent,cursor:"pointer",fontSize:"0.78rem"
        }}>🌐 {lang.toUpperCase()}</button>
        {/* Dropdowns */}
        {showLangMenu&&(
          <<div onClick={e=>e.stopPropagation()} style={{position:"absolute",right:0,top:"calc(100% + 6px)",background:"#111",border:`1px solid ${th.accent}40`,borderRadius:"10px",zIndex:200,overflow:"hidden",minWidth:"150px",boxShadow:"0 8px 24px rgba(0,0,0,0.7)"}}>
            {Object.keys(LANGS).map(l=>(
              <div key={l} onClick={()=>{setLang(l);setShowLangMenu(false);}} style={{
                padding:"0.55rem 1rem",cursor:"pointer",
                color:l===lang?th.accent:"#ccc",background:l===lang?`${th.accent}18`:"transparent",fontSize:"0.85rem"
              }}
              onMouseEnter={e=>e.currentTarget.style.background=`${th.accent}18`}
              onMouseLeave={e=>e.currentTarget.style.background=l===lang?`${th.accent}18`:"transparent"}>
                {{en:"🇬🇧 English",fr:"🇫🇷 Français",es:"🇪🇸 Español",de:"🇩🇪 Deutsch",pt:"🇧🇷 Português"}[l]}
              </div>
            ))}
          </div>
        )}
        {showThemeMenu&&(
          <div style={{position:"absolute",right:0,top:"calc(100% + 6px)",background:"#111",border:`1px solid ${th.accent}40`,borderRadius:"10px",zIndex:200,overflow:"hidden",minWidth:"180px",boxShadow:"0 8px 24px rgba(0,0,0,0.7)"}}>
            <div style={{padding:"0.4rem 1rem",fontSize:"0.65rem",color:"#5a5a5a",letterSpacing:"0.05em",borderBottom:"1px solid #222"}}>PLATEAU</div>
            {Object.entries(THEMES).map(([key,thm])=>(
              <div key={key} onClick={()=>{setTheme(key);setShowThemeMenu(false);}} style={{
                padding:"0.5rem 1rem",cursor:"pointer",display:"flex",alignItems:"center",gap:"0.5rem",
                background:key===theme?`${thm.accent}18`:"transparent",fontSize:"0.82rem",color:key===theme?thm.accent:"#ccc"
              }}
              onMouseEnter={e=>e.currentTarget.style.background=`${thm.accent}18`}
              onMouseLeave={e=>e.currentTarget.style.background=key===theme?`${thm.accent}18`:"transparent"}>
                <div style={{display:"flex",gap:"2px"}}>
                  <div style={{width:10,height:10,borderRadius:"2px",background:thm.light}}/>
                  <div style={{width:10,height:10,borderRadius:"2px",background:thm.dark}}/>
                </div>
                {t(thm.name)}
              </div>
            ))}
            <div style={{padding:"0.4rem 1rem",fontSize:"0.65rem",color:"#5a5a5a",letterSpacing:"0.05em",borderTop:"1px solid #222",borderBottom:"1px solid #222"}}>PIÈCES</div>
            {[["classic","♟ Classique"],["letters","Abc Lettres"],["emoji","😀 Emoji"]].map(([ps,lbl])=>(
              <div key={ps} onClick={()=>{setPieceSet(ps);}} style={{
                padding:"0.5rem 1rem",cursor:"pointer",display:"flex",alignItems:"center",gap:"0.5rem",
                background:pieceSet===ps?`${th.accent}18`:"transparent",fontSize:"0.82rem",color:pieceSet===ps?th.accent:"#ccc"
              }}
              onMouseEnter={e=>e.currentTarget.style.background=`${th.accent}18`}
              onMouseLeave={e=>e.currentTarget.style.background=pieceSet===ps?`${th.accent}18`:"transparent"}>
                {lbl}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const globalStyles=`
    @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,400&family=Cinzel:wght@400;700;900&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:${th.bg};overflow-x:hidden;}
    ::-webkit-scrollbar{width:4px;}
    ::-webkit-scrollbar-thumb{background:${th.accent}50;border-radius:2px;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes toastIn{0%{opacity:0;transform:translateY(-8px) scale(.95)}15%{opacity:1;transform:translateY(0) scale(1)}80%{opacity:1}100%{opacity:0}}
    @keyframes pulse{0%,100%{opacity:.7}50%{opacity:1}}
    .hovcard:hover{transform:translateX(5px)!important;border-color:${th.accent}80!important;}
    .hovcard{transition:all .18s ease!important;}
  `;

  // ═══════ MENU ══════════
  if(screen==="menu")return(
    <div style={{minHeight:"100vh",background:th.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Crimson Pro','Georgia',serif",color:"#e8dcc8",padding:"1rem"}} onClick={()=>{setShowLangMenu(false);setShowThemeMenu(false);}}>
      <style>{globalStyles}</style>
      <HeaderBar/>
      <div style={{textAlign:"center",marginBottom:"1.75rem",animation:"fadeUp .5s ease"}}>
        <div style={{fontSize:"clamp(72px,15vw,128px)",filter:`drop-shadow(0 0 50px ${th.accent}70)`,lineHeight:1,marginBottom:"0.4rem"}}>♟</div>
        <h1 style={{fontFamily:"'Cinzel',serif",fontSize:"clamp(30px,7vw,58px)",fontWeight:900,letterSpacing:".1em",color:th.accent,textShadow:`0 0 50px ${th.accent}45`}}>chess.app</h1>
        <div style={{color:"#7a6a50",fontSize:"0.85rem",marginTop:"0.3rem"}}>{t("yourElo")}: <b style={{color:badge.color}}>{userElo}</b> · <span style={{color:badge.color}}>{badge.label}</span></div>
      </div>
      {/* Piece Set Selector */}
      <div style={{display:"flex",gap:"0.5rem",marginBottom:"0.6rem",alignItems:"center",flexWrap:"wrap",justifyContent:"center"}}>
        <span style={{fontSize:"0.72rem",color:"#6a5a40",fontFamily:"'Cinzel',serif"}}>Pièces:</span>
        {Object.keys(PIECE_SETS).map(ps=>(
          <div key={ps} onClick={()=>setPieceSet(ps)} style={{
            cursor:"pointer",padding:"0.28rem 0.75rem",borderRadius:"8px",fontSize:"0.75rem",
            background:pieceSet===ps?`${th.accent}28`:"rgba(255,255,255,0.04)",
            border:`1px solid ${pieceSet===ps?th.accent+"80":th.accent+"22"}`,
            color:pieceSet===ps?th.accent:"#7a6a50",transition:"all .15s",fontFamily:"'Cinzel',serif"
          }}>{ps==="classic"?"♟ Classique":ps==="letters"?"Abc Lettres":"😀 Emoji"}</div>
        ))}
      </div>
      {/* Time Control Selector */}
      <div style={{marginBottom:"0.9rem",width:"100%",maxWidth:"330px"}}>
        <div style={{fontSize:"0.72rem",color:"#6a5a40",fontFamily:"'Cinzel',serif",marginBottom:"0.4rem",textAlign:"center"}}>⏱ Contrôle du temps</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:"0.3rem",justifyContent:"center"}}>
          {TIME_CONTROLS.map((tc,i)=>(
            <div key={i} onClick={()=>setSelectedTimeCtrl(i)} style={{
              cursor:"pointer",padding:"0.25rem 0.6rem",borderRadius:"6px",fontSize:"0.72rem",
              background:selectedTimeCtrl===i?`${th.accent}28`:"rgba(255,255,255,0.04)",
              border:`1px solid ${selectedTimeCtrl===i?th.accent+"80":th.accent+"18"}`,
              color:selectedTimeCtrl===i?th.accent:"#6a5a40",transition:"all .15s",
            }}>{tc.label}</div>
          ))}
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"0.65rem",width:"100%",maxWidth:"330px"}}>
        {[
          {to:"bot-select",icon:"🤖",title:t("playBot"),sub:"ELO matchmaking"},
          {to:"local",icon:"🤝",title:t("playLocal"),sub:"Same screen"},
          {to:"lobby",icon:"🌐",title:t("playOnline"),sub:"Real-time"},
          {to:"puzzles",icon:"🧩",title:t("puzzles"),sub:`${solvedPuzzles.length}/${PUZZLES.length} ${t("solved")}`},
        ].map(({to,icon,title,sub})=>(
          <div key={to} className="hovcard" onClick={()=>{
            if(to==="bot-select")setScreen("bot-select");
            else if(to==="local")startGame("local");
            else if(to==="lobby"){setGameMode("online");setScreen("lobby");}
            else if(to==="puzzles"){setPuzzleStatus(null);setPuzzleSel(null);setPuzzleHigh([]);setScreen("puzzles");}
          }} style={{
            cursor:"pointer",
            background:`linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))`,
            border:`1px solid ${th.accent}28`,borderRadius:"14px",
            padding:"0.95rem 1.4rem",display:"flex",alignItems:"center",gap:"1rem",
          }}>
            <span style={{fontSize:"1.9rem"}}>{icon}</span>
            <div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:"0.95rem",color:th.accent,letterSpacing:".04em"}}>{title}</div>
              <div style={{fontSize:"0.72rem",color:"#6a5a40",marginTop:"0.1rem"}}>{sub}</div>
            </div>
            <span style={{marginLeft:"auto",color:`${th.accent}55`,fontSize:"1.1rem"}}>›</span>
          </div>
        ))}
        {/* Premium Button */}
        <div className="hovcard" onClick={()=>window.open("paiement-paypal.html","_self")} style={{
          cursor:"pointer",
          background:"linear-gradient(135deg, rgba(245,200,66,0.13), rgba(240,165,0,0.05))",
          border:"1px solid #f5c84260",borderRadius:"14px",
          padding:"0.95rem 1.4rem",display:"flex",alignItems:"center",gap:"1rem",
        }}>
          <span style={{fontSize:"1.9rem"}}>👑</span>
          <div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:"0.95rem",color:"#f5c842",letterSpacing:".04em"}}>ChessBoost Premium</div>
            <div style={{fontSize:"0.72rem",color:"#a08030",marginTop:"0.1rem"}}>Accès illimité · $15.00 USD</div>
          </div>
          <span style={{marginLeft:"auto",color:"#f5c84280",fontSize:"1.1rem"}}>›</span>
        </div>
        {/* Coach Button */}
        {(()=>{
          const today=new Date().toISOString().slice(0,10);
          const usedToday=dailyCoachDate===today&&coachUsedToday;
          const canPlay=isPremium||!usedToday;
          return(
            <div className="hovcard" onClick={()=>{
              if(!canPlay){window.open("paiement-paypal.html","_self");return;}
              const today2=new Date().toISOString().slice(0,10);
              setDailyCoachDate(today2);setCoachUsedToday(true);
              try{window.storage?.set("chess-coach-date",today2);}catch(e){}
              startGame("coach");
            }} style={{
              cursor:"pointer",
              background:"linear-gradient(135deg,rgba(100,200,255,0.10),rgba(60,140,200,0.05))",
              border:"1px solid rgba(100,180,255,0.35)",borderRadius:"14px",
              padding:"0.95rem 1.4rem",display:"flex",alignItems:"center",gap:"1rem",
              opacity:canPlay?1:0.75,
            }}>
              <span style={{fontSize:"1.9rem"}}>🎓</span>
              <div>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:"0.95rem",color:"#70c8ff",letterSpacing:".04em"}}>
                  Jouer avec l'Entraîneur
                </div>
                <div style={{fontSize:"0.72rem",color:"#4a7090",marginTop:"0.1rem"}}>
                  {canPlay?(isPremium?"Illimité · Conseils IA":"1 partie/jour · Conseils IA"):"Limite atteinte · Premium pour +"}
                </div>
              </div>
              <span style={{marginLeft:"auto",color:"rgba(100,180,255,0.5)",fontSize:"1.1rem"}}>›</span>
            </div>
          );
        })()}
      </div>
    </div>
  );

  // ═══════ BOT SELECT ══════════
  if(screen==="bot-select")return(
    <div style={{minHeight:"100vh",background:th.bg,display:"flex",flexDirection:"column",alignItems:"center",fontFamily:"'Crimson Pro','Georgia',serif",color:"#e8dcc8",padding:"1rem"}} onClick={()=>{setShowLangMenu(false);setShowThemeMenu(false);}}>
      <style>{globalStyles}</style>
      <HeaderBar/>
      <h2 style={{fontFamily:"'Cinzel',serif",color:th.accent,fontSize:"1.3rem",marginBottom:"1.25rem",letterSpacing:".08em"}}>{t("selectBot")}</h2>
      <div style={{display:"flex",flexDirection:"column",gap:"0.5rem",width:"100%",maxWidth:"420px",overflowY:"auto",maxHeight:"68vh"}}>
        {BOTS.map(bot=>{
          const diff=bot.elo-userElo;
          const dc=diff>400?"#e05040":diff>150?"#e09040":diff>-150?"#a0c040":"#40c070";
          const dl=diff>400?"💀 Very Hard":diff>150?"⚔️ Hard":diff>-150?"⚖️ Even":"🎯 Easy";
          return(
            <div key={bot.id} className="hovcard" onClick={()=>startGame("bot",bot)} style={{
              cursor:"pointer",background:"linear-gradient(135deg,rgba(255,255,255,0.04),rgba(0,0,0,0.1))",
              border:`1px solid ${th.accent}22`,borderRadius:"12px",padding:"0.85rem 1.1rem",
              display:"flex",alignItems:"center",gap:"0.9rem",
            }}>
              <span style={{fontSize:"2rem",lineHeight:1}}>{bot.emoji}</span>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.18rem"}}>
                  <span style={{fontFamily:"'Cinzel',serif",fontSize:"0.88rem",color:th.accent}}>{bot.name}</span>
                  <span style={{fontSize:"0.68rem",background:`${dc}18`,color:dc,padding:"1px 7px",borderRadius:"10px",border:`1px solid ${dc}45`}}>{dl}</span>
                </div>
                <div style={{fontSize:"0.73rem",color:"#7a6a50"}}>{BOT_DESCS[bot.id]?.[lang]||BOT_DESCS[bot.id].en}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:"1.05rem",fontWeight:700,color:th.accent}}>{bot.elo}</div>
                <div style={{fontSize:"0.6rem",color:"#5a4a30"}}>ELO</div>
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={()=>setScreen("menu")} style={{marginTop:"1rem",background:"none",border:`1px solid ${th.accent}28`,color:"#7a6a50",padding:"0.45rem 1.3rem",borderRadius:"8px",cursor:"pointer",fontFamily:"'Crimson Pro',serif",fontSize:"0.88rem"}}>{t("back")}</button>
    </div>
  );

  // ═══════ LOBBY ══════════
  if(screen==="lobby")return(
    <div style={{minHeight:"100vh",background:th.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Crimson Pro','Georgia',serif",color:"#e8dcc8",padding:"2rem"}} onClick={()=>{setShowLangMenu(false);setShowThemeMenu(false);}}>
      <style>{globalStyles}</style>
      <HeaderBar/>
      <h2 style={{fontFamily:"'Cinzel',serif",color:th.accent,fontSize:"1.5rem",marginBottom:"1.75rem"}}>{t("playOnline")}</h2>
      <div style={{display:"flex",flexDirection:"column",gap:"0.9rem",width:"100%",maxWidth:"340px"}}>
        <div style={{background:"rgba(255,255,255,0.035)",border:`1px solid ${th.accent}22`,borderRadius:"12px",padding:"1.4rem"}}>
          <p style={{color:"#9a8a68",marginBottom:"0.9rem",fontSize:"0.85rem"}}>{t("createRoom")}</p>
          <button onClick={createRoom} style={{background:th.accent,color:th.bg,width:"100%",padding:"0.75rem",border:"none",borderRadius:"8px",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:"0.92rem",letterSpacing:".04em"}}>{t("createRoom")}</button>
        </div>
        <div style={{background:"rgba(255,255,255,0.035)",border:`1px solid ${th.accent}22`,borderRadius:"12px",padding:"1.4rem"}}>
          <p style={{color:"#9a8a68",marginBottom:"0.7rem",fontSize:"0.85rem"}}>{t("joinRoom")}</p>
          <input value={inputRoom} onChange={e=>setInputRoom(e.target.value.toUpperCase())} placeholder={t("roomCode")}
            style={{width:"100%",padding:"0.6rem 0.9rem",background:"rgba(0,0,0,0.45)",border:`1px solid ${th.accent}28`,borderRadius:"6px",color:"#e8dcc8",fontSize:"1rem",marginBottom:"0.65rem",fontFamily:"'Crimson Pro',serif"}}/>
          <button onClick={joinRoom} style={{background:"transparent",color:th.accent,border:`1px solid ${th.accent}`,width:"100%",padding:"0.65rem",borderRadius:"8px",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:"0.9rem"}}>{t("joinRoom")}</button>
        </div>
      </div>
      <button onClick={goMenu} style={{marginTop:"1.5rem",background:"none",border:"none",color:"#6a5a40",cursor:"pointer",fontSize:"0.9rem"}}>{t("back")}</button>
    </div>
  );

  // ═══════ PUZZLES ══════════
  if(screen==="puzzles"){
    const today=new Date().toISOString().slice(0,10);
    const todayCount=dailyPuzzleDate===today?dailyPuzzleCount:0;
    const hitLimit=!isPremium&&todayCount>=DAILY_PUZZLE_LIMIT;

    // If limit hit, show paywall immediately
    if(hitLimit){
      return(
        <div style={{minHeight:"100vh",background:th.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Crimson Pro','Georgia',serif",color:"#e8dcc8",padding:"2rem"}} onClick={()=>{setShowLangMenu(false);setShowThemeMenu(false);}}>
          <style>{globalStyles}</style>
          <HeaderBar/>
          <div style={{textAlign:"center",maxWidth:"360px",animation:"fadeUp .4s ease"}}>
            <div style={{fontSize:"3.5rem",marginBottom:"1rem"}}>🧩</div>
            <h2 style={{fontFamily:"'Cinzel',serif",color:"#f5c842",fontSize:"1.3rem",marginBottom:"0.6rem"}}>Limite quotidienne atteinte</h2>
            <p style={{color:"#7a6a50",fontSize:"0.88rem",marginBottom:"0.4rem"}}>
              Tu as résolu tes <b style={{color:"#f5c842"}}>{DAILY_PUZZLE_LIMIT} puzzles gratuits</b> d'aujourd'hui.
            </p>
            <p style={{color:"#6a5a40",fontSize:"0.8rem",marginBottom:"1.8rem"}}>
              Reviens demain, ou passe à <b style={{color:"#f5c842"}}>ChessBoost Premium</b> pour des puzzles illimités !
            </p>
            <button onClick={()=>window.open("paiement-paypal.html","_self")} style={{
              width:"100%",background:"linear-gradient(135deg,#f5c842,#f0a500)",color:"#1a1000",border:"none",
              padding:"0.85rem 1.6rem",borderRadius:"12px",cursor:"pointer",fontFamily:"'Cinzel',serif",
              fontSize:"0.95rem",fontWeight:700,boxShadow:"0 6px 20px rgba(245,200,66,0.4)",marginBottom:"0.8rem"
            }}>👑 Passer à Premium — $15.00</button>
            <button onClick={goMenu} style={{
              background:"none",border:`1px solid ${th.accent}28`,color:"#7a6a50",
              padding:"0.5rem 1.4rem",borderRadius:"8px",cursor:"pointer",fontFamily:"'Crimson Pro',serif",fontSize:"0.88rem",width:"100%"
            }}>{t("back")}</button>
          </div>
        </div>
      );
    }

    const pz=PUZZLES[puzzleIdx];
    const isSolved=solvedPuzzles.includes(pz.id);
    return(
      <div style={{minHeight:"100vh",background:th.bg,display:"flex",flexDirection:"column",alignItems:"center",fontFamily:"'Crimson Pro','Georgia',serif",color:"#e8dcc8",padding:"1rem"}} onClick={()=>{setShowLangMenu(false);setShowThemeMenu(false);}}>
        <style>{globalStyles}</style>
        <HeaderBar/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",maxWidth:"600px",marginBottom:"0.6rem"}}>
          <button onClick={goMenu} style={{background:"none",border:`1px solid ${th.accent}28`,color:"#7a6a50",padding:"0.38rem 0.75rem",borderRadius:"6px",cursor:"pointer",fontSize:"0.82rem"}}>{t("back")}</button>
          <h2 style={{fontFamily:"'Cinzel',serif",color:th.accent,fontSize:"1.15rem"}}>{t("puzzles_title")}</h2>
          <div style={{fontSize:"0.78rem",color:"#7a6a50"}}>
            {isPremium
              ? <span style={{color:"#f5c842"}}>👑 Illimité</span>
              : <span>{todayCount}<span style={{color:"#5a4a30"}}>/{DAILY_PUZZLE_LIMIT} aujourd'hui</span></span>
            }
          </div>
        </div>
        {/* Tabs */}
        <div style={{display:"flex",gap:"0.35rem",marginBottom:"0.65rem",flexWrap:"wrap",justifyContent:"center"}}>
          {PUZZLES.map((p,i)=>{
            const isLocked=!isPremium&&i>=todayCount&&!solvedPuzzles.includes(p.id);
            return(
              <div key={p.id} onClick={()=>{
                if(isLocked)return;
                setPuzzleIdx(i);setPuzzleStatus(null);setPuzzleSel(null);setPuzzleHigh([]);
              }} style={{
                cursor:isLocked?"not-allowed":"pointer",width:"34px",height:"34px",borderRadius:"50%",
                display:"flex",alignItems:"center",justifyContent:"center",
                background:i===puzzleIdx?th.accent:solvedPuzzles.includes(p.id)?"rgba(70,190,70,0.18)":isLocked?"rgba(255,255,255,0.02)":"rgba(255,255,255,0.05)",
                border:`2px solid ${i===puzzleIdx?th.accent:solvedPuzzles.includes(p.id)?"#50c060":isLocked?"#2a2a2a":"transparent"}`,
                color:i===puzzleIdx?th.bg:solvedPuzzles.includes(p.id)?"#50c060":isLocked?"#3a3a3a":"#7a6a50",
                fontFamily:"'Cinzel',serif",fontSize:"0.78rem",fontWeight:700,transition:"all .12s",
                opacity:isLocked?0.4:1,
              }}>{isLocked?"🔒":i+1}</div>
            );
          })}
        </div>
        {/* Progress bar */}
        {!isPremium&&(
          <div style={{width:"100%",maxWidth:"540px",marginBottom:"0.6rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.7rem",color:"#6a5a40",marginBottom:"3px"}}>
              <span>Puzzles today</span>
              <span style={{color:todayCount>=DAILY_PUZZLE_LIMIT?"#e05050":"#a89060"}}>{todayCount}/{DAILY_PUZZLE_LIMIT}</span>
            </div>
            <div style={{height:"4px",background:"rgba(255,255,255,0.06)",borderRadius:"2px",overflow:"hidden"}}>
              <div style={{height:"100%",width:`${Math.min(100,(todayCount/DAILY_PUZZLE_LIMIT)*100)}%`,background:todayCount>=DAILY_PUZZLE_LIMIT?"#e05050":th.accent,borderRadius:"2px",transition:"width .3s"}}/>
            </div>
          </div>
        )}
        {/* Info */}
        <div style={{
          width:"100%",maxWidth:"540px",background:"rgba(255,255,255,0.04)",
          border:`1px solid ${th.accent}22`,borderRadius:"10px",padding:"0.7rem 1rem",
          marginBottom:"0.5rem",display:"flex",justifyContent:"space-between",alignItems:"center"
        }}>
          <div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:"0.82rem",color:th.accent,marginBottom:"0.15rem"}}>
              Puzzle #{pz.id} · ELO: <b>{pz.elo}</b>
            </div>
            <div style={{fontSize:"0.82rem",color:"#907858",fontStyle:"italic"}}>{pz.desc[lang]||pz.desc.en}</div>
          </div>
          {isSolved&&<span style={{fontSize:"1.4rem"}}>✅</span>}
        </div>
        {/* Status */}
        <div style={{
          height:"26px",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"0.4rem",
          fontFamily:"'Cinzel',serif",fontSize:"0.88rem",
          color:puzzleStatus==="correct"?"#50d070":puzzleStatus==="wrong"?"#e05050":th.accent,
          animation:puzzleStatus?"fadeUp .2s ease":undefined
        }}>
          {puzzleStatus==="correct"?t("puzzleCorrect"):puzzleStatus==="wrong"?t("puzzleWrong"):t("puzzleSolve")}
        </div>
        {renderBoard(handlePuzzleClick,pz.board,puzzleSel,puzzleHigh,null,null,puzzleStatus==="correct")}
        {(puzzleStatus==="correct"||isSolved)&&puzzleIdx<PUZZLES.length-1&&(
          <button onClick={()=>{
            const nextCount=todayCount+1;
            if(!isPremium&&nextCount>=DAILY_PUZZLE_LIMIT){
              // Will hit the wall on next entry, just go to next puzzle; paywall shows on screen entry
            }
            setPuzzleIdx(i=>i+1);setPuzzleStatus(null);setPuzzleSel(null);setPuzzleHigh([]);
          }} style={{
            marginTop:"1rem",background:th.accent,color:th.bg,border:"none",
            padding:"0.65rem 2rem",borderRadius:"8px",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:"0.88rem",letterSpacing:".04em"
          }}>{t("puzzleNext")} →</button>
        )}
      </div>
    );
  }

  // ═══════ GAME ══════════
  const isCheckSq=(r,c)=>{const p=board[r][c];return p&&p[1]==="K"&&inCheck(board,cl(p));};
  return(
    <div style={{
      minHeight:"100vh",background:th.bg,display:"flex",flexDirection:"column",alignItems:"center",
      fontFamily:"'Crimson Pro','Georgia',serif",color:"#e8dcc8",padding:"0.75rem",paddingBottom:"1rem"
    }} onClick={()=>{setShowLangMenu(false);setShowThemeMenu(false);}}>
      <style>{globalStyles}</style>

      {/* ELO toast */}
      {showEloToast&&<div style={{
        position:"fixed",top:"4rem",right:"1rem",zIndex:300,
        background:eloChange?.includes("-")?"rgba(200,50,50,0.95)":"rgba(50,185,80,0.95)",
        color:"#fff",padding:"0.55rem 1.2rem",borderRadius:"20px",
        fontFamily:"'Cinzel',serif",fontSize:"0.88rem",fontWeight:700,
        boxShadow:"0 4px 20px rgba(0,0,0,0.5)",animation:"toastIn 3s forwards",pointerEvents:"none"
      }}>{eloChange?.includes("-")?`↓ ${eloChange} ELO`:`↑ ${eloChange} ELO`}</div>}

      <HeaderBar/>

      {/* Top strip */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",maxWidth:"580px",marginBottom:"0.45rem",gap:"0.5rem",flexWrap:"wrap"}}>
        <button onClick={goMenu} style={{background:"none",border:`1px solid ${th.accent}28`,color:"#7a6a50",padding:"0.32rem 0.7rem",borderRadius:"6px",cursor:"pointer",fontSize:"0.78rem"}}>{t("back")}</button>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:"0.82rem",color:th.accent,letterSpacing:".06em"}}>
          {gameMode==="bot"&&selectedBot?`vs ${selectedBot.name} · ${selectedBot.elo} ELO`:
           gameMode==="local"?t("playLocal"):
           `${t("playOnline")} · ${roomId}`}
        </div>
        {gameMode==="online"&&roomId&&<div style={{fontSize:"0.68rem",color:"#6a5a40",background:"rgba(0,0,0,0.3)",padding:"0.22rem 0.55rem",borderRadius:"5px"}}>Code: <b style={{color:th.accent}}>{roomId}</b></div>}
      </div>

      {/* Opponent */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",maxWidth:"540px",marginBottom:"0.28rem",padding:"0 0.2rem"}}>
        <div style={{fontSize:"0.72rem",color:"#6a5a40",minHeight:"16px",letterSpacing:".02em"}}>
          {capturedW.map((p,i)=><span key={i} style={{fontSize:"13px"}}>{PIECES[p]}</span>)}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
          {clockB>0&&<div style={{
            fontFamily:"monospace",fontSize:"1.05rem",fontWeight:700,
            background:turn==="b"?"rgba(0,0,0,0.6)":"rgba(0,0,0,0.25)",
            border:`1px solid ${turn==="b"?th.accent+"80":"transparent"}`,
            borderRadius:"6px",padding:"0.2rem 0.55rem",
            color:clockB<30&&turn==="b"?"#e05050":turn==="b"?th.accent:"#5a4a30",
            boxShadow:clockB<30&&turn==="b"?"0 0 8px rgba(220,50,50,0.4)":"none",
            transition:"color .3s"
          }}>{fmtTime(clockB)}</div>}
          <div style={{display:"flex",alignItems:"center",gap:"0.38rem"}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:"#222",border:"1px solid #7a6a50",boxShadow:turn==="b"?"0 0 8px rgba(130,130,200,.7)":"none"}}/>
            <span style={{fontSize:"0.7rem",fontFamily:"'Cinzel',serif",color:turn==="b"?th.accent:"#5a4a30",transition:"color .2s"}}>
              {gameMode==="bot"&&selectedBot?`${selectedBot.name} (${selectedBot.elo})`:
               gameMode==="online"?`${playerColor==="w"?"Opponent":"You (♟)"}`:t("turn_b")}
            </span>
            {aiThinking&&<span style={{fontSize:"0.65rem",color:th.accent,animation:"pulse 1s infinite"}}>●●●</span>}
          </div>
        </div>
      </div>

      {/* Status */}
      <div style={{
        display:"flex",alignItems:"center",gap:"0.45rem",marginBottom:"0.4rem",
        padding:"0.28rem 0.9rem",background:"rgba(0,0,0,0.4)",border:`1px solid ${th.accent}22`,borderRadius:"20px",
        fontSize:"0.82rem",
        color:isGameOver?th.accent:status===t("check")?"#f09040":"#a89060"
      }}>
        <div style={{width:8,height:8,borderRadius:"50%",background:turn==="w"?"#ede8d0":"#1a1a1a",border:`1px solid ${th.accent}60`,boxShadow:turn==="w"?"0 0 8px rgba(240,240,210,.6)":"none"}}/>
        {status||(turn==="w"?t("turn_w"):t("turn_b"))}
        {gameMode==="local"&&<span style={{marginLeft:"0.3rem",fontSize:"0.7rem",color:th.accent+"80"}}>🔄</span>}
      </div>

      {/* Board */}
      {renderBoard(handleClick,board,selected,highlights,lastMove,isCheckSq,false,boardFlipped)}

      {/* Player */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",maxWidth:"540px",marginTop:"0.28rem",padding:"0 0.2rem"}}>
        <div style={{fontSize:"0.72rem",color:"#6a5a40",minHeight:"16px"}}>
          {capturedB.map((p,i)=><span key={i} style={{fontSize:"13px"}}>{PIECES[p]}</span>)}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
          <div style={{display:"flex",alignItems:"center",gap:"0.38rem"}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:"#ede8d0",border:"1px solid #8a7a60",boxShadow:turn==="w"?"0 0 8px rgba(240,240,210,.7)":"none"}}/>
            <span style={{fontSize:"0.7rem",fontFamily:"'Cinzel',serif",color:turn==="w"?th.accent:"#5a4a30"}}>
              {t("yourElo")}: <b style={{color:badge.color}}>{userElo}</b>
            </span>
          </div>
          {clockW>0&&<div style={{
            fontFamily:"monospace",fontSize:"1.05rem",fontWeight:700,
            background:turn==="w"?"rgba(0,0,0,0.6)":"rgba(0,0,0,0.25)",
            border:`1px solid ${turn==="w"?th.accent+"80":"transparent"}`,
            borderRadius:"6px",padding:"0.2rem 0.55rem",
            color:clockW<30&&turn==="w"?"#e05050":turn==="w"?th.accent:"#5a4a30",
            boxShadow:clockW<30&&turn==="w"?"0 0 8px rgba(220,50,50,0.4)":"none",
            transition:"color .3s"
          }}>{fmtTime(clockW)}</div>}
        </div>
      </div>

      {/* Move log */}
      <div style={{
        marginTop:"0.45rem",width:"100%",maxWidth:"540px",maxHeight:"52px",overflowY:"auto",
        background:"rgba(0,0,0,0.22)",borderRadius:"6px",padding:"0.28rem 0.6rem",
        display:"flex",flexWrap:"wrap",gap:"0.1rem 0.35rem"
      }}>
        {moveLog.map((m,i)=>(
          <span key={i} style={{fontSize:"0.68rem",color:i%2===0?"#b8a870":"#807848",fontFamily:"monospace"}}>
            {i%2===0?`${Math.floor(i/2)+1}. `:""}{m}
          </span>
        ))}
      </div>

      {gameMode==="online"&&<div style={{marginTop:"0.4rem",fontSize:"0.68rem",color:"#4a3a28"}}>{t("syncing")} · {t("shareCode")}: <b style={{color:th.accent}}>{roomId}</b></div>}

      {/* Coach advice panel */}
      {gameMode==="coach"&&(
        <div style={{
          marginTop:"0.7rem",width:"100%",maxWidth:"540px",
          background:"linear-gradient(135deg,rgba(60,120,200,0.12),rgba(40,80,140,0.06))",
          border:"1px solid rgba(100,170,255,0.25)",borderRadius:"12px",
          padding:"0.75rem 1rem",
        }}>
          <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"0.4rem"}}>
            <span style={{fontSize:"1.1rem"}}>🎓</span>
            <span style={{fontFamily:"'Cinzel',serif",fontSize:"0.78rem",color:"#70c8ff",letterSpacing:".04em"}}>Conseil de l'Entraîneur</span>
            {coachLoading&&<span style={{fontSize:"0.65rem",color:"#70c8ff",animation:"pulse 1s infinite",marginLeft:"auto"}}>⏳ Analyse...</span>}
          </div>
          <div style={{
            fontSize:"0.82rem",color:"#b8d8f0",lineHeight:1.5,fontStyle:"italic",
            minHeight:"2.5rem",display:"flex",alignItems:"center"
          }}>
            {coachLoading?"L'entraîneur analyse la position...":coachAdvice||"Joue ton premier coup pour recevoir des conseils !"}
          </div>
        </div>
      )}

      {/* Game over overlay */}
      {isGameOver&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.78)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100}}>
          <div style={{
            background:"#0c0c0c",border:`2px solid ${th.accent}`,borderRadius:"18px",
            padding:"2rem 2.5rem",textAlign:"center",maxWidth:"300px",width:"90%",
            animation:"fadeUp .3s ease"
          }}>
            <div style={{fontSize:"3.5rem",marginBottom:"0.75rem"}}>
              {status.includes("mat")||status.includes("Mate")||status.includes("mate")?"🏆":"🤝"}
            </div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:"1rem",color:th.accent,marginBottom:"0.5rem",lineHeight:1.4}}>{status}</div>
            {eloChange&&<div style={{
              fontSize:"1.3rem",fontWeight:700,color:eloChange.startsWith("+")||!eloChange.includes("-")?"#50d070":"#e05050",marginBottom:"1.2rem"
            }}>{(eloChange.startsWith("+")||!eloChange.includes("-"))?"↑":"↓"} {eloChange} ELO → <span style={{color:"#ddd"}}>{userElo}</span></div>}
            <div style={{display:"flex",gap:"0.65rem",justifyContent:"center"}}>
              <button onClick={()=>startGame(gameMode,selectedBot)} style={{
                background:th.accent,color:th.bg,border:"none",padding:"0.6rem 1.4rem",borderRadius:"8px",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:"0.82rem",letterSpacing:".04em"
              }}>{t("newGame")}</button>
              <button onClick={goMenu} style={{
                background:"transparent",color:th.accent,border:`1px solid ${th.accent}`,padding:"0.6rem 1.4rem",borderRadius:"8px",cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:"0.82rem"
              }}>{t("back")}</button>
            </div>
          </div>
        </div>
      )}

      {/* Promo modal */}
      {promoModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.82)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100}}>
          <div style={{background:"#0f0f0f",border:`2px solid ${th.accent}`,borderRadius:"16px",padding:"1.75rem",textAlign:"center"}}>
            <p style={{fontFamily:"'Cinzel',serif",fontSize:"0.95rem",color:th.accent,marginBottom:"1.4rem"}}>{t("promote")}</p>
            <div style={{display:"flex",gap:"0.85rem",justifyContent:"center"}}>
              {["Q","R","B","N"].map(p=>(
                <div key={p} onClick={()=>handlePromo(p)} style={{
                  cursor:"pointer",fontSize:"3rem",padding:"0.5rem 0.6rem",
                  background:`${th.accent}12`,borderRadius:"10px",border:`1px solid ${th.accent}38`,transition:"all .12s",lineHeight:1
                }}
                onMouseEnter={e=>{e.currentTarget.style.background=`${th.accent}28`;e.currentTarget.style.transform="scale(1.1)";}}
                onMouseLeave={e=>{e.currentTarget.style.background=`${th.accent}12`;e.currentTarget.style.transform="scale(1)";}}>
                  {PIECES[(turn==="w"?"w":"b")+p]}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

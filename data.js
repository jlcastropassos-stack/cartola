// data.js — Times reais do Brasileirao 2026
// PLAYERS e MATCHES ainda são mock — serão substituídos pelos CSVs do Cartola

window.__CARTOLA_DATA = (() => {

  // ── TEAMS — IDs espelham clube_id do Cartola ──────────────────────
  const TEAMS = [
    { id: '262',  sigla: 'FLA', name: 'Flamengo',       color: '#c8102e', crest: 'img/flamengo.png' },
    { id: '263',  sigla: 'BOT', name: 'Botafogo',       color: '#1a1a1a', crest: 'img/botafogo.png' },
    { id: '264',  sigla: 'COR', name: 'Corinthians',    color: '#1a1a1a', crest: 'img/corinthians.png' },
    { id: '265',  sigla: 'BAH', name: 'Bahia',          color: '#1d4ba8', crest: 'img/bahia.png' },
    { id: '266',  sigla: 'FLU', name: 'Fluminense',     color: '#7a1f2b', crest: 'img/fluminense.png' },
    { id: '267',  sigla: 'VAS', name: 'Vasco',          color: '#1a1a1a', crest: 'img/vasco.png' },
    { id: '275',  sigla: 'PAL', name: 'Palmeiras',      color: '#0a6e3a', crest: 'img/palmeiras.png' },
    { id: '276',  sigla: 'SAO', name: 'São Paulo',      color: '#cf2027', crest: 'img/sao-paulo.png' },
    { id: '277',  sigla: 'SAN', name: 'Santos',         color: '#1a1a1a', crest: 'img/santos.png' },
    { id: '280',  sigla: 'RBB', name: 'Bragantino',     color: '#cc0000', crest: 'img/red-bull-bragantino.png' },
    { id: '282',  sigla: 'CAM', name: 'Atlético-MG',    color: '#1a1a1a', crest: 'img/atletico-mg.png' },
    { id: '283',  sigla: 'CRU', name: 'Cruzeiro',       color: '#1d4ba8', crest: 'img/cruzeiro.png' },
    { id: '284',  sigla: 'GRE', name: 'Grêmio',         color: '#1f6cb8', crest: 'img/gremio.png' },
    { id: '285',  sigla: 'INT', name: 'Internacional',  color: '#c8102e', crest: 'img/internacional.png' },
    { id: '287',  sigla: 'VIT', name: 'Vitória',        color: '#c8102e', crest: 'img/vitoria.png' },
    { id: '293',  sigla: 'CAP', name: 'Athletico-PR',   color: '#c8102e', crest: 'img/athletico-pr.png' },
    { id: '294',  sigla: 'CFC', name: 'Coritiba',       color: '#0a6e3a', crest: 'img/coritiba.png' },
    { id: '315',  sigla: 'CHA', name: 'Chapecoense',    color: '#0a6e3a', crest: 'img/chapecoense.png' },
    { id: '364',  sigla: 'REM', name: 'Remo',           color: '#1a1a7a', crest: 'img/remo.png' },
    { id: '2305', sigla: 'MIR', name: 'Mirassol',       color: '#0a6e3a', crest: 'img/mirassol.png' },
  ];

  const POSITIONS = [
    { id: 'gol', sigla: 'GOL', name: 'Goleiro' },
    { id: 'lat', sigla: 'LAT', name: 'Lateral' },
    { id: 'zag', sigla: 'ZAG', name: 'Zagueiro' },
    { id: 'mei', sigla: 'MEI', name: 'Meia' },
    { id: 'ata', sigla: 'ATA', name: 'Atacante' },
    { id: 'tec', sigla: 'TEC', name: 'Técnico' },
  ];

  // Mapeamento posicao_id Cartola → id interno
  const POS_MAP = { 1: 'gol', 2: 'lat', 3: 'zag', 4: 'mei', 5: 'ata', 6: 'tec' };

  const STATUSES = [
    { id: 'provavel',   label: 'Provável' },
    { id: 'duvida',     label: 'Dúvida' },
    { id: 'nulo',       label: 'Nulo' },
    { id: 'suspenso',   label: 'Suspenso' },
    { id: 'contundido', label: 'Contundido' },
  ];

  // Mapeamento status_id Cartola → id interno
  const STATUS_MAP = { 2: 'duvida', 3: 'suspenso', 5: 'contundido', 6: 'nulo', 7: 'provavel' };

  // ── PLAYERS — substituído pelos dados reais do Cartola via loadFromCSV()
  // Por enquanto: mock com nomes reais do /atletas/pontuados (rodada 13)
  // Cada jogador tem id = atleta_id do Cartola (string) — garante unicidade entre abas
  const PLAYERS_RAW = [
    // Flamengo
    { id: '99552',  name: 'Rossi',           position: 'gol', team: '262', price: 18.5, status: 'provavel', mediaPts: 8.2,  lastPts: 11.5, minToValue: 3.5 },
    { id: '84816',  name: 'Varela',          position: 'lat', team: '262', price: 12.1, status: 'provavel', mediaPts: 6.8,  lastPts: 8.4,  minToValue: 2.0 },
    { id: '88393',  name: 'Ayrton Lucas',    position: 'lat', team: '262', price: 10.3, status: 'provavel', mediaPts: 5.5,  lastPts: 6.5,  minToValue: 1.8 },
    { id: '83528',  name: 'Léo Pereira',     position: 'zag', team: '262', price: 9.8,  status: 'provavel', mediaPts: 5.2,  lastPts: 6.5,  minToValue: 1.5 },
    { id: '97900',  name: 'Vitão',           position: 'zag', team: '262', price: 7.2,  status: 'provavel', mediaPts: 4.1,  lastPts: 5.0,  minToValue: 1.2 },
    { id: '97867',  name: 'Léo Ortiz',       position: 'zag', team: '262', price: 8.5,  status: 'provavel', mediaPts: 4.8,  lastPts: 6.7,  minToValue: 1.4 },
    { id: '115914', name: 'Evertton Araújo', position: 'mei', team: '262', price: 11.2, status: 'provavel', mediaPts: 7.1,  lastPts: 10.0, minToValue: 2.2 },
    { id: '87863',  name: 'Arrascaeta',      position: 'mei', team: '262', price: 15.8, status: 'provavel', mediaPts: 8.9,  lastPts: 10.2, minToValue: 2.8 },
    { id: '80061',  name: 'Saúl',            position: 'mei', team: '262', price: 6.5,  status: 'duvida',   mediaPts: 3.2,  lastPts: 1.2,  minToValue: 0.8 },
    { id: '109096', name: 'Plata',           position: 'ata', team: '262', price: 14.2, status: 'provavel', mediaPts: 9.5,  lastPts: 14.4, minToValue: 3.0 },
    { id: '94583',  name: 'Pedro',           position: 'ata', team: '262', price: 16.9, status: 'provavel', mediaPts: 10.2, lastPts: 15.6, minToValue: 3.2 },
    { id: '98873',  name: 'Samuel Lino',     position: 'ata', team: '262', price: 10.5, status: 'provavel', mediaPts: 6.8,  lastPts: 12.0, minToValue: 2.1 },
    { id: '88963',  name: 'Leonardo Jardim', position: 'tec', team: '262', price: 8.2,  status: 'provavel', mediaPts: 5.5,  lastPts: 11.48,minToValue: 1.5 },
    // Botafogo
    { id: '68806',  name: 'Neto',            position: 'gol', team: '263', price: 6.5,  status: 'provavel', mediaPts: 3.2,  lastPts: 0.6,  minToValue: 0.8 },
    { id: '100898', name: 'Vitinho',         position: 'lat', team: '263', price: 8.2,  status: 'provavel', mediaPts: 5.1,  lastPts: 3.0,  minToValue: 1.2 },
    { id: '124481', name: 'Mateo Ponte',     position: 'lat', team: '263', price: 7.8,  status: 'provavel', mediaPts: 4.8,  lastPts: 5.7,  minToValue: 1.1 },
    { id: '105300', name: 'Ferraresi',       position: 'zag', team: '263', price: 6.2,  status: 'provavel', mediaPts: 3.5,  lastPts: 2.2,  minToValue: 0.9 },
    { id: '99274',  name: 'Alexander Barboza',position:'zag', team: '263', price: 7.1,  status: 'provavel', mediaPts: 4.0,  lastPts: 1.7,  minToValue: 1.0 },
    { id: '107231', name: 'Danilo',          position: 'mei', team: '263', price: 14.5, status: 'provavel', mediaPts: 9.8,  lastPts: 19.9, minToValue: 3.1 },
    { id: '109987', name: 'Medina',          position: 'mei', team: '263', price: 13.2, status: 'provavel', mediaPts: 8.5,  lastPts: 17.0, minToValue: 2.8 },
    { id: '111831', name: 'Matheus Martins', position: 'ata', team: '263', price: 9.5,  status: 'provavel', mediaPts: 5.8,  lastPts: 7.0,  minToValue: 1.5 },
    { id: '101002', name: 'Júnior Santos',   position: 'ata', team: '263', price: 7.2,  status: 'provavel', mediaPts: 4.1,  lastPts: 1.4,  minToValue: 0.9 },
    { id: '149990', name: 'Franclim Carvalho',position:'tec', team: '263', price: 5.8,  status: 'provavel', mediaPts: 3.9,  lastPts: 6.04, minToValue: 0.8 },
    // Corinthians
    { id: '121823', name: 'Kauê',            position: 'gol', team: '264', price: 11.5, status: 'provavel', mediaPts: 7.2,  lastPts: 13.6, minToValue: 2.5 },
    { id: '98720',  name: 'Angileri',        position: 'lat', team: '264', price: 7.8,  status: 'provavel', mediaPts: 4.5,  lastPts: 5.0,  minToValue: 1.1 },
    { id: '105531', name: 'Matheus Bidu',    position: 'lat', team: '264', price: 13.8, status: 'provavel', mediaPts: 9.2,  lastPts: 17.8, minToValue: 3.0 },
    { id: '69208',  name: 'Gabriel Paulista', position:'zag', team: '264', price: 8.5,  status: 'provavel', mediaPts: 5.1,  lastPts: 8.0,  minToValue: 1.4 },
    { id: '78248',  name: 'Gustavo Henrique', position:'zag', team: '264', price: 7.2,  status: 'provavel', mediaPts: 4.2,  lastPts: 6.1,  minToValue: 1.0 },
    { id: '117632', name: 'Garro',           position: 'mei', team: '264', price: 12.5, status: 'provavel', mediaPts: 7.8,  lastPts: 8.4,  minToValue: 2.2 },
    { id: '95556',  name: 'Raniele',         position: 'mei', team: '264', price: 9.2,  status: 'provavel', mediaPts: 5.5,  lastPts: 7.4,  minToValue: 1.5 },
    { id: '100652', name: 'Yuri Alberto',    position: 'ata', team: '264', price: 11.8, status: 'provavel', mediaPts: 6.9,  lastPts: 1.0,  minToValue: 2.0 },
    { id: '78435',  name: 'Vitinho',         position: 'ata', team: '264', price: 8.5,  status: 'provavel', mediaPts: 4.8,  lastPts: 4.3,  minToValue: 1.2 },
    { id: '72391',  name: 'Fernando Diniz',  position: 'tec', team: '264', price: 7.5,  status: 'provavel', mediaPts: 5.2,  lastPts: 8.06, minToValue: 1.2 },
    // Bahia
    { id: '71043',  name: 'Léo Vieira',      position: 'gol', team: '265', price: 7.2,  status: 'provavel', mediaPts: 4.1,  lastPts: 3.2,  minToValue: 0.9 },
    { id: '80313',  name: 'Gilberto',        position: 'lat', team: '265', price: 6.8,  status: 'provavel', mediaPts: 3.8,  lastPts: 1.2,  minToValue: 0.8 },
    { id: '107093', name: 'Luciano Juba',    position: 'lat', team: '265', price: 9.5,  status: 'provavel', mediaPts: 6.2,  lastPts: 10.5, minToValue: 1.8 },
    { id: '104783', name: 'Acevedo',         position: 'mei', team: '265', price: 10.2, status: 'provavel', mediaPts: 6.5,  lastPts: 7.4,  minToValue: 1.9 },
    { id: '109401', name: 'Erick Pulga',     position: 'ata', team: '265', price: 11.5, status: 'provavel', mediaPts: 7.2,  lastPts: 7.2,  minToValue: 2.1 },
    { id: '68996',  name: 'Willian José',    position: 'ata', team: '265', price: 9.8,  status: 'provavel', mediaPts: 5.9,  lastPts: 8.2,  minToValue: 1.6 },
    { id: '97341',  name: 'Rogério Ceni',    position: 'tec', team: '265', price: 6.5,  status: 'provavel', mediaPts: 4.2,  lastPts: 4.57, minToValue: 0.9 },
    // Fluminense
    { id: '37656',  name: 'Fábio',           position: 'gol', team: '266', price: 7.5,  status: 'provavel', mediaPts: 4.2,  lastPts: 1.6,  minToValue: 0.9 },
    { id: '101319', name: 'Guga',            position: 'lat', team: '266', price: 8.2,  status: 'provavel', mediaPts: 5.0,  lastPts: 3.0,  minToValue: 1.1 },
    { id: '87228',  name: 'Guilherme Arana', position: 'lat', team: '266', price: 9.1,  status: 'provavel', mediaPts: 5.5,  lastPts: 4.6,  minToValue: 1.4 },
    { id: '103523', name: 'Ignácio',         position: 'zag', team: '266', price: 6.8,  status: 'provavel', mediaPts: 3.9,  lastPts: 0.0,  minToValue: 0.8 },
    { id: '98672',  name: 'Savarino',        position: 'mei', team: '266', price: 13.5, status: 'provavel', mediaPts: 8.8,  lastPts: 13.1, minToValue: 2.9 },
    { id: '102928', name: 'Canobbio',        position: 'ata', team: '266', price: 12.8, status: 'provavel', mediaPts: 7.9,  lastPts: 10.4, minToValue: 2.5 },
    { id: '110759', name: 'John Kennedy',    position: 'ata', team: '266', price: 10.2, status: 'provavel', mediaPts: 6.1,  lastPts: 7.7,  minToValue: 1.8 },
    { id: '124424', name: 'Rodrigo Castillo',position: 'ata', team: '266', price: 9.5,  status: 'provavel', mediaPts: 5.8,  lastPts: 8.1,  minToValue: 1.5 },
    { id: '99366',  name: 'Luis Zubeldía',   position: 'tec', team: '266', price: 6.8,  status: 'provavel', mediaPts: 4.5,  lastPts: 7.04, minToValue: 1.0 },
    // Vasco
    { id: '87008',  name: 'Léo Jardim',      position: 'gol', team: '267', price: 8.5,  status: 'provavel', mediaPts: 4.8,  lastPts: 4.2,  minToValue: 1.1 },
    { id: '105584', name: 'Lucas Piton',     position: 'lat', team: '267', price: 7.2,  status: 'provavel', mediaPts: 4.1,  lastPts: 1.2,  minToValue: 0.9 },
    { id: '117330', name: 'Robert Renan',    position: 'zag', team: '267', price: 6.8,  status: 'provavel', mediaPts: 3.8,  lastPts: 1.4,  minToValue: 0.8 },
    { id: '111682', name: 'Adson',           position: 'mei', team: '267', price: 8.9,  status: 'provavel', mediaPts: 5.2,  lastPts: 3.8,  minToValue: 1.2 },
    { id: '99789',  name: 'Brenner',         position: 'ata', team: '267', price: 9.5,  status: 'provavel', mediaPts: 5.8,  lastPts: 4.4,  minToValue: 1.4 },
    { id: '41929',  name: 'Renato Gaúcho',   position: 'tec', team: '267', price: 6.2,  status: 'provavel', mediaPts: 4.0,  lastPts: 3.19, minToValue: 0.8 },
    // Palmeiras
    { id: '104084', name: 'Carlos Miguel',   position: 'gol', team: '275', price: 12.5, status: 'provavel', mediaPts: 7.8,  lastPts: 8.9,  minToValue: 2.5 },
    { id: '105175', name: 'Khellven',        position: 'lat', team: '275', price: 8.8,  status: 'provavel', mediaPts: 5.2,  lastPts: 5.0,  minToValue: 1.3 },
    { id: '124526', name: 'Giay',            position: 'lat', team: '275', price: 10.5, status: 'provavel', mediaPts: 6.5,  lastPts: 11.9, minToValue: 2.0 },
    { id: '145404', name: 'Arthur',          position: 'lat', team: '275', price: 9.8,  status: 'provavel', mediaPts: 5.9,  lastPts: 9.4,  minToValue: 1.7 },
    { id: '71684',  name: 'Gustavo Gómez',   position: 'zag', team: '275', price: 8.5,  status: 'provavel', mediaPts: 4.8,  lastPts: 4.4,  minToValue: 1.2 },
    { id: '104085', name: 'Bruno Fuchs',     position: 'zag', team: '275', price: 7.2,  status: 'provavel', mediaPts: 4.1,  lastPts: 5.0,  minToValue: 1.0 },
    { id: '112863', name: 'Ramón Sosa',      position: 'ata', team: '275', price: 11.5, status: 'provavel', mediaPts: 7.2,  lastPts: 7.0,  minToValue: 2.1 },
    { id: '113103', name: 'Flaco López',     position: 'ata', team: '275', price: 12.8, status: 'provavel', mediaPts: 8.1,  lastPts: 9.5,  minToValue: 2.5 },
    { id: '110506', name: 'Abel Ferreira',   position: 'tec', team: '275', price: 9.5,  status: 'provavel', mediaPts: 6.2,  lastPts: 7.85, minToValue: 1.8 },
    // São Paulo
    { id: '68928',  name: 'Rafael',          position: 'gol', team: '276', price: 9.2,  status: 'provavel', mediaPts: 5.5,  lastPts: 6.3,  minToValue: 1.4 },
    { id: '82775',  name: 'Lucas Ramon',     position: 'lat', team: '276', price: 10.5, status: 'provavel', mediaPts: 6.8,  lastPts: 11.2, minToValue: 2.1 },
    { id: '80570',  name: 'Wendell',         position: 'lat', team: '276', price: 11.8, status: 'provavel', mediaPts: 7.5,  lastPts: 13.7, minToValue: 2.5 },
    { id: '63008',  name: 'Rafael Tolói',    position: 'zag', team: '276', price: 8.8,  status: 'provavel', mediaPts: 5.2,  lastPts: 7.9,  minToValue: 1.5 },
    { id: '78946',  name: 'Dória',           position: 'zag', team: '276', price: 7.5,  status: 'provavel', mediaPts: 4.2,  lastPts: 5.0,  minToValue: 1.0 },
    { id: '80287',  name: 'Luciano',         position: 'ata', team: '276', price: 12.5, status: 'provavel', mediaPts: 7.9,  lastPts: 11.8, minToValue: 2.5 },
    { id: '95799',  name: 'Artur',           position: 'ata', team: '276', price: 10.2, status: 'provavel', mediaPts: 6.1,  lastPts: 6.9,  minToValue: 1.8 },
    { id: '79437',  name: 'Roger Machado',   position: 'tec', team: '276', price: 7.8,  status: 'provavel', mediaPts: 5.1,  lastPts: 8.29, minToValue: 1.2 },
    // Santos
    { id: '113690', name: 'Diógenes',        position: 'gol', team: '277', price: 6.5,  status: 'provavel', mediaPts: 3.5,  lastPts: 0.9,  minToValue: 0.7 },
    { id: '81150',  name: 'Mayke',           position: 'lat', team: '277', price: 7.8,  status: 'provavel', mediaPts: 4.5,  lastPts: 4.1,  minToValue: 1.0 },
    { id: '102975', name: 'Escobar',         position: 'lat', team: '277', price: 8.2,  status: 'provavel', mediaPts: 4.9,  lastPts: 4.0,  minToValue: 1.1 },
    { id: '102256', name: 'Rollheiser',      position: 'mei', team: '277', price: 13.5, status: 'provavel', mediaPts: 8.8,  lastPts: 15.4, minToValue: 2.9 },
    { id: '101807', name: 'Oliva',           position: 'mei', team: '277', price: 9.5,  status: 'provavel', mediaPts: 5.8,  lastPts: 4.0,  minToValue: 1.5 },
    { id: '42411',  name: 'Cuca',            position: 'tec', team: '277', price: 6.2,  status: 'provavel', mediaPts: 4.0,  lastPts: 4.28, minToValue: 0.8 },
    // Bragantino
    { id: '72018',  name: 'Tiago Volpi',     position: 'gol', team: '280', price: 7.8,  status: 'provavel', mediaPts: 4.5,  lastPts: 1.6,  minToValue: 1.0 },
    { id: '110715', name: 'Andrés Hurtado',  position: 'lat', team: '280', price: 8.5,  status: 'provavel', mediaPts: 5.0,  lastPts: 3.7,  minToValue: 1.2 },
    { id: '110750', name: 'Gustavo Marques', position: 'zag', team: '280', price: 7.2,  status: 'provavel', mediaPts: 4.1,  lastPts: 4.1,  minToValue: 0.9 },
    { id: '112886', name: 'Lucas Barbosa',   position: 'ata', team: '280', price: 10.5, status: 'provavel', mediaPts: 6.2,  lastPts: 7.0,  minToValue: 1.8 },
    { id: '39850',  name: 'Vagner Mancini',  position: 'tec', team: '280', price: 5.8,  status: 'provavel', mediaPts: 3.5,  lastPts: 3.41, minToValue: 0.7 },
    // Atlético-MG
    { id: '72294',  name: 'Everson',         position: 'gol', team: '282', price: 8.5,  status: 'provavel', mediaPts: 4.8,  lastPts: -0.1, minToValue: 1.1 },
    { id: '107554', name: 'Natanael',        position: 'lat', team: '282', price: 7.8,  status: 'provavel', mediaPts: 4.4,  lastPts: 2.6,  minToValue: 1.0 },
    { id: '147090', name: 'Kauã Pascini',    position: 'lat', team: '282', price: 6.5,  status: 'provavel', mediaPts: 3.8,  lastPts: 1.5,  minToValue: 0.8 },
    { id: '72605',  name: 'Vitor Hugo',      position: 'zag', team: '282', price: 7.2,  status: 'provavel', mediaPts: 4.0,  lastPts: 2.7,  minToValue: 0.9 },
    { id: '87999',  name: 'Gustavo Scarpa',  position: 'mei', team: '282', price: 9.5,  status: 'provavel', mediaPts: 5.5,  lastPts: 4.1,  minToValue: 1.5 },
    { id: '98909',  name: 'Cuello',          position: 'ata', team: '282', price: 11.2, status: 'provavel', mediaPts: 6.8,  lastPts: 8.7,  minToValue: 2.0 },
    { id: '92747',  name: 'Eduardo Domínguez',position:'tec', team: '282', price: 5.5,  status: 'provavel', mediaPts: 3.5,  lastPts: 2.96, minToValue: 0.7 },
    // Cruzeiro
    { id: '111690', name: 'Matheus Cunha',   position: 'gol', team: '283', price: 9.2,  status: 'provavel', mediaPts: 5.5,  lastPts: 5.8,  minToValue: 1.4 },
    { id: '112709', name: 'Kaiki Bruno',     position: 'lat', team: '283', price: 10.8, status: 'provavel', mediaPts: 6.5,  lastPts: 11.4, minToValue: 2.1 },
    { id: '143600', name: 'Kauã Moraes',     position: 'lat', team: '283', price: 8.5,  status: 'provavel', mediaPts: 5.0,  lastPts: 4.4,  minToValue: 1.2 },
    { id: '105047', name: 'João Marcelo',    position: 'zag', team: '283', price: 8.8,  status: 'provavel', mediaPts: 5.2,  lastPts: 6.9,  minToValue: 1.4 },
    { id: '124912', name: 'Jonathan Jesus',  position: 'zag', team: '283', price: 8.2,  status: 'provavel', mediaPts: 4.8,  lastPts: 5.9,  minToValue: 1.2 },
    { id: '89256',  name: 'Gerson',          position: 'mei', team: '283', price: 12.5, status: 'provavel', mediaPts: 7.8,  lastPts: 8.2,  minToValue: 2.4 },
    { id: '84558',  name: 'Lucas Romero',    position: 'mei', team: '283', price: 9.8,  status: 'provavel', mediaPts: 5.9,  lastPts: 7.1,  minToValue: 1.6 },
    { id: '132264', name: 'Arroyo',          position: 'ata', team: '283', price: 10.5, status: 'provavel', mediaPts: 6.2,  lastPts: 9.0,  minToValue: 1.8 },
    { id: '92811',  name: 'Bruno Rodrigues', position: 'ata', team: '283', price: 9.5,  status: 'provavel', mediaPts: 5.8,  lastPts: 7.5,  minToValue: 1.5 },
    { id: '127273', name: 'Artur Jorge',     position: 'tec', team: '283', price: 7.5,  status: 'provavel', mediaPts: 5.0,  lastPts: 7.21, minToValue: 1.1 },
    // Grêmio
    { id: '71631',  name: 'Weverton',        position: 'gol', team: '284', price: 11.5, status: 'provavel', mediaPts: 7.1,  lastPts: 10.7, minToValue: 2.3 },
    { id: '141594', name: 'Pedro Gabriel',   position: 'lat', team: '284', price: 8.8,  status: 'provavel', mediaPts: 5.2,  lastPts: 6.8,  minToValue: 1.3 },
    { id: '125467', name: 'Viery',           position: 'zag', team: '284', price: 9.5,  status: 'provavel', mediaPts: 5.8,  lastPts: 9.7,  minToValue: 1.6 },
    { id: '130048', name: 'Noriega',         position: 'zag', team: '284', price: 8.2,  status: 'provavel', mediaPts: 4.9,  lastPts: 8.5,  minToValue: 1.2 },
    { id: '141595', name: 'Gabriel Mec',     position: 'ata', team: '284', price: 11.2, status: 'provavel', mediaPts: 6.9,  lastPts: 11.0, minToValue: 2.1 },
    { id: '106104', name: 'Enamorado',       position: 'ata', team: '284', price: 9.8,  status: 'provavel', mediaPts: 5.9,  lastPts: 6.1,  minToValue: 1.5 },
    { id: '88037',  name: 'Luís Castro',     position: 'tec', team: '284', price: 7.2,  status: 'provavel', mediaPts: 4.8,  lastPts: 7.05, minToValue: 1.1 },
    // Internacional
    { id: '111683', name: 'Anthoni',         position: 'gol', team: '285', price: 9.5,  status: 'provavel', mediaPts: 5.8,  lastPts: 5.0,  minToValue: 1.5 },
    { id: '110426', name: 'Bernabei',        position: 'lat', team: '285', price: 10.8, status: 'provavel', mediaPts: 6.5,  lastPts: 9.6,  minToValue: 2.0 },
    { id: '97642',  name: 'Félix Torres',    position: 'zag', team: '285', price: 8.2,  status: 'provavel', mediaPts: 4.8,  lastPts: 2.9,  minToValue: 1.1 },
    { id: '68685',  name: 'Alan Patrick',    position: 'mei', team: '285', price: 10.5, status: 'provavel', mediaPts: 6.2,  lastPts: 2.5,  minToValue: 1.8 },
    { id: '105157', name: 'Villagra',        position: 'mei', team: '285', price: 8.8,  status: 'provavel', mediaPts: 5.1,  lastPts: 3.5,  minToValue: 1.3 },
    { id: '107989', name: 'Carbonero',       position: 'ata', team: '285', price: 11.5, status: 'provavel', mediaPts: 7.0,  lastPts: 8.9,  minToValue: 2.2 },
    { id: '101715', name: 'Alerrandro',      position: 'ata', team: '285', price: 9.2,  status: 'provavel', mediaPts: 5.5,  lastPts: 5.5,  minToValue: 1.4 },
    { id: '101960', name: 'Vitinho',         position: 'ata', team: '285', price: 10.1, status: 'provavel', mediaPts: 6.1,  lastPts: 4.5,  minToValue: 1.6 },
    { id: '115479', name: 'Paulo Pezzolano', position: 'tec', team: '285', price: 6.8,  status: 'provavel', mediaPts: 4.5,  lastPts: 4.35, minToValue: 1.0 },
    // Vitória
    { id: '104118', name: 'Lucas Arcanjo',   position: 'gol', team: '287', price: 9.8,  status: 'provavel', mediaPts: 5.9,  lastPts: 7.4,  minToValue: 1.6 },
    { id: '101597', name: 'Ramon',           position: 'lat', team: '287', price: 7.5,  status: 'provavel', mediaPts: 4.2,  lastPts: 3.0,  minToValue: 0.9 },
    { id: '100848', name: 'Luan Cândido',    position: 'lat', team: '287', price: 6.8,  status: 'provavel', mediaPts: 3.8,  lastPts: 1.5,  minToValue: 0.8 },
    { id: '103388', name: 'Emmanuel Martínez',position:'mei', team: '287', price: 9.2,  status: 'provavel', mediaPts: 5.5,  lastPts: 6.5,  minToValue: 1.4 },
    { id: '90703',  name: 'Matheuzinho',     position: 'mei', team: '287', price: 10.5, status: 'provavel', mediaPts: 6.2,  lastPts: 8.0,  minToValue: 1.9 },
    { id: '130209', name: 'Renê',            position: 'ata', team: '287', price: 11.8, status: 'provavel', mediaPts: 7.2,  lastPts: 12.5, minToValue: 2.3 },
    { id: '92180',  name: 'Jair Ventura',    position: 'tec', team: '287', price: 5.8,  status: 'provavel', mediaPts: 3.8,  lastPts: 4.29, minToValue: 0.8 },
    // Athletico-PR
    { id: '69012',  name: 'Santos',          position: 'gol', team: '293', price: 6.8,  status: 'provavel', mediaPts: 3.8,  lastPts: -0.7, minToValue: 0.8 },
    { id: '110668', name: 'Esquivel',        position: 'lat', team: '293', price: 7.5,  status: 'provavel', mediaPts: 4.2,  lastPts: 2.5,  minToValue: 1.0 },
    { id: '113113', name: 'Benavídez',       position: 'lat', team: '293', price: 8.2,  status: 'provavel', mediaPts: 4.8,  lastPts: 4.7,  minToValue: 1.1 },
    { id: '130843', name: 'Arthur Dias',     position: 'zag', team: '293', price: 7.2,  status: 'provavel', mediaPts: 4.0,  lastPts: 2.5,  minToValue: 0.9 },
    { id: '71536',  name: 'Luiz Gustavo',    position: 'mei', team: '293', price: 10.5, status: 'provavel', mediaPts: 6.2,  lastPts: 11.2, minToValue: 1.9 },
    { id: '143193', name: 'Viveros',         position: 'ata', team: '293', price: 13.8, status: 'provavel', mediaPts: 8.5,  lastPts: 21.1, minToValue: 3.0 },
    { id: '92273',  name: 'Odair Hellmann',  position: 'tec', team: '293', price: 7.0,  status: 'provavel', mediaPts: 4.5,  lastPts: 6.49, minToValue: 1.1 },
    // Coritiba
    { id: '110708', name: 'Pedro Rangel',    position: 'gol', team: '294', price: 8.5,  status: 'provavel', mediaPts: 5.0,  lastPts: 6.0,  minToValue: 1.2 },
    { id: '82628',  name: 'Tinga',           position: 'lat', team: '294', price: 6.8,  status: 'provavel', mediaPts: 3.8,  lastPts: 1.4,  minToValue: 0.8 },
    { id: '78855',  name: 'Thiago Santos',   position: 'zag', team: '294', price: 7.2,  status: 'provavel', mediaPts: 4.0,  lastPts: 3.1,  minToValue: 0.9 },
    { id: '112576', name: 'Vini Paulista',   position: 'mei', team: '294', price: 8.5,  status: 'provavel', mediaPts: 4.9,  lastPts: 1.8,  minToValue: 1.1 },
    { id: '123648', name: 'Lucas Ronier',    position: 'ata', team: '294', price: 9.8,  status: 'provavel', mediaPts: 5.8,  lastPts: 7.4,  minToValue: 1.5 },
    { id: '93988',  name: 'Breno Lopes',     position: 'ata', team: '294', price: 8.2,  status: 'provavel', mediaPts: 4.8,  lastPts: 4.0,  minToValue: 1.1 },
    { id: '126977', name: 'Fernando Seabra', position: 'tec', team: '294', price: 5.5,  status: 'provavel', mediaPts: 3.5,  lastPts: 2.51, minToValue: 0.7 },
    // Chapecoense
    { id: '102906', name: 'Anderson',        position: 'gol', team: '315', price: 10.5, status: 'provavel', mediaPts: 6.5,  lastPts: 11.5, minToValue: 2.0 },
    { id: '104470', name: 'Everton',         position: 'lat', team: '315', price: 6.8,  status: 'provavel', mediaPts: 3.8,  lastPts: 1.2,  minToValue: 0.8 },
    { id: '97969',  name: 'Marcos Vinícius', position: 'lat', team: '315', price: 7.2,  status: 'provavel', mediaPts: 4.0,  lastPts: 2.7,  minToValue: 0.9 },
    { id: '103987', name: 'Higor Meritão',   position: 'mei', team: '315', price: 8.8,  status: 'provavel', mediaPts: 5.1,  lastPts: 5.3,  minToValue: 1.2 },
    { id: '107516', name: 'Ênio',            position: 'ata', team: '315', price: 10.2, status: 'provavel', mediaPts: 6.0,  lastPts: 8.4,  minToValue: 1.8 },
    { id: '95332',  name: 'Marcinho',        position: 'ata', team: '315', price: 9.5,  status: 'provavel', mediaPts: 5.5,  lastPts: 6.5,  minToValue: 1.5 },
    { id: '107771', name: 'Fábio Matias',    position: 'tec', team: '315', price: 5.8,  status: 'provavel', mediaPts: 3.8,  lastPts: 3.48, minToValue: 0.8 },
    // Remo
    { id: '82730',  name: 'Marcelo Rangel',  position: 'gol', team: '364', price: 8.2,  status: 'provavel', mediaPts: 4.8,  lastPts: 5.5,  minToValue: 1.1 },
    { id: '97795',  name: 'Marcelinho',      position: 'lat', team: '364', price: 6.5,  status: 'provavel', mediaPts: 3.6,  lastPts: 1.5,  minToValue: 0.8 },
    { id: '101820', name: 'Mayk',            position: 'lat', team: '364', price: 7.0,  status: 'provavel', mediaPts: 3.9,  lastPts: 2.0,  minToValue: 0.9 },
    { id: '70666',  name: 'Marllon',         position: 'zag', team: '364', price: 7.5,  status: 'provavel', mediaPts: 4.2,  lastPts: 5.0,  minToValue: 1.0 },
    { id: '80196',  name: 'Yago Pikachu',    position: 'mei', team: '364', price: 8.8,  status: 'provavel', mediaPts: 5.1,  lastPts: 4.2,  minToValue: 1.2 },
    { id: '105048', name: 'Jajá',            position: 'ata', team: '364', price: 9.5,  status: 'provavel', mediaPts: 5.6,  lastPts: 4.8,  minToValue: 1.4 },
    { id: '101254', name: 'Alef Manga',      position: 'ata', team: '364', price: 8.8,  status: 'provavel', mediaPts: 5.1,  lastPts: 3.0,  minToValue: 1.2 },
    { id: '37457',  name: 'Léo Condé',       position: 'tec', team: '364', price: 5.5,  status: 'provavel', mediaPts: 3.5,  lastPts: 3.28, minToValue: 0.7 },
    // Mirassol
    { id: '51413',  name: 'Walter',          position: 'gol', team: '2305', price: 6.2,  status: 'provavel', mediaPts: 3.2,  lastPts: -1.0, minToValue: 0.6 },
    { id: '78850',  name: 'Reinaldo',        position: 'lat', team: '2305', price: 7.5,  status: 'provavel', mediaPts: 4.2,  lastPts: 3.8,  minToValue: 0.9 },
    { id: '106708', name: 'Igor Formiga',    position: 'lat', team: '2305', price: 6.8,  status: 'provavel', mediaPts: 3.8,  lastPts: 1.1,  minToValue: 0.8 },
    { id: '101908', name: 'Willian Machado', position: 'zag', team: '2305', price: 7.8,  status: 'provavel', mediaPts: 4.5,  lastPts: 4.2,  minToValue: 1.0 },
    { id: '97460',  name: 'João Victor',     position: 'zag', team: '2305', price: 7.2,  status: 'provavel', mediaPts: 4.0,  lastPts: 2.7,  minToValue: 0.9 },
    { id: '68708',  name: 'Eduardo',         position: 'mei', team: '2305', price: 8.5,  status: 'provavel', mediaPts: 4.9,  lastPts: 3.2,  minToValue: 1.1 },
    { id: '105903', name: 'Aldo Filho',      position: 'mei', team: '2305', price: 8.0,  status: 'provavel', mediaPts: 4.6,  lastPts: 3.7,  minToValue: 1.0 },
    { id: '97321',  name: 'Alesson',         position: 'ata', team: '2305', price: 8.8,  status: 'provavel', mediaPts: 5.1,  lastPts: 3.3,  minToValue: 1.2 },
    { id: '104027', name: 'Rafael Guanaes',  position: 'tec', team: '2305', price: 5.5,  status: 'provavel', mediaPts: 3.5,  lastPts: 2.23, minToValue: 0.7 },
  ];

  // Garante posição correta como string
  const PLAYERS = PLAYERS_RAW.map(p => ({ ...p }));

  // ── MATCHES — rodada 14 (atualizar manualmente a cada rodada) ──────
  // TODO: substituir pelos jogos reais quando confirmados
  const MATCHES = [
    { id: 'm1',  home: '262',  away: '275',  date: 'Sáb 20:30', venue: 'Maracanã' },
    { id: 'm2',  home: '264',  away: '276',  date: 'Sáb 18:30', venue: 'Neo Química' },
    { id: 'm3',  home: '282',  away: '283',  date: 'Sáb 16:00', venue: 'Arena MRV' },
    { id: 'm4',  home: '266',  away: '263',  date: 'Dom 16:00', venue: 'Maracanã' },
    { id: 'm5',  home: '284',  away: '285',  date: 'Dom 18:30', venue: 'Arena GRE' },
    { id: 'm6',  home: '267',  away: '265',  date: 'Dom 20:30', venue: 'São Januário' },
    { id: 'm7',  home: '280',  away: '287',  date: 'Sáb 21:00', venue: 'Nabi Abi Chedid' },
    { id: 'm8',  home: '293',  away: '277',  date: 'Dom 11:00', venue: 'Arena da Baixada' },
    { id: 'm9',  home: '294',  away: '315',  date: 'Dom 16:00', venue: 'Couto Pereira' },
    { id: 'm10', home: '364',  away: '2305', date: 'Dom 18:30', venue: 'Baenão' },
  ];

  // ── Funções de dados (mock até integração com CSVs) ───────────────

  function makeLast3(teamId, side) {
    const others = TEAMS.filter(t => t.id !== teamId);
    const seed = teamId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return [0, 1, 2].map(i => {
      const opp = others[(seed + i * 7) % others.length];
      const gf = (seed + i * 3) % 4;
      const ga = (seed + i * 5) % 4;
      const res = gf > ga ? 'W' : gf < ga ? 'L' : 'D';
      return { opp: opp.id, oppSigla: opp.sigla, gf, ga, res, side, round: 13 - i };
    });
  }

  function makeDefStats(teamId) {
    const seed = teamId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const r = (off, min, max) => +((((seed * off) % 100) / 100) * (max - min) + min).toFixed(1);
    return {
      gf: r(3, 0.5, 4.5),
      ga: r(7, 0.5, 4.0),
      cs: (seed + 2) % 3,
      xgFor: r(11, 0.5, 2.5),
      xgAg:  r(13, 0.4, 2.2),
      keeperSaves:    (seed % 6) + 2,
      keeperConceded: (seed % 5) + 3,
      shots:   (seed % 12) + 5,
      shotsAg: (seed % 11) + 4,
    };
  }

  function makeConcedeByPos(teamId) {
    const seed = teamId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const r = (off) => +((Math.sin(seed * off) + 1) * 7 + 2).toFixed(1);
    return { gol: r(1), lat: r(2), zag: r(3), mei: r(4), ata: r(5) };
  }

  // ── makeTop5 CORRIGIDO ────────────────────────────────────────────
  // Bug anterior: sortKey não-determinístico gerava IDs repetidos entre times.
  // Correção: sort 100% determinístico baseado no id do jogador + seed do time.
  function makeTop5(teamId) {
    const seed = teamId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const candidates = PLAYERS
      .filter(p => p.team !== teamId && p.position !== 'tec' && p.position !== 'gol')
      .map(p => {
        // sortKey determinístico: combina seed do time com id único do jogador
        const pidNum = parseInt(p.id, 10) || p.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        const sortKey = ((seed * 31 + pidNum * 17) % 9973) / 9973 + p.mediaPts * 0.1;
        return { p, sortKey };
      })
      .sort((a, b) => b.sortKey - a.sortKey)
      .slice(0, 5)
      .map(x => x.p);

    return candidates.map((p, i) => ({
      id: p.id,   // id real do Cartola — único entre todos os jogadores
      name: p.name,
      team: p.team,
      teamSigla: TEAMS.find(t => t.id === p.team)?.sigla || '',
      pos: p.position,
      pts: +((22 - i * 2.5) + ((seed + parseInt(p.id, 10) * 7) % 30) / 10).toFixed(1),
    }));
  }

  return {
    TEAMS,
    POSITIONS,
    STATUSES,
    PLAYERS,
    MATCHES,
    POS_MAP,
    STATUS_MAP,
    teamById:   (id) => TEAMS.find(t => t.id === String(id)),
    posById:    (id) => POSITIONS.find(p => p.id === id),
    statusById: (id) => STATUSES.find(s => s.id === id),
    makeLast3,
    makeDefStats,
    makeConcedeByPos,
    makeTop5,
  };
})();

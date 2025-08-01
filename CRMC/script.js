// Descriptions for why indicators relate to their capital and resilience source
const indicatorDescriptions = {
  // Financial capital
  'Household access to discretionary funds': 'This indicator relates to Financial capital as it measures the availability of extra funds households can use for resilience-building activities. It contributes to Resourcefulness by enabling flexible financial responses to unexpected events.',
  'Community financial health': 'This indicator is tied to Financial capital because it assesses the economic stability of the community, which supports resilience investments. It enhances Robustness by ensuring the community can withstand economic shocks from disasters.',
  'Local government financial capacity': 'This indicator reflects Financial capital through the local government’s ability to fund resilience programs. It supports Resourcefulness by providing the fiscal flexibility to allocate resources for disaster preparedness and recovery.',
  'Public infrastructure maintenance budget': 'This indicator belongs to Financial capital as it involves funding for infrastructure upkeep, critical for resilience. It contributes to Robustness by ensuring infrastructure remains functional during adverse events.',
  'Climate change adaptation planning and investment': 'This indicator is linked to Financial capital due to its focus on funding for adaptation strategies. It supports Robustness by preparing communities to endure climate-related challenges like floods and heatwaves.',
  'Business continuity during floods': 'This indicator relates to Financial capital by ensuring businesses can operate during floods, preserving economic stability. It contributes to Rapidity by enabling quick recovery and continuity of economic activities.',
  'Business continuity during heatwave': 'This indicator is tied to Financial capital through maintaining business operations during heatwaves. It supports Rapidity by facilitating rapid recovery to minimize economic disruptions.',
  'Household income continuity during flood': 'This indicator belongs to Financial capital as it focuses on maintaining household income during floods. It enhances Rapidity by ensuring quick restoration of financial stability for households.',
  'Household income continuity during heatwave': 'This indicator relates to Financial capital by supporting household income during heatwaves. It contributes to Rapidity by promoting swift economic recovery for families.',
  'Flood risk reduction investment': 'This indicator is linked to Financial capital through investments aimed at reducing flood risks. It supports Rapidity by enabling quick implementation of measures to mitigate flood impacts.',
  'Heatwave risk reduction investment': 'This indicator is related to Financial capital as it involves allocating resources to reduce heatwave risks. It contributes to Rapidity by enabling quick implementation of protective measures to lessen heatwave impacts.',
  'Disaster insurance': 'This indicator relates to Financial capital by providing financial compensation for disaster losses. It supports Rapidity by allowing faster recovery for households and businesses through timely payouts.',
  'Disaster recovery budget': 'This indicator reflects Financial capital as it designates funds for post-disaster recovery activities. It contributes to both Rapidity and Resourcefulness by enabling efficient and strategic disaster response.',
  'Heatwave action-plan budget': 'This indicator is tied to Financial capital due to budgeting for heatwave response plans. It supports Rapidity by funding timely interventions to protect health and livelihoods during extreme heat events.',

  // Human capital
  'Secondary school attendance': 'This indicator relates to Human capital as education builds skills and knowledge crucial for resilience. It supports Resourcefulness by enhancing the capacity of individuals and communities to adapt and innovate.',
  'Food availability': 'This indicator belongs to Human capital by ensuring adequate nutrition, which maintains physical and mental health. It contributes to Robustness by supporting well-being during and after disasters.',
  'First aid knowledge': 'This indicator is linked to Human capital as it equips individuals with emergency health response skills. It contributes to Resourcefulness by enabling immediate action during crises before professional help arrives.',
  'Awareness of the need for climate change action': 'This indicator relates to Human capital through increased understanding of climate risks. It supports Rapidity by encouraging prompt community response to climate challenges.',
  'Awareness of climate change risk on floods': 'This indicator is tied to Human capital as it raises knowledge about flood risks. It contributes to Robustness by helping communities prepare for and reduce flood impacts.',
  'Awareness of climate change risk on heatwaves': 'This indicator relates to Human capital by improving awareness of heatwave hazards. It supports Robustness by preparing individuals and communities to cope with heat-related risks.',
  'Awareness of how nature mitigates risk during floods': 'This indicator belongs to Human capital as understanding ecosystem services promotes sustainable risk reduction. It contributes to Redundancy by valuing natural approaches that complement engineered solutions.',
  'Awareness of how nature mitigates risk during heatwaves': 'This indicator relates to Human capital by increasing knowledge of natural cooling benefits. It supports Redundancy by encouraging use of vegetation and natural features to reduce heat impacts.',
  'Hazard exposure awareness': 'This indicator belongs to Human capital as it increases understanding of disaster exposure. It contributes to Resourcefulness by empowering individuals to take protective actions.',
  'Hazard vulnerability awareness': 'This indicator is related to Human capital by raising awareness of risk factors. It supports Resourcefulness by enabling informed decisions to reduce vulnerability.',
  'Evacuation and safety knowledge': 'This indicator relates to Human capital as it provides essential safety information. It contributes to Resourcefulness by improving people’s ability to respond effectively during emergencies.',
  'Unsafe water awareness': 'This indicator belongs to Human capital by promoting understanding of waterborne health risks. It supports Robustness by encouraging protective behaviors to maintain health.',
  'Heatwave protection knowledge': 'This indicator relates to Human capital by informing about coping strategies for extreme heat. It supports Resourcefulness by enabling proactive health and safety measures.',
  'Worker protection for heatwaves': 'This indicator is tied to Human capital through safeguarding labor force health. It contributes to Robustness by ensuring continued productivity during heatwaves.',

  // Natural capital
  'Tree cover': 'This indicator relates to Natural capital as tree coverage regulates temperature and manages stormwater. It supports Redundancy by providing natural buffers that complement built infrastructure.',
  'Permeable surfaces': 'This indicator is tied to Natural capital as it promotes water infiltration and reduces flooding. It contributes to Redundancy by enhancing natural absorption of rainfall.',
  'Land use planning': 'This indicator relates to Natural capital by guiding sustainable development that preserves ecosystems. It supports Redundancy by reducing exposure to disaster risks through informed land use.',
  'Resource management': 'This indicator belongs to Natural capital as effective management of water, soil, and forests strengthens resilience. It supports Resourcefulness by enabling adaptive use of natural resources during crises.',
  'Land/water interface health': 'This indicator relates to Natural capital by maintaining the ecological integrity of riverbanks and wetlands. It supports Redundancy by preserving natural flood defenses and erosion control.',
  'Ecological management for flood disaster risk reduction': 'This indicator is tied to Natural capital through conservation and restoration of ecosystems that mitigate flood risks. It supports Redundancy by providing alternative, nature-based flood protection.',
  'Ecological management for heatwave disaster risk reduction': 'This indicator relates to Natural capital by enhancing vegetation and landscapes to reduce heat impacts. It contributes to Redundancy by leveraging natural cooling systems to improve climate resilience.',

  // Physical capital
  'Energy supply continuity': 'This indicator relates to Physical capital as it ensures uninterrupted access to energy during disasters. It supports Redundancy by providing backup systems to maintain energy flow when primary sources fail.',
  'Transportation system continuity': 'This indicator belongs to Physical capital through maintaining transport infrastructure functionality. It supports Redundancy by ensuring alternative routes and modes are available during disruptions.',
  'Communication systems continuity': 'This indicator is tied to Physical capital as reliable communication is essential during emergencies. It contributes to Robustness by maintaining channels for timely information sharing.',
  'Flood early warning': 'This indicator reflects Physical capital by providing timely alerts for floods. It supports Rapidity by enabling quick community and institutional responses to impending hazards.',
  'Heatwave early warning': 'This indicator belongs to Physical capital through systems that forecast and notify about heatwaves. It enhances Rapidity by allowing preventive actions to reduce heat-related harm.',
  'Continuity of education during floods': 'This indicator relates to Physical capital as infrastructure supports ongoing learning despite floods. It contributes to Rapidity by minimizing educational disruption.',
  'Continuity of education during heatwaves': 'This indicator is tied to Physical capital through measures that keep schools operational during heatwaves. It supports Rapidity by sustaining educational activities in extreme heat conditions.',
  'Emergency infrastructure and supplies during floods': 'This indicator reflects Physical capital by ensuring availability of critical facilities and materials. It supports Rapidity by facilitating effective flood response.',
  'Emergency infrastructure and supplies during heatwaves': 'This indicator belongs to Physical capital through provision of facilities and resources to manage heatwave emergencies. It contributes to Rapidity by enabling timely support.',
  'Continuity of healthcare during disaster during floods': 'This indicator relates to Physical capital by maintaining healthcare services during floods. It supports Robustness by ensuring ongoing medical care.',
  'Continuity of healthcare during disaster during heatwaves': 'This indicator is tied to Physical capital as it ensures healthcare access during heatwaves. It supports Robustness by reducing health impacts of extreme heat.',
  'Forecasting for floods': 'This indicator reflects Physical capital by utilizing technology for flood predictions. It supports Rapidity by allowing anticipatory actions.',
  'Forecasting for heatwaves': 'This indicator belongs to Physical capital through use of forecasting systems for heatwaves. It contributes to Rapidity by enabling preventive measures.',
  'Household protection and adaptation on floods': 'This indicator relates to Physical capital as it involves physical measures households use to reduce flood damage. It supports Robustness by strengthening resistance to flood impacts.',
  'Household protection and adaptation on heatwaves': 'This indicator is tied to Physical capital through household-level adaptations to cope with heat. It contributes to Robustness by enhancing capacity to withstand heat stress.',
  'Availability of clean, safe water during floods': 'This indicator belongs to Physical capital by ensuring access to potable water amid floods. It supports Robustness by preventing waterborne diseases.',
  'Availability of clean, safe water during heatwaves': 'This indicator relates to Physical capital as access to safe water is critical during heatwaves. It supports Robustness by maintaining hydration and health.',
  'Waste management and risk': 'This indicator is tied to Physical capital through effective handling of waste to reduce health hazards. It contributes to Robustness by limiting secondary disaster impacts.',
  'Large scale flood protection': 'This indicator belongs to Physical capital as infrastructure such as levees reduce flood risk. It supports Robustness by protecting communities from floodwaters.',

  // Social capital
  'Mutual support': 'This indicator relates to Social capital by reflecting the strength of community networks that provide assistance during crises. It supports Resourcefulness by enabling collective action and recovery.',
  'Social inclusiveness of disaster risk management': 'This indicator belongs to Social capital by ensuring all groups participate in risk reduction efforts. It supports Resourcefulness by leveraging diverse perspectives and capacities.',
  'Community safety': 'This indicator relates to Social capital as it reflects collective efforts to maintain safe environments. It contributes to Robustness by reducing vulnerability to hazards.',
  'Local leadership': 'This indicator is tied to Social capital through effective leaders who mobilize communities. It supports Resourcefulness by coordinating preparedness and response activities.',
  'Disaster response personnel': 'This indicator belongs to Social capital as trained responders provide critical aid. It supports Robustness by enhancing community capacity to handle emergencies.',
  'Healthcare accessibility': 'This indicator relates to Social capital by measuring equitable access to medical services. It supports Robustness by improving community health and resilience.',
  'Trust in local authorities': 'This indicator is tied to Social capital as trust facilitates cooperation in disaster management. It supports Resourcefulness by encouraging compliance with risk reduction measures.',
  'Intra-community equity': 'This indicator relates to Social capital by promoting fairness within communities. It supports Resourcefulness by ensuring vulnerable groups receive necessary support.',
  'Inter-community equity': 'This indicator belongs to Social capital by fostering fair resource distribution between communities. It supports Resourcefulness by promoting regional cooperation in resilience building.',
  'Risk reduction planning for floods': 'This indicator relates to Social capital through participatory planning processes. It supports Rapidity by enabling effective flood risk mitigation.',
  'Risk reduction planning for heatwaves': 'This indicator belongs to Social capital as collaborative plans address heatwave risks. It supports Rapidity by facilitating timely interventions.',
  'Response planning for floods': 'This indicator is tied to Social capital through coordinated flood response strategies. It supports Rapidity by improving emergency action efficiency.',
  'Response planning for heatwaves': 'This indicator relates to Social capital by developing heatwave response frameworks. It supports Rapidity by enhancing readiness and response speed.',
  'Family violence and response planning during floods': 'This indicator belongs to Social capital as it addresses social risks exacerbated by floods. It supports Robustness by promoting protective measures.',
  'Family violence and response planning during heatwaves': 'This indicator relates to Social capital by recognizing and mitigating heatwave-related social stress. It supports Robustness by safeguarding vulnerable individuals.',
  'Stakeholder engagement in risk management for floods': 'This indicator reflects Social capital by involving diverse groups in flood risk efforts. It supports Resourcefulness by harnessing collective knowledge and capacity.',
  'Stakeholder engagement in risk management for heatwaves': 'This indicator belongs to Social capital through inclusive participation in heatwave risk actions. It supports Resourcefulness by fostering shared ownership and solutions.',
  'Flood risk mapping': 'This indicator relates to Social capital as community-involved mapping informs local understanding. It supports Rapidity by guiding targeted flood risk reduction.',
  'Heatwave risk mapping': 'This indicator is tied to Social capital through participatory heatwave hazard mapping. It supports Rapidity by enhancing community preparedness.',
  'Flood disaster impact data collection and use': 'This indicator belongs to Social capital by engaging communities in gathering and applying disaster data. It supports Resourcefulness by improving future risk management.',
  'Heatwave disaster impact data collection and use': 'This indicator relates to Social capital by involving stakeholders in documenting heatwave impacts. It supports Resourcefulness by informing adaptation and response planning.'
};

    // Full list of 76 indicators
    const indicators = [
      { id: 'Household access to discretionary funds', capital: 'Financial', resilience: 'Resourcefulness' },
      { id: 'Community financial health', capital: 'Financial', resilience: 'Robustness' },
      { id: 'Local government financial capacity', capital: 'Financial', resilience: 'Resourcefulness' },
      { id: 'Public infrastructure maintenance budget', capital: 'Financial', resilience: 'Robustness' },
      { id: 'Climate change adaptation planning and investment', capital: 'Financial', resilience: 'Robustness' },
      { id: 'Business continuity during floods', capital: 'Financial', resilience: 'Rapidity' },
      { id: 'Business continuity during heatwave', capital: 'Financial', resilience: 'Rapidity' },
      { id: 'Household income continuity during flood', capital: 'Financial', resilience: 'Rapidity' },
      { id: 'Household income continuity during heatwave', capital: 'Financial', resilience: 'Rapidity' },
      { id: 'Flood risk reduction investment', capital: 'Financial', resilience: 'Rapidity' },
      { id: 'Heatwave risk reduction investment', capital: 'Financial', resilience: 'Rapidity' },
      { id: 'Disaster insurance', capital: 'Financial', resilience: 'Rapidity' },
      { id: 'Disaster recovery budget', capital: 'Financial', resilience: 'Rapidity' },
      { id: 'Disaster recovery budget', capital: 'Financial', resilience: 'Resourcefulness' },
      { id: 'Heatwave action-plan budget', capital: 'Financial', resilience: 'Rapidity' },
      { id: 'Secondary school attendance', capital: 'Human', resilience: 'Resourcefulness' },
      { id: 'Food availability', capital: 'Human', resilience: 'Robustness' },
      { id: 'First aid knowledge', capital: 'Human', resilience: 'Resourcefulness' },
      { id: 'Awareness of the need for climate change action', capital: 'Human', resilience: 'Rapidity' },
      { id: 'Awareness of climate change risk on floods', capital: 'Human', resilience: 'Robustness' },
      { id: 'Awareness of climate change risk on heatwaves', capital: 'Human', resilience: 'Robustness' },
      { id: 'Awareness of how nature mitigates risk during floods', capital: 'Human', resilience: 'Redundancy' },
      { id: 'Awareness of how nature mitigates risk during heatwaves', capital: 'Human', resilience: 'Redundancy' },
      { id: 'Hazard exposure awareness', capital: 'Human', resilience: 'Resourcefulness' },
      { id: 'Hazard vulnerability awareness', capital: 'Human', resilience: 'Resourcefulness' },
      { id: 'Evacuation and safety knowledge', capital: 'Human', resilience: 'Resourcefulness' },
      { id: 'Unsafe water awareness', capital: 'Human', resilience: 'Robustness' },
      { id: 'Heatwave protection knowledge', capital: 'Human', resilience: 'Resourcefulness' },
      { id: 'Worker protection for heatwaves', capital: 'Human', resilience: 'Robustness' },
      { id: 'Tree cover', capital: 'Natural', resilience: 'Redundancy' },
      { id: 'Permeable surfaces', capital: 'Natural', resilience: 'Redundancy' },
      { id: 'Land use planning', capital: 'Natural', resilience: 'Redundancy' },
      { id: 'Resource management', capital: 'Natural', resilience: 'Resourcefulness' },
      { id: 'Land/water interface health', capital: 'Natural', resilience: 'Redundancy' },
      { id: 'Ecological management for flood disaster risk reduction', capital: 'Natural', resilience: 'Redundancy' },
      { id: 'Ecological management for heatwave disaster risk reduction', capital: 'Natural', resilience: 'Redundancy' },
      { id: 'Energy supply continuity', capital: 'Physical', resilience: 'Redundancy' },
      { id: 'Transportation system continuity', capital: 'Physical', resilience: 'Redundancy' },
      { id: 'Communication systems continuity', capital: 'Physical', resilience: 'Robustness' },
      { id: 'Flood early warning', capital: 'Physical', resilience: 'Rapidity' },
      { id: 'Heatwave early warning', capital: 'Physical', resilience: 'Rapidity' },
      { id: 'Continuity of education during floods', capital: 'Physical', resilience: 'Rapidity' },
      { id: 'Continuity of education during heatwaves', capital: 'Physical', resilience: 'Rapidity' },
      { id: 'Emergency infrastructure and supplies during floods', capital: 'Physical', resilience: 'Rapidity' },
      { id: 'Emergency infrastructure and supplies during heatwaves', capital: 'Physical', resilience: 'Rapidity' },
      { id: 'Continuity of healthcare during disaster during floods', capital: 'Physical', resilience: 'Robustness' },
      { id: 'Continuity of healthcare during disaster during heatwaves', capital: 'Physical', resilience: 'Robustness' },
      { id: 'Forecasting for floods', capital: 'Physical', resilience: 'Rapidity' },
      { id: 'Forecasting for heatwaves', capital: 'Physical', resilience: 'Rapidity' },
      { id: 'Household protection and adaptation on floods', capital: 'Physical', resilience: 'Robustness' },
      { id: 'Household protection and adaptation on heatwaves', capital: 'Physical', resilience: 'Robustness' },
      { id: 'Availability of clean, safe water during floods', capital: 'Physical', resilience: 'Robustness' },
      { id: 'Availability of clean, safe water during heatwaves', capital: 'Physical', resilience: 'Robustness' },
      { id: 'Waste management and risk', capital: 'Physical', resilience: 'Robustness' },
      { id: 'Large scale flood protection', capital: 'Physical', resilience: 'Robustness' },
      { id: 'Mutual support', capital: 'Social', resilience: 'Resourcefulness' },
      { id: 'Social inclusiveness of disaster risk management', capital: 'Social', resilience: 'Resourcefulness' },
      { id: 'Community safety', capital: 'Social', resilience: 'Robustness' },
      { id: 'Local leadership', capital: 'Social', resilience: 'Resourcefulness' },
      { id: 'Disaster response personnel', capital: 'Social', resilience: 'Robustness' },
      { id: 'Healthcare accessibility', capital: 'Social', resilience: 'Robustness' },
      { id: 'Trust in local authorities', capital: 'Social', resilience: 'Resourcefulness' },
      { id: 'Intra-community equity', capital: 'Social', resilience: 'Resourcefulness' },
      { id: 'Inter-community equity', capital: 'Social', resilience: 'Resourcefulness' },
      { id: 'Risk reduction planning for floods', capital: 'Social', resilience: 'Rapidity' },
      { id: 'Risk reduction planning for heatwaves', capital: 'Social', resilience: 'Rapidity' },
      { id: 'Response planning for floods', capital: 'Social', resilience: 'Rapidity' },
      { id: 'Response planning for heatwaves', capital: 'Social', resilience: 'Rapidity' },
      { id: 'Family violence and response planning during floods', capital: 'Social', resilience: 'Robustness' },
      { id: 'Family violence and response planning during heatwaves', capital: 'Social', resilience: 'Robustness' },
      { id: 'Stakeholder engagement in risk management for floods', capital: 'Social', resilience: 'Resourcefulness' },
      { id: 'Stakeholder engagement in risk management for heatwaves', capital: 'Social', resilience: 'Resourcefulness' },
      { id: 'Flood risk mapping', capital: 'Social', resilience: 'Rapidity' },
      { id: 'Heatwave risk mapping', capital: 'Social', resilience: 'Rapidity' },
      { id: 'Flood disaster impact data collection and use', capital: 'Social', resilience: 'Resourcefulness' },
      { id: 'Heatwave disaster impact data collection and use', capital: 'Social', resilience: 'Resourcefulness' }
    ];




// Disable right-click
document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  alert(currentLanguage === 'Nepali' ? 'दायाँ क्लिक यो पृष्ठमा निषेध गरिएको छ।' : 'Right-click is disabled on this page.');
});

// Block certain key combinations
document.addEventListener('keydown', function (e) {
  if (
    (e.ctrlKey && (e.key === 's' || e.key === 'S' || e.key === 'u' || e.key === 'U')) ||
    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) ||
    e.key === 'F12'
  ) {
    e.preventDefault();
    alert(currentLanguage === 'Nepali' ? 'यो कार्य यो पृष्ठमा निषेध गरिएको छ।' : 'This action is blocked on this page.');
  }
});

function openFullscreen() {
  const elem = document.documentElement; // whole page

  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { // Firefox
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { // IE/Edge
    elem.msRequestFullscreen();
  }
}

const gameContainer = document.getElementById('game-container');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart');
const modal = document.getElementById('modal');
const modalText = document.getElementById('modal-text');
const modalOkButton = document.getElementById('modal-ok');
const matchedList = document.getElementById('matched-list');
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');

const scorePlayer1 = document.getElementById('score-player1');
const scorePlayer2 = document.getElementById('score-player2');
const playerTurnDisplay = document.getElementById('player-turn');

const startScreen = document.getElementById('start-screen');
const startGameBtn = document.getElementById('start-game-btn');
const player1Input = document.getElementById('player1-name');
const player2Input = document.getElementById('player2-name');

const winnerSplash = document.getElementById('winner-splash');
const winnerMessage = document.getElementById('winner-message');
const winnerRestartBtn = document.getElementById('winner-restart-btn');

let tiles = [];
let selectedTiles = [];
let matchedTriplets = 0;

const capitals = ['Financial', 'Human', 'Social', 'Natural', 'Physical'];
const resilienceSources = ['Resourcefulness', 'Robustness', 'Rapidity', 'Redundancy'];

const NUM_INDICATORS_PER_GAME = 10;

let scores = [0, 0];
let currentPlayer = 1;

let playerNames = ["Player 1", "Player 2"];

let currentUtterance = null;  // Will hold current SpeechSynthesisUtterance if playing

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getRandomIndicators(allIndicators, count) {
  const shuffled = [...allIndicators].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function updateScoresDisplay() {
  scorePlayer1.textContent = scores[0];
  scorePlayer2.textContent = scores[1];
  playerTurnDisplay.textContent = `Current Turn: ${playerNames[currentPlayer - 1]}`;
  
  // Update scoreboard names dynamically
  scorePlayer1.previousElementSibling.textContent = playerNames[0];
  scorePlayer2.previousElementSibling.textContent = playerNames[1];
}

function switchPlayer() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updateScoresDisplay();
}

function initGame() {
  scores = [0, 0];
  currentPlayer = 1;
  matchedTriplets = 0;
  selectedTiles = [];
  message.textContent = '';
  modal.style.display = 'none';
  winnerSplash.style.display = 'none'; // Ensure splash screen is hidden
  matchedList.innerHTML = '';
  updateScoresDisplay();

  const selectedIndicators = getRandomIndicators(indicators, NUM_INDICATORS_PER_GAME);

  const tileSet = [];

  const capitalCounts = { 'Financial': 0, 'Human': 0, 'Social': 0, 'Natural': 0, 'Physical': 0 };
  const resilienceCounts = { 'Resourcefulness': 0, 'Robustness': 0, 'Rapidity': 0, 'Redundancy': 0 };

  selectedIndicators.forEach(indicator => {
    tileSet.push({ type: 'indicator', value: indicator.id, capital: indicator.capital, resilience: indicator.resilience });
    capitalCounts[indicator.capital]++;
    resilienceCounts[indicator.resilience]++;
  });

  capitals.forEach(capital => {
    for (let i = 0; i < capitalCounts[capital]; i++) {
      tileSet.push({ type: 'capital', value: capital });
    }
  });

  resilienceSources.forEach(resilience => {
    for (let i = 0; i < resilienceCounts[resilience]; i++) {
      tileSet.push({ type: 'resilience', value: resilience });
    }
  });

  tiles = shuffle([...tileSet]);

  gameContainer.innerHTML = '';
  tiles.forEach((tile, index) => {
    const tileElement = document.createElement('div');
    tileElement.classList.add('tile');
    tileElement.dataset.type = tile.type;
    tileElement.dataset.value = tile.value;

    if (tile.type === 'indicator') {
      tileElement.dataset.capital = tile.capital;
      tileElement.dataset.resilience = tile.resilience;
      tileElement.textContent = tile.value;
    } else if (tile.type === 'capital') {
      tileElement.innerHTML = `<i class="fas fa-piggy-bank"></i><div>${tile.value}</div>`;
    } else if (tile.type === 'resilience') {
      tileElement.innerHTML = `<i class="fas fa-bolt"></i><div>${tile.value}</div>`;
    }

    tileElement.dataset.index = index;
    tileElement.addEventListener('click', () => handleTileClick(tileElement));
    gameContainer.appendChild(tileElement);
  });
}

function vibrateTiles(tilesToVibrate) {
  tilesToVibrate.forEach(tile => tile.classList.add('vibrate'));
  setTimeout(() => {
    tilesToVibrate.forEach(tile => tile.classList.remove('vibrate'));
  }, 400);
}

function readDescription(text) {
  if (!('speechSynthesis' in window)) return;
  if (window.speechSynthesis.speaking) return;

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.rate = 1;
  currentUtterance.pitch = 1;
  window.speechSynthesis.speak(currentUtterance);

  currentUtterance.onend = () => {
    currentUtterance = null;
  };
}

function stopVoice() {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

function addMatchedTileToSidebar(indicator, capital, resilience) {
  const container = document.createElement('div');
  container.classList.add('matched-item');

  const title = document.createElement('div');
  title.classList.add('title');
  title.textContent = indicator;

  const details = document.createElement('div');
  details.classList.add('details');
  details.textContent = `Capital: ${capital}, Resilience: ${resilience}`;

  container.appendChild(title);
  container.appendChild(details);
  matchedList.appendChild(container);
}

function handleTileClick(tile) {
  // Stop voice immediately if playing and any tile clicked
  if (currentUtterance) {
    stopVoice();
  }

  if (tile.classList.contains('matched')) return;

  if (selectedTiles.includes(tile)) {
    // Unselect tile if already selected
    tile.classList.remove('selected');
    selectedTiles = selectedTiles.filter(t => t !== tile);
    return;
  }

  tile.classList.add('selected');
  selectedTiles.push(tile);

  if (selectedTiles.length === 3) {
    const types = selectedTiles.map(t => t.dataset.type);
    const hasIndicator = types.includes('indicator');
    const hasCapital = types.includes('capital');
    const hasResilience = types.includes('resilience');

    const indicatorTile = selectedTiles.find(t => t.dataset.type === 'indicator');
    const capitalTile = selectedTiles.find(t => t.dataset.type === 'capital');
    const resilienceTile = selectedTiles.find(t => t.dataset.type === 'resilience');

    if (
      hasIndicator && hasCapital && hasResilience &&
      capitalTile.dataset.value === indicatorTile.dataset.capital &&
      resilienceTile.dataset.value === indicatorTile.dataset.resilience
    ) {
      selectedTiles.forEach(t => t.classList.add('matched'));
      matchedTriplets++;

      modalText.innerHTML = '';

      const descriptionText = indicatorDescriptions[indicatorTile.dataset.value] || 
        `The indicator "${indicatorTile.dataset.value}" is related to ${indicatorTile.dataset.capital} capital and ${indicatorTile.dataset.resilience} resilience.`;
      
      const descPara = document.createElement('p');
      descPara.textContent = descriptionText;
      modalText.appendChild(descPara);

      const matchedTilesContainer = document.createElement('div');
      matchedTilesContainer.style.display = 'flex';
      matchedTilesContainer.style.justifyContent = 'center';
      matchedTilesContainer.style.gap = '10px';
      matchedTilesContainer.style.marginTop = '15px';

      selectedTiles.forEach(t => {
        const clone = t.cloneNode(true);
        clone.classList.remove('selected', 'matched');
        clone.style.pointerEvents = 'none';
        clone.style.opacity = '1';
        matchedTilesContainer.appendChild(clone);
      });

      modalText.appendChild(matchedTilesContainer);

      // Disable OK button initially
      modalOkButton.disabled = true;
      modalOkButton.style.opacity = '0.5';
      modalOkButton.style.cursor = 'not-allowed';

      modal.style.display = 'flex';

      // Play correct sound first, then description voice after it ends
      correctSound.currentTime = 0;
      correctSound.play();

      correctSound.onended = () => {
        readDescription(descriptionText);
        correctSound.onended = null;
      };

      // Enable OK button after 3 seconds
      setTimeout(() => {
        modalOkButton.disabled = false;
        modalOkButton.style.opacity = '1';
        modalOkButton.style.cursor = 'pointer';
      }, 3000);

      addMatchedTileToSidebar(indicatorTile.dataset.value, capitalTile.dataset.value, resilienceTile.dataset.value);

      scores[currentPlayer - 1]++;
      updateScoresDisplay();

      selectedTiles = [];

      if (matchedTriplets === tiles.length / 3) {
        // Determine winner based on higher score
        let winner;
        if (scores[0] > scores[1]) {
          winner = playerNames[0]; // Player 1 has higher score
        } else if (scores[1] > scores[0]) {
          winner = playerNames[1]; // Player 2 has higher score
        } else {
          winner = "It's a tie"; // Equal scores
        }
        winnerMessage.textContent = winner === "It's a tie" 
          ? `Game Over! It's a tie with both players at ${scores[0]} points!`
          : `Congratulations! ${winner} wins with a score of ${Math.max(scores[0], scores[1])}!`;
        modal.style.display = 'none';
        winnerSplash.style.display = 'flex';
        setTimeout(() => winnerSplash.classList.add('show'), 100); // Trigger animation
      } else {
        switchPlayer();
        message.textContent = '';
      }
    } else {
      vibrateTiles(selectedTiles);
      message.textContent = 'No match! Try again.';

      wrongSound.currentTime = 0;
      wrongSound.play();

      setTimeout(() => {
        selectedTiles.forEach(t => t.classList.remove('selected'));
        selectedTiles = [];
        message.textContent = '';
        switchPlayer();
      }, 800);
    }
  }
}

// Stop voice if user clicks anywhere on document (except modal OK button and winner restart button to avoid conflict)
document.addEventListener('click', (e) => {
  if (currentUtterance) {
    if (!modal.contains(e.target) || e.target === modalOkButton || e.target === winnerRestartBtn) {
      stopVoice();
    }
  }
});

modalOkButton.addEventListener('click', () => {
  if (!modalOkButton.disabled) {
    modal.style.display = 'none';
    stopVoice();
  }
});

restartButton.addEventListener('click', () => {
  stopVoice();
  initGame();
});

winnerRestartBtn.addEventListener('click', () => {
  stopVoice();
  winnerSplash.style.display = 'none';
  winnerSplash.classList.remove('show');
  initGame();
});

// Start game when clicking start button on start screen modal
startGameBtn.addEventListener('click', () => {
  // Use entered names or defaults
  const p1Name = player1Input.value.trim();
  const p2Name = player2Input.value.trim();

  playerNames[0] = p1Name !== '' ? p1Name : "Player 1";
  playerNames[1] = p2Name !== '' ? p2Name : "Player 2";

  // Hide start screen and show game UI
  startScreen.style.display = 'none';
  document.getElementById('main-container').style.display = 'flex';
  message.style.display = 'block';
  restartButton.style.display = 'inline-block';
  document.getElementById('sidebar').style.display = 'flex';

  initGame();
});

// On page load, show start screen modal and hide game UI
window.onload = () => {
  startScreen.style.display = 'flex';
  document.getElementById('main-container').style.display = 'none';
  message.style.display = 'none';
  restartButton.style.display = 'none';
  document.getElementById('sidebar').style.display = 'none';
  winnerSplash.style.display = 'none';
};
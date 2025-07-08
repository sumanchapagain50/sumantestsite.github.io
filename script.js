const cube = document.getElementById('cube');
const scene = document.getElementById('scene');
const descriptionBox = document.getElementById('description');
const faceTitle = document.getElementById('face-title');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');
const scoreDisplay = document.getElementById('score');
const hazardSelect = document.getElementById('hazard-select');
const gameLevelSelect = document.getElementById('gamelevel-select');
const languageSelect = document.getElementById('lang-select');
const startBtn = document.getElementById('start-btn');
const voiceToggle = document.getElementById('voice-toggle');
const dropBoxes = document.querySelectorAll('.drop-box');

let gameStarted = false;
let rotationX = -30;
let rotationY = -30;
let isDraggingCube = false;
let dragStart = { x: 0, y: 0 };
let currentRotation = { x: rotationX, y: rotationY };
let droppedTilesMap = {};
let tilePoints = {};
let visibleScore = false;
let selectedTile = null;
let originalPositions = {};
let lastTap = 0; // For double-tap detection
const doubleTapDelay = 300; // Time in ms for double-tap detection

const faceTitles = {
  front: "Mitigation",
  back: "Vulnerability",
  right: "Capacity",
  left: "Preparedness",
  top: "Response",
  bottom: "Recovery"
};

const floodActions = {
  Mitigation: [
    { text: "Construct levees", point: 8 },
    { text: "Improve drainage", point: 7 },
    { text: "Elevate homes", point: 9 },
    { text: "Rainwater harvesting", point: 5 },
    { text: "Permeable pavements", point: 4 },
    { text: "River widening", point: 6 },
    { text: "Dike reinforcement", point: 8 },
    { text: "Green infrastructure", point: 7 },
    { text: "Plant trees", point: 5 },
    { text: "Early warning systems", point: 9 },
    { text: "Flood zoning", point: 6 },
    { text: "Risk mapping", point: 7 },
    { text: "Retaining walls", point: 8 },
    { text: "Buffer zones", point: 6 },
    { text: "Check dams", point: 5 }
  ],
  Vulnerability: [
    { text: "Low-income areas", point: 7 },
    { text: "Informal settlements", point: 8 },
    { text: "No insurance", point: 9 },
    { text: "Elderly population", point: 6 },
    { text: "Children in school", point: 5 },
    { text: "Disabled people", point: 6 },
    { text: "Marginalized groups", point: 7 },
    { text: "Lack of documents", point: 5 },
    { text: "Poor housing", point: 8 },
    { text: "Riverbank dwellers", point: 7 },
    { text: "Tenants", point: 5 },
    { text: "Isolated villages", point: 6 },
    { text: "Women-headed households", point: 7 },
    { text: "No savings", point: 5 },
    { text: "Migrants", point: 6 }
  ],
  Capacity: [
    { text: "Boats", point: 8 },
    { text: "First aid kits", point: 7 },
    { text: "Life jackets", point: 9 },
    { text: "Rescue teams", point: 8 },
    { text: "Food stockpiles", point: 6 },
    { text: "Rescue drills", point: 7 },
    { text: "Community radios", point: 5 },
    { text: "Power backup", point: 6 },
    { text: "Inflatable rafts", point: 8 },
    { text: "Water purifiers", point: 7 },
    { text: "Flashlights", point: 5 },
    { text: "Evacuation ladders", point: 6 },
    { text: "Emergency response teams", point: 9 },
    { text: "Sandbags", point: 7 },
    { text: "Generators", point: 6 }
  ],
  Preparedness: [
    { text: "Evacuation plans", point: 9 },
    { text: "Mock drills", point: 8 },
    { text: "Community groups", point: 7 },
    { text: "Flood awareness", point: 6 },
    { text: "School education", point: 5 },
    { text: "SMS alerts", point: 7 },
    { text: "Volunteer training", point: 6 },
    { text: "Hazard boards", point: 5 },
    { text: "Emergency contact list", point: 6 },
    { text: "Family preparedness", point: 7 },
    { text: "Risk communication", point: 8 },
    { text: "Early alert signs", point: 7 },
    { text: "Safe routes", point: 6 },
    { text: "Flood drills", point: 8 },
    { text: "Assembly points", point: 6 }
  ],
  Response: [
    { text: "Immediate rescue", point: 9 },
    { text: "Temporary shelter", point: 8 },
    { text: "Medical aid", point: 9 },
    { text: "Food distribution", point: 7 },
    { text: "Water supply", point: 8 },
    { text: "Family tracing", point: 6 },
    { text: "Help desks", point: 5 },
    { text: "Communication setup", point: 7 },
    { text: "Volunteer mobilization", point: 6 },
    { text: "Public announcements", point: 5 },
    { text: "Bridge repair", point: 6 },
    { text: "Debris clearance", point: 7 },
    { text: "Health checks", point: 6 },
    { text: "Evacuation support", point: 7 },
    { text: "Psychological aid", point: 5 }
  ],
  Recovery: [
    { text: "Rebuild homes", point: 9 },
    { text: "Restore schools", point: 7 },
    { text: "Compensation", point: 8 },
    { text: "Drainage fix", point: 7 },
    { text: "Livelihood support", point: 8 },
    { text: "Cash for work", point: 6 },
    { text: "Crop recovery", point: 7 },
    { text: "Housing grants", point: 7 },
    { text: "Water system repair", point: 6 },
    { text: "Health services", point: 7 },
    { text: "Sanitation facilities", point: 6 },
    { text: "Social protection", point: 5 },
    { text: "Skill training", point: 6 },
    { text: "Loan waivers", point: 7 },
    { text: "Infrastructure rehab", point: 8 }
  ]
};

const actionDescriptions = {
  "Construct levees": "Build embankments along rivers to prevent floodwater from inundating nearby areas.",
  "Improve drainage": "Enhance urban drainage systems to quickly channel excess rainwater away from vulnerable zones.",
  "Elevate homes": "Raise buildings on stilts or foundations to protect them from floodwater inundation.",
  "Rainwater harvesting": "Collect and store rainwater to reduce runoff and mitigate urban flooding.",
  "Permeable pavements": "Use porous materials for roads and walkways to allow water to infiltrate, reducing surface runoff.",
  "River widening": "Expand river channels to increase their capacity to handle heavy water flows during floods.",
  "Dike reinforcement": "Strengthen existing dikes with materials like concrete or earth to withstand flood pressures.",
  "Green infrastructure": "Implement natural solutions like wetlands or rain gardens to absorb and manage floodwater.",
  "Plant trees": "Plant trees in strategic areas to stabilize soil and reduce runoff by absorbing water.",
  "Early warning systems": "Install systems to monitor rainfall and river levels, alerting communities to potential floods.",
  "Flood zoning": "Designate flood-prone areas for restricted development to minimize risk to people and property.",
  "Risk mapping": "Create detailed maps identifying flood risk zones to guide planning and preparedness.",
  "Retaining walls": "Construct walls to hold back floodwater and protect infrastructure in low-lying areas.",
  "Buffer zones": "Establish natural or undeveloped areas along rivers to absorb floodwater and reduce impact.",
  "Check dams": "Build small dams in streams to slow water flow and reduce downstream flooding.",
  "Low-income areas": "Low-income communities often lack resources to recover from floods, increasing their vulnerability.",
  "Informal settlements": "Unplanned settlements in flood-prone areas face high risk due to poor infrastructure.",
  "No insurance": "Households without flood insurance struggle to recover financially after flood damage.",
  "Elderly population": "Older individuals may face mobility or health challenges, making evacuation difficult during floods.",
  "Children in school": "Children in schools may require special evacuation plans due to their dependence on adults.",
  "Disabled people": "People with disabilities may need tailored assistance to evacuate or access flood relief.",
  "Marginalized groups": "Socially excluded groups often face barriers to accessing flood preparedness resources.",
  "Lack of documents": "Residents without legal documents may struggle to access aid or prove property ownership post-flood.",
  "Poor housing": "Homes made of weak materials are easily damaged or destroyed by floodwaters.",
  "Riverbank dwellers": "Communities living near rivers face heightened flood risk due to their proximity to water.",
  "Tenants": "Renters may lack authority to make flood-proofing changes to their homes, increasing vulnerability.",
  "Isolated villages": "Remote villages may be cut off from aid and rescue during floods due to poor connectivity.",
  "Women-headed households": "Single mothers may face economic and social challenges in preparing for or recovering from floods.",
  "No savings": "Households without savings struggle to rebuild or replace losses after a flood.",
  "Migrants": "Migrants may lack local knowledge or access to flood warnings and support networks.",
  "Boats": "Availability of boats enables rescue and transport during flood events in inundated areas.",
  "First aid kits": "First aid kits provide immediate medical support for injuries during flood emergencies.",
  "Life jackets": "Life jackets ensure safety for individuals navigating floodwaters during evacuations.",
  "Rescue teams": "Trained rescue teams are critical for saving lives in flooded areas.",
  "Food stockpiles": "Stored food supplies ensure communities have access to nutrition during flood disruptions.",
  "Rescue drills": "Regular drills improve community readiness for efficient flood rescue operations.",
  "Community radios": "Radios provide a reliable communication channel for flood updates in remote areas.",
  "Power backup": "Backup power sources like generators maintain critical services during flood-related outages.",
  "Inflatable rafts": "Inflatable rafts offer a portable solution for rescuing people from flooded zones.",
  "Water purifiers": "Water purifiers ensure access to clean drinking water during flood contamination.",
  "Flashlights": "Flashlights aid visibility for rescue and navigation in flood-affected areas at night.",
  "Evacuation ladders": "Ladders facilitate safe evacuation from upper floors of flooded buildings.",
  "Emergency response teams": "Specialized teams coordinate rapid response to flood emergencies, saving lives.",
  "Sandbags": "Sandbags create temporary barriers to divert or block floodwater from entering homes.",
  "Generators": "Generators provide power for essential equipment during flood-related outages.",
  "Evacuation plans": "Detailed plans outline safe routes and procedures for leaving flood-prone areas.",
  "Mock drills": "Simulated flood exercises train communities to respond effectively during real events.",
  "Community groups": "Organized local groups coordinate flood preparedness and response efforts.",
  "Flood awareness": "Public campaigns educate residents about flood risks and safety measures.",
  "School education": "Teaching children about flood risks prepares future generations for safety.",
  "SMS alerts": "Text message alerts provide timely warnings about impending flood risks.",
  "Volunteer training": "Trained volunteers support flood response efforts like evacuation and aid distribution.",
  "Hazard boards": "Signage in flood-prone areas warns residents and guides safe behavior.",
  "Emergency contact list": "A list of key contacts ensures quick communication during flood emergencies.",
  "Family preparedness": "Families plan and practice flood response strategies to stay safe.",
  "Risk communication": "Clear messaging informs communities about flood risks and protective actions.",
  "Early alert signs": "Visual or audible signals warn residents of rising water levels in advance.",
  "Safe routes": "Identified safe evacuation routes guide residents away from flood dangers.",
  "Flood drills": "Regular flood-specific drills improve community response time and coordination.",
  "Assembly points": "Designated safe gathering spots help organize evacuees during floods.",
  "Immediate rescue": "Swift rescue operations save lives trapped in floodwaters or damaged buildings.",
  "Temporary shelter": "Shelters provide safe, dry places for displaced people during floods.",
  "Medical aid": "Emergency medical care treats injuries and health issues caused by floods.",
  "Food distribution": "Organized food delivery ensures flood victims have access to meals.",
  "Water supply": "Clean water distribution prevents dehydration and disease during floods.",
  "Family tracing": "Services help reunite families separated during flood evacuations.",
  "Help desks": "Information desks provide guidance and resources to flood-affected individuals.",
  "Communication setup": "Temporary communication systems keep responders and victims connected.",
  "Volunteer mobilization": "Volunteers are quickly organized to assist with flood response tasks.",
  "Public announcements": "Broadcasts inform communities about flood updates and safety instructions.",
  "Bridge repair": "Quick repairs to bridges restore access for rescue and relief efforts.",
  "Debris clearance": "Removing flood debris clears paths for rescue and recovery operations.",
  "Health checks": "Medical screenings prevent disease outbreaks in flood-affected areas.",
  "Evacuation support": "Assistance ensures safe and efficient evacuation during flood events.",
  "Psychological aid": "Counseling supports mental health for those traumatized by floods.",
  "Rebuild homes": "Reconstructing flood-damaged homes restores safe living conditions for residents.",
  "Restore schools": "Repairing schools ensures children can resume education after floods.",
  "Compensation": "Financial aid helps flood victims recover losses and rebuild their lives.",
  "Drainage fix": "Restoring drainage systems prevents future flooding in affected areas.",
  "Livelihood support": "Programs help flood victims regain jobs or start new income sources.",
  "Cash for work": "Paid work programs provide income while rebuilding flood-damaged areas.",
  "Crop recovery": "Support for farmers to replant crops damaged by floods ensures food security.",
  "Housing grants": "Grants fund repairs or new homes for flood-affected families.",
  "Water system repair": "Fixing water infrastructure ensures clean water access post-flood.",
  "Health services": "Restored medical facilities provide care for flood-related health issues.",
  "Sanitation facilities": "Rebuilding sanitation systems prevents disease after floodwaters recede.",
  "Social protection": "Policies support vulnerable groups with aid and resources post-flood.",
  "Skill training": "Training programs help flood victims learn new skills for employment.",
  "Loan waivers": "Canceling debts helps flood-affected individuals recover financially.",
  "Infrastructure rehab": "Restoring roads, bridges, and utilities rebuilds community resilience."
};

function updateCubeRotation() {
  cube.style.transform = `rotateX(${currentRotation.x}deg) rotateY(${currentRotation.y}deg)`;
}

function rotateCube(direction) {
  const angle = 30;
  if (direction === 'horizontal') {
    currentRotation.y += angle;
  } else if (direction === 'vertical') {
    currentRotation.x += angle;
  }
  rotationX = currentRotation.x;
  rotationY = currentRotation.y;
  updateCubeRotation();
}

function resetCube() {
  resetBtn.onclick();
}

scene.addEventListener('touchstart', (e) => {
  e.preventDefault();
  isDraggingCube = true;
  dragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
});

scene.addEventListener('touchmove', (e) => {
  if (!isDraggingCube) return;
  e.preventDefault();
  const dx = e.touches[0].clientX - dragStart.x;
  const dy = e.touches[0].clientY - dragStart.y;
  currentRotation.x = rotationX - dy * 0.5;
  currentRotation.y = rotationY + dx * 0.5;
  updateCubeRotation();
});

scene.addEventListener('touchend', () => {
  isDraggingCube = false;
  rotationX = currentRotation.x;
  rotationY = currentRotation.y;
});

scene.addEventListener('mousedown', (e) => {
  isDraggingCube = true;
  dragStart = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mouseup', () => {
  isDraggingCube = false;
  rotationX = currentRotation.x;
  rotationY = currentRotation.y;
});

scene.addEventListener('mousemove', (e) => {
  if (!isDraggingCube) return;
  const dx = e.clientX - dragStart.x;
  const dy = e.clientY - dragStart.y;
  currentRotation.x = rotationX - dy * 0.5;
  currentRotation.y = rotationY + dx * 0.5;
  updateCubeRotation();
});

document.addEventListener('mousedown', () => {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
});

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function populateCube() {
  cube.innerHTML = '';
  const isHardMode = gameStarted && gameLevelSelect.value === 'Hard';
  originalPositions = {};

  const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
  faces.forEach(face => {
    const faceElement = document.createElement('div');
    faceElement.classList.add('face', face);
    faceElement.classList.toggle('game-started', gameStarted);
    faceElement.classList.toggle('hard-mode', isHardMode);
    cube.appendChild(faceElement);

    const dropBox = document.querySelector(`#drop-${face}`);
    if (dropBox) {
      dropBox.classList.toggle('game-started', gameStarted);
      dropBox.classList.toggle('hard-mode', isHardMode);
    }
  });

  for (const face of Object.keys(faceTitles)) {
    const faceDiv = cube.querySelector(`.face.${face}`);
    if (!faceDiv) continue;
    const title = faceTitles[face];

    let tilesData = [];
    if (gameStarted) {
      tilesData = shuffleArray(floodActions[title]).slice(0, 9);
      tilesData.forEach(({ text, point }, index) => {
        tilePoints[text] = point;
        originalPositions[text] = { face, index };
      });
    } else {
      tilesData = Array(9).fill({ text: '', point: 0 });
    }

    tilesData.forEach(({ text }, index) => {
      const tile = document.createElement('div');
      tile.classList.add('tile');
      tile.textContent = text;
      if (gameStarted && text) {
        tile.setAttribute('data-key', text);
        tile.setAttribute('draggable', 'false');
        tile.classList.remove('draggable');
        tile.style.cursor = 'default';
      } else {
        tile.style.cursor = 'not-allowed';
      }
      faceDiv.appendChild(tile);
    });
  }

  faceTitle.textContent = gameStarted ? `Game started for: ${hazardSelect.value}` : "Select hazard and start the game";
  descriptionBox.textContent = "Click or tap on a tile to see description here.";
  scoreDisplay.textContent = '';
}

function enableTileEvents() {
  const tiles = cube.querySelectorAll('.tile');
  tiles.forEach(tile => {
    // Mouse-based single click for description
    tile.onclick = (e) => {
      if (!gameStarted) return;
      const key = tile.getAttribute('data-key');
      if (!key) return;
      descriptionBox.textContent = actionDescriptions[key] || key;
      if (voiceToggle.checked) {
        speak(actionDescriptions[key] || key);
      }
    };

    // Mouse-based double-click for draggability
    tile.ondblclick = (e) => {
      if (!gameStarted) return;
      if (!tile.hasAttribute('data-key')) return;
      const draggable = tile.getAttribute('draggable') === 'true';
      if (!draggable) {
        tile.setAttribute('draggable', 'true');
        tile.classList.add('draggable');
        tile.style.cursor = 'grab';
        selectedTile = tile;
        tile.classList.add('selected');
      } else {
        tile.setAttribute('draggable', 'false');
        tile.classList.remove('draggable');
        tile.style.cursor = 'default';
        selectedTile = null;
        tile.classList.remove('selected');
      }
    };

    // Touch-based single tap and double-tap
    tile.addEventListener('touchstart', (e) => {
      if (!gameStarted) return;
      e.preventDefault();
      const key = tile.getAttribute('data-key');
      if (!key) return;

      const currentTime = new Date().getTime();
      const tapGap = currentTime - lastTap;

      if (tapGap < doubleTapDelay && tapGap > 0) {
        // Double-tap detected
        const draggable = tile.getAttribute('draggable') === 'true';
        if (!draggable) {
          tile.setAttribute('draggable', 'true');
          tile.classList.add('draggable');
          tile.style.cursor = 'grab';
          selectedTile = tile;
          tile.classList.add('selected');
        } else {
          tile.setAttribute('draggable', 'false');
          tile.classList.remove('draggable');
          tile.style.cursor = 'default';
          selectedTile = null;
          tile.classList.remove('selected');
        }
      } else {
        // Single tap for description
        descriptionBox.textContent = actionDescriptions[key] || key;
        if (voiceToggle.checked) {
          speak(actionDescriptions[key] || key);
        }
      }
      lastTap = currentTime;
    });

    // Touch-based drag start
    tile.addEventListener('touchstart', (e) => {
      if (!gameStarted || tile.getAttribute('draggable') !== 'true') return;
      e.stopPropagation(); // Prevent cube rotation
      tile.style.opacity = '0.5';
    });

    // Touch-based drag move
    tile.addEventListener('touchmove', (e) => {
      if (!gameStarted || tile.getAttribute('draggable') !== 'true') return;
      e.preventDefault();
      const touch = e.touches[0];
      const elementUnder = document.elementFromPoint(touch.clientX, touch.clientY);
      dropBoxes.forEach(box => box.classList.remove('drag-over'));
      if (elementUnder && elementUnder.classList.contains('drop-box')) {
        elementUnder.classList.add('drag-over');
      }
    });

    // Touch-based drag end
    tile.addEventListener('touchend', (e) => {
      if (!gameStarted || tile.getAttribute('draggable') !== 'true') return;
      tile.style.opacity = '1';
      dropBoxes.forEach(box => box.classList.remove('drag-over'));
      const touch = e.changedTouches[0];
      const elementUnder = document.elementFromPoint(touch.clientX, touch.clientY);
      if (elementUnder && elementUnder.classList.contains('drop-box')) {
        const key = tile.getAttribute('data-key');
        if (!key || droppedTilesMap[key]) return;
        const droppedTiles = elementUnder.querySelectorAll('.dropped-tile');
        if (droppedTiles.length >= 3) return;

        const droppedTile = document.createElement('div');
        droppedTile.classList.add('dropped-tile', 'animate-drop');
        droppedTile.textContent = key;
        droppedTile.setAttribute('data-key', key);

        droppedTile.onclick = () => {
          delete droppedTilesMap[key];
          droppedTile.remove();
          const { face, index } = originalPositions[key];
          const faceDiv = cube.querySelector(`.face.${face}`);
          const tiles = faceDiv.querySelectorAll('.tile');
          const targetTile = tiles[index];
          if (targetTile && !targetTile.hasAttribute('data-key')) {
            targetTile.textContent = key;
            targetTile.setAttribute('data-key', key);
            targetTile.setAttribute('draggable', 'false');
            targetTile.classList.remove('draggable');
            targetTile.style.cursor = 'default';
          }
          if (Object.keys(droppedTilesMap).length === 0) {
            submitBtn.disabled = true;
            submitBtn.classList.remove('glow');
          }
        };

        elementUnder.appendChild(droppedTile);
        droppedTilesMap[key] = elementUnder.id;

        tile.textContent = '';
        tile.removeAttribute('data-key');
        tile.setAttribute('draggable', 'false');
        tile.classList.remove('draggable', 'selected');
        tile.style.cursor = 'not-allowed';
        selectedTile = null;

        submitBtn.disabled = false;
        submitBtn.classList.add('glow');

        if (voiceToggle.checked) {
          const faceName = faceTitles[elementUnder.dataset.face];
          speak(`${key} is dropped into ${faceName}`);
        }
      }
    });

    // Mouse-based drag
    tile.ondragstart = (e) => {
      if (!gameStarted) {
        e.preventDefault();
        return;
      }
      if (!tile.classList.contains('draggable')) {
        e.preventDefault();
        return;
      }
      e.dataTransfer.setData('text/plain', tile.getAttribute('data-key'));
      tile.style.opacity = '0.5';
    };

    tile.ondragend = () => {
      tiles.forEach(t => (t.style.opacity = '1'));
    };
  });
}

function attachDropBoxEvents() {
  dropBoxes.forEach(box => {
    box.ondragover = (e) => {
      if (!gameStarted) return;
      e.preventDefault();
      box.classList.add('drag-over');
    };
    box.ondragleave = () => {
      box.classList.remove('drag-over');
    };
    box.ondrop = (e) => {
      if (!gameStarted) return;
      e.preventDefault();
      box.classList.remove('drag-over');

      const key = e.dataTransfer.getData('text/plain');
      if (!key) return;
      if (droppedTilesMap[key]) return;
      const droppedTiles = box.querySelectorAll('.dropped-tile');
      if (droppedTiles.length >= 3) return;

      const droppedTile = document.createElement('div');
      droppedTile.classList.add('dropped-tile', 'animate-drop');
      droppedTile.textContent = key;
      droppedTile.setAttribute('data-key', key);

      droppedTile.onclick = () => {
        delete droppedTilesMap[key];
        droppedTile.remove();

        const { face, index } = originalPositions[key];
        const faceDiv = cube.querySelector(`.face.${face}`);
        const tiles = faceDiv.querySelectorAll('.tile');
        const targetTile = tiles[index];
        if (targetTile && !targetTile.hasAttribute('data-key')) {
          targetTile.textContent = key;
          targetTile.setAttribute('data-key', key);
          targetTile.setAttribute('draggable', 'false');
          targetTile.classList.remove('draggable');
          targetTile.style.cursor = 'default';
        }

        if (Object.keys(droppedTilesMap).length === 0) {
          submitBtn.disabled = true;
          submitBtn.classList.remove('glow');
        }
      };

      box.appendChild(droppedTile);
      droppedTilesMap[key] = box.id;

      const cubeTiles = cube.querySelectorAll('.tile');
      for (const t of cubeTiles) {
        if (t.getAttribute('data-key') === key) {
          t.textContent = '';
          t.removeAttribute('data-key');
          t.setAttribute('draggable', 'false');
          t.classList.remove('draggable');
          t.style.cursor = 'not-allowed';
          break;
        }
      }

      submitBtn.disabled = false;
      submitBtn.classList.add('glow');

      if (voiceToggle.checked) {
        const faceName = faceTitles[box.dataset.face];
        speak(`${key} is dropped into ${faceName}`);
      }
    };

    // Tap to drop selected tile
    box.addEventListener('touchstart', (e) => {
      if (!gameStarted || !selectedTile) return;
      e.preventDefault();
      const key = selectedTile.getAttribute('data-key');
      if (!key || droppedTilesMap[key]) return;
      const droppedTiles = box.querySelectorAll('.dropped-tile');
      if (droppedTiles.length >= 3) return;

      const droppedTile = document.createElement('div');
      droppedTile.classList.add('dropped-tile', 'animate-drop');
      droppedTile.textContent = key;
      droppedTile.setAttribute('data-key', key);

      droppedTile.onclick = () => {
        delete droppedTilesMap[key];
        droppedTile.remove();

        const { face, index } = originalPositions[key];
        const faceDiv = cube.querySelector(`.face.${face}`);
        const tiles = faceDiv.querySelectorAll('.tile');
        const targetTile = tiles[index];
        if (targetTile && !targetTile.hasAttribute('data-key')) {
          targetTile.textContent = key;
          targetTile.setAttribute('data-key', key);
          targetTile.setAttribute('draggable', 'false');
          targetTile.classList.remove('draggable');
          targetTile.style.cursor = 'default';
        }

        if (Object.keys(droppedTilesMap).length === 0) {
          submitBtn.disabled = true;
          submitBtn.classList.remove('glow');
        }
      };

      box.appendChild(droppedTile);
      droppedTilesMap[key] = box.id;

      const cubeTiles = cube.querySelectorAll('.tile');
      for (const t of cubeTiles) {
        if (t === selectedTile) {
          t.textContent = '';
          t.removeAttribute('data-key');
          t.setAttribute('draggable', 'false');
          t.classList.remove('draggable', 'selected');
          t.style.cursor = 'not-allowed';
          break;
        }
      }

      submitBtn.disabled = false;
      submitBtn.classList.add('glow');

      if (voiceToggle.checked) {
        const faceName = faceTitles[box.dataset.face];
        speak(`${key} is dropped into ${faceName}`);
      }

      selectedTile = null;
    });

    // Mouse-based click to drop (existing)
    box.onclick = (e) => {
      if (!gameStarted || !selectedTile) return;
      e.preventDefault();
      const key = selectedTile.getAttribute('data-key');
      if (!key || droppedTilesMap[key]) return;
      const droppedTiles = box.querySelectorAll('.dropped-tile');
      if (droppedTiles.length >= 3) return;

      const droppedTile = document.createElement('div');
      droppedTile.classList.add('dropped-tile', 'animate-drop');
      droppedTile.textContent = key;
      droppedTile.setAttribute('data-key', key);

      droppedTile.onclick = () => {
        delete droppedTilesMap[key];
        droppedTile.remove();

        const { face, index } = originalPositions[key];
        const faceDiv = cube.querySelector(`.face.${face}`);
        const tiles = faceDiv.querySelectorAll('.tile');
        const targetTile = tiles[index];
        if (targetTile && !targetTile.hasAttribute('data-key')) {
          targetTile.textContent = key;
          targetTile.setAttribute('data-key', key);
          targetTile.setAttribute('draggable', 'false');
          targetTile.classList.remove('draggable');
          targetTile.style.cursor = 'default';
        }

        if (Object.keys(droppedTilesMap).length === 0) {
          submitBtn.disabled = true;
          submitBtn.classList.remove('glow');
        }
      };

      box.appendChild(droppedTile);
      droppedTilesMap[key] = box.id;

      const cubeTiles = cube.querySelectorAll('.tile');
      for (const t of cubeTiles) {
        if (t === selectedTile) {
          t.textContent = '';
          t.removeAttribute('data-key');
          t.setAttribute('draggable', 'false');
          t.classList.remove('draggable', 'selected');
          t.style.cursor = 'not-allowed';
          break;
        }
      }

      submitBtn.disabled = false;
      submitBtn.classList.add('glow');

      if (voiceToggle.checked) {
        const faceName = faceTitles[box.dataset.face];
        speak(`${key} is dropped into ${faceName}`);
      }

      selectedTile = null;
    };
  });
}

submitBtn.onclick = () => {
  if (!gameStarted) return;

  let totalPoints = 0;
  const gameMode = gameLevelSelect.value || "Easy";

  for (const tileText in droppedTilesMap) {
    const dropBoxId = droppedTilesMap[tileText];
    const faceKey = dropBoxId.replace('drop-', '');
    const dropBoxCategory = faceTitles[faceKey];

    const tileCategoryEntry = Object.entries(floodActions).find(([category, actions]) =>
      actions.some(action => action.text === tileText)
    );

    if (!tileCategoryEntry) continue;

    const [tileCategory, actions] = tileCategoryEntry;
    const point = actions.find(action => action.text === tileText)?.point || 0;

    if (tileCategory === dropBoxCategory) {
      totalPoints += point;
    } else if (gameMode === "Medium" || gameMode === "Hard") {
      totalPoints -= point;
    }
  }

  visibleScore = true;
  scoreDisplay.textContent = `Your Score: ${totalPoints}`;
  faceTitle.textContent = `Game finished for: ${hazardSelect.value}`;

  cube.querySelectorAll('.tile').forEach(tile => {
    tile.setAttribute('draggable', 'false');
    tile.classList.remove('draggable');
    tile.style.cursor = 'not-allowed';
  });

  dropBoxes.forEach(box => {
    box.ondragover = (e) => e.preventDefault();
    box.ondrop = (e) => e.preventDefault();
    box.style.cursor = 'default';
  });

  submitBtn.disabled = true;
  submitBtn.classList.remove('glow');

  resetBtn.disabled = false;
  resetBtn.classList.add('glow');

  startBtn.disabled = true;
  startBtn.classList.remove('glow');

  if (voiceToggle.checked) {
    speak(`Your total score is ${totalPoints}`);
  }
};

resetBtn.onclick = () => {
  gameStarted = false;
  visibleScore = false;

  droppedTilesMap = {};
  dropBoxes.forEach(box => {
    [...box.querySelectorAll('.dropped-tile')].forEach(tile => tile.remove());
    box.style.cursor = '';
    box.ondragover = (e) => {
      if (!gameStarted) return;
      e.preventDefault();
      box.classList.add('drag-over');
    };
    box.ondragleave = () => {
      box.classList.remove('drag-over');
    };
    box.ondrop = (e) => {
      if (!gameStarted) return;
      e.preventDefault();
      box.classList.remove('drag-over');

      const key = e.dataTransfer.getData('text/plain');
      if (!key) return;
      if (droppedTilesMap[key]) return;
      const droppedTiles = box.querySelectorAll('.dropped-tile');
      if (droppedTiles.length >= 3) return;

      const droppedTile = document.createElement('div');
      droppedTile.classList.add('dropped-tile', 'animate-drop');
      droppedTile.textContent = key;
      droppedTile.setAttribute('data-key', key);

      droppedTile.onclick = () => {
        delete droppedTilesMap[key];
        droppedTile.remove();

        const { face, index } = originalPositions[key];
        const faceDiv = cube.querySelector(`.face.${face}`);
        const tiles = faceDiv.querySelectorAll('.tile');
        const targetTile = tiles[index];
        if (targetTile && !targetTile.hasAttribute('data-key')) {
          targetTile.textContent = key;
          targetTile.setAttribute('data-key', key);
          targetTile.setAttribute('draggable', 'false');
          targetTile.classList.remove('draggable');
          targetTile.style.cursor = 'default';
        }

        if (Object.keys(droppedTilesMap).length === 0) {
          submitBtn.disabled = true;
          submitBtn.classList.remove('glow');
        }
      };

      box.appendChild(droppedTile);
      droppedTilesMap[key] = box.id;

      const cubeTiles = cube.querySelectorAll('.tile');
      for (const t of cubeTiles) {
        if (t.getAttribute('data-key') === key) {
          t.textContent = '';
          t.removeAttribute('data-key');
          t.setAttribute('draggable', 'false');
          t.classList.remove('draggable');
          t.style.cursor = 'not-allowed';
          break;
        }
      }

      submitBtn.disabled = false;
      submitBtn.classList.add('glow');

      if (voiceToggle.checked) {
        const faceName = faceTitles[box.dataset.face];
        speak(`${key} is dropped into ${faceName}`);
      }
    };
  });

  populateCube();
  enableTileEvents();

  submitBtn.disabled = true;
  submitBtn.classList.remove('glow');

  resetBtn.disabled = true;
  resetBtn.classList.remove('glow');

  startBtn.disabled = false;
  startBtn.classList.add('glow');

  descriptionBox.textContent = "Click or tap on a tile to see description here.";
  scoreDisplay.textContent = "";
  faceTitle.textContent = "Select hazard and start the game";
};

startBtn.onclick = () => {
  if (!hazardSelect.value) {
    alert("Please select a hazard first.");
    return;
  }
  const gameMode = gameLevelSelect.value || "Easy";
  let notes = "Notes:\n";
  if (gameMode === "Easy") {
    notes += "You have started a game in Easy Mode.\nYou can tap tiles to check their description in the description box.\nDouble-tap a tile to select it for dragging, then tap a drop box to place it.\nYou can place up to 3 tiles in each drop box.\nOnce you place the desired tiles, tap 'Submit' to check your score.\nThe sum of scores of correctly placed tiles is your total score.";
  } else if (gameMode === "Medium") {
    notes += "You have started a game in Medium Mode.\nYou can tap tiles to check their description in the description box.\nDouble-tap a tile to select it for dragging, then tap a drop box to place it.\nYou can place up to 3 tiles in each drop box.\nOnce you place the desired tiles, tap 'Submit' to check your score.\nThe sum of scores of correctly placed tiles is your total score, but there is negative scoring for wrongly placed tiles.";
  } else if (gameMode === "Hard") {
    notes += "You have started a game in Hard Mode.\nYou can tap tiles to check their description in the description box.\nDouble-tap a tile to select it for dragging, then tap a drop box to place it.\nYou can place up to 3 tiles in each drop box.\nOnce you place the desired tiles, tap 'Submit' to check your score.\nThe sum of scores of correctly placed tiles is your total score, but there is negative scoring for wrongly placed tiles.";
  }
  alert(notes);

  gameStarted = true;
  droppedTilesMap = {};
  tilePoints = {};

  if (voiceToggle.checked) {
    const hazard = hazardSelect.value;
    const level = gameLevelSelect.value || "Easy";
    speak(`Game is started for ${hazard} in ${level} mode`);
  }

  populateCube();
  enableTileEvents();
  attachDropBoxEvents();

  submitBtn.disabled = true;
  submitBtn.classList.remove('glow');

  resetBtn.disabled = false;
  resetBtn.classList.add('glow');

  startBtn.disabled = true;
  startBtn.classList.remove('glow');

  descriptionBox.textContent = "Click or tap on a tile to see description here.";
  scoreDisplay.textContent = "";
  faceTitle.textContent = `Game started for: ${hazardSelect.value}`;
};

languageSelect.onchange = () => {
  alert(`Language changed to ${languageSelect.value}. (No other language functionality implemented yet.)`);
};

function showTooltip() {
  let tooltip = gameLevelSelect.querySelector('.tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    gameLevelSelect.appendChild(tooltip);
  }
  const mode = gameLevelSelect.value || "";
  switch (mode) {
    case "Easy":
      tooltip.textContent = "In easy mode, scores of tiles dropped in correct drop box will only count.";
      break;
    case "Medium":
      tooltip.textContent = "In medium mode, scores of tiles dropped in wrong drop box will be counted negative.";
      break;
    case "Hard":
      tooltip.textContent = "In hard mode, all tiles and drop box will have same colors and there will be negative marking for wrong tile drop.";
      break;
    default:
      tooltip.textContent = "Select a game mode to see details.";
      break;
  }
}

gameLevelSelect.onchange = showTooltip;
gameLevelSelect.onmouseover = showTooltip;
gameLevelSelect.onmouseout = () => {
  const tooltip = gameLevelSelect.querySelector('.tooltip');
  if (tooltip) {
    tooltip.style.opacity = '0';
    tooltip.style.visibility = 'hidden';
  }
};

function speak(text) {
  if (!window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

populateCube();
enableTileEvents();
attachDropBoxEvents();

resetBtn.disabled = true;
resetBtn.classList.remove('glow');
submitBtn.disabled = true;
submitBtn.classList.remove('glow');
startBtn.classList.add('glow');

updateCubeRotation();

showTooltip();
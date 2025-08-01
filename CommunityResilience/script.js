// Note: Assumes correctMatches is defined in matches.js and available globally
const map = L.map('map', {
    zoomControl: true
}).setView([27.7172, 85.3240], 7);

// Define colors for each marker category
const markerColors = {
    indicator: '#007BFF', // Blue
    capital: '#6F42C1',   // Purple
    resilience: '#00ACC1' // Teal
};

// Fallback icon in case of errors
const fallbackIcon = L.icon({
    iconUrl: 'https://via.placeholder.com/32?text=?',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    tooltipAnchor: [0, -16]
});

// Variable to store fireworks interval ID
let fireworksInterval = null;

// Helper function to create icon-based marker
function createIcon(type, category, isSelected = false) {
    try {
        const size = isSelected ? [40, 40] : [32, 32];
        const anchor = isSelected ? [20, 20] : [16, 16];
        let className = 'custom-icon';
        let iconClass = '';

        // Assign class and Font Awesome icon based on category and type
        if (category === 'indicator') {
            className += ' marker-indicator';
            iconClass = 'fas fa-info-circle';
        } else if (category === 'capital') {
            className += ` marker-${type.split(' ')[0]}`;
            if (type === 'human capital') iconClass = 'fas fa-user';
            else if (type === 'social capital') iconClass = 'fas fa-users';
            else if (type === 'physical capital') iconClass = 'fas fa-building';
            else if (type === 'natural capital') iconClass = 'fas fa-leaf';
            else if (type === 'financial capital') iconClass = 'fas fa-dollar-sign';
        } else if (category === 'resilience') {
            className += ` marker-${type.split(' ')[0]}`;
            if (type === 'robustness resilience') iconClass = 'fas fa-shield-alt';
            else if (type === 'redundancy resilience') iconClass = 'fas fa-copy';
            else if (type === 'resourcefulness resilience') iconClass = 'fas fa-lightbulb';
            else if (type === 'rapidity resilience') iconClass = 'fas fa-bolt';
        }
        if (isSelected) {
            className += ' marker-selected';
        }

        return L.divIcon({
            html: `<div style="width: ${size[0]}px; height: ${size[1]}px;"><i class="${iconClass}"></i></div>`,
            className: className,
            iconSize: size,
            iconAnchor: anchor,
            tooltipAnchor: [0, isSelected ? -20 : -16]
        });
    } catch (error) {
        console.error(`Failed to create icon for ${type}:`, error);
        return fallbackIcon;
    }
}

// Indicator icons
const indicatorIcon = createIcon('indicator', 'indicator');
const indicatorIconSelected = createIcon('indicator', 'indicator', true);

// Capital icons
const capitalIcons = {
    human: createIcon('human capital', 'capital'),
    social: createIcon('social capital', 'capital'),
    physical: createIcon('physical capital', 'capital'),
    natural: createIcon('natural capital', 'capital'),
    financial: createIcon('financial capital', 'capital')
};

const capitalIconsSelected = {
    human: createIcon('human capital', 'capital', true),
    social: createIcon('social capital', 'capital', true),
    physical: createIcon('physical capital', 'capital', true),
    natural: createIcon('natural capital', 'capital', true),
    financial: createIcon('financial capital', 'capital', true)
};

// Resilience icons
const resilienceIcons = {
    robustness: createIcon('robustness resilience', 'resilience'),
    redundancy: createIcon('redundancy resilience', 'resilience'),
    resourcefulness: createIcon('resourcefulness resilience', 'resilience'),
    rapidity: createIcon('rapidity resilience', 'resilience')
};

const resilienceIconsSelected = {
    robustness: createIcon('robustness resilience', 'resilience', true),
    redundancy: createIcon('redundancy resilience', 'resilience', true),
    resourcefulness: createIcon('resourcefulness resilience', 'resilience', true),
    rapidity: createIcon('rapidity resilience', 'resilience', true)
};

const openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).on('tileerror', (error) => {
    console.error('Error loading OpenStreetMap tiles:', error);
});

const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
}).on('tileerror', (error) => {
    console.error('Error loading Satellite tiles:', error);
});

const fallbackMap = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).on('tileerror', (error) => {
    console.error('Error loading fallback tiles:', error);
});

openStreetMap.addTo(map).on('add', () => {
    console.log('OpenStreetMap layer added successfully');
}).on('error', (error) => {
    console.error('Error adding OpenStreetMap layer:', error);
    map.removeLayer(openStreetMap);
    fallbackMap.addTo(map);
});

const communities = {
    balapur: { name: 'Balapur', lat: 28.228113, lng: 81.37092 },
    payal: { name: 'Payal', lat: 28.437032, lng: 81.038959 },
    tilki: { name: 'Tilki', lat: 28.815299, lng: 80.374074 }
};

let currentLayer = openStreetMap;
const splashScreen = document.getElementById('splashScreen');
const splashMessage = document.getElementById('splashMessage');
const splashInstructions = document.getElementById('splashInstructions');
const communityNameSpan = document.getElementById('communityName');
const startButton = document.getElementById('startButton');
const replayButton = document.getElementById('replayButton');
const joinButton = document.getElementById('joinButton');
const simulateButton = document.getElementById('simulateButton');
const simulationResult = document.getElementById('simulationResult');
let markers = [];
let selectedSymbols = [];
let connections = [];
let polylines = [];
let symbolList = null;

// Helper function to shuffle an array (Fisher-Yates shuffle)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function closeSplash() {
    if (!splashScreen) {
        console.error('Splash screen element not found');
        return;
    }
    splashScreen.style.display = 'none';
    startButton.style.display = 'block';
    replayButton.style.display = 'none';
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) {
        console.error('Sidebar element not found');
        return;
    }
    const selectedSymbolsBox = document.createElement('div');
    selectedSymbolsBox.id = 'selectedSymbolsBox';
    const title = document.createElement('h3');
    title.textContent = 'Selected Symbols';
    symbolList = document.createElement('ul');
    symbolList.id = 'symbolList';
    selectedSymbolsBox.appendChild(title);
    selectedSymbolsBox.appendChild(symbolList);
    sidebar.insertBefore(selectedSymbolsBox, joinButton);
    placeSymbols();
}

function updateMarkerTooltips() {
    markers.forEach(marker => {
        const type = marker.options.type;
        const category = marker.options.category;
        let tooltipContent = '';
        if (category === 'indicator') {
            const isConnected = connections.some(conn => conn.indicator === marker);
            tooltipContent = isConnected ? `${marker.options.name} (Connected, Blue)` : `${marker.options.name} (Blue)`;
        } else if (category === 'capital') {
            tooltipContent = `Capital: ${type.charAt(0).toUpperCase() + type.slice(1)} (Purple)`;
        } else if (category === 'resilience') {
            tooltipContent = `Resilience: ${type.charAt(0).toUpperCase() + type.slice(1)} (Teal)`;
        }
        try {
            marker.bindTooltip(tooltipContent);
        } catch (error) {
            console.error(`Failed to bind tooltip for marker ${type}:`, error);
        }
    });
}

function updateSymbolList() {
    if (!symbolList) {
        console.error('Symbol list element not found');
        return;
    }
    symbolList.innerHTML = '';
    selectedSymbols.forEach(marker => {
        const li = document.createElement('li');
        const type = marker.options.type;
        const category = marker.options.category;
        let text = '';
        if (category === 'indicator') {
            text = `${marker.options.name} (Blue)`;
        } else if (category === 'capital') {
            text = `Capital: ${type.charAt(0).toUpperCase() + type.slice(1)} (Purple)`;
        } else if (category === 'resilience') {
            text = `Resilience: ${type.charAt(0).toUpperCase() + type.slice(1)} (Teal)`;
        }
        li.textContent = text;
        symbolList.appendChild(li);
    });
    joinButton.style.display = selectedSymbols.length === 3 ? 'block' : 'none';
}

function placeSymbols() {
    // Clear existing markers and polylines
    markers.forEach(marker => {
        try {
            map.removeLayer(marker);
        } catch (error) {
            console.error('Error removing marker:', error);
        }
    });
    polylines.forEach(polyline => {
        try {
            map.removeLayer(polyline);
        } catch (error) {
            console.error('Error removing polyline:', error);
        }
    });
    markers = [];
    polylines = [];
    connections = [];
    selectedSymbols = [];
    updateSymbolList();
    simulateButton.style.display = 'none';
    if (simulationResult) {
        simulationResult.style.display = 'none';
        simulationResult.innerHTML = '';
    }

    const selectedCommunity = document.getElementById('communitySelect').value;
    if (!selectedCommunity || !communities[selectedCommunity]) {
        console.error('No valid community selected:', selectedCommunity);
        return;
    }

    const { lat, lng } = communities[selectedCommunity];

    // Get map bounds after ensuring the map is at the correct zoom
    map.setView([lat, lng], 16); // Ensure map is at zoom 16
    const bounds = map.getBounds();
    const latSpan = bounds.getNorth() - bounds.getSouth();
    const lngSpan = bounds.getEast() - bounds.getWest();
    const radius = Math.min(latSpan, lngSpan) * 0.3; // 30% of smaller dimension

    // Randomly select 3 indicators
    const shuffledMatches = shuffle([...correctMatches]);
    const selectedMatches = shuffledMatches.slice(0, 3);
    console.log('Selected indicators:', selectedMatches.map(match => ({ index: match.indicator, name: match.name })));

    // Track used capitals and resilience properties to ensure uniqueness
    const usedCapitals = new Set();
    const usedResilience = new Set();
    const finalMatches = [];

    // Ensure 3 unique indicators with unique capitals and resilience properties
    selectedMatches.forEach(match => {
        if (!usedCapitals.has(match.capital) && !usedResilience.has(match.resilience)) {
            finalMatches.push(match);
            usedCapitals.add(match.capital);
            usedResilience.add(match.resilience);
        }
    });

    // If fewer than 3 matches due to duplicates, fill with additional unique matches
    if (finalMatches.length < 3) {
        const remainingMatches = shuffledMatches.filter(match => 
            !usedCapitals.has(match.capital) && !usedResilience.has(match.resilience)
        );
        finalMatches.push(...remainingMatches.slice(0, 3 - finalMatches.length));
    }

    // Place 3 indicators in a circular pattern
    finalMatches.forEach((match, index) => {
        const angle = (index / finalMatches.length) * 2 * Math.PI;
        let indicatorLat = lat + Math.cos(angle) * radius;
        let indicatorLng = lng + Math.sin(angle) * radius;
        indicatorLat = Math.max(bounds.getSouth(), Math.min(bounds.getNorth(), indicatorLat));
        indicatorLng = Math.max(bounds.getWest(), Math.min(bounds.getEast(), indicatorLng));
        try {
            const indicatorMarker = L.marker([indicatorLat, indicatorLng], {
                icon: indicatorIcon,
                type: 'indicator',
                category: 'indicator',
                index: match.indicator,
                name: match.name
            })
                .addTo(map)
                .bindTooltip(`${match.name} (Blue)`)
                .on('click', () => handleMarkerClick(indicatorMarker));
            markers.push(indicatorMarker);
            console.log(`Placed indicator: ${match.name} at [${indicatorLat}, ${indicatorLng}]`);
        } catch (error) {
            console.error(`Failed to add indicator marker ${match.name}:`, error);
        }
    });

    // Place capital and resilience markers for the selected indicators
    finalMatches.forEach(match => {
        // Capital marker
        const capitalType = match.capital;
        if (!capitalIcons[capitalType]) {
            console.warn(`Capital type ${capitalType} not found in capitalIcons`);
            return;
        }
        let capitalLat = lat + (Math.random() - 0.5) * 2 * radius;
        let capitalLng = lng + (Math.random() - 0.5) * 2 * radius;
        capitalLat = Math.max(bounds.getSouth(), Math.min(bounds.getNorth(), capitalLat));
        capitalLng = Math.max(bounds.getWest(), Math.min(bounds.getEast(), capitalLng));
        try {
            const capitalMarker = L.marker([capitalLat, capitalLng], {
                icon: capitalIcons[capitalType] || fallbackIcon,
                type: capitalType,
                category: 'capital'
            })
                .addTo(map)
                .bindTooltip(`Capital: ${capitalType.charAt(0).toUpperCase() + capitalType.slice(1)} (Purple)`)
                .on('click', () => handleMarkerClick(capitalMarker));
            markers.push(capitalMarker);
            console.log(`Placed capital: ${capitalType} at [${capitalLat}, ${capitalLng}]`);
        } catch (error) {
            console.error(`Failed to add capital marker ${capitalType}:`, error);
        }

        // Resilience marker
        const resilienceType = match.resilience;
        if (!resilienceIcons[resilienceType]) {
            console.warn(`Resilience type ${resilienceType} not found in resilienceIcons`);
            return;
        }
        let resilienceLat = lat + (Math.random() - 0.5) * 2 * radius;
        let resilienceLng = lng + (Math.random() - 0.5) * 2 * radius;
        resilienceLat = Math.max(bounds.getSouth(), Math.min(bounds.getNorth(), resilienceLat));
        resilienceLng = Math.max(bounds.getWest(), Math.min(bounds.getEast(), resilienceLng));
        try {
            const resilienceMarker = L.marker([resilienceLat, lng], {
                icon: resilienceIcons[resilienceType] || fallbackIcon,
                type: resilienceType,
                category: 'resilience'
            })
                .addTo(map)
                .bindTooltip(`Resilience: ${resilienceType.charAt(0).toUpperCase() + resilienceType.slice(1)} (Teal)`)
                .on('click', () => handleMarkerClick(resilienceMarker));
            markers.push(resilienceMarker);
            console.log(`Placed resilience: ${resilienceType} at [${resilienceLat}, ${resilienceLng}]`);
        } catch (error) {
            console.error(`Failed to add resilience marker ${resilienceType}:`, error);
        }
    });

    console.log(`Placed ${markers.filter(m => m.options.category === 'indicator').length} indicators, ${markers.filter(m => m.options.category === 'capital').length} capitals, ${markers.filter(m => m.options.category === 'resilience').length} resilience markers`);
}

function handleMarkerClick(marker) {
    const isConnected = connections.some(conn =>
        conn.indicator === marker || conn.capital === marker || conn.resilience === marker
    );
    if (isConnected) return;

    const index = selectedSymbols.indexOf(marker);
    if (index !== -1) {
        selectedSymbols.splice(index, 1);
        const category = marker.options.category;
        try {
            if (category === 'indicator') {
                marker.setIcon(indicatorIcon);
            } else if (category === 'capital') {
                marker.setIcon(capitalIcons[marker.options.type] || fallbackIcon);
            } else if (category === 'resilience') {
                marker.setIcon(resilienceIcons[marker.options.type] || fallbackIcon);
            }
            marker.bindTooltip(category === 'indicator' ? `${marker.options.name} (Blue)` : `${category === 'capital' ? 'Capital' : 'Resilience'}: ${marker.options.type.charAt(0).toUpperCase() + marker.options.type.slice(1)} (${category === 'capital' ? 'Purple' : 'Teal'})`);
        } catch (error) {
            console.error(`Failed to update marker ${marker.options.type}:`, error);
        }
        updateSymbolList();
        return;
    }

    if (selectedSymbols.length >= 3) {
        alert('Please join the selected symbols or clear the selection.');
        return;
    }

    const category = marker.options.category;
    const existingMarker = selectedSymbols.find(m => m.options.category === category);

    if (existingMarker) {
        // Vibrate the existing marker instead of showing alert
        try {
            const iconElement = existingMarker.getElement();
            if (iconElement) {
                iconElement.classList.add('vibrate');
                setTimeout(() => {
                    iconElement.classList.remove('vibrate');
                }, 300); // Match animation duration
            }
        } catch (error) {
            console.error(`Failed to vibrate marker ${existingMarker.options.type}:`, error);
        }
        return;
    }

    selectedSymbols.push(marker);
    try {
        if (category === 'indicator') {
            marker.setIcon(indicatorIconSelected);
        } else if (category === 'capital') {
            marker.setIcon(capitalIconsSelected[marker.options.type] || fallbackIcon);
        } else if (category === 'resilience') {
            marker.setIcon(resilienceIconsSelected[marker.options.type] || fallbackIcon);
        }
        marker.bindTooltip(`${category === 'indicator' ? marker.options.name : category === 'capital' ? 'Capital' : 'Resilience'}: ${marker.options.type.charAt(0).toUpperCase() + marker.options.type.slice(1)} (Selected, ${category === 'indicator' ? 'Blue' : category === 'capital' ? 'Purple' : 'Teal'})`).openTooltip();
    } catch (error) {
        console.error(`Failed to update marker ${marker.options.type}:`, error);
    }
    updateSymbolList();

    const indicatorMarkers = markers.filter(m => m.options.category === 'indicator');
    if (connections.length === indicatorMarkers.length && selectedSymbols.length === 0) {
        simulateButton.style.display = 'block';
    }
}

function joinSymbols() {
    if (selectedSymbols.length !== 3) return;

    const indicator = selectedSymbols.find(m => m.options.category === 'indicator');
    const capital = selectedSymbols.find(m => m.options.category === 'capital');
    const resilience = selectedSymbols.find(m => m.options.category === 'resilience');

    if (indicator && capital && resilience) {
        const latlngs = [
            indicator.getLatLng(),
            capital.getLatLng(),
            resilience.getLatLng()
        ];
        try {
            const polyline1 = L.polyline([latlngs[0], latlngs[1]], { color: markerColors.indicator, weight: 2 }).addTo(map);
            const polyline2 = L.polyline([latlngs[1], latlngs[2]], { color: markerColors.resilience, weight: 2 }).addTo(map);
            polylines.push(polyline1, polyline2);

            connections.push({
                indicator: indicator,
                capital: capital,
                resilience: resilience,
                polyline: [polyline1, polyline2]
            });

            try {
                indicator.setIcon(indicatorIcon);
                capital.setIcon(capitalIcons[capital.options.type] || fallbackIcon);
                resilience.setIcon(resilienceIcons[resilience.options.type] || fallbackIcon);
            } catch (error) {
                console.error('Error reverting icons after joining:', error);
            }

            selectedSymbols = [];
            updateSymbolList();
            updateMarkerTooltips();

            const indicatorMarkers = markers.filter(m => m.options.category === 'indicator');
            if (connections.length === indicatorMarkers.length) {
                simulateButton.style.display = 'block';
            }
        } catch (error) {
            console.error('Error creating polylines:', error);
        }
    }
}

function simulateResilience() {
    // Step 1: Apply pulse animation to all markers
    markers.forEach(marker => {
        try {
            const iconElement = marker.getElement();
            if (iconElement) {
                iconElement.classList.add('pulse');
                setTimeout(() => {
                    iconElement.classList.remove('pulse');
                }, 1000); // Match pulse animation duration (0.5s * 2 iterations)
            }
        } catch (error) {
            console.error(`Failed to apply pulse animation to marker ${marker.options.type}:`, error);
        }
    });

    // Step 2: Remove existing polylines
    polylines.forEach(polyline => {
        try {
            map.removeLayer(polyline);
        } catch (error) {
            console.error('Error removing polyline:', error);
        }
    });
    polylines = [];

    // Step 3: Redraw all polylines sequentially with neutral style
    let animationDelay = 0;
    const animationDuration = 500; // 0.5s per polyline animation
    let allCorrect = true;
    const incorrectIndicators = [];

    connections.forEach((connection, index) => {
        const latlngs = [
            connection.indicator.getLatLng(),
            connection.capital.getLatLng(),
            connection.resilience.getLatLng()
        ];

        // Create new polylines with neutral gray style
        const polyline1 = L.polyline([latlngs[0], latlngs[1]], {
            color: '#808080', // Gray
            weight: 2
        });
        const polyline2 = L.polyline([latlngs[1], latlngs[2]], {
            color: '#808080', // Gray
            weight: 2
        });

        // Store new polylines in connections and global polylines array
        connection.polyline = [polyline1, polyline2];
        polylines.push(polyline1, polyline2);

        // Animate polylines sequentially
        setTimeout(() => {
            try {
                polyline1.addTo(map);
                const polyline1Element = polyline1.getElement();
                if (polyline1Element) {
                    polyline1Element.classList.add('dash-animate');
                    setTimeout(() => {
                        polyline1Element.classList.remove('dash-animate');
                        polyline1Element.style.strokeDasharray = '';
                        polyline1Element.style.strokeDashoffset = '';
                    }, animationDuration);
                }
            } catch (error) {
                console.error(`Failed to animate polyline ${2 * index + 1}:`, error);
            }
        }, animationDelay);

        setTimeout(() => {
            try {
                polyline2.addTo(map);
                const polyline2Element = polyline2.getElement();
                if (polyline2Element) {
                    polyline2Element.classList.add('dash-animate');
                    setTimeout(() => {
                        polyline2Element.classList.remove('dash-animate');
                        polyline2Element.style.strokeDasharray = '';
                        polyline2Element.style.strokeDashoffset = '';
                    }, animationDuration);
                }
            } catch (error) {
                console.error(`Failed to animate polyline ${2 * index + 2}:`, error);
            }
        }, animationDelay + animationDuration);

        animationDelay += 2 * animationDuration; // Two polylines per connection
    });

    // Step 4: Apply correct/incorrect styles after all animations
    setTimeout(() => {
        connections.forEach((connection, index) => {
            const indicatorIndex = connection.indicator.options.index;
            const correctMatch = correctMatches.find(match => match.indicator === indicatorIndex);

            try {
                const [polyline1, polyline2] = connection.polyline;
                if (!correctMatch || correctMatch.capital !== connection.capital.options.type || correctMatch.resilience !== connection.resilience.options.type) {
                    allCorrect = false;
                    if (!incorrectIndicators.includes(connection.indicator.options.name)) {
                        incorrectIndicators.push(connection.indicator.options.name);
                    }
                    polyline1.setStyle({
                        className: 'polyline-incorrect',
                        color: '#FF0000',
                        weight: 4,
                        dashArray: '5, 10',
                        boxShadow: '0 0 5px rgba(255, 0, 0, 0.5)'
                    });
                    polyline2.setStyle({
                        className: 'polyline-incorrect',
                        color: '#FF0000',
                        weight: 4,
                        dashArray: '5, 10',
                        boxShadow: '0 0 5px rgba(255, 0, 0, 0.5)'
                    });
                    console.log(`Polylines ${2 * index + 1} and ${2 * index + 2} set to incorrect (dotted red)`);
                } else {
                    polyline1.setStyle({
                        className: 'polyline-correct',
                        color: '#00FF00',
                        weight: 4,
                        dashArray: null,
                        boxShadow: '0 0 5px rgba(0, 255, 0, 0.5)'
                    });
                    polyline2.setStyle({
                        className: 'polyline-correct',
                        color: '#00FF00',
                        weight: 4,
                        dashArray: null,
                        boxShadow: '0 0 5px rgba(0, 255, 0, 0.5)'
                    });
                    console.log(`Polylines ${2 * index + 1} and ${2 * index + 2} set to correct (solid green)`);
                }
            } catch (error) {
                console.error(`Failed to style polylines for connection ${index + 1}:`, error);
            }
        });

        // Step 5: Display simulation result and trigger fireworks + text overlay if all correct
        const selectedCommunity = document.getElementById('communitySelect').value;
        const communityName = communities[selectedCommunity].name;
        if (simulationResult) {
            if (allCorrect) {
                simulationResult.innerHTML = `<p>Congratulations, ${communityName} community is Resilient to Flood and Heatwave!</p>`;
                // Create fireworks container
                const fireworksContainer = document.createElement('div');
                fireworksContainer.className = 'fireworks-container';
                document.body.appendChild(fireworksContainer);

                // Create resilient text overlay
                const resilientOverlay = document.createElement('div');
                resilientOverlay.className = 'resilient-overlay';
                resilientOverlay.textContent = `YES!!! We Made ${communityName} Resilient to Flood and Heatwave`;
                document.body.appendChild(resilientOverlay);

                // Function to create a single firework burst
                const createFireworkBurst = () => {
                    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff9900', '#ff0099'];
                    const burstCount = 3; // Simultaneous bursts per interval
                    for (let burst = 0; burst < burstCount; burst++) {
                        // Random position for each burst (within 60% of screen)
                        const centerX = window.innerWidth * (0.2 + Math.random() * 0.6);
                        const centerY = window.innerHeight * (0.2 + Math.random() * 0.6);
                        // Create 30 particles per burst
                        for (let i = 0; i < 30; i++) {
                            const particle = document.createElement('div');
                            particle.className = 'firework-particle';
                            particle.style.left = `${centerX}px`;
                            particle.style.top = `${centerY}px`;
                            // Random trajectory
                            const angle = Math.random() * 2 * Math.PI;
                            const distance = 100 + Math.random() * 200; // Spread 100-300px
                            particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
                            particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
                            // Random color
                            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                            // Random animation duration (0.8s to 1.4s)
                            particle.style.animationDuration = `${0.8 + Math.random() * 0.6}s`;
                            fireworksContainer.appendChild(particle);
                        }
                    }
                };

                // Start fireworks immediately
                createFireworkBurst();

                // Loop fireworks every 1.5 seconds
                fireworksInterval = setInterval(createFireworkBurst, 1500);

                // Clean up old particles periodically to prevent DOM buildup
                setInterval(() => {
                    const particles = fireworksContainer.querySelectorAll('.firework-particle');
                    particles.forEach(particle => {
                        if (particle.style.opacity === '0') {
                            particle.remove();
                        }
                    });
                }, 2000);
            } else {
                simulationResult.innerHTML = `<p>Some connections are incorrect for ${communityName}. Dotted red lines indicate wrong matches for: ${incorrectIndicators.join(', ')}.</p>`;
            }
            simulationResult.style.display = 'block';
        }
        simulateButton.style.display = 'none';
        replayButton.style.display = 'block';
        console.log(`Simulation complete. All correct: ${allCorrect}, Incorrect indicators: ${incorrectIndicators.join(', ')}`);
    }, animationDelay + 100); // Small buffer after last polyline animation
}

function replayGame() {
    // Stop fireworks and remove text overlay if running
    if (fireworksInterval) {
        clearInterval(fireworksInterval);
        fireworksInterval = null;
        const fireworksContainer = document.querySelector('.fireworks-container');
        if (fireworksContainer) {
            fireworksContainer.remove();
        }
        const resilientOverlay = document.querySelector('.resilient-overlay');
        if (resilientOverlay) {
            resilientOverlay.remove();
        }
    }

    if (simulationResult) {
        simulationResult.style.display = 'none';
        simulationResult.innerHTML = '';
    }
    startButton.style.display = 'block';
    replayButton.style.display = 'none';
    splashInstructions.style.display = 'block';
    splashMessage.textContent = `Let's make ${communities[document.getElementById('communitySelect').value].name} Resilient.`;

    markers.forEach(marker => {
        try {
            map.removeLayer(marker);
        } catch (error) {
            console.error('Error removing marker during replay:', error);
        }
    });
    polylines.forEach(polyline => {
        try {
            map.removeLayer(polyline);
        } catch (error) {
            console.error('Error removing polyline during replay:', error);
        }
    });
    markers = [];
    polylines = [];
    connections = [];
    selectedSymbols = [];
    updateSymbolList();
    simulateButton.style.display = 'none';

    placeSymbols();
}

function updateMap() {
    // Stop fireworks and remove text overlay if running
    if (fireworksInterval) {
        clearInterval(fireworksInterval);
        fireworksInterval = null;
        const fireworksContainer = document.querySelector('.fireworks-container');
        if (fireworksContainer) {
            fireworksContainer.remove();
        }
        const resilientOverlay = document.querySelector('.resilient-overlay');
        if (resilientOverlay) {
            resilientOverlay.remove();
        }
    }

    const select = document.getElementById('communitySelect');
    if (!select) {
        console.error('Community select element not found');
        return;
    }
    const selectedCommunity = select.value;

    markers.forEach(marker => {
        try {
            map.removeLayer(marker);
        } catch (error) {
            console.error('Error removing marker in updateMap:', error);
        }
    });
    polylines.forEach(polyline => {
        try {
            map.removeLayer(polyline);
        } catch (error) {
            console.error('Error removing polyline in updateMap:', error);
        }
    });
    markers = [];
    polylines = [];
    connections = [];
    selectedSymbols = [];
    if (symbolList) {
        symbolList.innerHTML = '';
        const selectedSymbolsBox = document.getElementById('selectedSymbolsBox');
        if (selectedSymbolsBox) selectedSymbolsBox.remove();
        symbolList = null;
    }
    joinButton.style.display = 'none';
    simulateButton.style.display = 'none';
    if (simulationResult) {
        simulationResult.style.display = 'none';
        simulationResult.innerHTML = '';
    }
    startButton.style.display = 'block';
    replayButton.style.display = 'none';
    splashMessage.textContent = `Let's make ${selectedCommunity ? communities[selectedCommunity].name : ''} Resilient.`;
    splashInstructions.style.display = 'block';
    splashScreen.style.display = 'none';

    if (selectedCommunity && communities[selectedCommunity]) {
        const { lat, lng, name } = communities[selectedCommunity];

        if (currentLayer !== satelliteMap) {
            try {
                map.removeLayer(currentLayer);
                satelliteMap.addTo(map);
                currentLayer = satelliteMap;
            } catch (error) {
                console.error('Error switching to satellite map:', error);
                fallbackMap.addTo(map);
                currentLayer = fallbackMap;
            }
        }

        try {
            map.flyTo([lat, lng], 16, {
                duration: 1.5
            }).once('moveend', () => {
                communityNameSpan.textContent = name;
                splashScreen.style.display = 'flex';
            });
        } catch (error) {
            console.error('Error flying to community location:', error);
        }
    } else {
        if (currentLayer !== openStreetMap) {
            try {
                map.removeLayer(currentLayer);
                openStreetMap.addTo(map);
                currentLayer = openStreetMap;
            } catch (error) {
                console.error('Error switching to OpenStreetMap:', error);
                fallbackMap.addTo(map);
                currentLayer = fallbackMap;
            }
        }
        try {
            map.flyTo([27.7172, 85.3240], 7, {
                duration: 1.5
            });
        } catch (error) {
            console.error('Error flying to default location:', error);
        }
    }
}

// Toggle sidebar visibility
const toggleButton = document.querySelector('.toggle-btn');
toggleButton.addEventListener('click', () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('collapsed');
    sidebar.classList.toggle('expanded');
});

console.log('Map initialized:', map);
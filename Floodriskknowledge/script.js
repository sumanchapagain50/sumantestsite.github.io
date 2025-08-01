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
const sidebarLeft = document.getElementById('sidebar-left');
const hamburgerToggle = document.getElementById('hamburger-toggle');
const rotateHorizontalBtn = document.querySelector('button[onclick="rotateCube(\'horizontal\')"]');
const rotateVerticalBtn = document.querySelector('button[onclick="rotateCube(\'vertical\')"]');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const languageSplash = document.getElementById('language-splash');
const langEnglishBtn = document.getElementById('lang-english-btn');
const langNepaliBtn = document.getElementById('lang-nepali-btn');
const container = document.querySelector('.container');
const sidebarRight = document.querySelector('.sidebar-right');


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


window.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bgSound');
  const muteBtn = document.getElementById('muteBtn');

audio.volume = 0.05;

  // Try playing the audio
  const playAudio = () => {
    audio.play().catch(() => {
      // Handle autoplay restrictions
    });
  };
  playAudio();

  // Fallback to play after user interaction
  document.body.addEventListener('click', playAudio, { once: true });

  // Mute/unmute toggle
  muteBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    muteBtn.textContent = audio.muted ? '🔇' : '🔊';
  });
});



let gameStarted = false;
let gameSubmitted = false;
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
let currentLanguage = 'English'; // Default language
let lastTapTime = 0;
let lastTappedTile = null;

const faceTitles = {
  front: { English: "Mitigation", Nepali: "न्यूनीकरण" },
  back: { English: "Vulnerability", Nepali: "संकटासन्नता" },
  right: { English: "Capacity", Nepali: "क्षमता" },
  left: { English: "Preparedness", Nepali: "पूर्वतयारी" },
  top: { English: "Response", Nepali: "प्रतिकार्य" },
  bottom: { English: "Recovery", Nepali: "पुनर्लाभ" }
};

const hazardActions = {
  Flood: {
    Mitigation: [
  { text: { English: "Construct Dykes", Nepali: "डाईक निर्माण गर्नु" }, point: 9 },
  { text: { English: "Improve Drainage", Nepali: "ढल निकासमा सुधार गर्नु" }, point: 8 },
  { text: { English: "Raised Homes", Nepali: "घरहरू उचो बनाउनु" }, point: 8 },
  { text: { English: "Rainwater Harvesting", Nepali: "वर्षाको पानी संकलन" }, point: 1 },
  { text: { English: "Permeable Pavements", Nepali: "पानी सोस्ने सडकहरु" }, point: 4 },
  { text: { English: "River Widening", Nepali: "नदी चौडा गरिनु" }, point: 10 },
  { text: { English: "Wetland Restoration", Nepali: "सिमसार पुनर्स्थापना" }, point: 9 },
  { text: { English: "Flood Barriers", Nepali: "बाढी अवरोधकहरू" }, point: 8 },
  { text: { English: "Reforestation", Nepali: "बृक्षारोपण" }, point: 7 },
  { text: { English: "Flood-Resistant Crops", Nepali: "बाढी प्रतिरोधी बालीहरू" }, point: 6 },
  { text: { English: "Early Warning Systems", Nepali: "पूर्वसूचना प्रणालीहरू" }, point: 10 },
  { text: { English: "Retention Ponds", Nepali: "पोखरीहरू" }, point: 8 },
  { text: { English: "Floodplain Zoning", Nepali: "बाढी क्षेत्र वर्गिकरण" }, point: 9 },
  { text: { English: "Dredging Rivers", Nepali: "नदीहरू खनन" }, point: 7 },
  { text: { English: "Green Infrastructure", Nepali: "हरित पूर्वाधार" }, point: 8 },
  { text: { English: "Flood Walls", Nepali: "बाढी प्रतिरोधी पर्खालहरू" }, point: 8 },
  { text: { English: "Channel Diversion", Nepali: "नाला फर्काउनु" }, point: 7 },
  { text: { English: "Stormwater Pumps", Nepali: "बाढीको पानी तान्नु" }, point: 6 },
  { text: { English: "Soil Bioengineering", Nepali: "जैविक तटबन्ध" }, point: 7 },
  { text: { English: "Flood Gates", Nepali: "नहरका ढोकाहरू" }, point: 8 },
],
Vulnerability: [
  { text: { English: "Low-Income Areas", Nepali: "आय कम भएका क्षेत्रहरू" }, point: 7 },
  { text: { English: "Informal Settlements", Nepali: "अनौपचारिक बस्तीहरू" }, point: 8 },
  { text: { English: "No Insurance", Nepali: "बीमा नहुनु" }, point: 9 },
  { text: { English: "Elderly Population", Nepali: "वृद्धहरुको जनसंख्या" }, point: 10 },
  { text: { English: "Children in School", Nepali: "स्कूले विद्यार्थीहरू" }, point: 9 },
  { text: { English: "Disabled People", Nepali: "अपाङ्गता भएका व्यक्तिहरू" }, point: 10 },
  { text: { English: "Poor Infrastructure", Nepali: "कमजोर पूर्वाधार" }, point: 8 },
  { text: { English: "Dense Urban Areas", Nepali: "घना शहरी क्षेत्रहरू" }, point: 7 },
  { text: { English: "Lack of Evacuation Routes", Nepali: "निकास मार्गहरूको अभाव" }, point: 9 },
  { text: { English: "Unprotected Farmland", Nepali: "असुरक्षित खेतबारी" }, point: 6 },
  { text: { English: "Single-Story Homes", Nepali: "एक तल्लाको घरहरू" }, point: 8 },
  { text: { English: "Overcrowded Shelters", Nepali: "अति भीडभाड आश्रयस्थलहरू" }, point: 7 },
  { text: { English: "Limited Healthcare Access", Nepali: "सीमित स्वास्थ्य सेवाको पहुँच" }, point: 9 },
  { text: { English: "Unstable Riverbanks", Nepali: "अस्थिर नदी किनारहरू" }, point: 8 },
  { text: { English: "Lack of Early Warning", Nepali: "पूर्व सूचनाको अभाव" }, point: 10 },
  { text: { English: "High Population Density", Nepali: "उच्च जनघनत्व" }, point: 8 },
  { text: { English: "Poor Communication Systems", Nepali: "कमजोर संचार प्रणालीहरू" }, point: 7 },
  { text: { English: "Dependent Populations", Nepali: "निर्भर जनसंख्या" }, point: 9 },
  { text: { English: "Inadequate Drainage", Nepali: "अपर्याप्त निकास" }, point: 8 },
  { text: { English: "Unreinforced Buildings", Nepali: "अप्रबलित भवनहरू" }, point: 9 },
],
    Capacity: [
  { text: { English: "Boats", Nepali: "डुङ्गाहरू" }, point: 10 },
  { text: { English: "First Aid Kits", Nepali: "प्राथमिक उपचार सामाग्री" }, point: 7 },
  { text: { English: "Life Jackets", Nepali: "लाइफ ज्याकेट" }, point: 10 },
  { text: { English: "Rescue Teams", Nepali: "उद्धार टोली" }, point: 10 },
  { text: { English: "Food Stockpiles", Nepali: "खाद्य भण्डार" }, point: 7 },
  { text: { English: "Rescue Drills", Nepali: "उद्धार अभ्यास" }, point: 6 },
  { text: { English: "Emergency Shelters", Nepali: "आकस्मिक आश्रयस्थल" }, point: 9 },
  { text: { English: "Water Purification Units", Nepali: "पानी शुद्धीकरण प्रणाली" }, point: 8 },
  { text: { English: "Mobile Medical Units", Nepali: "चिकित्सा सेवा" }, point: 9 },
  { text: { English: "Communication Radios", Nepali: "संचार यन्त्र" }, point: 7 },
  { text: { English: "Sandbags", Nepali: "बालुवाका बोरा" }, point: 6 },
  { text: { English: "Backup Generators", Nepali: "वैकल्पिक जेनेरेटर" }, point: 8 },
  { text: { English: "Water Pumps", Nepali: "पानीको पम्प" }, point: 7 },
  { text: { English: "Community Volunteers", Nepali: "सामुदायिक स्वयंसेवकहरू" }, point: 8 },
  { text: { English: "Emergency Vehicles", Nepali: "आकस्मिक सवारी साधनहरू" }, point: 9 },
  { text: { English: "Temporary Bridges", Nepali: "अस्थायी पुलहरू" }, point: 7 },
  { text: { English: "Warning Sirens", Nepali: "चेतावनी साइरनहरू" }, point: 8 },
  { text: { English: "Evacuation Maps", Nepali: "निकास नक्शाहरू" }, point: 7 },
  { text: { English: "Trained Medics", Nepali: "प्रशिक्षित स्वास्थ्यकर्मीहरू" }, point: 9 },
  { text: { English: "Relief Supply Kits", Nepali: "राहत आपूर्ति किटहरू" }, point: 6 },
],
Preparedness: [
  { text: { English: "Evacuation Plans", Nepali: "निकास योजनाहरू" }, point: 10 },
  { text: { English: "Mock Drills", Nepali: "मक ड्रिलहरू" }, point: 10 },
  { text: { English: "Community Groups", Nepali: "सामुदायिक समूहहरू" }, point: 9 },
  { text: { English: "Flood Awareness", Nepali: "बाढी जागरूकता" }, point: 10 },
  { text: { English: "School Education", Nepali: "स्कूल शिक्षा" }, point: 9 },
  { text: { English: "SMS Alerts", Nepali: "एसएमएस चेतावनीहरू" }, point: 7 },
  { text: { English: "Emergency Kits", Nepali: "आकस्मिक किटहरू" }, point: 8 },
  { text: { English: "Flood Mapping", Nepali: "बाढी नक्शांकन" }, point: 9 },
  { text: { English: "Local Training", Nepali: "स्थानीय तालिम" }, point: 8 },
  { text: { English: "Warning Systems", Nepali: "चेतावनी प्रणालीहरू" }, point: 10 },
  { text: { English: "Safe Routes", Nepali: "सुरक्षित मार्गहरू" }, point: 9 },
  { text: { English: "Public Workshops", Nepali: "सार्वजनिक कार्यशालाहरू" }, point: 7 },
  { text: { English: "Volunteer Networks", Nepali: "स्वयंसेवक नेटवर्कहरू" }, point: 8 },
  { text: { English: "Flood Drills", Nepali: "बाढी अभ्यासहरू" }, point: 8 },
  { text: { English: "Risk Assessments", Nepali: "जोखिम मूल्यांकन" }, point: 9 },
  { text: { English: "Community Sirens", Nepali: "सामुदायिक साइरनहरू" }, point: 7 },
  { text: { English: "Emergency Contacts", Nepali: "आकस्मिक सम्पर्कहरू" }, point: 6 },
  { text: { English: "Flood Shelters", Nepali: "बाढी आश्रयस्थलहरू" }, point: 9 },
  { text: { English: "Weather Monitoring", Nepali: "मौसम निगरानी" }, point: 8 },
  { text: { English: "Response Plans", Nepali: "प्रतिक्रिया योजनाहरू" }, point: 9 },
],
Response: [
  { text: { English: "Immediate Rescue", Nepali: "तत्काल उद्धार" }, point: 10 },
  { text: { English: "Temporary Shelter", Nepali: "अस्थायी आश्रय" }, point: 9 },
  { text: { English: "Medical Aid", Nepali: "चिकित्सा सहायता" }, point: 9 },
  { text: { English: "Food Distribution", Nepali: "खाद्य वितरण" }, point: 9 },
  { text: { English: "Water Supply", Nepali: "पानी आपूर्ति" }, point: 8 },
  { text: { English: "Family Tracing", Nepali: "परिवार खोजी" }, point: 6 },
  { text: { English: "Emergency Transport", Nepali: "आकस्मिक परिवहन" }, point: 8 },
  { text: { English: "Communication Systems", Nepali: "संचार प्रणालीहरू" }, point: 7 },
  { text: { English: "Relief Camps", Nepali: "राहत शिविरहरू" }, point: 9 },
  { text: { English: "Search and Rescue", Nepali: "खोज र उद्धार" }, point: 10 },
  { text: { English: "Water Purification", Nepali: "पानी शुद्धीकरण" }, point: 8 },
  { text: { English: "Power Restoration", Nepali: "विद्युत् पुनर्स्थापना" }, point: 7 },
  { text: { English: "Debris Removal", Nepali: "फोहोर हटाउने" }, point: 6 },
  { text: { English: "Volunteer Coordination", Nepali: "स्वयंसेवक समन्वय" }, point: 7 },
  { text: { English: "Mobile Clinics", Nepali: "मोबाइल क्लिनिकहरू" }, point: 9 },
  { text: { English: "Psychological Support", Nepali: "मनोवैज्ञानिक समर्थन" }, point: 6 },
  { text: { English: "Road Clearing", Nepali: "सडक सफाइ" }, point: 7 },
  { text: { English: "Sanitation Services", Nepali: "सरसफाइ सेवाहरू" }, point: 8 },
  { text: { English: "Emergency Broadcasts", Nepali: "आकस्मिक प्रसारणहरू" }, point: 7 },
  { text: { English: "Relief Supplies", Nepali: "राहत सामग्रीहरू" }, point: 8 },
],
Recovery: [
  { text: { English: "Rebuild Homes", Nepali: "घरहरू पुनर्निर्माण" }, point: 9 },
  { text: { English: "Restore Schools", Nepali: "स्कूलहरू पुनर्स्थापना" }, point: 7 },
  { text: { English: "Compensation", Nepali: "क्षतिपूर्ति" }, point: 8 },
  { text: { English: "Drainage Fix", Nepali: "निकास मर्मत" }, point: 7 },
  { text: { English: "Livelihood Support", Nepali: "जीविकोपार्जन समर्थन" }, point: 8 },
  { text: { English: "Cash for Work", Nepali: "कामका लागि नगद" }, point: 6 },
  { text: { English: "Infrastructure Repair", Nepali: "पूर्वाधार मर्मत" }, point: 9 },
  { text: { English: "Health Services", Nepali: "स्वास्थ्य सेवाहरू" }, point: 8 },
  { text: { English: "Agricultural Recovery", Nepali: "कृषि पुनर्प्राप्ति" }, point: 7 },
  { text: { English: "Water System Repair", Nepali: "पानी प्रणाली मर्मत" }, point: 8 },
  { text: { English: "Community Rebuilding", Nepali: "सामुदायिक पुनर्निर्माण" }, point: 9 },
  { text: { English: "Mental Health Support", Nepali: "मानसिक स्वास्थ्य समर्थन" }, point: 6 },
  { text: { English: "Road Reconstruction", Nepali: "सडक पुनर्निर्माण" }, point: 8 },
  { text: { English: "Economic Aid", Nepali: "आर्थिक सहायता" }, point: 7 },
  { text: { English: "School Supplies", Nepali: "स्कूल सामग्रीहरू" }, point: 6 },
  { text: { English: "Flood Defense Upgrades", Nepali: "बाढी रक्षा सुधारहरू" }, point: 9 },
  { text: { English: "Business Recovery Grants", Nepali: "व्यवसाय पुनर्प्राप्ति अनुदान" }, point: 7 },
  { text: { English: "Sanitation Restoration", Nepali: "सरसफाइ पुनर्स्थापना" }, point: 8 },
  { text: { English: "Livestock Replacement", Nepali: "पशुधन प्रतिस्थापन" }, point: 6 },
  { text: { English: "Public Awareness", Nepali: "सार्वजनिक जागरूकता" }, point: 7 },
]
  },
  Heatwave: {
    Mitigation: [
  { text: { English: "Install Green Roofs", Nepali: "हरित छतहरू स्थापना गर्नुहोस्" }, point: 8 },
  { text: { English: "Plant Shade Trees", Nepali: "छायादार रूखहरू रोप्नुहोस्" }, point: 7 },
  { text: { English: "Use Reflective Pavements", Nepali: "प्रतिबिम्बित सडकहरू प्रयोग गर्नुहोस्" }, point: 9 },
  { text: { English: "Improve Building Insulation", Nepali: "भवन इन्सुलेशन सुधार गर्नुहोस्" }, point: 8 },
  { text: { English: "Promote Cool Roofs", Nepali: "चिसो छतहरू प्रोत्साहन गर्नुहोस्" }, point: 7 },
  { text: { English: "Create Urban Green Spaces", Nepali: "शहरी हरित स्थानहरू सिर्जना गर्नुहोस्" }, point: 6 },
  { text: { English: "Install Solar Shades", Nepali: "सौर्य छायाहरू स्थापना गर्नुहोस्" }, point: 7 },
  { text: { English: "Use Energy-Efficient Cooling", Nepali: "ऊर्जा-कुशल शीतलन प्रयोग गर्नुहोस्" }, point: 8 },
  { text: { English: "Increase Ventilation Systems", Nepali: "हावा संचार प्रणालीहरू बढाउनुहोस्" }, point: 7 },
  { text: { English: "Promote Light-Colored Buildings", Nepali: "हल्का रङका भवनहरू प्रोत्साहन गर्नुहोस्" }, point: 6 },
  { text: { English: "Urban Heat Mapping", Nepali: "शहरी ताप नक्शांकन" }, point: 8 },
  { text: { English: "Install Mist Systems", Nepali: "मिस्ट प्रणालीहरू स्थापना गर्नुहोस्" }, point: 6 },
  { text: { English: "Enhance Public Fountains", Nepali: "सार्वजनिक फोहराहरू सुधार गर्नुहोस्" }, point: 5 },
  { text: { English: "Reflective Window Films", Nepali: "प्रतिबिम्बित झ्याल फिल्महरू" }, point: 7 },
  { text: { English: "Promote Green Walls", Nepali: "हरित पर्खालहरू प्रोत्साहन गर्नुहोस्" }, point: 6 },
  { text: { English: "Heat-Resistant Materials", Nepali: "ताप प्रतिरोधी सामग्रीहरू" }, point: 8 },
  { text: { English: "Shade Structures", Nepali: "छायादार संरचनाहरू" }, point: 7 },
  { text: { English: "Cool Pavement Coatings", Nepali: "चिसो सडक कोटिंगहरू" }, point: 8 },
  { text: { English: "Public Water Stations", Nepali: "सार्वजनिक पानी स्टेशनहरू" }, point: 6 },
  { text: { English: "Urban Forestry Programs", Nepali: "शहरी वन कार्यक्रमहरू" }, point: 7 },
],
Vulnerability: [
  { text: { English: "Elderly Residents", Nepali: "वृद्ध बासिन्दाहरू" }, point: 10 },
  { text: { English: "Low-Income Communities", Nepali: "कम आय भएका समुदायहरू" }, point: 8 },
  { text: { English: "Children", Nepali: "बालबालिकाहरू" }, point: 9 },
  { text: { English: "Homeless Population", Nepali: "घरबारविहीन जनसंख्या" }, point: 9 },
  { text: { English: "Poor Housing Conditions", Nepali: "कमजोर आवास अवस्थाहरू" }, point: 8 },
  { text: { English: "Limited Cooling Access", Nepali: "सीमित शीतलन पहुँच" }, point: 9 },
  { text: { English: "Outdoor Workers", Nepali: "बाहिरी कामदारहरू" }, point: 8 },
  { text: { English: "Chronic Illness", Nepali: "दीर्घकालीन रोगहरू" }, point: 10 },
  { text: { English: "Dense Urban Areas", Nepali: "घना शहरी क्षेत्रहरू" }, point: 7 },
  { text: { English: "Lack of Green Spaces", Nepali: "हरित स्थानहरूको अभाव" }, point: 7 },
  { text: { English: "No Air Conditioning", Nepali: "वातानुकूलन नभएको" }, point: 9 },
  { text: { English: "High-Rise Buildings", Nepali: "उच्च भवनहरू" }, point: 7 },
  { text: { English: "Limited Water Access", Nepali: "सीमित पानी पहुँच" }, point: 8 },
  { text: { English: "Poor Ventilation", Nepali: "कमजोर हावा संचार" }, point: 8 },
  { text: { English: "Disabled Individuals", Nepali: "अपाङ्ग व्यक्तिहरू" }, point: 9 },
  { text: { English: "Urban Heat Islands", Nepali: "शहरी ताप टापुहरू" }, point: 7 },
  { text: { English: "Lack of Shade", Nepali: "छायाको अभाव" }, point: 6 },
  { text: { English: "Overcrowded Housing", Nepali: "अति भीडभाड आवास" }, point: 7 },
  { text: { English: "Insufficient Healthcare", Nepali: "अपर्याप्त स्वास्थ्य सेवा" }, point: 8 },
  { text: { English: "No Early Warning", Nepali: "प्रारम्भिक चेतावनीको अभाव" }, point: 9 },
],
Capacity: [
  { text: { English: "Cooling Centers", Nepali: "शीतलता केन्द्र" }, point: 10 },
  { text: { English: "Portable Fans", Nepali: "पोर्टेबल पंखा" }, point: 7 },
  { text: { English: "Water Stations", Nepali: "पानी स्टेशनहरू" }, point: 8 },
  { text: { English: "Medical Teams", Nepali: "चिकित्सा टोलीहरू" }, point: 9 },
  { text: { English: "Emergency Kits", Nepali: "आकस्मिक किटहरू" }, point: 7 },
  { text: { English: "Shade Tents", Nepali: "छायादार टेन्टहरू" }, point: 6 },
  { text: { English: "Hydration Packs", Nepali: "हाइड्रेशन प्याकहरू" }, point: 7 },
  { text: { English: "Mobile Cooling Units", Nepali: "मोबाइल शीतलन एकाइहरू" }, point: 8 },
  { text: { English: "Community Volunteers", Nepali: "सामुदायिक स्वयंसेवकहरू" }, point: 8 },
  { text: { English: "Power Generators", Nepali: "शक्ति जेनेरेटरहरू" }, point: 7 },
  { text: { English: "Cooling Vests", Nepali: "शीतलन भेस्टहरू" }, point: 6 },
  { text: { English: "Public Transport AC", Nepali: "सार्वजनिक यातायात वातानुकूलन" }, point: 8 },
  { text: { English: "Heat Alert Systems", Nepali: "ताप चेतावनी प्रणालीहरू" }, point: 9 },
  { text: { English: "First Aid Supplies", Nepali: "प्राथमिक उपचार सामग्रीहरू" }, point: 7 },
  { text: { English: "Emergency Vehicles", Nepali: "आकस्मिक सवारी साधनहरू" }, point: 8 },
  { text: { English: "Cooling Shelters", Nepali: "शीतलन आश्रयस्थलहरू" }, point: 9 },
  { text: { English: "Communication Radios", Nepali: "संचार रेडियोहरू" }, point: 7 },
  { text: { English: "Water Tankers", Nepali: "पानी ट्यांकरहरू" }, point: 8 },
  { text: { English: "Trained Responders", Nepali: "प्रशिक्षित प्रतिक्रियाकर्ताहरू" }, point: 9 },
  { text: { English: "Cooling Mats", Nepali: "शीतलन म्याटहरू" }, point: 6 },
],
Preparedness: [
  { text: { English: "Heatwave Action Plans", Nepali: "गर्मीको लहर कार्य योजनाहरू" }, point: 10 },
  { text: { English: "Public Awareness Campaigns", Nepali: "सार्वजनिक जागरूकता अभियानहरू" }, point: 9 },
  { text: { English: "Heatwave Drills", Nepali: "गर्मीको लहर अभ्यासहरू" }, point: 8 },
  { text: { English: "Community Training", Nepali: "सामुदायिक तालिम" }, point: 8 },
  { text: { English: "Early Warning Systems", Nepali: "प्रारम्भिक चेतावनी प्रणालीहरू" }, point: 10 },
  { text: { English: "School Education Programs", Nepali: "स्कूल शिक्षा कार्यक्रमहरू" }, point: 7 },
  { text: { English: "Hydration Education", Nepali: "हाइड्रेशन शिक्षा" }, point: 7 },
  { text: { English: "Cooling Center Maps", Nepali: "शीतलन केन्द्र नक्शाहरू" }, point: 8 },
  { text: { English: "Volunteer Training", Nepali: "स्वयंसेवक तालिम" }, point: 7 },
  { text: { English: "Heat Risk Assessments", Nepali: "ताप जोखिम मूल्यांकन" }, point: 9 },
  { text: { English: "Emergency Contact Lists", Nepali: "आकस्मिक सम्पर्क सूचीहरू" }, point: 6 },
  { text: { English: "Weather Monitoring", Nepali: "मौसम निगरानी" }, point: 8 },
  { text: { English: "Public Workshops", Nepali: "सार्वजनिक कार्यशालाहरू" }, point: 7 },
  { text: { English: "Cooling Shelter Plans", Nepali: "शीतलन आश्रय योजनाहरू" }, point: 9 },
  { text: { English: "SMS Alert Systems", Nepali: "एसएमएस चेतावनी प्रणालीहरू" }, point: 8 },
  { text: { English: "Community Response Teams", Nepali: "सामुदायिक प्रतिक्रिया टोलीहरू" }, point: 8 },
  { text: { English: "Heat Safety Guidelines", Nepali: "ताप सुरक्षा दिशानिर्देशहरू" }, point: 7 },
  { text: { English: "Urban Heat Mapping", Nepali: "शहरी ताप नक्शांकन" }, point: 8 },
  { text: { English: "Emergency Supply Kits", Nepali: "आकस्मिक आपूर्ति किटहरू" }, point: 7 },
  { text: { English: "Local Heatwave Protocols", Nepali: "स्थानीय गर्मीको लहर प्रोटोकलहरू" }, point: 9 },
],
Response: [
  { text: { English: "Open Cooling Centers", Nepali: "शीतलन केन्द्रहरू खोल्नुहोस्" }, point: 10 },
  { text: { English: "Distribute Water", Nepali: "पानी वितरण गर्नुहोस्" }, point: 9 },
  { text: { English: "Medical Assistance", Nepali: "चिकित्सा सहायता" }, point: 9 },
  { text: { English: "Emergency Transport", Nepali: "आकस्मिक परिवहन" }, point: 8 },
  { text: { English: "Fan Distribution", Nepali: "पंखा वितरण" }, point: 7 },
  { text: { English: "Mobile Clinics", Nepali: "मोबाइल क्लिनिकहरू" }, point: 9 },
  { text: { English: "Heatstroke Treatment", Nepali: "तापघात उपचार" }, point: 10 },
  { text: { English: "Public Hydration Points", Nepali: "सार्वजनिक हाइड्रेशन बिन्दुहरू" }, point: 8 },
  { text: { English: "Volunteer Deployment", Nepali: "स्वयंसेवक परिचालन" }, point: 7 },
  { text: { English: "Emergency Broadcasts", Nepali: "आकस्मिक प्रसारणहरू" }, point: 8 },
  { text: { English: "Shade Provision", Nepali: "छाया प्रदान" }, point: 6 },
  { text: { English: "Power Supply Support", Nepali: "विद्युत् आपूर्ति समर्थन" }, point: 7 },
  { text: { English: "Cooling Shelter Setup", Nepali: "शीतलन आश्रय स्थापना" }, point: 9 },
  { text: { English: "Hydration Kits", Nepali: "हाइड्रेशन किटहरू" }, point: 7 },
  { text: { English: "Community Check-ins", Nepali: "सामुदायिक जाँचहरू" }, point: 6 },
  { text: { English: "Cooling Device Loans", Nepali: "शीतलन उपकरण ऋण" }, point: 7 },
  { text: { English: "Heat Alert Updates", Nepali: "ताप चेतावनी अपडेटहरू" }, point: 8 },
  { text: { English: "First Aid Stations", Nepali: "प्राथमिक उपचार स्टेशनहरू" }, point: 8 },
  { text: { English: "Psychological Support", Nepali: "मनोवैज्ञानिक समर्थन" }, point: 6 },
  { text: { English: "Water Tanker Deployment", Nepali: "पानी ट्यांकर परिचालन" }, point: 8 },
],
Recovery: [
  { text: { English: "Rebuild Cooling Systems", Nepali: "शीतलन प्रणालीहरू पुनर्निर्माण" }, point: 9 },
  { text: { English: "Health Services", Nepali: "स्वास्थ्य सेवाहरू" }, point: 8 },
  { text: { English: "Economic Aid", Nepali: "आर्थिक सहायता" }, point: 7 },
  { text: { English: "Mental Health Support", Nepali: "मानसिक स्वास्थ्य समर्थन" }, point: 6 },
  { text: { English: "Water System Repair", Nepali: "पानी प्रणाली मर्मत" }, point: 8 },
  { text: { English: "Business Recovery Grants", Nepali: "व्यवसाय पुनर्प्राप्ति अनुदान" }, point: 7 },
  { text: { English: "Infrastructure Upgrades", Nepali: "पूर्वाधार सुधारहरू" }, point: 9 },
  { text: { English: "Public Awareness", Nepali: "सार्वजनिक जागरूकता" }, point: 7 },
  { text: { English: "Shade Structure Repair", Nepali: "छायादार संरचना मर्मत" }, point: 6 },
  { text: { English: "Community Rebuilding", Nepali: "सामुदायिक पुनर्निर्माण" }, point: 8 },
  { text: { English: "Agricultural Support", Nepali: "कृषि समर्थन" }, point: 7 },
  { text: { English: "School Restoration", Nepali: "स्कूल पुनर्स्थापना" }, point: 7 },
  { text: { English: "Power Grid Repair", Nepali: "विद्युत् ग्रिड मर्मत" }, point: 8 },
  { text: { English: "Cooling Device Distribution", Nepali: "शीतलन उपकरण वितरण" }, point: 6 },
  { text: { English: "Heat-Resistant Materials", Nepali: "ताप प्रतिरोधी सामग्रीहरू" }, point: 8 },
  { text: { English: "Green Space Restoration", Nepali: "हरित स्थान पुनर्स्थापना" }, point: 7 },
  { text: { English: "Workforce Retraining", Nepali: "कार्यबल पुन: तालिम" }, point: 6 },
  { text: { English: "Sanitation Services", Nepali: "सरसफाइ सेवाहरू" }, point: 7 },
  { text: { English: "Insurance Compensation", Nepali: "बीमा क्षतिपूर्ति" }, point: 8 },
  { text: { English: "Urban Heat Mapping", Nepali: "शहरी ताप नक्शांकन" }, point: 7 },
]
  }
};

const actionDescriptions = {
"Construct Dykes": { English: "Build embankments to prevent floodwater overflow.", Nepali: "बाढीको पानी बाहिर निस्कनबाट रोक्न तटबन्ध निर्माण गर्नुहोस्।" },
"Improve Drainage": { English: "Enhance urban drainage systems to handle excess water.", Nepali: "अतिरिक्त पानी सम्हाल्न शहरी निकास प्रणाली सुधार गर्नुहोस्।" },
"Raised Homes": { English: "Raise buildings on stilts or foundations to avoid flood damage.", Nepali: "बाढीको क्षतिबाट बच्न घरहरूलाई खम्बा वा जगमा उचाल्नुहोस्।" },
"Rainwater Harvesting": { English: "Collect and store rainwater to reduce runoff.", Nepali: "बहाव कम गर्न वर्षाको पानी संकलन र भण्डारण गर्नुहोस्।" },
"Permeable Pavements": { English: "Use porous materials for roads to allow water infiltration.", Nepali: "पानी प्रवेश गर्न दिन सडकहरूको लागि छिद्रयुक्त सामग्री प्रयोग गर्नुहोस्।" },
"River Widening": { English: "Expand river channels to increase water-carrying capacity.", Nepali: "पानी बोक्ने क्षमता बढाउन नदी च्यानलहरू विस्तार गर्नुहोस्।" },
"Wetland Restoration": { English: "Restore natural wetlands to absorb floodwater and reduce runoff.", Nepali: "बाढीको पानी अवशोषण गर्न र बहाव कम गर्न प्राकृतिक सिमसार क्षेत्रहरू पुनर्स्थापना गर्नुहोस्।" },
"Flood Barriers": { English: "Install temporary or permanent barriers to block floodwater.", Nepali: "बाढीको पानी रोक्न अस्थायी वा स्थायी अवरोधहरू स्थापना गर्नुहोस्।" },
"Reforestation": { English: "Plant trees in upstream areas to stabilize soil and reduce runoff.", Nepali: "माटो स्थिर गर्न र बहाव कम गर्न माथिल्लो क्षेत्रहरूमा रूखहरू रोप्नुहोस्।" },
"Flood-Resistant Crops": { English: "Promote cultivation of crops that withstand flooding.", Nepali: "बाढी सहन सक्ने बालीहरूको खेतीलाई प्रोत्साहन गर्नुहोस्।" },
"Early Warning Systems": { English: "Implement systems to monitor and alert communities about floods.", Nepali: "बाढीको बारेमा समुदायहरूलाई निगरानी र चेतावनी दिने प्रणालीहरू लागू गर्नुहोस्।" },
"Retention Ponds": { English: "Construct ponds to store excess rainwater and prevent flooding.", Nepali: "बाढी रोक्न अतिरिक्त वर्षाको पानी भण्डारण गर्न पोखरीहरू निर्माण गर्नुहोस्।" },
"Floodplain Zoning": { English: "Restrict development in flood-prone areas to reduce risk.", Nepali: "जोखिम कम गर्न बाढीप्रवण क्षेत्रहरूमा विकास प्रतिबन्ध गर्नुहोस्।" },
"Dredging Rivers": { English: "Remove sediment from riverbeds to increase water flow capacity.", Nepali: "पानीको प्रवाह क्षमता बढाउन नदीको तलछट हटाउनुहोस्।" },
"Green Infrastructure": { English: "Develop parks and bioswales to absorb and manage stormwater.", Nepali: "आँधीको पानी अवशोषण र व्यवस्थापन गर्न पार्कहरू र बायोस्वेलहरू विकास गर्नुहोस्।" },
"Flood Walls": { English: "Construct walls to protect specific areas from floodwater.", Nepali: "बाढीको पानीबाट विशिष्ट क्षेत्रहरू जोगाउन पर्खालहरू निर्माण गर्नुहोस्।" },
"Channel Diversion": { English: "Redirect floodwater through alternate channels.", Nepali: "बाढीको पानीलाई वैकल्पिक च्यानलहरू मार्फत डाइभर्ट गर्नुहोस्।" },
"Stormwater Pumps": { English: "Install pumps to remove excess water during heavy rains.", Nepali: "भारी वर्षामा अतिरिक्त पानी हटाउन पम्पहरू स्थापना गर्नुहोस्।" },
"Soil Bioengineering": { English: "Use plants and natural materials to stabilize riverbanks.", Nepali: "नदी किनारहरू स्थिर गर्न बोटबिरुवा र प्राकृतिक सामग्रीहरू प्रयोग गर्नुहोस्।" },
"Flood Gates": { English: "Install gates to control water flow in flood-prone areas.", Nepali: "बाढीप्रवण क्षेत्रहरूमा पानीको प्रवाह नियन्त्रण गर्न ढोकाहरू स्थापना गर्नुहोस्।" },
"Low-Income Areas": { English: "Communities with limited financial resources vulnerable to flood impacts.", Nepali: "बाढीको प्रभावमा कमजोर सीमित वित्तीय स्रोत भएका समुदायहरू।" },
"Informal Settlements": { English: "Unplanned housing areas with poor construction standards.", Nepali: "कमजोर निर्माण मापदण्ड भएका अनियोजित आवास क्षेत्रहरू।" },
"No Insurance": { English: "Lack of insurance coverage for flood-related losses.", Nepali: "बाढी सम्बन्धी हानिका लागि बीमा कभरेजको अभाव।" },
"Elderly Population": { English: "Older individuals with reduced mobility and health risks.", Nepali: "कम गतिशीलता र स्वास्थ्य जोखिम भएका वृद्ध व्यक्तिहरू।" },
"Children in School": { English: "Schoolchildren vulnerable during flood events.", Nepali: "बाढीको समयमा कमजोर स्कूलका बच्चाहरू।" },
"Disabled People": { English: "Individuals with disabilities facing evacuation challenges.", Nepali: "निकास चुनौतीहरूको सामना गर्ने अपाङ्ग व्यक्तिहरू।" },
"Poor Infrastructure": { English: "Weak roads and utilities prone to flood damage.", Nepali: "बाढीको क्षतिप्रति कमजोर सडक र उपयोगिताहरू।" },
"Dense Urban Areas": { English: "Crowded city zones with high flood exposure.", Nepali: "उच्च बाढी जोखिम भएका भीडभाड शहरी क्षेत्रहरू।" },
"Lack of Evacuation Routes": { English: "Absence of safe paths for flood evacuation.", Nepali: "बाढी निकासका लागि सुरक्षित मार्गहरूको अभाव।" },
"Unprotected Farmland": { English: "Agricultural land exposed to flood damage.", Nepali: "बाढीको क्षतिप्रति खुला कृषि जमिन।" },
"Single-Story Homes": { English: "Homes with no upper floors for refuge during floods.", Nepali: "बाढीको समयमा आश्रयका लागि माथिल्लो तल्ला नभएका घरहरू।" },
"Overcrowded Shelters": { English: "Shelters with limited capacity during floods.", Nepali: "बाढीको समयमा सीमित क्षमता भएका आश्रयस्थलहरू।" },
"Limited Healthcare Access": { English: "Restricted access to medical services during floods.", Nepali: "बाढीको समयमा चिकित्सा सेवाहरूमा सीमित पहुँच।" },
"Unstable Riverbanks": { English: "Riverbanks prone to erosion and collapse.", Nepali: "क्षरण र भत्कने प्रवृत्तिका नदी किनारहरू।" },
"Lack of Early Warning": { English: "No systems to alert communities of floods.", Nepali: "बाढीको चेतावनी दिने प्रणालीहरूको अभाव।" },
"High Population Density": { English: "Areas with many people increasing flood risk.", Nepali: "धेरै मानिसहरू भएको क्षेत्रहरूले बाढी जोखिम बढाउँछ।" },
"Poor Communication Systems": { English: "Weak systems for sharing flood information.", Nepali: "बाढी जानकारी साझा गर्न कमजोर प्रणालीहरू।" },
"Dependent Populations": { English: "Groups relying on others for flood response.", Nepali: "बाढी प्रतिक्रियाका लागि अरूमा निर्भर समूहहरू।" },
"Inadequate Drainage": { English: "Poor drainage systems causing water accumulation.", Nepali: "पानी जम्मा हुने कमजोर निकास प्रणालीहरू।" },
"Unreinforced Buildings": { English: "Structures not built to withstand flood forces.", Nepali: "बाढीको बल सहन नसक्ने संरचनाहरू।" },
"Boats": { English: "Watercraft for rescue and transport during floods.", Nepali: "बाढीको समयमा उद्धार र यातायातका लागि पानीका साधनहरू।" },
"First Aid Kits": { English: "Supplies for immediate medical assistance.", Nepali: "तत्काल चिकित्सा सहायताका लागि सामग्रीहरू।" },
"Life Jackets": { English: "Flotation devices to ensure safety in floodwater.", Nepali: "बाढीको पानीमा सुरक्षाका लागि फ्लोटेशन उपकरणहरू।" },
"Rescue Teams": { English: "Trained personnel for flood rescue operations.", Nepali: "बाढी उद्धार कार्यहरूका लागि प्रशिक्षित कर्मचारीहरू।" },
"Food Stockpiles": { English: "Stored food reserves for emergency distribution.", Nepali: "आकस्मिक वितरणका लागि भण्डार गरिएका खाद्य भण्डारहरू।" },
"Rescue Drills": { English: "Practice exercises for effective flood response.", Nepali: "प्रभावी बाढी प्रतिक्रियाका लागि अभ्यासहरू।" },
"Emergency Shelters": { English: "Safe locations for displaced individuals during floods.", Nepali: "बाढीको समयमा विस्थापित व्यक्तिहरूका लागि सुरक्षित स्थानहरू।" },
"Water Purification Units": { English: "Devices to provide clean drinking water during floods.", Nepali: "बाढीको समयमा स्वच्छ पिउने पानी प्रदान गर्ने उपकरणहरू।" },
"Mobile Medical Units": { English: "Portable clinics for medical care in flood zones.", Nepali: "बाढी क्षेत्रहरूमा चिकित्सा हेरचाहका लागि पोर्टेबल क्लिनिकहरू।" },
"Communication Radios": { English: "Radios for coordination during flood emergencies.", Nepali: "बाढी आपतकालमा समन्वयका लागि रेडियोहरू।" },
"Sandbags": { English: "Bags filled with sand to block floodwater.", Nepali: "बाढीको पानी रोक्न बालुवाले भरिएका झोलाहरू।" },
"Backup Generators": { English: "Power sources for critical operations during floods.", Nepali: "बाढीको समयमा महत्वपूर्ण कार्यहरूका लागि शक्ति स्रोतहरू।" },
"Water Pumps": { English: "Pumps to remove floodwater from affected areas.", Nepali: "प्रभावित क्षेत्रहरूबाट बाढीको पानी हटाउन पम्पहरू।" },
"Community Volunteers": { English: "Local volunteers trained for flood response.", Nepali: "बाढी प्रतिक्रियाका लागि प्रशिक्षित स्थानीय स्वयंसेवकहरू।" },
"Emergency Vehicles": { English: "Vehicles for rescue and relief transport.", Nepali: "उद्धार र राहत यातायातका लागि सवारी साधनहरू।" },
"Temporary Bridges": { English: "Portable bridges to maintain access during floods.", Nepali: "बाढीको समयमा पहुँच कायम राख्न अस्थायी पुलहरू।" },
"Warning Sirens": { English: "Audible alerts to warn communities of floods.", Nepali: "बाढीको चेतावनी दिन समुदायहरूलाई सुनिने चेतावनीहरू।" },
"Evacuation Maps": { English: "Maps guiding safe evacuation routes during floods.", Nepali: "बाढीको समयमा सुरक्षित निकास मार्गहरूको मार्गदर्शन गर्ने नक्शाहरू।" },
"Trained Medics": { English: "Medical professionals trained for flood emergencies.", Nepali: "बाढी आपतकालका लागि प्रशिक्षित चिकित्सा पेशेवरहरू।" },
"Relief Supply Kits": { English: "Pre-packed kits with essential flood relief items.", Nepali: "आवश्यक बाढी राहत वस्तुहरू सहितको पूर्व-प्याक गरिएको किटहरू।" },
"Evacuation Plans": { English: "Organized strategies for safe community evacuation during floods.", Nepali: "बाढीको समयमा सुरक्षित समुदाय निकासका लागि संगठित रणनीतिहरू।" },
"Mock Drills": { English: "Simulated exercises to practice flood response.", Nepali: "बाढी प्रतिक्रियाको अभ्यास गर्न नक्कली अभ्यासहरू।" },
"Community Groups": { English: "Local groups trained to coordinate flood preparedness.", Nepali: "बाढी तयारी समन्वय गर्न प्रशिक्षित स्थानीय समूहहरू।" },
"Flood Awareness": { English: "Public education campaigns on flood risks and safety.", Nepali: "बाढी जोखिम र सुरक्षामा सार्वजनिक शिक्षा अभियानहरू।" },
"School Education": { English: "Teaching students about flood preparedness and safety.", Nepali: "विद्यार्थीहरूलाई बाढी तयारी र सुरक्षा बारे शिक्षा दिने।" },
"SMS Alerts": { English: "Mobile notifications for flood warnings.", Nepali: "बाढी चेतावनीका लागि मोबाइल सूचनाहरू।" },
"Emergency Kits": { English: "Pre-prepared kits with essential flood survival items.", Nepali: "बाढी बाँच्न आवश्यक वस्तुहरू सहितको पूर्व-तयार किटहरू।" },
"Flood Mapping": { English: "Creating maps to identify flood-prone areas.", Nepali: "बाढीप्रवण क्षेत्रहरू पहिचान गर्न नक्शाहरू बनाउने।" },
"Local Training": { English: "Training residents in flood response techniques.", Nepali: "बाढी प्रतिक्रिया प्रविधिहरूमा बासिन्दाहरूलाई तालिम दिने।" },
"Warning Systems": { English: "Systems to alert communities about impending floods.", Nepali: "आगामी बाढीको बारेमा समुदायहरूलाई चेतावनी दिने प्रणालीहरू।" },
"Safe Routes": { English: "Designated paths for safe evacuation during floods.", Nepali: "बाढीको समयमा सुरक्षित निकासका लागि तोकिएका मार्गहरू।" },
"Public Workshops": { English: "Community sessions to teach flood preparedness.", Nepali: "बाढी तयारी सिकाउन सामुदायिक सत्रहरू।" },
"Volunteer Networks": { English: "Organized groups of volunteers for flood readiness.", Nepali: "बाढी तयारीका लागि स्वयंसेवकहरूको संगठित समूहहरू।" },
"Flood Drills": { English: "Practical exercises to simulate flood scenarios.", Nepali: "बाढी परिदृश्यहरूको नक्कल गर्न व्यावहारिक अभ्यासहरू।" },
"Risk Assessments": { English: "Evaluating flood risks to prioritize preparedness.", Nepali: "तयारीलाई प्राथमिकता दिन बाढी जोखिमहरूको मूल्यांकन।" },
"Community Sirens": { English: "Audible alarms to warn of flood dangers.", Nepali: "बाढी खतराहरूको चेतावनी दिन सुनिने अलार्महरू।" },
"Emergency Contacts": { English: "List of contacts for flood emergency services.", Nepali: "बाढी आपतकालीन सेवाहरूका लागि सम्पर्कहरूको सूची।" },
"Flood Shelters": { English: "Designated safe locations for flood refuge.", Nepali: "बाढी आश्रयका लागि तोकिएका सुरक्षित स्थानहरू।" },
"Weather Monitoring": { English: "Tracking weather patterns to predict floods.", Nepali: "बाढीको भविष्यवाणी गर्न मौसम ढाँचाहरूको निगरानी।" },
"Response Plans": { English: "Detailed plans for coordinated flood response.", Nepali: "समन्वित बाढी प्रतिक्रियाका लागि विस्तृत योजनाहरू।" },
"Immediate Rescue": { English: "Prompt operations to save people from floodwaters.", Nepali: "बाढीको पानीबाट मानिसहरूलाई बचाउन तत्काल कार्यहरू।" },
"Temporary Shelter": { English: "Providing temporary housing for displaced individuals.", Nepali: "विस्थापित व्यक्तिहरूको लागि अस्थायी आवास प्रदान गर्ने।" },
"Medical Aid": { English: "Emergency medical support for flood victims.", Nepali: "बाढी पीडितहरूका लागि आकस्मिक चिकित्सा समर्थन।" },
"Food Distribution": { English: "Supplying food to affected communities.", Nepali: "प्रभावित समुदायहरूलाई खाद्य आपूर्ति गर्ने।" },
"Water Supply": { English: "Providing clean drinking water during floods.", Nepali: "बाढीको समयमा स्वच्छ पिउने पानी प्रदान गर्ने।" },
"Family Tracing": { English: "Locating separated family members post-flood.", Nepali: "बाढी पछि छुट्टिएका परिवारका सदस्यहरू खोज्ने।" },
"Emergency Transport": { English: "Vehicles for moving people and supplies during floods.", Nepali: "बाढीको समयमा मानिस र सामग्रीहरू लैजान सवारी साधनहरू।" },
"Communication Systems": { English: "Systems to coordinate flood response efforts.", Nepali: "बाढी प्रतिक्रिया प्रयासहरू समन्वय गर्न प्रणालीहरू।" },
"Relief Camps": { English: "Organized camps for displaced flood victims.", Nepali: "विस्थापित बाढी पीडितहरूका लागि संगठित शिविरहरू।" },
"Search and Rescue": { English: "Operations to locate and save trapped individuals.", Nepali: "फसेका व्यक्तिहरूलाई खोज्ने र बचाउने कार्यहरू।" },
"Water Purification": { English: "Ensuring clean water through purification methods.", Nepali: "शुद्धीकरण विधिहरू मार्फत स्वच्छ पानी सुनिश्चित गर्ने।" },
"Power Restoration": { English: "Restoring electricity in flood-affected areas.", Nepali: "बाढी प्रभावित क्षेत्रहरूमा विद्युत् पुनर्स्थापना गर्ने।" },
"Debris Removal": { English: "Clearing debris to facilitate rescue and recovery.", Nepali: "उद्धार र पुनर्प्राप्तिका लागि फोहोर हटाउने।" },
"Volunteer Coordination": { English: "Organizing volunteers for effective flood response.", Nepali: "प्रभावी बाढी प्रतिक्रियाका लागि स्वयंसेवकहरू संगठन गर्ने।" },
"Mobile Clinics": { English: "Portable medical units for flood-affected areas.", Nepali: "बाढी प्रभावित क्षेत्रहरूका लागि पोर्टेबल चिकित्सा एकाइहरू।" },
"Psychological Support": { English: "Mental health services for flood survivors.", Nepali: "बाढी बाँचेकाहरूका लागि मानसिक स्वास्थ्य सेवाहरू।" },
"Road Clearing": { English: "Removing obstacles to restore road access.", Nepali: "सडक पहुँच पुनर्स्थापना गर्न अवरोधहरू हटाउने।" },
"Sanitation Services": { English: "Providing sanitation facilities to prevent disease.", Nepali: "रोग रोकथाम गर्न सरसफाइ सुविधाहरू प्रदान गर्ने।" },
"Emergency Broadcasts": { English: "Broadcasting critical updates during floods.", Nepali: "बाढीको समयमा महत्वपूर्ण अपडेटहरू प्रसारण गर्ने।" },
"Relief Supplies": { English: "Distributing essential items like blankets and clothes.", Nepali: "कम्बल र लुगा जस्ता आवश्यक वस्तुहरू वितरण गर्ने।" },
"Rebuild Homes": { English: "Reconstructing damaged houses for flood victims.", Nepali: "बाढी पीडितहरूका लागि क्षतिग्रस्त घरहरू पुनर्निर्माण।" },
"Restore Schools": { English: "Repairing educational facilities to resume classes.", Nepali: "कक्षाहरू पुनः सुरु गर्न शैक्षिक सुविधाहरू मर्मत।" },
"Compensation": { English: "Financial support for flood-related losses.", Nepali: "बाढी सम्बन्धी हानिका लागि आर्थिक समर्थन।" },
"Drainage Fix": { English: "Repairing drainage systems to prevent future flooding.", Nepali: "भविष्यको बाढी रोक्न निकास प्रणालीहरू मर्मत।" },
"Livelihood Support": { English: "Aid to restore economic activities post-flood.", Nepali: "बाढी पछि आर्थिक गतिविधिहरू पुनर्स्थापना गर्न सहायता।" },
"Cash for Work": { English: "Paid work programs for recovery efforts.", Nepali: "पुनर्प्राप्ति प्रयासहरूका लागि भुक्तानी कार्य कार्यक्रमहरू।" },
"Infrastructure Repair": { English: "Restoring roads, bridges, and utilities damaged by floods.", Nepali: "बाढीले क्षतिग्रस्त सडक, पुल र उपयोगिताहरू पुनर्स्थापना।" },
"Health Services": { English: "Providing medical care to address flood-related health issues.", Nepali: "बाढी सम्बन्धी स्वास्थ्य समस्याहरू समाधान गर्न चिकित्सा सेवा प्रदान।" },
"Agricultural Recovery": { English: "Restoring farmland and crops affected by floods.", Nepali: "बाढीले प्रभावित खेतबारी र बालीहरू पुनर्स्थापना।" },
"Water System Repair": { English: "Fixing water supply systems damaged by floods.", Nepali: "बाढीले क्षतिग्रस्त पानी आपूर्ति प्रणालीहरू मर्मत।" },
"Community Rebuilding": { English: "Reconstructing community facilities and social structures.", Nepali: "सामुदायिक सुविधाहरू र सामाजिक संरचनाहरू पुनर्निर्माण।" },
"Mental Health Support": { English: "Counseling services for flood survivors' mental health.", Nepali: "बाढी बाँचेकाहरूको मानसिक स्वास्थ्यका लागि परामर्श सेवाहरू।" },
"Road Reconstruction": { English: "Rebuilding roads to restore access post-flood.", Nepali: "बाढी पछि पहुँच पुनर्स्थापना गर्न सडकहरू पुनर्निर्माण।" },
"Economic Aid": { English: "Financial assistance to rebuild local economies.", Nepali: "स्थानीय अर्थतन्त्र पुनर्निर्माण गर्न आर्थिक सहायता।" },
"School Supplies": { English: "Providing materials to replace lost school resources.", Nepali: "हराएका स्कूल स्रोतहरू प्रतिस्थापन गर्न सामग्रीहरू प्रदान।" },
"Flood Defense Upgrades": { English: "Improving flood barriers and levees for future protection.", Nepali: "भविष्यको सुरक्षाका लागि बाढी अवरोध र तटबन्ध सुधार।" },
"Business Recovery Grants": { English: "Grants to help businesses recover from flood losses.", Nepali: "बाढी हानिबाट व्यवसायहरू पुनर्प्राप्तिका लागि अनुदान।" },
"Sanitation Restoration": { English: "Restoring sanitation systems to prevent disease outbreaks.", Nepali: "रोग प्रकोप रोक्न सरसफाइ प्रणालीहरू पुनर्स्थापना।" },
"Livestock Replacement": { English: "Replacing lost livestock to restore agricultural livelihoods.", Nepali: "कृषि जीविकोपार्जन पुनर्स्थापना गर्न हराएका पशुधन प्रतिस्थापन।" },
"Public Awareness": { English: "Educating communities to prevent future flood impacts.", Nepali: "भविष्यको बाढी प्रभाव रोक्न समुदायहरूलाई शिक्षित गर्ने।" },
"Install Green Roofs": { English: "Install vegetation on rooftops to reduce urban heat and provide insulation.", Nepali: "शहरी ताप कम गर्न र इन्सुलेशन प्रदान गर्न छतमा वनस्पति स्थापना गर्नुहोस्।" },
"Plant Shade Trees": { English: "Plant trees to provide shade and lower ambient temperatures.", Nepali: "छाया प्रदान गर्न र वातावरणीय तापमान कम गर्न रूखहरू रोप्नुहोस्।" },
"Use Reflective Pavements": { English: "Use reflective materials for roads to reduce heat absorption.", Nepali: "ताप अवशोषण कम गर्न सडकहरूमा प्रतिबिम्बित सामग्रीहरू प्रयोग गर्नुहोस्।" },
"Improve Building Insulation": { English: "Enhance insulation to keep buildings cooler.", Nepali: "भवनहरूलाई चिसो राख्न इन्सुलेशन सुधार गर्नुहोस्।" },
"Promote Cool Roofs": { English: "Encourage roofs that reflect sunlight to reduce heat.", Nepali: "ताप कम गर्न सूर्यको प्रकाश प्रतिबिम्बित गर्ने छतहरूलाई प्रोत्साहन गर्नुहोस्।" },
"Create Urban Green Spaces": { English: "Develop parks and green areas to cool cities.", Nepali: "शहरहरूलाई चिसो बनाउन पार्कहरू र हरित क्षेत्रहरू विकास गर्नुहोस्।" },
"Install Solar Shades": { English: "Add shades to block sunlight from buildings.", Nepali: "भवनहरूमा सूर्यको प्रकाश रोक्न छायाहरू थप्नुहोस्।" },
"Use Energy-Efficient Cooling": { English: "Implement efficient air conditioning to reduce heat.", Nepali: "ताप कम गर्न कुशल वातानुकूलन लागू गर्नुहोस्।" },
"Increase Ventilation Systems": { English: "Improve airflow in buildings to lower temperatures.", Nepali: "तापमान कम गर्न भवनहरूमा हावा प्रवाह सुधार गर्नुहोस्।" },
"Promote Light-Colored Buildings": { English: "Encourage buildings with light colors to reflect heat.", Nepali: "ताप प्रतिबिम्बित गर्न हल्का रङका भवनहरूलाई प्रोत्साहन गर्नुहोस्।" },
"Urban Heat Mapping": { English: "Map heat-prone areas to prioritize mitigation efforts.", Nepali: "न्यूनीकरण प्रयासहरूलाई प्राथमिकता दिन ताप-प्रवण क्षेत्रहरूको नक्शांकन।" },
"Install Mist Systems": { English: "Set up misting systems in public areas for cooling.", Nepali: "शीतलनका लागि सार्वजनिक क्षेत्रहरूमा मिस्ट प्रणालीहरू स्थापना गर्नुहोस्।" },
"Enhance Public Fountains": { English: "Improve fountains to provide cooling in public spaces.", Nepali: "सार्वजनिक स्थानहरूमा शीतलन प्रदान गर्न फोहराहरू सुधार गर्नुहोस्।" },
"Reflective Window Films": { English: "Apply films to windows to reduce heat gain.", Nepali: "ताप वृद्धि कम गर्न झ्यालहरूमा फिल्महरू लागू गर्नुहोस्।" },
"Promote Green Walls": { English: "Encourage vertical gardens to cool building exteriors.", Nepali: "भवनको बाहिरी भागलाई चिसो बनाउन ठाडो बगैंचाहरूलाई प्रोत्साहन गर्नुहोस्।" },
"Heat-Resistant Materials": { English: "Use materials that withstand high temperatures in construction.", Nepali: "निर्माणमा उच्च तापमान सहन सक्ने सामग्रीहरू प्रयोग गर्नुहोस्।" },
"Shade Structures": { English: "Install awnings or canopies in public areas for shade.", Nepali: "सार्वजनिक क्षेत्रहरूमा छायाका लागि त्रिपाल वा क्यानोपीहरू स्थापना गर्नुहोस्।" },
"Cool Pavement Coatings": { English: "Apply coatings to roads to reflect heat.", Nepali: "ताप प्रतिबिम्बित गर्न सडकहरूमा कोटिंगहरू लागू गर्नुहोस्।" },
"Public Water Stations": { English: "Set up water distribution points to combat dehydration.", Nepali: "डिहाइड्रेशनसँग लड्न पानी वितरण बिन्दुहरू स्थापना गर्नुहोस्।" },
"Urban Forestry Programs": { English: "Promote tree planting to increase urban canopy cover.", Nepali: "शहरी छत्रछायाँ बढाउन रूख रोपणलाई प्रोत्साहन गर्नुहोस्।" },
"Elderly Residents": { English: "Older individuals with higher susceptibility to heat-related illnesses.", Nepali: "ताप सम्बन्धी रोगहरूको उच्च जोखिम भएका वृद्ध व्यक्तिहरू।" },
"Low-Income Communities": { English: "Communities with limited resources to cope with heatwaves.", Nepali: "गर्मीको लहरसँग सामना गर्न सीमित स्रोत भएका समुदायहरू।" },
"Children": { English: "Young individuals vulnerable to heat stress and dehydration.", Nepali: "ताप तनाव र डिहाइड्रेशनप्रति कमजोर बालबालिकाहरू।" },
"Homeless Population": { English: "Individuals without shelter exposed to extreme heat.", Nepali: "चरम तापमा उजागर भएका आश्रयविहीन व्यक्तिहरू।" },
"Poor Housing Conditions": { English: "Homes with inadequate insulation or cooling systems.", Nepali: "अपर्याप्त इन्सुलेशन वा शीतलन प्रणाली भएका घरहरू।" },
"Limited Cooling Access": { English: "Lack of access to cooling devices or facilities.", Nepali: "शीतलन उपकरणहरू वा सुविधाहरूमा पहुँचको अभाव।" },
"Outdoor Workers": { English: "Workers exposed to heat during outdoor activities.", Nepali: "बाहिरी गतिविधिहरूमा तापमा उजागर भएका कामदारहरू।" },
"Chronic Illness": { English: "Individuals with health conditions worsened by heat.", Nepali: "तापले खराब हुने स्वास्थ्य अवस्थाहरू भएका व्यक्तिहरू।" },
"Dense Urban Areas": { English: "Crowded cities with elevated heat retention.", Nepali: "उच्च ताप संरक्षण भएका भीडभाड शहरहरू।" },
"Lack of Green Spaces": { English: "Areas without parks or trees to mitigate heat.", Nepali: "ताप कम गर्न पार्क वा रूखहरू नभएका क्षेत्रहरू।" },
"No Air Conditioning": { English: "Buildings without air conditioning during heatwaves.", Nepali: "गर्मीको लहरमा वातानुकूलन नभएका भवनहरू।" },
"High-Rise Buildings": { English: "Tall buildings with heat-trapping upper floors.", Nepali: "ताप फसाउने माथिल्लो तल्ला भएका अग्ला भवनहरू।" },
"Limited Water Access": { English: "Restricted access to drinking water during heatwaves.", Nepali: "गर्मीको लहरमा पिउने पानीमा सीमित पहुँच।" },
"Poor Ventilation": { English: "Buildings with inadequate airflow increasing heat risk.", Nepali: "अपर्याप्त हावा प्रवाहले ताप जोखिम बढाउने भवनहरू।" },
"Disabled Individuals": { English: "People with disabilities facing heat coping challenges.", Nepali: "गर्मी सामना गर्न चुनौतीहरूको सामना गर्ने अपाङ्ग व्यक्तिहरू।" },
"Urban Heat Islands": { English: "Urban areas with higher temperatures due to infrastructure.", Nepali: "पूर्वाधारका कारण उच्च तापमान भएका शहरी क्षेत्रहरू।" },
"Lack of Shade": { English: "Areas without structures or trees for heat relief.", Nepali: "ताप राहतका लागि संरचना वा रूखहरू नभएका क्षेत्रहरू।" },
"Overcrowded Housing": { English: "Crowded homes with increased heat exposure risks.", Nepali: "ताप जोखिम बढाउने भीडभाड घरहरू।" },
"Insufficient Healthcare": { English: "Limited medical services for heat-related illnesses.", Nepali: "ताप सम्बन्धी रोगहरूका लागि सीमित चिकित्सा सेवाहरू।" },
"No Early Warning": { English: "Lack of systems to alert communities of heatwaves.", Nepali: "गर्मीको लहरको चेतावनी दिने प्रणालीहरूको अभाव।" },
"Cooling Centers": { English: "Designated facilities to provide relief from heat.", Nepali: "गर्मीबाट राहत प्रदान गर्न तोकिएका सुविधाहरू।" },
"Portable Fans": { English: "Portable devices to improve air circulation.", Nepali: "हावा संचार सुधार गर्न पोर्टेबल उपकरणहरू।" },
"Water Stations": { English: "Public points for distributing drinking water.", Nepali: "पिउने पानी वितरणका लागि सार्वजनिक बिन्दुहरू।" },
"Medical Teams": { English: "Trained personnel for heat-related medical emergencies.", Nepali: "ताप सम्बन्धी चिकित्सा आपतकालका लागि प्रशिक्षित कर्मचारीहरू।" },
"Emergency Kits": { English: "Kits with essentials for heatwave survival.", Nepali: "गर्मीको लहर बाँच्नका लागि आवश्यक सामग्रीहरू सहितको किटहरू।" },
"Shade Tents": { English: "Temporary structures for shade in public areas.", Nepali: "सार्वजनिक क्षेत्रहरूमा छायाका लागि अस्थायी संरचनाहरू।" },
"Hydration Packs": { English: "Portable water carriers for personal hydration.", Nepali: "व्यक्तिगत हाइड्रेशनका लागि पोर्टेबल पानी बोक्नेहरू।" },
"Mobile Cooling Units": { English: "Portable air conditioners for emergency cooling.", Nepali: "आकस्मिक शीतलनका लागि पोर्टेबल वातानुकूलन एकाइहरू।" },
"Community Volunteers": { English: "Local volunteers trained for heatwave response.", Nepali: "गर्मीको लहर प्रतिक्रियाका लागि प्रशिक्षित स्थानीय स्वयंसेवकहरू।" },
"Power Generators": { English: "Backup power for cooling systems during outages.", Nepali: "विद्युत् अवरोधमा शीतलन प्रणालीहरूका लागि ब्याकअप शक्ति।" },
"Cooling Vests": { English: "Wearable garments to reduce body heat.", Nepali: "शारीरिक ताप कम गर्न लगाउने कपडाहरू।" },
"Public Transport AC": { English: "Air-conditioned public transport for commuter relief.", Nepali: "यात्री राहतका लागि वातानुकूलित सार्वजनिक यातायात।" },
"Heat Alert Systems": { English: "Systems to warn communities of heatwave risks.", Nepali: "गर्मीको लहर जोखिमहरूको चेतावनी दिने प्रणालीहरू।" },
"First Aid Supplies": { English: "Medical supplies for heat-related emergencies.", Nepali: "ताप सम्बन्धी आपतकालका लागि चिकित्सा सामग्रीहरू।" },
"Emergency Vehicles": { English: "Vehicles for transporting people during heatwaves.", Nepali: "गर्मीको लहरमा मानिसहरू लैजान सवारी साधनहरू।" },
"Cooling Shelters": { English: "Safe locations with cooling for heatwave relief.", Nepali: "गर्मीको लहर राहतका लागि शीतलन सहितका सुरक्षित स्थानहरू।" },
"Communication Radios": { English: "Radios for coordinating heatwave response efforts.", Nepali: "गर्मीको लहर प्रतिक्रिया प्रयासहरू समन्वय गर्न रेडियोहरू।" },
"Water Tankers": { English: "Vehicles delivering water to affected areas.", Nepali: "प्रभावित क्षेत्रहरूमा पानी पुर्‍याउने सवारी साधनहरू।" },
"Trained Responders": { English: "Personnel trained to handle heatwave emergencies.", Nepali: "गर्मीको लहर आपतकाल सम्हाल्न प्रशिक्षित कर्मचारीहरू।" },
"Cooling Mats": { English: "Portable mats to provide personal cooling relief.", Nepali: "व्यक्तिगत शीतलन राहत प्रदान गर्न पोर्टेबल म्याटहरू।" },
"Heatwave Action Plans": { English: "Organized strategies for responding to heatwave events.", Nepali: "गर्मीको लहर घटनाहरूमा प्रतिक्रिया दिन संगठित रणनीतिहरू।" },
"Public Awareness Campaigns": { English: "Educating communities on heatwave risks and safety.", Nepali: "गर्मीको लहर जोखिम र सुरक्षामा समुदायहरूलाई शिक्षित गर्ने।" },
"Heatwave Drills": { English: "Simulated exercises to practice heatwave response.", Nepali: "गर्मीको लहर प्रतिक्रियाको अभ्यास गर्न नक्कली अभ्यासहरू।" },
"Community Training": { English: "Training residents to prepare for heatwaves.", Nepali: "गर्मीको लहरको तयारीका लागि बासिन्दाहरूलाई तालिम दिने।" },
"Early Warning Systems": { English: "Systems to alert communities of impending heatwaves.", Nepali: "आगामी गर्मीको लहरको चेतावनी दिने प्रणालीहरू।" },
"School Education Programs": { English: "Teaching students about heatwave safety measures.", Nepali: "गर्मीको लहर सुरक्षा उपायहरू बारे विद्यार्थीहरूलाई सिकाउने।" },
"Hydration Education": { English: "Educating public on importance of hydration during heatwaves.", Nepali: "गर्मीको लहरमा हाइड्रेशनको महत्व बारे जनतालाई शिक्षित गर्ने।" },
"Cooling Center Maps": { English: "Maps showing locations of cooling centers during heatwaves.", Nepali: "गर्मीको लहरमा शीतलन केन्द्रहरूको स्थान देखाउने नक्शाहरू।" },
"Volunteer Training": { English: "Training volunteers for heatwave response coordination.", Nepali: "गर्मीको लहर प्रतिक्रिया समन्वयका लागि स्वयंसेवकहरूलाई तालिम दिने।" },
"Heat Risk Assessments": { English: "Evaluating heatwave risks to prioritize preparedness.", Nepali: "तयारीलाई प्राथमिकता दिन गर्मीको लहर जोखिमहरूको मूल्यांकन।" },
"Emergency Contact Lists": { English: "Lists of contacts for heatwave emergency services.", Nepali: "गर्मीको लहर आपतकालीन सेवाहरूका लागि सम्पर्कहरूको सूची।" },
"Weather Monitoring": { English: "Tracking weather patterns to predict heatwaves.", Nepali: "गर्मीको लहरको भविष्यवाणी गर्न मौसम ढाँचाहरूको निगरानी।" },
"Public Workshops": { English: "Workshops to teach heatwave preparedness strategies.", Nepali: "गर्मीको लहर तयारी रणनीतिहरू सिकाउन कार्यशालाहरू।" },
"Cooling Shelter Plans": { English: "Plans for establishing cooling shelters during heatwaves.", Nepali: "गर्मीको लहरमा शीतलन आश्रयहरू स्थापना गर्ने योजनाहरू।" },
"SMS Alert Systems": { English: "Mobile notifications for heatwave warnings.", Nepali: "गर्मीको लहर चेतावनीका लागि मोबाइल सूचनाहरू।" },
"Community Response Teams": { English: "Local teams trained for heatwave emergency response.", Nepali: "गर्मीको लहर आपतकालीन प्रतिक्रियाका लागि प्रशिक्षित स्थानीय टोलीहरू।" },
"Heat Safety Guidelines": { English: "Guidelines for safe practices during heatwaves.", Nepali: "गर्मीको लहरमा सुरक्षित अभ्यासहरूका लागि दिशानिर्देशहरू।" },
"Urban Heat Mapping": { English: "Mapping urban areas to identify heat-prone zones.", Nepali: "ताप-प्रवण क्षेत्रहरू पहिचान गर्न शहरी क्षेत्रहरूको नक्शांकन।" },
"Emergency Supply Kits": { English: "Kits with essentials for heatwave preparedness.", Nepali: "गर्मीको लहर तयारीका लागि आवश्यक सामग्रीहरू सहितको किटहरू।" },
"Local Heatwave Protocols": { English: "Localized procedures for heatwave response.", Nepali: "गर्मीको लहर प्रतिक्रियाका लागि स्थानीय प्रक्रियाहरू।" },
"Open Cooling Centers": { English: "Establish facilities for public heat relief.", Nepali: "सार्वजनिक ताप राहतका लागि सुविधाहरू स्थापना गर्नुहोस्।" },
"Distribute Water": { English: "Provide drinking water to prevent dehydration.", Nepali: "डिहाइड्रेशन रोक्न पिउने पानी प्रदान गर्नुहोस्।" },
"Medical Assistance": { English: "Offer medical care for heat-related illnesses.", Nepali: "ताप सम्बन्धी रोगहरूका लागि चिकित्सा हेरचाह प्रदान गर्नुहोस्।" },
"Emergency Transport": { English: "Vehicles to move vulnerable people to safety.", Nepali: "जोखिममा रहेका मानिसहरूलाई सुरक्षित स्थानमा लैजान सवारी साधनहरू।" },
"Fan Distribution": { English: "Distribute fans to improve air circulation.", Nepali: "हावा संचार सुधार गर्न पंखाहरू वितरण गर्नुहोस्।" },
"Mobile Clinics": { English: "Portable medical units for heatwave emergencies.", Nepali: "गर्मीको लहर आपतकालका लागि पोर्टेबल चिकित्सा एकाइहरू।" },
"Heatstroke Treatment": { English: "Immediate treatment for heatstroke victims.", Nepali: "तापघात पीडितहरूका लागि तत्काल उपचार।" },
"Public Hydration Points": { English: "Set up water stations in public areas.", Nepali: "सार्वजनिक क्षेत्रहरूमा पानी स्टेशनहरू स्थापना गर्नुहोस्।" },
"Volunteer Deployment": { English: "Deploy volunteers to assist during heatwaves.", Nepali: "गर्मीको लहरमा सहयोग गर्न स्वयंसेवकहरू परिचालन गर्नुहोस्।" },
"Emergency Broadcasts": { English: "Broadcast updates for heatwave safety.", Nepali: "गर्मीको लहर सुरक्षाका लागि अपडेटहरू प्रसारण गर्नुहोस्।" },
"Shade Provision": { English: "Provide temporary shade in affected areas.", Nepali: "प्रभावित क्षेत्रहरूमा अस्थायी छाया प्रदान गर्नुहोस्।" },
"Power Supply Support": { English: "Ensure power for cooling systems during heatwaves.", Nepali: "गर्मीको लहरमा शीतलन प्रणालीहरूका लागि शक्ति सुनिश्चित गर्नुहोस्।" },
"Cooling Shelter Setup": { English: "Establish shelters with cooling for heat relief.", Nepali: "ताप राहतका लागि शीतलन सहितका आश्रयहरू स्थापना गर्नुहोस्।" },
"Hydration Kits": { English: "Distribute kits with water and hydration supplies.", Nepali: "पानी र हाइड्रेशन सामग्रीहरू सहितका किटहरू वितरण गर्नुहोस्।" },
"Community Check-ins": { English: "Check on vulnerable residents during heatwaves.", Nepali: "गर्मीको लहरमा जोखिममा रहेका बासिन्दाहरूको जाँच गर्नुहोस्।" },
"Cooling Device Loans": { English: "Loan fans or cooling devices to residents.", Nepali: "बासिन्दाहरूलाई पंखा वा शीतलन उपकरणहरू ऋण दिनुहोस्।" },
"Heat Alert Updates": { English: "Provide regular updates on heatwave conditions.", Nepali: "गर्मीको लहर अवस्थाहरूमा नियमित अपडेटहरू प्रदान गर्नुहोस्।" },
"First Aid Stations": { English: "Set up stations for heat-related first aid.", Nepali: "ताप सम्बन्धी प्राथमिक उपचारका लागि स्टेशनहरू स्थापना गर्नुहोस्।" },
"Psychological Support": { English: "Offer mental health support for heatwave stress.", Nepali: "गर्मीको लहर तनावका लागि मानसिक स्वास्थ्य समर्थन प्रदान गर्नुहोस्।" },
"Water Tanker Deployment": { English: "Deploy tankers to supply water in affected areas.", Nepali: "प्रभावित क्षेत्रहरूमा पानी आपूर्ति गर्न ट्यांकरहरू परिचालन गर्नुहोस्।" },
"Rebuild Cooling Systems": { English: "Restore or upgrade air conditioning and cooling infrastructure.", Nepali: "वातानुकूलन र शीतलन पूर्वाधार पुनर्स्थापना वा सुधार गर्नुहोस्।" },
"Health Services": { English: "Provide medical care for heat-related health issues.", Nepali: "ताप सम्बन्धी स्वास्थ्य समस्याहरूका लागि चिकित्सा सेवा प्रदान गर्नुहोस्।" },
"Economic Aid": { English: "Financial assistance to rebuild local Economies.", Nepali: "स्थानीय अर्थतन्त्र पुनर्निर्माण गर्न आर्थिक सहायता।" },
"Mental Health Support": { English: "Counseling services for heatwave survivors' mental health.", Nepali: "गर्मीको लहर बाँचेकाहरूको मानसिक स्वास्थ्यका लागि परामर्श सेवाहरू।" },
"Water System Repair": { English: "Fix water supply systems damaged by heatwaves.", Nepali: "गर्मीको लहरले क्षतिग्रस्त पानी आपूर्ति प्रणालीहरू मर्मत गर्नुहोस्।" },
"Business Recovery Grants": { English: "Grants to help businesses recover from heatwave losses.", Nepali: "गर्मीको लहर हानिबाट व्यवसायहरू पुनर्प्राप्तिका लागि अनुदान।" },
"Infrastructure Upgrades": { English: "Improve infrastructure to withstand future heatwaves.", Nepali: "भविष्यको गर्मीको लहर सहन पूर्वाधार सुधार गर्नुहोस्।" },
"Public Awareness": { English: "Educate communities to prevent future heatwave impacts.", Nepali: "भविष्यको गर्मीको लहर प्रभाव रोक्न समुदायहरूलाई शिक्षित गर्नुहोस्।" },
"Shade Structure Repair": { English: "Repair or replace damaged shade structures.", Nepali: "क्षतिग्रस्त छायादार संरचनाहरू मर्मत वा प्रतिस्थापन गर्नुहोस्।" },
"Community Rebuilding": { English: "Reconstruct community facilities affected by heatwaves.", Nepali: "गर्मीको लहरले प्रभावित सामुदायिक सुविधाहरू पुनर्निर्माण गर्नुहोस्।" },
"Agricultural Support": { English: "Aid to restore crops and farms affected by heat.", Nepali: "तापले प्रभावित बाली र खेतहरू पुनर्स्थापना गर्न सहायता।" },
"School Restoration": { English: "Repair schools to resume education post-heatwave.", Nepali: "गर्मीको लहर पछि शिक्षा पुन: सुरु गर्न स्कूलहरू मर्मत गर्नुहोस्।" },
"Power Grid Repair": { English: "Restore electricity infrastructure damaged by heat.", Nepali: "तापले क्षतिग्रस्त विद्युत् पूर्वाधार पुनर्स्थापना गर्नुहोस्।" },
"Cooling Device Distribution": { English: "Distribute fans or cooling devices to residents.", Nepali: "बासिन्दाहरूलाई पंखा वा शीतलन उपकरणहरू वितरण गर्नुहोस्।" },
"Heat-Resistant Materials": { English: "Use durable materials in rebuilding to resist heat.", Nepali: "ताप प्रतिरोध गर्न पुनर्निर्माणमा टिकाउ सामग्रीहरू प्रयोग गर्नुहोस्।" },
"Green Space Restoration": { English: "Restore parks and green areas to reduce urban heat.", Nepali: "शहरी ताप कम गर्न पार्कहरू र हरित क्षेत्रहरू पुनर्स्थापना गर्नुहोस्।" },
"Workforce Retraining": { English: "Train workers for heatwave-resistant livelihoods.", Nepali: "गर्मीको लहर प्रतिरोधी जीविकोपार्जनका लागि कामदारहरूलाई तालिम दिनुहोस्।" },
"Sanitation Services": { English: "Restore sanitation systems to prevent health risks.", Nepali: "स्वास्थ्य जोखिमहरू रोक्न सरसफाइ प्रणालीहरू पुनर्स्थापना गर्नुहोस्।" },
"Insurance Compensation": { English: "Provide financial compensation for heatwave losses.", Nepali: "गर्मीको लहर हानिका लागि आर्थिक क्षतिपूर्ति प्रदान गर्नुहोस्।" },
"Urban Heat Mapping": { English: "Map heat-affected areas to guide recovery efforts.", Nepali: "पुनर्प्राप्ति प्रयासहरूको मार्गदर्शन गर्न ताप प्रभावित क्षेत्रहरूको नक्शांकन।" }
};

function updateLanguage() {
  hazardSelect.querySelectorAll('option').forEach(option => {
    const text = currentLanguage === 'Nepali' ? option.dataset.nepali : option.dataset.english || option.textContent.split(' / ')[0];
    option.textContent = text;
  });
  gameLevelSelect.querySelectorAll('option').forEach(option => {
    const text = currentLanguage === 'Nepali' ? option.dataset.nepali : option.dataset.english || option.textContent.split(' / ')[0];
    option.textContent = text;
  });
  languageSelect.querySelectorAll('option').forEach(option => {
    const text = currentLanguage === 'Nepali' ? option.dataset.nepali : option.dataset.english || option.textContent.split(' / ')[0];
    option.textContent = text;
  });

  startBtn.textContent = currentLanguage === 'Nepali' ? 'खेल सुरु गर्नुहोस्' : 'Start Game';
  submitBtn.textContent = currentLanguage === 'Nepali' ? 'पेश गर्नुहोस्' : 'Submit';
  resetBtn.textContent = currentLanguage === 'Nepali' ? 'रिसेट गर्नुहोस्' : 'Reset';
  rotateHorizontalBtn.textContent = currentLanguage === 'Nepali' ? 'तेर्सो घुमाउनुहोस्' : 'Rotate Horizontal';
  rotateVerticalBtn.textContent = currentLanguage === 'Nepali' ? 'ठाडो घुमाउनुहोस्' : 'Rotate Vertical';
  fullscreenBtn.textContent = currentLanguage === 'Nepali' ? 'पूर्ण स्क्रिन' : 'Full Screen';

  const voiceLabel = document.querySelector('label span');
  voiceLabel.textContent = currentLanguage === 'Nepali' ? 'आवाज' : 'Voice';

  faceTitle.textContent = currentLanguage === 'Nepali' 
    ? 'जोखिम छनोट गर्नुहोस् र खेल सुरु गर्नुहोस्' 
    : 'Select hazard and start the game';
  descriptionBox.textContent = currentLanguage === 'Nepali' 
    ? 'विवरण यहाँ हेर्न टाइलमा क्लिक गर्नुहोस्।' 
    : 'Click on a tile to see description here.';
  const noteSpan = document.querySelector('.sidebar-right span');
  noteSpan.textContent = currentLanguage === 'Nepali' 
    ? 'नोट: तपाईंले प्रत्येक ड्रपबक्समा ३ टाइलहरू राख्न सक्नुहुन्छ।' 
    : 'Note: You can place 3 tiles per dropbox.';

  dropBoxes.forEach(box => {
    box.textContent = faceTitles[box.dataset.face][currentLanguage];
    box.classList.remove('game-started', 'hard-mode');
    if (gameStarted) {
      box.classList.add('game-started');
      if (gameLevelSelect.value === 'Hard') {
        box.classList.add('hard-mode');
      }
    }
  });

  sidebarRight.style.background = '#222';

  cube.querySelectorAll('.tile').forEach(tile => {
    const key = tile.getAttribute('data-key');
    if (key) {
      const action = Object.values(hazardActions).flatMap(hazard => 
        Object.values(hazard).flatMap(category => category)
      ).find(a => a.text.English === key || a.text.Nepali === key);
      if (action) {
        const newKey = action.text[currentLanguage];
        tile.textContent = newKey;
        tile.setAttribute('data-key', newKey);
      }
    }
  });

  document.querySelectorAll('.dropped-tile').forEach(tile => {
    const key = tile.getAttribute('data-key');
    if (key) {
      const action = Object.values(hazardActions).flatMap(hazard => 
        Object.values(hazard).flatMap(category => category)
      ).find(a => a.text.English === key || a.text.Nepali === key);
      if (action) {
        const newKey = action.text[currentLanguage];
        tile.textContent = newKey;
        tile.setAttribute('data-key', newKey);
      }
    }
  });

  document.documentElement.lang = currentLanguage === 'Nepali' ? 'ne' : 'en';
}

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
  resetBtn.click();
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
  currentRotation.x = rotationX - dy * 0.3; // Adjusted sensitivity for touch
  currentRotation.y = rotationY + dx * 0.3;
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
      dropBox.textContent = faceTitles[face][currentLanguage];
    }
  });

  for (const face of Object.keys(faceTitles)) {
    const faceDiv = cube.querySelector(`.face.${face}`);
    if (!faceDiv) continue;

    let tilesData = [];
    if (gameStarted) {
      tilesData = shuffleArray(hazardActions[hazardSelect.value][faceTitles[face].English]).slice(0, 9);
      tilesData.forEach(({ text, point }, index) => {
        tilePoints[text[currentLanguage]] = point;
        originalPositions[text[currentLanguage]] = { face, index };
      });
    } else {
      tilesData = Array(9).fill({ text: { English: '', Nepali: '' }, point: 0 });
    }

    tilesData.forEach(({ text }, index) => {
      const tile = document.createElement('div');
      tile.classList.add('tile');
      tile.textContent = text[currentLanguage] || '';
      if (gameStarted && text[currentLanguage] && !gameSubmitted) {
        tile.setAttribute('data-key', text[currentLanguage]);
        tile.setAttribute('draggable', 'false');
        tile.classList.remove('draggable');
        tile.style.cursor = 'default';
      } else {
        tile.style.cursor = 'not-allowed';
      }
      faceDiv.appendChild(tile);
    });
  }

  sidebarRight.style.background = '#222';
  faceTitle.textContent = gameStarted 
    ? (currentLanguage === 'Nepali' 
        ? `खेल सुरु भयो: ${hazardSelect.querySelector(`option[value="${hazardSelect.value}"]`).dataset.nepali}` 
        : `Game started for: ${hazardSelect.value}`)
    : (currentLanguage === 'Nepali' 
        ? 'जोखिम छनोट गर्नुहोस् र खेल सुरु गर्नुहोस्' 
        : 'Select hazard and start the game');
  descriptionBox.textContent = currentLanguage === 'Nepali' 
    ? 'विवरण यहाँ हेर्न टाइलमा डबल ट्याप गर्नुहोस्।' 
    : 'Double-tap a tile to see description and select.';
  scoreDisplay.textContent = '';
}

function enableTileEvents() {
  const tiles = cube.querySelectorAll('.tile');
  tiles.forEach(tile => {
    let touchCount = 0;
    let lastTouchTime = 0;

    tile.addEventListener('click', (e) => {
      if (!gameStarted || gameSubmitted) return;
      const key = tile.getAttribute('data-key');
      if (!key) return;

      touchCount++;
      const currentTime = new Date().getTime();

      if (touchCount === 1) {
        lastTouchTime = currentTime;
        setTimeout(() => { touchCount = 0; }, 300);
      } else if (touchCount === 2 && currentTime - lastTouchTime < 300) {
        const action = Object.values(hazardActions).flatMap(hazard => 
          Object.values(hazard).flatMap(category => category)
        ).find(a => a.text[currentLanguage] === key);
        descriptionBox.textContent = actionDescriptions[action.text.English][currentLanguage] || key;
        if (voiceToggle.checked) {
          speak(actionDescriptions[action.text.English][currentLanguage] || key);
        }

        if (selectedTile === tile) {
          tile.setAttribute('draggable', 'false');
          tile.classList.remove('draggable', 'selected');
          tile.style.cursor = 'default';
          selectedTile = null;
        } else {
          if (selectedTile) {
            selectedTile.setAttribute('draggable', 'false');
            selectedTile.classList.remove('draggable', 'selected');
            selectedTile.style.cursor = 'default';
          }
          tile.setAttribute('draggable', 'true');
          tile.classList.add('draggable', 'selected');
          tile.style.cursor = 'grab';
          selectedTile = tile;
        }
        touchCount = 0;
      }
    });

    tile.addEventListener('touchstart', (e) => {
      if (!gameStarted || gameSubmitted) return;
      e.preventDefault();
      const key = tile.getAttribute('data-key');
      if (!key) return;

      const currentTime = new Date().getTime();
      if (currentTime - lastTapTime < 300 && lastTappedTile === tile) {
        const action = Object.values(hazardActions).flatMap(hazard => 
          Object.values(hazard).flatMap(category => category)
        ).find(a => a.text[currentLanguage] === key);
        descriptionBox.textContent = actionDescriptions[action.text.English][currentLanguage] || key;
        if (voiceToggle.checked) {
          speak(actionDescriptions[action.text.English][currentLanguage] || key);
        }

        if (selectedTile === tile) {
          tile.setAttribute('draggable', 'false');
          tile.classList.remove('draggable', 'selected');
          tile.style.cursor = 'default';
          selectedTile = null;
        } else {
          if (selectedTile) {
            selectedTile.setAttribute('draggable', 'false');
            selectedTile.classList.remove('draggable', 'selected');
            selectedTile.style.cursor = 'default';
          }
          tile.setAttribute('draggable', 'true');
          tile.classList.add('draggable', 'selected');
          tile.style.cursor = 'grab';
          selectedTile = tile;
        }
        lastTapTime = 0;
        lastTappedTile = null;
      } else {
        lastTapTime = currentTime;
        lastTappedTile = tile;
      }
    });

    tile.addEventListener('touchstart', (e) => {
      if (!gameStarted || gameSubmitted || tile.getAttribute('draggable') !== 'true') return;
      e.stopPropagation();
      tile.style.opacity = '0.5';
    });

    tile.addEventListener('touchmove', (e) => {
      if (!gameStarted || gameSubmitted || tile.getAttribute('draggable') !== 'true') return;
      e.preventDefault();
      const touch = e.touches[0];
      const elementUnder = document.elementFromPoint(touch.clientX, touch.clientY);
      dropBoxes.forEach(box => box.classList.remove('drag-over'));
      if (elementUnder && elementUnder.classList.contains('drop-box')) {
        elementUnder.classList.add('drag-over');
      }
    });

    tile.addEventListener('touchend', (e) => {
      if (!gameStarted || gameSubmitted || tile.getAttribute('draggable') !== 'true') return;
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
          if (gameSubmitted) return;
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
            tile.classList.remove('draggable');
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
          const faceName = faceTitles[elementUnder.dataset.face][currentLanguage];
          speak(currentLanguage === 'Nepali' ? `${key} लाई ${faceName} मा राखिएको छ` : `${key} is dropped into ${faceName}`);
        }
      }
    });

    tile.ondragstart = (e) => {
      if (!gameStarted || gameSubmitted) {
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
      if (!gameStarted || gameSubmitted) return;
      e.preventDefault();
      box.classList.add('drag-over');
    };
    box.ondragleave = () => {
      box.classList.remove('drag-over');
    };
    box.ondrop = (e) => {
      if (!gameStarted || gameSubmitted) return;
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
        if (gameSubmitted) return;
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
        const faceName = faceTitles[box.dataset.face][currentLanguage];
        speak(currentLanguage === 'Nepali' ? `${key} लाई ${faceName} मा राखिएको छ` : `${key} is dropped into ${faceName}`);
      }
    };

    box.addEventListener('touchstart', (e) => {
      if (!gameStarted || gameSubmitted || !selectedTile) return;
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
        if (gameSubmitted) return;
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
        const faceName = faceTitles[box.dataset.face][currentLanguage];
        speak(currentLanguage === 'Nepali' ? `${key} लाई ${faceName} मा राखिएको छ` : `${key} is dropped into ${faceName}`);
      }

      selectedTile = null;
    });

    box.onclick = (e) => {
      if (!gameStarted || gameSubmitted || !selectedTile) return;
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
        if (gameSubmitted) return;
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
        const faceName = faceTitles[box.dataset.face][currentLanguage];
        speak(currentLanguage === 'Nepali' ? `${key} लाई ${faceName} मा राखिएको छ` : `${key} is dropped into ${faceName}`);
      }

      selectedTile = null;
    };
  });
}

submitBtn.onclick = () => {
  if (!gameStarted || gameSubmitted) return;

  gameSubmitted = true;

  let totalPoints = 0;
  const gameMode = gameLevelSelect.value || "Easy";

  for (const tileText in droppedTilesMap) {
    const dropBoxId = droppedTilesMap[tileText];
    const faceKey = dropBoxId.replace('drop-', '');
    const dropBoxCategory = faceTitles[faceKey].English;

    const tileCategoryEntry = Object.entries(hazardActions[hazardSelect.value]).find(([category, actions]) =>
      actions.some(action => action.text[currentLanguage] === tileText)
    );

    if (!tileCategoryEntry) continue;

    const [tileCategory, actions] = tileCategoryEntry;
    const point = actions.find(action => action.text[currentLanguage] === tileText)?.point || 0;

    if (tileCategory === dropBoxCategory) {
      totalPoints += point;
    } else if (gameMode === "Medium" || gameMode === "Hard") {
      totalPoints -= point;
    }
  }

  let splashScreen = document.querySelector('.splash-screen');
  if (!splashScreen) {
    splashScreen = document.createElement('div');
    splashScreen.classList.add('splash-screen');
    document.body.appendChild(splashScreen);
  }

  splashScreen.innerHTML = `
    <div>${currentLanguage === 'Nepali' ? `तपाईंको स्कोर: ${totalPoints}` : `Your Score: ${totalPoints}`}</div>
    <button id="close-splash">${currentLanguage === 'Nepali' ? 'बन्द गर्नुहोस्' : 'Close'}</button>
  `;

  setTimeout(() => {
    splashScreen.classList.add('show');
  }, 10);

  if (voiceToggle.checked) {
    speak(currentLanguage === 'Nepali' ? `तपाईंको कुल स्कोर ${totalPoints} हो` : `Your total score is ${totalPoints}`);
  }

  const closeButton = splashScreen.querySelector('#close-splash');
  closeButton.onclick = () => {
    splashScreen.classList.remove('show');
    setTimeout(() => {
      splashScreen.remove();
    }, 500);
  };

  splashScreen.onclick = (e) => {
    if (e.target === splashScreen || e.target === closeButton) {
      splashScreen.classList.remove('show');
      setTimeout(() => {
        splashScreen.remove();
      }, 500);
    }
  };

  visibleScore = true;
  scoreDisplay.textContent = currentLanguage === 'Nepali' ? `तपाईंको स्कोर: ${totalPoints}` : `Your Score: ${totalPoints}`;
  faceTitle.textContent = currentLanguage === 'Nepali' 
    ? `खेल समाप्त भयो: ${hazardSelect.querySelector(`option[value="${hazardSelect.value}"]`).dataset.nepali}`
    : `Game finished for: ${hazardSelect.value}`;

  cube.querySelectorAll('.tile').forEach(tile => {
    tile.setAttribute('draggable', 'false');
    tile.classList.remove('draggable', 'selected');
    tile.style.cursor = 'not-allowed';
    tile.onclick = null;
    tile.ontouchstart = null;
  });

  dropBoxes.forEach(box => {
    box.ondragover = (e) => e.preventDefault();
    box.ondrop = (e) => e.preventDefault();
    box.onclick = null;
    box.ontouchstart = null;
    box.style.cursor = 'default';
  });

  document.querySelectorAll('.dropped-tile').forEach(tile => {
    tile.onclick = null;
  });

  submitBtn.disabled = true;
  submitBtn.classList.remove('glow');
  resetBtn.disabled = false;
  resetBtn.classList.add('glow');
  startBtn.disabled = true;
  startBtn.classList.remove('glow');

  rotateHorizontalBtn.disabled = false;
  rotateVerticalBtn.disabled = false;
};

function startGame() {
  gameStarted = true;
  gameSubmitted = false;
  droppedTilesMap = {};
  tilePoints = {};

  if (voiceToggle.checked) {
    const hazard = hazardSelect.querySelector(`option[value="${hazardSelect.value}"]`).dataset[currentLanguage.toLowerCase()];
    const level = gameLevelSelect.value || "Easy";
    const levelText = gameLevelSelect.querySelector(`option[value="${level}"]`).dataset[currentLanguage.toLowerCase()];
    speak(currentLanguage === 'Nepali' 
      ? `खेल ${hazard} को लागि ${levelText} मोडमा सुरु भएको छ` 
      : `Game is started for ${hazardSelect.value} in ${level} mode`);
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

  descriptionBox.textContent = currentLanguage === 'Nepali' 
    ? 'विवरण यहाँ हेर्न टाइलमा डबल ट्याप गर्नुहोस्।' 
    : 'Double-tap a tile to see description and select.';
  scoreDisplay.textContent = "";
  faceTitle.textContent = currentLanguage === 'Nepali' 
    ? `खेल सुरु भयो: ${hazardSelect.querySelector(`option[value="${hazardSelect.value}"]`).dataset.nepali}` 
    : `Game started for: ${hazardSelect.value}`;
}

startBtn.onclick = () => {
  if (!hazardSelect.value) {
    alert(currentLanguage === 'Nepali' ? 'कृपया पहिले जोखिम छनोट गर्नुहोस्।' : 'Please select a hazard first.');
    return;
  }
  const gameMode = gameLevelSelect.value || "Easy";
  const gameModeText = gameLevelSelect.querySelector(`option[value="${gameMode}"]`).dataset[currentLanguage.toLowerCase()];
  let notes = currentLanguage === 'Nepali' ? 'खेल नियमहरू:\n' : 'Game Rules:\n';
  if (gameMode === "Easy") {
    notes += currentLanguage === 'Nepali'
      ? `तपाईंले सजिलो मोडमा खेल सुरु गर्नुभयो।\nटाइलमा डबल ट्याप वा डबल क्लिक गरेर यसको विवरण हेर्नुहोस् र छनोट गर्नुहोस्।\nड्रप बक्समा ट्याप वा क्लिक गरेर छनोट गरिएको टाइल राख्नुहोस्।\nप्रत्येक ड्रप बक्समा ३ टाइलहरू राख्न सकिन्छ।\nइच्छित टाइलहरू राखेपछि, आफ्नो स्कोर जाँच गर्न 'पेश गर्नुहोस्' ट्याप गर्नुहोस्।\nसही राखिएको टाइलहरूको स्कोरको योग तपाईंको कुल स्कोर हो।`
      : `You have started a game in Easy Mode.\nDouble-tap or double-click a tile to see its description and select it.\nTap or click a drop box to place the selected tile.\nYou can place up to 3 tiles in each drop box.\nOnce you place the desired tiles, tap 'Submit' to check your score.\nThe sum of scores of correctly placed tiles is your total score.`;
  } else if (gameMode === "Medium") {
    notes += currentLanguage === 'Nepali'
      ? `तपाईंले मध्यम मोडमा खेल सुरु गर्नुभयो।\nटाइलमा डबल ट्याप वा डबल क्लिक गरेर यसको विवरण हेर्नुहोस् र छनोट गर्नुहोस्।\nड्रप बक्समा ट्याप वा क्लिक गरेर छनोट गरिएको टाइल राख्नुहोस्।\nप्रत्येक ड्रप बक्समा ३ टाइलहरू राख्न सकिन्छ।\nइच्छित टाइलहरू राखेपछि, आफ्नो स्कोर जाँच गर्न 'पेश गर्नुहोस्' ट्याप गर्नुहोस्।\nसही राखिएको टाइलहरूको स्कोरको योग तपाईंको कुल स्कोर हो, तर गलत राखिएको टाइलहरूको लागि नकारात्मक स्कोरिङ हुन्छ।`
      : `You have started a game in Medium Mode.\nDouble-tap or double-click a tile to see its description and select it.\nTap or click a drop box to place the selected tile.\nYou can place up to 3 tiles in each drop box.\nOnce you place the desired tiles, tap 'Submit' to check your score.\nThe sum of scores of correctly placed tiles is your total score, but there is negative scoring for wrongly placed tiles.`;
  } else if (gameMode === "Hard") {
    notes += currentLanguage === 'Nepali'
      ? `तपाईंले कठिन मोडमा खेल सुरु गर्नुभयो।\nटाइलमा डबल ट्याप वा डबल क्लिक गरेर यसको विवरण हेर्नुहोस् र छनोट गर्नुहोस्।\nड्रप बक्समा ट्याप वा क्लिक गरेर छनोट गरिएको टाइल राख्नुहोस्।\nप्रत्येक ड्रप बक्समा ३ टाइलहरू राख्न सकिन्छ।\nइच्छित टाइलहरू राखेपछि, आफ्नो स्कोर जाँच गर्न 'पेश गर्नुहोस्' ट्याप गर्नुहोस्।\nसही राखिएको टाइलहरूको स्कोरको योग तपाईंको कुल स्कोर हो, तर गलत राखिएको टाइलहरूको लागि नकारात्मक स्कोरिङ हुन्छ।`
      : `You have started a game in Hard Mode.\nDouble-tap or double-click a tile to see its description and select it.\nTap or click a drop box to place the selected tile.\nYou can place up to 3 tiles in each drop box.\nOnce you place the desired tiles, tap 'Submit' to check your score.\nThe sum of scores of correctly placed tiles is your total score, but there is negative scoring for wrongly placed tiles.`;
  }

  let splashScreen = document.querySelector('.splash-screen');
  if (!splashScreen) {
    splashScreen = document.createElement('div');
    splashScreen.classList.add('splash-screen');
    document.body.appendChild(splashScreen);
  }

  splashScreen.innerHTML = `
    <div class="rules-text">${notes}</div>
    <button id="go-btn">${currentLanguage === 'Nepali' ? 'जानुहोस्' : 'Go'}</button>
  `;

  setTimeout(() => {
    splashScreen.classList.add('show');
  }, 10);

  if (voiceToggle.checked) {
    speak(notes);
  }

  const goButton = splashScreen.querySelector('#go-btn');
  goButton.onclick = () => {
    splashScreen.classList.remove('show');
    setTimeout(() => {
      splashScreen.remove();
      startGame();
    }, 500);
  };

  splashScreen.onclick = (e) => {
    if (e.target === splashScreen || e.target === goButton) {
      splashScreen.classList.remove('show');
      setTimeout(() => {
        splashScreen.remove();
        startGame();
      }, 500);
    }
  };
};

resetBtn.onclick = () => {
  gameStarted = false;
  gameSubmitted = false;
  visibleScore = false;
  droppedTilesMap = {};
  dropBoxes.forEach(box => {
    [...box.querySelectorAll('.dropped-tile')].forEach(tile => tile.remove());
    box.style.cursor = '';
    box.ondragover = (e) => {
      if (!gameStarted || gameSubmitted) return;
      e.preventDefault();
      box.classList.add('drag-over');
    };
    box.ondragleave = () => {
      box.classList.remove('drag-over');
    };
    box.ondrop = (e) => {
      if (!gameStarted || gameSubmitted) return;
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
        if (gameSubmitted) return;
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
        const faceName = faceTitles[box.dataset.face][currentLanguage];
        speak(currentLanguage === 'Nepali' ? `${key} लाई ${faceName} मा राखिएको छ` : `${key} is dropped into ${faceName}`);
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

  descriptionBox.textContent = currentLanguage === 'Nepali' 
    ? 'विवरण यहाँ हेर्न टाइलमा डबल ट्याप गर्नुहोस्।' 
    : 'Double-tap a tile to see description and select.';
  scoreDisplay.textContent = "";
  faceTitle.textContent = currentLanguage === 'Nepali' 
    ? 'जोखिम छनोट गर्नुहोस् र खेल सुरु गर्नुहोस्' 
    : 'Select hazard and start the game';

  const splashScreen = document.querySelector('.splash-screen');
  if (splashScreen) {
    splashScreen.classList.remove('show');
    setTimeout(() => {
      splashScreen.remove();
    }, 500);
  }

  rotateHorizontalBtn.disabled = false;
  rotateVerticalBtn.disabled = false;
};

languageSelect.onchange = () => {
  currentLanguage = languageSelect.value;
  updateLanguage();
  if (voiceToggle.checked) {
    speak(currentLanguage === 'Nepali' 
      ? `भाषा ${languageSelect.querySelector(`option[value="${currentLanguage}"]`).dataset.nepali} मा परिवर्तन गरियो।` 
      : `Language changed to ${currentLanguage}.`);
  }
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
      tooltip.textContent = currentLanguage === 'Nepali'
        ? "सजिलो मोडमा, सही ड्रप बक्समा राखिएको टाइलहरूको स्कोर मात्र गणना हुन्छ।"
        : "In easy mode, scores of tiles dropped in correct drop box will only count.";
      break;
    case "Medium":
      tooltip.textContent = currentLanguage === 'Nepali'
        ? "मध्यम मोडमा, गलत ड्रप बक्समा राखिएको टाइलहरूको स्कोर नकारात्मक गणना हुन्छ।"
        : "In medium mode, scores of tiles dropped in wrong drop box will be counted negative.";
      break;
    case "Hard":
      tooltip.textContent = currentLanguage === 'Nepali'
        ? "कठिन मोडमा, सबै टाइलहरू र ड्रप बक्सहरूको रंग समान हुन्छ र गलत टाइल राख्दा नकारात्मक अंकन हुन्छ।"
        : "In hard mode, all tiles and drop box will have same colors and there will be negative marking for wrong tile drop.";
      break;
    default:
      tooltip.textContent = currentLanguage === 'Nepali'
        ? "खेल मोड छनोट गर्नुहोस्।"
        : "Select a game mode to see details.";
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
  utterance.lang = currentLanguage === 'Nepali' ? 'ne-NP' : 'en-US';
  speechSynthesis.speak(utterance);
}

hamburgerToggle.onclick = () => {
  sidebarLeft.classList.toggle('collapsed');
  if (voiceToggle.checked) {
    const isCollapsed = sidebarLeft.classList.contains('collapsed');
    speak(currentLanguage === 'Nepali' 
      ? isCollapsed ? 'साइडबार बन्द' : 'साइडबार खुला' 
      : isCollapsed ? 'Sidebar collapsed' : 'Sidebar expanded');
  }
};

fullscreenBtn.onclick = () => {
  const isFullScreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
  if (!isFullScreen) {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
    fullscreenBtn.textContent = currentLanguage === 'Nepali' ? 'पूर्ण स्क्रिनबाट बाहिर निस्कनुहोस्' : 'Exit Full Screen';
    if (voiceToggle.checked) {
      speak(currentLanguage === 'Nepali' ? 'पूर्ण स्क्रिन मोडमा प्रवेश गरियो' : 'Entered full screen mode');
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    fullscreenBtn.textContent = currentLanguage === 'Nepali' ? 'पूर्ण स्क्रिन' : 'Full Screen';
    if (voiceToggle.checked) {
      speak(currentLanguage === 'Nepali' ? 'पूर्ण स्क्रिन मोडबाट बाहिर निस्कियो' : 'Exited full screen mode');
    }
  }
};

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    fullscreenBtn.textContent = currentLanguage === 'Nepali' ? 'पूर्ण स्क्रिन' : 'Full Screen';
  } else {
    fullscreenBtn.textContent = currentLanguage === 'Nepali' ? 'पूर्ण स्क्रिनबाट बाहिर निस्कनुहोस्' : 'Exit Full Screen';
  }
});
document.addEventListener('webkitfullscreenchange', () => {
  if (!document.webkitFullscreenElement) {
    fullscreenBtn.textContent = currentLanguage === 'Nepali' ? 'पूर्ण स्क्रिन' : 'Full Screen';
  } else {
    fullscreenBtn.textContent = currentLanguage === 'Nepali' ? 'पूर्ण स्क्रिनबाट बाहिर निस्कनुहोस्' : 'Exit Full Screen';
  }
});
document.addEventListener('mozfullscreenchange', () => {
  if (!document.mozFullScreenElement) {
    fullscreenBtn.textContent = currentLanguage === 'Nepali' ? 'पूर्ण स्क्रिन' : 'Full Screen';
  } else {
    fullscreenBtn.textContent = currentLanguage === 'Nepali' ? 'पूर्ण स्क्रिनबाट बाहिर निस्कनुहोस्' : 'Exit Full Screen';
  }
});
document.addEventListener('msfullscreenchange', () => {
  if (!document.msFullscreenElement) {
    fullscreenBtn.textContent = currentLanguage === 'Nepali' ? 'पूर्ण स्क्रिन' : 'Full Screen';
  } else {
    fullscreenBtn.textContent = currentLanguage === 'Nepali' ? 'पूर्ण स्क्रिनबाट बाहिर निस्कनुहोस्' : 'Exit Full Screen';
  }
});

langEnglishBtn.onclick = () => {
  currentLanguage = 'English';
  languageSelect.value = 'English';
  updateLanguage();
  languageSplash.style.display = 'none';
  container.style.display = 'flex';
  if (voiceToggle.checked) {
    speak('Game interface set to English');
  }
};

langNepaliBtn.onclick = () => {
  currentLanguage = 'Nepali';
  languageSelect.value = 'Nepali';
  updateLanguage();
  languageSplash.style.display = 'none';
  container.style.display = 'flex';
  if (voiceToggle.checked) {
    speak('खेल इन्टरफेस नेपालीमा सेट गरियो');
  }
};

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
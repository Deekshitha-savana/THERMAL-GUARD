const workButton = document.getElementById("workButton");
const locationDiv = document.getElementById("location");
const temperatureDiv = document.getElementById("temperature");
const humidityDiv = document.getElementById("humidity");
const riskDiv = document.getElementById("risk");
const languageSelect = document.getElementById("language");

/* 🔑 PASTE YOUR API KEY HERE */
const API_KEY = "0d18526b3dbb6df45792e50a07b028f4";

workButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    locationDiv.innerText = "Geolocation not supported";
    return;
  }

  navigator.geolocation.getCurrentPosition(fetchWeather, () => {
    locationDiv.innerText = "Please allow location access";
  });
});

function fetchWeather(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  locationDiv.innerText =
    `Location: ${lat.toFixed(2)}, ${lon.toFixed(2)}`;

  const apiUrl =
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => calculateRisk(data))
    .catch(() => {
      riskDiv.innerText = "Unable to fetch weather data";
    });
}

function calculateRisk(data) {
  const temp = data.main.temp;
  const humidity = data.main.humidity;
  const hour = new Date().getHours();

  temperatureDiv.innerText = `Temperature: ${temp}°C`;
  humidityDiv.innerText = `Humidity: ${humidity}%`;

  let risk = "SAFE";
  let cssClass = "safe";

  // 🌙 Day / Night logic
  const isNight = hour >= 19 || hour <= 6;

  // 🔥 Heat logic (FIXED as per your requirement)
  if (!isNight && temp >= 35) {
    risk = "DANGER";
    cssClass = "danger";
  }
  else if (!isNight && temp >= 30) {
    risk = "CAUTION";
    cssClass = "caution";
  }
  else if (temp <= 10) {
    risk = "COLD RISK";
    cssClass = "cold";
  }

  document.body.className = cssClass;
  riskDiv.innerText = `Risk Level: ${risk}`;

  speak(getVoiceMessage(risk));
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;

  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = languageSelect.value;
  speechSynthesis.speak(msg);
}

function getVoiceMessage(risk) {
  const messages = {
    SAFE: {
      "en-IN": "Conditions are safe.",
      "te-IN": "పరిస్థితులు సురక్షితంగా ఉన్నాయి.",
      "ta-IN": "நிலை பாதுகாப்பாக உள்ளது.",
      "kn-IN": "ಪರಿಸ್ಥಿತಿ ಸುರಕ್ಷಿತವಾಗಿದೆ.",
      "ml-IN": "സുരക്ഷിതമായ അവസ്ഥയാണ്.",
      "hi-IN": "स्थिति सुरक्षित है।"
    },
    CAUTION: {
      "en-IN": "Heat is high. Drink water.",
      "te-IN": "వేడి ఎక్కువగా ఉంది. నీరు తాగండి.",
      "ta-IN": "வெப்பம் அதிகம். தண்ணீர் குடிக்கவும்.",
      "kn-IN": "ಬಿಸಿಲು ಹೆಚ್ಚು. ನೀರು ಕುಡಿಯಿರಿ.",
      "ml-IN": "ചൂട് കൂടുതലാണ്. വെള്ളം കുടിക്കുക.",
      "hi-IN": "गर्मी ज्यादा है। पानी पिएं।"
    },
    DANGER: {
      "en-IN": "Dangerous heat. Rest in shade.",
      "te-IN": "వేడి చాలా ప్రమాదకరం. నీడలో విశ్రాంతి తీసుకోండి.",
      "ta-IN": "வெப்பம் மிகவும் ஆபத்தானது. நிழலில் ஓய்வு எடுக்கவும்.",
      "kn-IN": "ಬಿಸಿಲು ಅಪಾಯಕಾರಿ. ನೆರಳಿನಲ್ಲಿ ವಿಶ್ರಾಂತಿ ತೆಗೆದುಕೊಳ್ಳಿ.",
      "ml-IN": "ചൂട് അപകടകരമാണ്. നിഴലിൽ വിശ്രമിക്കുക.",
      "hi-IN": "गर्मी खतरनाक है। छांव में आराम करें।"
    },
    "COLD RISK": {
      "en-IN": "Cold risk detected. Keep warm.",
      "te-IN": "చలి ప్రమాదం ఉంది. వెచ్చగా ఉండండి.",
      "ta-IN": "குளிர் அபாயம் உள்ளது. சூடாக இருங்கள்.",
      "kn-IN": "ಚಳಿ ಅಪಾಯ ಇದೆ. ಬೆಚ್ಚಗೆ ಇರಲಿ.",
      "ml-IN": "തണുപ്പ് അപകടം. ചൂടോടെ ഇരിക്കുക.",
      "hi-IN": "ठंड का खतरा है। गर्म रहें।"
    }
  };

  return messages[risk][languageSelect.value];
}

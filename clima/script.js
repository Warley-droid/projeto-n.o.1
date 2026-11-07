// ==========================================
// CONFIGURAÇÕES DAS APIs
// ==========================================

const API = 'https://api.open-meteo.com/v1/forecast';
const GEO_API = 'https://geocoding-api.open-meteo.com/v1/search';


// ==========================================
// ELEMENTOS HTML
// ==========================================

const $ = (selector) => document.querySelector(selector);

const searchForm = $('#searchForm');
const cityInput = $('#cityInput');
const locationBtn = $('#locationBtn');

const cityName = $('#cityName');
const currentDate = $('#currentDate');
const updated = $('#updated');

const currentIcon = $('#currentIcon');
const temperature = $('#temperature');
const condition = $('#condition');
const feelsLike = $('#feelsLike');

const highLow = $('#highLow');
const rainChance = $('#rainChance');

const humidity = $('#humidity');
const wind = $('#wind');
const pressure = $('#pressure');
const uv = $('#uv');

const hourlyList = $('#hourlyList');
const forecastList = $('#forecastList');

const toast = $('#toast');


// ==========================================
// INFORMAÇÕES DOS CÓDIGOS METEOROLÓGICOS
// ==========================================

// Cada código possui:
// [descrição, ícone de dia, ícone de noite, tema]

const weatherInfo = {

    0: ['Céu limpo', '☀️', '🌙', 'clear'],

    1: ['Predominantemente limpo', '🌤️', '🌙', 'clear'],

    2: ['Parcialmente nublado', '⛅', '🌙☁️', 'cloud'],

    3: ['Nublado', '☁️', '☁️', 'cloud'],

    45: ['Neblina', '🌫️', '🌫️', 'cloud'],

    48: ['Neblina com geada', '🌫️', '🌫️', 'cloud'],

    51: ['Garoa fraca', '🌦️', '🌧️', 'rain'],

    53: ['Garoa moderada', '🌦️', '🌧️', 'rain'],

    55: ['Garoa intensa', '🌧️', '🌧️', 'rain'],

    56: ['Garoa congelante fraca', '🌧️', '🌧️', 'snow'],

    57: ['Garoa congelante intensa', '🌧️', '🌧️', 'snow'],

    61: ['Chuva fraca', '🌦️', '🌧️', 'rain'],

    63: ['Chuva moderada', '🌧️', '🌧️', 'rain'],

    65: ['Chuva forte', '🌧️', '🌧️', 'rain'],

    66: ['Chuva congelante fraca', '🌧️', '🌧️', 'snow'],

    67: ['Chuva congelante forte', '🌧️', '🌧️', 'snow'],

    71: ['Neve fraca', '🌨️', '🌨️', 'snow'],

    73: ['Neve moderada', '🌨️', '🌨️', 'snow'],

    75: ['Neve forte', '❄️', '❄️', 'snow'],

    77: ['Grãos de neve', '❄️', '❄️', 'snow'],

    80: ['Pancadas de chuva fracas', '🌦️', '🌧️', 'rain'],

    81: ['Pancadas de chuva moderadas', '🌧️', '🌧️', 'rain'],

    82: ['Pancadas de chuva fortes', '⛈️', '⛈️', 'storm'],

    85: ['Pancadas de neve fracas', '🌨️', '🌨️', 'snow'],

    86: ['Pancadas de neve fortes', '❄️', '❄️', 'snow'],

    95: ['Trovoada', '⛈️', '⛈️', 'storm'],

    96: ['Trovoada com granizo fraco', '⛈️', '⛈️', 'storm'],

    99: ['Trovoada com granizo forte', '⛈️', '⛈️', 'storm']

};


// ==========================================
// FUNÇÃO PARA OBTER INFORMAÇÕES DO CLIMA
// ==========================================

function getWeather(code, isDay = true) {

    const info = weatherInfo[code];

    if (!info) {
        return ['Condição desconhecida', '🌡️', '🌡️', 'cloud'];
    }

    const [description, dayIcon, nightIcon, theme] = info;

    const icon = isDay ? dayIcon : nightIcon;

    return [description, icon, theme];

}


// ==========================================
// ALTERAR O FUNDO DA PÁGINA
// ==========================================

function setWeatherBackground(code, isDay) {

    const [, , theme] = getWeather(code, isDay);

    const period = isDay ? 'day' : 'night';

    document.body.className = `weather-${theme} weather-${period}`;

}


// ==========================================
// FORMATAR DATA
// ==========================================

function formatDate(dateString) {

    const date = new Date(dateString + 'T12:00:00');

    return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

}


// ==========================================
// MOSTRAR MENSAGENS NA TELA
// ==========================================

let toastTimer;

function showToast(message) {

    toast.textContent = message;

    toast.classList.add('show');

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove('show');

    }, 3000);

}


// ==========================================
// BUSCAR UMA CIDADE
// ==========================================

async function searchCity(city) {

    try {

        const url = `${GEO_API}?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Não foi possível buscar a cidade.');
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {

            showToast('Cidade não encontrada.');

            return;

        }

        const result = data.results[0];

        getForecast(
            result.latitude,
            result.longitude,
            result.name,
            result.country || ''
        );

    } catch (error) {

        console.error(error);

        showToast('Erro ao pesquisar a cidade.');

    }

}


// ==========================================
// BUSCAR A PREVISÃO DO TEMPO
// ==========================================

async function getForecast(latitude, longitude, city, country) {

    try {

        updated.textContent = 'Atualizando dados...';

        const params = new URLSearchParams({

            latitude: latitude,

            longitude: longitude,

            current: [
                'temperature_2m',
                'relative_humidity_2m',
                'apparent_temperature',
                'is_day',
                'precipitation',
                'weather_code',
                'pressure_msl',
                'wind_speed_10m'
            ].join(','),

            hourly: [
                'temperature_2m',
                'precipitation_probability',
                'weather_code',
                'is_day'
            ].join(','),

            daily: [
                'weather_code',
                'temperature_2m_max',
                'temperature_2m_min',
                'precipitation_probability_max',
                'uv_index_max'
            ].join(','),

            timezone: 'auto',

            forecast_days: '7'

        });

        const response = await fetch(`${API}?${params}`);

        if (!response.ok) {
            throw new Error('Erro ao consultar a previsão.');
        }

        const data = await response.json();

        renderWeather(data, city, country);

    } catch (error) {

        console.error(error);

        updated.textContent = 'Não foi possível atualizar os dados.';

        showToast('Erro ao carregar a previsão do tempo.');

    }

}


// ==========================================
// MOSTRAR OS DADOS DO CLIMA
// ==========================================

function renderWeather(data, city, country) {

    const current = data.current;
    const daily = data.daily;

    // Identificar se está de dia ou de noite

    const isDay = current.is_day === 1;

    // Obter informações do clima

    const [description, icon] = getWeather(
        current.weather_code,
        isDay
    );

    // Cidade

    cityName.textContent = country
        ? `${city}, ${country}`
        : city;

    // Data atual

    currentDate.textContent = new Date().toLocaleDateString(
        'pt-BR',
        {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        }
    );

    // Temperatura

    temperature.innerHTML = `${Math.round(current.temperature_2m)}<span>°</span>`;

    // Ícone e descrição

    currentIcon.textContent = icon;

    condition.textContent = description;

    // Sensação térmica

    feelsLike.textContent = `${Math.round(current.apparent_temperature)}°`;

    // Temperatura máxima e mínima

    highLow.textContent =
        `${Math.round(daily.temperature_2m_max[0])}° / ${Math.round(daily.temperature_2m_min[0])}°`;

    // Probabilidade de chuva

    rainChance.textContent =
        `${daily.precipitation_probability_max[0] ?? 0}%`;

    // Umidade

    humidity.textContent =
        `${current.relative_humidity_2m}%`;

    // Velocidade do vento

    wind.textContent =
        `${Math.round(current.wind_speed_10m)} km/h`;

    // Pressão atmosférica

    pressure.textContent =
        `${Math.round(current.pressure_msl)} hPa`;

    // Índice UV

    uv.textContent =
        daily.uv_index_max[0] ?? '--';

    // Alterar o fundo de acordo com o clima e horário

    setWeatherBackground(current.weather_code, isDay);

    // Previsão por hora

    renderHourly(data.hourly, current.time);

    // Previsão dos próximos dias

    renderDaily(daily);

    // Atualização

    updated.textContent = `Atualizado às ${new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    })}`;

}


// ==========================================
// PREVISÃO DAS PRÓXIMAS HORAS
// ==========================================

function renderHourly(hourly, currentTime) {

    hourlyList.innerHTML = '';

    // Encontrar o horário atual na previsão

    let currentIndex = hourly.time.findIndex(time => {
        return time >= currentTime;
    });

    if (currentIndex === -1) {
        currentIndex = 0;
    }

    // Mostrar as próximas seis horas

    for (let i = currentIndex; i < currentIndex + 6; i++) {

        if (i >= hourly.time.length) {
            break;
        }

        const time = hourly.time[i];

        const hour = time.substring(11, 16);

        const temp = Math.round(hourly.temperature_2m[i]);

        const rain = hourly.precipitation_probability[i] ?? 0;

        const isDay = hourly.is_day[i] === 1;

        const [, icon] = getWeather(
            hourly.weather_code[i],
            isDay
        );

        const hourItem = document.createElement('div');

        hourItem.className = 'hour-item';

        hourItem.innerHTML = `

            <span class="hour-time">${hour}</span>

            <span class="hour-icon">${icon}</span>

            <span class="hour-temp">${temp}°</span>

            <span class="hour-time">${rain}% chuva</span>

        `;

        hourlyList.appendChild(hourItem);

    }

}


// ==========================================
// PREVISÃO DOS PRÓXIMOS SETE DIAS
// ==========================================

function renderDaily(daily) {

    forecastList.innerHTML = '';

    const weekDays = [
        'Domingo',
        'Segunda-feira',
        'Terça-feira',
        'Quarta-feira',
        'Quinta-feira',
        'Sexta-feira',
        'Sábado'
    ];

    for (let i = 0; i < daily.time.length; i++) {

        const date = new Date(daily.time[i] + 'T12:00:00');

        const dayName = i === 0
            ? 'Hoje'
            : weekDays[date.getDay()];

        const [, icon, ,] = getWeather(daily.weather_code[i]);

        const rain = daily.precipitation_probability_max[i] ?? 0;

        const max = Math.round(daily.temperature_2m_max[i]);

        const min = Math.round(daily.temperature_2m_min[i]);

        const forecastRow = document.createElement('div');

        forecastRow.className = 'forecast-row';

        forecastRow.innerHTML = `

            <span class="forecast-day">${dayName}</span>

            <span class="forecast-weather">
                <span>${icon}</span>
            </span>

            <span class="forecast-rain">
                ${rain}% chuva
            </span>

            <span class="forecast-temps">
                ${max}° <span>${min}°</span>
            </span>

        `;

        forecastList.appendChild(forecastRow);

    }

}


// ==========================================
// PESQUISAR CIDADE PELO FORMULÁRIO
// ==========================================

searchForm.addEventListener('submit', (event) => {

    event.preventDefault();

    const city = cityInput.value.trim();

    if (city === '') {

        showToast('Digite o nome de uma cidade.');

        return;

    }

    searchCity(city);

});


// ==========================================
// USAR A LOCALIZAÇÃO DO DISPOSITIVO
// ==========================================

locationBtn.addEventListener('click', () => {

    if (!navigator.geolocation) {

        showToast('Seu navegador não suporta geolocalização.');

        return;

    }

    showToast('Obtendo sua localização...');

    navigator.geolocation.getCurrentPosition(

        async (position) => {

            const latitude = position.coords.latitude;

            const longitude = position.coords.longitude;

            getForecast(
                latitude,
                longitude,
                'Sua localização',
                ''
            );

        },

        (error) => {

            console.error(error);

            showToast('Não foi possível obter sua localização.');

        }

    );

});


// ==========================================
// CARREGAR UMA CIDADE AO ABRIR O SITE
// ==========================================

// Cidade inicial: São Paulo

getForecast(
    -23.5505,
    -46.6333,
    'São Paulo',
    'Brasil'
);

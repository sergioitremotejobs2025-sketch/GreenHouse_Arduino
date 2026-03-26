// Helper to calculate digital value from desired real value for Grove Temperature
const realTempToDigital = (celsius) => {
  const B_TERMISTOR = 4275;
  const T0 = 298.15;
  const kelvin = celsius + 273.15;
  const ln_val = B_TERMISTOR * (1 / kelvin - 1 / T0);
  const digital = 1023 / (Math.exp(ln_val) + 1);
  return Math.round(digital);
}

// Helper to calculate digital value from humidity percentage
const realHumToDigital = (percentage) => Math.round(percentage * 950 / 100);

const getPatternValue = (min, max, cycleSeconds = 60) => {
  const time = Date.now() / 1000;
  const normalizedSin = (Math.sin((2 * Math.PI * time) / cycleSeconds) + 1) / 2; // 0 to 1
  const noise = (Math.random() - 0.5) * (max - min) * 0.05; // 5% noise
  return normalizedSin * (max - min) + min + noise;
}

const randomHumidity = () => realHumToDigital(getPatternValue(30, 80, 120)) 
const randomTemperature = () => realTempToDigital(getPatternValue(20, 30, 180))
const switchLight = status => status === 'on' ? 1 : 0

module.exports = class Controller {

  constructor() {
    this.light = 0
  }

  getHumidity = (req, res) => {
    return res.json({ humidity: randomHumidity() })
  }

  getLight = (req, res) => {
    return res.json({ light: this.light })
  }

  getTemperature = (req, res) => {
    return res.json({ temperature: randomTemperature() })
  }

  postLight = (req, res) => {
    this.light = switchLight(req.params.status)
    return res.json({ light: this.light })
  }

}

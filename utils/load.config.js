import fs from 'fs';
import path from 'path';
import defaultConfig from './default.config.js';

// Function to load properties from files in the properties folder
function loadProperties() {
  const propertiesDir = path.resolve(process.cwd(), 'properties');
  const properties = {};

  if (fs.existsSync(propertiesDir)) {
    const files = fs.readdirSync(propertiesDir);

    files.forEach(file => {
      const filePath = path.join(propertiesDir, file);
      if (fs.statSync(filePath).isFile() && path.extname(file) === '.json') {
        try {
          const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          Object.assign(properties, fileContent);
        } catch (error) {
          console.error(`Error parsing JSON file: ${filePath}`, error);
        }
      }
    });
  } else {
    console.warn('Properties folder not found in the project root.');
  }

  return properties;
}

// Function to load settings from files in the settings folder
function loadSettings() {
  const settingsDir = path.resolve(process.cwd(), 'settings');
  const settings = {};

  if (fs.existsSync(settingsDir)) {
    const files = fs.readdirSync(settingsDir);

    files.forEach(file => {
      const filePath = path.join(settingsDir, file);
      if (fs.statSync(filePath).isFile() && path.extname(file) === '.json') {
        try {
          const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          Object.assign(settings, fileContent);
        } catch (error) {
          console.error(`Error parsing JSON file: ${filePath}`, error);
        }
      }
    });
  } else {
    console.warn('Settings folder not found in the project root.');
  }

  return settings;
}

async function config() {
  const configPath = path.resolve(process.cwd(), 'cereal.config.js');

  let userConfig = {};
  if (fs.existsSync(configPath)) {
    try {
      userConfig = (await import(configPath)).default;
    } catch (error) {
      console.error(`Error loading configuration file: ${configPath}`, error);
    }
  } else {
    console.warn('Optional configuration file cereal.config.js not found in the project root.');
  }

  const properties = loadProperties();
  const settings = loadSettings();

  return { ...defaultConfig, properties: { ...properties, ...userConfig.properties }, settings: { ...settings, ...userConfig.settings } };
}

export default config;
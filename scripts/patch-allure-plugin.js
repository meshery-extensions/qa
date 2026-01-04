`const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../node_modules/@allurereport/plugin-awesome/dist/generators.js');

if (fs.existsSync(filePath)) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('analyticsEnable: true')) {
      content = content.replace('analyticsEnable: true', 'analyticsEnable: false');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Successfully patched @allurereport/plugin-awesome to disable analytics.');
    } else if (content.includes('analyticsEnable: false')) {
      console.log('@allurereport/plugin-awesome is already patched.');
    } else {
      console.warn('Could not find "analyticsEnable: true" in @allurereport/plugin-awesome/dist/generators.js. The plugin version might have changed.');
    }
  } catch (err) {
    console.error('Error patching @allurereport/plugin-awesome:', err);
    process.exit(1);
  }
} else {
  console.warn('File not found: ' + filePath);
}
`
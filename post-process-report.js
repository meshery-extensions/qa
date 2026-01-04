const fs = require('fs');
const path = require('path');

const reportDir = path.join(__dirname, 'allure-report');
const customScriptFilename = 'custom-script.js';
const customStyleFilename = 'custom-style.css';
const sourceScriptPath = path.join(__dirname, customScriptFilename);
const sourceStylePath = path.join(__dirname, customStyleFilename);

if (!fs.existsSync(reportDir)) {
  console.error(`Error: Report directory '${reportDir}' not found. Generate the report first.`);
  process.exit(1);
}

// Function to recursively find files by name
function findFiles(dir, filename, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findFiles(filePath, filename, fileList);
    } else if (file === filename) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

const indexHtmlFiles = findFiles(reportDir, 'index.html');

if (indexHtmlFiles.length === 0) {
  console.log('No index.html files found to process.');
  process.exit(0);
}

console.log(`Found ${indexHtmlFiles.length} index.html files to process.`);

indexHtmlFiles.forEach(indexHtmlPath => {
  const currentDir = path.dirname(indexHtmlPath);
  

  const destScriptPath = path.join(currentDir, customScriptFilename);
  // 1. Copy the custom script to the same directory as the index.html
  try {
    fs.copyFileSync(sourceScriptPath, destScriptPath);
    // console.log(`Copied ${customScriptFilename} to ${currentDir}`);
  } catch (err) {
    console.error(`Error copying script to ${currentDir}:`, err.message);
    return;
  }

  const destStylePath = path.join(currentDir, customStyleFilename);
  // 1. Copy the custom script to the same directory as the index.html
  try {
    fs.copyFileSync(sourceStylePath, destStylePath);
    // console.log(`Copied ${customScriptFilename} to ${currentDir}`);
  } catch (err) {
    console.error(`Error copying script to ${currentDir}:`, err.message);
    return;
  }


  // 2. Inject the script tag
  try {
    let htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
    
    // Check if script is already injected
    if (htmlContent.includes(customScriptFilename)) {
      console.log(`Skipping ${indexHtmlPath} (already injected)`);
      return;
    }

    const scriptTag = `<script async src="${customScriptFilename}"></script>`;
    const newHtmlContent = htmlContent.replace('</body>', `${scriptTag}\n</body>`);
    
    fs.writeFileSync(indexHtmlPath, newHtmlContent, 'utf8');
    console.log(`Injected script into ${indexHtmlPath}`);
  } catch (err) {
    console.error(`Error processing ${indexHtmlPath}:`, err.message);
  }
});

// Fix for missing allure_environment.json in root and dashboard
const envFileName = 'allure_environment.json';
const envFilePaths = findFiles(reportDir, envFileName);

if (envFilePaths.length > 0) {
  const sourceEnvPath = envFilePaths[0]; // Use the first one found
  const targetDirs = [reportDir, path.join(reportDir, 'dashboard')];

  targetDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const destEnvPath = path.join(dir, envFileName);
      try {
        fs.copyFileSync(sourceEnvPath, destEnvPath);
        console.log(`Copied ${envFileName} to ${dir}`);
      } catch (err) {
        console.error(`Error copying ${envFileName} to ${dir}:`, err.message);
      }
    }
  });
} else {
  console.log(`No ${envFileName} found to copy.`);
}

console.log('Post-processing complete.');

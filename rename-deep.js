const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      if (dirPath.endsWith('.tsx') || dirPath.endsWith('.ts') || dirPath.endsWith('.json')) {
        callback(path.join(dir, f));
      }
    }
  });
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  // Specifically change "Personalized gifts" to "Everlasting gifts"
  content = content.replace(/Personalized gifts/g, "Everlasting gifts");
  content = content.replace(/Personalized Gifts/g, "Everlasting Gifts");
  content = content.replace(/personalized gifts/g, "everlasting gifts");

  if (original !== content) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Updated deep: " + filePath);
  }
}

walkDir('./app', processFile);
walkDir('./components', processFile);
walkDir('./lib', processFile);
console.log("Done");

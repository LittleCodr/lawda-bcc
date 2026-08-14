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
  
  // Replace terms (case sensitive to avoid hitting domain names in lowercase)
  content = content.replace(/Octopus Personalized Gifts/g, "Octopus Everlasting Gifts");
  content = content.replace(/Octopus Personalized Gift/g, "Octopus Everlasting Gift");
  content = content.replace(/Octopus Gifts/g, "Octopus Everlasting Gifts");
  content = content.replace(/Octopus Gift/g, "Octopus Everlasting Gift");
  content = content.replace(/Octopus Perfumes/g, "Octopus Everlasting Gifts");
  content = content.replace(/Octopus Perfume/g, "Octopus Everlasting Gifts");

  // Keep octopusperfume.in intact, so the lowercase ones won't be replaced if I use capital O.
  
  if (original !== content) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Updated: " + filePath);
  }
}

walkDir('./app', processFile);
walkDir('./components', processFile);
walkDir('./lib/data', processFile);
console.log("Done");

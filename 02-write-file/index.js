const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');

function writeToFile(data) {
  fs.appendFileSync(filePath, data + '\n');
  console.log('Текст успешно добавлен в файл.');
  promptUser();
}

function promptUser() {
  rl.question(
    'Введите текст (или введите "exit" или нажмите Ctrl+C для завершения): ',
    (userInput) => {
      if (userInput.toLowerCase() === 'exit') {
        rl.close();
      } else {
        writeToFile(userInput);
      }
    },
  );
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Привет! Введи текст для записи в файл.');

promptUser();

rl.on('close', () => {
  console.log('Пока!');
  process.exit(0);
});

rl.on('SIGINT', () => {
  rl.close();
});

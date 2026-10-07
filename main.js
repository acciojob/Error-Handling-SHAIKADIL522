const fs = require('fs');
const csv = require('csv-parser');

const [, , csvFilePath, columnName] = process.argv;

if (!csvFilePath || !columnName) {
  console.error('Usage: node main.js <csvFilePath> <columnName>');
  process.exit(1);
}

let sum = 0;
let count = 0;

const input = fs.createReadStream(csvFilePath);

// error handler on the file stream itself
input.on('error', (err) => {
  console.error(`Error reading CSV file: ${err.message}`);
  process.exit(1);
});

input
  .pipe(csv())
  .on('headers', (headers) => {
    if (!headers.includes(columnName)) {
      console.error(`Error: Column "${columnName}" not found in the CSV file.`);
      process.exit(1);
    }
  })
  .on('data', (row) => {
    const raw = row[columnName];
    if (raw === undefined || raw.trim() === '') return; // skip empty cells
    const value = Number(raw);
    if (!Number.isNaN(value)) {
      sum += value;
      count++;
    }
  })
  .on('end', () => {
    if (count > 0) {
      console.log(`The average value of ${columnName} is: ${sum / count}`);
    } else {
      console.log(`No valid values found in the ${columnName} column.`);
    }
  })
  .on('error', (err) => {
    console.error(`Error parsing CSV file: ${err.message}`);
    process.exit(1);
  });
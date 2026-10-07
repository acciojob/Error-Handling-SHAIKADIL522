const fs = require('fs');
const csv = require('csv-parser');

const csvFilePath = process.argv[2];
const columnName = process.argv[3];

let sum = 0;
let count = 0;

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (data) => {
    const value = Number(data[columnName]);
    if (!isNaN(value)) {
      sum += value;
      count++;
    }
  })
  .on('end', () => {
    if (count > 0) {
      const average = sum / count;
      console.log(`The average value of ${columnName} is: ${average}`);
    } else {
      console.log(`No valid values found in the ${columnName} column.`);
    }
  })
  .on('error', (err) => {
    console.error(`Error reading CSV file: ${err}`);
  });

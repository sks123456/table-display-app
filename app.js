const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

const table1 = [];
fs.createReadStream('Table_Input.csv')
  .pipe(csv())
  .on('data', (row) => {
    table1.push(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });

app.get('/', (req, res) => {
  if (table1.length > 0) {
    const A5 = parseInt(table1.find(row => row['Index #'] === 'A5').Value);
    const A20 = parseInt(table1.find(row => row['Index #'] === 'A20').Value);
    const A15 = parseInt(table1.find(row => row['Index #'] === 'A15').Value);
    const A7 = parseInt(table1.find(row => row['Index #'] === 'A7').Value);
    const A13 = parseInt(table1.find(row => row['Index #'] === 'A13').Value);
    const A12 = parseInt(table1.find(row => row['Index #'] === 'A12').Value);

    const table2 = {
      'Alpha': A5 + A20,
      'Beta': A15 / A7,
      'Charlie': A13 * A12
    };

    res.render('index', { table1, table2 });
  } else {
    res.send('Loading data, please refresh in a moment.');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

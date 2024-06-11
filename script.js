const fs = require('fs');
const csv = require('csv-parser');

// Read data from Table_Input.csv
const tableData = [];
fs.createReadStream('Table_Input.csv')
    .pipe(csv())
    .on('data', (row) => {
        tableData.push(row);
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
        computeTable2Values(tableData);
    });

// Compute values for Table 2
function computeTable2Values(tableData) {
    const A5 = parseInt(tableData.find(row => row['Index #'] === 'A5').Value);
    const A20 = parseInt(tableData.find(row => row['Index #'] === 'A20').Value);
    const A15 = parseInt(tableData.find(row => row['Index #'] === 'A15').Value);
    const A7 = parseInt(tableData.find(row => row['Index #'] === 'A7').Value);
    const A13 = parseInt(tableData.find(row => row['Index #'] === 'A13').Value);
    const A12 = parseInt(tableData.find(row => row['Index #'] === 'A12').Value);

    const table2 = {
        Alpha: A5 + A20,
        Beta: A15 / A7,
        Charlie: A13 * A12,
    };

    generateHTML(table2);
}

// Generate HTML file with computed values
function generateHTML(table2) {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Static Webpage</title>
            <link rel="stylesheet" href="styles.css">
        </head>
        <body>
            <h1>Table 2</h1>
            <table>
                <tr>
                    <th>Category</th>
                    <th>Value</th>
                </tr>
                <tr>
                    <td>Alpha</td>
                    <td>${table2.Alpha}</td>
                </tr>
                <tr>
                    <td>Beta</td>
                    <td>${table2.Beta}</td>
                </tr>
                <tr>
                    <td>Charlie</td>
                    <td>${table2.Charlie}</td>
                </tr>
            </table>
        </body>
        </html>
    `;

    fs.writeFileSync('output.html', htmlContent);
    console.log('HTML file generated successfully');
}

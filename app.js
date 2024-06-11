const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path"); // Import the path module
const app = express();
const port = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Set the views directory

app.use(express.static("public"));

let table1 = []; // Define table1 as a global variable

// Load CSV file data
fs.createReadStream(path.join(__dirname, "Table_Input.csv"))
  .pipe(csv())
  .on("data", (row) => {
    table1.push(row);
  })
  .on("end", () => {
    console.log("CSV file successfully processed");
  });

// Define the route to render the index template
app.get("/", (req, res) => {
  if (table1.length > 0) {
    const A5 = parseInt(table1.find((row) => row["Index #"] === "A5").Value);
    const A20 = parseInt(table1.find((row) => row["Index #"] === "A20").Value);
    const A15 = parseInt(table1.find((row) => row["Index #"] === "A15").Value);
    const A7 = parseInt(table1.find((row) => row["Index #"] === "A7").Value);
    const A13 = parseInt(table1.find((row) => row["Index #"] === "A13").Value);
    const A12 = parseInt(table1.find((row) => row["Index #"] === "A12").Value);

    const table2 = {
      Alpha: A5 + A20,
      Beta: A15 / A7,
      Charlie: A13 * A12,
    };

    res.render("index", { table1, table2 }); // Render the index template with table1 and table2 data
  } else {
    res.send("Loading data, please refresh in a moment.");
  }
});


app.use((req, res) => {
  res.status(404).send(`You don't have the right to access to this file`);
});

const PORT = process.env.PORT || 8080;
 app.listen(PORT);

const server = app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}/`);
});

process.on("SIGTERM", () => {
  console.log("Stopping server...");
  server.close(() => {
    console.log("Server stopped.");
    process.exit(0);
  });
});

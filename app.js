const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

// Set the views directory and view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Serve static files from the public directory
app.use(express.static("public"));

// Define a global variable to store table data
let table1 = [];

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
  console.log("CSV data:", table1);
  if (table1.length > 0) {
    // Calculate values for Table 2
    const A5 = parseInt(table1.find((row) => row["Index #"] === "A5").Value);
    const A20 = parseInt(
      table1.find((row) => row["Index #"] === "A20").Value
    );
    const A15 = parseInt(
      table1.find((row) => row["Index #"] === "A15").Value
    );
    const A7 = parseInt(table1.find((row) => row["Index #"] === "A7").Value);
    const A13 = parseInt(
      table1.find((row) => row["Index #"] === "A13").Value
    );
    const A12 = parseInt(
      table1.find((row) => row["Index #"] === "A12").Value
    );

    const table2 = {
      Alpha: A5 + A20,
      Beta: A15 / A7,
      Charlie: A13 * A12,
    };

    res.render("index", { table1, table2 });
  } else {
    res.send("Loading data, please refresh in a moment.");
  }
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).send(`You don't have the right to access this file`);
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}/`);
});

// Handle SIGTERM signal
process.on("SIGTERM", () => {
  console.log("Stopping server...");
  server.close(() => {
    console.log("Server stopped.");
    process.exit(0);
  });
});

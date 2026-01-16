const express = require("express");
const usersRouter = require("./routes/users.routes");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/users", usersRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

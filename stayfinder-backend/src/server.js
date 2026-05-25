import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";

connectDB();

const PORT = process.env.PORT || 5000;

// ✅ Only run locally
if (process.env.NODE_ENV !== "production") {

  app.listen(PORT, () =>
    console.log(`Server running on ${PORT}`)
  );

}

// ✅ Export for Vercel
export default app;
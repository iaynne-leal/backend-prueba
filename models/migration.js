import { db } from "../src/database/connection.js";


(async () => {

    await db.sync({ force: true});
  
  console.log("Database migrated successfully");
})();

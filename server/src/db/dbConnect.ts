import mongoose from "mongoose";

// =====================================
// CONNECT DATABASE
// =====================================

export const connectDB = async () => {

  try {

    let DB_CONNECTION_STRING = "";

    // =====================================
    // DEVELOPMENT DATABASE
    // =====================================

    if (
      process.env.NODE_ENV ===
      "development"
    ) {

      DB_CONNECTION_STRING =
        process.env.MONGODB_LOCAL_URI || "";

    }

    // =====================================
    // PRODUCTION DATABASE
    // =====================================

    if (
      process.env.NODE_ENV ===
      "production"
    ) {

      DB_CONNECTION_STRING =
        process.env.MONGODB_URI || "";

    }

    // =====================================
    // CHECK CONNECTION STRING
    // =====================================

    if (!DB_CONNECTION_STRING) {

      throw new Error(
        "MongoDB connection string is not defined"
      );

    }

    // =====================================
    // CONNECT DATABASE
    // =====================================

    const response =
      await mongoose.connect(
        DB_CONNECTION_STRING,
        {
          serverSelectionTimeoutMS: 10000,
        }
      );

    // =====================================
    // CONNECTION INFO
    // =====================================

    console.log(
      "database is connected:",
      response.connection.host
    );

    console.log(
      "database name:",
      response.connection.name
    );

  } catch (error) {

    console.error(
      "DB connection is error:",
      error
    );

    // Let app.ts handle startup failure
    throw error;

  }
};
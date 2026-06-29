const axios = require("axios");

const FOOTBALL_DATA_URL = "https://api.football-data.org/v4/competitions/WC/matches";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json",
  "Cache-Control": "no-store, max-age=0",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers,
      body: "",
    };
  }

  if (!process.env.FOOTBALL_DATA_TOKEN) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: "Missing FOOTBALL_DATA_TOKEN environment variable.",
        matches: [],
      }),
    };
  }

  try {
    const response = await axios.get(FOOTBALL_DATA_URL, {
      headers: {
        "X-Auth-Token": process.env.FOOTBALL_DATA_TOKEN,
      },
      params: {
        season: 2026,
      },
      timeout: 10000,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error("Football Data Error:", error.response?.data || error.message);

    return {
      statusCode: error.response?.status || 502,
      headers,
      body: JSON.stringify({
        success: false,
        message: error.response?.data?.message || error.message,
        matches: [],
      }),
    };
  }
};

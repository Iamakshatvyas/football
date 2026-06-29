const axios = require("axios");

exports.handler = async () => {
  try {
    const response = await axios.get(
      "https://api.football-data.org/v4/competitions/WC/matches",
      {
        headers: {
          "X-Auth-Token": process.env.FOOTBALL_DATA_TOKEN,
        },
        params: {
          season: 2026,
        },
      }
    );

    // Return ALL World Cup matches
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",`r`n        "Cache-Control": "no-store, max-age=0",
      },
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error(
      "Football Data Error:",
      error.response?.data || error.message
    );

    return {
      statusCode: error.response?.status || 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",`r`n        "Cache-Control": "no-store, max-age=0",
      },
      body: JSON.stringify({
        success: false,
        message: error.response?.data?.message || error.message,
      }),
    };
  }
};
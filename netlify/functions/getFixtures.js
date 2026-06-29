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

    // --- NEW FILTERING LOGIC ---
    
    // 1. Get the exact current time when the request is made
    const now = new Date();
    
    // 2. Calculate the cutoff time (34 hours in milliseconds)
    const thirtyFourHoursFromNow = new Date(now.getTime() + 34 * 60 * 60 * 1000);

    // 3. Filter the matches array based on the utcDate provided by the API
    const filteredMatches = (response.data.matches || []).filter((match) => {
      const matchDate = new Date(match.utcDate);
      return matchDate >= now && matchDate <= thirtyFourHoursFromNow;
    });

    // 4. Update the response payload with the filtered array and new count
    const payload = {
      ...response.data,
      count: filteredMatches.length,
      matches: filteredMatches,
    };

    // ---------------------------

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: false,
        message: error.response?.data?.message || error.message,
      }),
    };
  }
};
const { validateInput } = require("../utils/vailidator.js");
const axios = require("axios");
// google place suggest


const place_suggest = async (req, res) => {
  const { input, lat, lng, radius } = req.body;
  const rules = {
    input: { required: true, trim: true },
  };

  const error = await validateInput(req.body, rules, "");
  if (error.length > 0) {
    return res
      .status(400)
      .json({ message: "Validation failed", error, status: "400" });
  }
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json`;

  try {
    const response = await axios.get(url, {
        params: {
            input,
            key: process.env.GOOGLE_PLACE_API_KEY,
            location: lat && lng ? `${lat},${lng}` : undefined,
            radius: radius || 50000, // Default radius: 50km
            types: 'establishment', // Optional: restrict results to specific place types
        },
    });
    console.log(response)

    const suggestions = response.data.predictions.map((place) => ({
        id: place.place_id,
        description: place.description,
    }));

    return res
    .status(200)
    .send({
      message: "Suggested places",
      data: suggestions,
      status: "200",
    })
    .end();
} catch (error) {
    console.error('Error fetching autocomplete suggestions:', error.message);
    res.status(500).json({ 
        message: error.message || 'Failed to fetch autocomplete suggestions',
        error: error.message || 'Failed to fetch autocomplete suggestions',
        data: [],
        status: "200", });
}
};

module.exports = {
    place_suggest,
};

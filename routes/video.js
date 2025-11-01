require('dotenv').config();
const axios = require('axios');
const qs = require('qs');
var express = require('express');
var router = express.Router();



async function getZoomAccessToken() {
  const tokenUrl = `https://zoom.us/oauth/token`;
  const params = {
    grant_type: "account_credentials",
    account_id: process.env.ZOOM_ACCOUNT_ID,
  };

  const authHeader = Buffer.from(
    `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
  ).toString("base64");

  const response = await axios.post(`${tokenUrl}?${qs.stringify(params)}`, null, {
    headers: {
      Authorization: `Basic ${authHeader}`,
    },
  });

  return response.data.access_token;
}


async function createZoomMeeting() {
  const token = await getZoomAccessToken();

  const response = await axios.post(
    "https://api.zoom.us/v2/users/me/meetings",
    {
      topic: "Doctor-Patient Consultation",
      type: 1, // 1 = instant meeting, 2 = scheduled
      settings: {
        host_video: true,
        participant_video: true,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  console.log("Meeting created:", response.data);
  return response.data.join_url; // 🔗 Patient/doctor can join here
}


router.get("/create-meeting", async (req, res) => {
  try {
    const url = await createZoomMeeting();
    res.redirect(url);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating meeting");
  }
});


module.exports=router;
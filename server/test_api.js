import axios from 'axios';

const API_URL = 'http://localhost:5000/api/applications';

async function testApi() {
  try {
    console.log(`Testing GET ${API_URL}...`);
    const response = await axios.get(API_URL);
    console.log('Status:', response.status);
    console.log('Data length:', response.data.length);
    console.log('First item:', response.data[0]);
  } catch (error) {
    console.error('API Request Failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received (Server might be down or CORS issue)');
    } else {
      console.error('Error:', error.message);
    }
  }
}

testApi();

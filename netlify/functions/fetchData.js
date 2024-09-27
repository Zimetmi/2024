const axios = require('axios');

exports.handler = async function(event, context) {
    const API_KEY = 'ваш_секретный_api_ключ';
    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/someendpoint?key=${API_KEY}&param=value`);
        return {
            statusCode: 200,
            body: JSON.stringify(response.data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Ошибка при запросе к API',
        };
    }
};

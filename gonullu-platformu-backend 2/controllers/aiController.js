const axios = require('axios');
const { validateCoordinates } = require('../utils/validationUtils');
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

exports.getRecommendation = async (req, res) => {
    try {
        const { lat, lng, userId } = req.body;
        
        if (!validateCoordinates(lat, lng)) {
            return res.status(400).json({ success: false, error: "Geçersiz koordinatlar" });
        }

        let rawRecommendations;

        try {
            const response = await axios.post(process.env.AI_API_URL, {
                location: { lat, lng },
                userId,
                timestamp: new Date().toISOString()
            }, { timeout: 4000 }); 

            rawRecommendations = response.data;
        } catch (aiError) {
            console.warn('AI Servisi yanıt vermedi, Fallback devreye giriyor...');
            rawRecommendations = getFallbackData(); 
        }
        const recommendations = rawRecommendations.map(item => ({
            ...item,
            distance: parseFloat(calculateDistance(lat, lng, item.location.lat, item.location.lng).toFixed(2))
        })).sort((a, b) => a.distance - b.distance);

        res.json({
            success: true,
            source: rawRecommendations === getFallbackData() ? 'fallback' : 'ai',
            recommendations
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Öneri motorunda kritik hata" });
    }
};
function getFallbackData() {
    return [
        { name: "İzmir Gönüllülük Merkezi", location: { lat: 38.4237, lng: 27.1428 }, description: "Genel destek noktası" },
        { name: "Bornova Acil Destek", location: { lat: 38.4637, lng: 27.2163 }, description: "Acil yardım koordinasyon" }
    ];
}
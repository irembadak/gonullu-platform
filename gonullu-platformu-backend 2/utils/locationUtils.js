const DEG_TO_RAD = Math.PI / 180;
const EARTH_RADIUS_KM = 6371;
const calculateDistance = (coord1, coord2) => {
    if (!coord1 || !coord2 || coord1.length < 2 || coord2.length < 2) return 9999;

    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;

    const dLat = (lat2 - lat1) * DEG_TO_RAD;
    const dLon = (lon2 - lon1) * DEG_TO_RAD;

    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * DEG_TO_RAD) * Math.cos(lat2 * DEG_TO_RAD) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_KM * c;
};
exports.recommendOrganizations = (userCoords, organizations, maxDistance = 10) => {
    return organizations
        .map(org => ({
            ...org.toObject ? org.toObject() : org,
            distance: calculateDistance(userCoords, org.location.coordinates)
        }))
        .filter(org => org.distance <= maxDistance)
        .sort((a, b) => a.distance - b.distance);
};

exports.calculateDistance = calculateDistance;
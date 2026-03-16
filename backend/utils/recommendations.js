const User = require('../models/User');
const Event = require('../models/Event'); 

module.exports = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return [];
    let recommended = await Event.find({
      status: 'approved',
      startDate: { $gte: new Date() },
      $or: [
        { category: { $in: user.interests } },
        { skillsRequired: { $in: user.skills } } 
      ]
    }).limit(5);
    if (recommended.length < 5) {
      const existingIds = recommended.map(event => event._id);
      
      const popular = await Event.find({
        _id: { $nin: existingIds }, 
        status: 'approved',
        startDate: { $gte: new Date() }
      })
      .sort({ participants: -1 })
      .limit(5 - recommended.length);
      
      recommended = [...recommended, ...popular];
    }

    return recommended;
  } catch (err) {
    console.error('Öneri motoru hatası:', err);
    return [];
  }
};
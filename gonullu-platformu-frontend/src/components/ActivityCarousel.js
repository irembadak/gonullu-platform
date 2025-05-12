import React from 'react';
import './ActivityCarousel.css';

const ActivityCarousel = () => {
  const activities = [
    { id: 1, title: 'Afet Bölgesi Yardım', location: 'İstanbul' },
    { id: 2, title: 'Çevre Temizliği', location: 'Ankara' },
    { id: 3, title: 'Eğitim Desteği', location: 'İzmir' },
    { id: 4, title: 'Hayvan Barınağı Yardım', location: 'Bursa' },
  ];

  return (
    <div className="activity-carousel">
      {activities.map(activity => (
        <div key={activity.id} className="activity-card">
          <h3>{activity.title}</h3>
          <p>{activity.location}</p>
          <button className="join-button">Katıl</button>
        </div>
      ))}
    </div>
  );
};

export default ActivityCarousel;
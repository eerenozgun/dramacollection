import React from 'react';
import earringsData from '../data/earrings.json';

const Earrings: React.FC = () => {
    return (
        <div className="earrings-list">
            {earringsData.map(earring => (
                <div key={earring.id} className="earring-item">
                    <img src={earring.imageUrl} alt={earring.name} />
                    <h3>{earring.name}</h3>
                    <p>{earring.description}</p>
                    <p>${earring.price}</p>
                </div>
            ))}
        </div>
    );
};

export default Earrings;
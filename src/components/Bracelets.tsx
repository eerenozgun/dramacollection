import React from 'react';
import braceletsData from '../data/bracelets.json';

const Bracelets: React.FC = () => {
    return (
        <div className="bracelets">
            <h2>Bracelets</h2>
            <ul>
                {braceletsData.map(bracelet => (
                    <li key={bracelet.id}>
                        <img src={bracelet.imageUrl} alt={bracelet.name} />
                        <h3>{bracelet.name}</h3>
                        <p>{bracelet.description}</p>
                        <p>Price: ${bracelet.price}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Bracelets;
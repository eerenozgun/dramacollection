import React from 'react';
import necklacesData from '../data/necklaces.json';

const Necklaces: React.FC = () => {
    return (
        <div className="necklaces">
            <h2>Necklaces</h2>
            <ul>
                {necklacesData.map(necklace => (
                    <li key={necklace.id}>
                        <img src={necklace.imageUrl} alt={necklace.name} />
                        <h3>{necklace.name}</h3>
                        <p>{necklace.description}</p>
                        <p>Price: ${necklace.price}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Necklaces;
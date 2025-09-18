import React from 'react';
import piercingsData from '../data/piercings.json';

const Piercings: React.FC = () => {
    return (
        <div>
            <h2>Piercings</h2>
            <ul>
                {piercingsData.map(piercing => (
                    <li key={piercing.id}>
                        <img src={piercing.imageUrl} alt={piercing.name} />
                        <h3>{piercing.name}</h3>
                        <p>{piercing.description}</p>
                        <p>Price: ${piercing.price}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Piercings;
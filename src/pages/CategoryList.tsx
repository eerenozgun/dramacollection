import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryList.css';

const categories = [
  { name: 'Küpe', slug: 'earrings', image: '/images/earrings.jpg' },
  { name: 'Kolye', slug: 'necklaces', image: '/images/necklaces.jpg' },
  { name: 'Bileklik', slug: 'bracelets', image: '/images/bracelets.jpg' },
  { name: 'Piercing', slug: 'piercings', image: '/images/piercings.jpg' }
];

const CategoryList: React.FC = () => {
  return (
    <div className="category-list-page">
      <h2>Kategoriler</h2>
      <div className="category-grid">
        {categories.map((cat) => (
          <Link
            to={`/category/${cat.slug}`}
            key={cat.slug}
            className="category-card"
          >
            <img src={cat.image} alt={cat.name} />
            <h3>{cat.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
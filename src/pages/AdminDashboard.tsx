import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, limit } from 'firebase/firestore';
import './AdminDashboard.css';

// Gerçek veriler için state'ler

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'users'>('overview');
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'necklaces',
    description: '',
    image: ''
  });
  
  // Firebase'den gelen veriler
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  
  // Ürün yönetimi state'leri
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const authContext = useContext(AuthContext);
  const { canAccessAdmin, adminLogout, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();

  // Firebase'den veri çekme fonksiyonları
  const loadOrders = async () => {
    try {
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      const ordersData = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    } catch (error) {
      console.error('Siparişler yüklenemedi:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const productsData = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
    } catch (error) {
      console.error('Ürünler yüklenemedi:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Kullanıcılar yüklenemedi:', error);
    }
  };

  const loadCategories = async () => {
    try {
      console.log('🔄 Kategoriler yükleniyor...');
      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('📋 Yüklenen kategoriler:', categoriesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
    }
  };

  const calculateStats = () => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalProducts = products.length;
    const totalUsers = users.length;
    
    setStats({
      totalOrders,
      totalRevenue,
      totalProducts,
      totalUsers
    });
  };

  // Erişim kontrolü ve veri yükleme
  useEffect(() => {
    if (!canAccessAdmin && !adminLoading) {
      navigate('/admin/login');
      return;
    }

    if (canAccessAdmin) {
      const loadData = async () => {
        setLoading(true);
        await Promise.all([
          loadOrders(),
          loadProducts(),
          loadUsers(),
          loadCategories()
        ]);
        setLoading(false);
      };
      loadData();
    }
  }, [canAccessAdmin, adminLoading, navigate]);

  // İstatistikleri hesapla
  useEffect(() => {
    if (orders.length > 0 || products.length > 0 || users.length > 0) {
      calculateStats();
    }
  }, [orders, products, users]);

  const handleAdminLogout = () => {
    adminLogout();
    navigate('/');
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        createdAt: new Date(),
        updatedAt: new Date(),
        stock: 99, // Varsayılan stok
        isActive: true
      };

      await addDoc(collection(db, 'products'), productData);
      alert('Ürün başarıyla eklendi!');
      setNewProduct({ name: '', price: '', category: 'necklaces', description: '', image: '' });
      
      // Ürünleri yeniden yükle
      await loadProducts();
    } catch (error) {
      console.error('Ürün eklenirken hata:', error);
      alert('Ürün eklenirken bir hata oluştu!');
    }
  };

  // Ürün düzenleme
  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name || '',
      price: product.price?.toString() || '',
      category: product.category || 'necklaces',
      description: product.description || '',
      image: product.image || ''
    });
    setShowProductModal(true);
  };

  // Ürün güncelleme
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        updatedAt: new Date()
      };

      await updateDoc(doc(db, 'products', editingProduct.id), productData);
      alert('Ürün başarıyla güncellendi!');
      setShowProductModal(false);
      setEditingProduct(null);
      setNewProduct({ name: '', price: '', category: 'necklaces', description: '', image: '' });
      
      await loadProducts();
    } catch (error) {
      console.error('Ürün güncellenirken hata:', error);
      alert('Ürün güncellenirken bir hata oluştu!');
    }
  };

  // Ürün silme
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteDoc(doc(db, 'products', productId));
      alert('Ürün başarıyla silindi!');
      await loadProducts();
    } catch (error) {
      console.error('Ürün silinirken hata:', error);
      alert('Ürün silinirken bir hata oluştu!');
    }
  };

  // Kategori ekleme
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      console.log('➕ Kategori ekleniyor:', newCategory.trim());
      const categoryData = {
        name: newCategory.trim(),
        slug: newCategory.toLowerCase().replace(/\s+/g, '-'),
        createdAt: new Date(),
        isActive: true
      };
      console.log('📝 Kategori verisi:', categoryData);
      
      const docRef = await addDoc(collection(db, 'categories'), categoryData);
      console.log('✅ Kategori eklendi, ID:', docRef.id);
      
      alert('Kategori başarıyla eklendi!');
      setNewCategory('');
      
      console.log('🔄 Kategoriler yeniden yükleniyor...');
      await loadCategories();
    } catch (error) {
      console.error('Kategori eklenirken hata:', error);
      alert('Kategori eklenirken bir hata oluştu!');
    }
  };

  // Kategori silme
  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteDoc(doc(db, 'categories', categoryId));
      alert('Kategori başarıyla silindi!');
      await loadCategories();
    } catch (error) {
      console.error('Kategori silinirken hata:', error);
      alert('Kategori silinirken bir hata oluştu!');
    }
  };

  if (!canAccessAdmin) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-title">
          <h1>🎭 Drama Collection Admin</h1>
          <p>Hoş geldin, <strong>{authContext?.user?.name || authContext?.user?.email}</strong></p>
        </div>
        <div className="admin-actions">
          <button onClick={() => navigate('/')} className="btn-secondary">
            Siteyi Görüntüle
          </button>
          <button onClick={handleAdminLogout} className="btn-danger">
            Admin Çıkışı
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={activeTab === 'overview' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('overview')}
        >
          📊 Genel Bakış
        </button>
        <button 
          className={activeTab === 'products' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('products')}
        >
          💎 Ürünler
        </button>
        <button 
          className={activeTab === 'orders' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('orders')}
        >
          📦 Siparişler
        </button>
        <button 
          className={activeTab === 'users' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('users')}
        >
          👥 Kullanıcılar
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <h2>Genel Bakış</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Toplam Sipariş</h3>
                <div className="stat-number">{loading ? '...' : stats.totalOrders}</div>
                <div className="stat-change">Firebase'den</div>
              </div>
              <div className="stat-card">
                <h3>Toplam Gelir</h3>
                <div className="stat-number">{loading ? '...' : `₺${stats.totalRevenue.toLocaleString()}`}</div>
                <div className="stat-change">Firebase'den</div>
              </div>
              <div className="stat-card">
                <h3>Aktif Ürünler</h3>
                <div className="stat-number">{loading ? '...' : stats.totalProducts}</div>
                <div className="stat-change">Firebase'den</div>
              </div>
              <div className="stat-card">
                <h3>Kayıtlı Kullanıcı</h3>
                <div className="stat-number">{loading ? '...' : stats.totalUsers}</div>
                <div className="stat-change">Firebase'den</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="products-section">
            <h2>Ürün Yönetimi</h2>
            
            {/* Kategori Yönetimi */}
            <div className="category-management">
              <h3>Kategori Yönetimi</h3>
              <form onSubmit={handleAddCategory} className="category-form">
                <input
                  type="text"
                  placeholder="Yeni Kategori Adı"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  required
                />
                <button type="submit" className="btn-primary">Kategori Ekle</button>
              </form>
              
              <div className="categories-list">
                {console.log('🎯 Render edilen kategoriler:', categories)}
                {categories.length === 0 ? (
                  <p>Henüz kategori bulunmuyor</p>
                ) : (
                  categories.map(category => (
                    <div key={category.id} className="category-item">
                      <span>{category.name}</span>
                      <button 
                        onClick={() => handleDeleteCategory(category.id)}
                        className="btn-danger btn-small"
                      >
                        Sil
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Ürün Ekleme Formu */}
            <div className="add-product-form">
              <h3>Yeni Ürün Ekle</h3>
              <form onSubmit={handleAddProduct}>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Ürün Adı"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Fiyat (₺)"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    required
                  />
                </div>
                <div className="form-row">
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="url"
                    placeholder="Resim URL'si"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                    required
                  />
                </div>
                <textarea
                  placeholder="Ürün Açıklaması"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  rows={3}
                  required
                />
                <button type="submit" className="btn-primary">
                  Ürün Ekle
                </button>
              </form>
            </div>

            {/* Ürün Listesi */}
            <div className="products-list">
              <h3>Mevcut Ürünler</h3>
              {loading ? (
                <p>Yükleniyor...</p>
              ) : products.length === 0 ? (
                <p>Henüz ürün bulunmuyor</p>
              ) : (
                <div className="products-grid">
                  {products.map(product => (
                    <div key={product.id} className="product-card">
                      <img src={product.image} alt={product.name} className="product-image" />
                      <div className="product-info">
                        <h4>{product.name}</h4>
                        <p className="product-price">₺{product.price}</p>
                        <p className="product-category">{product.category}</p>
                        <p className="product-stock">Stok: {product.stock || 0}</p>
                        <div className="product-actions">
                          <button 
                            onClick={() => handleEditProduct(product)}
                            className="btn-primary btn-small"
                          >
                            Düzenle
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="btn-danger btn-small"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>Sipariş Yönetimi</h2>
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Sipariş ID</th>
                    <th>Müşteri</th>
                    <th>Toplam</th>
                    <th>Durum</th>
                    <th>Tarih</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                        Yükleniyor...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                        Henüz sipariş bulunmuyor
                      </td>
                    </tr>
                  ) : (
                    orders.map(order => (
                      <tr key={order.id}>
                        <td>#{order.id.slice(0, 8)}</td>
                        <td>{order.customerEmail || 'N/A'}</td>
                        <td>₺{order.total || 0}</td>
                        <td>
                          <span className={`status ${(order.status || 'bekliyor').toLowerCase()}`}>
                            {order.status || 'Bekliyor'}
                          </span>
                        </td>
                        <td>{order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('tr-TR') : 'N/A'}</td>
                        <td>
                          <button className="btn-small btn-primary">Görüntüle</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            <h2>Kullanıcı Yönetimi</h2>
            <p>Kullanıcı listesi ve yönetimi burada görüntülenecek.</p>
            <div className="feature-coming-soon">
              <h3>🚧 Yakında Gelecek</h3>
              <p>Kullanıcı yönetimi özellikleri geliştiriliyor...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

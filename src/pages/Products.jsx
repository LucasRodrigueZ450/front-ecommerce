import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

import ProductCard from "../components/ProductCard";
import EditProductModal from "../components/EditProductModal";
import MessageBox from "../components/MessageBox";
import Loader from "../components/Loader";

import { FaPlus, FaSearch, FaFilter, FaBoxOpen } from "react-icons/fa";

import "./Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  // ============================================
  // CARREGAR PRODUTOS
  // ============================================
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await api.get("/products");

        const safeProducts = Array.isArray(data)
          ? data.filter((p) => p && typeof p === "object")
          : [];

        setProducts(safeProducts);
        setFilteredProducts(safeProducts);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
        setError("Erro ao carregar produtos. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // ============================================
  // FILTROS E BUSCA
  // ============================================
  useEffect(() => {
    let list = [...products];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (p) =>
          p?.name?.toLowerCase().includes(term) ||
          p?.description?.toLowerCase().includes(term) ||
          p?.category?.toLowerCase().includes(term)
      );
    }

    if (selectedCategory.trim()) {
      list = list.filter(
        (p) => p?.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredProducts(list);
  }, [searchTerm, selectedCategory, products]);

  // ============================================
  // ABRIR MODAL
  // ============================================
  const handleEditProduct = (product) => {
    if (!product) return;
    setEditingProduct(product);
  };

  // ============================================
  // SALVAR PRODUTO EDITADO
  // ============================================
  const handleSaveProduct = async (updatedProduct) => {
    try {
      const { data } = await api.put(
        `/products/${updatedProduct._id}`,
        updatedProduct
      );

      setProducts((prev) =>
        prev.map((p) => (p._id === updatedProduct._id ? data.product : p))
      );

      setEditingProduct(null);
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      alert("Erro ao salvar alterações.");
    }
  };

  // ============================================
  // EXCLUIR PRODUTO
  // ============================================
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?"))
      return;

    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Erro ao excluir:", err);
      alert("Erro ao excluir produto.");
    }
  };

  // ============================================
  // CATEGORIAS ÚNICAS
  // ============================================
  const categories = [...new Set(products.map((p) => p?.category))].sort();

  // ============================================
  // TELAS DE LOADING / ERRO
  // ============================================
  if (loading)
    return (
      <div className="page-container loading-page">
        <Loader size="large" />
      </div>
    );

  if (error)
    return (
      <div className="page-container">
        <MessageBox type="error">{error}</MessageBox>
      </div>
    );

  // ============================================
  // UI FINAL
  // ============================================
  return (
    <div className="products-page page-container">

      {/* CABEÇALHO */}
      <div className="page-header">
        <div>
          <h2>Nossos Produtos</h2>
          <p style={{ color: "#7f8c8d", marginTop: "5px" }}>
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "produto encontrado" : "produtos encontrados"}
          </p>
        </div>

        {user?.role === "admin" && (
          <button
            className="btn btn-primary"
            onClick={() => navigate("/products/create")}
          >
            <FaPlus style={{ marginRight: "8px" }} />
            Novo Produto
          </button>
        )}
      </div>

      {/* FILTROS */}
      <div className="filters-section">
        {/* Busca */}
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Categoria */}
        <div className="filter-group">
          <FaFilter />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            <option value="">Todas as categorias</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* limpar filtros */}
        {(searchTerm || selectedCategory) && (
          <button
            className="btn-outline"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("");
            }}
          >
            Limpar Filtros
          </button>
        )}
      </div>

      {/* GRID DE PRODUTOS */}
      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <FaBoxOpen size={60} style={{ opacity: 0.6 }} />
          <h3>Nenhum produto encontrado</h3>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) =>
            product ? (
              <ProductCard
                key={product._id}
                product={product}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            ) : null
          )}
        </div>
      )}

      {/* MODAL EDITAR */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}

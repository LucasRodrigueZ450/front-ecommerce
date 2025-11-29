import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaBoxOpen, FaArrowLeft, FaImage, FaSave } from "react-icons/fa";
import MessageBox from "../components/MessageBox";

function CreateProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro quando usuário começar a digitar
    if (error) setError("");

    // Atualizar preview da imagem
    if (name === "image" && value) {
      setImagePreview(value);
    }
  }

  function validateForm() {
    if (!form.name.trim()) return "Nome é obrigatório";
    if (!form.description.trim()) return "Descrição é obrigatória";
    if (!form.price || parseFloat(form.price) <= 0) return "Preço deve ser maior que zero";
    if (!form.category.trim()) return "Categoria é obrigatória";
    if (!form.stock || parseInt(form.stock) < 0) return "Estoque não pode ser negativo";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const productData = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock)
      };

      await api.post("/products", productData);
      
      // Feedback de sucesso
      alert("Produto criado com sucesso!");
      navigate("/products");
      
    } catch (err) {
      console.error("Erro ao criar produto:", err);
      setError(err.response?.data?.message || "Erro ao criar produto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const categories = ["Eletrônicos", "Roupas", "Casa", "Esportes", "Livros", "Beleza", "Outros"];

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="form-container" style={{ maxWidth: "700px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <FaBoxOpen />
              Criar Novo Produto
            </h2>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate("/products")}
            >
              <FaArrowLeft style={{ marginRight: "8px" }} />
              Voltar
            </button>
          </div>

          {error && (
            <MessageBox type="error" style={{ marginBottom: "20px" }}>
              {error}
            </MessageBox>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group" style={{ flex: 2 }}>
                <label>Nome do Produto *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ex: Smartphone Samsung Galaxy"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label>Categoria *</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Selecione...</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Descrição *</label>
              <textarea
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                placeholder="Descreva o produto detalhadamente..."
                required
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Preço (R$) *</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label>Estoque *</label>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FaImage />
                URL da Imagem (opcional)
              </label>
              <input
                name="image"
                type="url"
                value={form.image}
                onChange={handleChange}
                placeholder="https://exemplo.com/imagem.jpg"
                disabled={loading}
              />
              
              {imagePreview && (
                <div className="image-preview" style={{ marginTop: "10px" }}>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <p className="preview-text">Pré-visualização</p>
                </div>
              )}
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: "100%" }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Criando Produto...
                </>
              ) : (
                <>
                  <FaSave style={{ marginRight: "8px" }} />
                  Criar Produto
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateProduct;
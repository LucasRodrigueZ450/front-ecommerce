import React, { useState, useEffect } from "react";
import "./Modal.css";

/* =====================================================
   NORMALIZAÇÃO DE PREÇOS
===================================================== */

function formatPrice(value) {
  if (!value) return 0;

  return Number(
    String(value)
      .replace(/\s/g, "")
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
  );
}

function formatPriceForInput(value) {
  if (!value) return "";

  return String(value)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/* =====================================================
   COMPONENTE DO MODAL
===================================================== */

function EditProductModal({ product, onClose, onSave, isLoading = false }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: ""
  });

  const [errors, setErrors] = useState({});

  /* Preenche o formulário ao abrir o modal */
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: formatPriceForInput(product.price) || "",
        category: product.category || "",
        stock: product.stock || "",
        image: product.image || ""
      });
    }
  }, [product]);

  /* Atualiza inputs */
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  /* Validação */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.description.trim()) newErrors.description = "Descrição é obrigatória";
    if (!formData.price) newErrors.price = "Preço é obrigatório";
    if (!formData.category.trim()) newErrors.category = "Categoria é obrigatória";
    if (!formData.stock && formData.stock !== 0) newErrors.stock = "Estoque é obrigatório";
    if (formData.stock < 0) newErrors.stock = "Estoque não pode ser negativo";

    const priceValue = formatPrice(formData.price);
    if (priceValue <= 0) newErrors.price = "Preço deve ser maior que zero";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* Submit */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const normalizedPrice = formatPrice(formData.price);

    onSave({
      ...product,
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: normalizedPrice,
      category: formData.category.trim(),
      stock: Number(formData.stock),
      image: formData.image.trim()
    });
  };

  /* Fecha clicando na área escura */
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        
        {/* HEADER */}
        <div className="modal-header">
          <h2>✏️ Editar Produto</h2>
          <button 
            type="button" 
            className="modal-close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          
          {/* Nome */}
          <div className="form-group">
            <label>Nome do Produto:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={errors.name ? "error" : ""}
              placeholder="Digite o nome"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          {/* Descrição */}
          <div className="form-group">
            <label>Descrição:</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className={errors.description ? "error" : ""}
              placeholder="Descreva o produto"
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          {/* Preço + Estoque */}
          <div className="form-row">
            <div className="form-group">
              <label>Preço (R$):</label>
              <input
                type="text"
                value={formData.price}
                placeholder="0,00"
                onChange={(e) => handleChange("price", e.target.value)}
                className={errors.price ? "error" : ""}
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label>Estoque:</label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleChange("stock", e.target.value)}
                className={errors.stock ? "error" : ""}
              />
              {errors.stock && <span className="error-message">{errors.stock}</span>}
            </div>
          </div>

          {/* Categoria */}
          <div className="form-group">
            <label>Categoria:</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className={errors.category ? "error" : ""}
            />
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          {/* IMAGEM */}
          <div className="form-group">
            <label>URL da Imagem (opcional):</label>
            <input
              type="url"
              value={formData.image}
              placeholder="https://exemplo.com/img.jpg"
              onChange={(e) => handleChange("image", e.target.value)}
            />

            {/* PREVIEW AJUSTADO */}
            {formData.image && (
              <div className="image-preview">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="edit-modal-image-preview"
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
            )}
          </div>

          {/* BOTÕES */}
          <div className="modal-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditProductModal;

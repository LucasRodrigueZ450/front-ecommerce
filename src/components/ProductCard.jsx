import React from "react";
import { useCart } from "../context/CartContext";

import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { BsBox, BsBoxFill } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";

function ProductCard({ product = {}, onEdit, onDelete, className = "" }) {
  const { addToCart } = useCart();

  // impede erro se faltar alguma propriedade
  const safeStock = Number(product.stock) || 0;
  const safePrice = Number(product.price) || 0;

  const handleAddToCart = () => {
    if (!product || safeStock === 0) return;
    addToCart(product);
  };

  const isLowStock = safeStock < 5 && safeStock > 0;
  const isOutOfStock = safeStock === 0;

  return (
    <div
      className={`product-card ${className} ${
        isOutOfStock ? "product-card-out" : ""
      }`}
    >
      {/* Imagem */}
      {product.image && (
        <div className="product-image">
          <img src={product.image} alt={product.name || "Produto"} />
          {isOutOfStock && (
            <div className="out-of-stock-overlay">
              <span>ESGOTADO</span>
            </div>
          )}
        </div>
      )}

      <div className="product-content">
        <div className="product-header">
          <h3 className="product-name">{product.name || "Produto sem nome"}</h3>
          <span className="product-category">{product.category || "Categoria"}</span>
        </div>

        <p className="product-description">
          {product.description || "Nenhuma descrição disponível."}
        </p>

        <div className="product-meta">
          <span
            className={`stock-badge ${
              isLowStock ? "low-stock" : ""
            } ${isOutOfStock ? "out-of-stock" : ""}`}
          >
            {isOutOfStock || isLowStock ? (
              <BsBoxFill size={14} style={{ marginRight: 4 }} />
            ) : (
              <BsBox size={14} style={{ marginRight: 4 }} />
            )}

            {safeStock} em estoque
            {isLowStock && !isOutOfStock && (
              <span className="low-stock-warning"> • Baixo estoque</span>
            )}
          </span>
        </div>

        <div className="product-footer">
          <span className="product-price">R$ {safePrice.toFixed(2)}</span>

          <div className="product-actions">
            <button
              className="btn-icon btn-edit"
              onClick={() => onEdit(product)}
              type="button"
              title="Editar"
            >
              <AiOutlineEdit size={18} />
            </button>

            <button
              className="btn-icon btn-delete"
              onClick={() => onDelete(product._id)}
              type="button"
              title="Excluir"
            >
              <AiOutlineDelete size={18} />
            </button>

            <button
              className="btn-icon btn-add-cart"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              title={isOutOfStock ? "Produto esgotado" : "Adicionar ao carrinho"}
              type="button"
            >
              <FaShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

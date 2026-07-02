'use client';

import React, { useState, useEffect } from 'react';
import { useProductQuery } from '@/queries/useProductQuery';
import { useCartStore } from '@/stores/useCartStore';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { useRecentlyViewedStore } from '@/stores/useRecentlyViewedStore';
import { Product } from '@/types/product';
import { Heart, ShoppingCart, Eye, X, Info } from 'lucide-react';
import styles from './style.module.css';

export default function ShopSection() {
  const [mounted, setMounted] = useState(false);
  const { data: products, isLoading, error } = useProductQuery();
  const { addItem } = useCartStore();
  const { toggleWishlist, items: wishlistItems } = useWishlistStore();
  const { addProduct: addToRecentlyViewed, items: recentlyViewed } = useRecentlyViewedStore();

  const [activeDetailsProduct, setActiveDetailsProduct] = useState<Product | null>(null);

  useEffect(() => {
    const animFrame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(animFrame);
  }, []);

  if (!mounted) return null;

  const handleOpenDetails = (product: Product) => {
    setActiveDetailsProduct(product);
    addToRecentlyViewed(product);
  };

  const isFavorited = (productId: string) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  return (
    <section id="order" className={styles.shopSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Hệ sinh thái PE</span>
          <h2 className={styles.title}>Cửa hàng thiết bị thú cưng</h2>
          <p className={styles.subtitle}>
            Trang bị giải pháp công nghệ thông minh đỉnh cao để chăm sóc và bảo vệ sức khỏe người bạn bốn chân của bạn.
          </p>
        </div>

        {isLoading ? (
          <div className={styles.loaderWrapper}>
            <div className={styles.loader}></div>
            <p>Đang tải danh sách sản phẩm...</p>
          </div>
        ) : error ? (
          <div className={styles.errorWrapper}>
            <p>Không thể tải sản phẩm. Vui lòng thử lại sau.</p>
          </div>
        ) : (
          <>
            <div className={styles.productGrid}>
              {products?.map((product: Product) => (
                <div key={product.id} className={styles.productCard}>
                  <div className={styles.imageContainer}>
                    <img src={product.image} alt={product.name} className={styles.productImage} />
                    <button
                      className={`${styles.favoriteBtn} ${isFavorited(product.id) ? styles.favorited : ''}`}
                      onClick={() => toggleWishlist(product)}
                      aria-label="Add to favorites"
                    >
                      <Heart size={18} fill={isFavorited(product.id) ? '#e54b4b' : 'none'} />
                    </button>
                    <div className={styles.hoverActions}>
                      <button className={styles.quickViewBtn} onClick={() => handleOpenDetails(product)}>
                        <Eye size={16} />
                        <span>Xem chi tiết</span>
                      </button>
                    </div>
                  </div>

                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.productDesc}>{product.description}</p>
                    <div className={styles.priceRow}>
                      <span className={styles.price}>${product.price.toFixed(2)}</span>
                      {product.compareAtPrice && (
                        <span className={styles.comparePrice}>${product.compareAtPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <div className={styles.cardActions}>
                      <button className={styles.addToCartBtn} onClick={() => addItem(product)}>
                        <ShoppingCart size={16} />
                        <span>Thêm vào giỏ</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recently Viewed Products */}
            {recentlyViewed.length > 0 && (
              <div className={styles.recentlyViewedSection}>
                <h3 className={styles.rvTitle}>Sản phẩm đã xem gần đây</h3>
                <div className={styles.rvList}>
                  {recentlyViewed.map((product) => (
                    <div
                      key={product.id}
                      className={styles.rvItem}
                      onClick={() => handleOpenDetails(product)}
                      title={product.name}
                    >
                      <div className={styles.rvImageWrapper}>
                        <img src={product.image} alt={product.name} className={styles.rvImage} />
                      </div>
                      <span className={styles.rvName}>{product.name.split(' ').slice(0, 3).join(' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Details Modal */}
      {activeDetailsProduct && (
        <div className={styles.modalOverlay} onClick={() => setActiveDetailsProduct(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setActiveDetailsProduct(null)}>
              <X size={20} />
            </button>
            <div className={styles.modalBody}>
              <div className={styles.modalImageWrapper}>
                <img src={activeDetailsProduct.image} alt={activeDetailsProduct.name} className={styles.modalImage} />
              </div>
              <div className={styles.modalDetails}>
                <h3 className={styles.modalTitle}>{activeDetailsProduct.name}</h3>
                <p className={styles.modalDesc}>{activeDetailsProduct.description}</p>
                <div className={styles.modalPriceRow}>
                  <span className={styles.modalPrice}>${activeDetailsProduct.price.toFixed(2)}</span>
                  {activeDetailsProduct.compareAtPrice && (
                    <span className={styles.modalComparePrice}>${activeDetailsProduct.compareAtPrice.toFixed(2)}</span>
                  )}
                </div>

                {activeDetailsProduct.specs && (
                  <div className={styles.specsSection}>
                    <h4 className={styles.specsTitle}>
                      <Info size={14} />
                      Thông số nổi bật:
                    </h4>
                    <div className={styles.specsGrid}>
                      {Object.entries(activeDetailsProduct.specs).map(([key, list]) => (
                        <div key={key} className={styles.specGroup}>
                          <h5 className={styles.specGroupTitle}>{key.toUpperCase()}</h5>
                          <ul className={styles.specList}>
                            {list.map((item, idx) => (
                              <li key={idx} className={styles.specItem}>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className={styles.modalActions}>
                  <button
                    className={styles.modalAddBtn}
                    onClick={() => {
                      addItem(activeDetailsProduct);
                      setActiveDetailsProduct(null);
                    }}
                  >
                    <ShoppingCart size={18} />
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

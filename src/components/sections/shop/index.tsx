'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useProductQuery } from '@/queries/useProductQuery';
import { useCartStore } from '@/stores/useCartStore';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { useRecentlyViewedStore } from '@/stores/useRecentlyViewedStore';
import { Product } from '@/types/product';
import { Heart, ShoppingCart, Eye, X, Info, Check } from 'lucide-react';
import ScrollReveal from '@/components/ui/scroll-reveal';
import { SkeletonProductGrid } from '@/components/ui/skeleton';
import styles from './style.module.css';

export default function ShopSection() {
  const t = useTranslations('shop');
  const [mounted, setMounted] = useState(false);
  const { data: products, isLoading, error } = useProductQuery();
  const { addItem } = useCartStore();
  const { toggleWishlist, items: wishlistItems } = useWishlistStore();
  const { addProduct: addToRecentlyViewed, items: recentlyViewed } = useRecentlyViewedStore();

  const [activeDetailsProduct, setActiveDetailsProduct] = useState<Product | null>(null);
  // Track which cards were just added-to-cart for the success micro-animation
  const [addedCards, setAddedCards] = useState<Set<string>>(new Set());
  // Track which hearts were just toggled for heart-pop micro-animation
  const [poppedHearts, setPoppedHearts] = useState<Set<string>>(new Set());

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

  const handleAddToCart = (product: Product) => {
    addItem(product);
    // Trigger success animation on the button for 1.5s
    setAddedCards((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedCards((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
  };

  const handleToggleWishlist = (product: Product) => {
    toggleWishlist(product);
    // Trigger heart-pop animation
    setPoppedHearts((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setPoppedHearts((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 600);
  };

  return (
    <section id="order" className={styles.shopSection}>
      <div className={styles.container}>
        {/* Section Header */}
        <ScrollReveal animation="revealUp" duration={700}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>{t('eyebrow')}</span>
            <h2 className={styles.title}>{t('title')}</h2>
            <p className={styles.subtitle}>{t('subtitle')}</p>
          </div>
        </ScrollReveal>

        {isLoading ? (
          /* Skeleton grid — same layout as real grid, no CLS */
          <SkeletonProductGrid count={4} />
        ) : error ? (
          <ScrollReveal animation="revealFade">
            <div className={styles.errorWrapper}>
              <p>{t('error')}</p>
            </div>
          </ScrollReveal>
        ) : (
          <>
            <div className={styles.productGrid}>
              {products?.map((product: Product, index: number) => {
                const isAdded = addedCards.has(product.id);
                const isPopped = poppedHearts.has(product.id);
                const isFav = isFavorited(product.id);

                return (
                  <div
                    key={product.id}
                    className={styles.productCard}
                    style={{ '--card-index': index } as React.CSSProperties}
                  >
                    <div className={styles.imageContainer}>
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={styles.productImage}
                      />

                      {/* Wishlist — heart-pop micro-interaction */}
                      <button
                        className={`${styles.favoriteBtn} ${isFav ? styles.favorited : ''} ${isPopped ? styles.heartPopping : ''}`}
                        onClick={() => handleToggleWishlist(product)}
                        aria-label="Add to favorites"
                      >
                        <Heart size={18} fill={isFav ? '#e54b4b' : 'none'} />
                      </button>

                      {/* Quick View — slide up on hover */}
                      <div className={styles.hoverActions}>
                        <button className={styles.quickViewBtn} onClick={() => handleOpenDetails(product)}>
                          <Eye size={16} />
                          <span>{t('quickView')}</span>
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
                        {/* Add to Cart — success state micro-interaction */}
                        <button
                          className={`${styles.addToCartBtn} ${isAdded ? styles.addedToCart : ''}`}
                          onClick={() => handleAddToCart(product)}
                          disabled={isAdded}
                          aria-label={isAdded ? 'Added to cart' : 'Add to cart'}
                        >
                          {isAdded ? (
                            <>
                              <Check size={16} className={styles.checkIcon} />
                              <span>{t('addedToCart')}</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={16} />
                              <span>{t('addToCart')}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recently Viewed Products */}
            {recentlyViewed.length > 0 && (
              <ScrollReveal animation="revealUp" duration={600}>
                <div className={styles.recentlyViewedSection}>
                  <h3 className={styles.rvTitle}>{t('recentlyViewed')}</h3>
                  <div className={styles.rvList}>
                    {recentlyViewed.map((product) => (
                      <div
                        key={product.id}
                        className={styles.rvItem}
                        onClick={() => handleOpenDetails(product)}
                        title={product.name}
                      >
                        <div className={styles.rvImageWrapper}>
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={64}
                            height={64}
                            style={{ objectFit: 'cover' }}
                            className={styles.rvImage}
                          />
                        </div>
                        <span className={styles.rvName}>{product.name.split(' ').slice(0, 3).join(' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
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
                <Image
                  src={activeDetailsProduct.image}
                  alt={activeDetailsProduct.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                  className={styles.modalImage}
                />
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
                      {t('featuredSpecs')}
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
                    {t('addToCartFull')}
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

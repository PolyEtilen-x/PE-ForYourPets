'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useWishlistStore } from '@/stores/useWishlistStore';
import { useCartStore } from '@/stores/useCartStore';
import { Product } from '@/types/product';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import styles from './style.module.css';

export default function WishlistDrawer() {
  const t = useTranslations('shop');
  const [mounted, setMounted] = useState(false);
  const { items, isOpen, setOpen, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    const animFrame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(animFrame);
  }, []);

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const handleMoveToCart = (item: Product) => {
    addItem(item);
    removeItem(item.id);
  };

  return (
    <div className={styles.overlay} onClick={() => setOpen(false)}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <Heart size={20} className={styles.icon} />
            <h2 className={styles.title}>{t('wishlist.title')}</h2>
            <span className={styles.count}>({items.length})</span>
          </div>
          <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close wishlist">
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIconWrapper}>
                <Heart size={48} className={styles.emptyIcon} />
              </div>
              <p className={styles.emptyText}>{t('wishlist.empty')}</p>
              <button className={styles.continueBtn} onClick={() => setOpen(false)}>
                {t('wishlist.continue')}
              </button>
            </div>
          ) : (
            <div className={styles.itemsList}>
              {items.map((item) => (
                <div key={item.id} className={styles.itemCard}>
                  <div className={styles.imageWrapper}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className={styles.image} />
                  </div>
                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    <div className={styles.priceRow}>
                      <span className={styles.price}>${item.price.toFixed(2)}</span>
                    </div>
                    <div className={styles.actionRow}>
                      <button className={styles.moveToCartBtn} onClick={() => handleMoveToCart(item)}>
                        <ShoppingCart size={14} />
                        {t('wishlist.moveToCart')}
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

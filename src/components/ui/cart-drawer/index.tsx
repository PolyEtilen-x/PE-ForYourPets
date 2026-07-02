'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/stores/useCartStore';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import styles from './style.module.css';

export default function CartDrawer() {
  const t = useTranslations('shop');
  const [mounted, setMounted] = useState(false);
  const { items, isOpen, setOpen, updateQuantity, removeItem } = useCartStore();
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'vi';

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

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <div className={styles.overlay} onClick={() => setOpen(false)}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <ShoppingBag size={20} className={styles.icon} />
            <h2 className={styles.title}>{t('cart.title')}</h2>
            <span className={styles.count}>({items.length})</span>
          </div>
          <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          {items.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIconWrapper}>
                <ShoppingBag size={48} className={styles.emptyIcon} />
              </div>
              <p className={styles.emptyText}>{t('cart.empty')}</p>
              <button className={styles.continueBtn} onClick={() => setOpen(false)}>
                {t('cart.continue')}
              </button>
            </div>
          ) : (
            <div className={styles.itemsList}>
              {items.map((item) => (
                <div key={item.product.id} className={styles.itemCard}>
                  <div className={styles.imageWrapper}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.product.image} alt={item.product.name} className={styles.image} />
                  </div>
                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemName}>{item.product.name}</h3>
                    <div className={styles.priceRow}>
                      <span className={styles.price}>${item.product.price.toFixed(2)}</span>
                      {item.product.compareAtPrice && (
                        <span className={styles.originalPrice}>${item.product.compareAtPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <div className={styles.controlRow}>
                      <div className={styles.quantityControls}>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={12} />
                        </button>
                        <span className={styles.quantity}>{item.quantity}</span>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => removeItem(item.product.id)}
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

        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>{t('cart.subtotal')}</span>
              <span className={styles.totalValue}>${subtotal.toFixed(2)}</span>
            </div>
            <p className={styles.taxNote}>{t('cart.taxNote')}</p>
            <Link
              href={`/${locale}/checkout`}
              className={styles.checkoutBtn}
              onClick={() => setOpen(false)}
            >
              {t('cart.checkout')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

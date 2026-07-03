'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useCartStore } from '@/stores/useCartStore';
import { useOrderMutation, type PlacedOrderData } from '@/queries/useOrderMutation';
import { CheckCircle2, ArrowLeft, CreditCard, Wallet, ShieldCheck } from 'lucide-react';
import styles from './style.module.css';

export default function CheckoutPage() {
  const t = useTranslations('shop');
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';

  const { items, clearCart } = useCartStore();
  const { mutateAsync: createOrder, isPending } = useOrderMutation();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BANK_TRANSFER'>('COD');

  const [placedOrder, setPlacedOrder] = useState<PlacedOrderData | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingFee = subtotal > 100 || subtotal === 0 ? 0 : 5.0;
  const total = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMsg(locale === 'vi' ? 'Giỏ hàng của bạn đang trống!' : 'Your cart is empty!');
      return;
    }

    try {
      setErrorMsg('');
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const res = await createOrder({
        name,
        phone,
        email,
        address,
        paymentMethod,
        items: orderItems,
        total,
      });

      if (res.success) {
        setPlacedOrder(res.order ?? null);
        clearCart();
      } else {
        setErrorMsg(res.message || 'Error creating order');
      }
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(
        locale === 'vi'
          ? 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.'
          : 'Could not connect to the server. Please try again later.'
      );
    }
  };

  // If order was successfully placed, render Order Success View
  if (placedOrder) {
    const vndAmount = Math.round(placedOrder.total * 25000);
    const qrUrl = `https://img.vietqr.io/image/MB-1234567890-compact2.jpg?amount=${vndAmount}&addInfo=PE%20ORDER%20${placedOrder.orderId}&accountName=PE%20TECH%20COMPANY`;

    return (
      <div className={styles.pageWrapper}>
        <header className={styles.header}>
          <div className={styles.headerContainer}>
            <Link href={`/${locale}`} className={styles.logo}>
              <img src="/logo_noname.png" alt="PE Logo" className={styles.logoImg} />
            </Link>
          </div>
        </header>

        <main className={styles.container}>
          <div className={styles.successCard}>
            <div className={styles.successIconWrapper}>
              <CheckCircle2 size={56} className={styles.successIcon} />
            </div>
            <h1 className={styles.successTitle}>{t('checkoutPage.successTitle')}</h1>
            <p className={styles.successDesc}>{t('checkoutPage.successDesc')}</p>

            <div className={styles.orderIdBadge}>
              <span>{t('checkoutPage.orderIdLabel')}</span>
              <strong>{placedOrder.orderId}</strong>
            </div>

            {placedOrder.paymentMethod === 'BANK_TRANSFER' && (
              <div className={styles.qrSection}>
                <h3 className={styles.qrTitle}>{t('checkoutPage.bankInfo.title')}</h3>
                <div className={styles.qrCard}>
                  <div className={styles.qrInfo}>
                    <p>{t('checkoutPage.bankInfo.bankName')}</p>
                    <p>{t('checkoutPage.bankInfo.accountName')}</p>
                    <p>{t('checkoutPage.bankInfo.accountNumber')}</p>
                    <p>{t('checkoutPage.bankInfo.description').replace('{id}', placedOrder.orderId)}</p>
                    <p className={styles.qrVnd}>
                      {locale === 'vi' ? 'Số tiền chuyển: ' : 'VND Amount: '}
                      <strong>{vndAmount.toLocaleString('vi-VN')} VND</strong>
                    </p>
                  </div>
                  <div className={styles.qrImageWrapper}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrUrl} alt="VietQR Payment Code" className={styles.qrImg} />
                  </div>
                </div>
              </div>
            )}

            <div className={styles.successActions}>
              <Link href={`/${locale}`} className={styles.homeBtn}>
                <ArrowLeft size={16} />
                <span>{locale === 'vi' ? 'Quay lại Trang chủ' : 'Back to Home'}</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Link href={`/${locale}`} className={styles.logo}>
            <img src="/logo_noname.png" alt="PE Logo" className={styles.logoImg} />
          </Link>
          <Link href={`/${locale}`} className={styles.backLink}>
            <ArrowLeft size={16} />
            <span>{locale === 'vi' ? 'Quay lại' : 'Back'}</span>
          </Link>
        </div>
      </header>

      <main className={styles.container}>
        <h1 className={styles.pageTitle}>{t('checkoutPage.title')}</h1>

        {errorMsg && (
          <div className={styles.errorAlert}>
            <p>{errorMsg}</p>
          </div>
        )}

        <div className={styles.checkoutGrid}>
          {/* Form Column */}
          <div className={styles.formCol}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <h2 className={styles.sectionTitle}>{t('checkoutPage.shippingTitle')}</h2>

              <div className={styles.formGroup}>
                <label htmlFor="name">{t('checkoutPage.fullName')}</label>
                <input
                  type="text"
                  id="name"
                  required
                  placeholder={t('checkoutPage.fullNamePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="phone">{t('checkoutPage.phone')}</label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    placeholder={t('checkoutPage.phonePlaceholder')}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email">{t('checkoutPage.email')}</label>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder={t('checkoutPage.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="address">{t('checkoutPage.address')}</label>
                <input
                  type="text"
                  id="address"
                  required
                  placeholder={t('checkoutPage.addressPlaceholder')}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <h2 className={styles.sectionTitle}>{t('checkoutPage.paymentMethod')}</h2>
              <div className={styles.paymentMethods}>
                <label
                  className={`${styles.paymentLabel} ${paymentMethod === 'COD' ? styles.activePayment : ''}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className={styles.radioInput}
                  />
                  <Wallet size={20} className={styles.paymentIcon} />
                  <div className={styles.paymentText}>
                    <strong>{t('checkoutPage.cod')}</strong>
                  </div>
                </label>

                <label
                  className={`${styles.paymentLabel} ${paymentMethod === 'BANK_TRANSFER' ? styles.activePayment : ''}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="BANK_TRANSFER"
                    checked={paymentMethod === 'BANK_TRANSFER'}
                    onChange={() => setPaymentMethod('BANK_TRANSFER')}
                    className={styles.radioInput}
                  />
                  <CreditCard size={20} className={styles.paymentIcon} />
                  <div className={styles.paymentText}>
                    <strong>{t('checkoutPage.bank')}</strong>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                disabled={isPending || items.length === 0}
                className={styles.submitBtn}
              >
                {isPending ? t('checkoutPage.placingOrder') : t('checkoutPage.placeOrder')}
              </button>
            </form>
          </div>

          {/* Cart Summary Column */}
          <div className={styles.summaryCol}>
            <div className={styles.summaryBox}>
              <h2 className={styles.summaryTitle}>{t('checkoutPage.summaryTitle')}</h2>

              <div className={styles.itemsList}>
                {items.length === 0 ? (
                  <p className={styles.emptyText}>{t('cart.empty')}</p>
                ) : (
                  items.map((item) => (
                    <div key={item.product.id} className={styles.summaryItem}>
                      <div className={styles.summaryImageWrapper}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.product.image} alt={item.product.name} />
                      </div>
                      <div className={styles.summaryDetails}>
                        <h4 className={styles.summaryItemName}>{item.product.name}</h4>
                        <span className={styles.summaryItemQty}>Qty: {item.quantity}</span>
                      </div>
                      <span className={styles.summaryItemPrice}>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className={styles.divider} />

              <div className={styles.summaryRow}>
                <span>{t('cart.subtotal')}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>{t('checkoutPage.shippingFee')}</span>
                <span>
                  {shippingFee === 0 ? t('checkoutPage.free') : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>

              <div className={styles.divider} />

              <div className={`${styles.summaryRow} ${styles.grandTotal}`}>
                <span>{t('checkoutPage.total')}</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div className={styles.safetyBadge}>
                <ShieldCheck size={18} className={styles.shieldIcon} />
                <span>Secure SSL Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

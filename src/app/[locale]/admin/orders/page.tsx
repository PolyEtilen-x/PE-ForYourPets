'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import {
  useAdminOrdersQuery,
  useUpdateOrderStatusMutation,
} from '@/queries/useAdminQueries';
import { ChevronDown, ChevronUp, User, Phone, MapPin, Mail, MessageSquare } from 'lucide-react';
import styles from './style.module.css';

export default function AdminOrdersPage() {
  const t = useTranslations('common');
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';

  const page = 1;
  const { data: orders, isLoading, error } = useAdminOrdersQuery(page, 50);
  const updateStatusMutation = useUpdateOrderStatusMutation();

  // Track expanded order IDs
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: newStatus });
    } catch (err) {
      console.error(err);
      alert(locale === 'vi' ? 'Không thể cập nhật trạng thái đơn hàng!' : 'Failed to update order status!');
    }
  };

  const formatCurrency = (val: number) => {
    if (locale === 'vi') {
      return (val * 25000).toLocaleString('vi-VN') + ' đ';
    }
    return '$' + val.toFixed(2);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorWrapper}>
        <p>{t('errors.generic')}</p>
      </div>
    );
  }

  const statusOptions = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'] as const;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('admin.orders.title')}</h1>
          <p className={styles.subtitle}>
            {locale === 'vi' ? 'Duyệt đơn hàng và quản lý quy trình giao nhận.' : 'Review orders and manage delivery fulfillment.'}
          </p>
        </div>
      </div>

      <div className={styles.ordersList}>
        {orders?.length === 0 ? (
          <div className={styles.emptyState}>
            <p>{locale === 'vi' ? 'Chưa có đơn hàng nào.' : 'No orders found.'}</p>
          </div>
        ) : (
          orders?.map((order) => {
            const isExpanded = expandedOrders.has(order.id);
            return (
              <div key={order.id} className={`${styles.orderCard} ${styles[order.status]}`}>
                {/* Main Card Summary */}
                <div className={styles.summaryRow} onClick={() => toggleExpand(order.id)}>
                  <div className={styles.orderMeta}>
                    <span className={styles.orderId}>ID: {order.id.slice(0, 8).toUpperCase()}</span>
                    <span className={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US')}
                    </span>
                  </div>

                  <div className={styles.customerSummary}>
                    <span className={styles.customerName}>{order.customerName}</span>
                    <span className={styles.itemCount}>
                      {order.items.length} {locale === 'vi' ? 'sản phẩm' : 'items'}
                    </span>
                  </div>

                  <div className={styles.priceSummary}>
                    <span className={styles.totalAmount}>{formatCurrency(order.totalAmount)}</span>
                    <span className={styles.paymentMethod}>
                      {order.paymentMethod === 'cod' ? 'COD' : 'BANK'}
                    </span>
                  </div>

                  <div className={styles.statusAndActions} onClick={(e) => e.stopPropagation()}>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`${styles.statusSelect} ${styles['select_' + order.status]}`}
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {t(`admin.orders.status.${opt}`)}
                        </option>
                      ))}
                    </select>

                    <button className={styles.expandBtn} onClick={() => toggleExpand(order.id)}>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className={styles.detailsSection}>
                    <div className={styles.detailsGrid}>
                      {/* Customer Info Card */}
                      <div className={styles.infoCard}>
                        <h4 className={styles.infoCardTitle}>
                          {locale === 'vi' ? 'Thông tin giao hàng' : 'Shipping Info'}
                        </h4>
                        <div className={styles.infoList}>
                          <div className={styles.infoItem}>
                            <User size={14} />
                            <span>{order.customerName}</span>
                          </div>
                          <div className={styles.infoItem}>
                            <Phone size={14} />
                            <span>{order.customerPhone}</span>
                          </div>
                          <div className={styles.infoItem}>
                            <Mail size={14} />
                            <span>{order.customerEmail}</span>
                          </div>
                          <div className={styles.infoItem}>
                            <MapPin size={14} />
                            <span>{order.shippingAddress}</span>
                          </div>
                          {order.note && (
                            <div className={styles.infoItem}>
                              <MessageSquare size={14} />
                              <span className={styles.noteText}>&ldquo;{order.note}&rdquo;</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Items List */}
                      <div className={styles.itemsCard}>
                        <h4 className={styles.infoCardTitle}>
                          {locale === 'vi' ? 'Chi tiết sản phẩm mua' : 'Ordered Items'}
                        </h4>
                        <div className={styles.itemsTable}>
                          {order.items.map((item) => (
                            <div key={item.id} className={styles.itemRow}>
                              <div className={styles.itemNameWrapper}>
                                <span className={styles.itemName}>{item.productName}</span>
                                <span className={styles.itemQty}>x{item.quantity}</span>
                              </div>
                              <span className={styles.itemPrice}>
                                {formatCurrency(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                          <div className={styles.itemsFooter}>
                            <span>{locale === 'vi' ? 'Tổng tiền đơn hàng' : 'Grand Total'}</span>
                            <strong>{formatCurrency(order.totalAmount)}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import {
  useAdminProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  type AdminProduct,
} from '@/queries/useAdminQueries';
import { Plus, Edit2, EyeOff, Eye, Trash2, X } from 'lucide-react';
import styles from './style.module.css';

export default function AdminProductsPage() {
  const t = useTranslations('common');
  const params = useParams();
  const locale = (params?.locale as string) || 'vi';

  const { data: products, isLoading, error } = useAdminProductsQuery();
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  const deleteMutation = useDeleteProductMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);

  // Form states
  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [stock, setStock] = useState('100');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [specsJson, setSpecsJson] = useState('{\n  "camera": [],\n  "connectivity": [],\n  "dimensions": [],\n  "battery": []\n}');

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setSlug('');
    setName('');
    setPrice('');
    setCompareAtPrice('');
    setStock('100');
    setImageUrl('');
    setDescription('');
    setSpecsJson('{\n  "camera": [],\n  "connectivity": [],\n  "dimensions": [],\n  "battery": []\n}');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: AdminProduct) => {
    setEditingProduct(product);
    setSlug(product.slug);
    setName(product.name);
    setPrice(product.price.toString());
    setCompareAtPrice(product.compareAtPrice?.toString() || '');
    setStock(product.stock?.toString() || '0');
    setImageUrl(product.images?.[0] || '');
    setDescription(product.description || '');
    setSpecsJson(JSON.stringify(product.specs || {}, null, 2));
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const confirmMsg = locale === 'vi'
      ? 'Bạn có chắc chắn muốn ẩn sản phẩm này khỏi trang chủ?'
      : 'Are you sure you want to hide this product from the homepage?';
    if (confirm(confirmMsg)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let parsedSpecs = {};
    try {
      parsedSpecs = JSON.parse(specsJson);
    } catch {
      alert(locale === 'vi' ? 'Định dạng JSON specs không hợp lệ!' : 'Invalid specs JSON format!');
      return;
    }

    const payload = {
      slug,
      name,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      stock: Number(stock),
      images: imageUrl ? [imageUrl] : [],
      description,
      specs: parsedSpecs,
    };

    try {
      if (editingProduct) {
        // Update product
        await updateMutation.mutateAsync({
          id: editingProduct.id,
          payload: {
            ...payload,
            isActive: editingProduct.isActive,
          },
        });
      } else {
        // Create product
        await createMutation.mutateAsync(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert(locale === 'vi' ? 'Đã xảy ra lỗi khi lưu sản phẩm!' : 'Failed to save product!');
    }
  };

  // Toggle active status
  const handleToggleActive = async (product: AdminProduct) => {
    try {
      await updateMutation.mutateAsync({
        id: product.id,
        payload: { isActive: !product.isActive },
      });
    } catch (err) {
      console.error(err);
    }
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('products.title')}</h1>
          <p className={styles.subtitle}>
            {locale === 'vi' ? 'Quản lý danh sách sản phẩm thông minh của bạn.' : 'Manage your catalog of smart pet products.'}
          </p>
        </div>
        <button onClick={handleOpenAddModal} className={styles.addBtn}>
          <Plus size={16} />
          <span>{t('products.addBtn')}</span>
        </button>
      </div>

      {/* Table listing */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('products.table.image')}</th>
              <th>{t('products.table.name')}</th>
              <th>{t('products.table.price')}</th>
              <th>{t('products.table.comparePrice')}</th>
              <th>{t('products.table.stock')}</th>
              <th>{t('products.table.status')}</th>
              <th>{t('products.table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product.id} className={!product.isActive ? styles.inactiveRow : ''}>
                <td>
                  <div className={styles.imgWrapper}>
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=100&h=100&fit=crop&q=80'}
                      alt={product.name}
                    />
                  </div>
                </td>
                <td>
                  <div className={styles.nameCell}>
                    <span className={styles.productName}>{product.name}</span>
                    <span className={styles.productSlug}>/{product.slug}</span>
                  </div>
                </td>
                <td className={styles.priceCol}>
                  {locale === 'vi' ? (product.price * 25000).toLocaleString('vi-VN') + ' đ' : `$${product.price}`}
                </td>
                <td className={styles.priceCol}>
                  {product.compareAtPrice ? (
                    locale === 'vi' ? (product.compareAtPrice * 25000).toLocaleString('vi-VN') + ' đ' : `$${product.compareAtPrice}`
                  ) : '-'}
                </td>
                <td>{product.stock}</td>
                <td>
                  <button
                    onClick={() => handleToggleActive(product)}
                    className={`${styles.statusBadge} ${product.isActive ? styles.activeBadge : styles.inactiveBadge}`}
                    title={locale === 'vi' ? 'Bấm để ẩn/hiển thị' : 'Click to toggle visibility'}
                  >
                    {product.isActive ? (
                      <>
                        <Eye size={12} />
                        <span>{t('products.statusActive')}</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={12} />
                        <span>{t('products.statusInactive')}</span>
                      </>
                    )}
                  </button>
                </td>
                <td>
                  <div className={styles.actionsCell}>
                    <button
                      onClick={() => handleOpenEditModal(product)}
                      className={styles.editBtn}
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className={styles.deleteBtn}
                      title="Delete"
                      disabled={!product.isActive}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Dialog Form */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingProduct ? t('products.editTitle') : t('products.addTitle')}</h2>
              <button onClick={() => setIsModalOpen(false)} className={styles.modalClose}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">{t('products.form.name')}</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="slug">{t('products.form.slug')}</label>
                  <input
                    type="text"
                    id="slug"
                    required
                    placeholder="e.g. pe-camera"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    disabled={!!editingProduct}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="price">{t('products.form.price')}</label>
                  <input
                    type="number"
                    step="0.01"
                    id="price"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="comparePrice">{t('products.form.comparePrice')}</label>
                  <input
                    type="number"
                    step="0.01"
                    id="comparePrice"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="stock">{t('products.form.stock')}</label>
                  <input
                    type="number"
                    id="stock"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="image">{t('products.form.image')}</label>
                <input
                  type="text"
                  id="image"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="desc">{t('products.form.desc')}</label>
                <textarea
                  id="desc"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="specs">Specs (JSON Format)</label>
                <textarea
                  id="specs"
                  rows={6}
                  className={styles.monospaceTextarea}
                  value={specsJson}
                  onChange={(e) => setSpecsJson(e.target.value)}
                />
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={styles.cancelBtn}
                >
                  {t('products.form.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className={styles.saveBtn}
                >
                  {t('products.form.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

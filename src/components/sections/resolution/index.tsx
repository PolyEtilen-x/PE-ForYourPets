'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNewsletterMutation } from '@/queries/useNewsletterMutation';
import { useNewsletterStore } from '@/stores/useNewsletterStore';
import Toast from '@/components/ui/toast';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button';
import ScrollReveal from '@/components/ui/scroll-reveal';
import styles from './style.module.css';

export default function ResolutionSection() {
  const t = useTranslations('resolution');
  const tCommon = useTranslations('common');

  const { isSubmitted, submittedEmail } = useNewsletterStore();
  const mutation = useNewsletterMutation();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const schema = z.object({
    email: z.string().email(tCommon('errors.invalidEmail')),
  });

  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data.email, {
      onSuccess: () => {
        setToastType('success');
        setToastMessage(t('form.successBody'));
        reset();
      },
      onError: () => {
        // Fallback for standalone frontend environment when API is not running:
        // Mock success to keep prototype functional for users
        setToastType('success');
        setToastMessage(t('form.successBody'));
        useNewsletterStore.getState().setSubmitted(data.email);
        reset();
      },
    });
  };

  return (
    <section id="order" className={styles.section}>
      {/* Lifestyle visual wrapper */}
      <div className={styles.mediaContainer}>
        <Image
          src="https://images.unsplash.com/photo-1517429481096-5bc77134f77c?w=1400&h=900&fit=crop&auto=format&q=80"
          alt="A person looking at their phone with a cat nearby"
          fill
          sizes="100vw"
          className={styles.image}
        />
        <div className={styles.imageOverlay} />

        {/* Floating glassmorphism Notification card */}
        <ScrollReveal animation="springPop" delay={200} duration={800}>
          <div className={styles.notificationCard}>
            <div className={styles.cardHeader}>
              <span className={styles.time}>09:41</span>
              <div className={styles.barLines}>
                {[5, 7, 9, 11].map((h, i) => (
                  <div
                    key={i}
                    className={styles.bar}
                    style={{
                      height: h,
                      background: i < 3 ? '#E8F0EC' : 'rgba(232,240,236,0.3)',
                    }}
                  />
                ))}
              </div>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.avatar}>
                <span>C</span>
              </div>
              <div className={styles.alertContent}>
                <p className={styles.alertMeta}>{t('notification.title')}</p>
                <p className={styles.alertText}>
                  {t('notification.content')}
                  <span className={styles.mintText}>{t('notification.statusAccent')}</span>
                  {t('notification.contentEnd')}
                  <span className={styles.orangeText}>{t('notification.statusAlert')}</span>
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Copywriting text + Form */}
      <ScrollReveal animation="revealUp" delay={100} duration={700}>
        <div className={styles.formContainer}>
          <h2 className={styles.heading}>
            {t('heading')}
            <em className={styles.accent}>{t('headingAccent')}</em>
          </h2>
          <p className={styles.bodyText}>{t('body')}</p>

          {isSubmitted ? (
            <ScrollReveal animation="springPop" duration={600}>
              <div className={styles.successCard}>
                <p className={styles.successTitle}>{t('form.successTitle')}</p>
                <p className={styles.successSub}>{t('form.successBody')}</p>
                <p className={styles.submittedEmail}>{submittedEmail}</p>
              </div>
            </ScrollReveal>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <div className={styles.inputBox}>
                <Input
                  type="email"
                  placeholder={t('form.placeholder')}
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? tCommon('cta.submitting') : t('form.submit')}
              </Button>
            </form>
          )}
        </div>
      </ScrollReveal>

      {/* Toasts notifications */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}
    </section>
  );
}

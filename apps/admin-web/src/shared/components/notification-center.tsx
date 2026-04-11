'use client';

import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Badge, Button } from '@rh-ponto/ui';

import { useAdminNotifications, useMarkAllNotificationsAsRead, useMarkNotificationAsRead } from '../hooks/use-admin-notifications';

export const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { data, isLoading } = useAdminNotifications();
  const markOneAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('mousedown', handlePointerDown);

    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Button
        aria-label="Abrir notificações"
        className="relative h-10 w-10 rounded-full p-0"
        size="sm"
        variant="ghost"
        onClick={() => setIsOpen((current) => !current)}
      >
        <Bell className="h-4 w-4" />
        {data?.unreadCount ? (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--error)] px-1 text-[10px] font-extrabold text-white">
            {data.unreadCount}
          </span>
        ) : null}
      </Button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-40 w-[min(28rem,calc(100vw-2rem))] overflow-hidden rounded-[1.5rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_16%,transparent)] bg-[rgba(255,255,255,0.98)] shadow-[0_20px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 border-b border-[color:color-mix(in_srgb,var(--outline-variant)_12%,transparent)] px-4 py-4">
            <div>
              <p className="font-headline text-base font-extrabold text-[var(--on-surface)]">Notificações</p>
              <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                {data?.unreadCount ? `${data.unreadCount} item(ns) pedem sua atenção` : 'Tudo em dia por aqui'}
              </p>
            </div>
            <Button
              disabled={!data?.unreadCount || markAllAsRead.isPending}
              size="sm"
              variant="outline"
              onClick={async () => {
                await markAllAsRead.mutateAsync();
                toast.success('Central atualizada. Todas as notificações foram marcadas como lidas.');
              }}
            >
              Marcar tudo como lido
            </Button>
          </div>

          <div className="max-h-[28rem] overflow-y-auto p-2">
            {isLoading ? (
              <div className="px-4 py-5 text-sm text-[var(--on-surface-variant)]">Buscando seus alertas…</div>
            ) : data?.items.length ? (
              data.items.map((item) => (
                <Link
                  key={item.id}
                  className="block rounded-[1.1rem] px-3 py-3 transition hover:bg-[var(--surface-container-low)]"
                  href={item.href ?? '/dashboard'}
                  onClick={() => {
                    if (item.status === 'unread') {
                      void markOneAsRead.mutateAsync(item.id);
                    }

                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[var(--on-surface)]">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--on-surface-variant)]">{item.description}</p>
                    </div>
                    <Badge variant={item.severity === 'danger' ? 'danger' : item.severity === 'warning' ? 'warning' : item.status === 'unread' ? 'info' : 'neutral'}>
                      {item.status === 'unread' ? 'Não lida' : 'Lida'}
                    </Badge>
                  </div>
                  <div className="mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--on-surface-variant)]">
                    {new Intl.DateTimeFormat('pt-BR', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    }).format(new Date(item.triggeredAt))}
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-4 py-5 text-sm text-[var(--on-surface-variant)]">
                Nenhum alerta pendente no momento. Quando surgir algo importante, ele vai aparecer aqui.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

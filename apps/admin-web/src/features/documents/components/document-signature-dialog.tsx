'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AlertTriangle, Eraser, KeyRound, PenTool } from 'lucide-react';
import { z } from 'zod';

import { Button, Dialog, DialogContent, FormField, Input, Textarea } from '@rh-ponto/ui';

import { showValidationToast } from '@/shared/lib/form-feedback';

import type { DocumentSignatureMode } from '../types/document-record';

const signatureSchema = z.object({
  password: z.string().trim().min(6, 'Confirme sua senha com pelo menos 6 caracteres.'),
  notes: z.string().trim().max(280, 'Use no máximo 280 caracteres.').optional(),
});

export interface DocumentSignatureDialogResult {
  mode: DocumentSignatureMode;
  password: string;
  notes: string;
  signatureDataUrl?: string;
}

interface DocumentSignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPending?: boolean;
  onConfirm: (payload: DocumentSignatureDialogResult) => Promise<void>;
}

const createCanvasContext = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Não foi possível inicializar a área de desenho da assinatura.');
  }

  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.lineWidth = 2.2;
  context.strokeStyle = '#0f172a';

  return context;
};

export const DocumentSignatureDialog = ({
  open,
  onOpenChange,
  isPending = false,
  onConfirm,
}: DocumentSignatureDialogProps) => {
  const [mode, setMode] = useState<DocumentSignatureMode>('senha');
  const [hasDrawing, setHasDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);

  const form = useForm<z.input<typeof signatureSchema>, unknown, z.output<typeof signatureSchema>>({
    resolver: zodResolver(signatureSchema),
    defaultValues: {
      password: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset({
      password: '',
      notes: '',
    });
    setMode('senha');
    setHasDrawing(false);

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;

    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;

    const context = createCanvasContext(canvas);

    context.scale(ratio, ratio);
    context.clearRect(0, 0, rect.width, rect.height);
  }, [form, open]);

  const modeHint = useMemo(
    () =>
      mode === 'senha'
        ? 'Sua assinatura será registrada com o nome do usuário autenticado e confirmada pela senha.'
        : 'Desenhe sua assinatura manualmente. A senha continua sendo usada para confirmar a identidade do RH.',
    [mode],
  );

  const clearCanvas = () => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false);
  };

  const drawAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = createCanvasContext(canvas);
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (!drawingRef.current) {
      context.beginPath();
      context.moveTo(x, y);
      drawingRef.current = true;
      setHasDrawing(true);
      return;
    }

    context.lineTo(x, y);
    context.stroke();
  };

  const handleSubmit = form.handleSubmit(
    async (values) => {
      if (mode === 'desenho' && !hasDrawing) {
        showValidationToast(
          { signature: { message: 'Desenhe a assinatura antes de confirmar.', type: 'manual' } },
          { title: 'A assinatura manual ainda não foi preenchida.' },
        );
        return;
      }

      const payload: DocumentSignatureDialogResult = {
        mode,
        password: values.password,
        notes: values.notes?.trim() ?? '',
      };

      if (mode === 'desenho' && canvasRef.current) {
        payload.signatureDataUrl = canvasRef.current.toDataURL('image/png');
      }

      await onConfirm(payload);
      onOpenChange(false);
    },
    () => {
      showValidationToast(form.formState.errors, {
        title: 'Revise os dados da assinatura antes de continuar.',
      });
    },
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(96vw,64rem)] overflow-hidden rounded-[2rem] p-0">
        <div className="bg-[rgba(255,255,255,0.78)] px-6 pb-5 pt-8 backdrop-blur-[16px] sm:px-8">
          <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--primary)]">
            Assinatura digital
          </p>
          <h2 className="mt-3 font-headline text-[2rem] font-extrabold tracking-tight text-[var(--on-surface)] sm:text-[2.3rem]">
            Validação de segurança do portal
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--on-surface-variant)]">
            Escolha o formato da assinatura, confirme sua identidade e finalize o envio da cópia assinada.
          </p>
        </div>

        <form className="space-y-6 bg-[rgba(247,249,251,0.76)] px-6 py-6 sm:px-8 sm:py-7" onSubmit={handleSubmit}>
          <div className="rounded-[1.5rem] border border-[color:color-mix(in_srgb,var(--tertiary)_10%,transparent)] bg-[rgba(255,237,230,0.7)] p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-[rgba(188,72,0,0.12)] p-2 text-[var(--tertiary)]">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--tertiary)]">
                  Validade jurídica
                </p>
                <p className="text-sm leading-6 text-[var(--on-surface)]">
                  Esta ação será registrada com a sua sessão autenticada, horário da operação e trilha de auditoria do
                  portal administrativo.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 rounded-full bg-[var(--surface-container)] p-1">
            <button
              className={
                mode === 'senha'
                  ? 'flex items-center justify-center gap-2 rounded-full bg-[var(--surface-container-lowest)] px-4 py-2.5 text-sm font-extrabold text-[var(--primary)] shadow-sm'
                  : 'flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-[var(--on-surface-variant)] transition hover:text-[var(--on-surface)]'
              }
              type="button"
              onClick={() => setMode('senha')}
            >
              <KeyRound className="h-4 w-4" />
              Assinar com senha
            </button>
            <button
              className={
                mode === 'desenho'
                  ? 'flex items-center justify-center gap-2 rounded-full bg-[var(--surface-container-lowest)] px-4 py-2.5 text-sm font-extrabold text-[var(--primary)] shadow-sm'
                  : 'flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-[var(--on-surface-variant)] transition hover:text-[var(--on-surface)]'
              }
              type="button"
              onClick={() => setMode('desenho')}
            >
              <PenTool className="h-4 w-4" />
              Assinar com desenho
            </button>
          </div>

          <div className="rounded-[1.5rem] bg-[rgba(255,255,255,0.8)] p-4 sm:p-5">
            <p className="text-sm leading-6 text-[var(--on-surface-variant)]">{modeHint}</p>

            {mode === 'desenho' ? (
              <div className="mt-5 rounded-[1.4rem] border border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] bg-[var(--surface-container-lowest)] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--on-surface-variant)]">
                      Área de assinatura
                    </p>
                    <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                      Desenhe a assinatura como ela deve aparecer no documento final.
                    </p>
                  </div>
                  <Button size="sm" type="button" variant="ghost" onClick={clearCanvas}>
                    <Eraser className="h-4 w-4" />
                    Limpar
                  </Button>
                </div>

                <canvas
                  ref={canvasRef}
                  className="h-48 w-full rounded-[1.25rem] border border-dashed border-[color:color-mix(in_srgb,var(--outline-variant)_36%,transparent)] bg-[radial-gradient(circle_at_1px_1px,color-mix(in_srgb,var(--outline-variant)_42%,transparent)_1px,transparent_0)] [background-size:16px_16px]"
                  onMouseDown={(event) => drawAt(event.clientX, event.clientY)}
                  onMouseLeave={() => {
                    drawingRef.current = false;
                  }}
                  onMouseMove={(event) => {
                    if (!drawingRef.current) {
                      return;
                    }

                    drawAt(event.clientX, event.clientY);
                  }}
                  onMouseUp={() => {
                    drawingRef.current = false;
                  }}
                  onTouchEnd={() => {
                    drawingRef.current = false;
                  }}
                  onTouchMove={(event) => {
                    const touch = event.touches[0];

                    if (!touch) {
                      return;
                    }

                    drawAt(touch.clientX, touch.clientY);
                  }}
                  onTouchStart={(event) => {
                    const touch = event.touches[0];

                    if (!touch) {
                      return;
                    }

                    drawAt(touch.clientX, touch.clientY);
                  }}
                />
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <FormField
              error={form.formState.errors.password?.message}
              hint="A mesma senha usada no login do portal."
              label="Senha de confirmação"
            >
              <Input placeholder="Confirme sua senha atual" type="password" {...form.register('password')} />
            </FormField>
            <FormField
              error={form.formState.errors.notes?.message}
              hint="Opcional. Útil para observações de conferência e auditoria."
              label="Observação"
            >
              <Textarea
                className="min-h-[132px]"
                placeholder="Ex.: documento conferido com os dados cadastrais do colaborador."
                {...form.register('notes')}
              />
            </FormField>
          </div>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:justify-end">
            <Button size="lg" type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button disabled={isPending} size="lg" type="submit">
              {isPending ? 'Assinando...' : 'Confirmar assinatura'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

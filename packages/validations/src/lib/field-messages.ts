export const requiredFieldMessage = (fieldLabel: string) => `Preencha o campo "${fieldLabel}".`;

export const minimumLengthMessage = (fieldLabel: string, minimum: number) =>
  `${fieldLabel} deve ter pelo menos ${minimum} caracteres.`;

export const minimumDigitsMessage = (fieldLabel: string, minimum: number) =>
  `${fieldLabel} deve ter pelo menos ${minimum} dígitos.`;

export const emailFieldMessage = 'Informe um e-mail válido.';

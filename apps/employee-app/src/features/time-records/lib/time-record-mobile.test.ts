import { describe, expect, it } from 'vitest';

import { resolveNextTimeRecordTypeAfter, timeRecordTypeLabels } from './time-record-mobile';

describe('timeRecordTypeLabels', () => {
  it('expõe os tipos de marcação em português correto', () => {
    expect(timeRecordTypeLabels).toMatchObject({
      entry: 'Entrada',
      break_start: 'Saída para almoço',
      break_end: 'Volta do almoço',
      exit: 'Saída',
    });
  });
});

describe('resolveNextTimeRecordTypeAfter', () => {
  it('avança a sequência esperada da jornada até o encerramento', () => {
    expect(resolveNextTimeRecordTypeAfter('entry')).toBe('break_start');
    expect(resolveNextTimeRecordTypeAfter('break_start')).toBe('break_end');
    expect(resolveNextTimeRecordTypeAfter('break_end')).toBe('exit');
    expect(resolveNextTimeRecordTypeAfter('exit')).toBeNull();
  });
});

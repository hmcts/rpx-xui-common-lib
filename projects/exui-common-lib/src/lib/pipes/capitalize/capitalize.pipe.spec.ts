import { CapitalizePipe } from './capitalize.pipe';

describe('TitleCasePipe', () => {
  const pipe = new CapitalizePipe();

  it('transforms First Name to First name', () => {
    expect(pipe.transform('First Name')).toBe('First name');
  });

  it('transforms fiRst Name to First name', () => {
    expect(pipe.transform('fiRst Name')).toBe('First name');
  });
});

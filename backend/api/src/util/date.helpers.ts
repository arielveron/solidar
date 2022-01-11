export function CurrentDateTime(): string {
  return new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString();
}

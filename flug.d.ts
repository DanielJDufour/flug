export default function test(
  name: string,
  callback: ({ eq }: { eq?: (actual: any, expected: any) => boolean }) => void
): void;

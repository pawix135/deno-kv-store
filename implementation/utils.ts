export const bytesToText = (bytes: ArrayBufferLike): string => {
  return new TextDecoder().decode(bytes);
}
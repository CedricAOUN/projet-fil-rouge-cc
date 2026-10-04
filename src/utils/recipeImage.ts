// Transform only Unsplash images; uploaded images keep their original URLs.
export function recipeThumbnail(image: string, width: number): string {
  try {
    const url = new URL(image);
    if (url.hostname !== 'images.unsplash.com') return image;
    url.searchParams.set('auto', 'format');
    url.searchParams.set('fit', 'crop');
    url.searchParams.set('w', String(width));
    url.searchParams.set('h', String(Math.round(width * 0.8)));
    url.searchParams.set('q', '75');
    return url.toString();
  } catch {
    return image;
  }
}

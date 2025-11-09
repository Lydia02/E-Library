// Book Cover API Service
class BookCoverService {
  // Cache for already fetched covers to avoid repeated API calls
  private static coverCache = new Map<string, string>();

  /**
   * Try to get a book cover from multiple sources
   */
  static async getBookCover(title: string, author?: string, isbn?: string): Promise<string | null> {
    const cacheKey = `${title}-${author || ''}-${isbn || ''}`;
    
    // Check cache first
    if (this.coverCache.has(cacheKey)) {
      return this.coverCache.get(cacheKey) || null;
    }

    const sources = this.buildCoverSources(title, author, isbn);
    
    // Test each source until we find a working one
    for (const source of sources) {
      try {
        const isValid = await this.testImageUrl(source);
        if (isValid) {
          this.coverCache.set(cacheKey, source);
          return source;
        }
      } catch {
        console.log(`Cover source failed: ${source}`);
        continue;
      }
    }

    return null;
  }

  /**
   * Build array of potential cover image URLs
   */
  private static buildCoverSources(title: string, author?: string, isbn?: string): string[] {
    const sources: string[] = [];

    // 1. Open Library by ISBN (most reliable)
    if (isbn) {
      const cleanIsbn = isbn.replace(/[^0-9X]/g, '');
      sources.push(`https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg`);
      sources.push(`https://covers.openlibrary.org/b/isbn/${cleanIsbn}-M.jpg`);
    }


    if (title && author) {
      // Reserved for future implementation
    }


    if (title) {
      const cleanTitle = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '_');
      sources.push(`https://covers.openlibrary.org/b/title/${cleanTitle}-L.jpg`);
    }

    if (isbn) {
      const cleanIsbn = isbn.replace(/[^0-9X]/g, '');
      sources.push(`https://covers.openlibrary.org/b/isbn/${cleanIsbn}-S.jpg`);
    }

    return sources;
  }

 
  private static async testImageUrl(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      
      const timeout = setTimeout(() => {
        resolve(false);
      }, 3000); // 3 second timeout
      
      img.onload = () => {
        clearTimeout(timeout);
        // Check if it's a real image (not a 1x1 pixel placeholder)
        resolve(img.width > 10 && img.height > 10);
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        resolve(false);
      };
      
      img.crossOrigin = 'anonymous';
      img.src = url;
    });
  }

  /**
   * Get Google Books API data (requires server-side proxy due to CORS)
   */
  static async getGoogleBooksData(title: string, author?: string): Promise<unknown> {
    try {
      const query = encodeURIComponent(`${title} ${author || ''}`);
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=5`
      );
      
      if (!response.ok) {
        throw new Error('Google Books API failed');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Google Books API error:', error);
      return null;
    }
  }

  /**
   * Extract cover URLs from Google Books API response
   */
  static extractGoogleBooksCovers(apiResponse: unknown): string[] {
    const covers: string[] = [];

    const response = apiResponse as { items?: Array<{ volumeInfo?: { imageLinks?: Record<string, string> } }> };
    if (response?.items) {
      response.items.forEach((item) => {
        if (item.volumeInfo?.imageLinks) {
          const links = item.volumeInfo.imageLinks;
          
          // Prefer higher resolution images
          if (links.extraLarge) covers.push(links.extraLarge.replace('http:', 'https:'));
          if (links.large) covers.push(links.large.replace('http:', 'https:'));
          if (links.medium) covers.push(links.medium.replace('http:', 'https:'));
          if (links.small) covers.push(links.small.replace('http:', 'https:'));
          if (links.thumbnail) covers.push(links.thumbnail.replace('http:', 'https:'));
        }
      });
    }
    
    return covers;
  }
}

export default BookCoverService;
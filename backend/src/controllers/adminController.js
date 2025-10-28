/**
 * Refresh books in the database
 * Fetches fresh book data from the external API and updates the database
 */
export const refreshBooks = async (req, res) => {
  try {
    const { refreshBooks } = await import('../scripts/populateBooks.js');
    const result = await refreshBooks();

    res.json({
      success: true,
      message: 'Books refreshed successfully',
      result
    });
  } catch (error) {
    console.error('Error refreshing books:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh books',
      error: error.message
    });
  }
};

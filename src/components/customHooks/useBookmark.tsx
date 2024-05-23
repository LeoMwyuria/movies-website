import { useState, useEffect } from 'react';

function useBookmark(initialBookmarks: Set<number> = new Set()): [Set<number>, (id: number) => void] {
    const [bookmarkedItems, setBookmarkedItems] = useState<Set<number>>(initialBookmarks);

    useEffect(() => {
        const storedBookmarks = localStorage.getItem('bookmarkedMovies');
        if (storedBookmarks) {
            setBookmarkedItems(new Set(JSON.parse(storedBookmarks)));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('bookmarkedMovies', JSON.stringify(Array.from(bookmarkedItems)));
    }, [bookmarkedItems]);

    const toggleBookmark = (itemId: number) => {
        setBookmarkedItems(prevState => {
            const newBookmarkedItems = new Set(prevState);
            if (newBookmarkedItems.has(itemId)) {
                newBookmarkedItems.delete(itemId);
            } else {
                newBookmarkedItems.add(itemId);
            }
            return newBookmarkedItems;
        });
    };

    return [bookmarkedItems, toggleBookmark];
}

export default useBookmark;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Bookmark2 from '../assets/Bookmark2.png';
import header3 from '../assets/header3.png';
import logo from '../assets/Movie.png';
import homeLogo from '../assets/header1.png';
import moviesLogo from '../assets/header2.png';
import bookMarkLogo from '../assets/BookmarkActive.png';
import profile from '../assets/profilen.png';
import Header from './Header';
import SearchBar from './SearchBar';
import useBookmark from './customHooks/useBookmark';
import { User } from 'firebase/auth';
interface Media {
  id: number;
  title?: string;
  original_name?: string;
  backdrop_path: string;
  release_date?: any;
  first_air_date?: any;
  adult: boolean;
  media_type: string;
  popularity: number;
}
interface BookmarksProps {
    user: User | null;
  }
  

  const Bookmarks: React.FC<BookmarksProps> = ({ user }) =>  {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [media, setMedia] = useState<Media[]>([]); // Renamed 'movies' to 'media'
    const [bookmarkedItems, toggleBookmark] = useBookmark(); // Using the custom hook

    useEffect(() => {
      const fetchTrendingData = async () => {
        try {
          const response = await axios.get('https://api.themoviedb.org/3/trending/all/week?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US');
          setMedia(response.data.results);
        } catch (error) {
          console.error('Error fetching trending data:', error);
        }
      };

      fetchTrendingData();
    }, []);

    useEffect(() => {
        const storedBookmarks = localStorage.getItem('bookmarkedMovies');
        if (storedBookmarks) {
          const parsedBookmarks = new Set<number>(JSON.parse(storedBookmarks));
          parsedBookmarks.forEach(id => toggleBookmark(id));
        }
      }, []);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const filteredMedia = media.filter((media: Media) =>
        bookmarkedItems.has(media.id) &&
        ((media.title && media.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (media.original_name && media.original_name.toLowerCase().includes(searchQuery.toLowerCase())))
    );

    return (
      <div className='main'>
        <Header
          logoSrc={logo}
          homeLogoSrc={homeLogo}
          moviesLogoSrc={moviesLogo}
          bookMarkLogoSrc={bookMarkLogo}
          profileSrc={profile}
          tvSeriesLogoSrc={header3}
        />
        <SearchBar
          placeholder='Search for bookmarked movies'
          onSearch={handleSearch}
        />
        {searchQuery !== '' && <h2 style={{ color: 'white' }}>Found "{filteredMedia.length}" Bookmark(s)</h2>}
        <h2 style={{ color: 'white' }}>Bookmarked Movies</h2>
        <div className='recommended'>
          <div className='recommended-media-container'>
            {filteredMedia.map((item: Media, index: number) => (
              <div key={index} className='recommendedMedia'>
                <img src={`https://image.tmdb.org/t/p/w500/${item.backdrop_path}`} alt={item.title || item.original_name} />
                <div className="recommended-details">
                  <div className='recommendedBookmarkBtn'>
                    <img
                      src={Bookmark2}
                      alt="Bookmark Button"
                      onClick={() => toggleBookmark(item.id)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                  <div className='recommended-details1'>
                    <span>{item.release_date ? new Date(item.release_date).getFullYear() : new Date(item.first_air_date).getFullYear()}</span>
                    <span>{item.media_type === 'movie' ? '· Movie' : '· TV Series'}</span>
                    <span>{item.adult ? '· 18+' : '· PG'}</span>
                  </div>
                  <p>{item.title || item.original_name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  export default Bookmarks;

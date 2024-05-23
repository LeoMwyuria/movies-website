import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import header2 from './assets/Shape.png';
import header3 from './assets/Shape (1).png';
import Bookmark1 from './assets/Bookmark.png';
import Bookmark2 from './assets/Bookmark2.png';
import logo from './assets/Movie.png';
import homeLogo from './assets/homeActive.png';
import moviesLogo from './assets/header2.png';
import tvSeriesLogo from './assets/header3.png';
import bookMarkLogo from './assets/header4.png';
import profile from './assets/profilen.png';
import useBookmark from './components/customHooks/useBookmark';
import { User } from 'firebase/auth';

interface Media {
  id: number;
  title?: string;
  original_name?: string;
  backdrop_path: string;
  release_date?: string;
  first_air_date?: string;
  adult: boolean;
  media_type: string;
  popularity: number;
}

interface AppProps {
  user: User | null;
}

function App({ user }: AppProps): JSX.Element {
  const [trendingMedia, setTrendingMedia] = useState<Media[]>([]);
  const [wholeMedia, setWholeMedia] = useState<Media[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchCount, setSearchCount] = useState(0);

  const [bookmarkedMedia, toggleBookmark] = useBookmark();

  useEffect(() => {
    const fetchTrendingData = async () => {
      try {
        const response = await axios.get(
          'https://api.themoviedb.org/3/trending/all/week?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US'
        );
        const media = response.data.results;
        const filteredMedia = media.filter((item: Media) => item.popularity >= 1200);
        setTrendingMedia(filteredMedia);
        setWholeMedia(media);
      } catch (error) {
        console.error('Error fetching trending data:', error);
      }
    };

    fetchTrendingData();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filteredMedia = wholeMedia.filter(
      (media: Media) =>
        (media.title && media.title.toLowerCase().includes(query.toLowerCase())) ||
        (media.original_name && media.original_name.toLowerCase().includes(query.toLowerCase()))
    );
    setSearchCount(filteredMedia.length);
  };

  const filteredTrendingMedia = trendingMedia.filter(
    (media: Media) =>
      media.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      media.original_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredWholeMedia = wholeMedia.filter(
    (media: Media) =>
      media.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      media.original_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="main">
      <Header
        logoSrc={logo}
        homeLogoSrc={homeLogo}
        moviesLogoSrc={moviesLogo}
        tvSeriesLogoSrc={tvSeriesLogo}
        bookMarkLogoSrc={bookMarkLogo}
        profileSrc={profile}
      />
      <SearchBar placeholder="Search for movies or TV series" onSearch={handleSearch} />
      {searchQuery === '' && (
        <div>
          <h2 style={{ color: 'white' }}>Trending</h2>
          <div className="trending">
            <div className="trending-media-container">
              {filteredTrendingMedia.map((media: Media) => (
                <div key={media.id} className="media">
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${media.backdrop_path}`}
                    alt={media.title || media.original_name}
                  />
                  <div className="media-details">
                    <div className="BookmarkBtn">
                      <img
                        src={bookmarkedMedia.has(media.id) ? Bookmark2 : Bookmark1}
                        alt="Bookmark Button"
                        onClick={() => toggleBookmark(media.id)}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                    <div className="media-details1">
                      <span>
                        {media.media_type === 'movie'
                          ? new Date(media.release_date!).getFullYear()
                          : new Date(media.first_air_date!).getFullYear()}
                      </span>
                      <span>
                        <img
                          src={media.media_type === 'movie' ? header2 : header3}
                          alt={media.media_type === 'movie' ? 'Movie Icon' : 'TV Series Icon'}
                          style={{ marginLeft: '10px', width: '12px', height: '12px' }}
                        />
                      </span>
                      <span>{media.media_type === 'movie' ? '· Movie' : '· TV Series'}</span>
                      <span>{media.adult ? '· 18+' : '· PG'}</span>
                    </div>
                    <p>{media.title || media.original_name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {searchQuery !== '' && <h2 style={{ color: 'white' }}>Found "{searchCount}" results</h2>}
      <h2 style={{ color: 'white' }}>Recommended For You</h2>
      <div className="recommended">
        <div className="recommended-media-container">
          {filteredWholeMedia.map((media: Media) => (
            <div key={media.id} className="recommendedMedia">
              <img src={`https://image.tmdb.org/t/p/w500/${media.backdrop_path}`} alt={media.title} />
              <div className="recommended-details">
                <div className="recommendedBookmarkBtn">
                  <img
                    src={bookmarkedMedia.has(media.id) ? Bookmark2 : Bookmark1}
                    alt="Bookmark Button"
                    onClick={() => toggleBookmark(media.id)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                <div className="recommended-details1">
                  <span>
                    {media.media_type === 'movie'
                      ? new Date(media.release_date!).getFullYear()
                      : new Date(media.first_air_date!).getFullYear()}
                  </span>
                  <span>
                    <img
                      src={media.media_type === 'movie' ? header2 : header3}
                      alt={media.media_type === 'movie' ? 'Movie Icon' : 'TV Series Icon'}
                      style={{ marginLeft: '10px', width: '12px', height: '12px', borderRadius: '0px' }}
                    />
                  </span>
                  <span>{media.media_type === 'movie' ? '· Movie' : '· TV Series'}</span>
                  <span>{media.adult ? '· 18+' : '· PG'}</span>
                </div>
                <p style={{ width: '160px' }}>{media.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

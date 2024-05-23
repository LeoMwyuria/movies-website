import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Bookmark1 from '../assets/Bookmark.png';
import Bookmark2 from '../assets/Bookmark2.png';
import header3 from '../assets/tvActive.png';
import logo from '../assets/Movie.png';
import homeLogo from '../assets/header1.png';
import moviesLogo from '../assets/header2.png';
import bookMarkLogo from '../assets/header4.png';
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
    release_date?: string;
    first_air_date?: any;
    adult: boolean;
    media_type: string;
    popularity: number;
}
interface TvseriesProps {
    user: User | null;
  }

  const Tvseries: React.FC<TvseriesProps> = ({ user }) => {
    const [tvSeries, setTvSeries] = useState<Media[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchCount, setSearchCount] = useState<number>(0);
    const [bookmarkedSeries, toggleBookmark] = useBookmark();

    useEffect(() => {
        const fetchTrendingData = async () => {
            try {
                const response = await axios.get('https://api.themoviedb.org/3/trending/all/week?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US');
                const media = response.data.results.filter((media: Media) => media.media_type !== 'movie');
                setTvSeries(media);
            } catch (error) {
                console.error('Error fetching trending data for TV series:', error);
            }
        };
        fetchTrendingData();
    }, []);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const filteredSeries = tvSeries.filter((series: Media) =>
        (series.title && series.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (series.original_name && series.original_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className='main'>
            <Header
               logoSrc={logo}
               homeLogoSrc={homeLogo}
               moviesLogoSrc={moviesLogo}
               tvSeriesLogoSrc={header3}
               bookMarkLogoSrc={bookMarkLogo}
               profileSrc={profile}
            />
            <SearchBar
                placeholder='Search for TV Series'
                onSearch={handleSearch}
            />
            {searchQuery !== '' && (<h2 style={{ color: 'white' }}>Found "{filteredSeries.length}" TV Series</h2>)}
            <h2 style={{ color: 'white' }}>TV Series</h2>
            <div className='recommended'>
                <div className='recommended-media-container'>
                    {filteredSeries.map((series: Media, index: number) => (
                        <div key={index} className='recommendedMedia'>
                            <img src={`https://image.tmdb.org/t/p/w500/${series.backdrop_path}`} alt={series.title} />
                            <div className="recommended-details">
                                <div className='recommendedBookmarkBtn'>
                                    <img
                                        src={bookmarkedSeries.has(series.id) ? Bookmark2 : Bookmark1}
                                        alt="Bookmark Button"
                                        onClick={() => toggleBookmark(series.id)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </div>
                                <div className='recommended-details1'>
                                    <span>{new Date(series.first_air_date).getFullYear()}</span>
                                    <span>{series.adult ? '· 18+' : '· PG'}</span>
                                </div>
                                <p>{series.original_name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Tvseries;

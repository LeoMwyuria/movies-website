import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Bookmark1 from '../assets/Bookmark.png';
import Bookmark2 from '../assets/Bookmark2.png';
import tvSeriesLogo from '../assets/header3.png';
import logo from '../assets/Movie.png';
import homeLogo from '../assets/header1.png';
import moviesLogo from '../assets/movieActive.png';
import bookMarkLogo from '../assets/header4.png';
import profile from '../assets/profilen.png';
import Header from './Header';
import SearchBar from './SearchBar';
import useBookmark from './customHooks/useBookmark';
import { User } from 'firebase/auth';
interface MoviesProps {
    user: User | null;
  }
interface Media {
    id: number;
    title?: string;
    original_name?: string;
    backdrop_path: string;
    release_date?: any;
    first_air_date?: string;
    adult: boolean;
    media_type: string;
    popularity: number;
}

const Movies: React.FC<MoviesProps> = ({ user }) =>{
    const [movies, setMovies] = useState<Media[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchCount, setSearchCount] = useState<number>(0);

    const [bookmarkedMovies, toggleBookmark] = useBookmark(); 

    useEffect(() => {
        const fetchTrendingData = async () => {
            try {
                const response = await axios.get('https://api.themoviedb.org/3/trending/all/week?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US');
                const media = response.data.results.filter((media: Media) => media.media_type === 'movie');
                setMovies(media);
            } catch (error) {
                console.error('Error fetching trending data:', error);
            }
        };
        fetchTrendingData();
    }, []);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const filteredMovies = movies.filter((movie: Media) =>
        (movie.title && movie.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (movie.original_name && movie.original_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className='main'>
            <Header
               logoSrc={logo}
               homeLogoSrc={homeLogo}
               moviesLogoSrc={moviesLogo}
               tvSeriesLogoSrc={tvSeriesLogo}
               bookMarkLogoSrc={bookMarkLogo}
               profileSrc={profile}
            />
            <SearchBar
                placeholder='Search for movies'
                onSearch={handleSearch}
            />
            {searchQuery !== '' && (<h2 style={{ color: 'white' }}>Found "{filteredMovies.length}" Movies</h2>)}
            <h2 style={{ color: 'white' }}>Movies</h2>
            <div className='recommended'>
                <div className='recommended-media-container'>
                    {filteredMovies.map((movie: Media, index: number) => (
                        <div key={index} className='recommendedMedia'>
                            <img src={`https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`} alt={movie.title} />
                            <div className="recommended-details">
                                <div className='recommendedBookmarkBtn'>
                                    <img
                                        src={bookmarkedMovies.has(movie.id) ? Bookmark2 : Bookmark1}
                                        alt="Bookmark Button"
                                        onClick={() => toggleBookmark(movie.id)} 
                                        style={{ cursor: 'pointer' }}
                                    />
                                </div>
                                <div className='recommended-details1'>
                                    <span>{new Date(movie.release_date).getFullYear()}</span>
                                    <span>{movie.adult ? '· 18+' : '· PG'}</span>
                                </div>
                                <p>{movie.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Movies;

import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  logoSrc: string;
  homeLogoSrc: string;
  moviesLogoSrc: string;
  tvSeriesLogoSrc: string;
  bookMarkLogoSrc: string;
  profileSrc: string;
}

const Header: React.FC<HeaderProps> = ({ logoSrc, homeLogoSrc, moviesLogoSrc, tvSeriesLogoSrc, bookMarkLogoSrc, profileSrc }) => {
  const navigate = useNavigate();

  const toMoviesClick = () => {
    navigate("/Movies");
  };
  const toHomeClick = () =>{
    navigate("/Home")
  };
  const toTvSeriesClick = () =>{
    navigate("/TvSeries")
  };
  const toBookmarksClick = () =>{
    navigate("/Bookmarks")
  }


  return (
    <div className="header">
      <div><img src={logoSrc} alt="" /></div>
      <div className='middleHeader'>
        <img onClick={toHomeClick} src={homeLogoSrc} alt="" />
        <img src={moviesLogoSrc} alt="" onClick={toMoviesClick} /> {/* Attach onClick handler */}
        <img onClick={toTvSeriesClick} src={tvSeriesLogoSrc} alt="" />
        <img onClick={toBookmarksClick} src={bookMarkLogoSrc} alt="" />
      </div>
      <div><img src={profileSrc} alt="" /></div>
    </div>
  );
};

export default Header;

import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Search, Mic, HardDrive, User, Github, Coffee, BanIcon, BugIcon, CogIcon, Linkedin, Twitter, PiIcon, DotIcon, BotIcon, AxeIcon, BusIcon, CatIcon, EyeIcon, DnaIcon, BedIcon, GemIcon, HopIcon, MehIcon, NfcIcon, RssIcon, ZapIcon, BabyIcon, BathIcon, BeanIcon, BellIcon, BoldIcon, CodeIcon, BombIcon, InfoIcon, TvIcon, HelpCircle, HelpCircleIcon, HelpingHand, HelpingHandIcon, CoinsIcon, Coins, ConeIcon, IndianRupee, DollarSign } from 'lucide-react'
import './Header.css'

const Header = ({ toggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [videoCount, setVideoCount] = useState(0)
  const [showAbout, setShowAbout] = useState(false)
  const [showSocials, setShowSocials] = useState(false)
  const navigate = useNavigate()
  const aboutRef = useRef(null)
  const socialsRef = useRef(null)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  // Close tooltips when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (aboutRef.current && !aboutRef.current.contains(event.target)) {
        setShowAbout(false)
      }
      if (socialsRef.current && !socialsRef.current.contains(event.target)) {
        setShowSocials(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Ensure only one tooltip opens at a time
  const toggleAbout = () => {
    setShowAbout(!showAbout)
    if (!showAbout) setShowSocials(false)
  }
  const toggleSocials = () => {
    setShowSocials(!showSocials)
    if (!showSocials) setShowAbout(false)
  }

  return (
    <header className="header">
      <div className="header__left">
        <button className="header__menu-btn" onClick={toggleSidebar}>☰</button>
        <a href="/" className="header__logo">
          <div className="logo">
            <img src="/YT_Logo.svg" alt="YouTube Logo" className="logo__icon" />
          </div>
          <h1 className="logo__text">Dr . YouTube</h1>
        </a>
      </div>

      <div className="header__center">
        <form className="header__search-form" onSubmit={handleSearch}>
          <div className="search__container">
            <input
              type="text"
              className="search__input"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search__button">
              <Search size={20} />
            </button>
          </div>
        </form>
        <button className="header__mic-btn"><Mic size={20} /></button>
      </div>

      <div className="header__right">
        {/* Storage */}
        <div className="header__icon-btn">
          <HardDrive size={22} />
          <span className="storage-count">{videoCount}</span>
        </div>

        {/* Profile / About Me */}
        <div ref={aboutRef} className="header__icon-btn" onClick={toggleAbout}>
          <User size={22} />
          {showAbout && (
          <div className="about-tooltip">
            <img src="../../../public/Creator.jpg" alt="Meet Profile" className="profile-pic" />
            <h3>About Me</h3>
            <p>I Am A Creator</p>
            <p>Enjoyyyyyyyyyyyyyyyyyy</p>
          </div>
          )}
        </div>

        {/* GitHub */}
        <a href="https://github.com/Babar-Meet" target="_blank" rel="noopener noreferrer" className="header__icon-btn">
          <Github size={22} />
        </a>
        <a href="https://buymeacoffee.com/babariyameet" target="_blank" rel="noopener noreferrer" className="header__icon-btn">
          <DollarSign size={22} />
        </a>
        <a href="https://github.com/Babar-Meet" target="_blank" rel="noopener noreferrer" className="header__icon-btn">
          <Linkedin size={22} />
        </a>
        <a href="https://github.com/Babar-Meet" target="_blank" rel="noopener noreferrer" className="header__icon-btn">
          <Twitter size={22} />
        </a>


        {/* Other Socials Tooltip */}
        <div ref={socialsRef} className="header__icon-btn" onClick={toggleSocials}>
          <InfoIcon size={22} />
          {showSocials && (
            <div className="about-tooltip">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <PiIcon size={18} /> Socials / Support
              </h3>
              <ul>
                <li>Buy Me Coffee: <a href="https://buymeacoffee.com/babariyameet" target="_blank">Click here</a></li>
                <li>UPI: yourupiid@bank</li>
                <li>Instagram: <a href="https://www.instagram.com/babar_meet/" target="_blank">@babar_meet</a></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header

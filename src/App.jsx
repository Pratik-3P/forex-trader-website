import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./App.css";
import Admin from "./Admin";
import AdminLogin from "./AdminLogin";
import { supabase } from "./supabaseClient";

function App() {

  // ==================================================
  // PROFILE
  // ==================================================

  const defaultProfile = {
    name: "Royal Trader",
    title: "Forex Trader • Educator • IB Partner",
    bio: "I believe Forex trading is not about chasing quick profits. It is about understanding the market, managing risk and developing the right mindset.",
    experience: "4+",
    community: "1000+",
    educationPosts: "100+",
    profileImage: "",
    instagramProfile: ""
  };

  const [profile, setProfile] = useState(defaultProfile);

  // ==================================================
  // WEBSITE REELS
  // ==================================================

  const [reels, setReels] = useState([]);

  // ==================================================
  // CONTACT / 1K ENQUIRY
  // ==================================================

  const defaultEnquiryForm = {
    name: "",
    phone: "",
    email: "",
    city: "",
    experience: "",
    message: ""
  };

  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState(defaultEnquiryForm);
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);

  // ==================================================
  // MOBILE MENU
  // ==================================================

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ==================================================
  // TRADING RESULTS
  // ==================================================

  const defaultTradingResults = {
    weekly: {
      result: "+3.8%",
      winRate: "76%",
      totalTrades: "18"
    },
    monthly: {
      result: "+12.4%",
      winRate: "78%",
      totalTrades: "124"
    },
    yearly: {
      result: "+48.6%",
      winRate: "81%",
      totalTrades: "520"
    }
  };

  const [tradingResults, setTradingResults] = useState(
    defaultTradingResults
  );

  // ==================================================
  // COMMUNITY
  // ==================================================

  const defaultCommunity = {
    eyebrow: "JOIN THE COMMUNITY",
    title: "Learn. Trade.",
    highlight: "Grow Together.",
    description:
      "Follow the journey, learn from market insights and connect with a community focused on improving their trading knowledge.",
    buttonText: "Join Community →",
    buttonUrl: "https://t.me/"
  };

  const [community, setCommunity] = useState(
    defaultCommunity
  );

  // ==================================================
  // LOAD PROFILE + REELS + TRADING RESULTS
  // ==================================================

  useEffect(() => {

    // Load reels
    const loadReels = () => {

      const savedReels =
        JSON.parse(localStorage.getItem("fxReels")) || [];

      setReels(savedReels);

    };

    // Load profile
    const loadProfile = () => {

      const savedProfile =
        JSON.parse(localStorage.getItem("fxProfile"));

      if (savedProfile) {
        setProfile(savedProfile);
      }

    };

    // Load community
    const loadCommunity = () => {

      const savedCommunity =
        JSON.parse(localStorage.getItem("fxCommunity"));

      if (savedCommunity) {
        setCommunity({
          ...defaultCommunity,
          ...savedCommunity
        });
      } else {
        setCommunity(defaultCommunity);
      }

    };

    // Load trading results
    const loadTradingResults = () => {

      const savedResults =
        JSON.parse(localStorage.getItem("fxTradingResults"));

      if (savedResults) {

        // Current format used by Admin.jsx
        if (
          savedResults.weekly &&
          savedResults.monthly &&
          savedResults.yearly
        ) {
          setTradingResults(savedResults);
          return;
        }

        // Backward compatibility
        setTradingResults({
          weekly: {
            result: savedResults.weeklyResult || "+3.8%",
            winRate: savedResults.winRate || "76%",
            totalTrades: savedResults.totalTrades || "18"
          },

          monthly: {
            result: savedResults.monthlyResult || "+12.4%",
            winRate: savedResults.winRate || "78%",
            totalTrades: savedResults.totalTrades || "124"
          },

          yearly: {
            result: savedResults.yearlyResult || "+48.6%",
            winRate: savedResults.winRate || "81%",
            totalTrades: savedResults.totalTrades || "520"
          }
        });
      }

    };

    loadReels();
    loadProfile();
    loadCommunity();
    loadTradingResults();

    window.addEventListener("storage", loadReels);
    window.addEventListener("storage", loadProfile);
    window.addEventListener("storage", loadCommunity);
    window.addEventListener("storage", loadTradingResults);

    window.addEventListener(
      "fxCommunityUpdated",
      loadCommunity
    );

    window.addEventListener(
      "fxTradingResultsUpdated",
      loadTradingResults
    );

    return () => {

      window.removeEventListener("storage", loadReels);
      window.removeEventListener("storage", loadProfile);
      window.removeEventListener("storage", loadCommunity);
      window.removeEventListener("storage", loadTradingResults);

      window.removeEventListener(
        "fxCommunityUpdated",
        loadCommunity
      );

      window.removeEventListener(
        "fxTradingResultsUpdated",
        loadTradingResults
      );

    };

  }, []);

  // ==================================================
  // OPEN 1K CONTACT FORM
  // ==================================================

  const openEnquiryForm = (event) => {

    if (event) {
      event.preventDefault();
    }

    // Close mobile menu
    setMobileMenuOpen(false);

    setShowEnquiryForm(true);

    document.body.classList.add(
      "enquiry-modal-open"
    );

  };

  const closeEnquiryForm = () => {

    setShowEnquiryForm(false);

    document.body.classList.remove(
      "enquiry-modal-open"
    );

  };

  const handleEnquiryChange = (event) => {

    const { name, value } = event.target;

    setEnquiryForm((previous) => ({
      ...previous,
      [name]: value
    }));

  };

  // ==================================================
  // SUBMIT ENQUIRY TO SUPABASE
  // ==================================================

  const handleEnquirySubmit = async (event) => {

    event.preventDefault();

    setEnquirySubmitting(true);

    try {

      const { error } = await supabase
        .from("enquiries")
        .insert([
          {
            name: enquiryForm.name.trim(),
            phone: enquiryForm.phone.trim(),
            email: enquiryForm.email.trim(),
            city: enquiryForm.city.trim(),
            experience: enquiryForm.experience,
            message: enquiryForm.message.trim(),
            status: "New"
          }
        ]);

      if (error) {

        console.error(
          "Supabase enquiry error:",
          error
        );

        window.alert(
          "Sorry, your enquiry could not be submitted. Please try again."
        );

        return;
      }

      setEnquiryForm(
        defaultEnquiryForm
      );

      closeEnquiryForm();

      window.setTimeout(() => {

        window.alert(
          "Thank you! Your enquiry has been submitted successfully."
        );

      }, 0);

    } catch (error) {

      console.error(
        "Unexpected enquiry error:",
        error
      );

      window.alert(
        "Something went wrong. Please try again."
      );

    } finally {

      setEnquirySubmitting(false);

    }

  };

  // ==================================================
  // ADMIN LOGIN
  // ==================================================

  if (window.location.pathname === "/admin") {

    return (
      <AdminLogin
        onLogin={() => {
          window.location.href =
            "/admin/dashboard";
        }}
      />
    );

  }

  // ==================================================
  // ADMIN DASHBOARD
  // ==================================================

  if (
    window.location.pathname ===
    "/admin/dashboard"
  ) {

    return <Admin />;

  }

  // ==================================================
  // OPEN INSTAGRAM REEL
  // ==================================================

  const openReel = (url) => {

    if (!url) {
      return;
    }

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

  };

  // ==================================================
  // OPEN INSTAGRAM PROFILE
  // ==================================================

  const openInstagramProfile = () => {

    window.open(
      "https://www.instagram.com/royal_trader_suraj/",
      "_blank",
      "noopener,noreferrer"
    );

  };

  // ==================================================
  // OPEN COMMUNITY
  // ==================================================

  const openCommunity = () => {

    const url =
      (community.buttonUrl || "").trim();

    if (!url) {

      document
        .getElementById("community")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      return;
    }

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

  };

  // ==================================================
  // OPEN YOUTUBE CHANNEL
  // ==================================================

  const openYouTube = () => {

    window.open(
      "https://youtube.com/@royaltrader23",
      "_blank",
      "noopener,noreferrer"
    );

  };

  // ==================================================
  // CLOSE MOBILE MENU
  // ==================================================

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // ==================================================
  // RETURN WEBSITE
  // ==================================================

  return (

    <div className="app">

      {/* ==================================================
          NAVBAR
      ================================================== */}

      <nav className="navbar">

        <a
          className="brand-lockup"
          href="#home"
          aria-label="Royal Trader home"
          onClick={closeMobileMenu}
        >

          <span
            className="brand-mark"
            aria-hidden="true"
          >

            <span className="brand-crown">
              ♛
            </span>

            <span className="brand-1k">
              1K
            </span>

          </span>

          <span className="brand-name">

            <span className="brand-royal">
              Royal
            </span>

            <span className="brand-trader">
              Trader
            </span>

          </span>

        </a>


        {/* DESKTOP NAVIGATION */}

        <div className="nav-links">

          <a href="#home">
            Home
          </a>

          <a href="#about">
            About
          </a>

          <a href="#learn">
            Learn Forex
          </a>

          <a href="#results">
            Results
          </a>

          <a href="#community">
            Community
          </a>

          <button
            type="button"
            className="nav-contact-button"
            onClick={openEnquiryForm}
          >
            Contact
          </button>

        </div>


        {/* MOBILE MENU BUTTON */}

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() =>
            setMobileMenuOpen(
              (previous) => !previous
            )
          }
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >

          {mobileMenuOpen ? "×" : "☰"}

        </button>


        {/* DESKTOP START LEARNING */}

        <button
          type="button"
          className="nav-button"
          onClick={openYouTube}
        >
          Start Learning
        </button>

      </nav>


      {/* ==================================================
          MOBILE NAVIGATION MENU
      ================================================== */}

      {mobileMenuOpen && (

        <div className="mobile-nav-menu">

          <a
            href="#home"
            onClick={closeMobileMenu}
          >
            Home
          </a>

          <a
            href="#about"
            onClick={closeMobileMenu}
          >
            About
          </a>

          <a
            href="#learn"
            onClick={closeMobileMenu}
          >
            Learn Forex
          </a>

          <a
            href="#results"
            onClick={closeMobileMenu}
          >
            Results
          </a>

          <a
            href="#community"
            onClick={closeMobileMenu}
          >
            Community
          </a>

          <button
            type="button"
            className="mobile-contact-button"
            onClick={openEnquiryForm}
          >
            Contact
          </button>

          <button
            type="button"
            className="mobile-learning-button"
            onClick={() => {

              closeMobileMenu();

              openYouTube();

            }}
          >
            Start Learning →
          </button>

        </div>

      )}


      {/* ==================================================
          HERO
      ================================================== */}

      <section
        className="hero"
        id="home"
      >

        <motion.div
          className="hero-content"

          initial={{
            opacity: 0,
            x: -50
          }}

          animate={{
            opacity: 1,
            x: 0
          }}

          transition={{
            duration: 0.8
          }}
        >

          <motion.p
            className="hero-tag"

            initial={{
              opacity: 0,
              y: 20
            }}

            animate={{
              opacity: 1,
              y: 0
            }}

            transition={{
              delay: 0.2,
              duration: 0.6
            }}
          >

            {profile.title}

          </motion.p>


          <motion.h1

            initial={{
              opacity: 0,
              y: 40
            }}

            animate={{
              opacity: 1,
              y: 0
            }}

            transition={{
              delay: 0.3,
              duration: 0.8
            }}
          >

            Trade With Purpose.

            <br />

            <span>
              Build Your Edge.
            </span>

          </motion.h1>


          <motion.p
            className="hero-description"

            initial={{
              opacity: 0,
              y: 25
            }}

            animate={{
              opacity: 1,
              y: 0
            }}

            transition={{
              delay: 0.5,
              duration: 0.7
            }}
          >

            Learn the markets, understand risk and build a disciplined
            approach to Forex trading.

          </motion.p>


          <motion.div
            className="hero-buttons"

            initial={{
              opacity: 0,
              y: 25
            }}

            animate={{
              opacity: 1,
              y: 0
            }}

            transition={{
              delay: 0.7,
              duration: 0.7
            }}
          >

            <button
              type="button"
              className="primary-button"
              onClick={openYouTube}
            >
              Start Learning →
            </button>


            <button
              type="button"
              className="secondary-button"
              onClick={openCommunity}
            >
              Join Community
            </button>

          </motion.div>

        </motion.div>


        {/* ==================================================
            TRADING VISUAL
        ================================================== */}

        <motion.div
          className="hero-visual"

          initial={{
            opacity: 0,
            x: 60,
            scale: 0.95
          }}

          animate={{
            opacity: 1,
            x: 0,
            scale: 1
          }}

          transition={{
            delay: 0.4,
            duration: 0.9
          }}
        >

          <motion.div
            className="glow"

            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.1, 0.18, 0.1]
            }}

            transition={{
              duration: 4,
              repeat: Infinity
            }}
          />


          <div className="trader-card">

            <div className="chart-header">

              <div>

                <span className="chart-label">
                  MARKET
                </span>

                <h3>
                  EUR/USD
                </h3>

              </div>


              <div className="live-badge">

                <span></span>

                LIVE

              </div>

            </div>


            <div className="chart-area">

              <div className="chart-grid">

                <span></span>
                <span></span>
                <span></span>
                <span></span>

              </div>


              <svg
                className="price-chart"
                viewBox="0 0 500 260"
                preserveAspectRatio="none"
              >

                <defs>

                  <linearGradient
                    id="chartGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopOpacity="0.35"
                    />

                    <stop
                      offset="100%"
                      stopOpacity="0"
                    />

                  </linearGradient>

                </defs>


                <motion.path
                  className="chart-area-fill"

                  d="
                    M0 220
                    L45 205
                    L80 215
                    L115 170
                    L150 185
                    L185 135
                    L220 150
                    L255 105
                    L290 125
                    L325 80
                    L360 100
                    L395 65
                    L430 75
                    L465 35
                    L500 50
                    L500 260
                    L0 260
                    Z
                  "

                  initial={{
                    opacity: 0
                  }}

                  animate={{
                    opacity: 1
                  }}

                  transition={{
                    delay: 1,
                    duration: 1
                  }}
                />


                <motion.path
                  className="price-line"

                  d="
                    M0 220
                    L45 205
                    L80 215
                    L115 170
                    L150 185
                    L185 135
                    L220 150
                    L255 105
                    L290 125
                    L325 80
                    L360 100
                    L395 65
                    L430 75
                    L465 35
                    L500 50
                  "

                  initial={{
                    pathLength: 0
                  }}

                  animate={{
                    pathLength: 1
                  }}

                  transition={{
                    duration: 2,
                    ease: "easeInOut"
                  }}
                />

              </svg>


              <div className="candles">

                <span className="candle candle-1"></span>
                <span className="candle candle-2 red"></span>
                <span className="candle candle-3"></span>
                <span className="candle candle-4"></span>
                <span className="candle candle-5 red"></span>
                <span className="candle candle-6"></span>
                <span className="candle candle-7"></span>
                <span className="candle candle-8"></span>

              </div>

            </div>


            <div className="chart-footer">

              <div>

                <span>
                  Price
                </span>

                <strong>
                  1.0842
                </strong>

              </div>


              <div>

                <span>
                  Change
                </span>

                <strong className="positive">
                  +0.42%
                </strong>

              </div>

            </div>


            <motion.div
              className="profit-card"

              animate={{
                y: [0, -8, 0]
              }}

              transition={{
                duration: 3,
                repeat: Infinity
              }}
            >

              <span>
                Today's Result
              </span>

              <strong>
                {tradingResults.weekly.result}
              </strong>

            </motion.div>

          </div>

        </motion.div>

      </section>


      {/* ==================================================
          STATS
      ================================================== */}

      <motion.section
        className="stats"

        initial={{
          opacity: 0,
          y: 40
        }}

        whileInView={{
          opacity: 1,
          y: 0
        }}

        viewport={{
          once: true
        }}

        transition={{
          duration: 0.8
        }}
      >

        <div>

          <strong>
            {profile.experience}
          </strong>

          <span>
            Years Experience
          </span>

        </div>


        <div>

          <strong>
            {profile.community}
          </strong>

          <span>
            Community Members
          </span>

        </div>


        <div>

          <strong>
            Daily
          </strong>

          <span>
            Market Content
          </span>

        </div>


        <div>

          <strong>
            {profile.educationPosts}
          </strong>

          <span>
            Educational Posts
          </span>

        </div>

      </motion.section>


      {/* ==================================================
          ABOUT
      ================================================== */}

      <section
        className="about-section"
        id="about"
      >

        <motion.div
          className="about-image"

          initial={{
            opacity: 0,
            x: -60
          }}

          whileInView={{
            opacity: 1,
            x: 0
          }}

          viewport={{
            once: true
          }}

          transition={{
            duration: 0.8
          }}
        >

          <div className="about-photo">

            <div
              className="about-1k-badge"
              aria-label="1K Royal Trader"
            >
              1K
            </div>

            {profile.profileImage ? (

              <img
                src={profile.profileImage}
                alt={profile.name}
              />

            ) : (

              <div className="photo-text">
                TRADER PHOTO
              </div>

            )}

          </div>


          <div className="experience-badge">

            <strong>
              {profile.experience}
            </strong>

            <span>
              Years Trading
            </span>

          </div>

        </motion.div>


        <motion.div
          className="about-content"

          initial={{
            opacity: 0,
            x: 60
          }}

          whileInView={{
            opacity: 1,
            x: 0
          }}

          viewport={{
            once: true
          }}

          transition={{
            duration: 0.8
          }}
        >

          <p className="section-tag">
            ABOUT THE TRADER
          </p>


          <h2>

            More Than Just

            <span>
              {" "}Trading.
            </span>

          </h2>


          <p>
            {profile.bio}
          </p>


          <p>
            Through my trading journey and educational content, I share
            what I learn from the markets and help aspiring traders
            understand Forex in a simple and practical way.
          </p>


          <div className="about-points">

            <article className="about-point-card">

              <div className="about-point-number">
                01
              </div>

              <div className="about-point-content">

                <h3>
                  Market Education
                </h3>

                <p>
                  Learn the fundamentals and understand how the Forex market works.
                </p>

              </div>

            </article>


            <article className="about-point-card">

              <div className="about-point-number">
                02
              </div>

              <div className="about-point-content">

                <h3>
                  Risk Management
                </h3>

                <p>
                  Build a disciplined approach to managing trading risk.
                </p>

              </div>

            </article>


            <article className="about-point-card">

              <div className="about-point-number">
                03
              </div>

              <div className="about-point-content">

                <h3>
                  Trading Mindset
                </h3>

                <p>
                  Develop patience, consistency and better decision making.
                </p>

              </div>

            </article>

          </div>


          <button className="learn-more-button">
            Learn More About Me →
          </button>

        </motion.div>

      </section>


      {/* ==================================================
          INSTAGRAM REELS
      ================================================== */}

      <section
        className="reels-section"
        id="learn"
      >

        <motion.div
          className="section-heading"

          initial={{
            opacity: 0,
            y: 30
          }}

          whileInView={{
            opacity: 1,
            y: 0
          }}

          viewport={{
            once: true
          }}

          transition={{
            duration: 0.7
          }}
        >

          <p className="section-tag">
            FROM INSTAGRAM
          </p>


          <h2>

            Latest

            <span>
              {" "}Market Content.
            </span>

          </h2>


          <p>
            Daily market insights, trading lessons and educational
            content shared on Instagram.
          </p>

        </motion.div>


        <div className="reels-grid">

          {reels.length === 0 ? (

            <div className="no-reels-message">

              <div className="no-reels-icon">
                ◎
              </div>

              <h3>
                No Instagram Reels Yet
              </h3>

              <p>
                New market content will appear here soon.
              </p>

            </div>

          ) : (

            reels.map((reel, index) => (

              <motion.article
                className="reel-card"
                key={reel.id}

                initial={{
                  opacity: 0,
                  y: 50
                }}

                whileInView={{
                  opacity: 1,
                  y: 0
                }}

                viewport={{
                  once: true
                }}

                transition={{
                  delay: index * 0.1,
                  duration: 0.6
                }}
              >

                <div
                  className="reel-preview real-reel-preview"

                  onClick={() =>
                    openReel(reel.url)
                  }

                  role="button"

                  tabIndex="0"

                  onKeyDown={(e) => {

                    if (e.key === "Enter") {
                      openReel(reel.url);
                    }

                  }}
                >

                  {reel.coverImage ? (

                    <img
                      src={reel.coverImage}
                      alt={reel.title}
                      className="reel-cover-image"
                    />

                  ) : (

                    <div className="reel-no-image">
                      No Cover Image
                    </div>

                  )}


                  <div className="reel-overlay"></div>


                  <div className="instagram-icon">
                    ◎
                  </div>


                  <span className="reel-label">
                    {reel.category}
                  </span>

                </div>


                <div className="reel-info">

                  <h3>
                    {reel.title}
                  </h3>


                  <p>
                    Latest Forex market insights, education and
                    trading content.
                  </p>


                  <button
                    onClick={() =>
                      openReel(reel.url)
                    }
                  >
                    Watch Reel →
                  </button>

                </div>

              </motion.article>

            ))

          )}

        </div>


        <div className="instagram-button-wrapper">

          <button
            className="instagram-button"
            onClick={openInstagramProfile}
          >
            View Instagram Profile →
          </button>

        </div>

      </section>


      {/* ==================================================
          TRADING RESULTS
      ================================================== */}

      <section
        className="results-new-section"
        id="results"
      >

        <motion.div
          className="results-new-heading"

          initial={{
            opacity: 0,
            y: 30
          }}

          whileInView={{
            opacity: 1,
            y: 0
          }}

          viewport={{
            once: true,
            amount: 0.2
          }}

          transition={{
            duration: 0.7
          }}
        >

          <p className="results-new-tag">
            TRADING PERFORMANCE
          </p>

          <h2>
            Real Trading <span>Results.</span>
          </h2>

          <p>
            Transparent performance tracking across weekly, monthly and yearly trading results.
          </p>

        </motion.div>


        <div className="results-new-grid">

          {[
            {
              key: "weekly",
              label: "WEEKLY RESULT",
              period: "THIS WEEK",
              description: "Current weekly trading performance"
            },

            {
              key: "monthly",
              label: "MONTHLY RESULT",
              period: "THIS MONTH",
              description: "Current monthly trading performance"
            },

            {
              key: "yearly",
              label: "YEARLY RESULT",
              period: "THIS YEAR",
              description: "Current yearly trading performance"
            }

          ].map((item, index) => (

            <motion.article
              className="results-new-card"
              key={item.key}

              initial={{
                opacity: 0,
                y: 40
              }}

              whileInView={{
                opacity: 1,
                y: 0
              }}

              viewport={{
                once: true,
                amount: 0.2
              }}

              transition={{
                delay: index * 0.1,
                duration: 0.6
              }}
            >

              <div className="results-new-card-header">

                <div>

                  <span>
                    {item.label}
                  </span>

                  <small>
                    {item.period}
                  </small>

                </div>


                <div
                  className="results-new-icon"
                  aria-hidden="true"
                >

                  <svg viewBox="0 0 24 24">

                    <path d="M4 16l5-5 4 3 7-8" />

                    <path d="M15 6h5v5" />

                  </svg>

                </div>

              </div>


              <strong className="results-new-number">

                {tradingResults[item.key].result}

              </strong>


              <p>
                {item.description}
              </p>


              <div className="results-new-line" />

            </motion.article>

          ))}

        </div>


        <motion.div
          className="results-new-stats"

          initial={{
            opacity: 0,
            y: 30
          }}

          whileInView={{
            opacity: 1,
            y: 0
          }}

          viewport={{
            once: true,
            amount: 0.2
          }}

          transition={{
            delay: 0.25,
            duration: 0.6
          }}
        >

          <div className="results-new-stat">

            <div
              className="results-new-stat-icon"
              aria-hidden="true"
            >

              <svg viewBox="0 0 24 24">

                <path d="M12 3v18" />

                <path d="M16 7.5c0-1.7-1.7-3-4-3s-4 1.3-4 3 1.7 3 4 3 4 1.3 4 3-1.7 3-4 3-4-1.3-4-3" />

              </svg>

            </div>

            <div>

              <span>
                WIN RATE
              </span>

              <strong>
                {tradingResults.monthly.winRate}
              </strong>

            </div>

          </div>


          <div className="results-new-stat">

            <div
              className="results-new-stat-icon"
              aria-hidden="true"
            >

              <svg viewBox="0 0 24 24">

                <path d="M7 7h10" />

                <path d="M7 12h10" />

                <path d="M7 17h10" />

              </svg>

            </div>

            <div>

              <span>
                TOTAL TRADES
              </span>

              <strong>
                {tradingResults.monthly.totalTrades}
              </strong>

            </div>

          </div>


          <div className="results-new-stat">

            <div
              className="results-new-stat-icon"
              aria-hidden="true"
            >

              <svg viewBox="0 0 24 24">

                <path d="M5 16l5-5 3 3 6-7" />

                <path d="M14 7h5v5" />

              </svg>

            </div>

            <div>

              <span>
                PERFORMANCE
              </span>

              <strong>
                TRACKED
              </strong>

            </div>

          </div>

        </motion.div>


        <div className="results-new-disclaimer">

          <div
            className="results-new-warning"
            aria-hidden="true"
          >
            !
          </div>

          <div>

            <strong>
              Trading Risk Disclosure
            </strong>

            <p>
              Past trading results do not guarantee future performance.
              Trading involves risk. Always manage your risk responsibly.
            </p>

          </div>

        </div>

      </section>


      {/* ==================================================
          COMMUNITY
      ================================================== */}

      <section
        className="community-section"
        id="community"
      >

        <motion.div

          initial={{
            opacity: 0,
            scale: 0.95
          }}

          whileInView={{
            opacity: 1,
            scale: 1
          }}

          viewport={{
            once: true
          }}

          transition={{
            duration: 0.7
          }}
        >

          <p className="section-tag">
            {community.eyebrow}
          </p>


          <h2>

            {community.title}

            <span>
              {" "}{community.highlight}
            </span>

          </h2>


          <p>
            {community.description}
          </p>


          <button
            type="button"
            className="primary-button"
            onClick={openCommunity}
          >
            {community.buttonText}
          </button>

        </motion.div>

      </section>


      {/* ==================================================
          1K ENQUIRY MODAL
      ================================================== */}

      {showEnquiryForm && (

        <div
          className="enquiry-modal-backdrop"

          role="dialog"

          aria-modal="true"

          aria-labelledby="enquiry-modal-title"

          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {
              closeEnquiryForm();
            }

          }}
        >

          <div className="enquiry-modal-card">

            <button
              type="button"
              className="enquiry-modal-close"
              onClick={closeEnquiryForm}
              aria-label="Close enquiry form"
            >
              ×
            </button>


            <div className="enquiry-modal-brand">

              <span className="enquiry-brand-mark">
                1K
              </span>

              <div>

                <span className="enquiry-brand-kicker">
                  ROYAL
                </span>

                <strong>
                  Trader Enquiry
                </strong>

              </div>

            </div>


            <p className="enquiry-modal-tag">
              1K CONTACT FORM
            </p>


            <h2 id="enquiry-modal-title">
              Let&apos;s Connect.
            </h2>


            <p className="enquiry-modal-subtitle">
              Fill in your details and the Royal Trader team will review your enquiry.
            </p>


            <form
              className="enquiry-form"
              onSubmit={handleEnquirySubmit}
            >

              <div className="enquiry-form-grid">

                <label>

                  Full Name

                  <input
                    type="text"
                    name="name"
                    value={enquiryForm.name}
                    onChange={handleEnquiryChange}
                    placeholder="Your full name"
                    required
                  />

                </label>


                <label>

                  WhatsApp / Mobile

                  <input
                    type="tel"
                    name="phone"
                    value={enquiryForm.phone}
                    onChange={handleEnquiryChange}
                    placeholder="+91 98765 43210"
                    required
                  />

                </label>


                <label>

                  Email Address

                  <input
                    type="email"
                    name="email"
                    value={enquiryForm.email}
                    onChange={handleEnquiryChange}
                    placeholder="you@example.com"
                    required
                  />

                </label>


                <label>

                  City

                  <input
                    type="text"
                    name="city"
                    value={enquiryForm.city}
                    onChange={handleEnquiryChange}
                    placeholder="Mumbai"
                    required
                  />

                </label>


                <label className="enquiry-field-full">

                  Trading Experience

                  <select
                    name="experience"
                    value={enquiryForm.experience}
                    onChange={handleEnquiryChange}
                    required
                  >

                    <option value="">
                      Select experience
                    </option>

                    <option value="Beginner">
                      Beginner
                    </option>

                    <option value="0-1 year">
                      0–1 year
                    </option>

                    <option value="1-3 years">
                      1–3 years
                    </option>

                    <option value="3+ years">
                      3+ years
                    </option>

                  </select>

                </label>


                <label className="enquiry-field-full">

                  Message

                  <textarea
                    name="message"
                    value={enquiryForm.message}
                    onChange={handleEnquiryChange}
                    rows="4"
                    placeholder="Tell us what you would like to learn or discuss..."
                    required
                  />

                </label>

              </div>


              <button
                className="enquiry-submit-button"
                type="submit"
                disabled={enquirySubmitting}
              >

                {enquirySubmitting
                  ? "Submitting..."
                  : "Submit Enquiry →"}

              </button>


              <p className="enquiry-form-note">

                Your details are saved securely in this website&apos;s admin enquiry panel.

              </p>

            </form>

          </div>

        </div>

      )}


      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer id="contact">

        <div className="footer-logo">

          {profile.name}

        </div>


        <p>
          Trade with purpose. Build your edge.
        </p>


        <div className="footer-links">

          <a href="#home">
            Home
          </a>

          <a href="#about">
            About
          </a>

          <a href="#results">
            Results
          </a>

          <a href="#community">
            Community
          </a>

        </div>


        <div className="footer-bottom">

          © 2026 {profile.name}. All rights reserved.

        </div>

      </footer>


    </div>

  );

}

export default App;
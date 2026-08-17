
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Admin.css";
import { supabase } from "./supabaseClient";

function Admin() {
  // ==================================================
  // ACTIVE TAB
  // ==================================================

  const [activeTab, setActiveTab] = useState("dashboard");

  // ==================================================
  // REELS
  // ==================================================

  const [reels, setReels] = useState([]);

  const [form, setForm] = useState({
    title: "",
    category: "Daily Market",
    url: "",
    coverImage: ""
  });

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
    profileImage: ""
  };

  const [profile, setProfile] = useState(defaultProfile);

  const [profileForm, setProfileForm] = useState(defaultProfile);

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

  const [community, setCommunity] = useState(defaultCommunity);

  const [communityForm, setCommunityForm] = useState(defaultCommunity);

  // ==================================================
  // ENQUIRIES
  // ==================================================

  const [enquiries, setEnquiries] = useState([]);

  // ==================================================
  // LOAD DATA
  // ==================================================

  useEffect(() => {
    // ==================================================
    // LOAD REELS
    // ==================================================

    const savedReels =
      JSON.parse(localStorage.getItem("fxReels")) || [];

    setReels(savedReels);

    // ==================================================
    // LOAD PROFILE FROM SUPABASE
    // ==================================================

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from("site_profile")
        .select("*")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("Supabase profile load error:", error);
        return;
      }

      if (data) {
        const loadedProfile = {
          name: data.name || defaultProfile.name,
          title: data.title || defaultProfile.title,
          bio: data.bio || defaultProfile.bio,
          experience:
            data.experience || defaultProfile.experience,
          community:
            data.community || defaultProfile.community,
          educationPosts:
            data.education_posts ||
            defaultProfile.educationPosts,
          profileImage:
            data.profile_image || ""
        };

        setProfile(loadedProfile);
        setProfileForm(loadedProfile);
      }
    };

    loadProfile();

    // ==================================================
    // LOAD COMMUNITY
    // ==================================================

    const savedCommunity =
      JSON.parse(localStorage.getItem("fxCommunity"));

    if (savedCommunity) {
      const mergedCommunity = {
        ...defaultCommunity,
        ...savedCommunity
      };

      setCommunity(mergedCommunity);
      setCommunityForm(mergedCommunity);
    }

    // ==================================================
    // LOAD ENQUIRIES
    // ==================================================

    const loadEnquiries = async () => {
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", {
          ascending: false
        });

      if (error) {
        console.error(
          "Supabase enquiries error:",
          error
        );
        return;
      }

      setEnquiries(data || []);
    };

    loadEnquiries();

    // ==================================================
    // LOAD TRADING RESULTS
    // ==================================================

    const savedResults =
      JSON.parse(
        localStorage.getItem("fxTradingResults")
      );

    if (savedResults) {
      if (
        savedResults.weekly &&
        savedResults.monthly &&
        savedResults.yearly
      ) {
        setTradingResults(savedResults);
      } else {
        setTradingResults({
          weekly: {
            result: "+3.8%",
            winRate: "76%",
            totalTrades: "18"
          },

          monthly: {
            result:
              savedResults.monthlyResult ||
              "+12.4%",
            winRate:
              savedResults.winRate ||
              "78%",
            totalTrades:
              savedResults.totalTrades ||
              "124"
          },

          yearly: {
            result: "+48.6%",
            winRate: "81%",
            totalTrades: "520"
          }
        });
      }
    }
  }, []);

  // ==================================================
  // REEL INPUT CHANGE
  // ==================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // ==================================================
  // REEL COVER IMAGE
  // ==================================================

  const handleCoverImage = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        coverImage: reader.result
      }));
    };

    reader.readAsDataURL(file);
  };

  // ==================================================
  // ADD REEL
  // ==================================================

  const handleAddReel = (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter reel title.");
      return;
    }

    if (!form.url.trim()) {
      alert("Please enter Instagram Reel URL.");
      return;
    }

    if (!form.url.includes("instagram.com")) {
      alert("Please enter a valid Instagram URL.");
      return;
    }

    if (!form.coverImage) {
      alert("Please upload Reel cover image.");
      return;
    }

    const newReel = {
      id: Date.now(),
      title: form.title,
      category: form.category,
      url: form.url,
      coverImage: form.coverImage,
      createdAt: new Date().toLocaleDateString()
    };

    const updatedReels = [
      newReel,
      ...reels
    ];

    setReels(updatedReels);

    localStorage.setItem(
      "fxReels",
      JSON.stringify(updatedReels)
    );

    setForm({
      title: "",
      category: "Daily Market",
      url: "",
      coverImage: ""
    });

    const fileInput =
      document.getElementById("reelCover");

    if (fileInput) {
      fileInput.value = "";
    }

    alert("Instagram Reel added successfully!");
  };

  // ==================================================
  // DELETE REEL
  // ==================================================

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this reel?"
    );

    if (!confirmDelete) {
      return;
    }

    const updatedReels =
      reels.filter((reel) => reel.id !== id);

    setReels(updatedReels);

    localStorage.setItem(
      "fxReels",
      JSON.stringify(updatedReels)
    );
  };

  // ==================================================
  // PROFILE INPUT CHANGE
  // ==================================================

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfileForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // ==================================================
  // PROFILE IMAGE
  // ==================================================

  const handleProfileImage = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert(
        "Profile image should be less than 2 MB."
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setProfileForm((prev) => ({
        ...prev,
        profileImage: reader.result
      }));
    };

    reader.readAsDataURL(file);
  };

  // ==================================================
  // SAVE PROFILE TO SUPABASE
  // ==================================================

const handleSaveProfile = async (e) => {
  e.preventDefault();

  if (!profileForm.name.trim()) {
    alert("Please enter your name.");
    return;
  }

  if (!profileForm.title.trim()) {
    alert("Please enter profile title.");
    return;
  }

  if (!profileForm.bio.trim()) {
    alert("Please enter your bio.");
    return;
  }

  const updatedProfile = {
    name: profileForm.name.trim(),
    title: profileForm.title.trim(),
    bio: profileForm.bio.trim(),
    experience: profileForm.experience.trim(),
    community: profileForm.community.trim(),
    education_posts:
      profileForm.educationPosts.trim(),
    profile_image:
      profileForm.profileImage || "",
    updated_at: new Date().toISOString()
  };

  console.log("Saving profile:", updatedProfile);

  try {
    // First try UPDATE
    const { data: updateData, error: updateError } =
      await supabase
        .from("site_profile")
        .update(updatedProfile)
        .eq("id", 1)
        .select();

    console.log("Profile update response:", {
      updateData,
      updateError
    });

    if (updateError) {
      console.error(
        "Supabase UPDATE error:",
        updateError
      );

      alert(
        `Profile save failed.\n\n` +
        `Code: ${updateError.code || "N/A"}\n` +
        `Message: ${updateError.message || "Unknown error"}\n\n` +
        `Check Supabase RLS policies.`
      );

      return;
    }

    // If row with id=1 exists, UPDATE succeeds
    if (updateData && updateData.length > 0) {
      setProfile({
        ...profileForm
      });

      localStorage.setItem(
        "fxProfile",
        JSON.stringify(profileForm)
      );

      alert("Profile updated successfully!");
      return;
    }

    // If id=1 does not exist, INSERT it
    const { data: insertData, error: insertError } =
      await supabase
        .from("site_profile")
        .insert({
          id: 1,
          ...updatedProfile
        })
        .select();

    console.log("Profile insert response:", {
      insertData,
      insertError
    });

    if (insertError) {
      console.error(
        "Supabase INSERT error:",
        insertError
      );

      alert(
        `Profile creation failed.\n\n` +
        `Code: ${insertError.code || "N/A"}\n` +
        `Message: ${insertError.message || "Unknown error"}\n\n` +
        `Check Supabase INSERT policy.`
      );

      return;
    }

    setProfile({
      ...profileForm
    });

    localStorage.setItem(
      "fxProfile",
      JSON.stringify(profileForm)
    );

    alert("Profile saved successfully!");
  } catch (error) {
    console.error(
      "Unexpected profile save error:",
      error
    );

    alert(
      `Unexpected error:\n\n${
        error?.message || error
      }`
    );
  }
};


  // ==================================================
  // SAVE TRADING RESULTS
  // ==================================================

  const handleSaveResults = (e) => {
    e.preventDefault();

    localStorage.setItem(
      "fxTradingResults",
      JSON.stringify(tradingResults)
    );

    alert(
      "Trading results updated successfully!"
    );
  };

  // ==================================================
  // COMMUNITY INPUT CHANGE
  // ==================================================

  const handleCommunityChange = (e) => {
    const { name, value } = e.target;

    setCommunityForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // ==================================================
  // SAVE COMMUNITY
  // ==================================================

  const handleSaveCommunity = (e) => {
    e.preventDefault();

    if (!communityForm.eyebrow.trim()) {
      alert(
        "Please enter a community eyebrow."
      );
      return;
    }

    if (!communityForm.title.trim()) {
      alert(
        "Please enter a community title."
      );
      return;
    }

    if (!communityForm.description.trim()) {
      alert(
        "Please enter a community description."
      );
      return;
    }

    if (!communityForm.buttonText.trim()) {
      alert(
        "Please enter community button text."
      );
      return;
    }

    const updatedCommunity = {
      ...communityForm
    };

    setCommunity(updatedCommunity);

    localStorage.setItem(
      "fxCommunity",
      JSON.stringify(updatedCommunity)
    );

    window.dispatchEvent(
      new Event("fxCommunityUpdated")
    );

    alert(
      "Community section updated successfully!"
    );
  };

  // ==================================================
  // ENQUIRIES
  // ==================================================

  const markEnquiryRead = async (id) => {
    const { error } = await supabase
      .from("enquiries")
      .update({
        status: "Reviewed"
      })
      .eq("id", id);

    if (error) {
      console.error(
        "Supabase update error:",
        error
      );

      alert("Could not update enquiry.");
      return;
    }

    setEnquiries((previous) =>
      previous.map((enquiry) =>
        enquiry.id === id
          ? {
              ...enquiry,
              status: "Reviewed"
            }
          : enquiry
      )
    );
  };

  const deleteEnquiry = async (id) => {
    const shouldDelete = window.confirm(
      "Delete this enquiry? This action cannot be undone."
    );

    if (!shouldDelete) {
      return;
    }

    const { error } = await supabase
      .from("enquiries")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Supabase delete error:",
        error
      );

      alert("Could not delete enquiry.");
      return;
    }

    setEnquiries((previous) =>
      previous.filter(
        (enquiry) => enquiry.id !== id
      )
    );
  };

  const clearAllEnquiries = async () => {
    if (!enquiries.length) {
      return;
    }

    const shouldClear = window.confirm(
      "Delete all enquiries? This action cannot be undone."
    );

    if (!shouldClear) {
      return;
    }

    const { error } = await supabase
      .from("enquiries")
      .delete()
      .not("id", "is", null);

    if (error) {
      console.error(
        "Supabase clear enquiries error:",
        error
      );

      alert("Could not delete enquiries.");
      return;
    }

    setEnquiries([]);
  };

  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {
    window.location.href = "/admin";
  };

  // ==================================================
  // MENU
  // ==================================================

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard"
    },
    {
      id: "profile",
      label: "Profile"
    },
    {
      id: "reels",
      label: "Instagram Reels"
    },
    {
      id: "results",
      label: "Trading Results"
    },
    {
      id: "community",
      label: "Community"
    },
    {
      id: "enquiries",
      label: `Enquiries${
        enquiries.length
          ? ` (${
              enquiries.filter(
                (enquiry) =>
                  enquiry.status === "New"
              ).length
            })`
          : ""
      }`
    }
  ];

  // ==================================================
  // DASHBOARD
  // ==================================================

  const renderDashboard = () => {
    return (
      <>
        <div className="admin-header">
          <div>
            <p className="admin-small-title">
              ADMIN PANEL
            </p>

            <h1>
              Dashboard
            </h1>
          </div>

          <a
            href="/"
            className="view-website"
          >
            View Website →
          </a>
        </div>

        <div className="admin-stats">
          <div className="admin-stat-card">
            <span>
              TOTAL REELS
            </span>

            <strong>
              {reels.length}
            </strong>
          </div>

          <div className="admin-stat-card">
            <span>
              TRADING RESULTS
            </span>

            <strong>
              {tradingResults.monthly.totalTrades}
            </strong>
          </div>

          <div className="admin-stat-card">
            <span>
              WEBSITE
            </span>

            <strong className="status-live">
              LIVE
            </strong>
          </div>

          <div className="admin-stat-card admin-enquiry-stat">
            <span>
              NEW ENQUIRIES
            </span>

            <strong>
              {
                enquiries.filter(
                  (enquiry) =>
                    enquiry.status === "New"
                ).length
              }
            </strong>
          </div>
        </div>

        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <p>
                PROFILE
              </p>

              <h2>
                {profile.name}
              </h2>
            </div>
          </div>

          <div className="profile-quick-card">
            <div className="profile-quick-image">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                />
              ) : (
                <span>
                  RT
                </span>
              )}
            </div>

            <div>
              <h3>
                {profile.title}
              </h3>

              <p>
                {profile.bio}
              </p>

              <button
                className="view-reel-button"
                onClick={() =>
                  setActiveTab("profile")
                }
              >
                Edit Profile
              </button>
            </div>
          </div>
        </section>

        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <p>
                CONTENT
              </p>

              <h2>
                Recent Instagram Reels
              </h2>
            </div>

            <span className="reel-count">
              {reels.length} Reels
            </span>
          </div>

          {reels.length === 0 ? (
            <div className="empty-reels">
              <div className="empty-icon">
                ◎
              </div>

              <h3>
                No reels added yet
              </h3>

              <p>
                Go to Instagram Reels and add your first reel.
              </p>

              <button
                className="add-reel-button"
                onClick={() =>
                  setActiveTab("reels")
                }
              >
                + Add Reel
              </button>
            </div>
          ) : (
            <div className="admin-reels-list">
              {reels.slice(0, 3).map((reel) => (
                <div
                  className="admin-reel-card"
                  key={reel.id}
                >
                  <div className="admin-reel-thumb">
                    <img
                      src={reel.coverImage}
                      alt={reel.title}
                    />

                    <span>
                      ▶
                    </span>
                  </div>

                  <div className="admin-reel-details">
                    <span className="admin-reel-category">
                      {reel.category}
                    </span>

                    <h3>
                      {reel.title}
                    </h3>

                    <small>
                      Added: {reel.createdAt}
                    </small>
                  </div>

                  <div className="admin-reel-actions">
                    <a
                      href={reel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-reel-button"
                    >
                      View
                    </a>

                    <button
                      className="delete-reel-button"
                      onClick={() =>
                        handleDelete(reel.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </>
    );
  };

  // ==================================================
  // PROFILE
  // ==================================================

  const renderProfile = () => {
    return (
      <>
        <div className="admin-header">
          <div>
            <p className="admin-small-title">
              ADMIN PANEL
            </p>

            <h1>
              Profile
            </h1>
          </div>

          <a
            href="/"
            className="view-website"
          >
            View Website →
          </a>
        </div>

        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <p>
                PROFILE INFORMATION
              </p>

              <h2>
                Edit Your Profile
              </h2>
            </div>
          </div>

          <form
            className="reel-form"
            onSubmit={handleSaveProfile}
          >
            <div className="admin-field">
              <label>
                Name
              </label>

              <input
                type="text"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                placeholder="Royal Trader"
              />
            </div>

            <div className="admin-field">
              <label>
                Profile Title
              </label>

              <input
                type="text"
                name="title"
                value={profileForm.title}
                onChange={handleProfileChange}
                placeholder="Forex Trader • Educator • IB Partner"
              />
            </div>

            <div className="admin-field full-width">
              <label>
                Bio
              </label>

              <textarea
                name="bio"
                value={profileForm.bio}
                onChange={handleProfileChange}
                rows="6"
                placeholder="Write your profile bio..."
              />
            </div>

            <div className="admin-field">
              <label>
                Years Experience
              </label>

              <input
                type="text"
                name="experience"
                value={profileForm.experience}
                onChange={handleProfileChange}
                placeholder="4+"
              />
            </div>

            <div className="admin-field">
              <label>
                Community Members
              </label>

              <input
                type="text"
                name="community"
                value={profileForm.community}
                onChange={handleProfileChange}
                placeholder="1000+"
              />
            </div>

            <div className="admin-field">
              <label>
                Educational Posts
              </label>

              <input
                type="text"
                name="educationPosts"
                value={profileForm.educationPosts}
                onChange={handleProfileChange}
                placeholder="100+"
              />
            </div>

            <div className="admin-field full-width">
              <label>
                Profile Photo
              </label>

              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleProfileImage}
              />

              <span className="upload-help">
                Upload profile photo. Maximum 2 MB.
              </span>
            </div>

            {profileForm.profileImage && (
              <div className="profile-upload-preview">
                <img
                  src={profileForm.profileImage}
                  alt="Profile Preview"
                />

                <span>
                  Profile Preview
                </span>
              </div>
            )}

            <button
              type="submit"
              className="add-reel-button"
            >
              Save Profile
            </button>
          </form>
        </section>

        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <p>
                PREVIEW
              </p>

              <h2>
                Current Profile
              </h2>
            </div>
          </div>

          <div className="profile-preview-card">
            <div className="profile-preview-image">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                />
              ) : (
                <span>
                  RT
                </span>
              )}
            </div>

            <div>
              <span className="admin-reel-category">
                {profile.title}
              </span>

              <h2>
                {profile.name}
              </h2>

              <p>
                {profile.bio}
              </p>
            </div>
          </div>
        </section>
      </>
    );
  };

  // ==================================================
  // INSTAGRAM REELS
  // ==================================================

  const renderReels = () => {
    return (
      <>
        <div className="admin-header">
          <div>
            <p className="admin-small-title">
              ADMIN PANEL
            </p>

            <h1>
              Instagram Reels
            </h1>
          </div>

          <a
            href="/"
            className="view-website"
          >
            View Website →
          </a>
        </div>

        <motion.section
          className="admin-section"
          initial={{
            opacity: 0,
            y: 25
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.5
          }}
        >
          <div className="admin-section-heading">
            <div>
              <p>
                INSTAGRAM CONTENT
              </p>

              <h2>
                Add Instagram Reel
              </h2>
            </div>
          </div>

          <form
            className="reel-form"
            onSubmit={handleAddReel}
          >
            <div className="admin-field">
              <label>
                Reel Title
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Today's Market Analysis"
              />
            </div>

            <div className="admin-field">
              <label>
                Category
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option>
                  Daily Market
                </option>

                <option>
                  Education
                </option>

                <option>
                  Trading Mindset
                </option>

                <option>
                  Trading Results
                </option>
              </select>
            </div>

            <div className="admin-field full-width">
              <label>
                Instagram Reel URL
              </label>

              <input
                type="url"
                name="url"
                value={form.url}
                onChange={handleChange}
                placeholder="https://www.instagram.com/reel/XXXXXXXX/"
              />
            </div>

            <div className="admin-field full-width">
              <label>
                Reel Cover Image
              </label>

              <input
                id="reelCover"
                type="file"
                accept="image/*"
                onChange={handleCoverImage}
              />

              <span className="upload-help">
                Upload Reel cover/screenshot. Maximum 2 MB.
              </span>
            </div>

            {form.coverImage && (
              <div className="cover-upload-preview">
                <img
                  src={form.coverImage}
                  alt="Reel Cover Preview"
                />

                <span>
                  Cover Preview
                </span>
              </div>
            )}

            <button
              type="submit"
              className="add-reel-button"
            >
              + Add Reel
            </button>
          </form>
        </motion.section>

        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <p>
                MANAGE CONTENT
              </p>

              <h2>
                Your Instagram Reels
              </h2>
            </div>

            <span className="reel-count">
              {reels.length} Reels
            </span>
          </div>

          {reels.length === 0 ? (
            <div className="empty-reels">
              <div className="empty-icon">
                ◎
              </div>

              <h3>
                No reels added yet
              </h3>

              <p>
                Add your first Instagram Reel using the form above.
              </p>
            </div>
          ) : (
            <div className="admin-reels-list">
              {reels.map((reel, index) => (
                <motion.div
                  className="admin-reel-card"
                  key={reel.id}
                  initial={{
                    opacity: 0,
                    y: 15
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  transition={{
                    delay: index * 0.05
                  }}
                >
                  <div className="admin-reel-thumb">
                    <img
                      src={reel.coverImage}
                      alt={reel.title}
                    />

                    <span>
                      ▶
                    </span>
                  </div>

                  <div className="admin-reel-details">
                    <span className="admin-reel-category">
                      {reel.category}
                    </span>

                    <h3>
                      {reel.title}
                    </h3>

                    <p>
                      {reel.url}
                    </p>

                    <small>
                      Added: {reel.createdAt}
                    </small>
                  </div>

                  <div className="admin-reel-actions">
                    <a
                      href={reel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-reel-button"
                    >
                      View
                    </a>

                    <button
                      className="delete-reel-button"
                      onClick={() =>
                        handleDelete(reel.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </>
    );
  };

  // ==================================================
  // TRADING RESULTS
  // ==================================================

  const renderResults = () => {
    return (
      <>
        <div className="admin-header">
          <div>
            <p className="admin-small-title">
              ADMIN PANEL
            </p>

            <h1>
              Trading Results
            </h1>
          </div>
        </div>

        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <p>
                PERFORMANCE
              </p>

              <h2>
                Trading Results
              </h2>
            </div>
          </div>

          <div className="trading-period-box">
            <h3>
              Weekly Performance
            </h3>

            <div className="results-grid">
              <div className="result-card">
                <span>
                  WEEKLY RESULT
                </span>

                <strong>
                  {tradingResults.weekly.result}
                </strong>
              </div>

              <div className="result-card">
                <span>
                  WIN RATE
                </span>

                <strong>
                  {tradingResults.weekly.winRate}
                </strong>
              </div>

              <div className="result-card">
                <span>
                  TOTAL TRADES
                </span>

                <strong>
                  {tradingResults.weekly.totalTrades}
                </strong>
              </div>
            </div>
          </div>

          <div className="trading-period-box">
            <h3>
              Monthly Performance
            </h3>

            <div className="results-grid">
              <div className="result-card">
                <span>
                  MONTHLY RESULT
                </span>

                <strong>
                  {tradingResults.monthly.result}
                </strong>
              </div>

              <div className="result-card">
                <span>
                  WIN RATE
                </span>

                <strong>
                  {tradingResults.monthly.winRate}
                </strong>
              </div>

              <div className="result-card">
                <span>
                  TOTAL TRADES
                </span>

                <strong>
                  {tradingResults.monthly.totalTrades}
                </strong>
              </div>
            </div>
          </div>

          <div className="trading-period-box">
            <h3>
              Yearly Performance
            </h3>

            <div className="results-grid">
              <div className="result-card">
                <span>
                  YEARLY RESULT
                </span>

                <strong>
                  {tradingResults.yearly.result}
                </strong>
              </div>

              <div className="result-card">
                <span>
                  WIN RATE
                </span>

                <strong>
                  {tradingResults.yearly.winRate}
                </strong>
              </div>

              <div className="result-card">
                <span>
                  TOTAL TRADES
                </span>

                <strong>
                  {tradingResults.yearly.totalTrades}
                </strong>
              </div>
            </div>
          </div>

          <form
            className="reel-form"
            onSubmit={handleSaveResults}
          >
            <div className="admin-field">
              <label>
                Weekly Result
              </label>

              <input
                type="text"
                value={tradingResults.weekly.result}
                onChange={(e) =>
                  setTradingResults({
                    ...tradingResults,
                    weekly: {
                      ...tradingResults.weekly,
                      result: e.target.value
                    }
                  })
                }
                placeholder="+3.8%"
              />
            </div>

            <div className="admin-field">
              <label>
                Weekly Win Rate
              </label>

              <input
                type="text"
                value={tradingResults.weekly.winRate}
                onChange={(e) =>
                  setTradingResults({
                    ...tradingResults,
                    weekly: {
                      ...tradingResults.weekly,
                      winRate: e.target.value
                    }
                  })
                }
                placeholder="76%"
              />
            </div>

            <div className="admin-field">
              <label>
                Weekly Total Trades
              </label>

              <input
                type="text"
                value={
                  tradingResults.weekly.totalTrades
                }
                onChange={(e) =>
                  setTradingResults({
                    ...tradingResults,
                    weekly: {
                      ...tradingResults.weekly,
                      totalTrades: e.target.value
                    }
                  })
                }
                placeholder="18"
              />
            </div>

            <div className="admin-field">
              <label>
                Monthly Result
              </label>

              <input
                type="text"
                value={
                  tradingResults.monthly.result
                }
                onChange={(e) =>
                  setTradingResults({
                    ...tradingResults,
                    monthly: {
                      ...tradingResults.monthly,
                      result: e.target.value
                    }
                  })
                }
                placeholder="+12.4%"
              />
            </div>

            <div className="admin-field">
              <label>
                Monthly Win Rate
              </label>

              <input
                type="text"
                value={
                  tradingResults.monthly.winRate
                }
                onChange={(e) =>
                  setTradingResults({
                    ...tradingResults,
                    monthly: {
                      ...tradingResults.monthly,
                      winRate: e.target.value
                    }
                  })
                }
                placeholder="78%"
              />
            </div>

            <div className="admin-field">
              <label>
                Monthly Total Trades
              </label>

              <input
                type="text"
                value={
                  tradingResults.monthly.totalTrades
                }
                onChange={(e) =>
                  setTradingResults({
                    ...tradingResults,
                    monthly: {
                      ...tradingResults.monthly,
                      totalTrades: e.target.value
                    }
                  })
                }
                placeholder="124"
              />
            </div>

            <div className="admin-field">
              <label>
                Yearly Result
              </label>

              <input
                type="text"
                value={
                  tradingResults.yearly.result
                }
                onChange={(e) =>
                  setTradingResults({
                    ...tradingResults,
                    yearly: {
                      ...tradingResults.yearly,
                      result: e.target.value
                    }
                  })
                }
                placeholder="+48.6%"
              />
            </div>

            <div className="admin-field">
              <label>
                Yearly Win Rate
              </label>

              <input
                type="text"
                value={
                  tradingResults.yearly.winRate
                }
                onChange={(e) =>
                  setTradingResults({
                    ...tradingResults,
                    yearly: {
                      ...tradingResults.yearly,
                      winRate: e.target.value
                    }
                  })
                }
                placeholder="81%"
              />
            </div>

            <div className="admin-field">
              <label>
                Yearly Total Trades
              </label>

              <input
                type="text"
                value={
                  tradingResults.yearly.totalTrades
                }
                onChange={(e) =>
                  setTradingResults({
                    ...tradingResults,
                    yearly: {
                      ...tradingResults.yearly,
                      totalTrades: e.target.value
                    }
                  })
                }
                placeholder="520"
              />
            </div>

            <button
              type="submit"
              className="add-reel-button"
            >
              Save Trading Results
            </button>
          </form>
        </section>
      </>
    );
  };

  // ==================================================
  // ENQUIRIES
  // ==================================================

  const renderEnquiries = () => {
    const newCount = enquiries.filter(
      (enquiry) =>
        enquiry.status === "New"
    ).length;

    return (
      <>
        <div className="admin-header">
          <div>
            <p className="admin-small-title">
              ADMIN PANEL
            </p>

            <h1>
              Enquiries
            </h1>
          </div>

          <a
            href="/"
            className="view-website"
          >
            View Website →
          </a>
        </div>

        <section className="admin-section enquiries-section">
          <div className="admin-section-heading enquiries-heading">
            <div>
              <p>
                1K CONTACT
              </p>

              <h2>
                Enquiry Inbox
              </h2>
            </div>

            <div className="enquiry-admin-summary">
              <span>
                {enquiries.length} Total
              </span>

              <strong>
                {newCount} New
              </strong>
            </div>
          </div>

          {enquiries.length === 0 ? (
            <div className="enquiry-empty-state">
              <div className="enquiry-empty-icon">
                1K
              </div>

              <h3>
                No enquiries yet
              </h3>

              <p>
                Customer enquiries submitted from the Contact form will appear here.
              </p>
            </div>
          ) : (
            <div className="enquiry-list">
              {enquiries.map((enquiry) => (
                <article
                  className={`enquiry-admin-card ${
                    enquiry.status === "New"
                      ? "is-new"
                      : ""
                  }`}
                  key={enquiry.id}
                >
                  <div className="enquiry-admin-top">
                    <div>
                      <span className="enquiry-admin-status">
                        {enquiry.status || "New"}
                      </span>

                      <h3>
                        {enquiry.name}
                      </h3>

                      <p>
                        {enquiry.createdAt}
                      </p>
                    </div>

                    <div className="enquiry-admin-actions">
                      {enquiry.status === "New" && (
                        <button
                          type="button"
                          className="enquiry-read-button"
                          onClick={() =>
                            markEnquiryRead(
                              enquiry.id
                            )
                          }
                        >
                          Mark Reviewed
                        </button>
                      )}

                      <button
                        type="button"
                        className="enquiry-delete-button"
                        onClick={() =>
                          deleteEnquiry(
                            enquiry.id
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="enquiry-admin-grid">
                    <div>
                      <span>
                        PHONE
                      </span>

                      <a
                        href={`tel:${enquiry.phone}`}
                      >
                        {enquiry.phone}
                      </a>
                    </div>

                    <div>
                      <span>
                        EMAIL
                      </span>

                      <a
                        href={`mailto:${enquiry.email}`}
                      >
                        {enquiry.email}
                      </a>
                    </div>

                    <div>
                      <span>
                        CITY
                      </span>

                      <strong>
                        {enquiry.city}
                      </strong>
                    </div>

                    <div>
                      <span>
                        EXPERIENCE
                      </span>

                      <strong>
                        {enquiry.experience}
                      </strong>
                    </div>
                  </div>

                  <div className="enquiry-admin-message">
                    <span>
                      MESSAGE
                    </span>

                    <p>
                      {enquiry.message}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}

          {enquiries.length > 0 && (
            <button
              type="button"
              className="enquiry-clear-all"
              onClick={clearAllEnquiries}
            >
              Clear All Enquiries
            </button>
          )}
        </section>
      </>
    );
  };

  // ==================================================
  // COMMUNITY
  // ==================================================

  const renderCommunity = () => {
    return (
      <>
        <div className="admin-header">
          <div>
            <p className="admin-small-title">
              ADMIN PANEL
            </p>

            <h1>
              Community
            </h1>
          </div>

          <a
            href="/"
            className="view-website"
          >
            View Website →
          </a>
        </div>

        <section className="admin-section community-manager-section">
          <div className="admin-section-heading">
            <div>
              <p>
                COMMUNITY CONTENT
              </p>

              <h2>
                Manage Community Section
              </h2>
            </div>
          </div>

          <form
            className="reel-form community-form"
            onSubmit={handleSaveCommunity}
          >
            <div className="admin-field">
              <label>
                Section Eyebrow
              </label>

              <input
                type="text"
                name="eyebrow"
                value={
                  communityForm.eyebrow
                }
                onChange={
                  handleCommunityChange
                }
                placeholder="JOIN THE COMMUNITY"
              />
            </div>

            <div className="admin-field">
              <label>
                Main Title
              </label>

              <input
                type="text"
                name="title"
                value={
                  communityForm.title
                }
                onChange={
                  handleCommunityChange
                }
                placeholder="Learn. Trade."
              />
            </div>

            <div className="admin-field">
              <label>
                Highlight Title
              </label>

              <input
                type="text"
                name="highlight"
                value={
                  communityForm.highlight
                }
                onChange={
                  handleCommunityChange
                }
                placeholder="Grow Together."
              />
            </div>

            <div className="admin-field">
              <label>
                Button Text
              </label>

              <input
                type="text"
                name="buttonText"
                value={
                  communityForm.buttonText
                }
                onChange={
                  handleCommunityChange
                }
                placeholder="Join Community →"
              />
            </div>

            <div className="admin-field full-width">
              <label>
                Community Description
              </label>

              <textarea
                name="description"
                value={
                  communityForm.description
                }
                onChange={
                  handleCommunityChange
                }
                rows="5"
                placeholder="Write your community description..."
              />
            </div>

            <div className="admin-field full-width">
              <label>
                Community Link
              </label>

              <input
                type="url"
                name="buttonUrl"
                value={
                  communityForm.buttonUrl
                }
                onChange={
                  handleCommunityChange
                }
                placeholder="https://t.me/yourcommunity"
              />

              <span className="upload-help">
                This link opens when visitors click the community button.
              </span>
            </div>

            <button
              type="submit"
              className="add-reel-button"
            >
              Save Community Section
            </button>
          </form>

          <div className="community-admin-grid community-admin-overview">
            <div className="community-admin-card">
              <span>
                COMMUNITY MEMBERS
              </span>

              <strong>
                {profile.community}
              </strong>
            </div>

            <div className="community-admin-card">
              <span>
                COMMUNITY STATUS
              </span>

              <strong>
                ACTIVE
              </strong>
            </div>

            <div className="community-admin-card">
              <span>
                CONTENT
              </span>

              <strong>
                LIVE
              </strong>
            </div>
          </div>
        </section>
      </>
    );
  };

  // ==================================================
  // MAIN CONTENT SWITCH
  // ==================================================

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfile();

      case "reels":
        return renderReels();

      case "results":
        return renderResults();

      case "community":
        return renderCommunity();

      case "enquiries":
        return renderEnquiries();

      default:
        return renderDashboard();
    }
  };

  // ==================================================
  // RETURN
  // ==================================================

  return (
    <div className="admin-page">
      {/* SIDEBAR */}

      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span>
            FX
          </span>

          {" "}ROYAL TRADER
        </div>

        <div className="admin-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`admin-menu-item ${
                activeTab === item.id
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveTab(item.id)
              }
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          className="admin-logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      {/* MAIN */}

      <main className="admin-main">
        {renderContent()}
      </main>
    </div>
  );
}

export default Admin;


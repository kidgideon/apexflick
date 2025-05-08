import React, { useEffect } from "react";

const NaijaNews = () => {
  useEffect(() => {
    // Inject Adsterra script
    const adsterraScript = document.createElement("script");
    adsterraScript.src = "//www.highperformanceformat.com/daf9a8fc35d5605fec1098d2ff2597fb/invoke.js";
    adsterraScript.async = true;
    document.getElementById("adsterra-ad").appendChild(adsterraScript);

  }, []);

  return (
    <div>
      <header style={styles.header}>
        <h1>NaijaNews</h1>
        <p>Your Trusted Source for Nigerian News</p>
        <div id="adsterra-ad"></div>
      </header>

      <nav style={styles.nav}>
        {["Home", "Politics", "Business", "Entertainment", "Sports", "Contact"].map((item, idx) => (
          <a href="#" key={idx} style={styles.navLink}>{item}</a>
        ))}
      </nav>

      <div style={styles.container}>
        <div style={styles.mainContent}>
          <article>
            <h2>ExxonMobil Announces $1.5 Billion Investment in Nigerian Oilfield</h2>
            <img src="/images/exxo.jpg" alt="ExxonMobil Oilfield" style={styles.articleImage} />
            <p>ExxonMobil has unveiled plans to invest $1.5 billion in its deepwater oil operations in Nigeria...</p>
          </article>

          <div id="monetag-ad" style={{ marginBottom: "30px" }}></div>

          <article>
            <h2>Nigerian Teen Sets World Record with Massive Painting</h2>
            <img src="/images/image.webp" alt="Teen Artist Painting" style={styles.articleImage} />
            <p>Fifteen-year-old Nigerian artist Kanyeyachukwu Tagbo-Okeke has set a new Guinness World Record...</p>
          </article>

          <article>
            <h2>Nigeria Approves $652 Million China Exim Bank Road Finance Package</h2>
            <img src="/images/china.avif" alt="Road Construction" style={styles.articleImage} />
            <p>Nigeria has approved a $652 million funding package from China Exim Bank for constructing a vital road project...</p>
          </article>
        </div>

        <div style={styles.sidebar}>
          <h3>Latest News</h3>
          <ul>
            <li><a href="#">Controversy Over Hijab Use in Nigerian Universities</a></li>
            <li><a href="#">Dangote Comments on U.S. Tariffs Impact</a></li>
            <li><a href="#">UN and Nigeria Launch $159 Million Food Security Plan</a></li>
            <li><a href="#">Boko Haram Insurgency: Recent Developments</a></li>
          </ul>

          <h3>Advertisement</h3>
          <div id="monetag-ad"></div>
        </div>
      </div>

      <footer style={styles.footer}>
        <p>&copy; 2025 NaijaNews. All rights reserved.</p>
      </footer>
    </div>
  );
};

const styles = {
  header: {
    backgroundColor: "#2c3e50",
    color: "#fff",
    padding: "20px 0",
    textAlign: "center",
  },
  nav: {
    backgroundColor: "#34495e",
    overflow: "hidden",
  },
  navLink: {
    float: "left",
    display: "block",
    color: "#ecf0f1",
    textAlign: "center",
    padding: "14px 16px",
    textDecoration: "none",
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    padding: "20px",
  },
  mainContent: {
    flex: 3,
    padding: "20px",
    backgroundColor: "#fff",
    marginRight: "20px",
  },
  sidebar: {
    flex: 1,
    padding: "20px",
    backgroundColor: "#fff",
  },
  articleImage: {
    maxWidth: "100%",
    height: "auto",
  },
  footer: {
    backgroundColor: "#2c3e50",
    color: "#ecf0f1",
    textAlign: "center",
    padding: "10px 0",
    marginTop: "20px",
  }
};

export default NaijaNews;

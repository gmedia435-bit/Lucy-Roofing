/**
 * Lucy Roofing LLC — Core Site Configuration
 * Single Source of Truth for SLAs, Business Contacts, Form Endpoints, and SEO parameters.
 */
const SITE_CONFIG = {
  business: {
    name: "Lucy Roofing LLC",
    legalName: "Lucy Roofing LLC",
    tagline: "Building Strong Roofs for a Stronger Tomorrow",
    phoneDisplay: "(956) 650-8277",
    phoneRaw: "+19566508277",
    email: "lucybella23@icloud.com",
    facebookUrl: "https://www.facebook.com/profile.php?id=100091633328010",
    serviceRegion: "Texas, USA",
    addressLocality: "Texas",
    addressRegion: "TX",
    addressCountry: "US",
    hoursDisplay: "Mon-Fri: 8:00 AM - 6:00 PM | Sat: 9:00 AM - 3:00 PM",
    experienceYears: "10+",
  },
  
  // Single Unified SLA Configuration (Cut filler & fixed inconsistencies)
  sla: {
    estimateTurnaround: "Within 1 Business Day",
    emergencyResponse: "Same-Day Emergency Assessment Available",
  },

  proof: {
    insuranceCOI: "Certificate of Insurance (COI) available immediately upon request for commercial bids.",
    references: "Commercial project manager & GC references available upon request.",
    projectGalleryStatus: "Real Commercial Crew Portfolio — Uploading latest jobsite documentation.",
  },

  seo: {
    canonicalUrl: "https://lucyroofingllc.com/",
    domain: "lucyroofingllc.com",
    ogImage: "https://lucyroofingllc.com/og-share-image.jpg",
    defaultLang: "en",
  },

  // Form Delivery Setup (Drop in your Formspree ID or serverless endpoint)
  formEndpoint: "https://formspree.io/f/YOUR_FORMSPREE_ID",
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SITE_CONFIG;
}

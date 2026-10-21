import { useEffect } from 'react';

const useSEO = ({ title, description, keywords }) => {
  useEffect(() => {
    const metaDescription = document.querySelector('meta[name="description"]');
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');

    if (title) {
      const fullTitle = `${title} | Infinity Roles`;
      document.title = fullTitle;
      if (ogTitle) ogTitle.setAttribute('content', fullTitle);
      
      // Handle Canonical URL (crucial for SEO to prevent duplicate content)
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', window.location.origin + window.location.pathname);
    }

    if (description) {
      if (metaDescription) metaDescription.setAttribute('content', description);
      if (ogDescription) ogDescription.setAttribute('content', description);
    }

    if (keywords) {
      if (metaKeywords) metaKeywords.setAttribute('content', keywords);
    }
  }, [title, description, keywords]);
};

export default useSEO;

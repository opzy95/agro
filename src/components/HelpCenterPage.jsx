import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from './Customer Dashboard/DashboardLayout';
import FarmerLayout from './Farmer Dashboard/FarmerLayout';
import { getCurrentUser } from '../services/userService';
import fieldImage from '../assets/Farmers working in field.png';
import farmImage from '../assets/Background Image.png';
import produceImage from '../assets/Image (1).png';
import orchardImage from '../assets/Background (1).png';
import './HelpCenterPage.css';

const categories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'rocket',
    description: 'Set up your account and get comfortable on HarvestHub.',
    keywords: 'account registration profile verify'
  },
  {
    id: 'for-farmers',
    title: 'For Farmers',
    icon: 'farmer',
    description: 'Manage listings, availability, pricing, and buyer enquiries.',
    keywords: 'farmer seller listing products price availability'
  },
  {
    id: 'for-buyers',
    title: 'For Buyers',
    icon: 'buyers',
    description: 'Find produce, compare listings, and connect with farmers.',
    keywords: 'buyer customer shop products sellers'
  },
  {
    id: 'products-listings',
    title: 'Products & Listings',
    icon: 'produce',
    description: 'Improve product details, photos, quantities, and prices.',
    keywords: 'product listing photo quantity price location edit remove'
  },
  {
    id: 'orders-payments',
    title: 'Orders & Payments',
    icon: 'orders',
    description: 'Understand order updates, payment status, and delivery.',
    keywords: 'order transaction payment delivery settlement refund'
  },
  {
    id: 'account-support',
    title: 'Account & Support',
    icon: 'shield',
    description: 'Get help with access, verification, and account safety.',
    keywords: 'account password login verification security support'
  }
];

const faqs = [
  {
    id: 'create-account',
    question: 'How do I create an account?',
    keywords: 'register signup customer farmer profile verify',
    answer: 'Choose Register, select whether you are joining as a farmer or buyer, and complete the account form. Verify your email and phone to finish setting up your profile.'
  },
  {
    id: 'list-products',
    question: 'How do I list my agricultural products?',
    keywords: 'farmer add create product listing sell upload',
    answer: 'Open Products from your farmer dashboard and select Add Product. Add a clear name, category, price, available quantity, and photos, then save your listing.'
  },
  {
    id: 'find-products',
    question: 'How do I find products on the website?',
    keywords: 'buyer search shop browse find produce',
    answer: 'Visit the Shop page to browse available listings. Search by product name and use the category filters to narrow down what you need.'
  },
  {
    id: 'contact-seller',
    question: 'How do I contact a farmer or buyer?',
    keywords: 'message seller buyer farmer contact enquiry',
    answer: 'Open the relevant order or product details and use the contact information shown there. Include the product name or order number so the other person can find the right transaction.'
  },
  {
    id: 'update-listing',
    question: 'How do I update my product price or availability?',
    keywords: 'edit product price quantity stock availability farmer',
    answer: 'Open Products in your farmer dashboard, select the listing, and update its details. Keep the available quantity current so buyers know what can still be ordered.'
  },
  {
    id: 'no-response',
    question: 'What should I do if a seller or buyer does not respond?',
    keywords: 'seller buyer response order help support',
    answer: 'Allow a reasonable time for a reply, then contact support with the product or order details if the issue is affecting an active transaction.'
  },
  {
    id: 'report-listing',
    question: 'How can I report a suspicious listing?',
    keywords: 'report suspicious scam product listing safety',
    answer: 'Email support with the listing link, the seller name, and a short description of your concern. Do not share payment details or verification codes in chat.'
  },
  {
    id: 'reset-password',
    question: 'How do I reset my password?',
    keywords: 'reset password login account forgot',
    answer: 'Choose Forgot Password on the sign-in page and follow the instructions sent to your registered email address.'
  }
];

const guides = [
  {
    id: 'account-guide',
    title: 'Getting started on HarvestHub',
    description: 'Set up your profile and choose the right account type.',
    readTime: '4 min read',
    image: farmImage,
    alt: 'A farm and fields at sunrise',
    customerTo: '/customer/settings',
    farmerTo: '/farmer/settings',
    keywords: 'account profile register setup'
  },
  {
    id: 'listing-guide',
    title: 'Create a clear product listing',
    description: 'Add useful photos, accurate quantities, and fair pricing.',
    readTime: '5 min read',
    image: fieldImage,
    alt: 'Farmers working among rows of crops',
    customerTo: '/customer/dashboard',
    farmerTo: '/farmer/products',
    keywords: 'farmer product listing photos quantity price'
  },
  {
    id: 'buyer-guide',
    title: 'Find the right produce',
    description: 'Search listings and compare what local farms offer.',
    readTime: '3 min read',
    image: produceImage,
    alt: 'Fresh vegetables arranged for sale',
    customerTo: '/shop',
    farmerTo: '/farmer/products',
    keywords: 'buyer search products shop compare'
  },
  {
    id: 'orders-guide',
    title: 'Keep orders moving smoothly',
    description: 'Follow order updates and keep communication clear.',
    readTime: '4 min read',
    image: orchardImage,
    alt: 'Rows of fruit trees on a farm',
    customerTo: '/customer/orders',
    farmerTo: '/farmer/orders',
    keywords: 'orders payments delivery tracking'
  }
];

const iconShapes = {
  rocket: <><path d="M8 15 4 16l1-4 8-8a3 3 0 0 1 4 4l-8 8Z"/><path d="m11 8 5 5M6 18l-2 2M9 19l-1 2M5 15l-2 1"/></>,
  farmer: <><path d="M3 17h18M5 17l1-7h8l2 7M7 10V7h5v3M17 13h3l1 4M2 17v2h20v-2M7 7a3 3 0 0 1 6 0"/><circle cx="8" cy="19" r="1"/><circle cx="18" cy="19" r="1"/></>,
  buyers: <><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
  produce: <><path d="M12 8c-2-4 1-6 4-6 0 3-1 5-4 6ZM12 8C9 4 6 5 5 7c2 2 4 2 7 1Z"/><path d="M12 8c-5 0-8 3-7 8 1 4 4 6 7 6s6-2 7-6c1-5-2-8-7-8Z"/><path d="M9 13v4M15 13v4"/></>,
  orders: <><path d="M6 3h12v18H6zM9 8h6M9 12h6M9 16h3"/><path d="M9 3V1h6v2"/></>,
  shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
  headset: <><path d="M4 13v-2a8 8 0 0 1 16 0v2"/><path d="M4 13h3v6H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 1-2ZM20 13h-3v6h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-1-2ZM17 20c-1 1-3 1-5 1"/></>
};

const HelpIcon = ({ name, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {iconShapes[name] || iconShapes.shield}
  </svg>
);

const getProfile = (response) => response?.user || response?.data?.user || response?.data || response || {};

const HelpCenterContent = ({ isFarmer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaq, setOpenFaq] = useState('create-account');
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredCategories = useMemo(() => categories.filter((category) => (
    !normalizedSearch || `${category.title} ${category.description} ${category.keywords}`.toLowerCase().includes(normalizedSearch)
  )), [normalizedSearch]);

  const filteredFaqs = useMemo(() => faqs.filter((faq) => (
    !normalizedSearch || `${faq.question} ${faq.answer} ${faq.keywords}`.toLowerCase().includes(normalizedSearch)
  )), [normalizedSearch]);

  const filteredGuides = useMemo(() => guides.filter((guide) => (
    !normalizedSearch || `${guide.title} ${guide.description} ${guide.keywords}`.toLowerCase().includes(normalizedSearch)
  )), [normalizedSearch]);

  const searchFor = (term) => {
    setSearchTerm(term);
    setOpenFaq('');
    document.getElementById('help-topics')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="help-center-page">
      <section className="help-hero" aria-labelledby="help-title">
        <div className="help-hero-copy">
          <span className="help-eyebrow"><span className="help-eyebrow-dot" /> HarvestHub support</span>
          <h1 id="help-title">How can we help today?</h1>
          <p>Find practical answers for selling, buying, and doing business with confidence.</p>
        </div>
        <form className="help-search" onSubmit={(event) => { event.preventDefault(); searchFor(searchTerm); }} role="search">
          <HelpIcon name="search" size={21} />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search answers, products, accounts, and more..."
            aria-label="Search help articles"
          />
          {searchTerm && <button type="button" className="help-clear-search" onClick={() => setSearchTerm('')} aria-label="Clear search">×</button>}
          <button className="help-search-submit" type="submit">Search</button>
        </form>
        <div className="help-popular-searches">
          <span>Popular:</span>
          {['Product listings', 'Payments', 'Order tracking', 'Account verification'].map((term) => (
            <button key={term} type="button" onClick={() => searchFor(term)}>{term}</button>
          ))}
        </div>
      </section>

      <section className="help-section" id="help-topics" aria-labelledby="help-topics-title">
        <div className="help-section-heading">
          <div>
            <span className="help-section-kicker">Find your way</span>
            <h2 id="help-topics-title">Browse by topic</h2>
            <p>Clear guidance for every step of the marketplace.</p>
          </div>
          {normalizedSearch && <button className="help-reset-search" type="button" onClick={() => setSearchTerm('')}>Clear search</button>}
        </div>
        {filteredCategories.length ? (
          <div className="help-category-grid">
            {filteredCategories.map((category) => (
              <article className="help-category" key={category.id}>
                <div className="help-category-icon"><HelpIcon name={category.icon} /></div>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
                <button
                  type="button"
                  className="help-text-link"
                  onClick={() => searchFor(category.id === 'for-farmers' ? 'farmer' : category.id === 'for-buyers' ? 'buyer' : category.title.split(' ')[0])}
                >
                  Explore topic <HelpIcon name="arrow" size={15} />
                </button>
              </article>
            ))}
          </div>
        ) : <p className="help-empty">No topics match “{searchTerm}”. Try another search.</p>}
      </section>

      <section className="help-section help-faq-section" aria-labelledby="help-faq-title">
        <div className="help-section-heading">
          <div>
            <span className="help-section-kicker">Quick answers</span>
            <h2 id="help-faq-title">Frequently asked questions</h2>
            <p>Answers to common questions from farmers and buyers.</p>
          </div>
          <span className="help-updated"><span /> Help for your next step</span>
        </div>
        <div className="help-faq-list">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openFaq === faq.id;
            return (
              <article className={`help-faq ${isOpen ? 'is-open' : ''}`} key={faq.id}>
                <h3>
                  <button type="button" aria-expanded={isOpen} onClick={() => setOpenFaq(isOpen ? '' : faq.id)}>
                    <span className="help-faq-number">{index + 1}</span>
                    <span>{faq.question}</span>
                    <span className="help-faq-chevron" aria-hidden="true">⌄</span>
                  </button>
                </h3>
                {isOpen && <div className="help-faq-answer"><p>{faq.answer}</p></div>}
              </article>
            );
          })}
          {!filteredFaqs.length && <p className="help-empty">No answers match “{searchTerm}”. Try a different phrase or contact support.</p>}
        </div>
      </section>

      <section className="help-section" aria-labelledby="help-guides-title">
        <div className="help-section-heading">
          <div>
            <span className="help-section-kicker">Learn at your pace</span>
            <h2 id="help-guides-title">Guides for the marketplace</h2>
            <p>Practical next steps for making HarvestHub work for you.</p>
          </div>
          <span className="help-guide-count">{filteredGuides.length} {filteredGuides.length === 1 ? 'guide' : 'guides'}</span>
        </div>
        {filteredGuides.length ? (
          <div className="help-guide-grid">
            {filteredGuides.map((guide) => (
              <article className="help-guide" key={guide.id}>
                <Link to={isFarmer ? guide.farmerTo : guide.customerTo} className="help-guide-image-link" aria-label={`Open ${guide.title}`}>
                  <img src={guide.image} alt={guide.alt} />
                  <span>{guide.readTime}</span>
                </Link>
                <div className="help-guide-copy">
                  <h3>{guide.title}</h3>
                  <p>{guide.description}</p>
                  <Link className="help-text-link" to={isFarmer ? guide.farmerTo : guide.customerTo}>Open guide <HelpIcon name="arrow" size={15} /></Link>
                </div>
              </article>
            ))}
          </div>
        ) : <p className="help-empty">No guides match “{searchTerm}”.</p>}
      </section>

      <section className="help-contact" aria-labelledby="help-contact-title">
        <div className="help-contact-copy">
          <span className="help-section-kicker">Human support</span>
          <h2 id="help-contact-title">Still need a hand?</h2>
          <p>Tell us what you’re working through. Include an order number or listing link when it helps us understand the issue.</p>
          <a className="help-contact-primary" href="mailto:support@harvesthub.ng?subject=HarvestHub%20support%20request">
            <HelpIcon name="headset" size={17} /> Contact support
          </a>
        </div>
        <div className="help-contact-options">
          <a className="help-contact-option" href="mailto:support@harvesthub.ng?subject=HarvestHub%20support%20request">
            <span className="help-contact-icon"><HelpIcon name="mail" /></span>
            <span><strong>Support request</strong><small>Send a detailed message to our team.</small></span>
            <HelpIcon name="arrow" size={16} />
          </a>
          <a className="help-contact-option" href="mailto:support@harvesthub.ng">
            <span className="help-contact-icon"><HelpIcon name="headset" /></span>
            <span><strong>Email support</strong><small>support@harvesthub.ng</small></span>
            <HelpIcon name="arrow" size={16} />
          </a>
        </div>
      </section>
    </div>
  );
};

const HelpCenterPage = () => {
  const [profile, setProfile] = useState(null);
  const [isFarmer, setIsFarmer] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getCurrentUser()
      .then((response) => {
        if (!isMounted) return;
        const user = getProfile(response);
        const image = typeof user.profileImage === 'string'
          ? user.profileImage
          : user.profileImage?.url || user.profileImage?.secure_url || user.profileImageUrl || user.image || null;
        setProfile({
          name: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.name || 'Farmer',
          farmName: user.farmName || user.businessName || 'Farm profile',
          avatar: image,
          profileImage: image,
          verificationStatus: user.verificationStatus || (user.isVerified ? 'verified' : 'not_verified')
        });
        setIsFarmer(String(user.role || '').toLowerCase() === 'farmer');
      })
      .catch(() => {
        if (isMounted) setProfile({ name: 'Farmer', farmName: 'Farm profile', avatar: null });
      });

    return () => { isMounted = false; };
  }, []);

  if (!profile) {
    return <div className="help-center-loading" role="status">Loading Help Center...</div>;
  }

  return isFarmer ? (
    <FarmerLayout farmer={profile} title="Help Center" showSearch={false} showNotifications={true}>
      <HelpCenterContent isFarmer />
    </FarmerLayout>
  ) : (
    <DashboardLayout title="Help Center" showSearch={true} showNotifications={true}>
      <HelpCenterContent isFarmer={false} />
    </DashboardLayout>
  );
};

export default HelpCenterPage;
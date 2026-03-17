/**
 * Star Hi Herbs - Type Definitions
 *
 * Lightweight file containing only type/interface exports.
 * Client components should import types from here instead of @/data
 * to avoid bundling the entire 645KB data file into the browser.
 */

/**
 * Base interface for all entities that would have database IDs
 */
export interface BaseEntity {
  id: string | number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Product Category
 */
export interface ProductCategory extends BaseEntity {
  slug: string;
  name: string;
  description: string;
  image: string;
  imageFallback?: string;
  heroImage?: string;
  heroImageFallback?: string;
  homepageImage?: string;
  homepageImageFallback?: string;
  count?: number;
  longDescription?: any;
  faqs?: ProductFAQ[];
  products?: Product[];
}

/**
 * Product
 */
export interface Product extends BaseEntity {
  slug: string;
  name: string;
  categoryId: string;
  categorySlug?: string;
  categoryName?: string;
  standardization: string;
  commonName?: string;
  latinName?: string;
  plantPart?: string;
  moq?: string;
  image: string;
  imageFallback?: string;
  gallery?: string[];
  certifications: string[];
  certificationIcons?: { name: string; image: string }[];
  description?: string;
  shortDescription?: string;
  benefits?: string[];
  specifications?: {
    appearance?: string;
    solubility?: string;
    particleSize?: string;
    heavyMetals?: string;
    shelfLife?: string;
    storage?: string;
    activeCompounds?: string;
    standardization?: string;
    form?: string;
    testing?: string;
    [key: string]: string | undefined;
  };
  applications?: string[];
  documents?: ProductDocument[];
  variants?: { name: string; specDocumentUrl?: string }[];
  research?: string;
  featured?: boolean;
  supplierInfo?: {
    points: string[];
  };
  productionDetails?: {
    description: string;
    image: string;
  };
  packaging?: {
    description: string;
    image: string;
  };
  factory?: {
    description: string;
    image: string;
  };
  certificationsSection?: {
    description: string;
    image: string;
  };
  events?: {
    description: string;
    image: string;
  };
  faqs?: ProductFAQ[];
  isParentProduct?: boolean;
  childProducts?: string[];
  parentProductId?: string;
  indications?: string[];
  productType?: 'standard' | 'branded' | 'vitamin-mineral';
  brandLogo?: string;
  clinicalResearch?: {
    title: string;
    description: string;
    studies: {
      title: string;
      description: string;
      link?: string;
      image?: string;
    }[];
  };
  healthClaims?: {
    title: string;
    claims: string[];
  };
  whitepaper?: {
    title: string;
    description: string;
    link: string;
    image?: string;
  };
  mechanism?: {
    title: string;
    description: string;
    image?: string;
  };
  sustainability?: {
    title: string;
    description: string;
    points?: string[];
    image?: string;
  };
  whyChoose?: {
    title: string;
    description: string;
    points: string[];
    image?: string;
  };
  productIndications?: {
    title: string;
    description?: string;
    indications: {
      name: string;
      icon: string;
      description?: string;
    }[];
  };
  productApplications?: {
    title: string;
    description?: string;
    applications: {
      name: string;
      icon: string;
      description?: string;
    }[];
  };
  probioticDetails?: {
    sporesPerGram: string;
    method: string;
  };
}

/**
 * Product Document
 */
export interface ProductDocument extends BaseEntity {
  name: string;
  size: string;
  url?: string;
  fileType?: string;
}

/**
 * Product FAQ
 */
export interface ProductFAQ extends BaseEntity {
  question: string;
  answer: string;
  category?: string;
}

/**
 * News/Update Item
 */
export interface NewsItem extends BaseEntity {
  title: string;
  date: string;
  image: string;
  excerpt: string;
  category: string;
  url?: string;
}

/**
 * Certification
 */
export interface Certification extends BaseEntity {
  name: string;
  description: string;
  image: string;
}

/**
 * Location
 */
export interface Location extends BaseEntity {
  name: string;
  country?: string;
  type: string;
  position: {
    left: string;
    top: string;
  };
  details: string;
  address?: string;
  phone?: string;
  email?: string;
}

/**
 * Continent
 */
export interface Continent extends BaseEntity {
  name: string;
  locations: number[] | string[];
}

/**
 * Testimonial
 */
export interface Testimonial extends BaseEntity {
  quote: string;
  author: string;
  company: string;
  image?: string;
}

/**
 * Blog Author
 */
export interface BlogAuthor extends BaseEntity {
  name: string;
  role: string;
  image: string;
  bio: string;
  certificates: string[];
}

/**
 * Blog Category
 */
export interface BlogCategory extends BaseEntity {
  name: string;
  slug: string;
  description: string;
}

/**
 * Blog Tag
 */
export interface BlogTag extends BaseEntity {
  name: string;
  slug: string;
}

/**
 * Table of Contents Item
 */
export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Blog Post (full)
 */
export interface BlogPost extends BaseEntity {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  publishedAt: string;
  updatedAt?: string;
  authorId: string | number;
  author?: BlogAuthor;
  reviewerId?: string | number;
  reviewer?: BlogAuthor;
  categoryId: string | number;
  category?: BlogCategory;
  tagIds: number[];
  tags?: BlogTag[];
  tableOfContents: TOCItem[];
  readTime: number;
}

/**
 * Award Item (alias for Award, used by AwardsSection)
 */
export type AwardItem = Award;

/**
 * Sustainability Initiative
 */
export interface SustainabilityInitiative extends BaseEntity {
  title: string;
  description: string;
  icon: string;
  stat: string;
  label: string;
}

/**
 * Award
 */
export interface Award extends BaseEntity {
  title: string;
  year: string;
  description: string;
  image: string;
}

/**
 * Event
 */
export interface Event extends BaseEntity {
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  city: string;
  country: string;
  description: string;
  image: string;
  boothNumber?: string;
  website?: string;
  upcoming: boolean;
}

/**
 * Job Opening
 */
export interface JobOpening extends BaseEntity {
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  postedDate: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  qualifications: string[];
  benefits: string[];
  isActive: boolean;
}

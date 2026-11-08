export interface SampleItem {
  id: string;
  title: string;
  category: string;
  text: string;
}

export const SAMPLE_TEXTS: SampleItem[] = [
  {
    id: 'essay',
    title: 'Design & Craftsmanship',
    category: 'Essay',
    text: `Good design is not merely what it looks like and feels like. Design is how it works. When we examine great typography, architectural proportion, and software architecture, we discover a shared commitment to clarity over complexity.

Every extraneous element eliminated is an invitation for the core message to breathe. In an era dominated by superficial noise, restrained craftsmanship commands respect through purposeful intent and enduring utility.`
  },
  {
    id: 'social',
    title: 'Product Announcement',
    category: 'Social Post',
    text: `We are thrilled to unveil WordCounter Pro: a lightning-fast, privacy-first text analysis suite built for writers, editors, and creators.

Key highlights:
- Real-time word and character statistics
- Deep letter & character density distribution
- Speaking and reading speed benchmarks
- Zero telemetry, 100% in-browser processing

Try it today and elevate your writing workflow! 🚀`
  },
  {
    id: 'speech',
    title: 'Curiosity & Discovery',
    category: 'Keynote Excerpt',
    text: `The future belongs to those who ask better questions, not merely those who have memorized the old answers. Throughout human history, every major leap in science, art, and philosophy originated not from unyielding certainty, but from a persistent willingness to wonder what lies just beyond the horizon. 

Let us build tools that sharpen human reasoning rather than dull it. Let us celebrate the precision of language, the elegance of structure, and the boundless potential of curious minds working in unison.`
  },
  {
    id: 'bio',
    title: 'Executive Biography',
    category: 'Professional Bio',
    text: `Elena Vance is a principal product designer and systems architect with over twelve years of experience building mission-critical software. Her work bridges human-computer interaction, cognitive accessibility, and high-performance web engineering. She holds a Master of Science in Human Factors from Stanford University and frequently lectures on algorithmic transparency and responsive typography.`
  }
];

export const SOCIAL_PRESETS = [
  {
    id: 'twitter',
    name: 'X / Twitter Post',
    platform: 'X',
    limit: 280,
    description: 'Standard post limit for free accounts',
    icon: 'twitter'
  },
  {
    id: 'instagram',
    name: 'Instagram Caption',
    platform: 'Instagram',
    limit: 2200,
    description: 'Maximum caption length per post',
    icon: 'instagram'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Post',
    platform: 'LinkedIn',
    limit: 3000,
    description: 'Optimal post length for feed engagement',
    icon: 'linkedin'
  },
  {
    id: 'pinterest',
    name: 'Pinterest Description',
    platform: 'Pinterest',
    limit: 500,
    description: 'Standard pin description character limit',
    icon: 'pinterest'
  },
  {
    id: 'yt_title',
    name: 'YouTube Title',
    platform: 'YouTube',
    limit: 100,
    description: 'Maximum length before truncation in search',
    icon: 'youtube'
  },
  {
    id: 'sms',
    name: 'Single SMS Segment',
    platform: 'SMS',
    limit: 160,
    description: 'Single standard GSM SMS segment limit',
    icon: 'message'
  }
];

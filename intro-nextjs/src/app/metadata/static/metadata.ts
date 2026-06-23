import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Tentang Kami | Purwadhika Digital School',
    template: '%s | Purwadhika',
  },
  description:
    'Purwadhika adalah sekolah teknologi digital yang mempersiapkan talenta masa depan melalui program Bootcamp dan pelatihan digital.',
  keywords: [
    'Purwadhika',
    'Sekolah Digital',
    'Bootcamp Coding',
    'UI UX',
    'Data Science',
    'Digital Marketing',
    'Belajar Programming',
    'Tech School Indonesia',
  ],
  authors: [
    { name: 'Purwadhika Team', url: 'https://purwadhika.com/about-us' },
  ],
  creator: 'Purwadhika Digital School',
  publisher: 'Purwadhika Digital School',
  robots: {
    index: true,
    follow: true,
  },
  viewport: 'width=device-width, initial-scale=1.0',
  themeColor: '#E60023',
  openGraph: {
    title: 'Tentang Purwadhika Digital School',
    description:
      'Pelajari lebih lanjut tentang misi Purwadhika dalam mencetak talenta digital terbaik di Indonesia.',
    url: 'https://purwadhika.com/about-us',
    siteName: 'Purwadhika Digital School',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: 'https://purwadhika.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FthumbnailVideo.46d1e19b.jpg&w=1920&q=75',
        width: 1200,
        height: 630,
        alt: 'Purwadhika Digital School',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tentang Purwadhika',
    description:
      'Sekolah teknologi digital terbaik untuk karier masa depan di bidang IT dan digital marketing.',
    site: '@purwadhika',
    creator: '@purwadhika',
    images: [
      'https://purwadhika.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FthumbnailVideo.46d1e19b.jpg&w=1920&q=75',
    ],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "IceBreak AI - 3秒生成破冰开场白，让对方想回复你",
    template: "%s | IceBreak AI"
  },
  description: "粘贴对方profile，AI自动分析并生成最佳开场白。已帮助12,847人成功破冰，平均成功率78%。免费使用，无需注册。",
  keywords: ["破冰", "开场白", "社交", "AI助手", "约会", "聊天", "话题生成", "icebreaker", "conversation starter"],
  authors: [{ name: "IceBreak AI Team" }],
  creator: "IceBreak AI",
  publisher: "IceBreak AI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://icebreak.ai",
    title: "IceBreak AI - 3秒生成破冰开场白，让对方想回复你",
    description: "粘贴对方profile，AI自动分析并生成最佳开场白。已帮助12,847人成功破冰，平均成功率78%。",
    siteName: "IceBreak AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "IceBreak AI - AI驱动的破冰助手"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "IceBreak AI - 3秒生成破冰开场白",
    description: "粘贴对方profile，AI自动分析并生成最佳开场白。平均成功率78%，免费使用。",
    images: ["/og-image.png"],
    creator: "@icebreak_ai"
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" }
    ]
  },
  manifest: "/manifest.json",
  metadataBase: new URL('https://icebreak.ai'),
  alternates: {
    canonical: "/"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'IceBreak AI',
    description: '粘贴对方profile，AI自动分析并生成最佳开场白。已帮助12,847人成功破冰，平均成功率78%。',
    url: 'https://icebreak.ai',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CNY'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '12847',
      bestRating: '5',
      worstRating: '1'
    },
    author: {
      '@type': 'Organization',
      name: 'IceBreak AI Team'
    }
  };

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

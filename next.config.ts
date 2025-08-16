import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://images.unsplash.com/**')],
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find(
      (rule: { test?: { test?: (path: string) => boolean } }) =>
        rule.test?.test?.('.svg'),
    )

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /url/ },
        use: ['@svgr/webpack'],
      },
    )

    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.ts',
      },
    },
  },
  experimental: {
    viewTransition: true,
  },
}

export default nextConfig

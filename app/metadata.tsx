import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'VoiceDAO - Governance Dashboard',
    description: 'Decentralized governance powered by voice',
    generator: 'v0.app',
    icons: {
        icon: [
            { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
            { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
            { url: '/icon.svg', type: 'image/svg+xml' },
        ],
        apple: '/apple-icon.png',
    },
}
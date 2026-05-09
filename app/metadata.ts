import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'VoiceDAO - Governance Dashboard',
    description: 'Decentralized governance powered by voice',
    icons: {
        icon: [
            { url: '/apple-touch-icon.png', media: '(prefers-color-scheme: light)' },
            { url: '/apple-touch-icon.png', media: '(prefers-color-scheme: dark)' },
            { url: '/apple-touch-icon.png', type: 'image/png' },
        ],
        apple: '/apple-touch-icon.png',
        shortcut: '/favicon.ico',
    },
}

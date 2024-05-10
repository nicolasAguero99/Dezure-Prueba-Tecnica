import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dezure - Transcripción prueba técnica',
  description: 'Transcripción de prueba técnica para Dezure, hecha por Nicolás Agüero'
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>): JSX.Element {
  return (
    <html lang="es">
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <body className={`${inter.className} bg-bckg`}>{children}</body>
    </html>
  )
}

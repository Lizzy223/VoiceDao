"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  // Wallet, 
  Menu,
  X }
   from "lucide-react"
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export function Navbar() {
  // const [isConnected, setIsConnected] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5 text-primary-foreground"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            </div>
            <span className="text-xl font-bold text-foreground">VoiceDAO</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Proposals
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Treasury
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Members
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Settings
            </a>
          </div>

          {/* Connect Wallet Button */}
          <div className="flex items-center gap-4">
            {/* <Button
              onClick={() => setIsConnected(!isConnected)}
              className={
                isConnected
                  ? "bg-accent text-accent-foreground hover:bg-accent/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }
            >
              <Wallet className="mr-2 h-4 w-4" />
              {isConnected ? "0x7a3...4f2e" : "Connect Wallet"}
            </Button> */}
            <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700" />
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-3">
              <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2">
                Proposals
              </a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2">
                Treasury
              </a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2">
                Members
              </a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2">
                Settings
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

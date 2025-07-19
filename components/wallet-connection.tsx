"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, LogOut, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface WalletConnectionProps {
  account: string
  setAccount: (account: string) => void
}

export default function WalletConnection({ account, setAccount }: WalletConnectionProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState("")

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      setError("MetaMask is not installed. Please install MetaMask to continue.")
      return
    }

    setIsConnecting(true)
    setError("")

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        setAccount(accounts[0])

        // Switch to Goerli testnet
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x5" }], // Goerli testnet
          })
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            // Network not added, add it
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x5",
                  chainName: "Goerli Test Network",
                  nativeCurrency: {
                    name: "Goerli ETH",
                    symbol: "GoerliETH",
                    decimals: 18,
                  },
                  rpcUrls: ["https://goerli.infura.io/v3/"],
                  blockExplorerUrls: ["https://goerli.etherscan.io/"],
                },
              ],
            })
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet")
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAccount("")
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          setAccount("")
        } else {
          setAccount(accounts[0])
        }
      })

      window.ethereum.on("chainChanged", () => {
        window.location.reload()
      })
    }
  }, [setAccount])

  if (error) {
    return (
      <Alert className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (account) {
    return (
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          🟢 Connected
        </Badge>
        <span className="text-sm font-mono">{formatAddress(account)}</span>
        <Button variant="outline" size="sm" onClick={disconnectWallet}>
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={connectWallet}
      disabled={isConnecting}
      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
    >
      <Wallet className="w-4 h-4 mr-2" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}

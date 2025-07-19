"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Wallet,
  Vote,
  Users,
  Shield,
  Zap,
  Eye,
} from "lucide-react"
import WalletConnection from "@/components/wallet-connection"
import QuizCreator from "@/components/quiz-creator"
import StudentVoting from "@/components/student-voting"
import ResultsDisplay from "@/components/results-display"

export default function HomePage() {
  const [account, setAccount] = useState<string>("")
  const [userRole, setUserRole] = useState<"teacher" | "student" | null>(null)
  const [activeQuiz, setActiveQuiz] = useState<any>(null)

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">QuizChain</h1>
                <p className="text-sm text-gray-600">Decentralized Classroom Voting</p>
              </div>
            </div>
            <WalletConnection account={account} setAccount={setAccount} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {!account && (
        <section className="py-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <div className="mb-8">
              <Badge className="mb-4 bg-blue-600 text-white">
                🚀 Powered by Blockchain
              </Badge>
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Decentralized Classroom{" "}
                <span className="text-blue-700">Quiz</span>{" "}
                <span className="text-purple-700">System</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Revolutionary quiz platform that puts voting power in students' hands. Transparent, secure,
                and immutable results powered by blockchain technology.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="border shadow-lg bg-white">
                <CardHeader className="text-center">
                  <Shield className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                  <CardTitle>Secure Voting</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Anonymous and secure student voting using crypto wallets</p>
                </CardContent>
              </Card>

              <Card className="border shadow-lg bg-white">
                <CardHeader className="text-center">
                  <Eye className="w-12 h-12 mx-auto text-purple-600 mb-4" />
                  <CardTitle>Transparent Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Real-time tallying with blockchain verification</p>
                </CardContent>
              </Card>

              <Card className="border shadow-lg bg-white">
                <CardHeader className="text-center">
                  <Zap className="w-12 h-12 mx-auto text-green-600 mb-4" />
                  <CardTitle>Instant Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Immediate results and immutable record keeping</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Wallet className="w-5 h-5 mr-2" />
                Connect Wallet to Start
              </Button>
              <Button size="lg" variant="outline">
                <Users className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Main Application */}
      {account && (
        <main className="container mx-auto px-4 py-8">
          {!userRole && (
            <Card className="max-w-md mx-auto">
              <CardHeader className="text-center">
                <CardTitle>Select Your Role</CardTitle>
                <CardDescription>Choose how you want to use QuizChain</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" onClick={() => setUserRole("teacher")}>
                  👩‍🏫 I'm a Teacher
                </Button>
                <Button className="w-full" variant="outline" onClick={() => setUserRole("student")}>
                  🎓 I'm a Student
                </Button>
              </CardContent>
            </Card>
          )}

          {userRole === "teacher" && (
            <div className="space-y-8">
              <QuizCreator account={account} onQuizCreated={setActiveQuiz} />
              {activeQuiz && <ResultsDisplay quiz={activeQuiz} />}
            </div>
          )}

          {userRole === "student" && <StudentVoting account={account} />}
        </main>
      )}

      {/* Footer */}
      <footer className="border-t bg-white mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">Built with Next.js, Tailwind CSS, and Ethereum</p>
            <p className="text-sm">🔗 Secured by Blockchain Technology</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

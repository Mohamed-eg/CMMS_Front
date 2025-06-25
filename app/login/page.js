"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Fuel, Eye, EyeOff } from "lucide-react"
import { authAPI } from "@/lib/api/auth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log("🔐 Attempting login with:", { email, password: "***" })
      console.log("📡 API URL:", "https://cmms-back.vercel.app/api/auth/login")

      // Call the real API
      const response = await authAPI.login(email, password)

      console.log("✅ Login successful:", response)
      setSuccess(true)

      // Store authentication data
      if (response.token) {
        localStorage.setItem("authToken", response.token)
      }

      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user))
      }

      console.log("✅ Login successful, redirecting to dashboard...")

      // Add a small delay to ensure localStorage is saved
      setTimeout(() => {
        router.push("/dashboard")
      }, 100)
    } catch (error) {
      console.error("❌ Login error:", error.message)
      setError(error.message)
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Fuel className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">CMMS Login</CardTitle>
          <CardDescription>Gas Station Maintenance Management System</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <AlertDescription>✅ Login successful! Redirecting to dashboard...</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <div className="text-sm text-gray-600">
              <p className="mb-2">🔗 Connected to Backend API</p>
              <p className="text-xs text-gray-500">Server: cmms-back.vercel.app</p>
            </div>
          </div>

          {/* Development info - remove in production */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
            <p className="font-semibold mb-1">API Integration Active:</p>
            <p>• POST /api/auth/login</p>
            <p>• Real-time authentication</p>
            <p>• Error handling for email/password</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Github } from "lucide-react"
import { motion } from "framer-motion"
import { signIn } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { LoginSchema } from "@/lib/validations/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

type FormValues = z.infer<typeof LoginSchema>

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [authError, setAuthError] = React.useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: FormValues) {
    setIsLoading(true)
    setAuthError(null)

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setAuthError("Invalid email or password. Please try again.")
        toast({
          title: "Authentication failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        })
        return
      }

      if (result?.ok) {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      console.error("Login error:", error)
      setAuthError("Something went wrong. Please try again.")
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubLogin = () => {
    setAuthError(null)
    signIn("github", { callbackUrl: "/dashboard" })
  }

  return (
    <div className="grid gap-6">
      {authError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="name@example.com" 
                    {...field} 
                    className={authError ? "border-red-500 focus-visible:ring-red-500" : ""}
                    onChange={(e) => {
                      field.onChange(e)
                      setAuthError(null)
                    }}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    {...field}
                    className={authError ? "border-red-500 focus-visible:ring-red-500" : ""}
                    onChange={(e) => {
                      field.onChange(e)
                      setAuthError(null)
                    }}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <Button variant="outline" type="button" onClick={handleGithubLogin} disabled={isLoading}>
        <Github className="mr-2 h-4 w-4" />
        GitHub
      </Button>
    </div>
  )
}

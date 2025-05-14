"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Github } from "lucide-react"
import { motion } from "framer-motion"
import { signIn } from "next-auth/react"
import bcrypt from "bcryptjs"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { RegisterSchema } from "@/lib/validations/auth"
import { db } from "@/lib/db"

type FormValues = z.infer<typeof RegisterSchema>

export function SignUpForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: FormValues) {
    setIsLoading(true)

    try {
      console.log("Starting signup process...")
      console.log("Form data:", { ...data, password: "[REDACTED]" })
      
      // Validate form data
      const validationResult = RegisterSchema.safeParse(data)
      if (!validationResult.success) {
        console.error("Form validation failed:", validationResult.error)
        toast({
          title: "Validation Error",
          description: "Please check your input and try again.",
          variant: "destructive",
        })
        return
      }

      // Create new user
      console.log("Creating new user...")
      const hashedPassword = await bcrypt.hash(data.password, 10)

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: hashedPassword,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create account")
      }

      const newUser = await response.json()
      console.log("User created successfully:", { id: newUser.id, email: newUser.email })

      // Sign in the new user
      console.log("Attempting to sign in...")
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (!result?.ok) {
        console.error("Sign in failed after registration:", result?.error)
        toast({
          title: "Account Created",
          description: "Your account was created successfully. Please try logging in.",
          variant: "default",
        })
        router.push("/login")
        return
      }

      console.log("Sign in successful, redirecting to dashboard...")
      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      console.error("Signup error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGithubSignUp = () => {
    signIn("github", { callbackUrl: "/dashboard" })
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
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
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
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
      <Button variant="outline" type="button" onClick={handleGithubSignUp} disabled={isLoading}>
        <Github className="mr-2 h-4 w-4" />
        GitHub
      </Button>
    </div>
  )
}

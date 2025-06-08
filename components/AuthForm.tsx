'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from '@/firebase/client'

import { signIn, signUp } from '@/lib/actions/auth.action'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormField from './FormField'

const authFormSchema = (type: FormType) => {
  return z.object({
    name:
      type === 'sign-up'
        ? z.string().min(3, { message: 'Name must be at least 3 characters.' })
        : z.string().optional(),
    email: z
      .string({ message: 'Email is required.' })
      .email({ message: 'Email format is invalid.' }),
    password:
      type === 'sign-up'
        ? z
            .string()
            .min(8, { message: 'Password must be at least 8 characters' })
        : z.string().min(1, { message: 'Password is required' }),
  })
}

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter()
  const formSchema = authFormSchema(type)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // SIGN UP
      if (type === 'sign-up') {
        const { name, email, password } = values

        const userCrededentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        )

        const response = await signUp({
          uid: userCrededentials.user.uid,
          name: name!,
          email,
          password,
        })

        if (!response?.success) {
          toast.error(response?.message)
          return
        }

        toast.success('Account created successfully. Please sign in.')
        router.push('/sign-in')
      } else {
        // SIGN IN
        const { email, password } = values

        const userCredentials = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        )

        const idToken = await userCredentials.user.getIdToken(true)

        if (!idToken) {
          toast.error('Sign in failed')
          return
        }

        await signIn({
          email,
          idToken,
        })

        toast.success('Signed in successfully')
        router.push('/')
      }
    } catch (error: any) {
      console.error('Error signing up a user ', error)

      if (error.code === 'auth/email-already-in-use') {
        return toast.error('This email is already in use.')
      }

      if (error.code === 'auth/invalid-credential') {
        return toast.error('Invalid email or password')
      }

      toast.error('Try to refresh your page and sign in again.')
    }
  }

  const isSignIn = type === 'sign-in'

  useEffect(() => {
    signOut(auth)
  }, [])

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="card flex flex-col gap-6 px-10 py-14">
        <div className="flex flex-row justify-center gap-2">
          <Image src="/logo.png" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">Techviu</h2>
        </div>

        <h3 className="text-center">Practice job interview with AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="form mt-4 w-full space-y-6"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your name"
              />
            )}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />
            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Your password"
              type="password"
            />

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="btn"
            >
              {isSignIn ? 'Sign in' : 'Create an Account'}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          {isSignIn ? 'No account yet?' : 'Have an account already?'}
          <Link
            href={!isSignIn ? '/sign-in' : '/sign-up'}
            className="text-user-primary ml-1 font-bold"
          >
            {!isSignIn ? 'Sign in' : 'Sign up'}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AuthForm

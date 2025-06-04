'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormField from './FormField'

const authFormSchema = (type: FormType) => {
  // TO DO: Add error message for each input
  return z.object({
    name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === 'sign-up') {
        toast.success('Account created successfully. Please sign in.')
        router.push('/sign-in')
      } else {
        toast.success('Signed in successfully')
        router.push('/')
      }
    } catch (error) {
      // TO DO: Update to user-friendly error message
      console.error(error)
      toast.error(`There was an error: ${error}`)
    }
  }

  const isSignIn = type === 'sign-in'

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="card flex flex-col gap-6 px-10 py-14">
        <div className="flex flex-row justify-center gap-2">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">Intervium</h2>
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

            <Button type="submit" className="btn">
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

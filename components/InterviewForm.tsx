'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Info } from 'lucide-react'
import { toast } from 'sonner'

import { getCurrentUser } from '@/lib/actions/auth.action'
import { createInterview } from '@/lib/actions/interview.action'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const interviewFormSchema = z.object({
  level: z.enum(['junior', 'middle', 'senior'], {
    message: 'Level must be one of: junior, middle, or senior.',
  }),
  role: z.string().min(3, { message: 'Role is required.' }),
  techstack: z.string().min(3, { message: 'Techstack is required.' }),
  type: z.enum(['technical', 'behavioral', 'mixed'], {
    message: 'Type must be one of: technical, behavioral, or mixed.',
  }),
  amount: z.enum(['1', '2', '3', '4', '5'], {
    message: 'Amount must be between 1 and 5',
  }),
})

const InterviewForm = () => {
  const router = useRouter()

  const form = useForm<z.infer<typeof interviewFormSchema>>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: {
      level: 'junior',
      role: '',
      techstack: '',
      type: 'mixed',
      amount: '1',
    },
  })

  const isSubmitting = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof interviewFormSchema>) => {
    const user = await getCurrentUser()

    const response = await createInterview({
      userId: user?.id as string,
      level: values.level,
      role: values.role,
      techstack: values.techstack.split(','),
      type: values.type,
      amount: Number(values.amount),
    })

    if (response.success) {
      router.push('/')
    } else {
      toast.error('Failed creating interview')
    }
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="form space-y-8">
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem className="gap-4">
                <FormLabel className="label">Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="dark:!bg-dark-200 dark:placeholder:!text-light-100 !min-h-12 w-full min-w-[144px] cursor-pointer !rounded-full !bg-gray-100 !px-5 placeholder:!text-gray-400">
                      <SelectValue placeholder="Select your level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="junior">Junior</SelectItem>
                    <SelectItem value="middle">Middle</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="gap-4">
                <FormLabel className="label">Role</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Frontend, Backend, UI/UX, DevOps"
                    {...field}
                    className="dark:!bg-dark-200 dark:placeholder:!text-light-100 !min-h-12 !rounded-full !bg-gray-100 !px-5 placeholder:!text-gray-400"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="techstack"
            render={({ field }) => (
              <FormItem className="gap-4">
                <FormLabel className="label">Techstack</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., React, Express.js, Django, Vue"
                    {...field}
                    className="dark:!bg-dark-200 dark:placeholder:!text-light-100 !min-h-12 !rounded-full !bg-gray-100 !px-5 placeholder:!text-gray-400"
                  />
                </FormControl>
                <div className="flex gap-2">
                  <Info
                    size={14}
                    className="dark:text-light-100 text-dark-100 mt-0.5"
                  />
                  <FormDescription className="description">
                    Enter multiple technologies, separated by commas (e.g.,
                    React, Express.js, Django, Vue)
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="gap-4">
                <FormLabel className="label">Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="dark:!bg-dark-200 dark:placeholder:!text-light-100 !min-h-12 w-full min-w-[144px] cursor-pointer !rounded-full !bg-gray-100 !px-5 placeholder:!text-gray-400">
                      <SelectValue placeholder="Select the interview type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="gap-4">
                <FormLabel className="label">Total Questions</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="dark:!bg-dark-200 dark:placeholder:!text-light-100 !min-h-12 w-full min-w-[144px] cursor-pointer !rounded-full !bg-gray-100 !px-5 placeholder:!text-gray-400">
                      <SelectValue placeholder="Total interview questions" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <SelectItem key={index} value={(index + 1).toString()}>
                        {index + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="btn">
            {isSubmitting ? 'Creating Interview...' : 'Create Interview'}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default InterviewForm

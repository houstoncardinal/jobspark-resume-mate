#!/bin/bash

# Update JobSeekerSignUpForm
sed -i '' '1,15c\
import { useState } from "react";\
import { Input } from "@/components/ui/input";\
import { Label } from "@/components/ui/label";\
import { Button } from "@/components/ui/button";\
import { Loader2 } from "lucide-react";\
import { useAuth } from "@/contexts/AuthContext";\
\
interface JobSeekerSignUpFormProps {\
  onSignUpSuccess: () => void;\
  onSignUpError: (error: string) => void;\
}\
\
export const JobSeekerSignUpForm = ({ \
  onSignUpSuccess,\
  onSignUpError\
}: JobSeekerSignUpFormProps) => {\
  const [email, setEmail] = useState("");\
  const [password, setPassword] = useState("");\
  const [loading, setLoading] = useState(false);\
  const { signUp } = useAuth();' src/components/auth/forms/JobSeekerSignUpForm.tsx

# Update RecruiterSignUpForm
sed -i '' '1,15c\
import { useState } from "react";\
import { Input } from "@/components/ui/input";\
import { Label } from "@/components/ui/label";\
import { Button } from "@/components/ui/button";\
import { Loader2 } from "lucide-react";\
import { useAuth } from "@/contexts/AuthContext";\
\
interface RecruiterSignUpFormProps {\
  onSignUpSuccess: () => void;\
  onSignUpError: (error: string) => void;\
}\
\
export const RecruiterSignUpForm = ({ \
  onSignUpSuccess,\
  onSignUpError\
}: RecruiterSignUpFormProps) => {\
  const [email, setEmail] = useState("");\
  const [password, setPassword] = useState("");\
  const [loading, setLoading] = useState(false);\
  const { signUp } = useAuth();' src/components/auth/forms/RecruiterSignUpForm.tsx

# Update EmployerSignUpForm
sed -i '' '1,15c\
import { useState } from "react";\
import { Input } from "@/components/ui/input";\
import { Label } from "@/components/ui/label";\
import { Button } from "@/components/ui/button";\
import { Loader2 } from "lucide-react";\
import { useAuth } from "@/contexts/AuthContext";\
\
interface EmployerSignUpFormProps {\
  onSignUpSuccess: () => void;\
  onSignUpError: (error: string) => void;\
}\
\
export const EmployerSignUpForm = ({ \
  onSignUpSuccess,\
  onSignUpError\
}: EmployerSignUpFormProps) => {\
  const [email, setEmail] = useState("");\
  const [password, setPassword] = useState("");\
  const [loading, setLoading] = useState(false);\
  const { signUp } = useAuth();' src/components/auth/forms/EmployerSignUpForm.tsx

# Update StudentSignUpForm
sed -i '' '1,15c\
import { useState } from "react";\
import { Input } from "@/components/ui/input";\
import { Label } from "@/components/ui/label";\
import { Button } from "@/components/ui/button";\
import { Loader2 } from "lucide-react";\
import { useAuth } from "@/contexts/AuthContext";\
\
interface StudentSignUpFormProps {\
  onSignUpSuccess: () => void;\
  onSignUpError: (error: string) => void;\
}\
\
export const StudentSignUpForm = ({ \
  onSignUpSuccess,\
  onSignUpError\
}: StudentSignUpFormProps) => {\
  const [email, setEmail] = useState("");\
  const [password, setPassword] = useState("");\
  const [loading, setLoading] = useState(false);\
  const { signUp } = useAuth();' src/components/auth/forms/StudentSignUpForm.tsx

echo "Updated all sign-up form interfaces"

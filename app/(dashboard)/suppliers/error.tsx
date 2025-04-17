'use client'

import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 text-red-600 p-3 rounded-full">
            <AlertTriangle className="w-8 h-8" />
          </div>
        </div>
        <h1 className="text-xl font-semibold mb-2">Oups, une erreur est survenue</h1>
        <p className="text-sm text-gray-600 mb-6">
         Rassurez-vous que vous avez les permissons nécessaires pour effectuer cette action.  Vous pouvez réessayer ou revenir à l’accueil.
        </p>
        <div className="flex justify-center gap-2">
          <Button variant="outline" onClick={() => reset()}>
            Réessayer
          </Button>
          <Button onClick={() => router.push('/')}>
            Retour à l’accueil
          </Button>
        </div>
      </div>
    </div>
  )
}

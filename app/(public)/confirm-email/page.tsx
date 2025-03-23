"use client"

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import StatusCard from './_components/StatusCard';
import { Button } from '@/components/ui/button';
import { confirmEmail, resendConfirmationEmail } from '@/lib/server-actions/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import "./_components/style.css"

const EmailConfirmation = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'failure'>('loading');
  const [message, setMessage] = useState('Vérification de votre email...');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const handleConfirmation = async () => {
      // Get token and email from URL params
      const token = searchParams.get('token') || '';
      const emailParam = searchParams.get('email') || '';
      
      setEmail(emailParam);
      
      try {
        // Add slight delay for animation effect
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const result = await confirmEmail({ 
          token, 
          email: emailParam 
        });
        
        if (result.status === 'success') {
          setStatus('success');
          setMessage('Votre email a été confirmé avec succès!');
          //toast.success('Email confirmé avec succès');
        } else {
          setStatus('failure');
          setMessage(result.data || 'Une erreur est survenue lors de la confirmation');
          //toast.error(result.data || 'Échec de la confirmation');
        }
      } catch (error) {
        setStatus('failure');
        setMessage('Une erreur inattendue est survenue');
        //toast.error('Erreur lors de la confirmation');
        console.error(error);
      }
    };
    
    handleConfirmation();
  }, [searchParams]);
  
  const handleResendEmail = async () => {
    if (!email || isResending) return;
    
    setIsResending(true);
    
    try {
      const result = await resendConfirmationEmail(email);
      
      if (result.status === 'success') {
        toast.success('Email de confirmation envoyé');
      } else {
        toast.error(result.data || 'Échec de l\'envoi');
      }
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de l\'email');
      console.error(error);
    } finally {
      setIsResending(false);
    }
  };
  
  const handleNavigateToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-appGray-100 to-appWhite dark:from-appBlack dark:to-appGray-900">
      <div className="w-full max-w-md">
        {status === 'loading' ? (
          <div className="animate-pulse flex flex-col items-center space-y-8">
            <div className="w-16 h-16 bg-appGray-200 rounded-full"></div>
            <div className="space-y-4 w-full">
              <div className="h-6 bg-appGray-200 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-appGray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-10 bg-appGray-200 rounded mt-6"></div>
            </div>
          </div>
        ) : status === 'success' ? (
          <StatusCard
            success={true} 
            title="Confirmation réussie" 
            message="Votre adresse email a été vérifiée avec succès. Vous pouvez maintenant vous connecter à votre compte."
          >
            <Button 
              variant="default" 
               fullWidth 
              onClick={handleNavigateToLogin}
            >
              Se connecter
            </Button>
          </StatusCard>
        ) : (
          <StatusCard 
            success={false} 
            title="Échec de confirmation" 
            message={message}
          >
            <div className="space-y-3">
              <Button 
                variant="outline" 
                 fullWidth 
               onClick={handleResendEmail}
                loading={isResending}
                disabled={!email}
              >
                Renvoyer l&apos;email de confirmation
              </Button>
              <Button 
                fullWidth 
                onClick={handleNavigateToLogin}
              >
                Retour à la connexion
              </Button>
            </div>
          </StatusCard>
        )}
      </div>
    </div>
  );
};

export default EmailConfirmation;
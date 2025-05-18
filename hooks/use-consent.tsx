"use client";
import { editProfile, getCurrentUser } from "@/lib/api/userApi";
import { UpdateUserSchema } from "@/lib/schemas/user.schemas";
import { handleError } from "@/lib/utils";
import { useLocalization } from "@/providers/localization-provider";
import { useUserStore } from "@/store/user.store";
import { useSession, } from "next-auth/react";
import { useState, useEffect } from "react";


export function useConsent() {
  const { data: session, update } = useSession();
  const { t } = useLocalization();

  const {currentUser, setCurrentUser} = useUserStore();

  const accepted = currentUser?.user.acceptTerms;
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setModalOpen(!accepted);
  }, [accepted]);

  // Si tu as besoin de "consent" quelque part, tu peux le calculer ici directement
  const consent = { accepted };

  const acceptConsent = async (data: UpdateUserSchema) => {
    try {
      const result = await editProfile(data);
      if (result.status === 'success') {
        const userResponse = await getCurrentUser();
        if (userResponse.status === 'success') {
          const user = userResponse.data;
          const newSession = { ...session, companyUser: user };
          await update(newSession);
          setCurrentUser(user);
          setModalOpen(false);
          return "Success";
        } else {
          throw userResponse.data;
        }
      } else {
        throw result.data;
      }
    } catch (error) {
      handleError({ error, message: "Failed to accept terms", dict: t });
      return "Failed";
    }
  };

  const declineConsent = () => {
    setModalOpen(false);
  };

  const resetConsent = () => {
    setModalOpen(true);
  };

  return {
    consent,
    modalOpen,
    setModalOpen,
    acceptConsent,
    declineConsent,
    resetConsent,
  };
}

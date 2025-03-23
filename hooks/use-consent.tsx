"use client";
import { editProfile, getCurrentUser } from "@/lib/server-actions/user";
import { UpdateUserSchema } from "@/lib/schemas/user.schemas";
import { handleError } from "@/lib/utils";
import { useLocalization } from "@/providers/localization-provider";
import { useSession, } from "next-auth/react";
import { useState, useEffect } from "react";

type ConsentType = {
  accepted: boolean;
};

export function useConsent() {
  const { data: session, update } = useSession();
  const acceptTerms = session?.user?.acceptTerms ?? false;

  const { t } = useLocalization()

  const [consent, setConsent] = useState<ConsentType>({
    accepted: acceptTerms,
  });

  const [modalOpen, setModalOpen] = useState(!consent.accepted);

  useEffect(() => {
    if(!session) {
      setModalOpen(false);
      return;
    }
    if (acceptTerms !== consent.accepted) {
      setConsent({ accepted: acceptTerms });
      setModalOpen(!acceptTerms);
    }
  }, [acceptTerms, consent.accepted]);

  const acceptConsent = async (data: UpdateUserSchema) => {
    try {
      const result = await editProfile(data);
      if (result.status === 'success') {
        setConsent({ accepted: true });
        setModalOpen(false);
        const userResponse = await getCurrentUser();
        if (userResponse.status === 'success') {
          const user = userResponse.data;
          const newSession = { ...session, user: user };
          update(newSession);
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
    setConsent({ accepted: false });
    setModalOpen(false);
  };

  const resetConsent = () => {
    setConsent({ accepted: false });
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

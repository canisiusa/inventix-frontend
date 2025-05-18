/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { ContainerProps, create } from "react-modal-promise";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import styled, { keyframes } from "styled-components";

export interface ConfirmActionModalProps extends ContainerProps {
  isOpen: boolean;
  onResolve?: (value?: any) => void;
  onReject?: (reason?: any) => void;
  message?: React.ReactNode;
  color?: string;
  title?: string;
  okText?: string;
  cancelText?: string;
  expirationTime?: number; // secondes, optionnel
}

const ConfirmModal = (props: ConfirmActionModalProps) => {
  const [code, setCode] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [shake, setShake] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(props.expirationTime ?? 30);

  // Génère le code et lance le timer quand modale ouverte
  useEffect(() => {
    if (!props.isOpen) return;

    const randomCode = Math.floor(100 + Math.random() * 900).toString();
    setCode(randomCode);
    setUserInput('');
    setTimeLeft(props.expirationTime ?? 30);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          props.onReject?.("timeout");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [props.isOpen, props.expirationTime, props.onReject]);

  const handleConfirm = () => {
    if (userInput === code) {
      props.onResolve?.();
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const isCodeCorrect = userInput === code;

  return (
    <AlertDialog open={props.isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{props.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {props.message}
            <div className="mt-4">
              Pour confirmer, entrez le code suivant : <strong>{code}</strong>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {timeLeft > 0
                ? `Le code expire dans ${timeLeft} seconde${timeLeft > 1 ? 's' : ''}...`
                : "Code expiré."}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-4">
          <ShakeInput
            placeholder="Entrez le code"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleConfirm();
            }}
            $shake={shake}
          />
        </div>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel onClick={() => props.onReject?.("cancel")}>
            {props.cancelText ? props.cancelText : "Annuler"}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!userInput || !isCodeCorrect}
            className={cn(
              "bg-red-600 hover:bg-red-700",
              (!isCodeCorrect || timeLeft <= 0) && "opacity-50 pointer-events-none"
            )}
          >
            {props.okText ? props.okText : "Confirmer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
// Définir l'animation
const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;

// Composant Input animé
const ShakeInput = styled(Input) <{ $shake: boolean }>`
  transition: all 0.3s ease;
  ${({ $shake }) =>
    $shake &&
    `
    animation: ${shake} 0.4s ease-in-out;
    transform-origin: center;
    border-color: #f87171;
  `}
`;


export const showConfirmModal = create(ConfirmModal);

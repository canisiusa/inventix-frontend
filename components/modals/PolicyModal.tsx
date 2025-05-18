"use client"
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useConsent } from "@/hooks/use-consent";
import { signOut } from "next-auth/react";

export const PolicyModal = () => {
  const { modalOpen, acceptConsent, declineConsent } = useConsent();
  const [essentialChecked] = useState(true);
  const [analyticsChecked, setAnalyticsChecked] = useState(false);
  const [marketingChecked, setMarketingChecked] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    if (!modalOpen) return;

    const timer = setTimeout(() => {
      setHasScrolled(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [modalOpen]);

  const handleAccept = async () => {
    setloading(true);
    const resp = await acceptConsent({
      terms: true,
      analyticsTerms: analyticsChecked,
      marketingTerms: marketingChecked
    });
    setloading(false);
    if (resp === "Success") {
      setTimeout(() => {
        toast.success("Préférences de confidentialité enregistrées", {
          description: "Nous vous remercions pour votre confiance."
        });
      }, 500);
    }
  };

  const handleDecline = () => {
    declineConsent();
    setTimeout(() => {
      toast.info("Vous avez refusé notre politique de confidentialité", {
        description: "L'acceptation des politiques de confidentialité est nécessaire pour accéder à notre service. Vous serez redirigé vers la page d'accueil."
      });
    }, 500);
    signOut({ callbackUrl: "/" });
  };

  const handleAcceptAll = async () => {
    setloading(true);
    setAnalyticsChecked(true);
    setMarketingChecked(true);
    const resp = await acceptConsent({
      terms: true,
      analyticsTerms: true,
      marketingTerms: true
    });
    setloading(false);
    if (resp === "Success") {
      toast.success("Toutes les préférences acceptées", {
        description: "Merci de nous accorder votre confiance."
      });
    }
  };

  return (
    <Dialog open={modalOpen}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden animate-scale-in">
        <DialogHeader className="p-6 pb-0">
          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-2 animate-fade-in">
            Confidentialité
          </div>
          <DialogTitle className="text-2xl font-medium leading-none tracking-tight animate-slide-down">
            Politique de confidentialité
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground mt-3 animate-slide-down delay-100">
            Nous valorisons votre vie privée. Veuillez prendre connaissance de notre politique et personnaliser vos préférences.
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4">
          <Tabs defaultValue="resume" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="resume">Résumé</TabsTrigger>
              <TabsTrigger value="preferences">Préférences</TabsTrigger>
              <TabsTrigger value="details">Détails</TabsTrigger>
            </TabsList>

            <TabsContent value="resume">
              <ScrollArea className="h-[280px] rounded-md border p-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Ce que nous collectons</h4>
                  <p className="text-sm text-muted-foreground">
                    Nous recueillons des informations nécessaires au bon fonctionnement de notre service,
                    comme des cookies essentiels pour la navigation, et potentiellement des données
                    d&#39;utilisation à des fins d&apos;amélioration de notre service.
                  </p>

                  <h4 className="font-medium pt-2">Comment nous utilisons vos données</h4>
                  <p className="text-sm text-muted-foreground">
                    Vos données sont utilisées pour vous offrir une expérience optimale,
                    améliorer nos services et, avec votre consentement, pour des analyses
                    statistiques et des communications marketing pertinentes.
                  </p>

                  <h4 className="font-medium pt-2">Vos droits</h4>
                  <p className="text-sm text-muted-foreground">
                    Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification,
                    d&apos;effacement et de portabilité de vos données. Vous pouvez également vous
                    opposer ou limiter certains traitements.
                  </p>

                  <h4 className="font-medium pt-2">Sécurité</h4>
                  <p className="text-sm text-muted-foreground">
                    Nous mettons en œuvre des mesures techniques et organisationnelles
                    appropriées pour protéger vos données contre tout accès non autorisé,
                    modification, divulgation ou destruction.
                  </p>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="preferences">
              <div className="space-y-4">
                <div className="flex items-start space-x-4 rounded-md border p-4">
                  <Checkbox
                    id="essential"
                    checked={essentialChecked}
                    disabled={true}
                  />
                  <div className="space-y-1">
                    <label htmlFor="essential" className="font-medium">Cookies essentiels</label>
                    <p className="text-sm text-muted-foreground">
                      Nécessaires au bon fonctionnement du site. Ils ne peuvent pas être désactivés.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 rounded-md border p-4">
                  <Checkbox
                    id="analytics"
                    checked={analyticsChecked}
                    onCheckedChange={() => setAnalyticsChecked(!analyticsChecked)}
                  />
                  <div className="space-y-1">
                    <label htmlFor="analytics" className="font-medium">Cookies analytiques</label>
                    <p className="text-sm text-muted-foreground">
                      Nous aident à comprendre comment vous utilisez notre site pour l&apos;améliorer.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 rounded-md border p-4">
                  <Checkbox
                    id="marketing"
                    checked={marketingChecked}
                    onCheckedChange={() => setMarketingChecked(!marketingChecked)}
                  />
                  <div className="space-y-1">
                    <label htmlFor="marketing" className="font-medium">Cookies marketing</label>
                    <p className="text-sm text-muted-foreground">
                      Permettent de vous proposer des contenus pertinents en fonction de vos intérêts.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details">
              <ScrollArea className="h-[280px] rounded-md border p-4">
                <div className="space-y-4">
                  <h4 className="font-medium">1. Introduction</h4>
                  <p className="text-sm text-muted-foreground">
                    La présente politique de confidentialité décrit comment nous collectons, utilisons et
                    protégeons vos informations personnelles lorsque vous utilisez notre service.
                  </p>

                  <h4 className="font-medium pt-2">2. Types de données collectées</h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Données personnelles :</strong> Nom, adresse email, numéro de téléphone.<br />
                    <strong>Données d&apos;utilisation :</strong> Adresse IP, type de navigateur, pages visitées.<br />
                    <strong>Cookies :</strong> Petits fichiers stockés sur votre appareil pour améliorer votre expérience.
                  </p>

                  <h4 className="font-medium pt-2">3. Finalités du traitement</h4>
                  <p className="text-sm text-muted-foreground">
                    Nous utilisons vos données pour :<br />
                    - Fournir et maintenir notre service<br />
                    - Vous notifier des changements de notre service<br />
                    - Vous offrir un support client<br />
                    - Analyser l&apos;utilisation pour améliorer notre service<br />
                    - Surveiller l&apos;utilisation de notre service
                  </p>

                  <h4 className="font-medium pt-2">4. Base légale du traitement</h4>
                  <p className="text-sm text-muted-foreground">
                    Nous traitons vos données personnelles sur les bases suivantes :<br />
                    - Exécution d&apos;un contrat<br />
                    - Votre consentement<br />
                    - Intérêts légitimes<br />
                    - Obligations légales
                  </p>

                  <h4 className="font-medium pt-2">5. Transfert de données</h4>
                  <p className="text-sm text-muted-foreground">
                    Vos informations peuvent être transférées et maintenues sur des serveurs situés en dehors de votre pays,
                    où les lois sur la protection des données peuvent différer. En utilisant notre service, vous consentez à ces transferts.
                  </p>

                  <h4 className="font-medium pt-2">6. Droits des utilisateurs</h4>
                  <p className="text-sm text-muted-foreground">
                    Vous avez le droit :<br />
                    - D&apos;accéder à vos données<br />
                    - De rectifier vos données<br />
                    - De supprimer vos données<br />
                    - De limiter le traitement<br />
                    - De vous opposer au traitement<br />
                    - À la portabilité des données
                  </p>

                  <h4 className="font-medium pt-2">7. Modifications de la politique</h4>
                  <p className="text-sm text-muted-foreground">
                    Nous pouvons modifier cette politique de temps à autre. Nous vous notifierons de tout changement
                    en publiant la nouvelle politique sur cette page.
                  </p>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        <Separator />

        <DialogFooter className="p-6 pt-4 flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleDecline}
            className="sm:order-1"
          >
            Refuser
          </Button>
          <Button
            onClick={handleAccept}
            disabled={!hasScrolled}
            loading={loading}
            className="sm:order-2 relative overflow-hidden group"
          >
            <span className={`absolute inset-0 bg-primary/10 transition-all duration-300 ${hasScrolled ? 'w-0' : 'w-full'}`}></span>
            <span className="relative">Accepter la sélection</span>
          </Button>
          <Button
            variant="secondary"
            onClick={handleAcceptAll}
            disabled={loading}
            className="sm:order-3"
          >
            Tout accepter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
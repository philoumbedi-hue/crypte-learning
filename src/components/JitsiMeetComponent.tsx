"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface JitsiMeetComponentProps {
    roomName: string;
    userName: string;
    userEmail: string;
    isAdmin: boolean;
    redirectUrl?: string; // Optionnel : où aller après avoir quitté
}

export default function JitsiMeetComponent({ roomName, userName, userEmail, isAdmin, redirectUrl = "/" }: JitsiMeetComponentProps) {
    const jitsiContainerRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Load the Jitsi External API script asynchronously
        const domain = "meet.jit.si";
        const script = document.createElement("script");
        script.src = `https://${domain}/external_api.js`;
        script.async = true;

        script.onload = () => {
            setIsLoaded(true);
            if (!jitsiContainerRef.current) return;

            // Initialize the Jitsi Meet API
            const options = {
                roomName: roomName,
                width: "100%",
                height: "100%",
                parentNode: jitsiContainerRef.current,
                userInfo: {
                    displayName: userName,
                    email: userEmail
                },
                configOverwrite: {
                    prejoinPageEnabled: false,          // DESACTIVE l'écran de bienvenue Jitsi
                    prejoinConfig: {
                        enabled: false                  // Sécurité supplémentaire pour l'entrée directe
                    },
                    startWithAudioMuted: false,
                    startWithVideoMuted: false,
                    disableDeepLinking: true,           // Reste dans le navigateur sur mobile
                    disableBeforeUnloadHandlers: true,
                    enableLayerSuspension: true,
                    disableAudioLevels: true,
                    enableWelcomePage: false,           // Pas de page d'accueil Jitsi
                    enableClosePage: false,             // Pas de page de fermeture Jitsi
                    // Masquer les options de connexion tierces
                    disableThirdPartyRequests: true,
                },
                interfaceConfigOverwrite: {
                    SHOW_JITSI_WATERMARK: false,        // Masque le logo Jitsi
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    DEFAULT_REMOTE_DISPLAY_NAME: 'Étudiant CRYPTE',
                    TOOLBAR_BUTTONS: [
                        'microphone', 'camera', 'desktop', 'fullscreen',
                        'fodeviceselection', 'hangup', 'profile', 'chat',
                        'settings', 'videoquality', 'filmstrip', 'tileview',
                        ...(isAdmin ? ['recording', 'mute-everyone'] : []) // Contrôles maître seulement pour admin
                    ],
                }
            };

            // @ts-expect-error - JitsiMeetExternalAPI is loaded from external script
            const api = new window.JitsiMeetExternalAPI(domain, options);

            // Forcer le nom si Jitsi l'oublie
            api.executeCommand('displayName', userName);

            // Gestion de la sortie automatique pour éviter la latence
            const handleClose = () => {
                api.dispose();
                router.push(redirectUrl);
            };

            api.addEventListener('videoConferenceLeft', handleClose);
            api.addEventListener('readyToClose', handleClose);

            // Give specific rights based on role
            if (isAdmin) {
                api.executeCommand('subject', 'Session Magistrale - CRYPTE');
            }

            return () => {
                api.removeEventListener('videoConferenceLeft', handleClose);
                api.removeEventListener('readyToClose', handleClose);
                api.dispose();
            };
        };


        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [roomName, userName, userEmail, isAdmin, redirectUrl, router]);

    return (
        <div className="w-full h-[600px] lg:h-[800px] relative rounded-[2rem] overflow-hidden bg-zinc-950">
            {!isLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-zinc-500 bg-black">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Connexion chiffrée en cours...</p>
                </div>
            )}
            <div ref={jitsiContainerRef} className="w-full h-full" />
        </div>
    );
}

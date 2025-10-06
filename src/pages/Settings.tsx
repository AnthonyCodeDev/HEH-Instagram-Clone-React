import React, { useState, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import QuickAdd from '@/components/QuickAdd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Camera,
    Lock,
    Mail,
    MapPin,
    Calendar,
    Link as LinkIcon,
    Loader2
} from 'lucide-react';

const Settings = () => {
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [passwordError, setPasswordError] = useState("");

    // Fonction pour gérer le changement de mot de passe avec AJAX
    const handlePasswordChange = async () => {
        // Réinitialiser l'erreur
        setPasswordError("");

        // Vérifier que les mots de passe correspondent
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("Les mots de passe ne correspondent pas.");
            return;
        }

        // Vérifier que le mot de passe est assez fort (au moins 8 caractères)
        if (passwordData.newPassword.length < 8) {
            setPasswordError("Le mot de passe doit contenir au moins 8 caractères.");
            return;
        }

        try {
            // Afficher un indicateur de chargement
            setIsLoading(true);

            // Préparer les données à envoyer
            const dataToSend = {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            };

            // Faire la requête AJAX
            const response = await fetch('https://localhost/api/users/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer fake-token-123456789'
                },
                body: JSON.stringify(dataToSend)
            });

            // Vérifier la réponse
            if (!response.ok) {
                // Simuler une erreur d'authentification si le mot de passe actuel est incorrect
                if (passwordData.currentPassword !== "password123") {
                    throw new Error("Le mot de passe actuel est incorrect.");
                }
                throw new Error(`Erreur ${response.status}: ${response.statusText || 'La requête a échoué'}`);
            }

            // Réinitialiser les champs
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

            // Fermer la popup
            setIsPasswordDialogOpen(false);

            // Afficher un toast de succès
            toast({
                title: "Mot de passe mis à jour",
                description: "Votre mot de passe a été changé avec succès.",
                variant: "default",
            });
        } catch (error) {
            // Afficher l'erreur
            setPasswordError(error instanceof Error ? error.message : "Une erreur est survenue lors du changement de mot de passe.");

            console.error('Erreur lors du changement de mot de passe:', error);
        } finally {
            // Désactiver l'indicateur de chargement
            setIsLoading(false);
        }
    };

    // Fonction pour gérer le changement de photo de profil avec AJAX
    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Vérifier le type de fichier
            if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
                toast({
                    title: "Format non supporté",
                    description: "Veuillez sélectionner une image au format JPEG ou PNG.",
                    variant: "destructive",
                });
                return;
            }

            // Vérifier la taille du fichier (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "Fichier trop volumineux",
                    description: "La taille de l'image ne doit pas dépasser 5MB.",
                    variant: "destructive",
                });
                return;
            }

            try {
                // Afficher un indicateur de chargement
                setIsLoading(true);

                // Lire le fichier en base64
                const reader = new FileReader();

                // Créer une promesse pour attendre que la lecture soit terminée
                const base64Image = await new Promise<string>((resolve, reject) => {
                    reader.onload = (event) => {
                        if (event.target?.result) {
                            resolve(event.target.result as string);
                        } else {
                            reject(new Error("Échec de la lecture du fichier"));
                        }
                    };
                    reader.onerror = () => reject(reader.error);
                    reader.readAsDataURL(file);
                });

                // Préparer les données à envoyer
                const formData = new FormData();
                formData.append('avatar', file);

                // Faire la requête AJAX
                const response = await fetch('https://localhost/api/users/avatar', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer fake-token-123456789'
                    },
                    body: formData
                });

                // Vérifier la réponse
                if (!response.ok) {
                    throw new Error(`Erreur ${response.status}: ${response.statusText || 'La requête a échoué'}`);
                }

                // Mettre à jour l'avatar dans le state
                setProfileData({
                    ...profileData,
                    avatar: base64Image
                });

                // Afficher un toast de succès
                toast({
                    title: "Photo mise à jour",
                    description: "Votre photo de profil a été changée avec succès.",
                    variant: "default",
                });

            } catch (error) {
                console.error('Erreur lors du changement de photo de profil:', error);

                // Afficher un toast d'erreur
                toast({
                    title: "Erreur",
                    description: error instanceof Error ? error.message : "Une erreur est survenue lors du changement de photo de profil.",
                    variant: "destructive",
                });
            } finally {
                // Désactiver l'indicateur de chargement
                setIsLoading(false);
            }
        }
    };

    // Fonction pour envoyer les données à l'API
    const handleSaveProfile = async () => {
        setIsLoading(true);

        try {
            // Préparation des données à envoyer
            const dataToSend = {
                ...profileData,
                updatedAt: new Date().toISOString()
            };

            // Envoi des données à l'API
            const response = await fetch('https://localhost/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer fake-token-123456789'
                },
                body: JSON.stringify(dataToSend)
            });

            // Vérification de la réponse
            if (!response.ok) {
                throw new Error(`Erreur ${response.status}: ${response.statusText || 'La requête a échoué'}`);
            }

            // Traitement de la réponse
            const result = await response.json();

            // Afficher un toast de succès
            toast({
                title: "Profil mis à jour",
                description: "Vos modifications ont été enregistrées avec succès.",
                variant: "default",
            });

            console.log('Profil mis à jour:', result);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);

            // Afficher un toast d'erreur
            toast({
                title: "Erreur",
                description: error instanceof Error ? error.message : "Une erreur est survenue lors de la mise à jour du profil.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const [profileData, setProfileData] = useState({
        name: "Lucas Hergz",
        username: "lucashergz20",
        email: "lucas.hergz@email.com",
        bio: "Des petits postes tous les jours, n'hésitez pas !",
        phone: "+33 6 12 34 56 78",
        location: "Paris, France",
        birthdate: "1995-03-15",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
        socialLinks: {
            tiktok: "@lucashergz20",
            youtube: "Lucas Hergz",
            twitter: "@lucashergz20"
        }
    });

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />

            {/* Main Content */}
            <div className="flex max-w-none h-full flex-1">
                <div className="flex-1 p-6 overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h1
                            className="font-medium capitalize"
                            style={{
                                fontFamily: '"SF Pro", sans-serif',
                                fontSize: '19px',
                                fontWeight: 590,
                                color: '#252525',
                                textAlign: 'left',
                                textTransform: 'capitalize'
                            }}
                        >
                            Paramètres
                        </h1>
                    </div>
                    <div>

                        {/* Account Information */}
                        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                            <div className="flex items-center gap-6 mb-6">
                                <Avatar className="w-20 h-20">
                                    <AvatarImage src={profileData.avatar} alt={profileData.name} />
                                    <AvatarFallback className="bg-stragram-primary text-white text-xl">
                                        {profileData.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-1">{profileData.name}</h2>
                                    <p className="text-gray-600">@{profileData.username}</p>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/png,image/jpeg,image/jpg"
                                        className="hidden"
                                        onChange={handlePhotoChange}
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-2 flex items-center gap-2"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Chargement...
                                            </>
                                        ) : (
                                            <>
                                                <Camera className="w-4 h-4" />
                                                Changer la photo
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nom complet</Label>
                                        <Input
                                            id="name"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Nom d'utilisateur</Label>
                                        <Input
                                            id="username"
                                            value={profileData.username}
                                            onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Biographie</Label>
                                    <Input
                                        id="bio"
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Téléphone</Label>
                                        <Input
                                            id="phone"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Localisation</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="location"
                                                value={profileData.location}
                                                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="birthdate">Date de naissance</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="birthdate"
                                                type="date"
                                                value={profileData.birthdate}
                                                onChange={(e) => setProfileData({ ...profileData, birthdate: e.target.value })}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label>Réseaux sociaux</Label>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 flex items-center justify-center">
                                                <svg width="20" height="20" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="0.217407" y="0.0869141" width="22.8261" height="22.8261" rx="11.413" fill="black" />
                                                    <path d="M10.296 10.0573V9.51623C10.1157 9.47115 9.93534 9.47119 9.75499 9.47119C7.45547 9.47119 5.60684 11.3198 5.60684 13.6193C5.60684 15.017 6.32826 16.2795 7.36529 17.0009L7.32021 16.9558C6.64388 16.2344 6.28317 15.2425 6.28317 14.2055C6.28317 11.906 8.08671 10.1024 10.296 10.0573Z" fill="#25F4EE" />
                                                    <path d="M10.3792 16.1046C11.4162 16.1046 12.2278 15.293 12.2729 14.256V5.23825H13.8961C13.851 5.0579 13.851 4.87754 13.851 4.6521H11.5966V13.6698C11.5515 14.6618 10.7399 15.4733 9.70286 15.4733C9.38724 15.4733 9.07162 15.3832 8.84618 15.2479C9.20688 15.7439 9.74795 16.1046 10.3792 16.1046ZM17.0071 8.30427V7.76321C16.3759 7.76321 15.7897 7.58285 15.2937 7.26723C15.7446 7.76321 16.3308 8.16901 17.0071 8.30427Z" fill="#25F4EE" />
                                                    <path d="M15.2952 7.26206C14.7992 6.721 14.5287 5.99958 14.5287 5.18799H13.8974C14.0778 6.08976 14.6188 6.81118 15.2952 7.26206ZM9.74933 11.6807C8.7123 11.6807 7.85561 12.5374 7.85561 13.5744C7.85561 14.2958 8.3065 14.9271 8.89265 15.2427C8.66721 14.9271 8.53194 14.5664 8.53194 14.1606C8.53194 13.1235 9.38862 12.2668 10.4257 12.2668C10.606 12.2668 10.7864 12.3119 10.9667 12.357V10.0575C10.7864 10.0124 10.606 10.0124 10.4257 10.0124H10.3355V11.7258C10.11 11.7258 9.92969 11.6807 9.74933 11.6807Z" fill="#FE2C55" />
                                                    <path d="M17.0227 8.29297V10.0063C15.8504 10.0063 14.7683 9.64562 13.9116 9.01439V13.6134C13.9116 15.9129 12.063 17.7616 9.76348 17.7616C8.86171 17.7616 8.05011 17.491 7.37379 17.0401C8.14029 17.8517 9.22242 18.3477 10.3947 18.3477C12.6942 18.3477 14.5429 16.4991 14.5429 14.1996V9.60054C15.4446 10.2318 16.5268 10.5925 17.654 10.5925V8.33806C17.4736 8.33806 17.2482 8.33806 17.0227 8.29297Z" fill="#FE2C55" />
                                                    <path d="M13.9144 13.6195V9.02051C14.8161 9.6518 15.8983 10.0125 17.0255 10.0125V8.25401C16.3491 8.11874 15.763 7.75803 15.3121 7.26206C14.5907 6.81118 14.0947 6.04467 13.9595 5.18799H12.2912V14.2057C12.2461 15.1977 11.4345 16.0093 10.3975 16.0093C9.76622 16.0093 9.22516 15.6936 8.86445 15.2427C8.2783 14.9722 7.8725 14.341 7.8725 13.6195C7.8725 12.5825 8.72918 11.7259 9.76622 11.7259C9.94657 11.7259 10.1269 11.7709 10.3073 11.816V10.0575C8.05285 10.1026 6.24931 11.9513 6.24931 14.2057C6.24931 15.2879 6.65511 16.2798 7.37653 17.0463C8.05285 17.4972 8.86445 17.8128 9.76622 17.8128C12.0657 17.7677 13.9144 15.874 13.9144 13.6195Z" fill="white" />
                                                </svg>
                                            </div>
                                            <Input
                                                placeholder="TikTok"
                                                value={profileData.socialLinks.tiktok}
                                                onChange={(e) => setProfileData({
                                                    ...profileData,
                                                    socialLinks: { ...profileData.socialLinks, tiktok: e.target.value }
                                                })}
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 flex items-center justify-center">
                                                <svg width="20" height="20" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="0.69565" y="0.0869141" width="22.8261" height="22.8261" rx="11.413" fill="white" />
                                                    <g clipPath="url(#clip0_11_27)">
                                                        <g clipPath="url(#clip1_11_27)">
                                                            <path d="M19.3993 7.57574C19.2239 6.87383 18.709 6.32224 18.0539 6.13435C16.8676 5.79346 12.1087 5.79346 12.1087 5.79346C12.1087 5.79346 7.34982 5.79346 6.16354 6.13435C5.5084 6.32224 4.99355 6.87383 4.81818 7.57574C4.5 8.84669 4.5 11.5 4.5 11.5C4.5 11.5 4.5 14.1533 4.81818 15.4242C4.99355 16.1261 5.5084 16.6777 6.16354 16.8656C7.34982 17.2065 12.1087 17.2065 12.1087 17.2065C12.1087 17.2065 16.8676 17.2065 18.0539 16.8656C18.709 16.6777 19.2239 16.1261 19.3993 15.4242C19.7174 14.1533 19.7174 11.5 19.7174 11.5C19.7174 11.5 19.7162 8.84669 19.3993 7.57574Z" fill="#FF0000" />
                                                            <path d="M10.5855 13.9455L14.5389 11.5002L10.5855 9.05493V13.9455Z" fill="white" />
                                                        </g>
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_11_27">
                                                            <rect width="15.2174" height="11.413" fill="white" transform="translate(4.5 5.79346)" />
                                                        </clipPath>
                                                        <clipPath id="clip1_11_27">
                                                            <rect width="15.2174" height="11.413" fill="white" transform="translate(4.5 5.79346)" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                            </div>
                                            <Input
                                                placeholder="YouTube"
                                                value={profileData.socialLinks.youtube}
                                                onChange={(e) => setProfileData({
                                                    ...profileData,
                                                    socialLinks: { ...profileData.socialLinks, youtube: e.target.value }
                                                })}
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 flex items-center justify-center">
                                                <svg width="20" height="20" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="0.17392" y="0.0869141" width="22.8261" height="22.8261" rx="11.413" fill="black" />
                                                    <path d="M14.6768 6.17383H16.3096L12.7246 10.6941L16.9131 16.826H13.6262L11.0528 13.0997L8.10664 16.826H6.47385L10.2719 11.9913L6.26088 6.17383H9.62939L11.9543 9.57781L14.6768 6.17383ZM14.1054 15.7647H15.0105L9.15376 7.19581H8.18118L14.1054 15.7647Z" fill="white" />
                                                </svg>
                                            </div>
                                            <Input
                                                placeholder="Twitter"
                                                value={profileData.socialLinks.twitter}
                                                onChange={(e) => setProfileData({
                                                    ...profileData,
                                                    socialLinks: { ...profileData.socialLinks, twitter: e.target.value }
                                                })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        className="flex-1"
                                        onClick={handleSaveProfile}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Sauvegarde en cours...
                                            </>
                                        ) : (
                                            "Sauvegarder les modifications"
                                        )}
                                    </Button>
                                    <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="flex items-center gap-2"
                                                disabled={isLoading}
                                            >
                                                <Lock className="w-4 h-4" />
                                                Changer le mot de passe
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Changer le mot de passe</DialogTitle>
                                                <DialogDescription>
                                                    Entrez votre mot de passe actuel et votre nouveau mot de passe.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="current-password">Mot de passe actuel</Label>
                                                    <Input
                                                        id="current-password"
                                                        type="password"
                                                        value={passwordData.currentPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="new-password">Nouveau mot de passe</Label>
                                                    <Input
                                                        id="new-password"
                                                        type="password"
                                                        value={passwordData.newPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                                                    <Input
                                                        id="confirm-password"
                                                        type="password"
                                                        value={passwordData.confirmPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                    />
                                                </div>
                                                {passwordError && (
                                                    <div className="text-red-500 text-sm">{passwordError}</div>
                                                )}
                                            </div>
                                            <DialogFooter>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setIsPasswordDialogOpen(false)}
                                                    disabled={isLoading}
                                                >
                                                    Annuler
                                                </Button>
                                                <Button
                                                    onClick={handlePasswordChange}
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Traitement...
                                                        </>
                                                    ) : (
                                                        "Confirmer"
                                                    )}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-96 p-6 flex-shrink-0 overflow-y-auto">
                    <QuickAdd />
                </div>
            </div>
        </div>
    );
};

export default Settings;

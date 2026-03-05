/* ============================================================
   HealDrive — app.js  (v2 — Full Frontend MVP)
   Router · Patient Dashboard · Chauffeur Dashboard ·
   Transport Request · Chat · Role-based navigation
   ============================================================ */

const API_URL = "http://localhost:8081/api";

// ————————————————————————————————————————————
//  1. MOCK DATA — ENRICHED
// ————————————————————————————————————————————

const MOCK_CHAUFFEURS = [
    {
        id: 'chf-001',
        nom: 'Philippe Lefebvre',
        email: 'philippe.lefebvre@healdrive.fr',
        telephone: '06 12 34 56 78',
        role: 'CHAUFFEUR',
        vehicule: { type: 'VSL', immatriculation: 'AB-123-CD', agrement_cpam: 'VSL-75-2024-0412' },
        position: { lat: 48.8566, lng: 2.3522 },
        disponible: true,
    },
    {
        id: 'chf-002',
        nom: 'Sophie Moreau',
        email: 'sophie.moreau@healdrive.fr',
        telephone: '06 98 76 54 32',
        role: 'CHAUFFEUR',
        vehicule: { type: 'TAXI_CONV', immatriculation: 'EF-456-GH', agrement_cpam: 'TX-75-2024-0887' },
        position: { lat: 48.8606, lng: 2.3376 },
        disponible: true,
    },
    {
        id: 'chf-003',
        nom: 'Karim Benali',
        email: 'karim.benali@healdrive.fr',
        telephone: '06 55 44 33 22',
        role: 'CHAUFFEUR',
        vehicule: { type: 'AMBULANCE', immatriculation: 'IJ-789-KL', agrement_cpam: 'AMB-75-2024-0156' },
        position: { lat: 48.8450, lng: 2.3680 },
        disponible: false,
    },
];

const MOCK_PATIENTS = [
    {
        id: 'pat-001',
        nom: 'Marie Dupont',
        email: 'marie.dupont@email.com',
        telephone: '06 11 22 33 44',
        role: 'PATIENT',
        securite_sociale: '2 85 01 75 123 456 78',
        regime: 'Régime général',
    },
    {
        id: 'pat-002',
        nom: 'Jean-Pierre Bernard',
        email: 'jpbernard@email.com',
        telephone: '06 66 77 88 99',
        role: 'PATIENT',
        securite_sociale: '1 72 06 93 456 789 12',
        regime: 'Régime général',
    },
];

const MOCK_PRESCRIPTIONS = [
    {
        id: 'presc-001',
        patient_id: 'pat-001',
        medecin: 'Dr. Claire Fontaine',
        etablissement: 'Hôpital Necker, Paris 15e',
        type_vehicule_requis: 'VSL',
        date_emission: '2026-02-28',
        date_validite: '2026-04-28',
        motif: 'Suivi post-opératoire — chirurgie orthopédique',
        fichier: 'cerfa_S3138_dupont.pdf',
    },
    {
        id: 'presc-002',
        patient_id: 'pat-001',
        medecin: 'Dr. Marc Leroy',
        etablissement: 'CHU Pitié-Salpêtrière, Paris 13e',
        type_vehicule_requis: 'AMBULANCE',
        date_emission: '2026-03-01',
        date_validite: '2026-05-01',
        motif: 'Séance de chimiothérapie — patient allongé obligatoire',
        fichier: 'cerfa_S3138_dupont_chimio.pdf',
    },
    {
        id: 'presc-003',
        patient_id: 'pat-001',
        medecin: 'Dr. Nathalie Perrin',
        etablissement: 'Clinique du Parc, Boulogne',
        type_vehicule_requis: 'TAXI_CONV',
        date_emission: '2026-02-20',
        date_validite: '2026-04-20',
        motif: 'Consultation cardiologie de contrôle',
        fichier: null,
    },
    {
        id: 'presc-004',
        patient_id: 'pat-002',
        medecin: 'Dr. Claire Fontaine',
        etablissement: 'Hôpital Saint-Louis, Paris 10e',
        type_vehicule_requis: 'VSL',
        date_emission: '2026-03-01',
        date_validite: '2026-05-01',
        motif: 'Dialyse rénale — transport assis',
        fichier: 'cerfa_S3138_bernard.pdf',
    },
];

const MOCK_TRAJETS = [
    {
        id: 'trj-001',
        patient_id: 'pat-001',
        chauffeur_id: 'chf-001',
        depart: 'Hôpital Necker, Paris 15e',
        destination: '12 Rue de Vaugirard, Paris 6e',
        date: '2026-03-04',
        heure: '09:30',
        type_vehicule: 'VSL',
        statut: 'ACCEPTE',
        prescription_id: 'presc-001',
        distance_km: 4.2,
        tarif_estime: 18.50,
    },
    {
        id: 'trj-002',
        patient_id: 'pat-001',
        chauffeur_id: null,
        depart: 'CHU Pitié-Salpêtrière, Paris 13e',
        destination: '45 Avenue Daumesnil, Paris 12e',
        date: '2026-03-06',
        heure: '14:00',
        type_vehicule: 'AMBULANCE',
        statut: 'EN_ATTENTE',
        prescription_id: 'presc-002',
        distance_km: 3.8,
        tarif_estime: 42.00,
    },
    {
        id: 'trj-003',
        patient_id: 'pat-001',
        chauffeur_id: 'chf-002',
        depart: 'Clinique du Parc, Boulogne',
        destination: '8 Place de la Nation, Paris 11e',
        date: '2026-02-25',
        heure: '11:00',
        type_vehicule: 'TAXI_CONV',
        statut: 'TERMINE',
        prescription_id: 'presc-003',
        distance_km: 12.1,
        tarif_estime: 35.00,
    },
    {
        id: 'trj-004',
        patient_id: 'pat-001',
        chauffeur_id: 'chf-001',
        depart: 'Hôpital Saint-Louis, Paris 10e',
        destination: '3 Rue Monge, Paris 5e',
        date: '2026-03-02',
        heure: '16:45',
        type_vehicule: 'VSL',
        statut: 'EN_COURS',
        prescription_id: 'presc-001',
        distance_km: 5.6,
        tarif_estime: 22.00,
    },
    {
        id: 'trj-005',
        patient_id: 'pat-002',
        chauffeur_id: null,
        depart: 'Hôpital Saint-Louis, Paris 10e',
        destination: '15 Rue Oberkampf, Paris 11e',
        date: '2026-03-05',
        heure: '08:00',
        type_vehicule: 'VSL',
        statut: 'EN_ATTENTE',
        prescription_id: 'presc-004',
        distance_km: 2.3,
        tarif_estime: 14.00,
    },
];

const MOCK_MESSAGES = {
    'trj-001': [
        { id: 'm1', trajet_id: 'trj-001', expediteur_id: 'chf-001', contenu: 'Bonjour Mme Dupont, je serai là à 9h20. Je suis en VSL gris immatriculé AB-123-CD.', timestamp: '2026-03-04T09:15:00' },
        { id: 'm2', trajet_id: 'trj-001', expediteur_id: 'pat-001', contenu: 'Parfait, je vous attends à l\'entrée principale de l\'hôpital. Merci !', timestamp: '2026-03-04T09:16:00' },
        { id: 'm3', trajet_id: 'trj-001', expediteur_id: 'chf-001', contenu: 'C\'est noté. J\'arrive dans 10 minutes environ.', timestamp: '2026-03-04T09:17:00' },
    ],
    'trj-004': [
        { id: 'm4', trajet_id: 'trj-004', expediteur_id: 'chf-001', contenu: 'Bonjour, je suis en route vers Saint-Louis. Petit embouteillage sur le boulevard, 5 min de retard.', timestamp: '2026-03-02T16:35:00' },
        { id: 'm5', trajet_id: 'trj-004', expediteur_id: 'pat-001', contenu: 'Pas de souci, je suis à l\'accueil du bâtiment C.', timestamp: '2026-03-02T16:37:00' },
    ],
};

const MOCK_NOTIFICATIONS = [
    { id: 'n1', message: 'Votre trajet du 04/03 a été accepté par Philippe L.', time: 'Il y a 12 min', read: false },
    { id: 'n2', message: 'Rappel : transport prévu demain à 14h00.', time: 'Il y a 2h', read: false },
    { id: 'n3', message: 'Votre prescription presc-002 a été validée.', time: 'Hier', read: false },
];

const VEHICULE_LABELS = {
    AMBULANCE: { label: 'Ambulance', icon: 'siren', color: 'text-coral-500', bg: 'bg-red-50' },
    VSL:       { label: 'VSL', icon: 'car', color: 'text-brand-600', bg: 'bg-brand-50' },
    TAXI_CONV: { label: 'Taxi conventionné', icon: 'car-taxi-front', color: 'text-yellow-600', bg: 'bg-yellow-50' },
};

const STATUT_LABELS = {
    EN_ATTENTE: { label: 'En attente', badge: 'badge-waiting', icon: 'clock' },
    ACCEPTE:    { label: 'Accepté', badge: 'badge-accepted', icon: 'check-circle-2' },
    EN_COURS:   { label: 'En cours', badge: 'badge-ongoing', icon: 'navigation' },
    TERMINE:    { label: 'Terminé', badge: 'badge-done', icon: 'flag' },
};


// ————————————————————————————————————————————
//  2. APP STATE
// ————————————————————————————————————————————

const AppState = {
    currentUser: null,
    trajets: [...MOCK_TRAJETS],
    messages: JSON.parse(JSON.stringify(MOCK_MESSAGES)),
    notifications: [...MOCK_NOTIFICATIONS],
    chatRefreshInterval: null,
    notificationsRefreshInterval: null,
};


// ————————————————————————————————————————————
//  3. UTILITIES
// ————————————————————————————————————————————

function refreshIcons() {
    if (window.lucide) lucide.createIcons();
}

function toast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    const icons = { success: 'check-circle-2', error: 'alert-circle', info: 'info' };
    el.className = `toast toast-${type}`;
    el.innerHTML = `<i data-lucide="${icons[type] || 'info'}" class="w-5 h-5 shrink-0"></i><span>${message}</span>`;
    container.appendChild(el);
    refreshIcons();
    setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateX(30px)';
        el.style.transition = 'all .3s ease';
        setTimeout(() => el.remove(), 300);
    }, 3500);
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
}

function formatTime(isoStr) {
    const d = new Date(isoStr);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function todayISO() {
    return new Date().toISOString().split('T')[0];
}

function nowISO() {
    return new Date().toISOString();
}

function getPatient(id)     { return MOCK_PATIENTS.find(p => p.id === id); }
function getChauffeur(id)   { return MOCK_CHAUFFEURS.find(c => c.id === id); }
function getPrescription(id){ return MOCK_PRESCRIPTIONS.find(p => p.id === id); }

function getDashboardRoute() {
    if (!AppState.currentUser) return '/login';
    if (AppState.currentUser.role === 'ADMIN') return '/admin';
    return AppState.currentUser.role === 'CHAUFFEUR' ? '/chauffeur-dashboard' : '/dashboard';
}

function mapTrajetFromApi(trajet) {
    return {
        id: trajet.id ? String(trajet.id) : null,
        patient_id: trajet.patientId ? String(trajet.patientId) : null,
        chauffeur_id: trajet.chauffeurId ? String(trajet.chauffeurId) : null,
        depart: trajet.departAdresse || '',
        destination: trajet.destinationAdresse || '',
        date: trajet.dateTrajet || '',
        heure: trajet.heureTrajet ? String(trajet.heureTrajet).slice(0, 5) : '',
        type_vehicule: trajet.typeVehicule || '',
        statut: trajet.statut || 'EN_ATTENTE',
        prescription_id: trajet.prescriptionId ? String(trajet.prescriptionId) : null,
        distance_km: trajet.distanceKm ?? null,
        tarif_estime: trajet.prixEstime != null ? Number(trajet.prixEstime) : null,
        patient_nom: [trajet.patientPrenom, trajet.patientNom].filter(Boolean).join(' ').trim(),
        chauffeur_nom: [trajet.chauffeurPrenom, trajet.chauffeurNom].filter(Boolean).join(' ').trim(),
    };
}

async function login(email, motDePasse, role) {
    try {
        const url = `${API_URL}/auth/login`;
        console.log('[API] POST', url);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, motDePasse }),
        });

        if (!response.ok) {
            throw new Error('Identifiants invalides.');
        }

        const data = await response.json();
        if (role && data.role !== role) {
            throw new Error(`Ce compte est de type ${data.role}, pas ${role}.`);
        }

        const user = {
            id: data.id ? String(data.id) : null,
            profilId: data.profilId ? String(data.profilId) : null,
            email: data.email,
            nom: [data.prenom, data.nom].filter(Boolean).join(' ').trim(),
            telephone: data.telephone,
            role: data.role,
        };

        AppState.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    } catch (error) {
        toast(error.message || 'Erreur serveur lors de la connexion.', 'error');
        throw error;
    }
}

async function sInscrire(userData) {
    try {
        const url = `${API_URL}/auth/register`;
        console.log('[API] POST', url);
        console.log('[API] PAYLOAD', userData);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error("Impossible de créer le compte.");
        }

        const data = await response.json();
        toast('Inscription réussie. Vous pouvez maintenant vous connecter.', 'success');
        return data;
    } catch (error) {
        toast(error.message || "Erreur serveur lors de l'inscription.", 'error');
        throw error;
    }
}

async function chargerTrajetsPatient(id) {
    try {
        if (!id) {
            AppState.trajets = [];
            return [];
        }

        const url = `${API_URL}/trajets/patient/${id}`;
        console.log('[API] GET', url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Impossible de charger les trajets patient.');
        }

        const data = await response.json();
        const trajets = Array.isArray(data) ? data.map(mapTrajetFromApi) : [];
        AppState.trajets = trajets;
        return trajets;
    } catch (error) {
        toast(error.message || 'Erreur serveur lors du chargement des trajets patient.', 'error');
        throw error;
    }
}

async function chargerTrajetsDisponibles() {
    try {
        const url = `${API_URL}/trajets/disponibles`;
        console.log('[API] GET', url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Impossible de charger les trajets disponibles.');
        }

        const data = await response.json();
        const trajets = Array.isArray(data) ? data.map(mapTrajetFromApi) : [];
        console.log('[API] RESULT /trajets/disponibles', trajets);

        const byId = new Map(AppState.trajets.map(t => [t.id, t]));
        trajets.forEach(t => byId.set(t.id, t));
        AppState.trajets = [...byId.values()];

        return trajets;
    } catch (error) {
        console.error('[API] ERROR /trajets/disponibles', error);
        toast(error.message || 'Erreur serveur lors du chargement des trajets disponibles.', 'error');
        throw error;
    }
}

async function mettreAJourStatut(id, nouveauStatut, chauffeurId = null, commentaire = '') {
    try {
        const url = `${API_URL}/trajets/${id}/statut`;
        console.log('[API] PUT', url);
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nouveauStatut,
                chauffeurId: chauffeurId || undefined,
                commentaire: commentaire || undefined,
            }),
        });

        if (!response.ok) {
            throw new Error('Impossible de mettre à jour le statut du trajet.');
        }

        const data = await response.json();
        const updated = mapTrajetFromApi(data);
        const i = AppState.trajets.findIndex(t => t.id === updated.id);
        if (i >= 0) {
            AppState.trajets[i] = updated;
        } else {
            AppState.trajets.unshift(updated);
        }

        return updated;
    } catch (error) {
        toast(error.message || 'Erreur serveur lors de la mise à jour du statut.', 'error');
        throw error;
    }
}

function mapMessageFromApi(message) {
    return {
        id: message.id ? String(message.id) : ('msg-' + Date.now()),
        trajet_id: message.trajetId ? String(message.trajetId) : null,
        expediteur_id: message.expediteurId ? String(message.expediteurId) : null,
        contenu: message.contenu || '',
        timestamp: message.dateEnvoi || nowISO(),
        lu: message.lu ?? false,
    };
}

function mapNotificationFromApi(notification) {
    return {
        id: notification.id ? String(notification.id) : ('notif-' + Date.now()),
        type: notification.type || 'SYSTEME',
        titre: notification.titre || 'Notification',
        contenu: notification.contenu || notification.message || '',
        message: notification.contenu || notification.message || notification.titre || 'Notification',
        time: notification.dateCreation ? formatTime(notification.dateCreation) : 'À l’instant',
        trajet_id: notification.trajetId ? String(notification.trajetId) : null,
        read: notification.lu ?? false,
    };
}

async function chargerMessagesTrajet(trajetId) {
    try {
        const url = `${API_URL}/messages/trajet/${trajetId}`;
        console.log('[API] GET', url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Impossible de charger les messages du trajet.');
        }

        const data = await response.json();
        const messages = Array.isArray(data) ? data.map(mapMessageFromApi) : [];
        AppState.messages[trajetId] = messages;
        return messages;
    } catch (error) {
        toast(error.message || 'Erreur serveur lors du chargement des messages.', 'error');
        throw error;
    }
}

async function envoyerMessage(trajetId, expediteurId, contenu) {
    try {
        const url = `${API_URL}/messages/trajet/${trajetId}`;
        console.log('[API] POST', url);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                expediteurId,
                contenu,
            }),
        });

        if (!response.ok) {
            throw new Error('Impossible d’envoyer le message.');
        }

        const data = await response.json();
        const message = mapMessageFromApi(data);
        if (!AppState.messages[trajetId]) AppState.messages[trajetId] = [];
        AppState.messages[trajetId].push(message);
        return message;
    } catch (error) {
        toast(error.message || 'Erreur serveur lors de l’envoi du message.', 'error');
        throw error;
    }
}

async function chargerNotificationsUtilisateur(userId) {
    try {
        const url = `${API_URL}/notifications/utilisateur/${userId}`;
        console.log('[API] GET', url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Impossible de charger les notifications.');
        }

        const data = await response.json();
        const notifications = Array.isArray(data) ? data.map(mapNotificationFromApi) : [];
        AppState.notifications = notifications;
        return notifications;
    } catch (error) {
        toast(error.message || 'Erreur serveur lors du chargement des notifications.', 'error');
        throw error;
    }
}

async function marquerNotificationLue(id) {
    try {
        const url = `${API_URL}/notifications/${id}/lu`;
        console.log('[API] PUT', url);
        const response = await fetch(url, {
            method: 'PUT',
        });

        if (!response.ok) {
            throw new Error('Impossible de marquer la notification comme lue.');
        }

        const notif = AppState.notifications.find(n => n.id === id);
        if (notif) notif.read = true;
        rafraichirBadgeNotifications();
        return true;
    } catch (error) {
        toast(error.message || 'Erreur serveur lors de la mise à jour des notifications.', 'error');
        throw error;
    }
}

async function rafraichirBadgeNotifications() {
    if (!AppState.currentUser) return;
    try {
        const userId = AppState.currentUser.id;
        const url = `${API_URL}/notifications/utilisateur/${userId}/unread/count`;
        console.log('[API] GET', url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Impossible de charger le compteur de notifications.');
        }
        const unreadCount = await response.json();
        const badge = document.getElementById('notif-badge');
        if (!badge) return;
        badge.textContent = String(unreadCount);
        badge.style.display = unreadCount > 0 ? 'inline-flex' : 'none';
    } catch (error) {
        console.error('[API] ERROR notifications badge', error);
    }
}

async function gererClicNotifications() {
    if (!AppState.currentUser) return;

    try {
        const userId = AppState.currentUser.id;
        const notifications = await chargerNotificationsUtilisateur(userId);
        const unread = notifications.filter(n => !n.read);

        if (unread.length === 0) {
            toast('Aucune nouvelle notification.', 'info');
            return;
        }

        await Promise.all(unread.map(n => marquerNotificationLue(n.id)));
        document.getElementById('notif-badge').style.display = 'none';
        toast(`${unread.length} notification(s) marquée(s) comme lue(s).`, 'success');
    } catch (error) {
        // toast already handled in API helpers
    }
}

async function creerDemande(payload) {
    try {
        const url = `${API_URL}/trajets`;
        console.log('[API] POST', url);
        console.log('[API] PAYLOAD', payload);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('Impossible de créer la demande de trajet.');
        }

        const data = await response.json();
        const trajet = mapTrajetFromApi(data);
        AppState.trajets.unshift(trajet);
        return trajet;
    } catch (error) {
        toast(error.message || 'Erreur serveur lors de la création de la demande.', 'error');
        throw error;
    }
}


// ————————————————————————————————————————————
//  4. HASH ROUTER
// ————————————————————————————————————————————

const routes = {
    '/':                    renderLogin,
    '/login':               renderLogin,
    '/admin-login':         renderAdminLogin,
    '/register':            renderRegister,
    '/dashboard':           renderPatientDashboard,
    '/new-request':         renderNewRequest,
    '/chauffeur-dashboard': renderChauffeurDashboard,
    '/notifications':       renderNotifications,
    '/course':              renderCourseEnCours,
    '/chat':                renderChat,
    '/admin':               renderAdminDashboard,
};

function navigate(hash) {
    window.location.hash = hash;
}

function handleRoute() {
    if (AppState.chatRefreshInterval) {
        clearInterval(AppState.chatRefreshInterval);
        AppState.chatRefreshInterval = null;
    }
    if (AppState.notificationsRefreshInterval) {
        clearInterval(AppState.notificationsRefreshInterval);
        AppState.notificationsRefreshInterval = null;
    }

    const raw = window.location.hash.slice(1) || '/';
    const [path, query] = raw.split('?');
    const params = new URLSearchParams(query || '');
    const renderer = routes[path];

    // Auth guards
    if (!AppState.currentUser && path === '/admin') {
        navigate('/admin-login');
        return;
    }
    if (!AppState.currentUser && path !== '/' && path !== '/login' && path !== '/admin-login' && path !== '/register') {
        navigate('/login');
        return;
    }
    if (AppState.currentUser && (path === '/' || path === '/login' || path === '/admin-login' || path === '/register')) {
        navigate(getDashboardRoute());
        return;
    }
    if (path === '/admin' && (!AppState.currentUser || AppState.currentUser.role !== 'ADMIN')) {
        navigate('/admin-login');
        return;
    }

    // Update navbar
    const navbar = document.getElementById('navbar');
    const homeLink = document.getElementById('nav-home-link');
    if (AppState.currentUser) {
        navbar.classList.remove('hidden');
        document.getElementById('nav-username').textContent = AppState.currentUser.nom;
        homeLink.href = '#' + getDashboardRoute();

        const roleBadge = document.getElementById('nav-role-badge');
        if (AppState.currentUser.role === 'ADMIN') {
            roleBadge.textContent = 'Admin';
            roleBadge.className = 'text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 hidden sm:inline';
        } else if (AppState.currentUser.role === 'CHAUFFEUR') {
            roleBadge.textContent = 'Chauffeur';
            roleBadge.className = 'text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-mint-400/15 text-green-700 hidden sm:inline';
        } else {
            roleBadge.textContent = 'Patient';
            roleBadge.className = 'text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-100 text-brand-700 hidden sm:inline';
        }
    } else {
        navbar.classList.add('hidden');
    }

    const app = document.getElementById('app-content');
    if (renderer) {
        app.style.opacity = '0';
        setTimeout(() => {
            renderer(app, params);
            app.style.opacity = '1';
            refreshIcons();
        }, 120);
    } else {
        app.innerHTML = `
            <div class="flex flex-col items-center justify-center min-h-screen gap-4">
                <i data-lucide="map-pin-off" class="w-16 h-16 text-brand-300"></i>
                <p class="text-lg text-gray-500">Page introuvable</p>
                <button class="btn-primary" onclick="navigate('${getDashboardRoute()}')">
                    <i data-lucide="arrow-left" class="w-4 h-4"></i> Retour
                </button>
            </div>`;
        refreshIcons();
    }
}

window.addEventListener('hashchange', handleRoute);


// ————————————————————————————————————————————
//  5. NAVBAR EVENTS
// ————————————————————————————————————————————

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-logout').addEventListener('click', () => {
        AppState.currentUser = null;
        toast('Déconnexion réussie.', 'info');
        navigate('/login');
    });

    document.getElementById('btn-notif').addEventListener('click', () => navigate('/notifications'));

    handleRoute();
});



// ————————————————————————————————————————————
//  6. VIEW: LOGIN
// ————————————————————————————————————————————

function renderLogin(container) {
    container.innerHTML = `
    <div class="login-bg flex items-center justify-center px-4 py-12 min-h-screen">
        <div class="w-full max-w-md anim-fade-up" style="position:relative;z-index:1">

            <!-- Logo -->
            <div class="flex items-center justify-center gap-3 mb-8">
                <div class="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg">
                    <i data-lucide="heart-pulse" class="w-7 h-7 text-white"></i>
                </div>
                <div>
                    <h1 class="font-display text-3xl text-brand-900 tracking-tight leading-none">HealDrive</h1>
                    <p class="text-xs text-gray-400 tracking-wide">Transport médical connecté</p>
                </div>
            </div>

            <!-- Login Card -->
            <div class="card-elevated p-8">
                <h2 class="text-lg font-bold text-gray-800 mb-1">Bienvenue</h2>
                <p class="text-sm text-gray-400 mb-6">Connectez-vous à votre espace sécurisé.</p>

                <!-- Role selector -->
                <p class="input-label mb-2">Je suis</p>
                <div class="grid grid-cols-2 gap-3 mb-6" id="role-selector">
                    <label class="role-card active" data-role="PATIENT">
                        <input type="radio" name="role" value="PATIENT" checked>
                        <div class="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-2">
                            <i data-lucide="user-round" class="w-5 h-5 text-brand-600"></i>
                        </div>
                        <span class="block text-sm font-semibold text-gray-700">Patient</span>
                        <span class="block text-[11px] text-gray-400 mt-0.5">Réserver un transport</span>
                    </label>
                    <label class="role-card" data-role="CHAUFFEUR">
                        <input type="radio" name="role" value="CHAUFFEUR">
                        <div class="w-10 h-10 rounded-xl bg-mint-400/10 flex items-center justify-center mb-2">
                            <i data-lucide="truck" class="w-5 h-5 text-green-700"></i>
                        </div>
                        <span class="block text-sm font-semibold text-gray-700">Chauffeur</span>
                        <span class="block text-[11px] text-gray-400 mt-0.5">Gérer mes courses</span>
                    </label>
                </div>

                <!-- Email -->
                <div class="mb-4">
                    <label class="input-label" for="login-email">Adresse email</label>
                    <input class="input-field" type="email" id="login-email" placeholder="exemple@email.com" value="marie.dupont@email.com">
                </div>

                <!-- Password -->
                <div class="mb-2">
                    <label class="input-label" for="login-password">Mot de passe</label>
                    <input class="input-field" type="password" id="login-password" placeholder="••••••••" value="demo1234">
                </div>

                <!-- Forgot password -->
                <div class="text-right mb-6">
                    <a href="#" class="text-xs text-brand-600 hover:text-brand-800 font-medium transition-colors" onclick="event.preventDefault(); toast('Fonctionnalité bientôt disponible.', 'info')">
                        Mot de passe oublié ?
                    </a>
                </div>

                <!-- Login Button -->
                <button id="btn-login" class="btn-primary w-full text-base justify-center">
                    <i data-lucide="log-in" class="w-5 h-5"></i> Se connecter
                </button>
            </div>

            <!-- Register CTA -->
            <div class="mt-6 text-center">
                <p class="text-sm text-gray-500">
                    Pas encore de compte ?
                    <a href="#/register" class="text-brand-600 hover:text-brand-800 font-semibold transition-colors ml-1">
                        Créer un compte
                    </a>
                </p>
            </div>
        </div>
    </div>`;

    // Role card toggle
    const roleCards = container.querySelectorAll('.role-card');
    const emailInput = container.querySelector('#login-email');
    const loginPasswordInput = container.querySelector('#login-password');

    roleCards.forEach(card => {
        card.addEventListener('click', () => {
            roleCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            card.querySelector('input').checked = true;
            const role = card.dataset.role;
            emailInput.value = role === 'CHAUFFEUR' ? 'philippe.lefebvre@healdrive.fr' : 'marie.dupont@email.com';
        });
    });

    container.querySelector('#btn-login').addEventListener('click', async () => {
        const role = container.querySelector('input[name="role"]:checked').value;
        const email = emailInput.value.trim();
        const motDePasse = loginPasswordInput.value;

        if (!email) { toast('Veuillez saisir un email.', 'error'); return; }
        if (!motDePasse) { toast('Veuillez saisir un mot de passe.', 'error'); return; }

        try {
            await login(email, motDePasse, role);
            toast(`Bienvenue, ${AppState.currentUser.nom} !`, 'success');
            navigate(getDashboardRoute());
        } catch (error) {
            toast(error.message || 'Échec de la connexion.', 'error');
        }
    });
}


function renderAdminLogin(container) {
    container.innerHTML = `
    <div class="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-100">
        <div class="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div class="mb-6">
                <p class="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Administration</p>
                <h2 class="text-xl font-bold text-gray-800 mt-1">Connexion Admin</h2>
                <p class="text-sm text-gray-500 mt-1">Accès réservé aux administrateurs HealDrive.</p>
            </div>

            <div class="mb-4">
                <label class="input-label" for="admin-login-email">Email</label>
                <input class="input-field" type="email" id="admin-login-email" placeholder="admin@healdrive.fr">
            </div>

            <div class="mb-6">
                <label class="input-label" for="admin-login-password">Mot de passe</label>
                <input class="input-field" type="password" id="admin-login-password" placeholder="••••••••">
            </div>

            <button id="btn-admin-login" class="btn-primary w-full justify-center">
                <i data-lucide="shield-check" class="w-4 h-4"></i> Se connecter
            </button>

            <p class="text-xs text-gray-400 mt-4 text-center">
                Retour utilisateur:
                <a href="#/login" class="text-brand-600 font-medium hover:text-brand-800">connexion classique</a>
            </p>
        </div>
    </div>`;

    const emailInput = container.querySelector('#admin-login-email');
    const passwordInput = container.querySelector('#admin-login-password');
    const button = container.querySelector('#btn-admin-login');

    button.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        const motDePasse = passwordInput.value;

        if (!email || !motDePasse) {
            toast('Veuillez saisir email et mot de passe.', 'error');
            return;
        }

        try {
            await login(email, motDePasse, 'ADMIN');
            toast('Connexion administrateur réussie.', 'success');
            navigate('/admin');
        } catch (error) {
            toast(error.message || 'Échec de la connexion administrateur.', 'error');
        }
    });
}


// ————————————————————————————————————————————
//  6b. VIEW: REGISTER (NEW)
// ————————————————————————————————————————————

function renderRegister(container) {
    container.innerHTML = `
    <div class="login-bg flex items-center justify-center px-4 py-12 min-h-screen">
        <div class="w-full max-w-lg anim-fade-up" style="position:relative;z-index:1">

            <!-- Logo -->
            <div class="flex items-center justify-center gap-3 mb-8">
                <div class="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center shadow-lg">
                    <i data-lucide="heart-pulse" class="w-7 h-7 text-white"></i>
                </div>
                <div>
                    <h1 class="font-display text-3xl text-brand-900 tracking-tight leading-none">HealDrive</h1>
                    <p class="text-xs text-gray-400 tracking-wide">Transport médical connecté</p>
                </div>
            </div>

            <!-- Register Card -->
            <div class="card-elevated p-8">
                <h2 class="text-lg font-bold text-gray-800 mb-1">Créer un compte</h2>
                <p class="text-sm text-gray-400 mb-6">Rejoignez HealDrive en quelques instants.</p>

                <!-- Role selector -->
                <p class="input-label mb-2">Je m'inscris en tant que</p>
                <div class="grid grid-cols-2 gap-3 mb-6">
                    <label class="role-card active" data-role="PATIENT" id="reg-role-patient">
                        <input type="radio" name="register-role-radio" value="PATIENT" checked>
                        <div class="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-2">
                            <i data-lucide="user-round" class="w-5 h-5 text-brand-600"></i>
                        </div>
                        <span class="block text-sm font-semibold text-gray-700">Patient</span>
                        <span class="block text-[11px] text-gray-400 mt-0.5">J'ai besoin de transport</span>
                    </label>
                    <label class="role-card" data-role="CHAUFFEUR" id="reg-role-chauffeur">
                        <input type="radio" name="register-role-radio" value="CHAUFFEUR">
                        <div class="w-10 h-10 rounded-xl bg-mint-400/10 flex items-center justify-center mb-2">
                            <i data-lucide="truck" class="w-5 h-5 text-green-700"></i>
                        </div>
                        <span class="block text-sm font-semibold text-gray-700">Chauffeur</span>
                        <span class="block text-[11px] text-gray-400 mt-0.5">Je propose mes services</span>
                    </label>
                </div>

                <!-- Hidden select for API compat -->
                <select class="hidden" id="register-role">
                    <option value="PATIENT" selected>PATIENT</option>
                    <option value="CHAUFFEUR">CHAUFFEUR</option>
                </select>

                <!-- Name fields -->
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="input-label" for="register-nom">Nom</label>
                        <input class="input-field" type="text" id="register-nom" placeholder="Dupont">
                    </div>
                    <div>
                        <label class="input-label" for="register-prenom">Prénom</label>
                        <input class="input-field" type="text" id="register-prenom" placeholder="Marie">
                    </div>
                </div>

                <!-- Email -->
                <div class="mb-4">
                    <label class="input-label" for="register-email">Adresse email</label>
                    <input class="input-field" type="email" id="register-email" placeholder="exemple@email.com">
                </div>

                <!-- Phone -->
                <div class="mb-4">
                    <label class="input-label" for="register-telephone">Téléphone</label>
                    <input class="input-field" type="tel" id="register-telephone" placeholder="06 12 34 56 78">
                </div>

                <!-- Password -->
                <div class="mb-4">
                    <label class="input-label" for="register-password">Mot de passe</label>
                    <input class="input-field" type="password" id="register-password" placeholder="Minimum 8 caractères">
                </div>

                <!-- ======= CHAUFFEUR EXPERT SECTION (hidden by default) ======= -->
                <div id="chauffeur-expert-section" class="hidden">
                    <div class="border-t border-gray-100 pt-5 mt-2 mb-4">
                        <div class="flex items-center gap-2 mb-4">
                            <i data-lucide="shield-check" class="w-5 h-5 text-brand-600"></i>
                            <h3 class="text-sm font-bold text-gray-800">Dossier professionnel chauffeur</h3>
                        </div>

                        <div class="rounded-xl bg-amber-50 border border-amber-200 p-3 mb-5 flex gap-2.5">
                            <i data-lucide="info" class="w-4 h-4 text-amber-600 shrink-0 mt-0.5"></i>
                            <p class="text-xs text-amber-800">Votre compte sera <strong>en attente de validation</strong> par notre équipe administrative. Vous recevrez une notification dès l'approbation.</p>
                        </div>

                        <!-- Experience -->
                        <div class="mb-4">
                            <label class="input-label" for="register-experience">Années d'expérience</label>
                            <input class="input-field" type="number" id="register-experience" min="3" max="50" placeholder="Minimum 3 ans">
                            <p class="text-[11px] text-gray-400 mt-1">3 ans minimum requis pour le transport médical.</p>
                        </div>

                        <!-- Documents upload -->
                        <p class="input-label mb-3">Documents obligatoires</p>
                        <div class="grid gap-3 mb-4">
                            <div class="upload-zone-mini" id="zone-permis">
                                <i data-lucide="id-card" class="w-4 h-4 text-brand-500"></i>
                                <span class="text-xs text-gray-600 font-medium">Permis de conduire</span>
                                <input type="file" id="file-permis" accept=".pdf,.jpg,.jpeg,.png" class="hidden">
                                <span class="file-status text-[10px] text-gray-400">Aucun fichier</span>
                            </div>
                            <div class="upload-zone-mini" id="zone-identite">
                                <i data-lucide="credit-card" class="w-4 h-4 text-brand-500"></i>
                                <span class="text-xs text-gray-600 font-medium">Carte d'identité</span>
                                <input type="file" id="file-identite" accept=".pdf,.jpg,.jpeg,.png" class="hidden">
                                <span class="file-status text-[10px] text-gray-400">Aucun fichier</span>
                            </div>
                            <div class="upload-zone-mini" id="zone-assurance">
                                <i data-lucide="file-shield" class="w-4 h-4 text-brand-500"></i>
                                <span class="text-xs text-gray-600 font-medium">Attestation d'assurance</span>
                                <input type="file" id="file-assurance" accept=".pdf,.jpg,.jpeg,.png" class="hidden">
                                <span class="file-status text-[10px] text-gray-400">Aucun fichier</span>
                            </div>
                            <div class="upload-zone-mini" id="zone-carte-grise">
                                <i data-lucide="car" class="w-4 h-4 text-brand-500"></i>
                                <span class="text-xs text-gray-600 font-medium">Carte grise du véhicule</span>
                                <input type="file" id="file-carte-grise" accept=".pdf,.jpg,.jpeg,.png" class="hidden">
                                <span class="file-status text-[10px] text-gray-400">Aucun fichier</span>
                            </div>
                        </div>

                        <!-- First aid kit checkbox -->
                        <label class="flex items-start gap-3 p-3 rounded-xl bg-mint-400/5 border border-mint-400/20 cursor-pointer hover:bg-mint-400/10 transition-colors">
                            <input type="checkbox" id="check-secours" class="mt-0.5 w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500">
                            <div>
                                <span class="text-sm font-medium text-gray-800">Je certifie posséder une trousse de secours</span>
                                <p class="text-[11px] text-gray-400 mt-0.5">Obligatoire pour le transport médical (décret 2003-674).</p>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Register Button -->
                <button id="btn-register" class="btn-primary w-full text-base justify-center mt-4">
                    <i data-lucide="user-plus" class="w-5 h-5"></i> <span id="btn-register-text">Créer mon compte</span>
                </button>
            </div>

            <!-- Back to login -->
            <div class="mt-6 text-center">
                <p class="text-sm text-gray-500">
                    Déjà inscrit ?
                    <a href="#/login" class="text-brand-600 hover:text-brand-800 font-semibold transition-colors ml-1">
                        Se connecter
                    </a>
                </p>
            </div>
        </div>
    </div>`;

    // Role card toggle + show/hide chauffeur section
    const regRoleCards = container.querySelectorAll('.role-card');
    const hiddenSelect = container.querySelector('#register-role');
    const chauffeurSection = container.querySelector('#chauffeur-expert-section');
    const btnText = container.querySelector('#btn-register-text');

    regRoleCards.forEach(card => {
        card.addEventListener('click', () => {
            regRoleCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            card.querySelector('input').checked = true;
            hiddenSelect.value = card.dataset.role;

            if (card.dataset.role === 'CHAUFFEUR') {
                chauffeurSection.classList.remove('hidden');
                btnText.textContent = 'Soumettre ma candidature';
            } else {
                chauffeurSection.classList.add('hidden');
                btnText.textContent = 'Créer mon compte';
            }
        });
    });

    // Document upload zones
    const uploadZones = [
        { zone: '#zone-permis', input: '#file-permis' },
        { zone: '#zone-identite', input: '#file-identite' },
        { zone: '#zone-assurance', input: '#file-assurance' },
        { zone: '#zone-carte-grise', input: '#file-carte-grise' },
    ];

    uploadZones.forEach(({ zone, input }) => {
        const zoneEl = container.querySelector(zone);
        const inputEl = container.querySelector(input);
        if (!zoneEl || !inputEl) return;

        zoneEl.addEventListener('click', () => inputEl.click());
        inputEl.addEventListener('change', () => {
            if (inputEl.files[0]) {
                const statusEl = zoneEl.querySelector('.file-status');
                statusEl.textContent = inputEl.files[0].name;
                statusEl.className = 'file-status text-[10px] text-mint-500 font-semibold';
                zoneEl.classList.add('uploaded');
            }
        });
    });

    // Register action
    container.querySelector('#btn-register').addEventListener('click', async () => {
        const role = hiddenSelect.value;
        const nom = container.querySelector('#register-nom').value.trim();
        const prenom = container.querySelector('#register-prenom').value.trim();
        const email = container.querySelector('#register-email').value.trim();
        const telephone = container.querySelector('#register-telephone').value.trim();
        const motDePasse = container.querySelector('#register-password').value;

        if (!nom || !prenom || !email || !motDePasse || !role || !telephone) {
            toast('Veuillez remplir tous les champs.', 'error');
            return;
        }

        // Chauffeur-specific validation
        if (role === 'CHAUFFEUR') {
            const experience = parseInt(container.querySelector('#register-experience')?.value || '0');
            if (experience < 3) {
                toast('Minimum 3 ans d\'expérience requis.', 'error');
                return;
            }

            const permis = container.querySelector('#file-permis')?.files[0];
            const identite = container.querySelector('#file-identite')?.files[0];
            const assurance = container.querySelector('#file-assurance')?.files[0];
            const carteGrise = container.querySelector('#file-carte-grise')?.files[0];

            if (!permis || !identite || !assurance || !carteGrise) {
                toast('Veuillez fournir tous les documents obligatoires.', 'error');
                return;
            }

            const trousse = container.querySelector('#check-secours')?.checked;
            if (!trousse) {
                toast('Vous devez certifier posséder une trousse de secours.', 'error');
                return;
            }
        }

        try {
            await sInscrire({
                nom,
                prenom,
                email,
                mot_de_passe: motDePasse,
                role,
                telephone,
            });

            if (role === 'CHAUFFEUR') {
                toast('Candidature soumise ! Votre compte est en attente de validation.', 'info');
            }
            navigate('/login');
        } catch (error) {
            // toast already handled in sInscrire
        }
    });
}



// ————————————————————————————————————————————
//  7. VIEW: PATIENT DASHBOARD
// ————————————————————————————————————————————

function renderPatientDashboard(container, params, skipRemoteLoad = false) {
    const user = AppState.currentUser;
    if (!skipRemoteLoad) {
        container.innerHTML = `<div class="pt-24 text-center text-gray-400">Chargement des trajets...</div>`;
        chargerTrajetsPatient(user.profilId || user.id)
            .then(() => {
                renderPatientDashboard(container, params, true);
                refreshIcons();
            })
            .catch((error) => {
                toast(error.message || 'Erreur de chargement.', 'error');
                container.innerHTML = `<div class="pt-24 text-center text-coral-500">Impossible de charger vos trajets.</div>`;
            });
        return;
    }

    const trajets = AppState.trajets.filter(t => t.patient_id === (user.profilId || user.id));
    const counts = {
        EN_ATTENTE: trajets.filter(t => t.statut === 'EN_ATTENTE').length,
        EN_COURS:   trajets.filter(t => t.statut === 'EN_COURS').length,
        ACCEPTE:    trajets.filter(t => t.statut === 'ACCEPTE').length,
        TERMINE:    trajets.filter(t => t.statut === 'TERMINE').length,
    };

    container.innerHTML = `
    <div class="pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 anim-fade-up">
            <div>
                <p class="text-sm text-brand-600 font-semibold tracking-wide uppercase mb-1">Tableau de bord</p>
                <h2 class="section-title">Bonjour, ${user.nom.split(' ')[0]}</h2>
                <p class="text-gray-400 text-sm mt-1">Gérez vos transports médicaux en toute simplicité.</p>
            </div>
            <button class="btn-primary shrink-0" onclick="navigate('/new-request')">
                <i data-lucide="plus" class="w-5 h-5"></i> Nouvelle demande
            </button>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            ${statCard('En attente', counts.EN_ATTENTE, 'clock', 'stat-accent-sand', 'anim-delay-1')}
            ${statCard('Acceptés', counts.ACCEPTE, 'check-circle-2', 'stat-accent-blue', 'anim-delay-2')}
            ${statCard('En cours', counts.EN_COURS, 'navigation', 'stat-accent-mint', 'anim-delay-3')}
            ${statCard('Terminés', counts.TERMINE, 'flag', 'stat-accent-coral', 'anim-delay-4')}
        </div>

        <div class="anim-fade-up" style="animation-delay:.2s">
            <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-gray-800 text-[15px] flex items-center gap-2">
                    <i data-lucide="route" class="w-4 h-4 text-brand-500"></i> Mes trajets
                </h3>
                <span class="text-xs text-gray-400">${trajets.length} trajet(s)</span>
            </div>
            ${trajets.length === 0
                ? `<div class="card-flat">${emptyState('route-off', 'Aucun trajet pour le moment. Faites votre première demande !')}</div>`
                : `<div class="grid gap-4">${trajets.map((t, i) => patientTrajetRow(t, i)).join('')}</div>`
            }
        </div>
    </div>`;

    rafraichirBadgeNotifications();
}

function statCard(label, value, icon, accentClass, delayClass) {
    return `
    <div class="card-flat ${accentClass} px-5 py-4 anim-fade-up ${delayClass}">
        <div class="flex items-center gap-3 mb-2">
            <i data-lucide="${icon}" class="w-4 h-4 text-gray-400"></i>
            <span class="text-xs text-gray-400 font-medium uppercase tracking-wide">${label}</span>
        </div>
        <p class="text-2xl font-bold text-gray-800">${value}</p>
    </div>`;
}

function emptyState(icon, text) {
    return `
    <div class="empty-state">
        <div class="empty-state-icon"><i data-lucide="${icon}" class="w-7 h-7 text-brand-300"></i></div>
        <p class="text-gray-400 text-sm">${text}</p>
    </div>`;
}

function cancelTrajet(id) {
    AppState.trajets = AppState.trajets.filter(t => t.id !== id);
    toast('Trajet annulé.', 'success');
    const app = document.getElementById('app-content');
    renderPatientDashboard(app);
    refreshIcons();
}


// ————————————————————————————————————————————
//  8. VIEW: CHAUFFEUR DASHBOARD
// ————————————————————————————————————————————

function renderChauffeurDashboard(container, params, skipRemoteLoad = false) {
    const user = AppState.currentUser;
    const vehType = user.vehicule?.type || null;

    if (!skipRemoteLoad) {
        container.innerHTML = `<div class="pt-24 text-center text-gray-400">Chargement des courses...</div>`;
        chargerTrajetsDisponibles()
            .then(() => {
                renderChauffeurDashboard(container, params, true);
                refreshIcons();
            })
            .catch((error) => {
                toast(error.message || 'Erreur de chargement.', 'error');
                container.innerHTML = `<div class="pt-24 text-center text-coral-500">Impossible de charger les courses disponibles.</div>`;
            });
        return;
    }

    // Courses available for this chauffeur (matching vehicle type, EN_ATTENTE)
    const available = AppState.trajets.filter(t =>
        t.statut === 'EN_ATTENTE' && (!vehType || t.type_vehicule === vehType)
    );

    // My active courses
    const myCourses = AppState.trajets.filter(t =>
        t.chauffeur_id === (user.profilId || user.id) && (t.statut === 'ACCEPTE' || t.statut === 'EN_COURS')
    );

    // My completed
    const completed = AppState.trajets.filter(t =>
        t.chauffeur_id === (user.profilId || user.id) && t.statut === 'TERMINE'
    );

    container.innerHTML = `
    <div class="pt-24 pb-16 px-4 sm:px-6 max-w-5xl mx-auto">

        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 anim-fade-up">
            <div>
                <p class="text-sm text-mint-500 font-semibold tracking-wide uppercase mb-1">Espace Chauffeur</p>
                <h2 class="section-title">Bonjour, ${user.nom.split(' ')[0]}</h2>
                <p class="text-gray-400 text-sm mt-1 flex items-center gap-2">
                    <i data-lucide="${VEHICULE_LABELS[vehType || 'VSL'].icon}" class="w-4 h-4 ${VEHICULE_LABELS[vehType || 'VSL'].color}"></i>
                    ${VEHICULE_LABELS[vehType || 'VSL'].label} · ${user.vehicule?.immatriculation || 'Immatriculation non renseignée'}
                    · <span class="text-mint-500 font-medium">Disponible</span>
                </p>
            </div>
            <div class="flex gap-3">
                <div class="card-flat px-4 py-2.5 text-center">
                    <p class="text-2xl font-bold text-brand-800">${myCourses.length}</p>
                    <p class="text-[11px] text-gray-400 font-medium uppercase">Active(s)</p>
                </div>
                <div class="card-flat px-4 py-2.5 text-center">
                    <p class="text-2xl font-bold text-gray-600">${completed.length}</p>
                    <p class="text-[11px] text-gray-400 font-medium uppercase">Terminée(s)</p>
                </div>
            </div>
        </div>

        <!-- Active Courses -->
        ${myCourses.length > 0 ? `
        <div class="mb-10 anim-fade-up" style="animation-delay:.1s">
            <div class="flex items-center gap-2 mb-4">
                <span class="pulse-live text-sm font-semibold text-gray-800">Mes courses actives</span>
            </div>
            <div class="grid gap-4">
                ${myCourses.map(t => chauffeurActiveCourseCard(t)).join('')}
            </div>
        </div>` : ''}

        <!-- Available Courses -->
        <div class="anim-fade-up" style="animation-delay:.2s">
            <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-gray-800 text-[15px] flex items-center gap-2">
                    <i data-lucide="radio" class="w-4 h-4 text-brand-500"></i>
                    Courses disponibles
                    <span class="text-xs font-normal text-gray-400">(${vehType ? VEHICULE_LABELS[vehType].label : 'Tous véhicules'})</span>
                </h3>
                <span class="text-xs text-gray-400">${available.length} résultat(s)</span>
            </div>

            ${available.length === 0
                ? `<div class="card-flat">${emptyState('coffee', 'Aucune course disponible pour le moment. Revenez bientôt !')}</div>`
                : `<div class="grid gap-4">${available.map((t, i) => chauffeurAvailableCourseCard(t, i)).join('')}</div>`
            }
        </div>

        <!-- Completed -->
        ${completed.length > 0 ? `
        <div class="mt-10 anim-fade-up" style="animation-delay:.3s">
            <h3 class="font-semibold text-gray-800 text-[15px] mb-4 flex items-center gap-2">
                <i data-lucide="flag" class="w-4 h-4 text-gray-400"></i> Historique
            </h3>
            <div class="card-flat overflow-hidden">
                ${completed.map((t, i) => chauffeurCompletedRow(t, i)).join('')}
            </div>
        </div>` : ''}
    </div>`;

    rafraichirBadgeNotifications();
}

function chauffeurActiveCourseCard(t) {
    const patient = getPatient(t.patient_id);
    const presc = getPrescription(t.prescription_id);
    const veh = VEHICULE_LABELS[t.type_vehicule];
    const stat = STATUT_LABELS[t.statut];

    return `
    <div class="course-card" style="border-left: 3px solid var(--mint-500)">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-3">
                    <span class="badge ${stat.badge}">${stat.label}</span>
                    <span class="badge" style="background:#f0f7ff;color:#01599f">${veh.label}</span>
                    <span class="text-xs text-gray-400">${formatDate(t.date)} · ${t.heure}</span>
                </div>

                <div class="flex items-start gap-3 mb-3">
                    <div class="flex flex-col items-center gap-1 mt-1">
                        <div class="w-2.5 h-2.5 rounded-full bg-brand-500"></div>
                        <div class="w-px h-6 bg-gray-200"></div>
                        <div class="w-2.5 h-2.5 rounded-full bg-mint-500"></div>
                    </div>
                    <div>
                        <p class="text-sm font-semibold text-gray-800">${t.depart}</p>
                        <p class="text-sm text-gray-500 mt-2">${t.destination}</p>
                    </div>
                </div>

                ${patient ? `
                <div class="flex items-center gap-3 mt-4 p-3 rounded-xl bg-sand-100">
                    <div class="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center">
                        <i data-lucide="user-round" class="w-4 h-4 text-brand-600"></i>
                    </div>
                    <div>
                        <p class="text-sm font-semibold text-gray-800">${patient.nom}</p>
                        <p class="text-xs text-gray-400">${patient.telephone} · ${patient.regime || ''}</p>
                    </div>
                </div>` : ''}

                ${presc ? `
                <div class="prescription-card mt-3">
                    <p class="text-xs font-semibold text-brand-800 mb-2">Prescription médicale</p>
                    <div class="grid gap-1">
                        <div class="detail-row"><span class="detail-label">Médecin</span><span class="detail-value">${presc.medecin}</span></div>
                        <div class="detail-row"><span class="detail-label">Établissement</span><span class="detail-value">${presc.etablissement}</span></div>
                        <div class="detail-row"><span class="detail-label">Motif</span><span class="detail-value text-xs">${presc.motif}</span></div>
                        <div class="detail-row"><span class="detail-label">Validité</span><span class="detail-value">${formatDate(presc.date_validite)}</span></div>
                        ${presc.fichier ? `<div class="detail-row"><span class="detail-label">Document</span><span class="detail-value text-brand-600 text-xs"><i data-lucide="paperclip" class="w-3 h-3 inline"></i> ${presc.fichier}</span></div>` : ''}
                    </div>
                </div>` : ''}
            </div>

            <div class="flex flex-col gap-2 sm:items-end shrink-0">
                ${t.distance_km ? `<span class="text-xs text-gray-400">${t.distance_km} km · ${t.tarif_estime?.toFixed(2)} €</span>` : ''}
                <button class="btn-ghost text-xs" onclick="navigate('/chat?trajet=${t.id}')">
                    <i data-lucide="message-circle" class="w-3.5 h-3.5"></i> Chat patient
                </button>
                ${t.statut === 'EN_COURS' ? `
                <button class="btn-primary text-xs" onclick="terminerCourse('${t.id}')">
                    <i data-lucide="check-circle-2" class="w-4 h-4"></i> Terminer la course
                </button>` : `
                <button class="btn-primary text-xs" onclick="demarrerCourse('${t.id}')">
                    <i data-lucide="navigation" class="w-4 h-4"></i> Démarrer
                </button>`}
            </div>
        </div>
    </div>`;
}

function chauffeurAvailableCourseCard(t, index) {
    const patient = getPatient(t.patient_id);
    const presc = getPrescription(t.prescription_id);
    const veh = VEHICULE_LABELS[t.type_vehicule];

    return `
    <div class="course-card anim-fade-up anim-delay-${Math.min(index + 1, 4)}">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2">
                    <span class="badge badge-waiting">Nouvelle</span>
                    <span class="text-xs text-gray-400">${formatDate(t.date)} · ${t.heure}</span>
                    ${t.distance_km ? `<span class="text-xs font-medium text-gray-500">${t.distance_km} km</span>` : ''}
                </div>

                <div class="flex items-start gap-3">
                    <div class="flex flex-col items-center gap-1 mt-1">
                        <div class="w-2 h-2 rounded-full bg-brand-400"></div>
                        <div class="w-px h-5 bg-gray-200"></div>
                        <div class="w-2 h-2 rounded-full bg-mint-400"></div>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-800">${t.depart}</p>
                        <p class="text-sm text-gray-500 mt-1.5">${t.destination}</p>
                    </div>
                </div>

                ${patient ? `<p class="text-xs text-gray-400 mt-2"><i data-lucide="user-round" class="w-3 h-3 inline"></i> ${patient.nom}</p>` : ''}
                ${presc ? `<p class="text-xs text-gray-400 mt-1"><i data-lucide="file-text" class="w-3 h-3 inline"></i> ${presc.motif}</p>` : ''}
            </div>

            <div class="flex flex-col gap-2 sm:items-end shrink-0">
                ${t.tarif_estime ? `<span class="text-lg font-bold text-brand-800">${t.tarif_estime.toFixed(2)} €</span>` : ''}
                <button class="btn-primary text-sm" onclick="accepterCourse('${t.id}')">
                    <i data-lucide="check" class="w-4 h-4"></i> Accepter
                </button>
            </div>
        </div>
    </div>`;
}

function chauffeurCompletedRow(t, index) {
    const patient = getPatient(t.patient_id);
    return `
    <div class="trajet-row anim-fade-up anim-delay-${Math.min(index + 1, 4)}">
        <div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <i data-lucide="flag" class="w-4 h-4 text-gray-400"></i>
        </div>
        <div class="min-w-0">
            <p class="text-sm text-gray-600 truncate">${t.depart} → ${t.destination}</p>
            <p class="text-xs text-gray-400">${formatDate(t.date)} · ${patient ? patient.nom : ''}</p>
        </div>
        <span class="badge badge-done">Terminé</span>
        <span class="text-sm font-semibold text-gray-600">${t.tarif_estime?.toFixed(2) || '—'} €</span>
    </div>`;
}


// ————————————————————————————————————————————
//  9. CHAUFFEUR ACTIONS
// ————————————————————————————————————————————

async function accepterCourse(trajetId) {
    try {
        const t = await mettreAJourStatut(trajetId, 'ACCEPTE', AppState.currentUser.profilId || AppState.currentUser.id);

        // Seed initial chat message
        if (!AppState.messages[trajetId]) AppState.messages[trajetId] = [];
        AppState.messages[trajetId].push({
            id: 'auto-' + Date.now(),
            trajet_id: trajetId,
            expediteur_id: AppState.currentUser.id,
            contenu: `Bonjour, j'ai accepté votre course. Je serai en ${VEHICULE_LABELS[t.type_vehicule]?.label || 'véhicule médical'}. À bientôt !`,
            timestamp: nowISO(),
        });

        toast('Course acceptée !', 'success');
        renderChauffeurDashboard(document.getElementById('app-content'), null, true);
        refreshIcons();
    } catch (error) {
        toast(error.message || 'Impossible d’accepter la course.', 'error');
    }
}

async function demarrerCourse(trajetId) {
    try {
        await mettreAJourStatut(trajetId, 'EN_COURS', AppState.currentUser.profilId || AppState.currentUser.id);
        toast('Course démarrée. Bonne route !', 'success');
        renderChauffeurDashboard(document.getElementById('app-content'), null, true);
        refreshIcons();
    } catch (error) {
        toast(error.message || 'Impossible de démarrer la course.', 'error');
    }
}

async function terminerCourse(trajetId) {
    try {
        await mettreAJourStatut(trajetId, 'TERMINE', AppState.currentUser.profilId || AppState.currentUser.id);
        toast('Course terminée. Merci !', 'success');
        renderChauffeurDashboard(document.getElementById('app-content'), null, true);
        refreshIcons();
    } catch (error) {
        toast(error.message || 'Impossible de terminer la course.', 'error');
    }
}


// ————————————————————————————————————————————
//  10. VIEW: COURSE EN COURS (Standalone detail)
// ————————————————————————————————————————————

function renderCourseEnCours(container, params) {
    const trajetId = params.get('trajet');
    const t = AppState.trajets.find(tr => tr.id === trajetId);

    if (!t) {
        container.innerHTML = `<div class="pt-24 text-center text-gray-400">Course introuvable.</div>`;
        return;
    }

    const patient = getPatient(t.patient_id);
    const presc = getPrescription(t.prescription_id);
    const chauffeur = t.chauffeur_id ? getChauffeur(t.chauffeur_id) : null;
    const veh = VEHICULE_LABELS[t.type_vehicule];
    const stat = STATUT_LABELS[t.statut];

    container.innerHTML = `
    <div class="pt-24 pb-16 px-4 sm:px-6 max-w-2xl mx-auto">
        <button class="btn-ghost text-xs mb-6 anim-fade" onclick="navigate('${getDashboardRoute()}')">
            <i data-lucide="arrow-left" class="w-4 h-4"></i> Retour
        </button>

        <div class="card-elevated p-6 sm:p-8 anim-fade-up">
            <div class="flex items-center justify-between mb-6">
                <h2 class="section-title text-xl">Détail de la course</h2>
                <span class="badge ${stat.badge}">${stat.label}</span>
            </div>

            <div class="grid gap-2 mb-6">
                <div class="detail-row"><span class="detail-label">Départ</span><span class="detail-value">${t.depart}</span></div>
                <div class="detail-row"><span class="detail-label">Destination</span><span class="detail-value">${t.destination}</span></div>
                <div class="detail-row"><span class="detail-label">Date</span><span class="detail-value">${formatDate(t.date)} à ${t.heure}</span></div>
                <div class="detail-row"><span class="detail-label">Véhicule</span><span class="detail-value ${veh.color}">${veh.label}</span></div>
                ${t.distance_km ? `<div class="detail-row"><span class="detail-label">Distance</span><span class="detail-value">${t.distance_km} km</span></div>` : ''}
                ${t.tarif_estime ? `<div class="detail-row"><span class="detail-label">Tarif estimé</span><span class="detail-value">${t.tarif_estime.toFixed(2)} €</span></div>` : ''}
            </div>

            ${patient ? `
            <div class="p-3 rounded-xl bg-sand-100 mb-4">
                <p class="text-xs font-semibold text-gray-500 uppercase mb-2">Patient</p>
                <p class="text-sm font-semibold text-gray-800">${patient.nom}</p>
                <p class="text-xs text-gray-400">${patient.telephone} · ${patient.securite_sociale}</p>
            </div>` : ''}

            ${chauffeur ? `
            <div class="p-3 rounded-xl bg-sand-100 mb-4">
                <p class="text-xs font-semibold text-gray-500 uppercase mb-2">Chauffeur</p>
                <p class="text-sm font-semibold text-gray-800">${chauffeur.nom}</p>
                <p class="text-xs text-gray-400">${chauffeur.telephone} · ${chauffeur.vehicule.immatriculation}</p>
            </div>` : ''}

            ${presc ? `
            <div class="prescription-card mb-4">
                <p class="text-xs font-semibold text-brand-800 mb-2">Prescription</p>
                <div class="grid gap-1">
                    <div class="detail-row"><span class="detail-label">Médecin</span><span class="detail-value">${presc.medecin}</span></div>
                    <div class="detail-row"><span class="detail-label">Motif</span><span class="detail-value text-xs">${presc.motif}</span></div>
                    <div class="detail-row"><span class="detail-label">Validité</span><span class="detail-value">Jusqu'au ${formatDate(presc.date_validite)}</span></div>
                </div>
            </div>` : ''}

            <div class="flex gap-3 mt-6">
                <button class="btn-ghost flex-1" onclick="navigate('/chat?trajet=${t.id}')">
                    <i data-lucide="message-circle" class="w-4 h-4"></i> Ouvrir le chat
                </button>
                ${t.statut === 'EN_COURS' && AppState.currentUser.role === 'CHAUFFEUR' ? `
                <button class="btn-primary flex-1" onclick="terminerCourse('${t.id}'); navigate('${getDashboardRoute()}');">
                    <i data-lucide="check-circle-2" class="w-4 h-4"></i> Terminer
                </button>` : ''}
            </div>
        </div>
    </div>`;
}


// ————————————————————————————————————————————
//  11. VIEW: CHAT
// ————————————————————————————————————————————

function renderChat(container, params) {
    const trajetId = params.get('trajet');
    const t = AppState.trajets.find(tr => tr.id === trajetId);

    if (!t) {
        container.innerHTML = `<div class="pt-24 text-center text-gray-400">Conversation introuvable.</div>`;
        return;
    }

    const user = AppState.currentUser;
    const isPatient = user.role === 'PATIENT';
    const otherPerson = isPatient
        ? (t.chauffeur_id ? getChauffeur(t.chauffeur_id) : null)
        : getPatient(t.patient_id);

    const otherName = otherPerson ? otherPerson.nom : 'Inconnu';
    const messages = AppState.messages[trajetId] || [];

    container.innerHTML = `
    <div class="pt-20 pb-4 px-4 sm:px-6 max-w-2xl mx-auto">

        <!-- Chat Header -->
        <div class="card-flat p-4 mb-2 flex items-center justify-between anim-fade">
            <div class="flex items-center gap-3">
                <button class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" onclick="navigate('${getDashboardRoute()}')">
                    <i data-lucide="arrow-left" class="w-5 h-5 text-gray-500"></i>
                </button>
                <div class="w-9 h-9 rounded-full ${isPatient ? 'bg-mint-400/15' : 'bg-brand-100'} flex items-center justify-center">
                    <i data-lucide="${isPatient ? 'truck' : 'user-round'}" class="w-4 h-4 ${isPatient ? 'text-green-700' : 'text-brand-600'}"></i>
                </div>
                <div>
                    <p class="text-sm font-semibold text-gray-800">${otherName}</p>
                    <p class="text-xs text-gray-400">${t.depart} → ${t.destination}</p>
                </div>
            </div>
            <button class="btn-ghost text-xs py-1.5 px-3" onclick="navigate('/course?trajet=${t.id}')">
                <i data-lucide="info" class="w-3.5 h-3.5"></i> Détails
            </button>
        </div>

        <!-- Chat Body -->
        <div class="card-flat overflow-hidden chat-container anim-fade-up">
            <div class="chat-messages" id="chat-messages">
                ${messages.length === 0
                    ? `<div class="flex-1 flex flex-col items-center justify-center text-gray-400 text-sm">
                           <i data-lucide="message-circle" class="w-10 h-10 mb-3 opacity-30"></i>
                           <p>Aucun message. Commencez la conversation !</p>
                       </div>`
                    : messages.map(m => chatBubble(m, user.id)).join('')
                }
            </div>

            <div class="chat-input-bar">
                <input class="chat-input" id="chat-input" type="text" placeholder="Écrivez un message..." autocomplete="off">
                <button class="chat-send-btn" id="btn-send-chat">
                    <i data-lucide="send" class="w-5 h-5"></i>
                </button>
            </div>
        </div>
    </div>`;

    // Scroll to bottom
    const messagesContainer = container.querySelector('#chat-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    async function refreshMessages() {
        try {
            const remoteMessages = await chargerMessagesTrajet(trajetId);
            messagesContainer.innerHTML = remoteMessages.length === 0
                ? `<div class="flex-1 flex flex-col items-center justify-center text-gray-400 text-sm">
                       <i data-lucide="message-circle" class="w-10 h-10 mb-3 opacity-30"></i>
                       <p>Aucun message. Commencez la conversation !</p>
                   </div>`
                : remoteMessages.map(m => chatBubble(m, user.id)).join('');
            refreshIcons();
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            // toast already handled in chargerMessagesTrajet
        }
    }

    refreshMessages();
    AppState.chatRefreshInterval = setInterval(refreshMessages, 5000);

    // Send message
    const input = container.querySelector('#chat-input');
    const sendBtn = container.querySelector('#btn-send-chat');

    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        try {
            const msg = await envoyerMessage(trajetId, user.id, text);

            const wasEmpty = messagesContainer.querySelector('.flex-1.flex.flex-col');
            if (wasEmpty) wasEmpty.remove();

            messagesContainer.insertAdjacentHTML('beforeend', chatBubble(msg, user.id));
            refreshIcons();
            input.value = '';
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            refreshMessages();
        } catch (error) {
            // toast already handled in envoyerMessage
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') sendMessage();
    });

    // Focus input
    setTimeout(() => input.focus(), 200);
}

function chatBubble(msg, currentUserId) {
    const rawSenderId = msg.expediteur_id ?? msg.expediteurId ?? msg.expediteur?.id ?? '';
    const rawCurrentUserId = AppState.currentUser?.id ?? currentUserId ?? '';
    console.log('Comparaison:', rawSenderId, rawCurrentUserId);

    const normalizeId = (value) =>
        String(value || '')
            .toLowerCase()
            .replace(/-/g, '')
            .trim();

    const fromId = normalizeId(rawSenderId);
    const me = normalizeId(rawCurrentUserId);
    const isMine = fromId !== '' && fromId === me;

    return `
    <div class="chat-bubble ${isMine ? 'chat-bubble-sent' : 'chat-bubble-received'}">
        ${msg.contenu}
        <span class="chat-bubble-time">${formatTime(msg.timestamp)}</span>
    </div>`;
}

function renderNotifications(container) {
    if (!AppState.currentUser) {
        navigate('/login');
        return;
    }

    container.innerHTML = `
    <div class="pt-24 pb-16 px-4 sm:px-6 max-w-3xl mx-auto">
        <div class="flex items-center justify-between mb-6 anim-fade-up">
            <div>
                <p class="text-sm text-brand-600 font-semibold tracking-wide uppercase mb-1">Notifications</p>
                <h2 class="section-title">Centre de notifications</h2>
            </div>
            <button class="btn-ghost text-xs" onclick="navigate('${getDashboardRoute()}')">
                <i data-lucide="arrow-left" class="w-4 h-4"></i> Retour
            </button>
        </div>
        <div id="notifications-list" class="card-flat overflow-hidden">
            <div class="p-6 text-sm text-gray-400">Chargement...</div>
        </div>
    </div>`;

    const listEl = container.querySelector('#notifications-list');

    async function loadNotifications() {
        try {
            const notifications = await chargerNotificationsUtilisateur(AppState.currentUser.id);
            console.log(notifications);
            if (notifications.length === 0) {
                listEl.innerHTML = `<div class="p-6 text-sm text-gray-400">Aucune notification.</div>`;
            } else {
                listEl.innerHTML = notifications.map(n => `
                    <button class="w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${n.read ? '' : 'bg-brand-50/40'}" onclick="marquerNotificationLue('${n.id}').then(() => navigate('/notifications'))">
                        <div class="flex items-start justify-between gap-4">
                            <div>
                                <p class="text-sm font-semibold text-gray-800">${n.titre || 'Notification'}</p>
                                <p class="text-sm text-gray-600 mt-1">${n.contenu || n.message}</p>
                            </div>
                            <div class="shrink-0 text-xs text-gray-400">${n.time}</div>
                        </div>
                    </button>
                `).join('');
            }
            rafraichirBadgeNotifications();
            refreshIcons();
        } catch (error) {
            listEl.innerHTML = `<div class="p-6 text-sm text-coral-500">Impossible de charger les notifications.</div>`;
        }
    }

    loadNotifications();
    AppState.notificationsRefreshInterval = setInterval(loadNotifications, 5000);
}


// ————————————————————————————————————————————
//  12. VIEW: NEW TRANSPORT REQUEST (Patient)
// ————————————————————————————————————————————

function renderNewRequest(container) {
    container.innerHTML = `
    <div class="pt-24 pb-16 px-4 sm:px-6 max-w-2xl mx-auto">
        <button class="btn-ghost text-xs mb-6 anim-fade" onclick="navigate('/dashboard')">
            <i data-lucide="arrow-left" class="w-4 h-4"></i> Retour au tableau de bord
        </button>

        <div class="card-elevated p-6 sm:p-8 anim-fade-up">
            <h2 class="section-title mb-1">Nouvelle demande</h2>
            <p class="text-sm text-gray-400 mb-8">Remplissez les informations de votre transport médical.</p>

            <div class="flex items-center gap-2 mb-8" id="step-indicators">
                <div class="step-dot active" data-step="1">
                    <span class="w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                    <span class="text-xs font-medium text-brand-700 mt-1 hidden sm:block">Trajet</span>
                </div>
                <div class="flex-1 h-px bg-gray-200"></div>
                <div class="step-dot" data-step="2">
                    <span class="w-7 h-7 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center">2</span>
                    <span class="text-xs font-medium text-gray-400 mt-1 hidden sm:block">Prescription</span>
                </div>
                <div class="flex-1 h-px bg-gray-200"></div>
                <div class="step-dot" data-step="3">
                    <span class="w-7 h-7 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center">3</span>
                    <span class="text-xs font-medium text-gray-400 mt-1 hidden sm:block">Confirmation</span>
                </div>
            </div>

            <!-- STEP 1: TRAJET -->
            <div id="form-step-1">
                <div class="grid gap-5">
                    <div>
                        <label class="input-label" for="req-depart"><i data-lucide="map-pin" class="w-3.5 h-3.5 inline text-brand-500"></i> Lieu de départ</label>
                        <input class="input-field" id="req-depart" placeholder="Ex: Hôpital Necker, Paris 15e">
                    </div>
                    <div>
                        <label class="input-label" for="req-dest"><i data-lucide="flag" class="w-3.5 h-3.5 inline text-mint-500"></i> Destination</label>
                        <input class="input-field" id="req-dest" placeholder="Ex: 12 Rue de Vaugirard, Paris 6e">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="input-label" for="req-date">Date</label>
                            <input class="input-field" type="date" id="req-date" min="${todayISO()}">
                        </div>
                        <div>
                            <label class="input-label" for="req-heure">Heure</label>
                            <input class="input-field" type="time" id="req-heure" value="09:00">
                        </div>
                    </div>
                    <div>
                        <label class="input-label">Type de véhicule prescrit</label>
                        <div class="grid grid-cols-3 gap-3 mt-1" id="vehicule-selector">
                            <label class="role-card active" data-type="VSL">
                                <input type="radio" name="vehicule" value="VSL" checked>
                                <i data-lucide="car" class="w-6 h-6 mx-auto mb-1.5 text-brand-600"></i>
                                <span class="text-xs font-semibold text-gray-600">VSL</span>
                            </label>
                            <label class="role-card" data-type="AMBULANCE">
                                <input type="radio" name="vehicule" value="AMBULANCE">
                                <i data-lucide="siren" class="w-6 h-6 mx-auto mb-1.5 text-coral-500"></i>
                                <span class="text-xs font-semibold text-gray-600">Ambulance</span>
                            </label>
                            <label class="role-card" data-type="TAXI_CONV">
                                <input type="radio" name="vehicule" value="TAXI_CONV">
                                <i data-lucide="car-taxi-front" class="w-6 h-6 mx-auto mb-1.5 text-yellow-600"></i>
                                <span class="text-xs font-semibold text-gray-600">Taxi conv.</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="mt-8 flex justify-end">
                    <button class="btn-primary" id="btn-step1-next">Suivant <i data-lucide="arrow-right" class="w-4 h-4"></i></button>
                </div>
            </div>

            <!-- STEP 2: PRESCRIPTION -->
            <div id="form-step-2" class="hidden">
                <div class="grid gap-5">
                    <div>
                        <label class="input-label" for="req-medecin">Médecin prescripteur</label>
                        <input class="input-field" id="req-medecin" placeholder="Dr. Nom Prénom">
                    </div>
                    <div>
                        <label class="input-label" for="req-etab">Établissement de soin</label>
                        <input class="input-field" id="req-etab" placeholder="Nom de l'hôpital ou clinique">
                    </div>
                    <div>
                        <label class="input-label" for="req-motif">Motif médical</label>
                        <input class="input-field" id="req-motif" placeholder="Ex: Suivi post-opératoire, séance de dialyse...">
                    </div>
                    <div>
                        <label class="input-label">Bon de transport (Cerfa S3138)</label>
                        <div class="upload-zone" id="upload-zone">
                            <i data-lucide="upload-cloud" class="w-8 h-8 text-brand-400"></i>
                            <p class="text-sm text-gray-500">Glissez votre fichier ici ou <span class="text-brand-600 font-semibold cursor-pointer">parcourir</span></p>
                            <p class="text-xs text-gray-400">PDF ou image — 5 Mo max.</p>
                            <input type="file" id="file-prescription" accept=".pdf,.jpg,.jpeg,.png" class="hidden">
                        </div>
                        <p id="file-name" class="text-xs text-mint-500 font-medium mt-2 hidden"><i data-lucide="paperclip" class="w-3 h-3 inline"></i> <span></span></p>
                    </div>
                    <div>
                        <label class="input-label" for="req-notes">Notes complémentaires <span class="text-gray-300 font-normal">(optionnel)</span></label>
                        <textarea class="input-field" id="req-notes" rows="3" placeholder="Fauteuil roulant nécessaire, accompagnant..."></textarea>
                    </div>
                </div>
                <div class="mt-8 flex justify-between">
                    <button class="btn-ghost" id="btn-step2-back"><i data-lucide="arrow-left" class="w-4 h-4"></i> Retour</button>
                    <button class="btn-primary" id="btn-step2-next">Suivant <i data-lucide="arrow-right" class="w-4 h-4"></i></button>
                </div>
            </div>

            <!-- STEP 3: CONFIRMATION -->
            <div id="form-step-3" class="hidden">
                <div class="rounded-2xl bg-brand-50/60 border border-brand-100 p-5 mb-6">
                    <h4 class="font-semibold text-brand-900 text-sm mb-4 flex items-center gap-2">
                        <i data-lucide="clipboard-check" class="w-4 h-4"></i> Récapitulatif
                    </h4>
                    <div id="summary-content" class="grid gap-3 text-sm"></div>
                </div>
                <div class="rounded-2xl bg-yellow-50 border border-yellow-200 p-4 mb-6 flex gap-3">
                    <i data-lucide="alert-triangle" class="w-5 h-5 text-yellow-600 shrink-0 mt-0.5"></i>
                    <p class="text-sm text-yellow-800">En confirmant, votre demande sera envoyée aux chauffeurs disponibles à proximité. Vous recevrez une notification dès qu'un chauffeur accepte.</p>
                </div>
                <div class="mt-6 flex justify-between">
                    <button class="btn-ghost" id="btn-step3-back"><i data-lucide="arrow-left" class="w-4 h-4"></i> Modifier</button>
                    <button class="btn-primary" id="btn-submit"><i data-lucide="send" class="w-5 h-5"></i> Confirmer la demande</button>
                </div>
            </div>
        </div>
    </div>`;

    // --- Step logic (same as before, enhanced) ---
    const steps = [
        container.querySelector('#form-step-1'),
        container.querySelector('#form-step-2'),
        container.querySelector('#form-step-3'),
    ];

    function showStep(idx) {
        steps.forEach((s, i) => s.classList.toggle('hidden', i !== idx));
        updateStepIndicators(idx);
        refreshIcons();
    }

    function updateStepIndicators(activeIdx) {
        container.querySelectorAll('.step-dot').forEach((dot, i) => {
            const circle = dot.querySelector('span:first-child');
            const label = dot.querySelector('span:last-child');
            if (i <= activeIdx) {
                circle.className = 'w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center';
                if (label) label.className = 'text-xs font-medium text-brand-700 mt-1 hidden sm:block';
            } else {
                circle.className = 'w-7 h-7 rounded-full bg-gray-200 text-gray-500 text-xs font-bold flex items-center justify-center';
                if (label) label.className = 'text-xs font-medium text-gray-400 mt-1 hidden sm:block';
            }
        });
    }

    // Vehicle selector
    container.querySelectorAll('#vehicule-selector .role-card').forEach(card => {
        card.addEventListener('click', () => {
            container.querySelectorAll('#vehicule-selector .role-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            card.querySelector('input').checked = true;
        });
    });

    // File upload
    const uploadZone = container.querySelector('#upload-zone');
    const fileInput = container.querySelector('#file-prescription');
    const fileNameEl = container.querySelector('#file-name');

    uploadZone.addEventListener('click', () => fileInput.click());
    uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('dragging'); });
    uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragging'));
    uploadZone.addEventListener('drop', e => {
        e.preventDefault();
        uploadZone.classList.remove('dragging');
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFile(e.dataTransfer.files[0]);
        }
    });
    fileInput.addEventListener('change', () => { if (fileInput.files[0]) handleFile(fileInput.files[0]); });

    function handleFile(file) {
        fileNameEl.classList.remove('hidden');
        fileNameEl.querySelector('span').textContent = file.name;
        toast('Fichier ajouté : ' + file.name, 'success');
    }

    // Navigation
    container.querySelector('#btn-step1-next').addEventListener('click', () => {
        const depart = container.querySelector('#req-depart').value.trim();
        const dest = container.querySelector('#req-dest').value.trim();
        const date = container.querySelector('#req-date').value;
        if (!depart || !dest || !date) { toast('Veuillez remplir tous les champs obligatoires.', 'error'); return; }
        showStep(1);
    });

    container.querySelector('#btn-step2-next').addEventListener('click', () => {
        const medecin = container.querySelector('#req-medecin').value.trim();
        if (!medecin) { toast('Veuillez indiquer le médecin prescripteur.', 'error'); return; }
        populateSummary();
        showStep(2);
    });

    container.querySelector('#btn-step2-back').addEventListener('click', () => showStep(0));
    container.querySelector('#btn-step3-back').addEventListener('click', () => showStep(1));

    function populateSummary() {
        const veh = container.querySelector('input[name="vehicule"]:checked').value;
        const vehInfo = VEHICULE_LABELS[veh];
        const summaryEl = container.querySelector('#summary-content');
        const rows = [
            ['Départ', container.querySelector('#req-depart').value],
            ['Destination', container.querySelector('#req-dest').value],
            ['Date & heure', `${formatDate(container.querySelector('#req-date').value)} à ${container.querySelector('#req-heure').value}`],
            ['Véhicule', vehInfo.label],
            ['Médecin', container.querySelector('#req-medecin').value],
            ['Établissement', container.querySelector('#req-etab').value || '—'],
            ['Motif', container.querySelector('#req-motif').value || '—'],
            ['Prescription', fileInput.files[0] ? fileInput.files[0].name : 'Non fournie'],
        ];
        summaryEl.innerHTML = rows.map(([label, val]) => `
            <div class="flex justify-between gap-4">
                <span class="text-gray-500 shrink-0">${label}</span>
                <span class="font-medium text-gray-800 text-right">${val}</span>
            </div>`).join('');
    }

    // Submit
    container.querySelector('#btn-submit').addEventListener('click', async () => {
        const veh = container.querySelector('input[name="vehicule"]:checked').value;
        const depart = container.querySelector('#req-depart').value;
        const dest = container.querySelector('#req-dest').value;
        const date = container.querySelector('#req-date').value;
        const heure = container.querySelector('#req-heure').value;
        const user = AppState.currentUser;

        if (!depart || !dest || !date || !heure || !veh) {
            toast('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        try {
            await creerDemande({
                depart,
                destination: dest,
                date,
                heure,
                type_vehicule: veh,
                patientId: user.profilId || user.id,
            });
            toast('Demande envoyée !', 'success');
            navigate('/dashboard');
        } catch (error) {
            // toast already handled in creerDemande
        }
    });
}


// ————————————————————————————————————————————
//  13. ADMIN API HELPERS
// ————————————————————————————————————————————

async function chargerChauffeursEnAttente() {
    try {
        const url = `${API_URL}/admin/chauffeurs/en-attente`;
        console.log('[API] GET', url);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Impossible de charger les chauffeurs en attente.');
        return await response.json();
    } catch (error) {
        console.error('[API] ERROR', error);
        toast(error.message || 'Erreur serveur.', 'error');
        return [];
    }
}

async function chargerTousTrajetsAdmin() {
    try {
        const url = `${API_URL}/admin/trajets/tous`;
        console.log('[API] GET', url);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Impossible de charger les trajets.');
        const data = await response.json();
        return Array.isArray(data) ? data.map(mapTrajetFromApi) : [];
    } catch (error) {
        console.error('[API] ERROR', error);
        toast(error.message || 'Erreur serveur.', 'error');
        return [];
    }
}

async function validerCompteChauffeur(userId) {
    try {
        const url = `${API_URL}/admin/chauffeurs/${userId}/valider`;
        console.log('[API] PUT', url);
        const response = await fetch(url, { method: 'PUT' });
        if (!response.ok) throw new Error('Impossible de valider ce compte.');
        toast('Compte chauffeur validé avec succès !', 'success');
        return true;
    } catch (error) {
        toast(error.message || 'Erreur lors de la validation.', 'error');
        return false;
    }
}

async function rejeterCompteChauffeur(userId) {
    try {
        const url = `${API_URL}/admin/chauffeurs/${userId}/rejeter`;
        console.log('[API] PUT', url);
        const response = await fetch(url, { method: 'PUT' });
        if (!response.ok) throw new Error('Impossible de rejeter ce compte.');
        toast('Compte chauffeur rejeté.', 'info');
        return true;
    } catch (error) {
        toast(error.message || 'Erreur lors du rejet.', 'error');
        return false;
    }
}


// ————————————————————————————————————————————
//  14. VIEW: ADMIN DASHBOARD
// ————————————————————————————————————————————

function renderAdminDashboard(container) {
    if (!AppState.currentUser || AppState.currentUser.role !== 'ADMIN') {
        toast('Accès réservé aux administrateurs.', 'error');
        navigate('/admin-login');
        return;
    }

    container.innerHTML = `
    <div class="pt-24 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 anim-fade-up">
            <div>
                <p class="text-sm text-purple-600 font-semibold tracking-wide uppercase mb-1">Administration</p>
                <h2 class="section-title">Gestion HealDrive</h2>
                <p class="text-gray-400 text-sm mt-1">Validez les comptes chauffeurs et gérez la plateforme.</p>
            </div>
        </div>

        <!-- Navigation Admin -->
        <div class="mb-6 anim-fade-up" style="animation-delay:.1s">
            <div class="inline-flex rounded-xl border border-gray-200 bg-white p-1 gap-1">
                <button class="btn-ghost text-xs py-2 px-3 admin-tab-btn" data-admin-tab="chauffeurs">
                    <i data-lucide="user-check" class="w-3.5 h-3.5"></i> Chauffeurs à valider
                </button>
                <button class="btn-ghost text-xs py-2 px-3 admin-tab-btn" data-admin-tab="transports">
                    <i data-lucide="route" class="w-3.5 h-3.5"></i> Suivi des Transports
                </button>
            </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 anim-fade-up" style="animation-delay:.15s">
            <div class="card-flat px-5 py-4 stat-accent-sand">
                <div class="flex items-center gap-3 mb-2">
                    <i data-lucide="user-check" class="w-4 h-4 text-gray-400"></i>
                    <span class="text-xs text-gray-400 font-medium uppercase tracking-wide">En attente</span>
                </div>
                <p class="text-2xl font-bold text-gray-800" id="admin-count-pending">—</p>
            </div>
            <div class="card-flat px-5 py-4 stat-accent-mint">
                <div class="flex items-center gap-3 mb-2">
                    <i data-lucide="check-circle-2" class="w-4 h-4 text-gray-400"></i>
                    <span class="text-xs text-gray-400 font-medium uppercase tracking-wide">Validés</span>
                </div>
                <p class="text-2xl font-bold text-gray-800" id="admin-count-valid">—</p>
            </div>
            <div class="card-flat px-5 py-4 stat-accent-blue">
                <div class="flex items-center gap-3 mb-2">
                    <i data-lucide="users" class="w-4 h-4 text-gray-400"></i>
                    <span class="text-xs text-gray-400 font-medium uppercase tracking-wide">Patients</span>
                </div>
                <p class="text-2xl font-bold text-gray-800" id="admin-count-patients">—</p>
            </div>
            <div class="card-flat px-5 py-4 stat-accent-coral">
                <div class="flex items-center gap-3 mb-2">
                    <i data-lucide="route" class="w-4 h-4 text-gray-400"></i>
                    <span class="text-xs text-gray-400 font-medium uppercase tracking-wide">Trajets total</span>
                </div>
                <p class="text-2xl font-bold text-gray-800" id="admin-count-trajets">—</p>
            </div>
        </div>

        <!-- Tab: Chauffeurs -->
        <div id="admin-tab-chauffeurs" class="anim-fade-up" style="animation-delay:.2s">
            <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-gray-800 text-[15px] flex items-center gap-2">
                    <i data-lucide="clock" class="w-4 h-4 text-amber-500"></i>
                    Chauffeurs en attente de validation
                </h3>
                <button class="btn-ghost text-xs" onclick="loadAdminData()">
                    <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Actualiser
                </button>
            </div>
            <div id="admin-pending-list">
                <div class="card-flat p-8 text-center text-gray-400 text-sm">
                    <i data-lucide="loader" class="w-6 h-6 mx-auto mb-2 animate-spin opacity-40"></i>
                    Chargement...
                </div>
            </div>
        </div>

        <!-- Tab: Transports -->
        <div id="admin-tab-transports" class="hidden anim-fade-up" style="animation-delay:.2s">
            <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-gray-800 text-[15px] flex items-center gap-2">
                    <i data-lucide="route" class="w-4 h-4 text-brand-500"></i>
                    Suivi des transports
                </h3>
                <button class="btn-ghost text-xs" onclick="loadAdminTransportData()">
                    <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i> Actualiser
                </button>
            </div>
            <div id="admin-transport-list">
                <div class="card-flat p-8 text-center text-gray-400 text-sm">
                    <i data-lucide="loader" class="w-6 h-6 mx-auto mb-2 animate-spin opacity-40"></i>
                    Chargement...
                </div>
            </div>
        </div>
    </div>`;

    const tabButtons = container.querySelectorAll('.admin-tab-btn');
    const chauffeursTab = container.querySelector('#admin-tab-chauffeurs');
    const transportsTab = container.querySelector('#admin-tab-transports');

    function setAdminTab(tabName) {
        tabButtons.forEach(btn => {
            const isActive = btn.dataset.adminTab === tabName;
            btn.classList.toggle('bg-brand-600', isActive);
            btn.classList.toggle('text-white', isActive);
            btn.classList.toggle('border-brand-600', isActive);
        });
        chauffeursTab.classList.toggle('hidden', tabName !== 'chauffeurs');
        transportsTab.classList.toggle('hidden', tabName !== 'transports');

        if (tabName === 'chauffeurs') {
            loadAdminData();
        } else {
            loadAdminTransportData();
        }
    }

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => setAdminTab(btn.dataset.adminTab));
    });

    setAdminTab('chauffeurs');
}

async function loadAdminData() {
    const listEl = document.getElementById('admin-pending-list');
    if (!listEl) return;

    try {
        const chauffeurs = await chargerChauffeursEnAttente();

        const pendingCount = document.getElementById('admin-count-pending');
        if (pendingCount) pendingCount.textContent = String(chauffeurs.length);

        if (chauffeurs.length === 0) {
            listEl.innerHTML = `
                <div class="card-flat">
                    <div class="empty-state">
                        <div class="empty-state-icon"><i data-lucide="check-circle-2" class="w-7 h-7 text-mint-500"></i></div>
                        <p class="text-gray-400 text-sm">Aucun chauffeur en attente de validation.</p>
                    </div>
                </div>`;
        } else {
            listEl.innerHTML = `<div class="grid gap-4">${chauffeurs.map(c => adminChauffeurCard(c)).join('')}</div>`;
        }
        refreshIcons();
    } catch (error) {
        listEl.innerHTML = `<div class="card-flat p-6 text-coral-500 text-sm text-center">Erreur de chargement.</div>`;
    }
}

async function loadAdminTransportData() {
    const listEl = document.getElementById('admin-transport-list');
    if (!listEl) return;

    try {
        const trajets = await chargerTousTrajetsAdmin();
        const trajetsCount = document.getElementById('admin-count-trajets');
        if (trajetsCount) trajetsCount.textContent = String(trajets.length);

        if (trajets.length === 0) {
            listEl.innerHTML = `
                <div class="card-flat">
                    <div class="empty-state">
                        <div class="empty-state-icon"><i data-lucide="route-off" class="w-7 h-7 text-brand-300"></i></div>
                        <p class="text-gray-400 text-sm">Aucun transport trouvé.</p>
                    </div>
                </div>`;
        } else {
            listEl.innerHTML = `<div class="grid gap-3">${trajets.map(t => adminTrajetRow(t)).join('')}</div>`;
        }
        refreshIcons();
    } catch (error) {
        listEl.innerHTML = `<div class="card-flat p-6 text-coral-500 text-sm text-center">Erreur de chargement des trajets.</div>`;
    }
}

function adminTrajetRow(t) {
    const stat = STATUT_LABELS[t.statut] || { label: t.statut || 'Inconnu', badge: 'badge-waiting' };
    const patientNom = t.patient_nom || 'Patient inconnu';
    const chauffeurNom = t.chauffeur_nom || 'Non assigné';

    return `
    <div class="card-flat p-4">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div class="min-w-0">
                <div class="flex items-center gap-2 mb-2 flex-wrap">
                    <span class="badge ${stat.badge}">${stat.label}</span>
                    <span class="text-xs text-gray-400">${t.date ? formatDate(t.date) : 'Date N/A'} ${t.heure ? '· ' + t.heure : ''}</span>
                </div>
                <p class="text-sm text-gray-800 font-semibold truncate">${t.depart} → ${t.destination}</p>
                <p class="text-xs text-gray-500 mt-1">
                    Patient: <span class="font-medium text-gray-700">${patientNom}</span>
                    · Chauffeur: <span class="font-medium text-gray-700">${chauffeurNom}</span>
                </p>
            </div>
        </div>
    </div>`;
}

function adminChauffeurCard(c) {
    const nom = [c.prenom, c.nom].filter(Boolean).join(' ') || c.email;
    const docs = [
        { label: 'Permis', key: 'fichierPermis', icon: 'id-card', docType: 'permis' },
        { label: 'Carte ID', key: 'fichierIdentite', icon: 'credit-card', docType: 'identite' },
        { label: 'Assurance', key: 'fichierAssurance', icon: 'file-shield', docType: 'assurance' },
        { label: 'Carte grise', key: 'fichierCarteGrise', icon: 'car', docType: 'carte-grise' },
    ];

    return `
    <div class="card-flat p-5 anim-fade-up">
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 mb-3">
                    <div class="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                        <i data-lucide="user-round" class="w-5 h-5 text-amber-600"></i>
                    </div>
                    <div>
                        <p class="text-sm font-bold text-gray-800">${nom}</p>
                        <p class="text-xs text-gray-400">${c.email} · ${c.telephone || 'N/A'}</p>
                    </div>
                    <span class="badge badge-waiting ml-auto sm:ml-2">En attente</span>
                </div>

                <div class="grid grid-cols-2 gap-2 mt-3">
                    ${docs.map(d => `
                    <a
                        href="${API_URL}/admin/documents/${c.id}/${d.docType}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="flex items-center gap-2 p-2 rounded-lg bg-gray-50 text-xs ${c[d.key] ? 'hover:bg-brand-50 transition-colors' : 'opacity-60 pointer-events-none'}"
                    >
                        <i data-lucide="${d.icon}" class="w-3.5 h-3.5 ${c[d.key] ? 'text-mint-500' : 'text-gray-300'}"></i>
                        <span class="${c[d.key] ? 'text-gray-700 font-medium' : 'text-gray-400'}">${d.label}</span>
                        <i data-lucide="${c[d.key] ? 'eye' : 'external-link'}" class="w-3 h-3 ${c[d.key] ? 'text-brand-600' : 'text-gray-300'} ml-auto"></i>
                    </a>`).join('')}
                </div>

                ${c.anneesExperience ? `
                <div class="flex items-center gap-2 mt-3 text-xs text-gray-500">
                    <i data-lucide="award" class="w-3.5 h-3.5 text-brand-500"></i>
                    <span>${c.anneesExperience} ans d'expérience</span>
                    ${c.trousseSecours ? '<span class="ml-3 text-mint-500 font-medium">✓ Trousse de secours</span>' : ''}
                </div>` : ''}

                <p class="text-[11px] text-gray-400 mt-2">Inscrit le ${c.dateCreation ? formatDate(c.dateCreation) : 'N/A'}</p>
            </div>

            <div class="flex flex-row sm:flex-col gap-2 shrink-0">
                <button class="btn-primary text-xs flex-1 sm:flex-none justify-center" onclick="handleValider('${c.id}')">
                    <i data-lucide="check-circle-2" class="w-4 h-4"></i> Valider
                </button>
                <button class="btn-ghost text-xs flex-1 sm:flex-none justify-center text-coral-500 border-coral-400/20 hover:bg-red-50" onclick="handleRejeter('${c.id}')">
                    <i data-lucide="x-circle" class="w-4 h-4"></i> Rejeter
                </button>
            </div>
        </div>
    </div>`;
}

async function handleValider(userId) {
    const ok = await validerCompteChauffeur(userId);
    if (ok) loadAdminData();
}

async function handleRejeter(userId) {
    const ok = await rejeterCompteChauffeur(userId);
    if (ok) loadAdminData();
}

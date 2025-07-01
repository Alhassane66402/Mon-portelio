// Fonction pour mettre à jour le lien actif en fonction de la section visible
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section, div[id]');
    const navLinks = document.querySelectorAll('.nav a');
    
    let currentSection = '';
    
    // Détecter quelle section est actuellement visible
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const scrollPosition = window.pageYOffset + 100; // Offset pour une meilleure détection
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    // Supprimer la classe active de tous les liens
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Ajouter la classe active au lien correspondant à la section courante
    if (currentSection) {
        const activeLink = document.querySelector(`.nav a[href="#${currentSection}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Mettre à jour l'URL sans recharger la page
        if (window.location.hash !== `#${currentSection}`) {
            history.replaceState(null, null, `#${currentSection}`);
        }
    }
}

// Fonction pour la navigation smooth scroll avec mise à jour de l'URL
function initSmoothNavigation() {
    const navLinks = document.querySelectorAll('.nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Supprimer active de tous les liens
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Ajouter active au lien cliqué
            this.classList.add('active');
            
            // Obtenir la section cible
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Mettre à jour l'URL AVANT le scroll
                history.pushState(null, null, `#${targetId}`);
                
                // Scroll smooth vers la section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Fonction pour gérer le bouton précédent/suivant du navigateur
function handleBrowserNavigation() {
    window.addEventListener('popstate', function(e) {
        const hash = window.location.hash;
        if (hash) {
            const targetSection = document.querySelector(hash);
            if (targetSection) {
                // Supprimer active de tous les liens
                document.querySelectorAll('.nav a').forEach(link => {
                    link.classList.remove('active');
                });
                
                // Activer le bon lien
                const activeLink = document.querySelector(`.nav a[href="${hash}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
                
                // Scroll vers la section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
}

// Fonction pour initialiser l'état correct au chargement de la page
function initializePageState() {
    const hash = window.location.hash;
    
    if (hash) {
        // Il y a un hash dans l'URL
        const targetSection = document.querySelector(hash);
        const targetLink = document.querySelector(`.nav a[href="${hash}"]`);
        
        if (targetSection && targetLink) {
            // Supprimer active de tous les liens
            document.querySelectorAll('.nav a').forEach(link => {
                link.classList.remove('active');
            });
            
            // Activer le bon lien
            targetLink.classList.add('active');
            
            // Scroll vers la section après un petit délai
            setTimeout(() => {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    } else {
        // Aucun hash, activer home par défaut
        const homeLink = document.querySelector('.nav a[href="#home"]');
        if (homeLink) {
            homeLink.classList.add('active');
        }
        // Optionnel: ajouter #home à l'URL
        history.replaceState(null, null, '#home');
    }
}

// Variable pour éviter les conflits entre scroll automatique et manuel
let isScrolling = false;

// Version modifiée de updateActiveNavLink pour éviter les conflits
function updateActiveNavLinkImproved() {
    if (isScrolling) return; // Ne pas mettre à jour pendant un scroll programmé
    
    const sections = document.querySelectorAll('section, div[id]');
    const navLinks = document.querySelectorAll('.nav a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const scrollPosition = window.pageYOffset + 150;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    if (currentSection) {
        // Supprimer la classe active de tous les liens
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Ajouter la classe active au lien correspondant
        const activeLink = document.querySelector(`.nav a[href="#${currentSection}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Mettre à jour l'URL si elle est différente
        if (window.location.hash !== `#${currentSection}`) {
            history.replaceState(null, null, `#${currentSection}`);
        }
    }
}

// Initialiser quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser l'état de la page
    initializePageState();
    
    // Initialiser la navigation
    initSmoothNavigation();
    
    // Gérer la navigation du navigateur
    handleBrowserNavigation();
    
    // Écouter le scroll pour mettre à jour le lien actif
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        // Debounce pour éviter trop d'appels
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            updateActiveNavLinkImproved();
        }, 50);
    });
});

// Alternative simple si vous voulez juste maintenir l'URL
function simpleSmoothNavigation() {
    const navLinks = document.querySelectorAll('.nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Ne pas empêcher le comportement par défaut
            // L'URL sera mise à jour automatiquement
            
            // Supprimer active de tous les liens
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Ajouter active au lien cliqué
            this.classList.add('active');
            
            // Obtenir la section cible
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Empêcher le saut brusque
                e.preventDefault();
                
                // Scroll smooth vers la section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Mettre à jour l'URL après le scroll
                setTimeout(() => {
                    window.location.hash = targetId;
                }, 100);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const navToggler = document.querySelector('.nav-toggler');
    const aside = document.querySelector('.aside');
    
    navToggler.addEventListener('click', function() {
        aside.classList.toggle('open');
        navToggler.classList.toggle('open');
    });
    
    // Fermer le aside quand on clique à l'extérieur
    document.addEventListener('click', function(e) {
        if (!aside.contains(e.target) && !navToggler.contains(e.target)) {
            aside.classList.remove('open');
            navToggler.classList.remove('open');
        }
    });
});
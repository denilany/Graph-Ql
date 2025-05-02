import { LoginUI } from "./pages/login.js";
import { Auth } from "./auth.js";
import { gsap } from 'gsap';

document.addEventListener('DOMContentLoaded', () => {
    const auth = new Auth();

    if (!auth.checkAuth()) {
        renderLoginPage();
        animateLoginElements();
        setupTogglePassword();
    }
});

function renderLoginPage() {
    document.body.innerHTML = LoginUI.getTemplate();
}

function animateLoginElements() {
    gsap.from('.login-card', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.from('.login-header, .input-group, .remember-forgot, .login-btn, .login-footer', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.5,
        ease: 'power2.out'
    });
}

function setupTogglePassword() {
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    if (!togglePassword || !passwordInput) return;

    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        const icon = togglePassword.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
}

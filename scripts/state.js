import { Dashboard } from "./pages/dashboard.js"
import { gsap } from 'gsap';

export function switchToDashboard() {
    document.body.innerHTML = "";
    document.body.innerHTML = Dashboard.getTemplate();

    gsap.from('#dashboard-container', {
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    gsap.from('.sidebar, .main-content', {
        x: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out'
    });
}
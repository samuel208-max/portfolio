// ── CURSOR ──
const cur = document.getElementById('cur'), ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function a() { rx += (mx - rx) * .14; ry += (my - ry) * .14; cur.style.left = mx + 'px'; cur.style.top = my + 'px'; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(a); })();
document.querySelectorAll('a,button,.sk,.proj-card,.edu-card,.focus-card,.c-link,.tf').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hov'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hov'));
});

// ── THREE.JS — PARTICLE FIELD ──
(function () {
    const canvas = document.getElementById('three-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const W = () => document.getElementById('hero').offsetWidth;
    const H = () => document.getElementById('hero').offsetHeight;
    const camera = new THREE.PerspectiveCamera(55, W() / H(), .1, 100);
    camera.position.z = 4;

    // Particles
    const N = 3500;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const c1 = new THREE.Color(0x00ff87), c2 = new THREE.Color(0x38bdf8), c3 = new THREE.Color(0xa78bfa), c4 = new THREE.Color(0x00994f);
    for (let i = 0; i < N; i++) {
        // mix of helix + scattered
        const t = (i / N) * Math.PI * 24;
        const r = 1.4 + (Math.random() - .5) * .8;
        const type = i % 4;
        if (type === 0) { pos[i * 3] = Math.cos(t) * r; pos[i * 3 + 1] = (i / N) * 7 - 3.5; pos[i * 3 + 2] = Math.sin(t) * r; }
        else if (type === 1) { pos[i * 3] = Math.cos(t + Math.PI * .7) * r; pos[i * 3 + 1] = (i / N) * 7 - 3.5; pos[i * 3 + 2] = Math.sin(t + Math.PI * .7) * r; }
        else { pos[i * 3] = (Math.random() - .5) * 6; pos[i * 3 + 1] = (Math.random() - .5) * 6; pos[i * 3 + 2] = (Math.random() - .5) * 4; }
        const m = Math.random();
        const c = m < .4 ? c1 : m < .65 ? c2 : m < .85 ? c3 : c4;
        col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({ size: .016, vertexColors: true, transparent: true, opacity: .8, sizeAttenuation: true });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    // Wireframe sphere
    const sg = new THREE.SphereGeometry(1.5, 12, 8);
    const sm = new THREE.MeshBasicMaterial({ color: 0x00ff87, wireframe: true, transparent: true, opacity: .03 });
    const sp = new THREE.Mesh(sg, sm);
    scene.add(sp);

    // Rotating ring
    const rg = new THREE.TorusGeometry(1.8, .004, 4, 80);
    const rm = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: .08 });
    const tor = new THREE.Mesh(rg, rm);
    tor.rotation.x = Math.PI * .4;
    scene.add(tor);

    let mox = 0, moy = 0;
    document.addEventListener('mousemove', e => { mox = (e.clientX / window.innerWidth - .5) * 2; moy = (e.clientY / window.innerHeight - .5) * 2; });

    function resize() { renderer.setSize(W(), H()); camera.aspect = W() / H(); camera.updateProjectionMatrix(); }
    resize(); window.addEventListener('resize', resize);

    let tick = 0;
    (function render() {
        requestAnimationFrame(render); tick += .005;
        pts.rotation.y = tick + mox * .2; pts.rotation.x = moy * .1;
        sp.rotation.y = -tick * .3; sp.rotation.x = tick * .1;
        tor.rotation.z = tick * .4;
        renderer.render(scene, camera);
    })();
})();

// ── HERO ENTRANCE ──
addEventListener('DOMContentLoaded', () => {
    setTimeout(() => { const l = document.getElementById('heroL'); l.style.transition = 'all .9s cubic-bezier(.4,0,.2,1)'; l.style.opacity = '1'; l.style.transform = 'none'; }, 150);
    setTimeout(() => { const r = document.getElementById('heroR'); r.style.transition = 'all .9s cubic-bezier(.4,0,.2,1)'; r.style.opacity = '1'; r.style.transform = 'none'; }, 350);
});

// ── TYPEWRITER ──
const roles = ['Estagiário Dev · Node + React', 'Front-end Developer', 'PHP + MySQL Dev', 'Flutter (aprendendo)', 'Unity / C# Dev'];
let ri = 0, ci = 0, del = false;
const tel = document.getElementById('typed');
function type() { const c = roles[ri]; if (!del) { tel.textContent = c.slice(0, ++ci); if (ci === c.length) { del = true; setTimeout(type, 1600); return; } } else { tel.textContent = c.slice(0, --ci); if (ci === 0) { del = false; ri = (ri + 1) % roles.length; } } setTimeout(type, del ? 45 : 80); }
setTimeout(type, 1400);

// ── STATS ──
function countUp(el, target, delay) { setTimeout(() => { let c = 0; const s = () => { el.textContent = ++c; if (c < target) setTimeout(s, 40); }; s(); }, delay); }
new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
        document.querySelectorAll('.stat-box').forEach((b, i) => {
            b.style.transition = `all .5s cubic-bezier(.4,0,.2,1) ${i * 100}ms`;
            b.style.opacity = '1'; b.style.transform = 'none';
            countUp(b.querySelector('.stat-num'), +b.querySelector('.stat-num').dataset.target, i * 100);
        });
    }
}, { threshold: .3 }).observe(document.querySelector('.stats-row'));

// ── GENERIC OBSERVER FACTORY ──
function obs(selector, parent, xFrom, delay) {
    if (!document.querySelector(parent || selector)) return;
    new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            document.querySelectorAll(selector).forEach((el, i) => {
                setTimeout(() => {
                    el.style.transition = 'all .55s cubic-bezier(.4,0,.2,1)';
                    el.style.opacity = '1'; el.style.transform = 'none';
                    const f = el.querySelector('.sk-fill'); if (f) f.style.width = f.dataset.width + '%';
                }, i * (delay || 80));
            });
        }
    }, { threshold: .1 }).observe(document.querySelector(parent || selector));
}
obs('.sk', '#skillsGrid', 0, 65);
obs('.focus-card', '.focus-grid', 0, 110);
obs('.exp-item', '.exp-list', 0, 140);
obs('.edu-card', '.edu-grid', 0, 75);
obs('.proj-card', '.proj-grid', 0, 90);

// ── REVEAL ──
document.querySelectorAll('.rev').forEach(el => {
    new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); }); }, { threshold: .1 }).observe(el);
});
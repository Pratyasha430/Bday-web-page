/* ==========================================================================
   BOYFRIEND BIRTHDAY WEB EXPERIENCE: 100% SEQUENCE REPLICA
   1. "I have made something for you" -> Dancing Shinchan -> YES / NO
   2. "HOW DARE YOU" -> Crying Shinchan -> TRY AGAIN (if NO)
   3. "Are you really excited?" -> Laughing Shinchan -> YES / YES (if YES)
   4. "Each gift has something for you.." -> 3 Flying Pink Gifts & Reveals
   ========================================================================== */

// --- STATE ---
const state = {
    soundEnabled: true
};

// --- WEB AUDIO API SOUND GENERATOR ---
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            audioCtx = new AudioContext();
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playSound(type) {
    if (!state.soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;

    if (type === 'click') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
    } else if (type === 'pop') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.exponentialRampToValueAtTime(1300, now + 0.08);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
    } else if (type === 'unlock') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.1);
            gain.gain.setValueAtTime(0.15, now + idx * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now + idx * 0.1);
            osc.stop(now + idx * 0.1 + 0.45);
        });
    } else if (type === 'firecracker' || type === 'popper') {
        const bufferSize = Math.floor(audioCtx.sampleRate * 0.18);
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.035));
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, now);
        filter.Q.setValueAtTime(1.8, now);
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        noise.start(now);

        [0.03, 0.07, 0.12, 0.18, 0.24].forEach((delay) => {
            const osc = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(700 + Math.random() * 800, now + delay);
            g.gain.setValueAtTime(0.14, now + delay);
            g.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.04);
            osc.connect(g);
            g.connect(audioCtx.destination);
            osc.start(now + delay);
            osc.stop(now + delay + 0.05);
        });
    } else if (type === 'fanfare') {
        [392.00, 523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            gain.gain.setValueAtTime(0.2, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.65);
        });
    }
}

// Spawn floating cute star & love particle
function spawnHeartAt(x, y) {
    const heart = document.createElement('div');
    heart.textContent = ['💕', '💖', '⭐', '🌟', '✨', '💙', '💗', '💫', '💓'][Math.floor(Math.random() * 9)];
    heart.style.position = 'fixed';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.fontSize = '2rem';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '9999';
    heart.style.transition = 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
    heart.style.transform = 'translate(-50%, -50%) scale(0.6)';
    document.body.appendChild(heart);

    requestAnimationFrame(() => {
        heart.style.transform = `translate(-50%, -100px) scale(1.35) rotate(${(Math.random() - 0.5) * 40}deg)`;
        heart.style.opacity = '0';
    });

    setTimeout(() => heart.remove(), 900);
}



// --- MAGICAL CELEBRATION STARDUST & FIREWORKS ENGINE ---
let celebrationAnimId = null;
let celebrationParticles = [];

function triggerCelebration() {
    playSound('firecracker');
    setTimeout(() => playSound('fanfare'), 220);

    const canvas = document.getElementById('celebrationCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (celebrationAnimId) {
        cancelAnimationFrame(celebrationAnimId);
        celebrationAnimId = null;
    }
    celebrationParticles = [];

    const celestialColors = [
        '#ffd700', '#fde047', '#fff3b0', '#f472b6', '#fb7185',
        '#38bdf8', '#7dd3fc', '#c084fc', '#e879f9', '#ffffff'
    ];

    function drawStar(c, x, y, spikes, outerR, innerR, color, alpha, rot) {
        c.save();
        c.translate(x, y);
        c.rotate(rot);
        c.globalAlpha = Math.max(0, Math.min(1, alpha));
        c.fillStyle = color;
        c.shadowColor = color;
        c.shadowBlur = 10;
        const step = Math.PI / spikes;
        c.beginPath();
        for (let i = 0; i < 2 * spikes; i++) {
            const r = (i % 2 === 0) ? outerR : innerR;
            const a = i * step - Math.PI / 2;
            const px = Math.cos(a) * r;
            const py = Math.sin(a) * r;
            if (i === 0) c.moveTo(px, py);
            else c.lineTo(px, py);
        }
        c.closePath();
        c.fill();
        c.restore();
    }

    function drawHeart(c, x, y, size, color, alpha, rot) {
        c.save();
        c.translate(x, y);
        c.rotate(rot);
        c.globalAlpha = Math.max(0, Math.min(1, alpha));
        c.fillStyle = color;
        c.shadowColor = color;
        c.shadowBlur = 8;
        c.beginPath();
        const topH = size * 0.3;
        c.moveTo(0, topH);
        c.bezierCurveTo(-size / 2, -topH, -size, topH / 3, 0, size);
        c.bezierCurveTo(size, topH / 3, size / 2, -topH, 0, topH);
        c.closePath();
        c.fill();
        c.restore();
    }

    function drawGlowOrb(c, x, y, radius, color, alpha) {
        c.save();
        c.globalAlpha = Math.max(0, Math.min(1, alpha));
        c.shadowColor = color;
        c.shadowBlur = radius * 2;
        const grad = c.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.4, color);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        c.fillStyle = grad;
        c.beginPath();
        c.arc(x, y, radius, 0, Math.PI * 2);
        c.fill();
        c.restore();
    }

    function drawDiamond(c, x, y, w, h, color, alpha, rot) {
        c.save();
        c.translate(x, y);
        c.rotate(rot);
        c.globalAlpha = Math.max(0, Math.min(1, alpha));
        c.fillStyle = color;
        c.shadowColor = color;
        c.shadowBlur = 8;
        c.beginPath();
        c.moveTo(0, -h);
        c.lineTo(w, 0);
        c.lineTo(0, h);
        c.lineTo(-w, 0);
        c.closePath();
        c.fill();
        c.restore();
    }

    const giftStageElem = document.getElementById('flyingGiftsStage');
    const stageRect = giftStageElem ? giftStageElem.getBoundingClientRect() : { left: width * 0.5, top: height * 0.45, width: 300 };
    const centerX = stageRect.left + stageRect.width / 2;
    const centerY = Math.max(80, stageRect.top + 60);

    const bloomCount = 110;
    for (let i = 0; i < bloomCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3.2 + Math.random() * 8.5;
        const roll = Math.random();
        let type = 'star';
        if (roll < 0.45) type = 'star';
        else if (roll < 0.70) type = 'glowOrb';
        else if (roll < 0.88) type = 'diamond';
        else type = 'heart';

        celebrationParticles.push({
            x: centerX + (Math.random() - 0.5) * 80,
            y: centerY + (Math.random() - 0.5) * 40,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2.2,
            drag: 0.965,
            gravity: 0.05,
            buoyancy: type === 'heart' ? -0.06 : 0,
            swayFreq: 0.03 + Math.random() * 0.04,
            swayAmp: 0.8 + Math.random() * 1.3,
            swayPhase: Math.random() * Math.PI * 2,
            size: type === 'heart' ? 11 + Math.random() * 9 : 7 + Math.random() * 9,
            color: celestialColors[Math.floor(Math.random() * celestialColors.length)],
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.1,
            twinkleFreq: 0.08 + Math.random() * 0.12,
            twinklePhase: Math.random() * Math.PI * 2,
            alpha: 1,
            decay: 0.005 + Math.random() * 0.004,
            type: type
        });
    }

    const leftX = width * 0.06;
    const leftY = height * 0.82;
    const rightX = width * 0.94;
    const rightY = height * 0.82;

    const fountainCount = 60;
    for (let i = 0; i < fountainCount; i++) {
        const leftAngle = -Math.PI * 0.28 + (Math.random() - 0.5) * 0.42;
        const leftSpeed = 11 + Math.random() * 8;
        celebrationParticles.push({
            x: leftX,
            y: leftY,
            vx: Math.cos(leftAngle) * leftSpeed,
            vy: Math.sin(leftAngle) * leftSpeed,
            drag: 0.978,
            gravity: 0.22,
            buoyancy: 0,
            swayFreq: 0.04,
            swayAmp: 1.1,
            swayPhase: Math.random() * Math.PI * 2,
            size: 6 + Math.random() * 8,
            color: celestialColors[Math.floor(Math.random() * celestialColors.length)],
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.14,
            twinkleFreq: 0.12,
            twinklePhase: Math.random() * Math.PI * 2,
            alpha: 1,
            decay: 0.005 + Math.random() * 0.005,
            type: Math.random() > 0.45 ? 'star' : 'diamond'
        });

        const rightAngle = -Math.PI * 0.72 + (Math.random() - 0.5) * 0.42;
        const rightSpeed = 11 + Math.random() * 8;
        celebrationParticles.push({
            x: rightX,
            y: rightY,
            vx: Math.cos(rightAngle) * rightSpeed,
            vy: Math.sin(rightAngle) * rightSpeed,
            drag: 0.978,
            gravity: 0.22,
            buoyancy: 0,
            swayFreq: 0.04,
            swayAmp: 1.1,
            swayPhase: Math.random() * Math.PI * 2,
            size: 6 + Math.random() * 8,
            color: celestialColors[Math.floor(Math.random() * celestialColors.length)],
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.14,
            twinkleFreq: 0.12,
            twinklePhase: Math.random() * Math.PI * 2,
            alpha: 1,
            decay: 0.005 + Math.random() * 0.005,
            type: Math.random() > 0.45 ? 'star' : 'diamond'
        });
    }

    let frame = 0;
    function renderLoop() {
        frame++;
        ctx.clearRect(0, 0, width, height);

        for (let i = celebrationParticles.length - 1; i >= 0; i--) {
            const p = celebrationParticles[i];

            p.vx *= p.drag;
            p.vy = (p.vy * p.drag) + p.gravity + p.buoyancy;
            p.x += p.vx + Math.sin(p.swayPhase + frame * p.swayFreq) * p.swayAmp;
            p.y += p.vy;

            p.rotation += p.rotSpeed;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                celebrationParticles.splice(i, 1);
                continue;
            }

            const twinkle = 0.75 + 0.25 * Math.sin(p.twinklePhase + frame * p.twinkleFreq);
            const effectiveAlpha = p.alpha * twinkle;

            if (p.type === 'star') {
                drawStar(ctx, p.x, p.y, 4, p.size, p.size * 0.36, p.color, effectiveAlpha, p.rotation);
            } else if (p.type === 'heart') {
                drawHeart(ctx, p.x, p.y, p.size, p.color, effectiveAlpha, p.rotation);
            } else if (p.type === 'glowOrb') {
                drawGlowOrb(ctx, p.x, p.y, p.size, p.color, effectiveAlpha);
            } else if (p.type === 'diamond') {
                drawDiamond(ctx, p.x, p.y, p.size * 0.55, p.size * 1.1, p.color, effectiveAlpha, p.rotation);
            }
        }

        if (celebrationParticles.length > 0) {
            celebrationAnimId = requestAnimationFrame(renderLoop);
        } else {
            ctx.clearRect(0, 0, width, height);
            celebrationAnimId = null;
        }
    }

    celebrationAnimId = requestAnimationFrame(renderLoop);
}

// --- SPECIAL CAKE BLOW CELEBRATION (PARTY POPPERS + TOP-TO-BOTTOM FIREWORKS CASCADE) ---
function triggerCakeBlowCelebration() {
    initAudio();
    playSound('popper');
    setTimeout(() => playSound('firecracker'), 160);
    setTimeout(() => playSound('fanfare'), 380);

    const canvas = document.getElementById('celebrationCanvas');
    if (!canvas) return;

    // Trigger visual recoil animation on bottom corner party poppers
    const leftPopper = document.getElementById('cakeCornerPopperLeft');
    const rightPopper = document.getElementById('cakeCornerPopperRight');
    if (leftPopper) {
        leftPopper.classList.remove('popping');
        void leftPopper.offsetWidth;
        leftPopper.classList.add('popping');
    }
    if (rightPopper) {
        rightPopper.classList.remove('popping');
        void rightPopper.offsetWidth;
        rightPopper.classList.add('popping');
    }

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (celebrationAnimId) {
        cancelAnimationFrame(celebrationAnimId);
        celebrationAnimId = null;
    }
    celebrationParticles = [];

    const celestialColors = [
        '#ffd700', '#fde047', '#fff3b0', '#f472b6', '#fb7185',
        '#38bdf8', '#7dd3fc', '#c084fc', '#e879f9', '#ffffff', '#ff4d6d'
    ];

    // 1. PARTY POPPERS POPPING (Bottom Left & Bottom Right Corners blasting inward & upward)
    for (let i = 0; i < 90; i++) {
        // Left Corner Popper
        const leftAngle = -Math.PI * 0.28 + (Math.random() - 0.5) * 0.45;
        const leftSpeed = 15 + Math.random() * 14;
        celebrationParticles.push({
            x: width * 0.05,
            y: height * 0.94,
            vx: Math.cos(leftAngle) * leftSpeed,
            vy: Math.sin(leftAngle) * leftSpeed,
            drag: 0.972,
            gravity: 0.24,
            buoyancy: 0,
            swayFreq: 0.06,
            swayAmp: 1.8,
            swayPhase: Math.random() * Math.PI * 2,
            size: 6 + Math.random() * 9,
            color: celestialColors[Math.floor(Math.random() * celestialColors.length)],
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.24,
            twinkleFreq: 0.12,
            twinklePhase: Math.random() * Math.PI * 2,
            alpha: 1,
            decay: 0.0035 + Math.random() * 0.0035,
            type: Math.random() > 0.45 ? 'ribbon' : (Math.random() > 0.5 ? 'star' : 'diamond')
        });

        // Right Corner Popper
        const rightAngle = -Math.PI * 0.72 + (Math.random() - 0.5) * 0.45;
        const rightSpeed = 15 + Math.random() * 14;
        celebrationParticles.push({
            x: width * 0.95,
            y: height * 0.94,
            vx: Math.cos(rightAngle) * rightSpeed,
            vy: Math.sin(rightAngle) * rightSpeed,
            drag: 0.972,
            gravity: 0.24,
            buoyancy: 0,
            swayFreq: 0.06,
            swayAmp: 1.8,
            swayPhase: Math.random() * Math.PI * 2,
            size: 6 + Math.random() * 9,
            color: celestialColors[Math.floor(Math.random() * celestialColors.length)],
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.24,
            twinkleFreq: 0.12,
            twinklePhase: Math.random() * Math.PI * 2,
            alpha: 1,
            decay: 0.0035 + Math.random() * 0.0035,
            type: Math.random() > 0.45 ? 'ribbon' : (Math.random() > 0.5 ? 'star' : 'heart')
        });
    }

    // 2. FIRECRACKERS SHOOTING FROM BOTTOM TO TOP (Fountain Barrage of 180 Sparks Soaring Upwards)
    for (let i = 0; i < 180; i++) {
        const startX = width * (0.05 + Math.random() * 0.9);
        const startY = height + 10 + Math.random() * 40; // Starts below bottom edge
        const speedY = -17 - Math.random() * 10;          // Blasts STRAIGHT UP from bottom to top!
        const speedX = (Math.random() - 0.5) * 6;

        const roll = Math.random();
        let pType = 'star';
        if (roll < 0.4) pType = 'star';
        else if (roll < 0.65) pType = 'glowOrb';
        else if (roll < 0.85) pType = 'diamond';
        else pType = 'heart';

        celebrationParticles.push({
            x: startX,
            y: startY,
            vx: speedX,
            vy: speedY,
            drag: 0.982,
            gravity: 0.19,
            buoyancy: 0,
            swayFreq: 0.04,
            swayAmp: 1.2,
            swayPhase: Math.random() * Math.PI * 2,
            size: pType === 'heart' ? 12 + Math.random() * 9 : 7 + Math.random() * 9,
            color: celestialColors[Math.floor(Math.random() * celestialColors.length)],
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.18,
            twinkleFreq: 0.18,
            twinklePhase: Math.random() * Math.PI * 2,
            alpha: 1,
            decay: 0.003 + Math.random() * 0.003,
            type: pType
        });
    }

    // 3. FIRECRACKER ROCKETS (Soaring from Bottom to Top and Exploding Mid-Air!)
    const rocketSlots = [0.18, 0.32, 0.48, 0.64, 0.82];
    rocketSlots.forEach((slotRatio, idx) => {
        setTimeout(() => {
            const rX = width * slotRatio + (Math.random() - 0.5) * 40;
            const rY = height + 15;
            celebrationParticles.push({
                isRocket: true,
                x: rX,
                y: rY,
                vx: (Math.random() - 0.5) * 2.5,
                vy: -21 - Math.random() * 6, // Fast bottom-to-top ascent
                targetY: height * (0.14 + Math.random() * 0.24), // Detonates near top
                drag: 0.992,
                gravity: 0.12,
                buoyancy: 0,
                swayFreq: 0.03,
                swayAmp: 0.6,
                swayPhase: 0,
                size: 5,
                color: celestialColors[Math.floor(Math.random() * celestialColors.length)],
                rotation: 0,
                rotSpeed: 0,
                twinkleFreq: 0.2,
                twinklePhase: 0,
                alpha: 1,
                decay: 0.0005,
                type: 'rocket'
            });
        }, idx * 110);
    });

    let frame = 0;
    function renderCakeLoop() {
        frame++;
        ctx.clearRect(0, 0, width, height);

        for (let i = celebrationParticles.length - 1; i >= 0; i--) {
            const p = celebrationParticles[i];

            // If rocket is traveling from bottom to top
            if (p.isRocket) {
                // Drop glittering sparks trail behind rocket
                if (frame % 2 === 0) {
                    celebrationParticles.push({
                        x: p.x + (Math.random() - 0.5) * 4,
                        y: p.y + 6,
                        vx: (Math.random() - 0.5) * 2,
                        vy: 2 + Math.random() * 3,
                        drag: 0.94,
                        gravity: 0.08,
                        buoyancy: 0,
                        swayFreq: 0.05,
                        swayAmp: 0.5,
                        swayPhase: 0,
                        size: 3 + Math.random() * 3,
                        color: '#ffd700',
                        rotation: 0,
                        rotSpeed: 0,
                        twinkleFreq: 0.2,
                        twinklePhase: Math.random() * Math.PI,
                        alpha: 0.95,
                        decay: 0.035,
                        type: 'glowOrb'
                    });
                }

                // When rocket reaches target height near top, EXPLODE into firecracker bloom!
                if (p.y <= p.targetY || p.vy >= -3) {
                    p.alpha = 0; // consumed
                    playSound('firecracker');
                    // Radial burst of stars & sparks
                    for (let b = 0; b < 60; b++) {
                        const angle = Math.random() * Math.PI * 2;
                        const spd = 3.5 + Math.random() * 9.5;
                        celebrationParticles.push({
                            x: p.x,
                            y: p.y,
                            vx: Math.cos(angle) * spd,
                            vy: Math.sin(angle) * spd,
                            drag: 0.958,
                            gravity: 0.1,
                            buoyancy: 0,
                            swayFreq: 0.04,
                            swayAmp: 0.9,
                            swayPhase: Math.random() * Math.PI * 2,
                            size: 7 + Math.random() * 9,
                            color: celestialColors[Math.floor(Math.random() * celestialColors.length)],
                            rotation: Math.random() * Math.PI * 2,
                            rotSpeed: (Math.random() - 0.5) * 0.16,
                            twinkleFreq: 0.15,
                            twinklePhase: Math.random() * Math.PI * 2,
                            alpha: 1,
                            decay: 0.0055 + Math.random() * 0.005,
                            type: Math.random() > 0.4 ? 'star' : (Math.random() > 0.5 ? 'heart' : 'diamond')
                        });
                    }
                }
            }

            p.vx *= p.drag;
            p.vy = (p.vy * p.drag) + p.gravity + p.buoyancy;
            p.x += p.vx + Math.sin(p.swayPhase + frame * p.swayFreq) * p.swayAmp;
            p.y += p.vy;

            p.rotation += p.rotSpeed;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                celebrationParticles.splice(i, 1);
                continue;
            }

            const twinkle = 0.75 + 0.25 * Math.sin(p.twinklePhase + frame * p.twinkleFreq);
            const effectiveAlpha = p.alpha * twinkle;

            if (p.type === 'star') {
                drawStar(ctx, p.x, p.y, 4, p.size, p.size * 0.36, p.color, effectiveAlpha, p.rotation);
            } else if (p.type === 'heart') {
                drawHeart(ctx, p.x, p.y, p.size, p.color, effectiveAlpha, p.rotation);
            } else if (p.type === 'glowOrb') {
                drawGlowOrb(ctx, p.x, p.y, p.size, p.color, effectiveAlpha);
            } else if (p.type === 'diamond') {
                drawDiamond(ctx, p.x, p.y, p.size * 0.55, p.size * 1.1, p.color, effectiveAlpha, p.rotation);
            } else if (p.type === 'ribbon') {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.globalAlpha = Math.max(0, Math.min(1, effectiveAlpha));
                ctx.fillStyle = p.color;
                const flip = Math.cos(frame * 0.14 + p.swayPhase);
                ctx.scale(1, flip);
                ctx.fillRect(-p.size / 2, -p.size * 1.6 / 2, p.size, p.size * 1.6);
                ctx.restore();
            } else if (p.type === 'rocket') {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = p.color || '#ffd700';
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        if (celebrationParticles.length > 0) {
            celebrationAnimId = requestAnimationFrame(renderCakeLoop);
        } else {
            ctx.clearRect(0, 0, width, height);
            celebrationAnimId = null;
        }
    }
    celebrationAnimId = requestAnimationFrame(renderCakeLoop);
}

// --- STORYLINE SEQUENCE CONTROLLER ---
function setupPostcardStoryline() {
    // Postcard Views
    const viewFront = document.getElementById('viewFrontPage');
    const viewCry = document.getElementById('viewCryPage');
    const viewExcited = document.getElementById('viewExcitedPage');
    const viewCake = document.getElementById('viewCakePage');
    const viewGifts = document.getElementById('viewGiftsPage');
    const mainPostcardCard = document.getElementById('flyingGiftsPostcard');

    const allViews = [viewFront, viewCry, viewExcited, viewCake, viewGifts];

    function triggerFlyingGiftsFlight() {
        const giftItems = document.querySelectorAll('.flying-gift-item');
        giftItems.forEach(item => {
            item.classList.remove('flying-in');
            void item.offsetWidth; // Force reflow
            item.classList.add('flying-in');
        });
    }

    function showView(targetView) {
        allViews.forEach(v => {
            if (v) {
                v.classList.remove('active');
                v.classList.add('is-hidden');
            }
        });
        if (targetView) {
            targetView.classList.remove('is-hidden');
            targetView.classList.add('active');
        }

        // Apply fullscreen / wide card styling for Cake Page as requested
        if (mainPostcardCard) {
            if (targetView === viewCake) {
                mainPostcardCard.classList.add('cake-fullscreen-mode');
            } else {
                mainPostcardCard.classList.remove('cake-fullscreen-mode');
            }
        }

        // Trigger dynamic flight entrance animation when gifts page appears
        if (targetView === viewGifts) {
            triggerFlyingGiftsFlight();
        }
    }

    // SCENE 1: FRONT PAGE (YES / NO)
    const chibiYesBtn = document.getElementById('chibiYesBtn');
    const chibiNoBtn = document.getElementById('chibiNoBtn');
    const shinchanDanceImg = document.getElementById('shinchanDanceImg');

    if (chibiYesBtn) {
        chibiYesBtn.addEventListener('click', () => {
            playSound('pop');
            if (shinchanDanceImg) {
                shinchanDanceImg.style.transform = 'scale(1.15) rotate(-3deg)';
                setTimeout(() => { shinchanDanceImg.style.transform = ''; }, 250);
            }
            // Spawn celebratory mini hearts
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    const rect = chibiYesBtn.getBoundingClientRect();
                    spawnHeartAt(rect.left + rect.width / 2 + (Math.random() - 0.5) * 90, rect.top);
                }, i * 50);
            }
            setTimeout(() => {
                showView(viewExcited);
                const smileImg = document.getElementById('shinchanSmilingImg');
                if (smileImg) {
                    smileImg.style.animation = 'none';
                    void smileImg.offsetWidth;
                    smileImg.style.animation = '';
                }
            }, 300);
        });
    }

    if (chibiNoBtn) {
        let isDodging = false;
        let dodgeCount = 0;
        const jumpSpots = [
            { x: 120, y: -40 },
            { x: -120, y: -35 },
            { x: 90, y: 35 },
            { x: -90, y: 35 }
        ];

        // Playful quick dodge on hover
        chibiNoBtn.addEventListener('mouseenter', () => {
            if (dodgeCount >= 2 || isDodging) return;
            isDodging = true;
            setTimeout(() => { isDodging = false; }, 200);
            playSound('pop');
            dodgeCount++;
            const spot = jumpSpots[Math.floor(Math.random() * jumpSpots.length)];
            chibiNoBtn.style.transform = `translate(${spot.x}px, ${spot.y}px)`;
        });

        function triggerCryTantrum() {
            dodgeCount = 0;
            chibiNoBtn.style.transform = '';
            showView(viewCry);
        }

        // Clicking or tapping NO immediately opens Crying Shinchan!
        chibiNoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            triggerCryTantrum();
        });

        chibiNoBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            triggerCryTantrum();
        });
    }

    // SCENE 2: CRYING PAGE (TRY AGAIN)
    const cryTryAgainBtn = document.getElementById('cryTryAgainBtn');
    if (cryTryAgainBtn) {
        cryTryAgainBtn.addEventListener('click', () => {
            playSound('pop');
            if (chibiNoBtn) {
                chibiNoBtn.style.transform = '';
            }
            showView(viewFront);
        });
    }

    // SCENE 3: EXCITED PAGE (YES / YES)
    const excitedYes1 = document.getElementById('excitedYesBtn1');
    const excitedYes2 = document.getElementById('excitedYesBtn2');
    const excitedActorWrap = document.querySelector('.excited-actor-wrap');

    function handleExcitedYes(btn) {
        playSound('unlock');
        if (excitedActorWrap) {
            excitedActorWrap.style.transform = 'scale(1.2) rotate(4deg)';
            setTimeout(() => { excitedActorWrap.style.transform = ''; }, 350);
        }
        for (let i = 0; i < 9; i++) {
            setTimeout(() => {
                const rect = btn.getBoundingClientRect();
                spawnHeartAt(rect.left + rect.width / 2 + (Math.random() - 0.5) * 90, rect.top);
            }, i * 60);
        }
        setTimeout(() => {
            showView(viewGifts);
        }, 350);
    }

    if (excitedYes1) {
        excitedYes1.addEventListener('click', () => handleExcitedYes(excitedYes1));
    }
    if (excitedYes2) {
        excitedYes2.addEventListener('click', () => handleExcitedYes(excitedYes2));
    }

    // SCENE 4: CAKE PAGE CONTROLS (BLOW CANDLES + CLICK ME TO OPEN GIFTS)
    const blowCandlesBtn = document.getElementById('blowCandlesBtn');
    const cakeClickMeBtn = document.getElementById('cakeClickMeBtn');
    const cakeBackBtn = document.getElementById('cakeBackBtn');
    const cakeFlamesOverlay = document.getElementById('cakeFlamesOverlay');

    if (blowCandlesBtn) {
        blowCandlesBtn.addEventListener('click', () => {
            if (cakeFlamesOverlay && !cakeFlamesOverlay.classList.contains('blown-out')) {
                // Blow out flames with smoke puffs
                cakeFlamesOverlay.classList.add('blown-out');
                blowCandlesBtn.classList.add('wish-granted');
                blowCandlesBtn.innerHTML = '<span class="comic-pill-text">✨ WISH GRANTED! ✨</span>';

                // Trigger party poppers & bottom-to-top firecrackers celebration
                triggerCakeBlowCelebration();

                // Spawn floating celebratory emojis around button and popper corners
                const rect = blowCandlesBtn.getBoundingClientRect();
                const w = window.innerWidth;
                const h = window.innerHeight;
                for (let i = 0; i < 12; i++) {
                    setTimeout(() => {
                        spawnHeartAt(rect.left + rect.width / 2 + (Math.random() - 0.5) * 140, rect.top - 15);
                        if (i % 2 === 0) {
                            spawnHeartAt(w * 0.08 + (Math.random() - 0.5) * 60, h * 0.88);
                            spawnHeartAt(w * 0.92 + (Math.random() - 0.5) * 60, h * 0.88);
                        }
                    }, i * 45);
                }

                // Highlight the side "CLICK ME" button with enthusiastic pulse
                if (cakeClickMeBtn) {
                    cakeClickMeBtn.classList.add('cake-pulse-highlight');
                }
            } else {
                // If clicked again, replay the fireworks celebration!
                triggerCakeBlowCelebration();
            }
        });
    }

    // Corner Party Poppers on Cake Page -> Click to trigger poppers & fireworks!
    const cakePopperL = document.getElementById('cakeCornerPopperLeft');
    const cakePopperR = document.getElementById('cakeCornerPopperRight');
    if (cakePopperL) {
        cakePopperL.addEventListener('click', () => {
            triggerCakeBlowCelebration();
        });
    }
    if (cakePopperR) {
        cakePopperR.addEventListener('click', () => {
            triggerCakeBlowCelebration();
        });
    }

    // Side "CLICK ME" button on cake page -> opens the Gifts Page!
    if (cakeClickMeBtn) {
        cakeClickMeBtn.addEventListener('click', () => {
            playSound('fanfare');
            triggerCelebration();
            showView(viewGifts);
        });
    }

    // Cake page top-left back button -> return to Gifts page
    if (cakeBackBtn) {
        cakeBackBtn.addEventListener('click', () => {
            playSound('pop');
            showView(viewGifts);
        });
    }

    // SCENE 4: FLYING GIFTS POSTCARD
    const giftItems = document.querySelectorAll('.flying-gift-item');
    const modal = document.getElementById('giftModal');
    const closeBtn = document.getElementById('closeModalBtn');
    const slot = document.getElementById('modalContentSlot');
    const restartBtn = document.getElementById('restartExperienceBtn');
    const backBtn = document.getElementById('flyingGiftsBackBtn');
    const nextBtn = document.getElementById('flyingGiftsNextBtn');
    const clickOneTitle = document.getElementById('clickOneTitle');
    const finalWishesCard = document.getElementById('finalWishesCard');

    let openedCount = 0;

    const giftDetails = {
        letter: `
            <div class="postcard-wrapper">
                <div class="postcard-card" id="pourutiiPostcard">
                    <!-- Red Gingham Background is styled on .postcard-wrapper -->

                    <!-- Organic Contour Shapes & Wavy Curves (Matching Screenshot) -->
                    <svg class="postcard-svg-decor" viewBox="0 0 760 440" preserveAspectRatio="none" aria-hidden="true">
                        <!-- Top-Left Burgundy Fluid Blob -->
                        <path d="M 0,0 L 220,0 Q 180,35 120,50 Q 55,70 45,150 Q 35,210 0,240 Z" fill="#86151f" />
                        <!-- Top-Left Thin Curved Contour Line -->
                        <path d="M 0,270 Q 50,230 65,150 Q 80,75 140,55 Q 185,42 245,0" fill="none" stroke="#86151f" stroke-width="2" stroke-linecap="round" />

                        <!-- Bottom-Left Decorative Star Sparkle -->
                        <path d="M 85,360 Q 95,335 105,360 Q 130,370 105,380 Q 95,405 85,380 Q 60,370 85,360 Z" fill="#86151f" opacity="0.85" />

                        <!-- Right Edge Burgundy Fluid Wave -->
                        <path d="M 760,140 Q 690,200 695,290 Q 700,360 760,400 Z" fill="#86151f" />
                        <!-- Right Edge Thin Curved Contour Line -->
                        <path d="M 760,110 Q 665,185 670,295 Q 675,380 740,430" fill="none" stroke="#86151f" stroke-width="2" stroke-linecap="round" />

                        <!-- Messy Hand-Drawn Wobbly Contour Border (Exact match to screenshot) -->
                        <path fill="none" stroke="#86151f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                            d="M 60,34 Q 210,40 380,30 Q 550,40 695,28 Q 725,28 732,58 Q 736,160 730,260 Q 736,360 710,405 Q 560,418 380,406 Q 190,418 60,402 Q 32,400 30,365 Q 24,240 30,140 Q 28,55 60,34 Z" />
                    </svg>

                    <!-- Postcard Main Content Body -->
                    <div class="postcard-body">
                        
                        <!-- Left Column: Typography & Birthday Wishes -->
                        <div class="postcard-left-col">
                            <!-- HAPPY with Stars -->
                            <div class="postcard-happy-row">
                                <span class="postcard-star-accent">✦</span>
                                <h2 class="postcard-happy-title">HAPPY</h2>
                                <span class="postcard-star-accent">✦</span>
                            </div>

                            <!-- Birthday Cursive Script -->
                            <div class="postcard-bday-script">Birthday</div>

                            <!-- Heartfelt Birthday Wish Text -->
                            <p class="postcard-wish-text">
                                Happy birthday! Wishing you a little bit of happiness, love, laughter, and joy today always.
                            </p>

                            <!-- Ribbon Banner: "Pauruti ❤️" (with love sign) -->
                            <div class="postcard-ribbon-tag">
                                <span class="postcard-ribbon-text">Pauruti ❤️</span>
                            </div>
                        </div>

                        <!-- Right Column: Framed Photo + Shinchan with Sweep Broom + CLICK ME Button -->
                        <div class="postcard-right-col">
                            <!-- Tilted Polaroid Photo Card -->
                            <div class="postcard-photo-card">
                                <!-- Metal Paperclip on top-right -->
                                <div class="postcard-paperclip" aria-hidden="true">
                                    <svg viewBox="0 0 24 54" width="22" height="48" class="paperclip-svg">
                                        <path d="M 8 14 L 8 40 A 5 5 0 0 0 18 40 L 18 10 A 8 8 0 0 0 2 10 L 2 44 A 11 11 0 0 0 24 44 L 24 20"
                                            fill="none" stroke="#cbd5e1" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>

                                <!-- Photo of Pauruti (2nd photo) -->
                                <div class="postcard-photo-inner">
                                    <img src="assets/pourutii_framed.jpg" alt="Pauruti" class="postcard-user-photo">
                                </div>
                            </div>

                            <!-- Shinchan holding Sweep (Broom Guitar) Sticker at bottom right -->
                            <div class="postcard-shinchan-sweep-wrap" title="Shinchan rocking out!">
                                <img src="assets/shinchan_sweep_sticker.png" alt="Shinchan singing with sweep broom guitar" class="postcard-shinchan-img">
                            </div>

                            <!-- Pink Heart "CLICK ME" Button on the right (Opens Cake Page) -->
                            <button type="button" class="postcard-clickme-heart-btn" id="postcardClickMeBtn" title="Click to see your birthday cake!">
                                <span class="heart-text">CLICK<br>ME</span>
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        `,
        coupons: `
            <div class="memories-board-wrapper" id="pourutiiMemoriesBoard">
                <div class="memories-board-card">

                    <!-- Top-Left Plaid Gingham Heart with Bow -->
                    <div class="memories-heart-decor" aria-hidden="true">
                        <svg class="plaid-heart-svg" viewBox="0 0 100 100" width="68" height="68">
                            <defs>
                                <pattern id="heartPlaidGrid" width="12" height="12" patternUnits="userSpaceOnUse">
                                    <rect width="12" height="12" fill="#ffffff" />
                                    <rect width="6" height="12" fill="rgba(190, 25, 40, 0.45)" />
                                    <rect width="12" height="6" fill="rgba(190, 25, 40, 0.45)" />
                                </pattern>
                            </defs>
                            <path d="M 50,30 C 50,15 35,5 20,15 C 5,25 5,45 20,65 L 50,90 L 80,65 C 95,45 95,25 80,15 C 65,5 50,15 50,30 Z" 
                                  fill="url(#heartPlaidGrid)" stroke="#86151f" stroke-width="2.5" stroke-dasharray="4,3" />
                        </svg>
                        <div class="heart-mini-bow">🎀</div>
                    </div>

                    <!-- Top-Right Burgundy Sparkle Star -->
                    <div class="memories-star-decor" aria-hidden="true">
                        <span>✦</span>
                    </div>

                    <!-- Top Center Header: MEMORIES in Scrapbook Cutout Tiles (Exact Screenshot Match) -->
                    <div class="memories-title-row">
                        <div class="tile-letter tile-m1" title="M"><span>m</span></div>
                        <div class="tile-letter tile-e1" title="E"><span>E</span></div>
                        <div class="tile-letter tile-m2" title="M"><span>m</span></div>
                        <div class="tile-letter tile-o"  title="O"><span>o</span></div>
                        <div class="tile-letter tile-r"  title="R"><span>r</span></div>
                        <div class="tile-letter tile-i"  title="I"><span>i</span></div>
                        <div class="tile-letter tile-e2" title="E"><span>E</span></div>
                        <div class="tile-letter tile-s"  title="S"><span>S</span></div>
                    </div>

                    <!-- The Curving Clothesline Wire & Glowing Fairy Bulbs -->
                    <div class="memories-clothesline-container" aria-hidden="true">
                        <svg class="clothesline-cord-svg" viewBox="0 0 1050 120" preserveAspectRatio="none">
                            <path d="M 0,35 Q 260,86 525,88 Q 790,86 1050,40" fill="none" stroke="#9e1a24" stroke-width="3" stroke-linecap="round" />
                        </svg>

                        <!-- Warm Glowing Fairy Light Bulbs along the cord -->
                        <div class="fairy-light bulb-1"><div class="bulb-glass">💡</div><div class="bulb-glow"></div></div>
                        <div class="fairy-light bulb-2"><div class="bulb-glass">💡</div><div class="bulb-glow"></div></div>
                        <div class="fairy-light bulb-3"><div class="bulb-glass">💡</div><div class="bulb-glow"></div></div>
                        <div class="fairy-light bulb-4"><div class="bulb-glass">💡</div><div class="bulb-glow"></div></div>
                        <div class="fairy-light bulb-5"><div class="bulb-glass">💡</div><div class="bulb-glow"></div></div>
                        <div class="fairy-light bulb-6"><div class="bulb-glass">💡</div><div class="bulb-glow"></div></div>
                        <div class="fairy-light bulb-7"><div class="bulb-glass">💡</div><div class="bulb-glow"></div></div>
                    </div>

                    <!-- Ribbon Bows & Floral Accents tied along the wire -->
                    <div class="clothesline-bow bow-left" aria-hidden="true">
                        <span class="ribbon-emoji">🎀</span>
                    </div>
                    <div class="clothesline-bow bow-mid" aria-hidden="true">
                        <img src="assets/red_ribbon_bow.png" alt="Red ribbon bow" class="ribbon-bow-img">
                    </div>
                    <div class="clothesline-flower flower-decor" aria-hidden="true">
                        <span class="flower-icon">🌺</span>
                    </div>
                    <div class="clothesline-bow bow-right" aria-hidden="true">
                        <img src="assets/red_ribbon_bow.png" alt="Red ribbon bow" class="ribbon-bow-img">
                    </div>

                    <!-- 5 Hanging Photo Frames with Red Gingham Borders & Wooden Clothespins -->
                    <div class="memories-photos-track">

                        <!-- Photo 1: Flower in hair -->
                        <div class="hanging-frame-item frame-1" data-caption="The sweet flower in your hair & your smile that melts my heart every single day 🌸💕" title="Click to view memory">
                            <div class="wooden-clothespin-wrap">
                                <img src="assets/wooden_clothespin.png" alt="Wooden Clothespin" class="clothespin-img">
                            </div>
                            <div class="gingham-photo-border">
                                <div class="photo-container">
                                    <img src="assets/memory_1.jpg" alt="Memory 1: Flower in hair" class="memory-img">
                                </div>
                            </div>
                        </div>

                        <!-- Photo 2: Suits & Red Rose (with Red Pushpin on top-left!) -->
                        <div class="hanging-frame-item frame-2" data-caption="Our unforgettable formal night holding that red rose together forever 🌹✨" title="Click to view memory">
                            <!-- Red Pushpin on top-left -->
                            <div class="frame-pushpin-pin" aria-hidden="true">📌</div>
                            <div class="wooden-clothespin-wrap">
                                <img src="assets/wooden_clothespin.png" alt="Wooden Clothespin" class="clothespin-img">
                            </div>
                            <div class="gingham-photo-border">
                                <div class="photo-container">
                                    <img src="assets/memory_2.png" alt="Memory 2: Suits and Red Rose" class="memory-img">
                                </div>
                            </div>
                        </div>

                        <!-- Photo 3: Palace Victoria Memorial (hanging lower in curve) -->
                        <div class="hanging-frame-item frame-3" data-caption="Standing beside you at the palace, feeling like the luckiest person in the whole universe 🏰💖" title="Click to view memory">
                            <div class="wooden-clothespin-wrap">
                                <img src="assets/wooden_clothespin.png" alt="Wooden Clothespin" class="clothespin-img">
                            </div>
                            <div class="gingham-photo-border">
                                <div class="photo-container">
                                    <img src="assets/memory_3.png" alt="Memory 3: Victoria Memorial" class="memory-img">
                                </div>
                            </div>
                        </div>

                        <!-- Photo 4: Winking / Laughing joyful selfie -->
                        <div class="hanging-frame-item frame-4" data-caption="Laughing, winking, and being our sweetest, happiest selves together 💙💫" title="Click to view memory">
                            <div class="wooden-clothespin-wrap">
                                <img src="assets/wooden_clothespin.png" alt="Wooden Clothespin" class="clothespin-img">
                            </div>
                            <div class="gingham-photo-border">
                                <div class="photo-container">
                                    <img src="assets/memory_4.png" alt="Memory 4: Happy Smiling Selfie" class="memory-img">
                                </div>
                            </div>
                        </div>

                        <!-- Photo 5: Peace signs & bunny ears -->
                        <div class="hanging-frame-item frame-5" data-caption="Peace signs, bunny ears & endless laughter with my favorite person in the world ✌️🐰💕" title="Click to view memory">
                            <div class="wooden-clothespin-wrap">
                                <img src="assets/wooden_clothespin.png" alt="Wooden Clothespin" class="clothespin-img">
                            </div>
                            <div class="gingham-photo-border">
                                <div class="photo-container">
                                    <img src="assets/memory_5.jpg" alt="Memory 5: Peace signs and bunny ears" class="memory-img">
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- Bottom-Left Vintage Camera Sticker -->
                    <div class="memories-vintage-camera-wrap" id="memoriesVintageCamera" title="Click for camera flash!">
                        <img src="assets/vintage_camera.png" alt="Vintage Film Camera" class="vintage-camera-img">
                    </div>

                    <!-- Bottom-Right Red Chevron Arrow -->
                    <button type="button" class="memories-next-chevron-btn" id="memoriesNextBtn" title="Close memories">
                        <svg viewBox="0 0 24 24" class="chevron-svg" aria-hidden="true">
                            <path d="M 8 4 L 16 12 L 8 20" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>

                    <!-- Interactive Photo Zoom Lightbox Modal -->
                    <div class="memories-lightbox-overlay is-hidden" id="memoriesLightbox">
                        <div class="lightbox-content-card">
                            <button type="button" class="lightbox-close-btn" id="lightboxCloseBtn" title="Close">✕</button>
                            <div class="lightbox-img-wrap">
                                <img src="" alt="Enlarged Memory" class="lightbox-img" id="lightboxImg">
                            </div>
                            <p class="lightbox-caption-text" id="lightboxCaption"></p>
                        </div>
                    </div>

                </div>
            </div>
        `,
        promise: `
            <div class="love-letter-wrapper" id="loveLetterWrapper">
                <!-- Left Parchment Paper Letter Sheet -->
                <div class="letter-parchment-sheet" id="letterParchmentSheet">
                    <div class="letter-scroll-inner">
                        <h2 class="letter-salutation">My Pauruiii, 🥹❤️</h2>
                        
                        <p class="letter-para">
                            I don't think you understand how much you mean to me. You're my favourite person, my biggest smile, and my cutest reason to be happy. 😭💗 HOW DID I GET SO LUCKY TO HAVE YOUUU? 🫶🏻💋
                        </p>
                        
                        <p class="letter-para">
                            I wanna hug you really tight, kiss your forehead, hold your hand, steal your hoodies, and annoy you with all my love foreverrr. 🤭❤️ I don't need a perfect love story; I just want US, making silly memories, laughing together, and falling in love a little more every day. 🫂💕
                        </p>
                        
                        <p class="letter-para">
                            If I had to choose all over again, I'd still choose YOU, every single time. You're my favourite thought, my favourite smile, and my sweetest little happiness. 🥹💌
                        </p>
                        
                        <p class="letter-para letter-para-highlight">
                            I LOVE YOU SOOO MUCHHH, MY CUTUUU! MWAHHHH! 😚💋❤️
                        </p>
                        
                        <p class="letter-signoff">
                            Forever your girl, your cuddle monster, and your personal little headache. 🎀
                        </p>
                        
                        <!-- Bottom Row: Love you ❤️ + Red Chevron Navigation Button -->
                        <div class="letter-bottom-row">
                            <span class="letter-love-you-text" id="letterLoveYouText">Love you ❤️</span>
                            <button type="button" class="letter-next-chevron-btn" id="letterNextChevronBtn" title="Forever & Always 💕">
                                <svg viewBox="0 0 24 24" class="chevron-svg" aria-hidden="true">
                                    <path d="M 8 4 L 16 12 L 8 20" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Vertical Scalloped Eyelet Lace Divider -->
                <div class="letter-scallop-lace-divider" aria-hidden="true"></div>

                <!-- Right Gingham Checkered Panel -->
                <div class="letter-gingham-sidebar" aria-hidden="true"></div>

                <!-- Bottom-Right Shinchan Corner Stage (Starts Normal, Animates to Blushing/Winking!) -->
                <div class="letter-shinchan-corner-stage" id="letterShinchanStage" title="Tap Shinchan for a cute surprise! 💕">
                    <div class="shinchan-hearts-emitter" id="shinchanHeartsEmitter"></div>
                    <img src="assets/shinchan_letter_normal.png" alt="Normal Shinchan" class="shinchan-corner-actor face-normal" id="shinchanLetterNormal">
                    <img src="assets/shinchan_letter_blush.png" alt="Winking Blushing Shinchan" class="shinchan-corner-actor face-blush is-hidden" id="shinchanLetterBlush">
                    <div class="shinchan-tap-hint" id="shinchanTapHint">tap me! 💖</div>
                </div>
            </div>
        `
    };

    giftItems.forEach(item => {
        item.addEventListener('click', () => {
            playSound('popper');
            const type = item.dataset.gift;
            const actor = item.querySelector('.flying-gift-actor');
            const badge = item.querySelector('.gift-opened-badge');

            if (actor) {
                actor.style.transform = 'scale(1.18) translateY(-46px) rotate(-3deg)';
                setTimeout(() => {
                    actor.style.transform = '';
                }, 400);
            }

            if (badge) {
                badge.textContent = 'OPEN';
                if (badge.classList.contains('is-hidden')) {
                    badge.classList.remove('is-hidden');
                    openedCount++;
                    if (openedCount === 3 && clickOneTitle) {
                        clickOneTitle.textContent = "ALL GIFTS UNWRAPPED! 🎉";
                        triggerCelebration();
                    }
                }
            }

            const rect = item.getBoundingClientRect();
            for (let i = 0; i < 12; i++) {
                setTimeout(() => {
                    spawnHeartAt(rect.left + rect.width / 2 + (Math.random() - 0.5) * 80, rect.top + 30);
                }, i * 40);
            }

            if (slot && giftDetails[type]) {
                slot.innerHTML = giftDetails[type];
                if (modal) {
                    if (type === 'letter') {
                        modal.classList.add('modal-postcard-mode');
                        // Bind CLICK ME button -> Opens the Cake Page!
                        const clickMeBtn = slot.querySelector('#postcardClickMeBtn');

                        if (clickMeBtn) {
                            clickMeBtn.addEventListener('click', (e) => {
                                e.stopPropagation();
                                playSound('fanfare');
                                // Switch view to Cake page DIRECTLY so the gifts page NEVER flashes
                                showView(viewCake);
                                modal.classList.remove('open');
                                modal.classList.remove('modal-postcard-mode');

                                // Reset and trigger rising cake animation from bottom to top
                                const cakeActor = document.getElementById('cakeActor');
                                if (cakeActor) {
                                    cakeActor.style.animation = 'none';
                                    void cakeActor.offsetWidth; // Force reflow
                                    cakeActor.style.animation = '';
                                }

                                // Reset candle flames to lit state
                                const cakeFlames = document.getElementById('cakeFlamesOverlay');
                                if (cakeFlames) {
                                    cakeFlames.classList.remove('blown-out');
                                }

                                // Reset blow button
                                const blowBtn = document.getElementById('blowCandlesBtn');
                                if (blowBtn) {
                                    blowBtn.classList.remove('wish-granted');
                                    blowBtn.innerHTML = '<span class="comic-pill-text">BLOW CANDLES 🎉</span>';
                                }

                                // Reset side click me button pulse
                                const sideClickBtn = document.getElementById('cakeClickMeBtn');
                                if (sideClickBtn) {
                                    sideClickBtn.classList.remove('cake-pulse-highlight');
                                }
                            });
                        }
                    } else if (type === 'coupons') {
                        modal.classList.add('modal-memories-mode');
                        modal.classList.remove('modal-postcard-mode');
                        modal.classList.remove('modal-letter-mode');
                        setupMemoriesBoardInteractions(slot);
                    } else if (type === 'promise') {
                        modal.classList.add('modal-letter-mode');
                        modal.classList.remove('modal-postcard-mode');
                        modal.classList.remove('modal-memories-mode');
                        setupLoveLetterInteractions(slot);
                    } else {
                        modal.classList.remove('modal-postcard-mode');
                        modal.classList.remove('modal-memories-mode');
                        modal.classList.remove('modal-letter-mode');
                    }

                    setTimeout(() => {
                        modal.classList.add('open');
                    }, 250);
                }
            }
        });
    });

    // Top-Left Back Arrow on Gifts Page -> Go back to Excited question
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            playSound('pop');
            showView(viewExcited);
        });
    }

    // Right Red Chevron -> Smooth Scroll to Final Birthday Wishes Card
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            playSound('fanfare');
            triggerCelebration();
            if (finalWishesCard) {
                finalWishesCard.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Modal Close Button & Backdrop Click
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            playSound('click');
            modal.classList.remove('open');
            modal.classList.remove('modal-postcard-mode');
            modal.classList.remove('modal-memories-mode');
            modal.classList.remove('modal-letter-mode');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('open');
                modal.classList.remove('modal-postcard-mode');
                modal.classList.remove('modal-memories-mode');
                modal.classList.remove('modal-letter-mode');
            }
        });
    }

    // Replay from Start Button on Wishes Card -> Reset everything & go to Scene 1
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            playSound('pop');
            document.querySelectorAll('.gift-opened-badge').forEach(b => b.classList.add('is-hidden'));
            openedCount = 0;
            if (clickOneTitle) clickOneTitle.textContent = "CLICK ON THE GIFTS";
            showView(viewFront);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// --- GIFT 2: MEMORIES CLOTHESLINE BOARD INTERACTIONS ---
function setupMemoriesBoardInteractions(container) {
    if (!container) return;

    const frames = container.querySelectorAll('.hanging-frame-item');
    const lightbox = container.querySelector('#memoriesLightbox');
    const lightboxImg = container.querySelector('#lightboxImg');
    const lightboxCaption = container.querySelector('#lightboxCaption');
    const lightboxClose = container.querySelector('#lightboxCloseBtn');
    const vintageCamera = container.querySelector('#memoriesVintageCamera');
    const nextChevronBtn = container.querySelector('#memoriesNextBtn');

    // Clicking any photo opens the romantic photo lightbox!
    frames.forEach(frame => {
        frame.addEventListener('click', (e) => {
            e.stopPropagation();
            playSound('pop');
            const img = frame.querySelector('.memory-img');
            const caption = frame.dataset.caption;

            if (lightbox && lightboxImg && lightboxCaption && img) {
                lightboxImg.src = img.src;
                lightboxCaption.textContent = caption || 'Sweet Memories 💕';
                lightbox.classList.remove('is-hidden');
            }
        });
    });

    // Close lightbox
    if (lightboxClose && lightbox) {
        lightboxClose.addEventListener('click', (e) => {
            e.stopPropagation();
            playSound('click');
            lightbox.classList.add('is-hidden');
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.add('is-hidden');
            }
        });
    }

    // Interactive Vintage Camera: Shutter sound + white screen flash + hearts!
    if (vintageCamera) {
        vintageCamera.addEventListener('click', (e) => {
            e.stopPropagation();
            playSound('popper');

            // Flash effect across screen
            const flash = document.createElement('div');
            flash.style.position = 'fixed';
            flash.style.inset = '0';
            flash.style.background = '#ffffff';
            flash.style.zIndex = '999999';
            flash.style.opacity = '0.9';
            flash.style.pointerEvents = 'none';
            flash.style.transition = 'opacity 0.45s ease';
            document.body.appendChild(flash);
            setTimeout(() => {
                flash.style.opacity = '0';
                setTimeout(() => flash.remove(), 450);
            }, 60);

            // Floating mini hearts around camera
            const rect = vintageCamera.getBoundingClientRect();
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    spawnHeartAt(rect.left + rect.width / 2 + (Math.random() - 0.5) * 70, rect.top);
                }, i * 50);
            }
        });
    }

    // Red Chevron Arrow in bottom right -> Closes memories board & celebrates!
    if (nextChevronBtn) {
        nextChevronBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            playSound('fanfare');
            const modal = document.getElementById('giftModal');
            if (modal) {
                modal.classList.remove('open');
                modal.classList.remove('modal-memories-mode');
            }
            triggerCelebration();
        });
    }
}

// --- GIFT 3: LOVE LETTER & SHINCHAN FACE MORPH INTERACTIONS ---
function setupLoveLetterInteractions(container) {
    if (!container) return;

    const sheet = container.querySelector('#letterParchmentSheet');
    const shinchanStage = container.querySelector('#letterShinchanStage');
    const normalFace = container.querySelector('#shinchanLetterNormal');
    const blushFace = container.querySelector('#shinchanLetterBlush');
    const nextBtn = container.querySelector('#letterNextChevronBtn');
    const loveYouText = container.querySelector('#letterLoveYouText');
    const emitter = container.querySelector('#shinchanHeartsEmitter');
    const hint = container.querySelector('#shinchanTapHint');

    let isBlushing = false;

    function triggerShinchanBlush(isUserClick = false) {
        if (!normalFace || !blushFace) return;
        if (isBlushing && !isUserClick) return;

        // Transition: normal face hides, blushing face appears with hop & scale
        normalFace.classList.add('is-hidden');
        blushFace.classList.remove('is-hidden');

        if (shinchanStage) {
            shinchanStage.classList.add('is-blushing', 'bounce-happy');
            setTimeout(() => {
                if (shinchanStage) shinchanStage.classList.remove('bounce-happy');
            }, 650);
        }

        if (isUserClick) {
            playSound('pop');
        }

        // Spawn floaty hearts around Shinchan
        if (emitter) {
            const count = isUserClick ? 8 : 5;
            for (let i = 0; i < count; i++) {
                setTimeout(() => {
                    const heart = document.createElement('span');
                    heart.className = 'shinchan-floating-heart';
                    heart.textContent = ['💖', '💕', '🥰', '✨', '💌', '🌸'][Math.floor(Math.random() * 6)];
                    heart.style.left = `${15 + Math.random() * 70}%`;
                    heart.style.animationDuration = `${1.2 + Math.random() * 0.7}s`;
                    emitter.appendChild(heart);
                    setTimeout(() => heart.remove(), 1900);
                }, i * 85);
            }
        }

        isBlushing = true;
    }

    function returnToNormalFace() {
        if (!normalFace || !blushFace) return;
        blushFace.classList.add('is-hidden');
        normalFace.classList.remove('is-hidden');
        if (shinchanStage) shinchanStage.classList.remove('is-blushing');
        isBlushing = false;
    }

    // Scroll trigger: as user scrolls down the letter, Shinchan animates!
    if (sheet) {
        sheet.addEventListener('scroll', () => {
            const scrollDistance = sheet.scrollTop;
            const scrollMax = sheet.scrollHeight - sheet.clientHeight;
            
            // If scrolled down past 35px or 25% down the letter
            if (scrollDistance > 35 || (scrollMax > 0 && scrollDistance / scrollMax > 0.25)) {
                if (!isBlushing) {
                    triggerShinchanBlush(false);
                }
            } else if (scrollDistance < 10 && isBlushing) {
                // If user scrolls back to the very top, he looks normal again!
                returnToNormalFace();
            }
        });
    }

    // Fallback timer: if user is taking their time or letter fits screen without scroll
    setTimeout(() => {
        if (!isBlushing) {
            triggerShinchanBlush(false);
        }
    }, 2400);

    // Interactive Tap on Shinchan: Toggles or hops with pop sound & floating hearts!
    if (shinchanStage) {
        shinchanStage.addEventListener('click', (e) => {
            e.stopPropagation();
            triggerShinchanBlush(true);
            if (hint) {
                hint.textContent = 'Mwahhh! 😚💋';
                hint.style.opacity = '1';
                setTimeout(() => {
                    if (hint) {
                        hint.textContent = 'tap me! 💖';
                        hint.style.opacity = '';
                    }
                }, 2000);
            }
        });
    }

    // Red Chevron '>' navigation button / 'Love you ❤️' -> Closes letter & celebrates!
    function handleFinish(e) {
        if (e) e.stopPropagation();
        playSound('fanfare');
        const modal = document.getElementById('giftModal');
        if (modal) {
            modal.classList.remove('open');
            modal.classList.remove('modal-letter-mode');
        }
        triggerCelebration();
    }

    if (nextBtn) nextBtn.addEventListener('click', handleFinish);
    if (loveYouText) loveYouText.addEventListener('click', handleFinish);
}

// --- SOUND TOGGLE ---
function setupSoundToggle() {
    const btn = document.getElementById('soundToggleBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        if (state.soundEnabled) {
            btn.textContent = '🔊';
            playSound('click');
        } else {
            btn.textContent = '🔇';
        }
    });
}

// --- INITIALIZE EVERYTHING ON DOM READY ---
document.addEventListener('DOMContentLoaded', () => {
    setupPostcardStoryline();
    setupSoundToggle();
});

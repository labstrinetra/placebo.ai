function initSpiderLoader() {
    const canvas = document.createElement('canvas');
    const container = document.getElementById('loader-container');
    if (!container) return;
    
    // Ensure canvas is behind the text but visible
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '1';
    container.appendChild(canvas);
    
    let w, h;
    const ctx = canvas.getContext("2d");
    const { sin, cos, PI, hypot, min, max } = Math;

    function spawn() {
        const pts = many(333, () => {
            return {
                x: rnd(window.innerWidth),
                y: rnd(window.innerHeight),
                len: 0,
                r: 0,
            }
        });

        const pts2 = many(9, (i) => {
            return {
                x: cos((i / 9) * PI * 2),
                y: sin((i / 9) * PI * 2),
            }
        });

        const seed = rnd(100);
        let tx = rnd(window.innerWidth);
        let ty = rnd(window.innerHeight);
        let x = rnd(window.innerWidth);
        let y = rnd(window.innerHeight);
        const kx = rnd(0.5, 0.5);
        const ky = rnd(0.5, 0.5);
        const walkRadius = pt(rnd(50, 50), rnd(50, 50));
        const r = window.innerWidth / rnd(100, 150);

        function paintPt(pt) {
            pts2.forEach((pt2) => {
                if (!pt.len) return;
                drawLine(
                    lerp(x + pt2.x * r, pt.x, pt.len * pt.len),
                    lerp(y + pt2.y * r, pt.y, pt.len * pt.len),
                    x + pt2.x * r,
                    y + pt2.y * r,
                );
            });
            drawCircle(pt.x, pt.y, pt.r);
        }

        return {
            follow(x_coord, y_coord) {
                tx = x_coord;
                ty = y_coord;
            },

            tick(t) {
                const selfMoveX = cos(t * kx + seed) * walkRadius.x;
                const selfMoveY = sin(t * ky + seed) * walkRadius.y;
                const fx = tx + selfMoveX;
                const fy = ty + selfMoveY;

                x += min(window.innerWidth / 100, (fx - x) / 10);
                y += min(window.innerWidth / 100, (fy - y) / 10);

                let i = 0;
                pts.forEach((pt) => {
                    const dx = pt.x - x, dy = pt.y - y;
                    const len = hypot(dx, dy);
                    let r_size = min(2, window.innerWidth / len / 5);
                    const increasing = len < window.innerWidth / 10 && i++ < 8;
                    const dir = increasing ? 0.1 : -0.1;
                    if (increasing) {
                        r_size *= 1.5;
                    }
                    pt.r = r_size;
                    pt.len = max(0, min(pt.len + dir, 1));
                    paintPt(pt);
                });
            },
        }
    }

    const spiders = many(2, spawn);

    const handlePointerMove = (e) => {
        spiders.forEach((spider) => {
            spider.follow(e.clientX, e.clientY);
        });
    };

    function anim(t) {
        if (w !== window.innerWidth) w = canvas.width = window.innerWidth;
        if (h !== window.innerHeight) h = canvas.height = window.innerHeight;
        ctx.fillStyle = "#0a0a0a"; 
        drawCircle(0, 0, w * 10);
        ctx.fillStyle = ctx.strokeStyle = "#10b981"; // Bright Emerald
        t /= 1000;
        spiders.forEach((spider) => spider.tick(t));
        requestAnimationFrame(anim);
    }

    function rnd(x_val = 1, dx = 0) {
        return Math.random() * x_val + dx;
    }

    function drawCircle(x_pos, y_pos, r_rad) {
        ctx.beginPath();
        ctx.ellipse(x_pos, y_pos, r_rad, r_rad, 0, 0, PI * 2);
        ctx.fill();
    }

    function drawLine(x0, y0, x1, y1) {
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        many(100, (i) => {
            i = (i + 1) / 100;
            const x_lerp = lerp(x0, x1, i);
            const y_lerp = lerp(y0, y1, i);
            const k = noise(x_lerp / 5 + x0, y_lerp / 5 + y0) * 2;
            ctx.lineTo(x_lerp + k, y_lerp + k);
        });
        ctx.stroke();
    }

    function many(n, f) {
        return [...Array(n)].map((_, i) => f(i));
    }

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function noise(x_val, y_val, t = 101) {
        const w0 = sin(0.3 * x_val + 1.4 * t + 2.0 + 2.5 * sin(0.4 * y_val + -1.3 * t + 1.0));
        const w1 = sin(0.2 * y_val + 1.5 * t + 2.8 + 2.3 * sin(0.5 * x_val + -1.2 * t + 0.5));
        return w0 + w1;
    }

    function pt(x_val, y_val) {
        return { x: x_val, y: y_val };
    }

    window.addEventListener("pointermove", handlePointerMove);
    requestAnimationFrame(anim);
}

function revealWebsite() {
    const loader = document.getElementById('loader-container');
    const mainContent = document.getElementById('main-content');
    if (loader && mainContent) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            mainContent.style.opacity = '1';
            mainContent.style.pointerEvents = 'all';
        }, 1000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initSpiderLoader();
    // Force reveal after 6 seconds
    setTimeout(revealWebsite, 6000);
});

(() => {
  const canvas = document.getElementById('net');
  const ctx = canvas.getContext('2d');
  const TEAL = '0,212,184';
  const AMBER = '245,158,11';

  let W, H, nodes, mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    init();
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function init() {
    const count = Math.floor((W * H) / 18000);
    nodes = Array.from({ length: count }, () => ({
      x: rand(0, W), y: rand(0, H),
      vx: rand(-.25, .25), vy: rand(-.25, .25),
      r: rand(1.5, 3.5),
      color: Math.random() > .75 ? AMBER : TEAL,
      pulse: rand(0, Math.PI * 2),
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // update
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy; n.pulse += .018;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;

      // gentle mouse attraction
      const dx = mouse.x - n.x, dy = mouse.y - n.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 180) {
        n.vx += dx / dist * .012;
        n.vy += dy / dist * .012;
        const spd = Math.sqrt(n.vx*n.vx + n.vy*n.vy);
        if (spd > .8) { n.vx /= spd * 1.25; n.vy /= spd * 1.25; }
      }
    });

    // edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        const maxD = 140;
        if (d < maxD) {
          const alpha = (1 - d / maxD) * .35;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${a.color},${alpha})`;
          ctx.lineWidth = .8;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // nodes
    nodes.forEach(n => {
      const glow = (Math.sin(n.pulse) + 1) / 2;
      const r = n.r + glow * .8;
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${n.color},${.55 + glow * .35})`;
      ctx.fill();

      // outer glow ring
      ctx.beginPath();
      ctx.arc(n.x, n.y, r + 3, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${n.color},${.08 + glow * .08})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  resize();
  draw();
})();

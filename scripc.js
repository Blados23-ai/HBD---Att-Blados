const PI2 = Math.PI * 2;
const random = (min, max) => Math.random() * (max - min + 1) + min | 0;
const timestamp = _ => new Date().getTime();

class Birthday {
  constructor() {
    this.resize();
    this.fireworks = [];
    this.counter = 0;
  }

  resize() {
    this.width = canvas.width = window.innerWidth;
    this.height = canvas.height = window.innerHeight;
  }

  onClick(evt) {
    let x = evt.clientX || evt.touches && evt.touches[0].pageX;
    let y = evt.clientY || evt.touches && evt.touches[0].pageY;

    let count = random(3, 5);
    for (let i = 0; i < count; i++) this.fireworks.push(new Firework(
      random(0, this.width),
      this.height,
      x,
      y,
      random(0, 360),
      random(30, 110)
    ));
    this.counter = -1;
  }

  update(delta) {
    ctx.globalCompositeOperation = 'hard-light';
    ctx.fillStyle = `rgba(20,20,20,${7 * delta})`;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.globalCompositeOperation = 'lighter';
    for (let firework of this.fireworks) firework.update(delta);

    this.counter += delta * 3;
    if (this.counter >= 1) {
      this.fireworks.push(new Firework(
        random(0, this.width),
        this.height,
        random(0, this.width),
        random(0, this.height / 2),
        random(0, 360),
        random(30, 110)
      ));
      this.counter = 0;
    }

    if (this.fireworks.length > 1000) this.fireworks = this.fireworks.filter(firework => !firework.dead);
  }
}

class Firework {
  constructor(x, y, targetX, targetY, shade, offsprings) {
    this.dead = false;
    this.offsprings = offsprings;
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.shade = shade;
    this.history = [];
  }

  update(delta) {
    if (this.dead) return;

    let xDiff = this.targetX - this.x;
    let yDiff = this.targetY - this.y;
    if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) {
      this.x += xDiff * 2 * delta;
      this.y += yDiff * 2 * delta;

      this.history.push({
        x: this.x,
        y: this.y
      });

      if (this.history.length > 20) this.history.shift();
    } else {
      if (this.offsprings && !this.madeChilds) {
        let babies = this.offsprings / 2;
        for (let i = 0; i < babies; i++) {
          let targetX = this.x + this.offsprings * Math.cos(PI2 * i / babies) | 0;
          let targetY = this.y + this.offsprings * Math.sin(PI2 * i / babies) | 0;
          birthday.fireworks.push(new Firework(this.x, this.y, targetX, targetY, this.shade, 0));
        }
      }
      this.madeChilds = true;
      this.history.shift();
    }

    if (this.history.length === 0) this.dead = true;
    else if (this.offsprings) {
      for (let i = 0; this.history.length > i; i++) {
        let point = this.history[i];
        ctx.beginPath();
        ctx.fillStyle = 'hsl(' + this.shade + ',100%,' + i + '%)';
        ctx.arc(point.x, point.y, 1, 0, PI2, false);
        ctx.fill();
      }
    } else {
      ctx.beginPath();
      ctx.fillStyle = 'hsl(' + this.shade + ',100%,50%)';
      ctx.arc(this.x, this.y, 1, 0, PI2, false);
      ctx.fill();
    }
  }
}

// Función para mostrar el texto letra por letra
function typeText (element, text, speed) {
  let i = 0;
  let interval = setInterval(() => {
    element.textContent += text.charAt(i);
    i++;
    if (i === text.length)  {
        clearInterval(interval);
    }
  }, speed);
}

// Función para mostrar las imágenes del cumpleaños en la parte inferior
function showBirthdayImages() {
  const images = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg']; // Lista de nombres de imagen
  const bottom = window.innerHeight - 120; // Un poco de espacio desde el borde inferior
  const startX = window.innerWidth / 2 - (images.length * 110) / 2; // Alinear las imágenes al centro
  images.forEach((imageSrc, index) => {
    setTimeout(() => {
      createImage(imageSrc, startX + index * 120, bottom);  // Muestra las imágenes una por una
    }, index * 2000);  // Muestra una imagen cada 2 segundos
  });
}

// Función para crear una imagen en la parte inferior
function createImage(imageSrc, x, y) {
  const img = document.createElement('img');
  img.src = imageSrc;
  img.style.position = 'absolute';
  img.style.left = `${x}px`;  // Posición calculada en X
  img.style.top = `${y}px`;   // Posición calculada en Y
  img.style.width = '100px';
  img.style.height = '100px';
  img.style.opacity = 1;
  document.body.appendChild(img);

  // Animación para que se desvanezcan después de un tiempo
  setTimeout(() => {
    img.style.transition = 'opacity 1s';
    img.style.opacity = 0;
    setTimeout(() => img.remove(), 1000); // Elimina la imagen después de que desaparezca
  }, 5000); // La imagen desaparecerá 5 segundos después de ser mostrada
}

// Inicializa la animación de los fuegos artificiales
const canvas = document.getElementById('birthday');
const ctx = canvas.getContext('2d');
const birthday = new Birthday();
const audio = document.getElementById('audio');
const surpriseBtn = document.getElementById('surpriseBtn');
const messageDiv = document.getElementById('messageDiv');

// Función para iniciar la animación al hacer clic en el botón
surpriseBtn.onclick = function() {
  audio.currentTime = 44; // Inicia desde el segundo 44
  audio.play();

  messageDiv.style.display = 'block';
  canvas.style.display = 'block';
  surpriseBtn.style.display = 'none';

  // Muestra 'Feliz Cumpleaños' letra por letra
  const h1Element = document.querySelector('#messageDiv h1');
  typeText(h1Element, 'Feliz Cumpleaños', 200);

  // Muestra 'Beltr ♥' letra por letra después de 'Feliz Cumpleaños'
  const nameDiv = document.getElementById('nameDiv');
  nameDiv.style.display = 'block';
  const nameElement = document.querySelector('#nameDiv h2');
  setTimeout(() => {
    typeText(nameElement, 'Beltr ♥', 200);
  }, 3000); // Espera 3 segundos después de mostrar 'Feliz cumpleaños' antes de mostrar 'Beltr'

  // Iniciar los fuegos artificiales
  window.onclick = (evt) => birthday.onClick(evt);
  window.ontouchstart = (evt) => birthday.onClick(evt);

  let then = timestamp();
  function loop() {
    requestAnimationFrame(loop);
    let now = timestamp();
    let delta = now - then;
    then = now;
    birthday.update(delta / 1000);
  }
  loop();

  // Mostrar las imágenes del cumpleañero una por una en la parte inferior
  showBirthdayImages();
};

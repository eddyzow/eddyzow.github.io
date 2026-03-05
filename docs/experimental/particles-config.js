// PARTICLES.JS CONFIGURATION
document.addEventListener('DOMContentLoaded', () => {
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 1000
          }
        },
        color: {
          value: ['#00ff88', '#00ccff', '#ff00ff', '#ff8800']
        },
        shape: {
          type: 'circle',
          stroke: {
            width: 0,
            color: '#ffffff'
          }
        },
        opacity: {
          value: 0.4,
          random: true,
          anim: {
            enable: true,
            speed: 0.8,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 2.5,
          random: true,
          anim: {
            enable: true,
            speed: 1.5,
            size_min: 0.5,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 200,
          color: '#00ff88',
          opacity: 0.2,
          width: 1
        },
        move: {
          enable: true,
          speed: 0.8,
          direction: 'none',
          random: false,
          straight: false,
          out_mode: 'bounce',
          bounce: true,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200
          }
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: {
            enable: true,
            mode: 'grab'
          },
          onclick: {
            enable: true,
            mode: 'push'
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 200,
            line_linked: {
              opacity: 0.5
            }
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 0.8,
            speed: 3
          },
          repulse: {
            distance: 200,
            duration: 0.4
          },
          push: {
            particles_nb: 4
          },
          remove: {
            particles_nb: 2
          }
        }
      },
      retina_detect: true
    });
  }
});

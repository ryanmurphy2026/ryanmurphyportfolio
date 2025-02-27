document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      gsap.to(window, { duration: 1, scrollTo: { y: target, offsetY: 50, ease: "power2.inOut" } });
    });
  });
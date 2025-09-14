const AOS = window.AOS
const bootstrap = window.bootstrap


AOS.init({
  duration: 1000,
  once: true,
  offset: 100,
  easing: "ease-out-cubic",
})


document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    const navbarCollapse = document.getElementById("navbarNav")
    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
      const collapseInstance = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse)
      collapseInstance.hide()
    }
  })
})


window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar")
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  }
})


const backToTopBtn = document.getElementById("backToTop")

if (backToTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      backToTopBtn.classList.add("show")
    } else {
      backToTopBtn.classList.remove("show")
    }
  })

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })

 
  backToTopBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  })
}


document.querySelectorAll('a[href^="#"], .smooth-scroll').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      const offsetTop = target.offsetTop - 80 
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  })
})


window.addEventListener("load", () => {
  document.body.classList.add("loaded")
})


const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate")

      
      const children = entry.target.querySelectorAll(".stagger-child")
      children.forEach((child, index) => {
        setTimeout(() => {
          child.classList.add("animate")
        }, index * 100)
      })
    }
  })
}, observerOptions)


document
  .querySelectorAll(".enhanced-post, .curiosity-card, .enhanced-reference-card, .enhanced-glass-card")
  .forEach((el) => {
    observer.observe(el)
  })


window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const hero = document.querySelector(".hero-background")
  if (hero) {
    hero.style.transform = `translateY(${scrolled * 0.3}px)`
  }
})


document.addEventListener("DOMContentLoaded", () => {
  const curiosityCards = document.querySelectorAll(".curiosity-card")

  curiosityCards.forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("flipped")
    })

    
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        card.classList.toggle("flipped")
      }
    })

    // Tornar focável
    card.setAttribute("tabindex", "0")
  })
})


document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn")
  const galleryItems = document.querySelectorAll(".enhanced-gallery-item")

  filterButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()

      
      filterButtons.forEach((btn) => btn.classList.remove("active"))

      
      button.classList.add("active")

      const filter = button.getAttribute("data-filter")

      galleryItems.forEach((item) => {
        const category = item.getAttribute("data-category")

        if (filter === "all" || category === filter) {
          item.classList.remove("hidden")
          item.classList.remove("filtering")
        } else {
          item.classList.add("filtering")
          setTimeout(() => {
            item.classList.add("hidden")
          }, 300)
        }
      })
    })
  })
})


document.addEventListener("DOMContentLoaded", () => {
  const galleryItems = Array.from(document.querySelectorAll(".enhanced-gallery-item"))
  const lightbox = document.getElementById("lightbox")
  const lightboxImg = lightbox && lightbox.querySelector("img")
  const closeBtn = document.getElementById("lightboxClose")
  const prevBtn = document.getElementById("lightboxPrev")
  const nextBtn = document.getElementById("lightboxNext")
  const captionEl = document.getElementById("lightboxCaption")
  const counterEl = document.getElementById("lightboxCounter")

  let currentIndex = -1
  let visibleItems = []

  if (!lightbox || !galleryItems.length) return

  function updateVisibleItems() {
    visibleItems = galleryItems.filter((item) => !item.classList.contains("hidden"))
  }

  function openLightbox(index) {
    updateVisibleItems()
    const item = visibleItems[index]
    if (!item) return

    const img = item.querySelector("img")
    const src = item.dataset.full || img.src
    const alt = img.alt || ""
    const caption = item.querySelector(".gallery-caption")?.textContent || alt

    if (lightboxImg) {
      lightboxImg.src = src
      lightboxImg.alt = alt
    }

    if (captionEl) captionEl.textContent = caption
    if (counterEl) counterEl.textContent = `${index + 1} / ${visibleItems.length}`

    lightbox.classList.add("open")
    lightbox.setAttribute("aria-hidden", "false")
    currentIndex = index

  
    document.body.style.overflow = "hidden"

    
    preloadAdjacentImages(index)
  }

  function closeLightbox() {
    lightbox.classList.remove("open")
    lightbox.setAttribute("aria-hidden", "true")
    if (lightboxImg) lightboxImg.src = ""
    currentIndex = -1

    
    document.body.style.overflow = ""
  }

  function showNext() {
    updateVisibleItems()
    const nextIndex = (currentIndex + 1) % visibleItems.length
    openLightbox(nextIndex)
  }

  function showPrev() {
    updateVisibleItems()
    const prevIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length
    openLightbox(prevIndex)
  }

  function preloadAdjacentImages(index) {
    updateVisibleItems()
    const nextIndex = (index + 1) % visibleItems.length
    const prevIndex = (index - 1 + visibleItems.length) % visibleItems.length
    ;[nextIndex, prevIndex].forEach((i) => {
      const item = visibleItems[i]
      if (item) {
        const img = item.querySelector("img")
        const src = item.dataset.full || img.src
        const preloadImg = new Image()
        preloadImg.src = src
      }
    })
  }

  
  galleryItems.forEach((item, index) => {
    const clickHandler = () => {
      updateVisibleItems()
      const visibleIndex = visibleItems.indexOf(item)
      if (visibleIndex !== -1) {
        openLightbox(visibleIndex)
      }
    }

    item.addEventListener("click", clickHandler)

 
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        clickHandler()
      }
    })

    
    item.setAttribute("tabindex", "0")
  })

 
  if (closeBtn) closeBtn.addEventListener("click", closeLightbox)
  if (prevBtn)
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      showPrev()
    })
  if (nextBtn)
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation()
      showNext()
    })


  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox()
  })


  if (lightboxImg) {
    lightboxImg.addEventListener("click", (e) => {
      e.stopPropagation()
      showNext()
    })
  }

  
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return

    switch (e.key) {
      case "Escape":
        closeLightbox()
        break
      case "ArrowRight":
        showNext()
        break
      case "ArrowLeft":
        showPrev()
        break
    }
  })

  
  let touchStartX = 0
  let touchEndX = 0

  lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX
  })

  lightbox.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX
    const diff = touchEndX - touchStartX

    if (Math.abs(diff) > 50) {
      if (diff < 0) {
        showNext()
      } else {
        showPrev()
      }
    }
  })
})

// Sistema de notificações
function showNotification(message, type = "info", duration = 5000) {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: var(--white);
    color: var(--text-dark);
    padding: 1rem 1.5rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-hover);
    z-index: 9999;
    max-width: 300px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    border-left: 4px solid var(--accent-color);
  `

  if (type === "error") {
    notification.style.borderLeftColor = "#ff6b6b"
  } else if (type === "success") {
    notification.style.borderLeftColor = "#66bb6a"
  }

  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      <i class="fas fa-${type === "error" ? "exclamation-circle" : type === "success" ? "check-circle" : "info-circle"}"></i>
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; margin-left: auto;">×</button>
    </div>
  `

  document.body.appendChild(notification)

  // Animar entrada
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove()
      }
    }, 300)
  }, duration)
}


function initLazyLoading() {
  const images = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("loading")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}


initLazyLoading()


document.addEventListener("DOMContentLoaded", () => {
  
  const cards = document.querySelectorAll(".enhanced-post, .enhanced-glass-card, .enhanced-reference-card")

  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)"
    })
  })

 
  const buttons = document.querySelectorAll(".hero-btn, .enhanced-back-to-top")

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span")
      const rect = this.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
      `

      this.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })
})


window.addEventListener("error", (e) => {
  console.error("Erro no Blog da Cabeçuda:", e.error)
  showNotification("Ops! Algo deu errado. Tente recarregar a página.", "error")
})


function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}


const debouncedScroll = debounce(() => {
  
}, 16) 

window.addEventListener("scroll", debouncedScroll)

// Mensagem de boas-vindas no console
console.log(`
🐢 Bem-vindo ao Blog da Cabeçuda! 🐢
Desenvolvido com amor pela conservação marinha.
Equipe: Erika, Echiley, Lucy, Micaelly e Victória
ETEC João Belarmino - Amparo, SP

`)

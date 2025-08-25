// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all functionality
  initNavigation()
  initScrollAnimations()
  initSkillBars()
  initContactForm()
  initScrollToTop()
  initMobileMenu()
})

// Navigation functionality
function initNavigation() {
  const navbar = document.getElementById("navbar")
  const navLinks = document.querySelectorAll(".nav-link")

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })

  // Smooth scrolling and active link highlighting
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 70

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }

      // Update active link
      navLinks.forEach((l) => l.classList.remove("active"))
      this.classList.add("active")

      // Close mobile menu if open
      const navMenu = document.getElementById("nav-menu")
      const mobileMenu = document.getElementById("mobile-menu")
      navMenu.classList.remove("active")
      mobileMenu.classList.remove("active")
    })
  })

  // Update active link on scroll
  window.addEventListener("scroll", updateActiveLink)
}

function updateActiveLink() {
  const sections = document.querySelectorAll("section")
  const navLinks = document.querySelectorAll(".nav-link")

  let current = ""

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100
    const sectionHeight = section.clientHeight

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active")
    }
  })
}

// Mobile menu functionality
function initMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu")
  const navMenu = document.getElementById("nav-menu")

  mobileMenu.addEventListener("click", () => {
    mobileMenu.classList.toggle("active")
    navMenu.classList.toggle("active")
  })

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!mobileMenu.contains(e.target) && !navMenu.contains(e.target)) {
      mobileMenu.classList.remove("active")
      navMenu.classList.remove("active")
    }
  })
}

// Scroll animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
      }
    })
  }, observerOptions)

  // Add fade-in class to elements
  const animateElements = document.querySelectorAll(".project-card, .skill-item, .contact-info, .contact-form")
  animateElements.forEach((el) => {
    el.classList.add("fade-in")
    observer.observe(el)
  })
}

// Skill bars animation
function initSkillBars() {
  const skillBars = document.querySelectorAll(".skill-progress")

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const skillBar = entry.target
          const width = skillBar.getAttribute("data-width")

          setTimeout(() => {
            skillBar.style.width = width + "%"
          }, 200)

          skillObserver.unobserve(skillBar)
        }
      })
    },
    { threshold: 0.5 },
  )

  skillBars.forEach((bar) => {
    skillObserver.observe(bar)
  })
}

// Contact form functionality
function initContactForm() {
  const form = document.getElementById("contact-form")
  const submitBtn = form.querySelector('button[type="submit"]')

  form.addEventListener("submit", (e) => {
    e.preventDefault()

    // Clear previous errors
    clearErrors()

    // Validate form
    if (validateForm()) {
      // Show loading state
      submitBtn.classList.add("loading")

      // Simulate form submission
      setTimeout(() => {
        submitBtn.classList.remove("loading")
        showSuccessMessage()
        form.reset()
      }, 2000)
    }
  })

  // Real-time validation
  const inputs = form.querySelectorAll("input, textarea")
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateField(this)
    })

    input.addEventListener("input", function () {
      clearFieldError(this)
    })
  })
}

function validateForm() {
  const name = document.getElementById("name")
  const email = document.getElementById("email")
  const subject = document.getElementById("subject")
  const message = document.getElementById("message")

  let isValid = true

  if (!validateField(name)) isValid = false
  if (!validateField(email)) isValid = false
  if (!validateField(subject)) isValid = false
  if (!validateField(message)) isValid = false

  return isValid
}

function validateField(field) {
  const value = field.value.trim()
  const fieldName = field.name
  let isValid = true
  let errorMessage = ""

  // Required field validation
  if (!value) {
    errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`
    isValid = false
  } else {
    // Specific field validation
    switch (fieldName) {
      case "name":
        if (value.length < 2) {
          errorMessage = "Name must be at least 2 characters"
          isValid = false
        }
        break
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          errorMessage = "Please enter a valid email address"
          isValid = false
        }
        break
      case "subject":
        if (value.length < 5) {
          errorMessage = "Subject must be at least 5 characters"
          isValid = false
        }
        break
      case "message":
        if (value.length < 10) {
          errorMessage = "Message must be at least 10 characters"
          isValid = false
        }
        break
    }
  }

  // Show/hide error
  const errorElement = document.getElementById(`${fieldName}-error`)
  if (!isValid) {
    errorElement.textContent = errorMessage
    field.style.borderColor = "#ff4757"
  } else {
    errorElement.textContent = ""
    field.style.borderColor = "rgba(106, 13, 173, 0.3)"
  }

  return isValid
}

function clearErrors() {
  const errorElements = document.querySelectorAll(".error-message")
  const inputs = document.querySelectorAll("input, textarea")

  errorElements.forEach((error) => (error.textContent = ""))
  inputs.forEach((input) => (input.style.borderColor = "rgba(106, 13, 173, 0.3)"))
}

function clearFieldError(field) {
  const errorElement = document.getElementById(`${field.name}-error`)
  errorElement.textContent = ""
  field.style.borderColor = "rgba(106, 13, 173, 0.3)"
}

function showSuccessMessage() {
  // Create success message
  const successDiv = document.createElement("div")
  successDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #6A0DAD 0%, #8A2BE2 100%);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(106, 13, 173, 0.4);
            z-index: 10000;
            animation: slideInRight 0.5s ease;
        ">
            <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
            Message sent successfully!
        </div>
    `

  document.body.appendChild(successDiv)

  // Remove after 3 seconds
  setTimeout(() => {
    successDiv.remove()
  }, 3000)
}

// Scroll to top functionality
function initScrollToTop() {
  const scrollTopBtn = document.getElementById("scroll-top")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add("visible")
    } else {
      scrollTopBtn.classList.remove("visible")
    }
  })

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })
}

// Utility functions
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

// Add CSS animation for success message
const style = document.createElement("style")
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`
document.head.appendChild(style)

// Console log for debugging
console.log("[v0] Portfolio website loaded successfully")

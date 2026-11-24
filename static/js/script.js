
// =================================
// NEXASPEND
// JavaScript interactions
// =================================


// =================================
// 1. THEME SWITCHER
// =================================

const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    if (themeIcon) {
        themeIcon.innerHTML = theme === "light"
            ? '<path d="M20 15.3A9 9 0 1 1 8.7 4a7 7 0 0 0 11.3 11.3Z"/>'
            : '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
    }

    if (themeToggle) {
        themeToggle.setAttribute(
            "aria-label",
            theme === "light"
                ? "Switch to dark theme"
                : "Switch to light theme"
        );
    }

    const themeColor = document.querySelector(
        'meta[name="theme-color"]'
    );

    if (themeColor) {
        themeColor.setAttribute(
            "content",
            theme === "light" ? "#f5f7fb" : "#0b1220"
        );
    }

    localStorage.setItem("nexaspend-theme", theme);
}


// Load saved theme
const savedTheme = localStorage.getItem("nexaspend-theme") || "dark";
applyTheme(savedTheme);


// Toggle theme
if (themeToggle) {
    themeToggle.addEventListener("click", function () {
        const currentTheme =
            document.documentElement.getAttribute("data-theme") || "dark";

        const newTheme =
            currentTheme === "dark" ? "light" : "dark";

        applyTheme(newTheme);
    });
}


// =================================
// 2. DEFAULT TRANSACTION DATE
// =================================

const dateInput = document.getElementById("date");

if (dateInput && !dateInput.value) {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    dateInput.value = `${year}-${month}-${day}`;
}


// =================================
// 3. MOBILE SIDEBAR CONTROLS
// =================================

const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");
const sidebarClose = document.getElementById("sidebar-close");


function closeSidebar() {
    if (sidebar) {
        sidebar.classList.remove("open");
        if (window.innerWidth <= 1050) {
            sidebar.setAttribute("aria-hidden", "true");
        } else {
            sidebar.setAttribute("aria-hidden", "false");
        }
    }

    if (sidebarOverlay) {
        sidebarOverlay.classList.remove("show");
    }

    document.body.classList.remove("drawer-open");

    if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
    }
}


if (menuToggle && sidebar && sidebarOverlay) {

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-controls", "sidebar");
    sidebar.setAttribute(
        "aria-hidden",
        String(window.innerWidth <= 1050)
    );

    menuToggle.addEventListener("click", function () {
        const isOpen = sidebar.classList.toggle("open");

        sidebarOverlay.classList.toggle("show", isOpen);
        document.body.classList.toggle("drawer-open", isOpen);
        sidebar.setAttribute("aria-hidden", String(!isOpen));

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        if (isOpen && sidebarClose) {
            sidebarClose.focus();
        }
    });

    sidebarOverlay.addEventListener("click", closeSidebar);

    if (sidebarClose) {
        sidebarClose.addEventListener("click", closeSidebar);
    }

    const navigationLinks = sidebar.querySelectorAll(".nav-link, .brand");

    navigationLinks.forEach(function (link) {
        link.addEventListener("click", closeSidebar);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && sidebar.classList.contains("open")) {
            closeSidebar();
            menuToggle.focus();
        }
    });

    // Close the mobile sidebar when returning to desktop
    window.addEventListener("resize", function () {
        if (window.innerWidth > 1050) {
            closeSidebar();
        } else if (!sidebar.classList.contains("open")) {
            sidebar.setAttribute("aria-hidden", "true");
        }
    });
}

/* ==========================================================================
   BLS Laptop Service Website - Interactive Logic & Functionality
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Vector Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Navigation Header Scroll Effect
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Mobile Navigation Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const menuIcon = mobileMenuToggle.querySelector('.menu-icon');
    const closeIcon = mobileMenuToggle.querySelector('.close-icon');

    function toggleMobileMenu() {
        const isHidden = mobileNav.classList.contains('hidden');
        if (isHidden) {
            mobileNav.classList.remove('hidden');
            menuIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Stop background scrolling
        } else {
            mobileNav.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }

    mobileMenuToggle.addEventListener('click', toggleMobileMenu);

    // Close mobile nav when clicking any link
    const mobileLinks = document.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
            document.body.style.overflow = '';
        });
    });

    // 4. Scroll Active State Navigation Link Indicators
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= (sectionTop - 120)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // 5. Services Tab Switcher (Laptop vs. Mobile)
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active states
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Set active clicked tab
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // 6. Refurbished Shop/Sales Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Set active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // 7. Cost Estimator Database
    const estimatorData = {
        laptop: {
            brands: ['Dell', 'HP', 'Lenovo', 'Apple (MacBook)', 'Asus', 'Acer', 'MSI', 'Samsung', 'Other Brand'],
            issues: [
                { id: 'slow', text: 'Slow Speed / OS Reinstallation', min: 800, max: 1200, time: '2-3 Hours' },
                { id: 'upgrade', text: 'SSD & RAM Upgrades (Speed Tune)', min: 2500, max: 4500, time: '1 Hour' },
                { id: 'keyboard', text: 'Sticking Keys / Keyboard Failure', min: 1500, max: 3000, time: '2 Hours' },
                { id: 'screen', text: 'Broken Display Screen / Lines', min: 3500, max: 7500, time: '1-2 Hours' },
                { id: 'battery', text: 'Fast Drainage / Battery Swap', min: 1800, max: 3500, time: '1 Hour' },
                { id: 'chip', text: 'Dead / Water Damaged Board Repair', min: 2500, max: 6500, time: '24-48 Hours' },
                { id: 'charger', text: 'Charging Port DC Jack / Charger adapter', min: 800, max: 1500, time: '1 Hour' },
                { id: 'general', text: 'Other General Fault Diagnostics', min: 400, max: 800, time: '1-2 Hours' }
            ]
        },
        mobile: {
            brands: ['Samsung', 'Apple (iPhone)', 'OnePlus', 'Xiaomi / Redmi', 'Realme', 'Vivo', 'Oppo', 'Google Pixel', 'Other Brand'],
            issues: [
                { id: 'screen', text: 'Cracked Glass / Black Spots Display', min: 1800, max: 6500, time: '1-2 Hours' },
                { id: 'battery', text: 'Fast Battery Discharge Replacement', min: 999, max: 2200, time: '30 Mins' },
                { id: 'port', text: 'Charging Port Loose / Slow Charge', min: 500, max: 1200, time: '1 Hour' },
                { id: 'logo', text: 'Software Crash / Hanging / Boot Loop', min: 600, max: 1200, time: '2 Hours' },
                { id: 'camera', text: 'Camera / Speaker / Microphone faults', min: 800, max: 1800, time: '1 Hour' },
                { id: 'board', text: 'Water Damage / Dead Power Repair', min: 1500, max: 3500, time: '24 Hours' },
                { id: 'general', text: 'General Checkup & Diagnostics', min: 300, max: 600, time: '1 Hour' }
            ]
        }
    };

    // DOM Elements for Estimator
    const deviceTypeRadios = document.getElementsByName('device_type');
    const brandSelect = document.getElementById('device-brand');
    const issueSelect = document.getElementById('device-issue');
    const priceText = document.getElementById('est-price');
    const timeText = document.getElementById('est-time');

    // Populate selects based on device type
    function updateSelectors() {
        let selectedDevice = 'laptop';
        for (const radio of deviceTypeRadios) {
            if (radio.checked) {
                selectedDevice = radio.value;
                // Add active visual state to parent label wrapper
                radio.closest('.device-radio-label').classList.add('active');
            } else {
                radio.closest('.device-radio-label').classList.remove('active');
            }
        }

        const data = estimatorData[selectedDevice];

        // Populate Brands
        brandSelect.innerHTML = '';
        data.brands.forEach(brand => {
            const opt = document.createElement('option');
            opt.value = brand;
            opt.textContent = brand;
            brandSelect.appendChild(opt);
        });

        // Populate Issues
        issueSelect.innerHTML = '';
        data.issues.forEach(issue => {
            const opt = document.createElement('option');
            opt.value = issue.id;
            opt.textContent = issue.text;
            issueSelect.appendChild(opt);
        });

        calculateEstimate();
    }

    // Calculate real-time estimated ranges
    function calculateEstimate() {
        let selectedDevice = 'laptop';
        for (const radio of deviceTypeRadios) {
            if (radio.checked) selectedDevice = radio.value;
        }

        const selectedIssueId = issueSelect.value;
        const issuesList = estimatorData[selectedDevice].issues;
        const matchedIssue = issuesList.find(issue => issue.id === selectedIssueId);

        if (matchedIssue) {
            // Render cost range & duration
            priceText.textContent = `₹${matchedIssue.min.toLocaleString('en-IN')} - ₹${matchedIssue.max.toLocaleString('en-IN')}`;
            timeText.textContent = matchedIssue.time;
        }
    }

    // Add event listeners to radio change options
    for (const radio of deviceTypeRadios) {
        radio.addEventListener('change', updateSelectors);
    }
    issueSelect.addEventListener('change', calculateEstimate);

    // Initial load call to set up the default selectors
    updateSelectors();

    // 8. Booking Form Details Accordion Switcher
    const toggleBookingBtn = document.getElementById('toggle-booking-fields');
    const bookingDetailsBlock = document.getElementById('booking-details-block');
    const serviceOptionRadios = document.getElementsByName('service_option');
    const pickupAddress = document.getElementById('pickup-address');
    const pickupLabel = document.querySelector('.label-pickup');

    toggleBookingBtn.addEventListener('click', () => {
        bookingDetailsBlock.classList.toggle('open');
        if (bookingDetailsBlock.classList.contains('open')) {
            toggleBookingBtn.innerHTML = '<i data-lucide="chevron-up"></i> Hide Booking Form';
            bookingDetailsBlock.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            toggleBookingBtn.innerHTML = '<i data-lucide="calendar"></i> Book Repair Slot / Pickup';
        }
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });

    // Check service collection options (Home Pickup details toggle)
    serviceOptionRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            // Apply active class to selected options card
            serviceOptionRadios.forEach(r => r.closest('.option-card').classList.remove('active'));
            radio.closest('.option-card').classList.add('active');

            if (radio.value === 'home_pickup') {
                pickupAddress.classList.remove('hidden');
                pickupLabel.classList.remove('hidden');
                pickupAddress.required = true;
            } else {
                pickupAddress.classList.add('hidden');
                pickupLabel.classList.add('hidden');
                pickupAddress.required = false;
            }
        });
    });

    // 9. Booking Submission & WhatsApp URL Generator
    const quoteForm = document.getElementById('quote-form');

    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get Client Fields
        const nameVal = document.getElementById('cust-name').value.trim();
        const phoneVal = document.getElementById('cust-phone').value.trim();

        if (!nameVal || !phoneVal) {
            alert('Please fill in your Name and 10-digit Phone Number to complete the request.');
            return;
        }

        // Validate phone format
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phoneVal)) {
            alert('Please enter a valid 10-digit Indian phone number.');
            return;
        }

        // Retrieve Selection Info
        let selectedDevice = 'laptop';
        for (const radio of deviceTypeRadios) {
            if (radio.checked) selectedDevice = radio.value;
        }
        const brandVal = brandSelect.value;
        const issueTextVal = issueSelect.options[issueSelect.selectedIndex].text;
        const estPriceVal = priceText.textContent;

        let selectedOption = 'Store Walk-in';
        let isPickup = false;
        for (const opt of serviceOptionRadios) {
            if (opt.checked) {
                selectedOption = opt.value === 'home_pickup' ? 'Home Pickup' : 'Store Walk-in';
                isPickup = opt.value === 'home_pickup';
            }
        }

        const addressVal = pickupAddress.value.trim();

        // Build pre-filled WhatsApp text
        let message = `Hi BLS Laptop Service!\n\n`;
        message += `I would like to book a repair service slot:\n`;
        message += `• *Device:* ${selectedDevice.toUpperCase()}\n`;
        message += `• *Brand:* ${brandVal}\n`;
        message += `• *Issue:* ${issueTextVal}\n`;
        message += `• *Est. Price:* ${estPriceVal}\n\n`;
        message += `*Customer Details:*\n`;
        message += `• *Name:* ${nameVal}\n`;
        message += `• *Phone:* ${phoneVal}\n`;
        message += `• *Service Type:* ${selectedOption}\n`;

        if (isPickup && addressVal) {
            message += `• *Pickup Address:* ${addressVal}\n`;
        }

        // Encode and redirect to WhatsApp link
        const whatsappNumber = '919789860286';
        const finalUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        
        window.open(finalUrl, '_blank');
    });
});

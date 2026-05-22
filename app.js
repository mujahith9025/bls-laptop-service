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

    // Deep-linking: Auto-select tab from query string parameter on services.html
    const urlParams = new URLSearchParams(window.location.search);
    const activeTabParam = urlParams.get('tab');
    if (activeTabParam && (activeTabParam === 'laptop' || activeTabParam === 'mobile')) {
        const targetTabId = activeTabParam === 'laptop' ? 'laptop-services' : 'mobile-services';
        const targetBtn = document.querySelector(`.tab-btn[data-tab="${targetTabId}"]`);
        if (targetBtn) {
            // Remove active states from all buttons and tabs
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Activate target
            targetBtn.classList.add('active');
            const targetContent = document.getElementById(targetTabId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        }
    }

    // 6. Interactive Customer Reviews & Feedback Form
    const starSelector = document.getElementById('interactive-star-selector');
    const interactiveStars = document.querySelectorAll('.interactive-star');
    const ratingHint = document.getElementById('rating-hint');
    const reviewForm = document.getElementById('customer-review-form');
    const reviewsFeedList = document.getElementById('reviews-feed-list');
    const reviewInputState = document.getElementById('review-input-state');
    const reviewSuccessState = document.getElementById('review-success-state');
    const successClientName = document.getElementById('success-client-name');
    const copiedReviewText = document.getElementById('copied-review-text');
    const btnCopyReview = document.getElementById('btn-copy-review');
    const copyStatusTxt = document.getElementById('copy-status-txt');
    const btnWriteAnother = document.getElementById('btn-write-another');

    let selectedRating = 5; // Default rating is 5 stars

    const ratingDescriptions = {
        1: '1 Star - Very Poor / Disappointed',
        2: '2 Stars - Poor / Needs Improvement',
        3: '3 Stars - Average Service',
        4: '4 Stars - Good / Satisfied',
        5: '5 Stars - Excellent / Highly Recommended!'
    };

    // Update Star Visuals based on Rating
    function updateStarsDisplay(rating, isHover = false) {
        interactiveStars.forEach(star => {
            const starValue = parseInt(star.getAttribute('data-rating'));
            if (isHover) {
                if (starValue <= rating) {
                    star.classList.add('hovered');
                } else {
                    star.classList.remove('hovered');
                }
            } else {
                if (starValue <= rating) {
                    star.classList.add('selected');
                } else {
                    star.classList.remove('selected');
                }
            }
        });
    }

    // Set Initial Stars (All 5 selected)
    updateStarsDisplay(selectedRating);

    // Star Hover & Click Listeners
    interactiveStars.forEach(star => {
        const ratingValue = parseInt(star.getAttribute('data-rating'));

        // Mouse Hover In
        star.addEventListener('mouseover', () => {
            updateStarsDisplay(ratingValue, true);
            ratingHint.textContent = ratingDescriptions[ratingValue];
        });

        // Mouse Hover Out
        star.addEventListener('mouseout', () => {
            interactiveStars.forEach(s => s.classList.remove('hovered'));
            ratingHint.textContent = ratingDescriptions[selectedRating] || 'Tap a star to rate';
        });

        // Click Star
        star.addEventListener('click', () => {
            selectedRating = ratingValue;
            // Remove selected classes from all first
            interactiveStars.forEach(s => s.classList.remove('selected'));
            // Apply selected classes up to selectedRating
            updateStarsDisplay(selectedRating);
            ratingHint.textContent = ratingDescriptions[selectedRating];
        });
    });

    // Form Submission Handler
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('rev-name');
            const contentInput = document.getElementById('rev-content');

            const clientName = nameInput.value.trim();
            const reviewContent = contentInput.value.trim();

            if (!clientName || !reviewContent) {
                alert('Please fill in your name and write a review.');
                return;
            }

            // 1. Prepend dynamic review to list
            // Generate initials
            const nameParts = clientName.split(' ');
            let initials = '';
            if (nameParts.length > 1) {
                initials = (nameParts[0][0] + nameParts[1][0]).toUpperCase();
            } else if (nameParts.length === 1 && nameParts[0].length > 0) {
                initials = nameParts[0].slice(0, 2).toUpperCase();
            } else {
                initials = 'CU';
            }

            // Assign color class based on initials code to vary avatars harmoniously
            const avatarColorClasses = ['avatar-orange', 'avatar-blue', 'avatar-purple'];
            const charCodeSum = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0);
            const avatarClass = avatarColorClasses[charCodeSum % avatarColorClasses.length];

            // Build Star HTML dynamically
            let starHTML = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= selectedRating) {
                    starHTML += `<i data-lucide="star" class="star-filled"></i> `;
                } else {
                    starHTML += `<i data-lucide="star" style="color: var(--text-muted); fill: none; width: 14px; height: 14px;"></i> `;
                }
            }

            // Create New Review Card
            const newCard = document.createElement('div');
            newCard.className = 'review-card glass-panel';
            newCard.style.opacity = '0';
            newCard.style.transform = 'translateY(15px)';
            newCard.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            
            newCard.innerHTML = `
                <div class="review-card-header">
                    <div class="reviewer-profile">
                        <div class="reviewer-avatar ${avatarClass}">${initials}</div>
                        <div class="reviewer-meta">
                            <h4>${clientName}</h4>
                            <span class="review-date">Just now</span>
                        </div>
                    </div>
                    <div class="review-card-stars">
                        ${starHTML}
                    </div>
                </div>
                <p class="review-text">${reviewContent}</p>
                <div class="review-card-footer">
                    <span class="platform-info"><i data-lucide="map-pin"></i> Local Reviewer</span>
                    <span class="recommend-badge"><i data-lucide="thumbs-up"></i> Verified Customer</span>
                </div>
            `;

            // Prepend new review card
            reviewsFeedList.insertBefore(newCard, reviewsFeedList.firstChild);

            // Re-render Lucide Vector Icons in the prepended elements
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            // Smooth fade-in animation
            setTimeout(() => {
                newCard.style.opacity = '1';
                newCard.style.transform = 'translateY(0)';
            }, 50);

            // 2. Clipboard Sync Auto-Copy
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(reviewContent).catch(err => {
                    console.warn('Auto-copy failed: ', err);
                });
            }

            // 3. Switch Form block to Success State Screen
            successClientName.textContent = clientName;
            copiedReviewText.textContent = reviewContent;

            // Animate states
            reviewInputState.style.display = 'none';
            reviewSuccessState.classList.add('active');

            // Scroll success block into viewport nicely
            document.getElementById('customer-feedback-container').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    // Manual Copy Button functionality in Success State
    if (btnCopyReview) {
        btnCopyReview.addEventListener('click', () => {
            const textToCopy = copiedReviewText.textContent;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    btnCopyReview.classList.add('copied');
                    copyStatusTxt.textContent = 'Copied!';
                    setTimeout(() => {
                        btnCopyReview.classList.remove('copied');
                        copyStatusTxt.textContent = 'Copy Review Text';
                    }, 2500);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            } else {
                // Fallback copy
                const textarea = document.createElement('textarea');
                textarea.value = textToCopy;
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    btnCopyReview.classList.add('copied');
                    copyStatusTxt.textContent = 'Copied!';
                    setTimeout(() => {
                        btnCopyReview.classList.remove('copied');
                        copyStatusTxt.textContent = 'Copy Review Text';
                    }, 2500);
                } catch (err) {
                    alert('Could not copy text automatically. Please select and copy manually.');
                }
                document.body.removeChild(textarea);
            }
        });
    }

    // Write Another Review resetting form
    if (btnWriteAnother) {
        btnWriteAnother.addEventListener('click', () => {
            if (reviewForm) {
                reviewForm.reset();
            }
            selectedRating = 5;
            updateStarsDisplay(selectedRating);
            ratingHint.textContent = 'Tap a star to rate';

            reviewSuccessState.classList.remove('active');
            reviewInputState.style.display = 'block';
        });
    }

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

    // Only execute cost estimator logic if the elements exist in the DOM (e.g. index.html)
    if (brandSelect && issueSelect && deviceTypeRadios.length > 0) {
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
    }

    // 8. Booking Form Details Accordion Switcher
    const toggleBookingBtn = document.getElementById('toggle-booking-fields');
    const bookingDetailsBlock = document.getElementById('booking-details-block');
    const serviceOptionRadios = document.getElementsByName('service_option');
    const pickupAddress = document.getElementById('pickup-address');
    const pickupLabel = document.querySelector('.label-pickup');

    if (toggleBookingBtn && bookingDetailsBlock) {
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
    }

    // 9. Booking Submission & WhatsApp URL Generator
    const quoteForm = document.getElementById('quote-form');

    if (quoteForm) {
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
    }
});

# IMPLEMENTATION GUIDE - Dark Mode + Photo Upload

## ✅ ALREADY DONE:
1. ✅ Updated homepage projects to match projects page
2. ✅ Added dark mode toggle button to navigation

## 🔧 TODO - Add These Files:

### 1. Update CSS (add to end of css/style.css):

```css
/* Dark Mode Styles */
:root.dark-mode {
    --bg-primary: #0f0f0f;
    --bg-secondary: #1a1a1a;
    --bg-tertiary: #242424;
    --text-primary: #ffffff;
    --text-secondary: #b3b3b3;
    --text-tertiary: #6b6b6b;
    --border: rgba(255, 255, 255, 0.1);
}

/* Theme Toggle Button */
.nav-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.theme-toggle {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    position: relative;
    width: 40px;
    height: 40px;
}

.theme-toggle:hover {
    background: var(--bg-tertiary);
    border-color: var(--primary);
}

.theme-toggle svg {
    position: absolute;
    transition: all 0.3s ease;
}

.sun-icon {
    opacity: 1;
    transform: rotate(0deg) scale(1);
}

.moon-icon {
    opacity: 0;
    transform: rotate(90deg) scale(0);
}

:root.dark-mode .sun-icon {
    opacity: 0;
    transform: rotate(90deg) scale(0);
}

:root.dark-mode .moon-icon {
    opacity: 1;
    transform: rotate(0deg) scale(1);
}

/* Profile Photo Upload */
.profile-avatar #photo {
    display: block;
}

.avatar-placeholder {
    font-size: 64px;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.avatar-placeholder:hover {
    transform: scale(1.1);
}

.profile-avatar img#profilePhoto {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
}

.project-link-small {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--primary);
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
    margin-top: 0.75rem;
    transition: all 0.3s ease;
}

.project-link-small:hover {
    color: var(--primary-dark);
    transform: translateX(4px);
}
```

### 2. Update JavaScript (add to js/main.js):

```javascript
// Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
html.classList.toggle('dark-mode', savedTheme === 'dark');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark-mode');
        const theme = html.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });
}

// Profile Photo Upload
const photoInput = document.getElementById('photoUpload');
const profilePhoto = document.getElementById('profilePhoto');
const avatarPlaceholder = document.querySelector('.avatar-placeholder');

if (photoInput) {
    // Load saved photo
    const savedPhoto = localStorage.getItem('profilePhoto');
    if (savedPhoto) {
        if (!profilePhoto) {
            const img = document.createElement('img');
            img.id = 'profilePhoto';
            img.src = savedPhoto;
            img.alt = 'Profile Photo';
            document.querySelector('.profile-avatar').appendChild(img);
            if (avatarPlaceholder) avatarPlaceholder.style.display = 'none';
        } else {
            profilePhoto.src = savedPhoto;
        }
    }

    // Handle photo upload
    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imgData = event.target.result;
                localStorage.setItem('prof ilePhoto', imgData);
                
                if (!profilePhoto) {
                    const img = document.createElement('img');
                    img.id = 'profilePhoto';
                    img.src = imgData;
                    img.alt = 'Profile Photo';
                    document.querySelector('.profile-avatar').appendChild(img);
                    if (avatarPlaceholder) avatarPlaceholder.style.display = 'none';
                } else {
                    profilePhoto.src = imgData;
                }
            };
            reader.readAsDataURL(file);
        }
    });

    // Click placeholder to upload
    if (avatarPlaceholder) {
        avatarPlaceholder.addEventListener('click', () => {
            photoInput.click();
        });
    }
    
    // Click photo to change
    if (profilePhoto) {
        profilePhoto.addEventListener('click', () => {
            photoInput.click();
        });
    }
}
```

### 3. Update about.html profile section (replace lines 53-55):

```html
<div class="profile-avatar">
    <input type="file" id="photoUpload" accept="image/*" style="display: none;">
    <span class="avatar-placeholder" onclick="document.getElementById('photoUpload').click()">📸</span>
</div>
```

## 🚀 DEPLOYMENT:
Once you make these changes, push to GitHub and your website will have:
1. ✅ Working dark mode toggle
2. ✅ Profile photo upload
3. ✅ Matching projects on homepage and projects page

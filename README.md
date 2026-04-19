# JS2-march25
## Demo Account

To test the application without registering:

Email: mia-demo@stud.noroff.no  
Password: Demo123!

You can also register your own Noroff account if preferred.
# Social Media App (JS2)

A front-end social media application built using vanilla JavaScript (ES6 modules) and the Noroff v2 API.

The application allows users to register, log in, create posts, view a global feed, interact with posts, and manage their profile. The focus of the project is clean architecture, modular JavaScript, accessibility, and API integration.

## Features

- User authentication (register/login)
- View global post feed
- Create, edit, and delete posts
- View single post
- Follow and unfollow users
- Responsive layout (desktop + mobile)
- Search functionality (if implemented)
- Error handling and loading states

## Tech Stack

- HTML5
- CSS3 (modular structure with variables)
- JavaScript (ES6 modules)
- Noroff v2 API
- Git & GitHub
- GitHub Pages (deployment)

## How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/miastubb/JS2-march25.git

   
---

## 5. Deployment + Repo Links (REQUIRED)

```md
## Live Demo

Deployed site:
https://miastubb.github.io/JS2-march25/

GitHub repository:
https://github.com/miastubb/JS2-march25

## Project Structure
The project follows a modular structure:

- `/js/api` → API communication (auth, posts, profiles)
- `/js/auth` → login, register, auth guard
- `/js/components` → reusable UI components
- `/js/pages` → page-specific logic
- `/js/storage` → local storage handling
- `/js/utils` → helper functions
- `/css` → global, components, and page styles

This structure follows the DRY principle and improves maintainability.

## Known Issues / Future Improvements

- Minor Lighthouse "Best Practices" warnings due to external image sources
- Potential UX refinements for mobile sidebar interactions
- Additional features such as comments and reactions can be expanded further

## Author

Mia Stubb-Olsen

- GitHub: https://github.com/miastubb
- LinkedIn: https://www.linkedin.com/in/mia-s-76a6a8233/
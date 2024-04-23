# Instagram VueJs Clone

This Instagram frontend clone is a feature-rich web application built with Vue.js, leveraging Vue 3 with the Composition API and Typescript. It offers a range of functionalities similar to the original Instagram platform, including user authentication, profile management, post creation, tagging, searching, and more.

**Note:** This frontend is designed to be used alongside my Instagram DRF (Django Rest Framework) backend, providing a seamless integration between the frontend and backend components of the Instagram-like platform.

## Stack Used

1. **Vue 3**: Utilizing the Composition API with Typescript for efficient and scalable code.
2. **Vue Router**: For client-side routing, enabling navigation between pages.
3. **Pinia**: State management library for managing application state with ease.

## App Features

### Common

- **Axios Integration**: Utilizes Axios for making HTTP requests to the backend server.
	- **Interceptor**: Implements Axios interceptor to automatically update the authentication token whenever it expires, ensuring seamless communication with the backend.
	- **Token Storage**: Securely stores the refresh token inside a cookie for enhanced security measures.
- **Splash Loading**: Provides a visually appealing loading screen during app initialization.
- **Loading Progress**: Displays loading progress indicators while navigating between pages.
- **Dark Mode**: Offers users the option to switch between light and dark themes for better readability and aesthetics.

### Auth

- **Login / Register**: Allows users to authenticate by logging in or registering for a new account.

### Profile

- **Follow / Unfollow**: Enables users to follow or unfollow other users.
- **Real-time Updates**: Updates follower/following counts in real-time.
- **Profile Modification**: Allows users to modify their profile information and profile picture.
- **Modal View**: Displays modal dialogs for viewing followers and followings.

### Post

- **Fullsize Modal**: Utilizes a second Routerview for displaying full-size post modals.
- **Interactions**: Allows users to like, save, comment, and reply to posts.
- **Reply Handling**: _TODO_: Implement functionality to handle replies to replies.
- **Modal View**: Displays modal dialogs for viewing users who liked a post.

### Tag

- **Post Tagging**: Allows users to see every post under the same tag for easy content discovery.

### Search

- **Real-time Search**: Enables users to search through profiles in real-time for quick and efficient navigation.
- **Search Enhancements**: _TODO_: Extend search functionality to include posts and tags.

### Create Post

- **Image Editing**: Offers users the ability to choose image ratios (original, 1:1, 4:5, or 16:9), resize, crop, apply filters, and adjust image positions.
- **Captioning**: Provides a text input field for users to write captions with emojis.
- **Tagging**: Allows users to add multiple tags to their posts for better categorization and discovery.

## Getting Started

To get started with this Instagram frontend clone, follow these steps:

1. Clone the repository to your local machine.
2. Install the required dependencies listed in `package.json`.
3. Configure environment variables for API endpoints and other configurations.
4. Run the development server using `yarn dev`.
5. Access the application through the provided URL.
6. Explore the various features and functionalities of the application.

## Acknowledgments

- Thanks to [duydat2002](https://github.com/duydat2002/instagram-vite) for the inspiration and ideas behind this project. 
  It has provided valuable insights into Vue.js, Vue Router and Pinia, which helped me understand their capabilities and adapt them to create the frontend component of a full-fledged Instagram-like platform.
- Thanks to the Vue.js community for creating such powerful tools and libraries.
- Inspired by the functionality and user experience of the original Instagram platform.

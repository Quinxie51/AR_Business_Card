# AR Business Card

An interactive Augmented Reality business card that displays a 3D model and social media links when scanned. Built with A-Frame and MindAR.

## Features

- 3D Model Animation: Displays an animated 3D model when the card is scanned
- Social Media Integration: Interactive social media icons arranged in a circular pattern
- Background Music: Ambient music that plays when the card is detected
- Cross-device Support: Works on both desktop and mobile devices
- Interactive Elements: Hover effects and click/touch interactions
- Smooth Animations: Delayed appearance and floating animations

## Technologies Used

- A-Frame: Web framework for building VR/AR experiences
- MindAR: Image tracking and AR library
- Three.js: 3D graphics library
- Howler.js: Audio library for background music

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/AR_Business_Card.git
cd AR_Business_Card
```

2. Open the project in a web server:
```bash
# Using Python 3
python -m http.server

# Or using Node.js
npx http-server
```

3. Access the application through a web browser at `http://localhost:8000`

## Usage

1. Open the application on your mobile device or computer with a camera
2. Point the camera at your business card
3. Watch as the 3D model and social media icons appear
4. Click/tap on the social media icons to visit the respective profiles
5. Use the audio control button to toggle background music

## Project Structure

- `code_source/` - Main project directory
  - `index.html` - Main application file
  - `targets.mind` - AR target image data
  - `models/` - 3D model files
  - `audio/` - Background music files
  - `images/` - Social media icons and other images

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

[Your Name]
- LinkedIn: [quyendoan51](https://linkedin.com/in/quyendoan51)
- Portfolio: [quinxiedoan.xyz](https://quinxiedoan.xyz)
- Email: quyendoan51@gmail.com

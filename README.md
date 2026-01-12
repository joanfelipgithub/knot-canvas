# 🪢 Knot Canvas - 3D Parametric Knot Viewer

An interactive 3D web application for visualizing and exploring mathematical knots using parametric equations. Students can create custom knots, visualize them in real-time, and export STL files for 3D printing!

![Knot Canvas](https://img.shields.io/badge/Three.js-Interactive-green) ![Math](https://img.shields.io/badge/MathJS-Parametric-blue)

## ✨ Features

- **Interactive 3D Visualization**: Rotate, pan, and zoom with intuitive mouse controls
- **Preset Knots**: Explore classic mathematical knots (Trefoil, Figure-8, Cinquefoil, Torus, Lissajous)
- **Custom Formulas**: Define your own parametric equations using mathematical expressions
- **Render Modes**: View as lines or solid tubes
- **STL Export**: Download 3D-printable models of your knots! 🖨️
- **Real-time Updates**: See changes instantly as you modify parameters

## 🎮 Controls

- **Left Click + Drag**: Rotate the view
- **Right Click + Drag**: Pan the camera
- **Scroll Wheel**: Zoom in/out

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/YOUR-USERNAME/knot-canvas.git
cd knot-canvas
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized files will be in the `dist/` directory.

## 📝 How to Use

### Preset Knots

1. Select a preset from the dropdown menu
2. Click "Update Knot" to visualize
3. Adjust parameters (color, samples, tube radius)

### Custom Formulas

1. Select "Custom Formula" from the preset dropdown
2. Enter three parametric equations for X(t), Y(t), and Z(t)
3. Use `t` as the parameter (ranges from 0 to 2π)
4. Available functions: `sin`, `cos`, `tan`, `sqrt`, `abs`, `pow`, `exp`, `log`
5. Available constants: `pi`, `e`, `i` (imaginary unit)

**Example Custom Formula:**
```
X(t) = sin(t) + 2*sin(2*t)
Y(t) = cos(t) - 2*cos(2*t)
Z(t) = -sin(3*t)
```

### 3D Printing

1. Switch to "Tube (3D)" render mode
2. Adjust tube radius for your printer's capabilities
3. Click "📥 Download STL for 3D Printing"
4. Use your slicer software (Cura, PrusaSlicer, etc.) to prepare for printing

## 🌐 Deploy to Cloudflare Pages

### Method 1: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. Go to **Workers & Pages** → **Create Application** → **Pages**
4. Connect your GitHub account
5. Select your `knot-canvas` repository
6. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
7. Click **Save and Deploy**

Your app will be live at `https://knot-canvas.pages.dev` (or your custom domain)!

### Method 2: Direct Upload via PowerShell

If you prefer to deploy directly without GitHub integration:

```powershell
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build the project
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy dist --project-name=knot-canvas
```

## 📚 Educational Use

This project is perfect for:

- **Mathematics Classes**: Visualizing parametric equations and topology
- **3D Printing Workshops**: Creating custom mathematical models
- **Geometry & Calculus**: Understanding curves in 3D space
- **STEM Projects**: Combining programming, math, and physical fabrication

### Teaching Ideas

1. **Explore Mathematical Concepts**: Have students derive formulas for different knot types
2. **Parameter Investigation**: Change coefficients and observe the effects
3. **3D Printing Challenge**: Print and compare different knot complexities
4. **Custom Creations**: Students design their own mathematical knots

## 🛠️ Technology Stack

- **Three.js**: 3D rendering and visualization
- **MathJS**: Mathematical expression parsing and evaluation
- **Vite**: Fast build tool and development server
- **Vanilla JavaScript**: No framework overhead, pure performance

## 📦 Project Structure

```
knot-canvas/
├── index.html          # Main HTML file
├── main.js            # Application logic and Three.js setup
├── style.css          # UI styling
├── package.json       # Dependencies and scripts
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Add new preset knots
- Improve the UI/UX
- Add new features (animations, sharing, etc.)
- Fix bugs or optimize performance

## 📄 License

MIT License - feel free to use this project for educational purposes!

## 🙏 Acknowledgments

- Built with [Three.js](https://threejs.org/)
- Math parsing by [MathJS](https://mathjs.org/)
- Inspired by mathematical knot theory and topology

---

**Happy Knot Creating! 🪢**

For questions or issues, please open an issue on GitHub.

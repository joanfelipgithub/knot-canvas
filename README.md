# 🪢 Knot Canvas

A 3D parametric knot visualization tool built with Three.js. View, rotate, and explore mathematical knots in your browser.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

### 3. Open in Browser

Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 🎮 Controls

- **Left-click + drag**: Rotate the view
- **Right-click + drag**: Pan the camera
- **Scroll wheel**: Zoom in/out

## 📐 Knot Formulas

The project includes several parametric knot equations. You can switch between them by modifying `main.js`.

### Current: Trefoil Knot

```javascript
x = sin(t) + 2*sin(2*t)
y = cos(t) - 2*cos(2*t)
z = -sin(3*t)
```

### Figure-8 Knot

```javascript
x = (2 + cos(2*t)) * cos(3*t)
y = (2 + cos(2*t)) * sin(3*t)
z = sin(4*t)
```

### Cinquefoil Knot (5-fold symmetry)

```javascript
x = sin(2*t) * (2 + cos(5*t))
y = cos(2*t) * (2 + cos(5*t))
z = sin(5*t)
```

### Torus Knot (5,3)

```javascript
x = cos(3*t) * (2 + cos(5*t))
y = sin(3*t) * (2 + cos(5*t))
z = sin(5*t)
```

### Lissajous Knot

```javascript
x = cos(3*t)
y = cos(4*t)
z = cos(7*t)
```

### Spiral Torus Knot

```javascript
x = (2 + cos(5*t)) * cos(2*t)
y = (2 + cos(5*t)) * sin(2*t)
z = sin(5*t) + 0.5*t
```

## 🛠️ Customization

### Switch to Tube Rendering

For a thicker, more 3D appearance, uncomment the "TUBE GEOMETRY" section in `main.js`:

```javascript
const curve = new THREE.CatmullRomCurve3(knotPoints);
const tubeGeometry = new THREE.TubeGeometry(
  curve,
  1000,  // tubular segments
  0.15,  // radius (adjust for thickness)
  16,    // radial segments
  true   // closed
);
const tubeMaterial = new THREE.MeshPhongMaterial({
  color: 0xff6633,
  shininess: 80,
  specular: 0x444444
});
const knotTube = new THREE.Mesh(tubeGeometry, tubeMaterial);
scene.add(knotTube);
```

### Adjust Sampling Resolution

Increase or decrease the number of points for smoother/faster rendering:

```javascript
const knotPoints = generateKnotPoints(trefoilKnot, 2000); // Higher = smoother
```

### Change Colors

Modify the material colors in `main.js`:

```javascript
const curveMaterial = new THREE.LineBasicMaterial({ 
  color: 0xff6633, // Change this hex color
  linewidth: 2 
});
```

## 📦 Project Structure

```
knot-canvas/
├── index.html      # Main HTML file
├── main.js         # Three.js scene and knot rendering
├── style.css       # Minimal styling
├── package.json    # Dependencies and scripts
└── README.md       # This file
```

## 🔧 Dependencies

- **three**: 3D graphics library
- **mathjs**: Mathematical expression parser (for future enhancements)
- **vite**: Fast development server and build tool

## 🎯 Next Steps

1. **Add UI controls**: Input fields for custom parametric equations
2. **Math parsing**: Use mathjs to parse user-input formulas
3. **Export functionality**: Generate STL files for 3D printing
4. **Animation**: Animate parameter `t` to show knot formation
5. **Presets**: Add dropdown menu with common knots
6. **Color schemes**: Add multiple color options
7. **Lighting controls**: Adjust scene lighting interactively

## 📚 Learn More

- [Three.js Documentation](https://threejs.org/docs/)
- [Parametric Equations](https://en.wikipedia.org/wiki/Parametric_equation)
- [Knot Theory](https://en.wikipedia.org/wiki/Knot_theory)

## 🤝 Contributing

Feel free to fork this project and add your own knot formulas or features!

## 📄 License

MIT

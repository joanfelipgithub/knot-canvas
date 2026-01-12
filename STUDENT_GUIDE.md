# 🪢 Student Quick Start Guide

Welcome to the Knot Canvas! This tool lets you visualize and 3D print mathematical knots.

## 🎮 Basic Controls

### Mouse Controls
- **Rotate**: Left click + drag
- **Pan**: Right click + drag  
- **Zoom**: Scroll wheel

### Creating Knots

#### 1. Try a Preset Knot
1. Select a preset from the dropdown (e.g., "Trefoil Knot")
2. Click "Update Knot"
3. Explore it in 3D!

#### 2. Customize Your Knot
- **Color**: Click the color picker to change the knot's color
- **Samples**: Higher = smoother curve (but slower)
- **Tube Radius**: Make the knot thicker or thinner
- **Render Mode**: 
  - **Line**: Fast, wireframe view
  - **Tube (3D)**: Solid object, ready for 3D printing!

#### 3. Create Custom Formulas

Select "Custom Formula" and enter three equations:

**Format:**
```
X(t) = your formula here
Y(t) = your formula here
Z(t) = your formula here
```

**Available Functions:**
- Trigonometry: `sin(t)`, `cos(t)`, `tan(t)`
- Math: `sqrt(x)`, `abs(x)`, `pow(x, y)`, `exp(x)`, `log(x)`
- Constants: `pi`, `e`

**Example - Heart Shape:**
```
X(t) = sin(t)
Y(t) = cos(t) + 0.5*sin(2*t)
Z(t) = 0.3*sin(3*t)
```

**Tips:**
- The parameter `t` goes from 0 to 2π
- Use * for multiplication: `2*sin(t)` not `2sin(t)`
- Combine functions: `sin(2*t) + cos(3*t)`
- Press **Ctrl+Enter** to quickly update

## 🖨️ 3D Printing Your Knot

### Step 1: Prepare for Export
1. Switch to **Tube (3D)** render mode
2. Adjust tube radius (0.15-0.3 works well for most printers)
3. Make sure your knot looks good!

### Step 2: Download STL
1. Click "📥 Download STL for 3D Printing"
2. Save the file to your computer

### Step 3: Print
1. Open the STL in your slicer software:
   - Ultimaker Cura (free)
   - PrusaSlicer (free)
   - Or your school's slicer
2. Recommended settings:
   - Layer height: 0.2mm
   - Infill: 20%
   - Supports: Usually not needed!
3. Slice and send to your 3D printer

### Print Tips
- **Small knots** (tube radius 0.1-0.15): Print faster, less material
- **Large knots** (tube radius 0.3-0.5): More impressive, easier to handle
- **Orientation**: Lay the knot flat for best results
- **Material**: PLA is easiest, PETG is stronger

## 🎓 Project Ideas

### Beginner Projects
1. **Compare Classic Knots**: Print all 5 presets and compare complexity
2. **Color Study**: Export the same knot with different colors in your slicer
3. **Size Matters**: Print the same knot with different tube radii

### Intermediate Projects
1. **Custom Creation**: Design your own unique knot formula
2. **Symmetry Study**: Create knots with 3-fold, 4-fold, 5-fold symmetry
3. **Lissajous Exploration**: Vary coefficients in `cos(a*t)` patterns

### Advanced Projects
1. **Mathematical Analysis**: Calculate the curve length for different formulas
2. **Topology Study**: Research which knots are topologically equivalent
3. **Knot Invariants**: Explore crossing numbers and other properties

## 📐 Math Behind the Knots

### What is a Parametric Curve?
A parametric curve is defined by three functions of a single parameter `t`:
- X(t) = horizontal position at parameter t
- Y(t) = vertical position at parameter t  
- Z(t) = depth position at parameter t

As `t` varies from 0 to 2π, we trace out a path in 3D space!

### Classic Knot Formulas

**Trefoil Knot** (simplest non-trivial knot):
```
X(t) = sin(t) + 2*sin(2*t)
Y(t) = cos(t) - 2*cos(2*t)
Z(t) = -sin(3*t)
```

**Figure-8 Knot**:
```
X(t) = (2 + cos(2*t)) * cos(3*t)
Y(t) = (2 + cos(2*t)) * sin(3*t)
Z(t) = sin(4*t)
```

### Experiment!
Try changing the coefficients:
- `sin(2*t)` → `sin(3*t)`: Changes the winding number
- `2*sin(t)` → `3*sin(t)`: Changes the amplitude
- Add terms together: `sin(t) + 0.5*sin(3*t)`

## 🆘 Troubleshooting

### The knot doesn't show up
- Check your formulas for typos
- Make sure you use * for multiplication
- Valid example: `2*sin(t)` ✅
- Invalid example: `2sin(t)` ❌

### "Formula error" message
- Check parentheses are balanced: `(2 + cos(t))` not `(2 + cos(t)`
- Use correct function names: `sin` not `Sin` or `SIN`
- Don't forget the multiplication: `2*t` not `2t`

### Export button is disabled
- Switch to "Tube (3D)" render mode
- Line mode cannot be 3D printed!

### Knot looks weird
- Increase the samples slider for smoother curves
- Try different tube radius values
- Some formulas create self-intersecting shapes (that's okay!)

## 🎨 Fun Challenges

1. **Minimal Knot**: Create the simplest possible closed curve
2. **Maximum Complexity**: How complicated can you make it?
3. **Optical Illusion**: Create a knot that looks different from different angles
4. **Symmetry**: Make a perfectly symmetric knot
5. **Nature Inspired**: Create a knot that looks like something in nature

## 📚 Learn More

- **Knot Theory**: Study of mathematical knots
- **Topology**: The branch of math studying shapes and spaces
- **Parametric Equations**: Describing curves with parameters

Have fun creating and printing! 🪢✨

---

Questions? Ask your teacher or explore the README.md file!

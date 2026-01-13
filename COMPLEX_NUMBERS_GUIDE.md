# 🔢 Complex Numbers & Euler's Formula Support

## ✨ New Feature: Complex Number Support!

The formula parser now supports complex numbers and automatically extracts real parts for 3D visualization!

---

## 📐 Available Constants & Variables:

```
t     → Parameter (0 to 2π)
i     → Imaginary unit (√-1)
e     → Euler's number (2.71828...)
pi    → Pi constant (3.14159...)
```

---

## 🎯 Your Original Euler Formulas:

You provided:
```
X(t) = (e^(it) - e^(-it)) / (2i)
Y(t) = e^(it) + e^(-it)
Z(t) = i * (e^(2it) - e^(-2i*t))
```

### ⚠️ Syntax Note:
Replace `it` with `i*t` (mathjs needs explicit multiplication):
```
X(t) = (e^(i*t) - e^(-i*t)) / (2*i)
Y(t) = e^(i*t) + e^(-i*t)
Z(t) = i * (e^(2*i*t) - e^(-2*i*t))
```

### ✅ How It Works:
1. Formula is evaluated (may produce complex result)
2. If result is complex, **real part is automatically extracted**
3. Real coordinates are used for 3D position

---

## 🔄 Equivalent Trigonometric Forms:

Using **Euler's formula**: `e^(i*t) = cos(t) + i*sin(t)`

Your formulas simplify to these **pure real** equivalents:

### Original Complex Form:
```
X(t) = (e^(i*t) - e^(-i*t)) / (2*i)
Y(t) = e^(i*t) + e^(-i*t)
Z(t) = i * (e^(2*i*t) - e^(-2*i*t))
```

### Simplified Trigonometric Form:
```
X(t) = sin(t)
Y(t) = 2*cos(t)
Z(t) = -2*sin(2*t)
```

**Both produce the same 3D curve!** The trigonometric form is simpler and faster.

---

## 🧪 Testing Both Forms:

### Test 1: Complex Form (Now Supported!)
Paste this:
```
X(t) = (e^(i*t) - e^(-i*t)) / (2*i)
Y(t) = e^(i*t) + e^(-i*t)
Z(t) = i * (e^(2*i*t) - e^(-2*i*t))
```

### Test 2: Trigonometric Form (Recommended)
Paste this:
```
X(t) = sin(t)
Y(t) = 2*cos(t)
Z(t) = -2*sin(2*t)
```

Both should produce the **same elliptical curve**!

---

## 📚 Common Euler Conversions:

### Basic Identities:
```
e^(i*t) = cos(t) + i*sin(t)
e^(-i*t) = cos(t) - i*sin(t)

(e^(i*t) - e^(-i*t)) / (2*i) = sin(t)
(e^(i*t) + e^(-i*t)) / 2 = cos(t)
```

### For Your Formulas:

**X(t):**
```
Complex:  (e^(i*t) - e^(-i*t)) / (2*i)
↓
Real:     sin(t)
```

**Y(t):**
```
Complex:  e^(i*t) + e^(-i*t)
↓
Real:     2*cos(t)
```

**Z(t):**
```
Complex:  i * (e^(2*i*t) - e^(-2*i*t))
↓
Real:     -2*sin(2*t)
```

---

## 🎨 More Complex Number Examples:

### Example 1: Complex Helix
```
X(t) = re(e^(i*t))
Y(t) = im(e^(i*t))
Z(t) = t/2
```
Or simpler:
```
X(t) = cos(t)
Y(t) = sin(t)
Z(t) = t/2
```

### Example 2: Complex Rose
```
X(t) = re(e^(i*t) * (2 + e^(5*i*t)))
Y(t) = im(e^(i*t) * (2 + e^(5*i*t)))
Z(t) = sin(5*t)
```

### Example 3: Using Complex Arithmetic
```
X(t) = re((1+i)*e^(i*t))
Y(t) = im((1+i)*e^(i*t))
Z(t) = sin(t)
```

---

## ⚡ Performance Note:

**Trigonometric forms are faster** because:
- No complex number arithmetic needed
- Direct real number calculation
- Less computation per point

**Use complex forms when:**
- Converting from mathematical papers
- Easier to understand in complex notation
- Experimenting with complex transformations

---

## 🔬 How the Parser Works:

1. **Parse formula** with mathjs
2. **Evaluate** at each t value
3. **Check result type:**
   - If real number → use directly
   - If complex → extract real part with `math.re()`
4. **Create 3D point** with real coordinates

---

## 🧮 Available Complex Functions:

```
e^(i*t)         → Complex exponential
re(expr)        → Real part (explicit)
im(expr)        → Imaginary part (explicit)
conj(expr)      → Complex conjugate
abs(expr)       → Magnitude
arg(expr)       → Phase angle
```

---

## 💡 Why Real Part Only?

3D space uses **real coordinates** (X, Y, Z). Complex numbers have two components:
- **Real part** → Used for position
- **Imaginary part** → Discarded (or could be used for a 4D projection!)

For your formulas, the real parts create the intended 3D curve.

---

## 🎯 Recommended Approach:

### For Maximum Compatibility:
**Use trigonometric forms** when possible:
✅ Faster computation
✅ Clearer for debugging
✅ Standard mathematical notation

### When to Use Complex Forms:
- Converting from mathematical papers
- Working with complex transformations
- Educational purposes (showing equivalence)

---

## 📋 Quick Reference:

### Your Formulas - Both Ways:

**Complex (Now Works!):**
```
X(t) = (e^(i*t) - e^(-i*t)) / (2*i)
Y(t) = e^(i*t) + e^(-i*t)
Z(t) = i * (e^(2*i*t) - e^(-2*i*t))
```

**Trigonometric (Faster):**
```
X(t) = sin(t)
Y(t) = 2*cos(t)
Z(t) = -2*sin(2*t)
```

**Result:** Same beautiful elliptical 3D curve! 🎨

---

## 🚀 Try It Now:

1. **Refresh browser**
2. Select **"Custom Formula"**
3. **Paste either version** above
4. Press **Ctrl+Enter**
5. Watch the console - you'll see messages if complex numbers are used!

---

**Math is beautiful in any form!** ✨🔢

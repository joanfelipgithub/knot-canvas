import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';
import { create, all } from 'mathjs';

// Initialize mathjs
const math = create(all);

// ==================== SCENE SETUP ====================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(5, 4, 5);

const renderer = new THREE.WebGLRenderer({ 
  antialias: true,
  alpha: false 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 20;
controls.enableRotate = true;  // Explicitly enable rotation
controls.enablePan = true;     // Explicitly enable panning
controls.enableZoom = true;    // Explicitly enable zooming
controls.rotateSpeed = 1.0;    // Rotation sensitivity
controls.panSpeed = 0.8;       // Pan sensitivity
controls.zoomSpeed = 1.2;      // Zoom sensitivity

// Log controls status
console.log('🎮 OrbitControls enabled:', {
  rotate: controls.enableRotate,
  pan: controls.enablePan,
  zoom: controls.enableZoom
});

// ==================== LIGHTING ====================

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight1.position.set(5, 5, 5);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0x6699ff, 0.4);
dirLight2.position.set(-5, 3, -5);
scene.add(dirLight2);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.3);
scene.add(hemiLight);

const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
scene.add(gridHelper);

// ==================== KNOT STATE ====================

let currentKnot = null;
let currentMode = 'line';

// ==================== PRESET FORMULAS ====================

const presets = {
  trefoil: {
    x: 'sin(t) + 2*sin(2*t)',
    y: 'cos(t) - 2*cos(2*t)',
    z: '-sin(3*t)'
  },
  figure8: {
    x: '(2 + cos(2*t)) * cos(3*t)',
    y: '(2 + cos(2*t)) * sin(3*t)',
    z: 'sin(4*t)'
  },
  cinquefoil: {
    x: 'sin(2*t) * (2 + cos(5*t))',
    y: 'cos(2*t) * (2 + cos(5*t))',
    z: 'sin(5*t)'
  },
  torus53: {
    x: 'cos(3*t) * (2 + cos(5*t))',
    y: 'sin(3*t) * (2 + cos(5*t))',
    z: 'sin(5*t)'
  },
  lissajous: {
    x: 'cos(3*t)',
    y: 'cos(4*t)',
    z: 'cos(7*t)'
  }
};

// ==================== UI ELEMENTS ====================

const presetSelect = document.getElementById('preset-select');
const formulaCombined = document.getElementById('formula-combined');
const customInputs = document.getElementById('custom-inputs');
const renderMode = document.getElementById('render-mode');
const tubeRadius = document.getElementById('tube-radius');
const radiusValue = document.getElementById('radius-value');
const colorPicker = document.getElementById('color-picker');
const samplesSlider = document.getElementById('samples');
const samplesValue = document.getElementById('samples-value');
const updateBtn = document.getElementById('update-btn');
const exportStlBtn = document.getElementById('export-stl-btn');
const errorMessage = document.getElementById('error-message');

// ==================== EVENT LISTENERS ====================

presetSelect.addEventListener('change', (e) => {
  const preset = e.target.value;
  console.log('Selected preset:', preset);
  
  if (preset === 'custom') {
    customInputs.classList.add('active');
    console.log('Custom inputs shown');
  } else {
    customInputs.classList.remove('active');
    const formulas = presets[preset];
    // Format formulas for the combined text area
    formulaCombined.value = `X(t) = ${formulas.x}\nY(t) = ${formulas.y}\nZ(t) = ${formulas.z}`;
    console.log('Loaded preset:', preset);
    // Auto-update when preset changes
    updateKnot();
  }
});

tubeRadius.addEventListener('input', (e) => {
  radiusValue.textContent = e.target.value;
});

samplesSlider.addEventListener('input', (e) => {
  samplesValue.textContent = e.target.value;
});

// Auto-update on render mode change
renderMode.addEventListener('change', () => {
  updateKnot();
});

// Auto-update on color change
colorPicker.addEventListener('change', () => {
  updateKnot();
});

updateBtn.addEventListener('click', updateKnot);

// Allow Enter key to update (Ctrl+Enter in textarea)
formulaCombined.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    updateKnot();
  }
});

// ==================== PARSE AND EVALUATE FORMULA ====================

function parseFormulas(text) {
  // Parse formulas from combined text area
  // Supports formats:
  // - "X(t) = formula" or "x(t) = formula"
  // - Just "formula" on each line (assumes order X, Y, Z)
  
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  const formulas = { x: '', y: '', z: '' };
  
  // Try to parse with labels first
  const xMatch = lines.find(line => /^X\(t\)\s*=/i.test(line));
  const yMatch = lines.find(line => /^Y\(t\)\s*=/i.test(line));
  const zMatch = lines.find(line => /^Z\(t\)\s*=/i.test(line));
  
  if (xMatch && yMatch && zMatch) {
    // Found labeled format
    formulas.x = xMatch.replace(/^X\(t\)\s*=/i, '').trim();
    formulas.y = yMatch.replace(/^Y\(t\)\s*=/i, '').trim();
    formulas.z = zMatch.replace(/^Z\(t\)\s*=/i, '').trim();
  } else if (lines.length >= 3) {
    // Assume order: X, Y, Z (strip any labels if present)
    formulas.x = lines[0].replace(/^X\(t\)\s*=/i, '').trim();
    formulas.y = lines[1].replace(/^Y\(t\)\s*=/i, '').trim();
    formulas.z = lines[2].replace(/^Z\(t\)\s*=/i, '').trim();
  } else {
    throw new Error('Please provide formulas for X(t), Y(t), and Z(t)');
  }
  
  return formulas;
}

function evaluateFormula(formula, t) {
  try {
    // Create a scope with t, i (complex unit), e, and pi
    const scope = { 
      t,
      i: math.i,           // Imaginary unit
      e: Math.E,           // Euler's number
      pi: Math.PI          // Pi constant
    };
    const compiled = math.compile(formula);
    const result = compiled.evaluate(scope);
    
    // If result is complex, extract real part
    if (math.typeOf(result) === 'Complex') {
      const realPart = math.re(result);
      console.log(`Complex result detected: ${result.toString()}, using real part: ${realPart}`);
      return realPart;
    }
    
    return result;
  } catch (error) {
    throw new Error(`Formula error: ${error.message}`);
  }
}

// ==================== GENERATE KNOT POINTS ====================

function generateKnotPoints(formulaX, formulaY, formulaZ, samples) {
  const points = [];
  
  for (let i = 0; i <= samples; i++) {
    const t = (i / samples) * Math.PI * 2;
    
    try {
      const x = evaluateFormula(formulaX, t);
      const y = evaluateFormula(formulaY, t);
      const z = evaluateFormula(formulaZ, t);
      
      if (isNaN(x) || isNaN(y) || isNaN(z)) {
        throw new Error('Formula produced invalid values (NaN)');
      }
      
      points.push(new THREE.Vector3(x, y, z));
    } catch (error) {
      throw error;
    }
  }
  
  return points;
}

// ==================== UPDATE KNOT ====================

function updateKnot() {
  errorMessage.classList.remove('active');
  
  try {
    // Parse formulas from combined text area
    const formulas = parseFormulas(formulaCombined.value);
    const xFormula = formulas.x;
    const yFormula = formulas.y;
    const zFormula = formulas.z;
    
    if (!xFormula || !yFormula || !zFormula) {
      throw new Error('Please enter all three formulas (X, Y, Z)');
    }
    
    // Get parameters
    const samples = parseInt(samplesSlider.value);
    const color = new THREE.Color(colorPicker.value);
    const mode = renderMode.value;
    const radius = parseFloat(tubeRadius.value);
    
    // Generate points
    const points = generateKnotPoints(xFormula, yFormula, zFormula, samples);
    
    // Remove old knot
    if (currentKnot) {
      scene.remove(currentKnot);
      currentKnot.geometry.dispose();
      currentKnot.material.dispose();
    }
    
    // Create new knot
    if (mode === 'line') {
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color });
      currentKnot = new THREE.Line(geometry, material);
    } else {
      const curve = new THREE.CatmullRomCurve3(points);
      const geometry = new THREE.TubeGeometry(
        curve,
        samples,
        radius,
        16,
        true
      );
      const material = new THREE.MeshPhongMaterial({
        color,
        shininess: 80,
        specular: 0x444444
      });
      currentKnot = new THREE.Mesh(geometry, material);
    }
    
    scene.add(currentKnot);
    currentMode = mode;
    
    // Enable/disable export button based on mode
    if (mode === 'tube') {
      exportStlBtn.disabled = false;
      exportStlBtn.title = 'Download STL for 3D printing';
    } else {
      exportStlBtn.disabled = true;
      exportStlBtn.title = 'Switch to Tube mode to enable STL export';
    }
    
    console.log('✅ Knot updated successfully');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    errorMessage.textContent = error.message;
    errorMessage.classList.add('active');
  }
}

// ==================== INITIALIZE WITH DEFAULT KNOT ====================

function init() {
  // Load trefoil preset
  const trefoil = presets.trefoil;
  formulaCombined.value = `X(t) = ${trefoil.x}\nY(t) = ${trefoil.y}\nZ(t) = ${trefoil.z}`;
  
  // Create initial knot
  updateKnot();
}

// ==================== ANIMATION LOOP ====================

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// ==================== WINDOW RESIZE ====================

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// ==================== STL EXPORT ====================

function exportToSTL() {
  if (!currentKnot) {
    alert('Please create a knot first!');
    return;
  }
  
  // Check if it's a tube (mesh) - line mode cannot be exported
  if (currentMode === 'line') {
    alert('Please switch to Tube mode before exporting to STL.\n\nLine mode cannot be 3D printed - you need a solid tube!');
    return;
  }
  
  try {
    // Create STL exporter
    const exporter = new STLExporter();
    
    // Export as binary STL (smaller file size, better for printing)
    const stlBinary = exporter.parse(currentKnot, { binary: true });
    
    // Create blob and download
    const blob = new Blob([stlBinary], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    
    // Generate filename based on current preset or "custom"
    const presetName = presetSelect.value === 'custom' ? 'custom' : presetSelect.value;
    const timestamp = new Date().toISOString().slice(0, 10);
    link.download = `knot_${presetName}_${timestamp}.stl`;
    
    // Trigger download
    link.click();
    
    // Clean up
    URL.revokeObjectURL(link.href);
    
    console.log('✅ STL exported successfully');
    alert('STL file downloaded! Ready for 3D printing! 🖨️');
    
  } catch (error) {
    console.error('❌ Export error:', error);
    alert('Error exporting STL: ' + error.message);
  }
}

// Add export button listener
exportStlBtn.addEventListener('click', exportToSTL);

// ==================== START ====================

// Handle instructions overlay
const instructionsOverlay = document.getElementById('instructions-overlay');
const gotItBtn = document.getElementById('got-it-btn');

gotItBtn.addEventListener('click', () => {
  instructionsOverlay.classList.add('hidden');
  localStorage.setItem('knot-canvas-instructions-seen', 'true');
});

// Auto-hide if user has seen it before
if (localStorage.getItem('knot-canvas-instructions-seen') === 'true') {
  instructionsOverlay.classList.add('hidden');
}

// Initialize export button state
exportStlBtn.disabled = true;
exportStlBtn.title = 'Switch to Tube mode to enable STL export';

init();
animate();

console.log('🎨 Knot Canvas initialized');
console.log('🖱️  Use the control panel to modify the knot');
console.log('🖱️  LEFT CLICK + DRAG on canvas to rotate!');

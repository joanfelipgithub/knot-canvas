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
renderer.domElement.style.pointerEvents = 'auto';

// Append to canvas-container
const canvasContainer = document.getElementById('canvas-container');
if (canvasContainer) {
  canvasContainer.appendChild(renderer.domElement);
} else {
  document.body.appendChild(renderer.domElement);
}

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 20;

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

// ==================== STRAND SYSTEM ====================

let strands = [];
let strandMeshes = [];
let strandCounter = 0;

class Strand {
  constructor(id) {
    this.id = id;
    this.rawInput = 'sin(t) + 2*sin(2*t)\ncos(t) - 2*cos(2*t)\n-sin(3*t)';
    this.formulaX = 'sin(t) + 2*sin(2*t)';
    this.formulaY = 'cos(t) - 2*cos(2*t)';
    this.formulaZ = '-sin(3*t)';
    this.color = this.generateColor(id);
    this.visible = true;
    this.useCustomInterval = false;
    this.tMin = '0';
    this.tMax = '2*pi';
  }
  
  generateColor(id) {
    const colors = ['#ff6633', '#33ff66', '#6633ff', '#ff33cc', '#33ccff', '#ffcc33'];
    return colors[id % colors.length];
  }
}

// ==================== SMART FORMULA PARSER ====================

function parseFormulasFromText(text) {
  // This function handles multiple input formats:
  // 1. "X(t) = formula" or "X₂(t) = formula" 
  // 2. "formula" (plain text, one per line)
  // 3. Mixed formats
  
  // Clean up the text
  text = text.trim();
  
  // Replace mathematical symbols with code-friendly versions BEFORE splitting
  text = text.replace(/·/g, '*');           // Replace middle dot with *
  text = text.replace(/×/g, '*');           // Replace × with *
  text = text.replace(/÷/g, '/');           // Replace ÷ with /
  text = text.replace(/π/g, 'pi');          // Replace π with pi
  
  // CRITICAL: Split into lines FIRST, before normalizing whitespace!
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
  
  console.log('📝 Input lines:', lines);
  
  if (lines.length === 0) {
    throw new Error('No formulas provided');
  }
  
  const formulas = { x: '', y: '', z: '' };
  
  // Try to extract formulas from each line
  const extractedFormulas = [];
  
  for (const line of lines) {
    let formula = line;
    
    // Handle implicit multiplication AFTER we have individual lines
    // Examples: 2t -> 2*t, 3pi -> 3*pi, 2(x+1) -> 2*(x+1)
    formula = formula.replace(/(\d+)([a-zA-Z(])/g, '$1*$2');
    
    // Check if line has "=" sign (format: X(t) = formula)
    if (formula.includes('=')) {
      // Extract everything after the last '='
      const parts = formula.split('=');
      formula = parts[parts.length - 1].trim();
    }
    
    // Remove any leading label patterns like "X(t)", "X₂(t)", "x:", etc.
    formula = formula.replace(/^[XYZxyz][₀₁₂₃₄₅₆₇₈₉]?\(t\)\s*[:=]?\s*/i, '');
    formula = formula.replace(/^[XYZxyz][0-9]?\s*[:=]?\s*/i, '');
    
    formula = formula.trim();
    
    if (formula.length > 0) {
      extractedFormulas.push(formula);
    }
  }
  
  console.log('✅ Extracted formulas:', extractedFormulas);
  
  // Assign formulas based on what we found
  if (extractedFormulas.length >= 3) {
    formulas.x = extractedFormulas[0];
    formulas.y = extractedFormulas[1];
    formulas.z = extractedFormulas[2];
  } else if (extractedFormulas.length === 2) {
    formulas.x = extractedFormulas[0];
    formulas.y = extractedFormulas[1];
    formulas.z = '0'; // Default Z
  } else if (extractedFormulas.length === 1) {
    formulas.x = extractedFormulas[0];
    formulas.y = '0';
    formulas.z = '0';
  } else {
    throw new Error('Could not extract formulas from input');
  }
  
  console.log('🎯 Final parsed formulas:', formulas);
  
  return formulas;
}

// ==================== PRESET FORMULAS ====================

const presets = {
  trefoil: [{
    raw: 'sin(t) + 2*sin(2*t)\ncos(t) - 2*cos(2*t)\n-sin(3*t)',
    color: '#ff6633'
  }],
  figure8: [{
    raw: '(2 + cos(2*t)) * cos(3*t)\n(2 + cos(2*t)) * sin(3*t)\nsin(4*t)',
    color: '#ff6633'
  }],
  cinquefoil: [{
    raw: 'sin(2*t) * (2 + cos(5*t))\ncos(2*t) * (2 + cos(5*t))\nsin(5*t)',
    color: '#ff6633'
  }],
  torus53: [{
    raw: 'cos(3*t) * (2 + cos(5*t))\nsin(3*t) * (2 + cos(5*t))\nsin(5*t)',
    color: '#ff6633'
  }],
  lissajous: [{
    raw: 'cos(3*t)\ncos(4*t)\ncos(7*t)',
    color: '#ff6633'
  }],
  dna: [
    {
      raw: '(2 + cos(2*t)) * cos(3*t)\n(2 + cos(2*t)) * sin(3*t)\nsin(4*t)',
      color: '#ff6633'
    },
    {
      raw: '(2 + cos(2*t)) * cos(3*t + pi)\n(2 + cos(2*t)) * sin(3*t + pi)\nsin(4*t)',
      color: '#33ff66'
    }
  ]
};

// ==================== UI ELEMENTS ====================

const presetSelect = document.getElementById('preset-select');
const strandsContainer = document.getElementById('strands-container');
const addStrandBtn = document.getElementById('add-strand-btn');
const removeStrandBtn = document.getElementById('remove-strand-btn');
const strandCountSpan = document.getElementById('strand-count');
const renderMode = document.getElementById('render-mode');
const tubeRadius = document.getElementById('tube-radius');
const radiusValue = document.getElementById('radius-value');
const samplesSlider = document.getElementById('samples');
const samplesValue = document.getElementById('samples-value');
const tMinInput = document.getElementById('t-min');
const tMaxInput = document.getElementById('t-max');
const closedCurveCheckbox = document.getElementById('closed-curve');
const updateBtn = document.getElementById('update-btn');
const resetViewBtn = document.getElementById('reset-view-btn');
const saveFormulasBtn = document.getElementById('save-formulas-btn');
const loadFormulasBtn = document.getElementById('load-formulas-btn');
const loadFileInput = document.getElementById('load-file-input');
const exportStlBtn = document.getElementById('export-stl-btn');
const errorMessage = document.getElementById('error-message');

// ==================== STRAND UI CREATION ====================

function createStrandPanel(strand) {
  const panel = document.createElement('div');
  panel.className = 'strand-panel';
  panel.id = `strand-${strand.id}`;
  
  panel.innerHTML = `
    <div class="strand-header">
      <span class="strand-title">Strand ${strand.id + 1}</span>
      <label class="strand-visibility">
        <input type="checkbox" class="strand-visible-checkbox" data-strand-id="${strand.id}" ${strand.visible ? 'checked' : ''}>
        <span>Show</span>
      </label>
    </div>
    <div class="strand-controls">
      <div class="control-group-mini">
        <label>📋 Paste formulas here (any format):</label>
        <textarea class="strand-raw-input" data-strand-id="${strand.id}" rows="3" placeholder="Paste formulas here:
X(t) = formula
Y(t) = formula  
Z(t) = formula

Or just:
formula
formula
formula">${strand.rawInput}</textarea>
        <small class="hint">Supports: X(t)=..., X₂(t)=..., or plain formulas line-by-line</small>
      </div>
      
      <div class="control-group-mini">
        <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
          <input type="checkbox" class="strand-custom-interval" data-strand-id="${strand.id}" ${strand.useCustomInterval ? 'checked' : ''} style="width: 16px; height: 16px;">
          <span>Custom interval for this strand</span>
        </label>
      </div>
      
      <div class="strand-interval-controls" data-strand-id="${strand.id}" style="display: ${strand.useCustomInterval ? 'block' : 'none'};">
        <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
          <input type="text" class="strand-t-min" data-strand-id="${strand.id}" value="${strand.tMin}" style="width: 70px; padding: 6px; font-size: 11px; margin-bottom: 0;">
          <span style="color: #888; font-size: 11px;">to</span>
          <input type="text" class="strand-t-max" data-strand-id="${strand.id}" value="${strand.tMax}" style="width: 70px; padding: 6px; font-size: 11px; margin-bottom: 0;">
        </div>
        <small class="hint">Use: 2*pi, pi/2, or numbers</small>
      </div>
      
      <div class="control-group-mini">
        <label>Color:</label>
        <input type="color" class="strand-color" data-strand-id="${strand.id}" value="${strand.color}">
      </div>
    </div>
  `;
  
  return panel;
}

function updateStrandUI() {
  strandsContainer.innerHTML = '';
  strands.forEach(strand => {
    strandsContainer.appendChild(createStrandPanel(strand));
  });
  strandCountSpan.textContent = strands.length;
  
  // Attach event listeners
  document.querySelectorAll('.strand-raw-input').forEach(textarea => {
    textarea.addEventListener('input', (e) => {
      const strandId = parseInt(e.target.dataset.strandId);
      const strand = strands.find(s => s.id === strandId);
      strand.rawInput = e.target.value;
    });
    
    // Auto-update on Ctrl+Enter
    textarea.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        updateKnot();
      }
    });
  });
  
  document.querySelectorAll('.strand-color').forEach(input => {
    input.addEventListener('input', (e) => {
      const strandId = parseInt(e.target.dataset.strandId);
      const strand = strands.find(s => s.id === strandId);
      strand.color = e.target.value;
      updateKnot();
    });
  });
  
  document.querySelectorAll('.strand-visible-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const strandId = parseInt(e.target.dataset.strandId);
      const strand = strands.find(s => s.id === strandId);
      strand.visible = e.target.checked;
      updateKnot();
    });
  });
  
  // Custom interval checkbox
  document.querySelectorAll('.strand-custom-interval').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const strandId = parseInt(e.target.dataset.strandId);
      const strand = strands.find(s => s.id === strandId);
      strand.useCustomInterval = e.target.checked;
      
      // Show/hide interval controls
      const intervalControls = document.querySelector(`.strand-interval-controls[data-strand-id="${strandId}"]`);
      if (intervalControls) {
        intervalControls.style.display = e.target.checked ? 'block' : 'none';
      }
    });
  });
  
  // Interval inputs
  document.querySelectorAll('.strand-t-min, .strand-t-max').forEach(input => {
    input.addEventListener('input', (e) => {
      const strandId = parseInt(e.target.dataset.strandId);
      const strand = strands.find(s => s.id === strandId);
      
      if (e.target.classList.contains('strand-t-min')) {
        strand.tMin = e.target.value;
      } else {
        strand.tMax = e.target.value;
      }
    });
  });
}

// ==================== EVENT LISTENERS ====================

presetSelect.addEventListener('change', (e) => {
  const preset = e.target.value;
  
  if (preset !== 'custom' && presets[preset]) {
    // Load preset strands
    strands = [];
    strandCounter = 0;
    
    presets[preset].forEach((strandData) => {
      const strand = new Strand(strandCounter++);
      strand.rawInput = strandData.raw;
      strand.color = strandData.color;
      strands.push(strand);
    });
    
    updateStrandUI();
    updateKnot();
    
    // Reset view to see the new preset
    setTimeout(() => resetView(), 100);
  }
});

addStrandBtn.addEventListener('click', () => {
  const newStrand = new Strand(strandCounter++);
  strands.push(newStrand);
  updateStrandUI();
});

removeStrandBtn.addEventListener('click', () => {
  if (strands.length > 1) {
    strands.pop();
    updateStrandUI();
    updateKnot();
  }
});

tubeRadius.addEventListener('input', (e) => {
  radiusValue.textContent = e.target.value;
});

samplesSlider.addEventListener('input', (e) => {
  samplesValue.textContent = e.target.value;
});

renderMode.addEventListener('change', () => updateKnot());

updateBtn.addEventListener('click', updateKnot);

// ==================== SMART DOMAIN DETECTION ====================

function detectOptimalDomain(formulaX, formulaY, formulaZ) {
  // Analyze formulas to suggest the best domain
  // Returns { tMin, tMax, reason }
  
  const allFormulas = `${formulaX} ${formulaY} ${formulaZ}`.toLowerCase();
  
  // Check for trigonometric functions
  const hasTrig = /sin|cos|tan/.test(allFormulas);
  
  // Check for exponential/growth functions
  const hasExp = /exp|pow|\^/.test(allFormulas);
  
  // Check for linear functions only (no trig, no exp)
  const isLinear = !hasTrig && !hasExp && /[+-]?\d*\.?\d*\*?t/.test(allFormulas);
  
  // Extract coefficients from sin(nt) or cos(nt) patterns
  const trigCoeffs = [];
  const trigPattern = /(sin|cos|tan)\((\d+\.?\d*)\s*\*\s*t/g;
  let match;
  while ((match = trigPattern.exec(allFormulas)) !== null) {
    trigCoeffs.push(parseFloat(match[2]));
  }
  
  // Also check for simple sin(t), cos(t)
  if (/(sin|cos|tan)\(t[\s)]/.test(allFormulas)) {
    trigCoeffs.push(1);
  }
  
  // Determine optimal domain
  if (hasTrig && trigCoeffs.length > 0) {
    // For trigonometric functions, use [0, 2π] for closed curves
    // This ensures knots close properly
    return {
      tMin: 0,
      tMax: 2 * Math.PI,
      reason: 'Trigonometric functions detected - using [0, 2π] for closed curve'
    };
  } else if (hasExp) {
    // For exponential functions, use smaller domain to avoid overflow
    return {
      tMin: 0,
      tMax: 5,
      reason: 'Exponential functions detected - using [0, 5] to prevent overflow'
    };
  } else if (isLinear) {
    // For linear functions, use [0, 10] for visible line segment
    return {
      tMin: 0,
      tMax: 10,
      reason: 'Linear functions detected - using [0, 10] for line segment'
    };
  } else {
    // Default: assume periodic function needing full cycle
    return {
      tMin: 0,
      tMax: 2 * Math.PI,
      reason: 'Default domain [0, 2π] for general functions'
    };
  }
}

function suggestDomainForFormulas(formulaX, formulaY, formulaZ) {
  // Get suggested domain and update UI if interval is default/empty
  const currentMin = tMinInput.value.trim();
  const currentMax = tMaxInput.value.trim();
  
  // Only auto-suggest if user hasn't customized the interval
  const isDefaultInterval = (currentMin === '0' && currentMax === '2*pi') || 
                            (currentMin === '' || currentMax === '');
  
  if (isDefaultInterval) {
    const suggestion = detectOptimalDomain(formulaX, formulaY, formulaZ);
    
    // Update UI with suggestion
    tMinInput.value = suggestion.tMin.toString();
    
    // Format tMax nicely
    if (Math.abs(suggestion.tMax - 2 * Math.PI) < 0.001) {
      tMaxInput.value = '2*pi';
    } else if (Math.abs(suggestion.tMax - Math.PI) < 0.001) {
      tMaxInput.value = 'pi';
    } else {
      tMaxInput.value = suggestion.tMax.toString();
    }
    
    console.log('📐 Auto-detected domain:', suggestion);
    return suggestion;
  }
  
  return null;
}

// ==================== RESET VIEW ====================

function resetView() {
  if (strandMeshes.length === 0) {
    // No meshes, reset to default view
    camera.position.set(5, 4, 5);
    controls.target.set(0, 0, 0);
    controls.update();
    console.log('🎯 View reset to default');
    return;
  }
  
  // Calculate bounding box of all meshes
  const box = new THREE.Box3();
  strandMeshes.forEach(mesh => {
    box.expandByObject(mesh);
  });
  
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  
  console.log('Scene bounding box center:', center);
  console.log('Scene size:', size);
  
  // Focus camera on the curve
  const maxDim = Math.max(size.x, size.y, size.z);
  if (maxDim > 0.1) {
    // Set controls target to center of the scene
    controls.target.copy(center);
    
    // Position camera to see the whole object
    const distance = maxDim * 2.5;
    camera.position.set(
      center.x + distance,
      center.y + distance * 0.8,
      center.z + distance
    );
    
    controls.update();
    console.log('🎯 Camera focused on curve');
  } else {
    console.warn('⚠️ Curve appears to be collapsed to a point or line!');
    camera.position.set(5, 4, 5);
    controls.target.set(0, 0, 0);
    controls.update();
  }
}

resetViewBtn.addEventListener('click', resetView);

// ==================== MATH EVALUATION ====================

function evaluateFormula(formula, t) {
  try {
    const scope = { 
      t,
      i: math.i,
      e: Math.E,
      pi: Math.PI
    };
    const compiled = math.compile(formula);
    const result = compiled.evaluate(scope);
    
    if (math.typeOf(result) === 'Complex') {
      return math.re(result);
    }
    
    return result;
  } catch (error) {
    throw new Error(`Formula error: ${error.message}`);
  }
}

function evaluateIntervalExpression(expression) {
  try {
    const scope = {
      pi: Math.PI,
      e: Math.E
    };
    const compiled = math.compile(expression);
    const result = compiled.evaluate(scope);
    
    if (math.typeOf(result) === 'Complex') {
      return math.re(result);
    }
    
    if (typeof result === 'number' && !isNaN(result)) {
      return result;
    }
    
    throw new Error('Expression must evaluate to a number');
  } catch (error) {
    throw new Error(`Invalid interval expression "${expression}": ${error.message}`);
  }
}

// ==================== GENERATE KNOT POINTS ====================

function generateKnotPoints(formulaX, formulaY, formulaZ, samples, tMin, tMax) {
  const points = [];
  
  console.log(`Generating ${samples} points from t=${tMin} to t=${tMax}`);
  console.log(`Formulas: X="${formulaX}", Y="${formulaY}", Z="${formulaZ}"`);
  
  for (let i = 0; i <= samples; i++) {
    const t = tMin + (i / samples) * (tMax - tMin);
    
    try {
      const x = evaluateFormula(formulaX, t);
      const y = evaluateFormula(formulaY, t);
      const z = evaluateFormula(formulaZ, t);
      
      if (isNaN(x) || isNaN(y) || isNaN(z)) {
        throw new Error('Formula produced invalid values (NaN)');
      }
      
      points.push(new THREE.Vector3(x, y, z));
      
      // Log first and last few points for debugging
      if (i < 3 || i > samples - 3) {
        console.log(`Point ${i}: t=${t.toFixed(4)}, (${x.toFixed(4)}, ${y.toFixed(4)}, ${z.toFixed(4)})`);
      }
    } catch (error) {
      throw error;
    }
  }
  
  // Calculate bounding box to verify curve has volume
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const zs = points.map(p => p.z);
  const bbox = {
    xMin: Math.min(...xs), xMax: Math.max(...xs),
    yMin: Math.min(...ys), yMax: Math.max(...ys),
    zMin: Math.min(...zs), zMax: Math.max(...zs)
  };
  
  console.log('Bounding box:', bbox);
  console.log('Curve dimensions:', {
    width: bbox.xMax - bbox.xMin,
    height: bbox.yMax - bbox.yMin,
    depth: bbox.zMax - bbox.zMin
  });
  
  return points;
}

// ==================== UPDATE KNOT ====================

function updateKnot() {
  errorMessage.classList.remove('active');
  
  try {
    // Get global parameters (will be re-evaluated after domain detection)
    const samples = parseInt(samplesSlider.value);
    const mode = renderMode.value;
    const radius = parseFloat(tubeRadius.value);
    const isClosed = closedCurveCheckbox.checked;
    
    // Remove all old meshes
    strandMeshes.forEach(mesh => {
      scene.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
    strandMeshes = [];
    
    // Create mesh for each visible strand
    strands.forEach(strand => {
      if (!strand.visible) return;
      
      try {
        // Parse formulas from raw input
        const formulas = parseFormulasFromText(strand.rawInput);
        
        // Update the strand's parsed formulas
        strand.formulaX = formulas.x;
        strand.formulaY = formulas.y;
        strand.formulaZ = formulas.z;
        
        console.log(`Strand ${strand.id + 1} parsed:`, formulas);
        
        // Auto-suggest domain for first visible strand if needed
        if (strand === strands.find(s => s.visible)) {
          suggestDomainForFormulas(strand.formulaX, strand.formulaY, strand.formulaZ);
        }
        
        // Determine which interval to use
        let tMin, tMax;
        if (strand.useCustomInterval) {
          // Use strand-specific interval
          tMin = evaluateIntervalExpression(strand.tMin.trim());
          tMax = evaluateIntervalExpression(strand.tMax.trim());
          console.log(`Strand ${strand.id + 1} using custom interval: [${tMin}, ${tMax}]`);
        } else {
          // Use global interval
          tMin = evaluateIntervalExpression(tMinInput.value.trim());
          tMax = evaluateIntervalExpression(tMaxInput.value.trim());
          console.log(`Strand ${strand.id + 1} using global interval: [${tMin}, ${tMax}]`);
        }
        
        if (isNaN(tMin) || isNaN(tMax)) {
          throw new Error('Invalid interval values');
        }
        
        if (tMin >= tMax) {
          throw new Error('t-min must be less than t-max');
        }
        
        const points = generateKnotPoints(
          strand.formulaX,
          strand.formulaY,
          strand.formulaZ,
          samples,
          tMin,
          tMax
        );
        
        const color = new THREE.Color(strand.color);
        let mesh;
        
        if (mode === 'line') {
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const material = new THREE.LineBasicMaterial({ color });
          mesh = new THREE.Line(geometry, material);
        } else {
          const curve = new THREE.CatmullRomCurve3(points);
          const geometry = new THREE.TubeGeometry(
            curve,
            samples,
            radius,
            16,
            isClosed
          );
          const material = new THREE.MeshPhongMaterial({
            color,
            shininess: 80,
            specular: 0x444444
          });
          mesh = new THREE.Mesh(geometry, material);
        }
        
        scene.add(mesh);
        strandMeshes.push(mesh);
        
      } catch (error) {
        throw new Error(`Strand ${strand.id + 1}: ${error.message}`);
      }
    });
    
    // Enable/disable export button
    if (mode === 'tube') {
      exportStlBtn.disabled = false;
      exportStlBtn.title = 'Download STL for 3D printing';
    } else {
      exportStlBtn.disabled = true;
      exportStlBtn.title = 'Switch to Tube mode to enable STL export';
    }
    
    console.log(`✅ Updated ${strandMeshes.length} strand(s)`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    errorMessage.textContent = error.message;
    errorMessage.classList.add('active');
  }
}

// ==================== STL EXPORT ====================

function exportToSTL() {
  if (strandMeshes.length === 0) {
    alert('Please create a knot first!');
    return;
  }
  
  if (renderMode.value === 'line') {
    alert('Please switch to Tube mode before exporting to STL.');
    return;
  }
  
  try {
    const exporter = new STLExporter();
    
    // Create a group with all meshes
    const group = new THREE.Group();
    strandMeshes.forEach(mesh => group.add(mesh.clone()));
    
    const stlBinary = exporter.parse(group, { binary: true });
    const blob = new Blob([stlBinary], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    
    const presetName = presetSelect.value === 'custom' ? 'custom' : presetSelect.value;
    const timestamp = new Date().toISOString().slice(0, 10);
    link.download = `knot_${presetName}_${strands.length}strands_${timestamp}.stl`;
    
    link.click();
    URL.revokeObjectURL(link.href);
    
    console.log('✅ STL exported successfully');
    alert('STL file downloaded! Ready for 3D printing! 🖨️');
    
  } catch (error) {
    console.error('❌ Export error:', error);
    alert('Error exporting STL: ' + error.message);
  }
}

exportStlBtn.addEventListener('click', exportToSTL);

// ==================== SAVE/LOAD FORMULAS ====================

function saveFormulas() {
  // Create a text file with all strand formulas and settings
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  
  let content = `# Knot Canvas Formula Export\n`;
  content += `# Created: ${new Date().toLocaleString()}\n`;
  content += `# Share this file with students!\n\n`;
  
  // Global settings
  content += `[GLOBAL_SETTINGS]\n`;
  content += `render_mode=${renderMode.value}\n`;
  content += `tube_radius=${tubeRadius.value}\n`;
  content += `samples=${samplesSlider.value}\n`;
  content += `t_min=${tMinInput.value}\n`;
  content += `t_max=${tMaxInput.value}\n`;
  content += `closed_curve=${closedCurveCheckbox.checked}\n`;
  content += `\n`;
  
  // Strands
  strands.forEach((strand, index) => {
    content += `[STRAND_${index + 1}]\n`;
    content += `color=${strand.color}\n`;
    content += `visible=${strand.visible}\n`;
    content += `use_custom_interval=${strand.useCustomInterval}\n`;
    content += `t_min=${strand.tMin}\n`;
    content += `t_max=${strand.tMax}\n`;
    content += `formulas=\n`;
    content += strand.rawInput + '\n';
    content += `\n`;
  });
  
  // Create and download file
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `knot_formulas_${timestamp}.txt`;
  link.click();
  URL.revokeObjectURL(link.href);
  
  console.log('✅ Formulas saved successfully');
}

function loadFormulas() {
  loadFileInput.click();
}

function handleFileLoad(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target.result;
      parseAndLoadFormulas(content);
      console.log('✅ Formulas loaded successfully');
    } catch (error) {
      console.error('❌ Load error:', error);
      alert('Error loading file: ' + error.message);
    }
  };
  reader.readAsText(file);
  
  // Reset file input so the same file can be loaded again
  event.target.value = '';
}

function parseAndLoadFormulas(content) {
  const lines = content.split(/\r?\n/);
  
  // Parse global settings
  let inGlobalSettings = false;
  let currentStrand = null;
  let strandData = [];
  let inFormulas = false;
  let formulaLines = [];
  
  for (let line of lines) {
    line = line.trim();
    
    // Skip comments and empty lines
    if (line.startsWith('#') || line === '') continue;
    
    if (line === '[GLOBAL_SETTINGS]') {
      inGlobalSettings = true;
      continue;
    }
    
    if (line.startsWith('[STRAND_')) {
      inGlobalSettings = false;
      
      // Save previous strand if exists
      if (currentStrand !== null && formulaLines.length > 0) {
        strandData.push({
          ...currentStrand,
          rawInput: formulaLines.join('\n')
        });
      }
      
      // Start new strand
      currentStrand = { 
        color: '#ff6633', 
        visible: true,
        useCustomInterval: false,
        tMin: '0',
        tMax: '2*pi'
      };
      formulaLines = [];
      inFormulas = false;
      continue;
    }
    
    if (inGlobalSettings) {
      const [key, value] = line.split('=').map(s => s.trim());
      switch (key) {
        case 'render_mode':
          renderMode.value = value;
          break;
        case 'tube_radius':
          tubeRadius.value = value;
          radiusValue.textContent = value;
          break;
        case 'samples':
          samplesSlider.value = value;
          samplesValue.textContent = value;
          break;
        case 't_min':
          tMinInput.value = value;
          break;
        case 't_max':
          tMaxInput.value = value;
          break;
        case 'closed_curve':
          closedCurveCheckbox.checked = (value === 'true');
          break;
      }
    } else if (currentStrand !== null) {
      if (line === 'formulas=') {
        inFormulas = true;
        continue;
      }
      
      if (inFormulas) {
        formulaLines.push(line);
      } else {
        const [key, value] = line.split('=').map(s => s.trim());
        if (key === 'color') currentStrand.color = value;
        if (key === 'visible') currentStrand.visible = (value === 'true');
        if (key === 'use_custom_interval') currentStrand.useCustomInterval = (value === 'true');
        if (key === 't_min') currentStrand.tMin = value;
        if (key === 't_max') currentStrand.tMax = value;
      }
    }
  }
  
  // Save last strand
  if (currentStrand !== null && formulaLines.length > 0) {
    strandData.push({
      ...currentStrand,
      rawInput: formulaLines.join('\n')
    });
  }
  
  // Create strands from loaded data
  if (strandData.length > 0) {
    strands = [];
    strandCounter = 0;
    
    strandData.forEach(data => {
      const strand = new Strand(strandCounter++);
      strand.rawInput = data.rawInput;
      strand.color = data.color;
      strand.visible = data.visible;
      strand.useCustomInterval = data.useCustomInterval || false;
      strand.tMin = data.tMin || '0';
      strand.tMax = data.tMax || '2*pi';
      strands.push(strand);
    });
    
    updateStrandUI();
    updateKnot();
    
    // Reset view to see the loaded curve
    setTimeout(() => resetView(), 100);
    
    alert(`✅ Loaded ${strands.length} strand(s) successfully!`);
  } else {
    throw new Error('No strand data found in file');
  }
}

saveFormulasBtn.addEventListener('click', saveFormulas);
loadFormulasBtn.addEventListener('click', loadFormulas);
loadFileInput.addEventListener('change', handleFileLoad);

// ==================== INITIALIZE ====================

function init() {
  // Create initial strand
  const initialStrand = new Strand(strandCounter++);
  strands.push(initialStrand);
  
  updateStrandUI();
  updateKnot();
  
  // Auto-focus camera on initial load
  setTimeout(() => resetView(), 100);
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

// ==================== START ====================

const instructionsOverlay = document.getElementById('instructions-overlay');
const gotItBtn = document.getElementById('got-it-btn');

function hideInstructions() {
  if (instructionsOverlay) {
    instructionsOverlay.classList.add('hidden');
    
    // Force removal from DOM after animation
    setTimeout(() => {
      if (instructionsOverlay.classList.contains('hidden')) {
        instructionsOverlay.style.display = 'none';
      }
    }, 300);
    
    localStorage.setItem('knot-canvas-instructions-seen', 'true');
    console.log('✅ Instructions overlay hidden');
    
    // Ensure canvas can receive mouse events
    const canvas = renderer.domElement;
    if (canvas) {
      canvas.style.pointerEvents = 'auto';
      console.log('✅ Canvas mouse events enabled');
    }
  }
}

// Multiple ways to close the overlay
if (gotItBtn) {
  gotItBtn.addEventListener('click', hideInstructions);
}

// Click outside to close
if (instructionsOverlay) {
  instructionsOverlay.addEventListener('click', (e) => {
    if (e.target === instructionsOverlay) {
      hideInstructions();
    }
  });
}

// ESC key to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && instructionsOverlay && !instructionsOverlay.classList.contains('hidden')) {
    hideInstructions();
  }
});

// Auto-hide if seen before
if (localStorage.getItem('knot-canvas-instructions-seen') === 'true') {
  hideInstructions();
}

// Fallback: auto-hide after 10 seconds if user doesn't interact
setTimeout(() => {
  if (instructionsOverlay && !instructionsOverlay.classList.contains('hidden')) {
    console.log('⏰ Auto-hiding instructions after timeout');
    hideInstructions();
  }
}, 10000);

exportStlBtn.disabled = true;
exportStlBtn.title = 'Switch to Tube mode to enable STL export';

init();
animate();

console.log('🎨 Knot Canvas with Smart Formula Parsing initialized');
console.log('📋 Paste formulas in any format - the parser will extract them!');

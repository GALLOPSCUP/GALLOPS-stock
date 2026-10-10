/**
 * GALLOPS WHOLESALE STOCK APPLICATION - CORE CONTROLLER
 * Full Shape, Color & Size Matrix for Wholesale Menstrual Cup Business
 * Shapes: Regular Shape, Bell Shape, Single Fold, Multi Fold, LSR
 * Colors: Pink, Blue, Purple, Standard / Natural
 * Sizes: Small (S), Medium (M), Large (L)
 */

(function () {
  'use strict';

  // ================= STORAGE KEYS =================
  const STORAGE_KEYS = {
    STOCK: 'gallops_cup_stock_v4',
    TRANSACTIONS: 'gallops_cup_transactions_v4',
    SETTINGS: 'gallops_cup_settings_v4',
    THEME: 'gallops_cup_theme_v4'
  };

  // ================= DEFAULT CONFIGURATION =================
  const DEFAULT_SHAPES = [
    { id: 'GALLOPS_CUP', name: 'Gallops Cup', icon: '🏆', colors: ['PINK'] },
    { id: 'REGULAR', name: 'Regular Shape', icon: '🌸', colors: ['PINK', 'BLUE', 'PURPLE'] },
    { id: 'BELL', name: 'Bell Shape', icon: '🔔', colors: ['PINK', 'BLUE', 'PURPLE'] },
    { id: 'LSR', name: 'LSR', icon: '💎', colors: ['WHITE'] },
    { id: 'SINGLE_FOLD', name: 'Single Fold', icon: '📐', colors: ['PINK'] },
    { id: 'MULTI_FOLD', name: 'Multi Fold', icon: '🥏', colors: ['PINK'] },
    { id: 'BOX', name: 'Box', icon: '📦', colors: ['PRINTED'] }
  ];

  const DEFAULT_COLORS = [
    { id: 'PINK', name: 'Pink', hex: '#ec4899', dot: '🔴' },
    { id: 'BLUE', name: 'Blue', hex: '#2563eb', dot: '🔵' },
    { id: 'PURPLE', name: 'Purple', hex: '#9333ea', dot: '🟣' },
    { id: 'WHITE', name: 'White', hex: '#64748b', dot: '⚪' },
    { id: 'PRINTED', name: 'Printed Box', hex: '#f59e0b', dot: '📦' }
  ];

  const DEFAULT_SIZES = [
    { id: 'S', name: 'Small (S)', label: 'Small (S)' },
    { id: 'M', name: 'Medium (M)', label: 'Medium (M)' },
    { id: 'L', name: 'Large (L)', label: 'Large (L)' }
  ];

  const DEFAULT_SHAPE_PREFERENCES = {
    'GALLOPS_CUP': {
      sizes: {
        'S': { lowLimit: 100, cost: 30, sell: 60 },
        'M': { lowLimit: 100, cost: 30, sell: 60 },
        'L': { lowLimit: 100, cost: 30, sell: 60 }
      }
    },
    'REGULAR': {
      sizes: {
        'S': { lowLimit: 300, cost: 42, sell: 90 },
        'M': { lowLimit: 300, cost: 45, sell: 95 },
        'L': { lowLimit: 300, cost: 48, sell: 100 }
      }
    },
    'BELL': {
      sizes: {
        'S': { lowLimit: 50, cost: 42, sell: 90 },
        'M': { lowLimit: 50, cost: 45, sell: 95 },
        'L': { lowLimit: 50, cost: 48, sell: 100 }
      }
    },
    'LSR': {
      sizes: {
        'S': { lowLimit: 200, cost: 60, sell: 130 },
        'M': { lowLimit: 200, cost: 65, sell: 140 },
        'L': { lowLimit: 200, cost: 70, sell: 150 }
      }
    },
    'SINGLE_FOLD': {
      sizes: {
        'S': { lowLimit: 200, cost: 42, sell: 90 },
        'M': { lowLimit: 200, cost: 45, sell: 95 },
        'L': { lowLimit: 200, cost: 48, sell: 100 }
      }
    },
    'MULTI_FOLD': {
      sizes: {
        'S': { lowLimit: 10, cost: 42, sell: 90 },
        'M': { lowLimit: 10, cost: 45, sell: 95 },
        'L': { lowLimit: 10, cost: 48, sell: 100 }
      }
    },
    'BOX': {
      sizes: {
        'S': { lowLimit: 400, cost: 6, sell: 12 },
        'M': { lowLimit: 400, cost: 8, sell: 15 },
        'L': { lowLimit: 400, cost: 10, sell: 20 }
      }
    }
  };

  const DEFAULT_SETTINGS = {
    lowStockThreshold: 50,
    defaultCostPrice: 45,
    defaultSellPrice: 95,
    factorySupplierName: 'Supreme Silicone Molds Ltd',
    shapes: DEFAULT_SHAPES,
    colors: DEFAULT_COLORS,
    sizes: DEFAULT_SIZES,
    shapePreferences: DEFAULT_SHAPE_PREFERENCES
  };

  // Sample stock covering user's actual wholesale product matrix
  const INITIAL_STOCK_SAMPLE = {
    // 1. GALLOPS CUP (Pink Only)
    'GALLOPS_CUP_PINK_S': 150,
    'GALLOPS_CUP_PINK_M': 250,
    'GALLOPS_CUP_PINK_L': 110,

    // 2. REGULAR SHAPE
    'REGULAR_PINK_S': 160,
    'REGULAR_PINK_M': 280,
    'REGULAR_PINK_L': 120,
    'REGULAR_BLUE_S': 90,
    'REGULAR_BLUE_M': 180,
    'REGULAR_BLUE_L': 70,
    'REGULAR_PURPLE_S': 80,
    'REGULAR_PURPLE_M': 150,
    'REGULAR_PURPLE_L': 65,

    // 3. BELL SHAPE
    'BELL_PINK_S': 210,
    'BELL_PINK_M': 350,
    'BELL_PINK_L': 140,
    'BELL_BLUE_S': 110,
    'BELL_BLUE_M': 200,
    'BELL_BLUE_L': 75,
    'BELL_PURPLE_S': 95,
    'BELL_PURPLE_M': 160,
    'BELL_PURPLE_L': 45, // Low stock alert (< 50)

    // 4. LSR (Only White Available)
    'LSR_WHITE_S': 110,
    'LSR_WHITE_M': 190,
    'LSR_WHITE_L': 85,

    // 5. SINGLE FOLD (Pink Only)
    'SINGLE_FOLD_PINK_S': 130,
    'SINGLE_FOLD_PINK_M': 220,
    'SINGLE_FOLD_PINK_L': 90,

    // 6. MULTI FOLD (Pink Only)
    'MULTI_FOLD_PINK_S': 140,
    'MULTI_FOLD_PINK_M': 240,
    'MULTI_FOLD_PINK_L': 105,

    // 7. BOX (Packaging Box: Small, Medium, Large)
    'BOX_PRINTED_S': 400,
    'BOX_PRINTED_M': 650,
    'BOX_PRINTED_L': 300
  };

  const INITIAL_TRANSACTIONS_SAMPLE = [
    {
      id: 'TXN-1001',
      type: 'IN',
      date: '2026-10-01',
      shapeId: 'REGULAR',
      colorId: 'PINK',
      sizeId: 'M',
      quantity: 500,
      rate: 45,
      total: 22500,
      partyName: 'Supreme Silicone Molds Ltd',
      reference: 'INV-4402',
      notes: 'Regular Pink cups initial production shipment',
      timestamp: Date.now() - 8 * 86400000
    },
    {
      id: 'TXN-1002',
      type: 'OUT',
      date: '2026-10-03',
      shapeId: 'BELL',
      colorId: 'PINK',
      sizeId: 'M',
      quantity: 100,
      rate: 95,
      total: 9500,
      partyName: 'Aarav Surgical & Pharmacy, Delhi',
      phone: '+91 98112 34567',
      city: 'Delhi',
      paymentStatus: 'CASH',
      reference: 'ORD-9921',
      notes: 'Wholesale buyer, Bell Pink M cups',
      timestamp: Date.now() - 6 * 86400000
    },
    {
      id: 'TXN-1003',
      type: 'OUT',
      date: '2026-10-05',
      shapeId: 'SINGLE_FOLD',
      colorId: 'PINK',
      sizeId: 'M',
      quantity: 80,
      rate: 92,
      total: 7360,
      partyName: 'Femina Care Wholesale, Bangalore',
      phone: '+91 94480 12345',
      city: 'Bangalore, Karnataka',
      paymentStatus: 'ACCOUNT',
      reference: 'ORD-7744',
      notes: 'Single Fold Pink M wholesale dispatch',
      timestamp: Date.now() - 4 * 86400000
    },
    {
      id: 'TXN-1004',
      type: 'IN',
      date: '2026-10-07',
      shapeId: 'LSR',
      colorId: 'WHITE',
      sizeId: 'M',
      quantity: 350,
      rate: 52,
      total: 18200,
      partyName: 'Supreme Silicone Molds Ltd',
      reference: 'CHALLAN-901',
      notes: 'LSR White medical grade liquid silicone shipment',
      timestamp: Date.now() - 2 * 86400000
    }
  ];

  // ================= STATE MANAGEMENT =================
  let appState = {
    settings: loadSettings(),
    stock: loadStock(),
    transactions: loadTransactions(),
    currentAdjustSku: null
  };

  function loadSettings() {
    let settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    let parsed = null;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        parsed = JSON.parse(stored);
        settings = Object.assign({}, DEFAULT_SETTINGS, parsed);
      }
    } catch (e) {
      console.warn('Error loading settings', e);
    }

    // Merge shapes: keep 7 standard DEFAULT_SHAPES, plus any custom user-added shapes
    const savedShapes = Array.isArray(parsed?.shapes) ? parsed.shapes : [];
    const customShapes = savedShapes.filter(s => !DEFAULT_SHAPES.some(d => d.id === s.id));
    settings.shapes = [...DEFAULT_SHAPES, ...customShapes];

    // Merge sizes: keep standard DEFAULT_SIZES (S, M, L), plus any custom user-added sizes
    const savedSizes = Array.isArray(parsed?.sizes) ? parsed.sizes : [];
    const customSizes = savedSizes.filter(s => !DEFAULT_SIZES.some(d => d.id === s.id));
    settings.sizes = [...DEFAULT_SIZES, ...customSizes];

    settings.colors = DEFAULT_COLORS;

    // Ensure shapePreferences has entries for all shapes and each size
    if (!settings.shapePreferences || typeof settings.shapePreferences !== 'object') {
      settings.shapePreferences = JSON.parse(JSON.stringify(DEFAULT_SHAPE_PREFERENCES));
    }

    settings.shapes.forEach(shape => {
      const shapeId = shape.id;
      if (!settings.shapePreferences[shapeId]) {
        if (DEFAULT_SHAPE_PREFERENCES[shapeId]) {
          settings.shapePreferences[shapeId] = JSON.parse(JSON.stringify(DEFAULT_SHAPE_PREFERENCES[shapeId]));
        } else {
          settings.shapePreferences[shapeId] = { sizes: {} };
        }
      }
      const pref = settings.shapePreferences[shapeId];
      if (!pref.sizes || typeof pref.sizes !== 'object') {
        const fallbackLow = (pref.lowLimit !== undefined && pref.lowLimit !== '') ? Number(pref.lowLimit) : 50;
        const fallbackCost = (pref.cost !== undefined && pref.cost !== '') ? Number(pref.cost) : 45;
        const fallbackSell = (pref.sell !== undefined && pref.sell !== '') ? Number(pref.sell) : 95;
        pref.sizes = {};
        settings.sizes.forEach(sz => {
          pref.sizes[sz.id] = { lowLimit: fallbackLow, cost: fallbackCost, sell: fallbackSell };
        });
      } else {
        settings.sizes.forEach(sz => {
          if (!pref.sizes[sz.id]) {
            const defSz = DEFAULT_SHAPE_PREFERENCES[shapeId]?.sizes?.[sz.id] || { lowLimit: 50, cost: 45, sell: 95 };
            pref.sizes[sz.id] = { ...defSz };
          }
        });
      }
    });

    return settings;
  }

  function getShapeSizeLowLimit(shapeId, sizeId) {
    const prefs = appState?.settings?.shapePreferences;
    const shapePref = prefs && prefs[shapeId];
    if (shapePref) {
      if (shapePref.sizes && sizeId && shapePref.sizes[sizeId] && shapePref.sizes[sizeId].lowLimit !== undefined && shapePref.sizes[sizeId].lowLimit !== '') {
        return Number(shapePref.sizes[sizeId].lowLimit);
      }
      if (shapePref.lowLimit !== undefined && shapePref.lowLimit !== '') {
        return Number(shapePref.lowLimit);
      }
    }
    const defShape = DEFAULT_SHAPE_PREFERENCES[shapeId];
    if (defShape && defShape.sizes && sizeId && defShape.sizes[sizeId]?.lowLimit !== undefined) {
      return Number(defShape.sizes[sizeId].lowLimit);
    }
    return 50;
  }

  function getShapeSizeCostPrice(shapeId, sizeId) {
    const prefs = appState?.settings?.shapePreferences;
    const shapePref = prefs && prefs[shapeId];
    if (shapePref) {
      if (shapePref.sizes && sizeId && shapePref.sizes[sizeId] && shapePref.sizes[sizeId].cost !== undefined && shapePref.sizes[sizeId].cost !== '') {
        return Number(shapePref.sizes[sizeId].cost);
      }
      if (shapePref.cost !== undefined && shapePref.cost !== '') {
        return Number(shapePref.cost);
      }
    }
    const defShape = DEFAULT_SHAPE_PREFERENCES[shapeId];
    if (defShape && defShape.sizes && sizeId && defShape.sizes[sizeId]?.cost !== undefined) {
      return Number(defShape.sizes[sizeId].cost);
    }
    return 45;
  }

  function getShapeSizeSellPrice(shapeId, sizeId) {
    const prefs = appState?.settings?.shapePreferences;
    const shapePref = prefs && prefs[shapeId];
    if (shapePref) {
      if (shapePref.sizes && sizeId && shapePref.sizes[sizeId] && shapePref.sizes[sizeId].sell !== undefined && shapePref.sizes[sizeId].sell !== '') {
        return Number(shapePref.sizes[sizeId].sell);
      }
      if (shapePref.sell !== undefined && shapePref.sell !== '') {
        return Number(shapePref.sell);
      }
    }
    const defShape = DEFAULT_SHAPE_PREFERENCES[shapeId];
    if (defShape && defShape.sizes && sizeId && defShape.sizes[sizeId]?.sell !== undefined) {
      return Number(defShape.sizes[sizeId].sell);
    }
    return 95;
  }

  function getShapeLowLimit(shapeId, sizeId = 'M') {
    return getShapeSizeLowLimit(shapeId, sizeId);
  }

  function getShapeCostPrice(shapeId, sizeId = 'M') {
    return getShapeSizeCostPrice(shapeId, sizeId);
  }

  function getShapeSellPrice(shapeId, sizeId = 'M') {
    return getShapeSizeSellPrice(shapeId, sizeId);
  }

  function saveSettings() {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(appState.settings));
  }

  function loadStock() {
    let stock = JSON.parse(JSON.stringify(INITIAL_STOCK_SAMPLE));
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STOCK);
      if (stored) {
        stock = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error loading stock', e);
    }
    // Clean up deleted variations (Single Fold & Multi Fold Blue/Purple, LSR non-white)
    delete stock['SINGLE_FOLD_BLUE_S'];
    delete stock['SINGLE_FOLD_BLUE_M'];
    delete stock['SINGLE_FOLD_BLUE_L'];
    delete stock['SINGLE_FOLD_PURPLE_S'];
    delete stock['SINGLE_FOLD_PURPLE_M'];
    delete stock['SINGLE_FOLD_PURPLE_L'];
    delete stock['MULTI_FOLD_BLUE_S'];
    delete stock['MULTI_FOLD_BLUE_M'];
    delete stock['MULTI_FOLD_BLUE_L'];
    delete stock['MULTI_FOLD_PURPLE_S'];
    delete stock['MULTI_FOLD_PURPLE_M'];
    delete stock['MULTI_FOLD_PURPLE_L'];
    delete stock['LSR_PINK_S'];
    delete stock['LSR_PINK_M'];
    delete stock['LSR_PINK_L'];
    delete stock['LSR_BLUE_S'];
    delete stock['LSR_BLUE_M'];
    delete stock['LSR_BLUE_L'];
    delete stock['LSR_PURPLE_S'];
    delete stock['LSR_PURPLE_M'];
    delete stock['LSR_PURPLE_L'];

    // Ensure new shapes exist in stock
    if (stock['GALLOPS_CUP_PINK_S'] === undefined) {
      stock['GALLOPS_CUP_PINK_S'] = 150;
      stock['GALLOPS_CUP_PINK_M'] = 250;
      stock['GALLOPS_CUP_PINK_L'] = 110;
    }
    if (stock['BOX_PRINTED_S'] === undefined) {
      stock['BOX_PRINTED_S'] = 400;
      stock['BOX_PRINTED_M'] = 650;
      stock['BOX_PRINTED_L'] = 300;
    }
    return stock;
  }

  function saveStock() {
    localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(appState.stock));
  }

  function loadTransactions() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error loading transactions', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS_SAMPLE));
  }

  function saveTransactions() {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(appState.transactions));
  }

  // ================= HELPER FUNCTIONS =================
  function getSkuKey(shapeId, colorId, sizeId) {
    if (!colorId) {
      return `${shapeId}_${sizeId}`;
    }
    return `${shapeId}_${colorId}_${sizeId}`;
  }

  function getStockQty(shapeId, colorId, sizeId) {
    const key = getSkuKey(shapeId, colorId, sizeId);
    if (appState.stock[key] !== undefined) {
      return appState.stock[key];
    }
    // Fallback if old format exists
    const legacyKey = `${shapeId}_${sizeId}`;
    return appState.stock[legacyKey] || 0;
  }

  function setStockQty(shapeId, colorId, sizeId, qty) {
    const key = getSkuKey(shapeId, colorId, sizeId);
    appState.stock[key] = Math.max(0, parseInt(qty, 10) || 0);
    saveStock();
  }

  function formatCurrency(val) {
    return '₹' + Number(val || 0).toLocaleString('en-IN');
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    } catch (_) {}
    return dateStr;
  }

  function getShapeById(shapeId) {
    return appState.settings.shapes.find(s => s.id === shapeId) || { id: shapeId, name: shapeId, icon: '📦' };
  }

  function getColorById(colorId) {
    return DEFAULT_COLORS.find(c => c.id === colorId) || { id: colorId, name: colorId, hex: '#94a3b8', dot: '⚪' };
  }

  function getSizeById(sizeId) {
    return appState.settings.sizes.find(s => s.id === sizeId) || { id: sizeId, name: sizeId };
  }

  function getColorsForShape(shapeId) {
    const shape = getShapeById(shapeId);
    const allowed = shape.colors || ['PINK', 'BLUE', 'PURPLE'];
    return DEFAULT_COLORS.filter(c => allowed.includes(c.id));
  }

  // ================= TOAST SYSTEM =================
  function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ================= RENDER METHODS =================

  // 1. Populate Dropdowns in Inward, Outward & Filter
  function populateDropdowns() {
    const inShape = document.getElementById('inShape');
    const outShape = document.getElementById('outShape');
    const filterShape = document.getElementById('filterLedgerShape');

    const inSize = document.getElementById('inSize');
    const outSize = document.getElementById('outSize');
    const filterSize = document.getElementById('filterLedgerSize');

    const filterColor = document.getElementById('filterLedgerColor');

    const shapeOptions = appState.settings.shapes.map(s => `<option value="${s.id}">${s.icon} ${s.name}</option>`).join('');
    const sizeOptions = appState.settings.sizes.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    const allColorOptions = DEFAULT_COLORS.map(c => `<option value="${c.id}">${c.dot} ${c.name}</option>`).join('');

    if (inShape && inShape.innerHTML !== shapeOptions) inShape.innerHTML = shapeOptions;
    if (outShape && outShape.innerHTML !== shapeOptions) outShape.innerHTML = shapeOptions;
    if (filterShape) filterShape.innerHTML = '<option value="ALL">All Shapes</option>' + shapeOptions;

    if (inSize && inSize.innerHTML !== sizeOptions) inSize.innerHTML = sizeOptions;
    if (outSize && outSize.innerHTML !== sizeOptions) outSize.innerHTML = sizeOptions;
    if (filterSize) filterSize.innerHTML = '<option value="ALL">All Sizes</option>' + sizeOptions;

    if (filterColor) filterColor.innerHTML = '<option value="ALL">All Colors</option>' + allColorOptions;

    // Populate shape-specific color dropdowns
    updateColorDropdowns();

    // Set today's date in date inputs
    const today = new Date().toISOString().split('T')[0];
    const inDate = document.getElementById('inDate');
    const outDate = document.getElementById('outDate');
    if (inDate && !inDate.value) inDate.value = today;
    if (outDate && !outDate.value) outDate.value = today;

    // Set default cost/sell prices based on selected shape and size
    const inCostPrice = document.getElementById('inCostPrice');
    const outSellPrice = document.getElementById('outSellPrice');
    if (inCostPrice && inShape && inSize) inCostPrice.value = getShapeSizeCostPrice(inShape.value, inSize.value);
    if (outSellPrice && outShape && outSize) outSellPrice.value = getShapeSizeSellPrice(outShape.value, outSize.value);

    // Default supplier name
    const inSupplierName = document.getElementById('inSupplierName');
    if (inSupplierName) inSupplierName.value = appState.settings.factorySupplierName || 'Supreme Silicone Molds Ltd';

    updateOutwardStockHint();
  }

  function updateColorDropdowns() {
    const inShape = document.getElementById('inShape');
    const outShape = document.getElementById('outShape');
    const inColor = document.getElementById('inColor');
    const outColor = document.getElementById('outColor');

    if (inShape && inColor) {
      const colors = getColorsForShape(inShape.value);
      const prevVal = inColor.value;
      inColor.innerHTML = colors.map(c => `<option value="${c.id}">${c.dot} ${c.name}</option>`).join('');
      if (colors.some(c => c.id === prevVal)) inColor.value = prevVal;
    }

    if (outShape && outColor) {
      const colors = getColorsForShape(outShape.value);
      const prevVal = outColor.value;
      outColor.innerHTML = colors.map(c => `<option value="${c.id}">${c.dot} ${c.name}</option>`).join('');
      if (colors.some(c => c.id === prevVal)) outColor.value = prevVal;
    }
  }

  function updateOutwardStockHint() {
    const outShape = document.getElementById('outShape');
    const outColor = document.getElementById('outColor');
    const outSize = document.getElementById('outSize');
    const hint = document.getElementById('outStockAvailableHint');
    if (!outShape || !outColor || !outSize || !hint) return;

    const qty = getStockQty(outShape.value, outColor.value, outSize.value);
    const shape = getShapeById(outShape.value);
    const color = getColorById(outColor.value);
    const size = getSizeById(outSize.value);
    const shapeLowLimit = getShapeSizeLowLimit(outShape.value, outSize.value);

    hint.textContent = `Current Stock for ${shape.name} - ${color.name} (${size.name}): ${qty} pieces`;
    if (qty <= 0) {
      hint.style.color = 'var(--accent-rose)';
      hint.textContent += ' (OUT OF STOCK!)';
    } else if (qty < shapeLowLimit) {
      hint.style.color = 'var(--accent-amber)';
      hint.textContent += ` (Low Stock Alert: < ${shapeLowLimit} pcs)`;
    } else {
      hint.style.color = 'var(--text-muted)';
    }
  }

  // 2. Render Dashboard KPIs & Overviews
  function renderDashboard() {
    let grandTotalUnits = 0;
    let lowStockCount = 0;
    const lowStockItems = [];
    let stockValuationCost = 0;
    let stockPotentialRevenue = 0;

    // Calculate totals, shape & size-wise valuation, and size-wise alert thresholds
    appState.settings.shapes.forEach(shape => {
      const colors = getColorsForShape(shape.id);

      colors.forEach(color => {
        appState.settings.sizes.forEach(size => {
          const qty = getStockQty(shape.id, color.id, size.id);
          const sizeCost = getShapeSizeCostPrice(shape.id, size.id);
          const sizeSell = getShapeSizeSellPrice(shape.id, size.id);
          const sizeLowLimit = getShapeSizeLowLimit(shape.id, size.id);

          grandTotalUnits += qty;
          stockValuationCost += (qty * sizeCost);
          stockPotentialRevenue += (qty * sizeSell);

          if (qty < sizeLowLimit) {
            lowStockCount++;
            lowStockItems.push({ shape, color, size, qty, lowLimit: sizeLowLimit });
          }
        });
      });
    });

    // Save low stock items to state for popup modal
    appState.lowStockItems = lowStockItems;

    // Calculate Sales KPIs
    let totalUnitsSold = 0;
    let totalRevenue = 0;
    appState.transactions.forEach(t => {
      if (t.type === 'OUT') {
        totalUnitsSold += (t.quantity || 0);
        totalRevenue += (t.total || 0);
      }
    });

    // Update KPI elements
    const kpiTotalUnits = document.getElementById('kpiTotalUnits');
    const kpiTotalBoxes = document.getElementById('kpiTotalBoxes');
    const kpiStockValuation = document.getElementById('kpiStockValuation');
    const kpiStockPotential = document.getElementById('kpiStockPotential');
    const kpiTotalSold = document.getElementById('kpiTotalSold');
    const kpiRevenue = document.getElementById('kpiRevenue');
    const kpiLowStockCount = document.getElementById('kpiLowStockCount');
    const kpiLowStockBadge = document.getElementById('kpiLowStockBadge');

    if (kpiTotalUnits) kpiTotalUnits.textContent = grandTotalUnits.toLocaleString('en-IN');
    if (kpiTotalBoxes) kpiTotalBoxes.textContent = `≈ ${Math.floor(grandTotalUnits / 100)} master cartons (100 pcs/box)`;
    if (kpiStockValuation) kpiStockValuation.textContent = formatCurrency(stockValuationCost);
    if (kpiStockPotential) kpiStockPotential.textContent = `Selling Realization: ${formatCurrency(stockPotentialRevenue)}`;
    if (kpiTotalSold) kpiTotalSold.textContent = totalUnitsSold.toLocaleString('en-IN') + ' pcs';
    if (kpiRevenue) kpiRevenue.textContent = `Total Sales: ${formatCurrency(totalRevenue)}`;
    if (kpiLowStockCount) kpiLowStockCount.textContent = lowStockCount;
    if (kpiLowStockBadge) kpiLowStockBadge.textContent = `${lowStockCount} SKUs Low`;

    // Highlight Low Stock KPI Card with exact item info & click trigger
    const kpiLowStockCard = document.getElementById('kpiLowStockCard');
    const kpiLowStockSub = document.getElementById('kpiLowStockSub');
    if (kpiLowStockCard) {
      if (lowStockCount > 0) {
        kpiLowStockCard.style.borderColor = '#f97316';
        kpiLowStockCard.style.background = 'rgba(249, 115, 22, 0.04)';
        if (kpiLowStockSub) {
          if (lowStockCount === 1) {
            const first = lowStockItems[0];
            kpiLowStockSub.innerHTML = `<span style="color:#ea580c; font-weight:700;">⚠️ ${first.shape.name} ${first.color.name} (${first.size.id}) • ${first.qty} pcs 👆 Tap for Popup</span>`;
          } else {
            kpiLowStockSub.innerHTML = `<span style="color:#ea580c; font-weight:700;">⚠️ ${lowStockCount} items low • 👆 Tap for Popup</span>`;
          }
        }
      } else {
        kpiLowStockCard.style.borderColor = '';
        kpiLowStockCard.style.background = '';
        if (kpiLowStockSub) {
          kpiLowStockSub.textContent = 'All healthy (Tap to check)';
          kpiLowStockSub.style.color = '';
        }
      }
    }

    renderChatGptCards();
    renderRecentTransactions();
    renderFastMovingSizes();
  }

  // ================= LOW STOCK MODAL POPUP =================
  window.gallopsOpenLowStockModal = function () {
    const modal = document.getElementById('lowStockModal');
    if (!modal) return;

    const content = document.getElementById('lowStockModalContent');
    const title = document.getElementById('lowStockModalTitle');
    const subtitle = document.getElementById('lowStockModalSubtitle');
    const note = document.getElementById('lowStockModalThresholdNote');

    if (note) note.textContent = 'Custom Shape-Wise Alert Limits Active (Configured in Settings)';

    const items = appState.lowStockItems || [];
    if (title) {
      title.textContent = items.length === 0 ? 'Stock Status: All Healthy' : `Low Stock Alert (${items.length} Item${items.length > 1 ? 's' : ''})`;
    }
    if (subtitle) {
      subtitle.textContent = items.length === 0 
        ? 'All products are currently well stocked above your safety limits.' 
        : 'The following shapes & sizes have dropped below their shape-wise reorder limits:';
    }

    if (content) {
      if (items.length === 0) {
        content.innerHTML = `
          <div style="text-align:center; padding: 2rem 1rem;">
            <div style="font-size: 2.75rem; margin-bottom: 0.5rem;">🎉</div>
            <h4 style="font-weight:800; font-size:1.15rem; color:var(--accent-emerald); margin:0 0 0.4rem 0;">All Stock Levels Are Healthy!</h4>
            <p class="text-muted" style="font-size:0.85rem; margin:0;">
              No cup shapes or sizes are currently below their shape-wise minimum limits.
            </p>
          </div>
        `;
      } else {
        content.innerHTML = `
          <div class="low-stock-modal-list">
            ${items.map(item => `
              <div class="low-stock-modal-item">
                <div class="low-stock-item-info">
                  <div class="low-stock-item-title">
                    <span style="font-size:1.3rem; line-height:1;">${item.shape.icon}</span>
                    <strong style="color:var(--text-primary); font-size:1rem;">${item.shape.name}</strong>
                    <span style="display:inline-flex; align-items:center; gap:4px; font-weight:700; color:${item.color.hex === '#ffffff' ? 'var(--text-secondary)' : item.color.hex};">
                      <span style="width:10px; height:10px; border-radius:50%; background:${item.color.hex}; display:inline-block; ${item.color.id === 'WHITE' ? 'border:1px solid #94a3b8;' : ''}"></span>
                      ${item.color.name}
                    </span>
                    <span class="chip-size-tag">${item.size.name}</span>
                  </div>
                  <div class="low-stock-item-qty">
                    <span class="qty-warning-pill">⚠️ ${item.qty} pcs remaining</span>
                    <span class="text-muted" style="font-size:0.75rem;">(Below shape limit of ${item.lowLimit} pcs)</span>
                  </div>
                </div>
                <div>
                  <button class="btn btn-in btn-sm" onclick="window.gallopsOrderSku('${item.shape.id}', '${item.color.id}', '${item.size.id}')" title="Fill Factory Stock In for this SKU">
                    + Inward Stock 📥
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }
    }

    modal.classList.remove('hidden');
  };

  window.gallopsCloseLowStockModal = function () {
    const modal = document.getElementById('lowStockModal');
    if (modal) modal.classList.add('hidden');
  };

  function setupLowStockModalControls() {
    document.getElementById('btnLowStockClose')?.addEventListener('click', window.gallopsCloseLowStockModal);
    document.getElementById('btnLowStockDismiss')?.addEventListener('click', window.gallopsCloseLowStockModal);
    document.getElementById('btnLowStockModalInward')?.addEventListener('click', () => {
      window.gallopsCloseLowStockModal();
      switchTab('inward');
    });

    const modal = document.getElementById('lowStockModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) window.gallopsCloseLowStockModal();
      });
    }

    const kpiCard = document.getElementById('kpiLowStockCard');
    if (kpiCard) {
      kpiCard.addEventListener('click', () => {
        window.gallopsOpenLowStockModal();
      });
    }
  }

  // Quick helper to jump to inward tab with SKU pre-selected
  window.gallopsOrderSku = function (shapeId, colorId, sizeId) {
    window.gallopsCloseLowStockModal();
    switchTab('inward');
    setTimeout(() => {
      const selShape = document.getElementById('inShape');
      const selColor = document.getElementById('inColor');
      const selSize = document.getElementById('inSize');
      if (selShape) {
        selShape.value = shapeId;
        selShape.dispatchEvent(new Event('change'));
      }
      if (selColor) {
        selColor.value = colorId;
        selColor.dispatchEvent(new Event('change'));
      }
      if (selSize) {
        selSize.value = sizeId;
        selSize.dispatchEvent(new Event('change'));
      }
      const qtyInput = document.getElementById('inQuantity');
      if (qtyInput) qtyInput.focus();
    }, 50);
  };

  // Render ChatGPT Mockup Style Product Cards
  function renderChatGptCards() {
    const container = document.getElementById('chatgptProductCardsContainer');
    if (!container) return;

    let html = '';
    appState.settings.shapes.forEach(shape => {
      const colors = getColorsForShape(shape.id);
      const colorCountText = `${colors.length} Colour${colors.length > 1 ? 's' : ''}`;
      const shapeDotColor = shape.id === 'REGULAR' ? '#f472b6' 
        : shape.id === 'BELL' ? '#ec4899' 
        : shape.id === 'SINGLE_FOLD' ? '#8b5cf6' 
        : shape.id === 'MULTI_FOLD' ? '#3b82f6' 
        : shape.id === 'GALLOPS_CUP' ? '#ec4899' 
        : shape.id === 'LSR' ? '#94a3b8' 
        : '#f59e0b';

      const shapeLowLimit = getShapeLowLimit(shape.id);
      let shapeHasLow = false;
      let colorSectionsHtml = '';

      colors.forEach(color => {
        let sizesColsHtml = '';

        appState.settings.sizes.forEach(size => {
          const qty = getStockQty(shape.id, color.id, size.id);
          const sizeLowLimit = getShapeSizeLowLimit(shape.id, size.id);
          const isLow = qty < sizeLowLimit;
          if (isLow) shapeHasLow = true;

          const sizeUpperName = size.id === 'S' ? 'SMALL' : size.id === 'M' ? 'MEDIUM' : 'LARGE';
          const lowClass = isLow ? 'is-low-stock' : '';
          const lowBadgeHtml = isLow 
            ? `<div class="cg-low-badge">⚠️ Low Stock (${qty}/${sizeLowLimit} pcs)</div>` 
            : '';

          sizesColsHtml += `
            <div class="cg-size-item ${lowClass}">
              <div class="cg-size-label">${sizeUpperName}</div>
              <div class="cg-size-val-row">
                <span class="cg-size-val" style="${isLow ? 'color:#ea580c;' : ''}">${qty}</span>
              </div>
              <div class="cg-size-unit">pcs</div>
              ${lowBadgeHtml}
            </div>
          `;
        });

        colorSectionsHtml += `
          <div class="cg-color-section">
            <div class="cg-color-title-row">
              <span class="cg-color-dot" style="background-color: ${color.hex}; ${color.id === 'WHITE' ? 'border: 1px solid #94a3b8;' : ''}"></span>
              <span class="cg-color-name">${color.name.toUpperCase()}</span>
            </div>
            <div class="cg-sizes-grid">
              ${sizesColsHtml}
            </div>
          </div>
        `;
      });

      const lowHeaderBadge = shapeHasLow 
        ? `<span class="cg-shape-low-pill">⚠️ Low Stock</span>` 
        : '';

      html += `
        <div class="cg-shape-card">
          <div class="cg-card-header">
            <div class="cg-card-title-wrap">
              <span class="cg-shape-bullet" style="background-color: ${shapeDotColor};"></span>
              <span class="cg-shape-name">${shape.name.toUpperCase()}</span>
              ${lowHeaderBadge}
            </div>
            <span class="cg-colours-badge">${colorCountText}</span>
          </div>
          <div class="cg-card-body">
            ${colorSectionsHtml}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // Quick Stepper Handler (+1 / -1)
  window.gallopsQuickStep = function (shapeId, colorId, sizeId, delta, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const current = getStockQty(shapeId, colorId, sizeId);
    const newQty = Math.max(0, current + delta);
    setStockQty(shapeId, colorId, sizeId, newQty);
    renderAll();
    const sign = delta > 0 ? '+' : '';
    showToast(`${sign}${delta} pc: ${getShapeById(shapeId).name} • ${getColorById(colorId).name} (${sizeId})`, 'success');
  };

  function renderRecentTransactions() {
    const tbody = document.getElementById('recentTransactionsTbody');
    if (!tbody) return;

    const recent = [...appState.transactions]
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, 6);

    if (recent.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted" style="padding:2rem;">No transactions yet. Add your first stock inward!</td></tr>`;
      return;
    }

    tbody.innerHTML = recent.map(t => {
      const shape = getShapeById(t.shapeId);
      const color = getColorById(t.colorId);
      const size = getSizeById(t.sizeId);

      const isOut = t.type === 'OUT';
      const typeBadge = isOut
        ? '<span class="tag-badge tag-out">OUT (Dispatch)</span>'
        : '<span class="tag-badge tag-in">IN (Factory)</span>';

      return `
        <tr>
          <td>${typeBadge}</td>
          <td>${formatDate(t.date)}</td>
          <td><strong>${shape.icon} ${shape.name}</strong> • ${color.name} (${size.name})</td>
          <td><strong style="color:${isOut ? 'var(--accent-pink)' : 'var(--accent-emerald)'};">${isOut ? '-' : '+'}${t.quantity}</strong></td>
          <td>${t.partyName || '-'}</td>
          <td>${t.reference || t.challanNo || '-'}</td>
        </tr>
      `;
    }).join('');
  }

  function renderFastMovingSizes() {
    const container = document.getElementById('fastMovingContainer');
    if (!container) return;

    const sizeStats = { S: 0, M: 0, L: 0 };
    appState.transactions.forEach(t => {
      if (t.type === 'OUT' && t.sizeId && sizeStats[t.sizeId] !== undefined) {
        sizeStats[t.sizeId] += (t.quantity || 0);
      }
    });

    const sortedSizes = Object.keys(sizeStats).sort((a, b) => sizeStats[b] - sizeStats[a]);

    container.innerHTML = sortedSizes.map((sz, idx) => {
      const sizeObj = getSizeById(sz);
      const rankBadge = idx === 0 ? '🥇 #1 Bestseller' : idx === 1 ? '🥈 #2 Moving' : '🥉 #3 Steady';
      return `
        <div class="fast-moving-item">
          <div>
            <div class="fast-moving-title">${sizeObj.name}</div>
            <div class="fast-moving-sub">${rankBadge}</div>
          </div>
          <div class="fast-moving-stat">${sizeStats[sz]} pcs dispatched</div>
        </div>
      `;
    }).join('');
  }

  // 3. Render Stock Matrix Grid (Matching User's Excel Sheet)
  function renderStockMatrix() {
    const tbody = document.getElementById('stockMatrixTbody');
    if (!tbody) return;

    let sizeTotals = {};
    appState.settings.sizes.forEach(sz => { sizeTotals[sz.id] = 0; });
    let grandTotal = 0;
    let rowsHtml = '';

    appState.settings.shapes.forEach(shape => {
      const colors = getColorsForShape(shape.id);

      colors.forEach((color, colorIdx) => {
        let rowTotal = 0;
        let cellsHtml = '';
        let rowLowLimitSum = 0;

        appState.settings.sizes.forEach(size => {
          const qty = getStockQty(shape.id, color.id, size.id);
          const sizeLowLimit = getShapeSizeLowLimit(shape.id, size.id);
          rowTotal += qty;
          rowLowLimitSum += sizeLowLimit;
          sizeTotals[size.id] = (sizeTotals[size.id] || 0) + qty;
          grandTotal += qty;

          let cellClass = '';
          if (qty === 0) cellClass = 'cell-empty';
          else if (qty < sizeLowLimit) cellClass = 'cell-low';

          cellsHtml += `
            <td>
              <div class="matrix-cell-box ${cellClass}" data-shape="${shape.id}" data-color="${color.id}" data-size="${size.id}">
                <div class="matrix-cell-qty">${qty}</div>
              </div>
            </td>
          `;
        });

        let statusBadge = '';
        if (rowTotal === 0) {
          statusBadge = '<span class="size-pill-status status-empty">Out of Stock</span>';
        } else if (rowTotal < rowLowLimitSum) {
          statusBadge = '<span class="size-pill-status status-low">Low Stock</span>';
        } else {
          statusBadge = '<span class="size-pill-status status-good">Healthy</span>';
        }

        // Show shape on every row for total clarity
        const isFirstColor = colorIdx === 0;
        const groupBorder = isFirstColor ? 'border-top: 2px solid var(--border-color);' : '';

        const shapeCell = `
          <td style="vertical-align:middle; text-align:left; background:var(--bg-secondary); border-right:1px solid var(--border-color); ${groupBorder}">
            <div class="matrix-shape-cell">
              <span class="shape-icon">${shape.icon}</span>
              <strong>${shape.name}</strong>
            </div>
          </td>
        `;

        rowsHtml += `
          <tr style="${groupBorder}">
            ${shapeCell}
            <td style="text-align:left;">
              <span class="color-pill">
                <span>${color.dot}</span>
                <span style="color:${color.hex}; font-weight:700;">${color.name}</span>
              </span>
            </td>
            ${cellsHtml}
            <td class="matrix-total-cell" style="font-weight:800; font-size:1.15rem;">${rowTotal}</td>
            <td>${statusBadge}</td>
          </tr>
        `;
      });
    });

    tbody.innerHTML = rowsHtml;

    // Dynamically update thead and tfoot to match active sizes
    const table = document.getElementById('stockMatrixTable');
    if (table) {
      const theadTr = table.querySelector('thead tr');
      if (theadTr) {
        const sizeThs = appState.settings.sizes.map(sz => `<th class="matrix-th-size" data-size="${sz.id}">${sz.name}</th>`).join('');
        theadTr.innerHTML = `
          <th class="matrix-th-shape">Cup Shape</th>
          <th class="matrix-th-color">Color</th>
          ${sizeThs}
          <th class="matrix-th-total">Total by Color</th>
          <th class="matrix-th-status">Status</th>
        `;
      }
      const tfootTr = table.querySelector('tfoot tr');
      if (tfootTr) {
        const sizeTds = appState.settings.sizes.map(sz => `<td><strong>${sizeTotals[sz.id] || 0}</strong></td>`).join('');
        tfootTr.innerHTML = `
          <td colspan="2"><strong>TOTAL BY SIZE</strong></td>
          ${sizeTds}
          <td id="matrixGrandTotal" style="font-weight:800; font-size:1.15rem;">${grandTotal}</td>
          <td>-</td>
        `;
      }
    }

    attachMatrixEventListeners();
    renderSkuCards();
  }

  function attachMatrixEventListeners() {
    // Read-only grid: direct cell adjustment is disabled.
    // Stock is only modified via Stock In or Stock Out transactions.
  }

  function renderSkuCards() {
    const container = document.getElementById('skuCardsGrid');
    if (!container) return;

    let html = '';
    appState.settings.shapes.forEach(shape => {
      const colors = getColorsForShape(shape.id);

      colors.forEach(color => {
        appState.settings.sizes.forEach(size => {
          const qty = getStockQty(shape.id, color.id, size.id);
          const sizeCost = getShapeSizeCostPrice(shape.id, size.id);
          const sizeLowLimit = getShapeSizeLowLimit(shape.id, size.id);
          const estValue = qty * sizeCost;

          let statusClass = qty === 0 ? 'status-empty' : qty < sizeLowLimit ? 'status-low' : 'status-good';
          let statusText = qty === 0 ? 'Out of Stock' : qty < sizeLowLimit ? 'Low Stock' : 'Adequate';

          html += `
            <div class="sku-card">
              <div>
                <div class="sku-card-tag">${shape.icon} ${shape.name}</div>
                <div class="sku-card-title">${color.dot} ${color.name} • ${size.name}</div>
                <div class="sku-card-qty">${qty} <span style="font-size:0.8rem; font-weight:500;">pcs</span></div>
              </div>
              <div>
                <span class="size-pill-status ${statusClass}">${statusText}</span>
                <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.4rem;">Val: ${formatCurrency(estValue)}</div>
              </div>
            </div>
          `;
        });
      });
    });

    container.innerHTML = html;
  }

  // 4. Render History Tables (Inward, Outward & Full Ledger)
  function renderHistoryTables() {
    renderInwardHistory();
    renderOutwardHistory();
    renderFullLedger();
  }

  function renderInwardHistory() {
    const tbody = document.getElementById('inwardHistoryTbody');
    if (!tbody) return;

    const inwardTxns = appState.transactions
      .filter(t => t.type === 'IN')
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, 10);

    if (inwardTxns.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted" style="padding:1.5rem;">No factory receipts recorded yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = inwardTxns.map(t => {
      const shape = getShapeById(t.shapeId);
      const color = getColorById(t.colorId);
      const size = getSizeById(t.sizeId);

      return `
        <tr>
          <td>${formatDate(t.date)}</td>
          <td><strong>${shape.icon} ${shape.name}</strong> • ${color.name} (${size.name})</td>
          <td><strong style="color:var(--accent-emerald);">+${t.quantity}</strong></td>
          <td>₹${t.rate || 0}</td>
          <td>${formatCurrency(t.total)}</td>
          <td>${t.reference || '-'}</td>
          <td>${t.challanNo || '-'}</td>
          <td>
            <button class="btn-link" style="color:var(--accent-rose);" onclick="window.gallopsDeleteTxn('${t.id}')">Delete</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderOutwardHistory() {
    const tbody = document.getElementById('outwardHistoryTbody');
    if (!tbody) return;

    const outwardTxns = appState.transactions
      .filter(t => t.type === 'OUT')
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, 10);

    if (outwardTxns.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted" style="padding:1.5rem;">No wholesale dispatches recorded yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = outwardTxns.map(t => {
      const shape = getShapeById(t.shapeId);
      const color = getColorById(t.colorId);
      const size = getSizeById(t.sizeId);

      let payBadgeClass = 'tag-pending';
      const statusUpper = (t.paymentStatus || 'PENDING').toUpperCase();
      if (statusUpper === 'CASH') payBadgeClass = 'tag-cash';
      else if (statusUpper === 'ACCOUNT') payBadgeClass = 'tag-account';
      else if (statusUpper === 'GPAY') payBadgeClass = 'tag-gpay';
      else if (statusUpper === 'PENDING') payBadgeClass = 'tag-pending';
      else if (statusUpper === 'PAID') payBadgeClass = 'tag-cash';

      return `
        <tr>
          <td>${formatDate(t.date)}</td>
          <td><strong>${t.partyName || 'Wholesale Buyer'}</strong><br><small class="text-muted">${t.city || ''}</small></td>
          <td>${shape.icon} ${shape.name} • ${color.name} (${size.name})</td>
          <td><strong style="color:var(--accent-pink);">-${t.quantity}</strong></td>
          <td>₹${t.rate || 0}</td>
          <td><strong>${formatCurrency(t.total)}</strong></td>
          <td><span class="tag-badge ${payBadgeClass}">${t.paymentStatus || 'PENDING'}</span></td>
          <td>
            <button class="btn-link" style="color:var(--accent-rose);" onclick="window.gallopsDeleteTxn('${t.id}')">Delete</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderFullLedger() {
    const tbody = document.getElementById('fullLedgerTbody');
    if (!tbody) return;

    const typeFilter = document.getElementById('filterLedgerType')?.value || 'ALL';
    const shapeFilter = document.getElementById('filterLedgerShape')?.value || 'ALL';
    const colorFilter = document.getElementById('filterLedgerColor')?.value || 'ALL';
    const sizeFilter = document.getElementById('filterLedgerSize')?.value || 'ALL';
    const searchFilter = (document.getElementById('filterLedgerSearch')?.value || '').toLowerCase().trim();

    let filtered = appState.transactions.filter(t => {
      if (typeFilter !== 'ALL' && t.type !== typeFilter) return false;
      if (shapeFilter !== 'ALL' && t.shapeId !== shapeFilter) return false;
      if (colorFilter !== 'ALL' && t.colorId !== colorFilter) return false;
      if (sizeFilter !== 'ALL' && t.sizeId !== sizeFilter) return false;

      if (searchFilter) {
        const text = `${t.partyName || ''} ${t.reference || ''} ${t.notes || ''} ${t.city || ''} ${t.id}`.toLowerCase();
        if (!text.includes(searchFilter)) return false;
      }
      return true;
    });

    filtered.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="12" class="text-center text-muted" style="padding:2rem;">No matching transaction records found.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map((t, idx) => {
      const shape = getShapeById(t.shapeId);
      const color = getColorById(t.colorId);
      const size = getSizeById(t.sizeId);

      const isOut = t.type === 'OUT';
      const typeBadge = isOut
        ? '<span class="tag-badge tag-out">OUT</span>'
        : '<span class="tag-badge tag-in">IN</span>';

      return `
        <tr>
          <td>${idx + 1}</td>
          <td>${typeBadge}</td>
          <td>${formatDate(t.date)}</td>
          <td><strong>${shape.icon} ${shape.name}</strong></td>
          <td>${color.dot} ${color.name}</td>
          <td><span style="font-weight:700;">${size.name}</span></td>
          <td><strong style="color:${isOut ? 'var(--accent-pink)' : 'var(--accent-emerald)'};">${isOut ? '-' : '+'}${t.quantity}</strong></td>
          <td>₹${t.rate || 0}</td>
          <td><strong>${formatCurrency(t.total)}</strong></td>
          <td>${t.partyName || '-'}</td>
          <td>${t.reference || t.challanNo || '-'}</td>
          <td>${t.notes || '-'}</td>
        </tr>
      `;
    }).join('');
  }

  // Master render
  function renderAll() {
    populateDropdowns();
    renderDashboard();
    renderStockMatrix();
    renderHistoryTables();
    renderShapePreferences();
    renderProductConfigCard();
  }

  // ================= TRANSACTION ACTIONS =================

  // Handle Form Stock In (Factory Receipt)
  function handleStockInSubmit(e) {
    e.preventDefault();

    const shapeId = document.getElementById('inShape').value;
    const colorId = document.getElementById('inColor').value;
    const sizeId = document.getElementById('inSize').value;
    const quantity = parseInt(document.getElementById('inQuantity').value, 10);
    const rate = parseFloat(document.getElementById('inCostPrice').value) || getShapeSizeCostPrice(shapeId, sizeId);
    const date = document.getElementById('inDate').value;
    const batchNumber = document.getElementById('inBatchNumber').value.trim();
    const supplier = document.getElementById('inSupplierName').value.trim();
    const challanNo = document.getElementById('inChallanNo').value.trim();
    const notes = document.getElementById('inNotes').value.trim();

    if (!shapeId || !colorId || !sizeId || !quantity || quantity <= 0) {
      showToast('Please enter valid shape, color, size, and quantity', 'error');
      return;
    }

    // Add to stock
    const current = getStockQty(shapeId, colorId, sizeId);
    setStockQty(shapeId, colorId, sizeId, current + quantity);

    // Create transaction
    const newTxn = {
      id: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
      type: 'IN',
      date: date,
      shapeId: shapeId,
      colorId: colorId,
      sizeId: sizeId,
      quantity: quantity,
      rate: rate,
      total: quantity * rate,
      partyName: supplier || 'Factory Supplier',
      reference: batchNumber || 'LOT-' + Date.now().toString().slice(-4),
      challanNo: challanNo,
      notes: notes,
      timestamp: Date.now()
    };

    appState.transactions.unshift(newTxn);
    saveTransactions();

    document.getElementById('formStockIn').reset();
    populateDropdowns();
    renderAll();

    showToast(`Successfully added ${quantity} cups to stock!`, 'success');
  }

  // Handle Form Stock Out (Wholesale Sale / Dispatch)
  function handleStockOutSubmit(e) {
    e.preventDefault();

    const shapeId = document.getElementById('outShape').value;
    const colorId = document.getElementById('outColor').value;
    const sizeId = document.getElementById('outSize').value;
    const quantity = parseInt(document.getElementById('outQuantity').value, 10);
    const rate = parseFloat(document.getElementById('outSellPrice').value) || getShapeSizeSellPrice(shapeId, sizeId);
    const date = document.getElementById('outDate').value;
    const buyerName = document.getElementById('outBuyerName').value.trim();
    const phone = document.getElementById('outBuyerPhone').value.trim();
    const city = document.getElementById('outBuyerCity').value.trim();
    const paymentStatus = document.getElementById('outPaymentStatus').value;
    const orderRef = document.getElementById('outOrderRef').value.trim();
    const notes = document.getElementById('outNotes').value.trim();

    if (!shapeId || !colorId || !sizeId || !quantity || quantity <= 0) {
      showToast('Please enter valid shape, color, size, and quantity', 'error');
      return;
    }

    const current = getStockQty(shapeId, colorId, sizeId);
    if (quantity > current) {
      showToast(`Cannot dispatch ${quantity} cups! Only ${current} cups available in stock.`, 'error');
      return;
    }

    // Deduct stock
    setStockQty(shapeId, colorId, sizeId, current - quantity);

    // Create transaction
    const newTxn = {
      id: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
      type: 'OUT',
      date: date,
      shapeId: shapeId,
      colorId: colorId,
      sizeId: sizeId,
      quantity: quantity,
      rate: rate,
      total: quantity * rate,
      partyName: buyerName,
      phone: phone,
      city: city,
      paymentStatus: paymentStatus,
      reference: orderRef || 'ORD-' + Date.now().toString().slice(-4),
      notes: notes,
      timestamp: Date.now()
    };

    appState.transactions.unshift(newTxn);
    saveTransactions();

    document.getElementById('formStockOut').reset();
    populateDropdowns();
    renderAll();

    showToast(`Dispatched ${quantity} cups to ${buyerName}!`, 'success');
  }

  // Delete Transaction with rollback option
  window.gallopsDeleteTxn = function (txnId) {
    const txn = appState.transactions.find(t => t.id === txnId);
    if (!txn) return;

    const confirmMsg = `Delete transaction #${txn.id} (${txn.type === 'IN' ? 'Inward' : 'Outward'} of ${txn.quantity} pcs)?\n\nNote: If you click OK, the stock count will automatically be reversed!`;
    if (!confirm(confirmMsg)) return;

    // Rollback stock
    const current = getStockQty(txn.shapeId, txn.colorId, txn.sizeId);
    if (txn.type === 'IN') {
      setStockQty(txn.shapeId, txn.colorId, txn.sizeId, Math.max(0, current - txn.quantity));
    } else {
      setStockQty(txn.shapeId, txn.colorId, txn.sizeId, current + txn.quantity);
    }

    appState.transactions = appState.transactions.filter(t => t.id !== txnId);
    saveTransactions();
    renderAll();

    showToast('Transaction removed & stock reversed.', 'info');
  };

  // ================= QUICK ADJUST MODAL =================
  window.gallopsOpenAdjust = function (shapeId, colorId, sizeId) {
    openAdjustModal(shapeId, colorId, sizeId);
  };

  function openAdjustModal(shapeId, colorId, sizeId) {
    appState.currentAdjustSku = { shapeId, colorId, sizeId };
    const shape = getShapeById(shapeId);
    const color = getColorById(colorId);
    const size = getSizeById(sizeId);
    const qty = getStockQty(shapeId, colorId, sizeId);

    document.getElementById('adjustModalTitle').textContent = `Adjust Stock Count`;
    document.getElementById('adjustModalSubtitle').textContent = `${shape.icon} ${shape.name} • ${color.dot} ${color.name} (${size.name})`;
    document.getElementById('adjustModalQtyInput').value = qty;

    const modal = document.getElementById('quickAdjustModal');
    if (modal) modal.classList.remove('hidden');
  }

  function closeAdjustModal() {
    const modal = document.getElementById('quickAdjustModal');
    if (modal) modal.classList.add('hidden');
    appState.currentAdjustSku = null;
  }

  function setupAdjustModalControls() {
    const input = document.getElementById('adjustModalQtyInput');

    document.getElementById('btnAdjustPlusOne')?.addEventListener('click', () => {
      input.value = Math.max(0, (parseInt(input.value, 10) || 0) + 1);
    });
    document.getElementById('btnAdjustPlusTen')?.addEventListener('click', () => {
      input.value = Math.max(0, (parseInt(input.value, 10) || 0) + 10);
    });
    document.getElementById('btnAdjustMinusOne')?.addEventListener('click', () => {
      input.value = Math.max(0, (parseInt(input.value, 10) || 0) - 1);
    });
    document.getElementById('btnAdjustMinusTen')?.addEventListener('click', () => {
      input.value = Math.max(0, (parseInt(input.value, 10) || 0) - 10);
    });

    document.getElementById('btnAdjustClose')?.addEventListener('click', closeAdjustModal);
    document.getElementById('btnAdjustCancel')?.addEventListener('click', closeAdjustModal);

    document.getElementById('btnAdjustSave')?.addEventListener('click', () => {
      if (!appState.currentAdjustSku) return;
      const { shapeId, colorId, sizeId } = appState.currentAdjustSku;
      const newQty = parseInt(input.value, 10);
      if (isNaN(newQty) || newQty < 0) {
        showToast('Please enter a valid positive number', 'error');
        return;
      }

      setStockQty(shapeId, colorId, sizeId, newQty);
      closeAdjustModal();
      renderAll();
      showToast('Stock count updated successfully!', 'success');
    });
  }

  // ================= TAB SWITCHING =================
  function switchTab(tabId) {
    document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.side-nav .nav-item').forEach(el => el.classList.remove('active'));

    const targetTab = document.getElementById(`tab-${tabId}`);
    const targetNav = document.querySelector(`.side-nav .nav-item[data-tab="${tabId}"]`);

    if (targetTab) targetTab.classList.add('active');
    if (targetNav) targetNav.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ================= EXPORTS & BACKUP =================
  function exportMatrixToCsv() {
    let csv = 'Cup Shape,Color,Small (S),Medium (M),Large (L),Total Pieces,Cost Rate (S/M/L),Estimated Value\n';

    appState.settings.shapes.forEach(shape => {
      const colors = getColorsForShape(shape.id);
      const cS = getShapeSizeCostPrice(shape.id, 'S');
      const cM = getShapeSizeCostPrice(shape.id, 'M');
      const cL = getShapeSizeCostPrice(shape.id, 'L');

      colors.forEach(color => {
        const qS = getStockQty(shape.id, color.id, 'S');
        const qM = getStockQty(shape.id, color.id, 'M');
        const qL = getStockQty(shape.id, color.id, 'L');
        const total = qS + qM + qL;
        const val = (qS * cS) + (qM * cM) + (qL * cL);

        csv += `"${shape.name}","${color.name}",${qS},${qM},${qL},${total},"S:₹${cS} M:₹${cM} L:₹${cL}",${val}\n`;
      });
    });

    downloadFile(csv, `gallops_stock_matrix_${getDateStamp()}.csv`, 'text/csv');
    showToast('Matrix CSV downloaded successfully!', 'success');
  }

  function exportFullLedgerToCsv() {
    let csv = 'Transaction ID,Type,Date,Shape,Color,Size,Quantity,Rate (INR),Total (INR),Party / Buyer,Reference,Notes\n';

    appState.transactions.forEach(t => {
      const shape = getShapeById(t.shapeId);
      const color = getColorById(t.colorId);
      const size = getSizeById(t.sizeId);
      csv += `"${t.id}","${t.type}","${t.date}","${shape.name}","${color.name}","${size.name}",${t.quantity},${t.rate || 0},${t.total || 0},"${t.partyName || ''}","${t.reference || ''}","${(t.notes || '').replace(/"/g, '""')}"\n`;
    });

    downloadFile(csv, `gallops_stock_ledger_${getDateStamp()}.csv`, 'text/csv');
    showToast('Full Ledger CSV downloaded!', 'success');
  }

  function downloadJsonBackup() {
    const backupData = {
      appName: 'Gallops Wholesale Stock Application',
      exportDate: new Date().toISOString(),
      settings: appState.settings,
      stock: appState.stock,
      transactions: appState.transactions
    };

    downloadFile(JSON.stringify(backupData, null, 2), `gallops_stock_backup_${getDateStamp()}.json`, 'application/json');
    showToast('Complete backup file downloaded!', 'success');
  }

  function restoreFromJsonFile(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const data = JSON.parse(e.target.result);
        if (data.stock && data.transactions) {
          appState.stock = data.stock;
          appState.transactions = data.transactions;
          if (data.settings) appState.settings = data.settings;

          saveStock();
          saveTransactions();
          saveSettings();

          renderAll();
          showToast('Data successfully restored from backup!', 'success');
        } else {
          showToast('Invalid backup file format.', 'error');
        }
      } catch (err) {
        showToast('Error reading backup file.', 'error');
      }
    };
    reader.readAsText(file);
  }

  function getDateStamp() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  // ================= SHAPE & SIZE-WISE PREFERENCES (LIMITS & PRICES) =================
  function renderShapePreferences() {
    const tbody = document.getElementById('shapePreferencesTbody');
    if (!tbody) return;

    let rowsHtml = '';
    const sizes = appState.settings.sizes;
    const firstSizeId = sizes[0]?.id || 'S';

    appState.settings.shapes.forEach((shape, shapeIdx) => {
      const isStandardShape = DEFAULT_SHAPES.some(d => d.id === shape.id);
      sizes.forEach((sz, szIdx) => {
        const isFirst = szIdx === 0;
        const lowLimit = getShapeSizeLowLimit(shape.id, sz.id);
        const cost = getShapeSizeCostPrice(shape.id, sz.id);
        const sell = getShapeSizeSellPrice(shape.id, sz.id);

        const groupBorder = isFirst ? 'border-top: 2px solid var(--border-color);' : '';
        const sizeTagClass = sz.id === 'S' ? 'size-s' : sz.id === 'M' ? 'size-m' : sz.id === 'L' ? 'size-l' : 'size-m';

        const shapeCell = isFirst ? `
          <td rowspan="${sizes.length}" class="shape-pref-shape-cell" style="${groupBorder}">
            <div class="shape-pref-shape-card">
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <span style="font-size:1.4rem; line-height:1;">${shape.icon || '🏆'}</span>
                <div>
                  <div style="display:flex; align-items:center; gap:0.4rem; flex-wrap:wrap;">
                    <strong style="color:var(--text-primary); font-size:0.95rem;">${shapeIdx + 1}. ${shape.name}</strong>
                    ${!isStandardShape ? '<span class="badge-tag-custom">Custom</span>' : ''}
                  </div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">${shape.colors ? shape.colors.join(', ') : ''}</div>
                </div>
              </div>
              <div style="display:flex; gap:0.4rem; align-items:center; flex-wrap:wrap; margin-top:0.4rem;">
                <button type="button" class="btn-copy-sizes" onclick="window.gallopsCopySizeToAll('${shape.id}', '${firstSizeId}')" title="Copy ${firstSizeId} price & limit to all sizes for this shape">
                  ⚡ Copy ${firstSizeId} to All Sizes
                </button>
                ${!isStandardShape ? `
                  <button type="button" onclick="window.gallopsDeleteShape('${shape.id}')" style="background:transparent; border:none; color:#ef4444; font-size:0.75rem; cursor:pointer; padding:2px 4px;" title="Delete custom shape">
                    🗑️ Remove
                  </button>
                ` : ''}
              </div>
            </div>
          </td>
        ` : '';

        rowsHtml += `
          <tr data-shape-id="${shape.id}" data-size-id="${sz.id}" style="${groupBorder}">
            ${shapeCell}
            <td>
              <span class="size-pref-tag ${sizeTagClass}">${sz.name}</span>
            </td>
            <td style="text-align:right;">
              <input type="number" min="0" step="1" class="shape-pref-input" data-shape="${shape.id}" data-size="${sz.id}" data-field="lowLimit" value="${lowLimit}">
            </td>
            <td style="text-align:right;">
              <input type="number" min="0" step="0.5" class="shape-pref-input" data-shape="${shape.id}" data-size="${sz.id}" data-field="cost" value="${cost}">
            </td>
            <td style="text-align:right;">
              <input type="number" min="0" step="0.5" class="shape-pref-input" data-shape="${shape.id}" data-size="${sz.id}" data-field="sell" value="${sell}">
            </td>
          </tr>
        `;
      });
    });

    tbody.innerHTML = rowsHtml;
  }

  window.gallopsCopySizeToAll = function (shapeId, sourceSizeId = 'S') {
    const sLow = document.querySelector(`input[data-shape="${shapeId}"][data-size="${sourceSizeId}"][data-field="lowLimit"]`)?.value;
    const sCost = document.querySelector(`input[data-shape="${shapeId}"][data-size="${sourceSizeId}"][data-field="cost"]`)?.value;
    const sSell = document.querySelector(`input[data-shape="${shapeId}"][data-size="${sourceSizeId}"][data-field="sell"]`)?.value;

    appState.settings.sizes.filter(sz => sz.id !== sourceSizeId).forEach(target => {
      const targetSize = target.id;
      const lowInput = document.querySelector(`input[data-shape="${shapeId}"][data-size="${targetSize}"][data-field="lowLimit"]`);
      const costInput = document.querySelector(`input[data-shape="${shapeId}"][data-size="${targetSize}"][data-field="cost"]`);
      const sellInput = document.querySelector(`input[data-shape="${shapeId}"][data-size="${targetSize}"][data-field="sell"]`);

      if (lowInput && sLow !== undefined) lowInput.value = sLow;
      if (costInput && sCost !== undefined) costInput.value = sCost;
      if (sellInput && sSell !== undefined) sellInput.value = sSell;
    });

    const shape = getShapeById(shapeId);
    showToast(`Copied ${sourceSizeId} values to all sizes for ${shape.name}. Click 'Save' to apply.`, 'info');
  };

  function setupShapePreferencesHandlers() {
    const saveBtn = document.getElementById('btnSaveShapePreferences');
    if (!saveBtn) return;

    saveBtn.addEventListener('click', () => {
      const tbody = document.getElementById('shapePreferencesTbody');
      if (!tbody) return;

      if (!appState.settings.shapePreferences) {
        appState.settings.shapePreferences = {};
      }

      const rows = tbody.querySelectorAll('tr[data-shape-id][data-size-id]');
      rows.forEach(row => {
        const shapeId = row.dataset.shapeId;
        const sizeId = row.dataset.sizeId;
        const lowLimitInput = row.querySelector('input[data-field="lowLimit"]');
        const costInput = row.querySelector('input[data-field="cost"]');
        const sellInput = row.querySelector('input[data-field="sell"]');

        const lowLimit = parseInt(lowLimitInput?.value, 10);
        const cost = parseFloat(costInput?.value);
        const sell = parseFloat(sellInput?.value);

        if (!appState.settings.shapePreferences[shapeId]) {
          appState.settings.shapePreferences[shapeId] = { sizes: {} };
        }
        if (!appState.settings.shapePreferences[shapeId].sizes) {
          appState.settings.shapePreferences[shapeId].sizes = {};
        }

        const defForSize = DEFAULT_SHAPE_PREFERENCES[shapeId]?.sizes?.[sizeId] || { lowLimit: 50, cost: 45, sell: 95 };

        appState.settings.shapePreferences[shapeId].sizes[sizeId] = {
          lowLimit: isNaN(lowLimit) ? defForSize.lowLimit : lowLimit,
          cost: isNaN(cost) ? defForSize.cost : cost,
          sell: isNaN(sell) ? defForSize.sell : sell
        };
      });

      // Maintain legacy top-level cost/sell/lowLimit for backward compatibility
      Object.keys(appState.settings.shapePreferences).forEach(sId => {
        const sPref = appState.settings.shapePreferences[sId];
        if (sPref && sPref.sizes) {
          sPref.lowLimit = sPref.sizes['M']?.lowLimit ?? sPref.sizes['S']?.lowLimit ?? 50;
          sPref.cost = sPref.sizes['M']?.cost ?? sPref.sizes['S']?.cost ?? 45;
          sPref.sell = sPref.sizes['M']?.sell ?? sPref.sizes['S']?.sell ?? 95;
        }
      });

      saveSettings();
      renderAll();
      showToast('Size-wise cost, selling prices & limits saved successfully!', 'success');
    });
  }

  // ================= CUP SHAPES & SIZES CONFIGURATION & ADDITION =================
  function renderProductConfigCard() {
    const shapeContainer = document.getElementById('shapeRenameInputs');
    const sizeContainer = document.getElementById('sizeRenameInputs');

    if (shapeContainer) {
      shapeContainer.innerHTML = appState.settings.shapes.map((shape, idx) => {
        const isStandard = DEFAULT_SHAPES.some(d => d.id === shape.id);
        const colorBadges = (shape.colors || []).map(cid => {
          const col = DEFAULT_COLORS.find(c => c.id === cid);
          return `<span style="font-size:0.75rem; color:var(--text-secondary); background:var(--bg-card); padding:2px 7px; border-radius:4px; border:1px solid var(--border-color);">${col?.dot || ''} ${col?.name || cid}</span>`;
        }).join(' ');

        return `
          <div class="product-config-item" style="margin-bottom:0.5rem;">
            <div style="display:flex; align-items:center; gap:0.65rem; min-width:0;">
              <span style="font-size:1.35rem; line-height:1;">${shape.icon || '🏆'}</span>
              <div>
                <div style="display:flex; align-items:center; gap:0.45rem; flex-wrap:wrap;">
                  <strong style="font-size:0.92rem; color:var(--text-primary);">${idx + 1}. ${shape.name}</strong>
                  ${isStandard ? '<span class="badge-tag-standard">Standard Shape</span>' : '<span class="badge-tag-custom">Custom Product</span>'}
                </div>
                <div style="display:flex; gap:0.35rem; align-items:center; flex-wrap:wrap; margin-top:3px;">
                  ${colorBadges}
                </div>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              ${!isStandard ? `
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="window.gallopsDeleteShape('${shape.id}')" title="Delete custom product" style="font-size:0.78rem; padding:0.25rem 0.55rem; color:#ef4444; border:1px solid rgba(239,68,68,0.3); background:transparent; border-radius:4px; cursor:pointer;">
                  🗑️ Delete
                </button>
              ` : `
                <span style="font-size:0.78rem; color:var(--text-muted);">Standard</span>
              `}
            </div>
          </div>
        `;
      }).join('');
    }

    if (sizeContainer) {
      sizeContainer.innerHTML = appState.settings.sizes.map(sz => {
        const isStandard = DEFAULT_SIZES.some(d => d.id === sz.id);
        return `
          <div class="product-config-item" style="margin-bottom:0.5rem;">
            <div style="display:flex; align-items:center; gap:0.65rem;">
              <span style="font-size:1.15rem; line-height:1;">📏</span>
              <div style="display:flex; align-items:center; gap:0.45rem; flex-wrap:wrap;">
                <strong style="font-size:0.92rem; color:var(--text-primary);">${sz.name}</strong>
                <code style="font-size:0.75rem; background:var(--bg-tertiary); padding:2px 5px; border-radius:4px; color:var(--text-secondary);">${sz.id}</code>
                ${isStandard ? '<span class="badge-tag-standard">Standard Size</span>' : '<span class="badge-tag-custom">Custom Size</span>'}
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              ${!isStandard ? `
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="window.gallopsDeleteSize('${sz.id}')" title="Delete custom size" style="font-size:0.78rem; padding:0.25rem 0.55rem; color:#ef4444; border:1px solid rgba(239,68,68,0.3); background:transparent; border-radius:4px; cursor:pointer;">
                  🗑️ Delete
                </button>
              ` : `
                <span style="font-size:0.78rem; color:var(--text-muted);">Standard</span>
              `}
            </div>
          </div>
        `;
      }).join('');
    }
  }

  function openAddShapeModal() {
    const modal = document.getElementById('addShapeModal');
    if (!modal) return;
    const form = document.getElementById('formAddNewShape');
    if (form) form.reset();

    const nameInput = document.getElementById('newShapeName');
    if (nameInput) nameInput.value = '';

    const iconInput = document.getElementById('newShapeIcon');
    if (iconInput) iconInput.value = '🏆';

    // Populate colors checkboxes
    const colorsContainer = document.getElementById('newShapeColorCheckboxes');
    if (colorsContainer) {
      colorsContainer.innerHTML = DEFAULT_COLORS.map((c, i) => `
        <label class="color-checkbox-label" style="display:flex; align-items:center; gap:0.4rem; padding:0.4rem 0.75rem; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:6px; cursor:pointer; font-size:0.85rem; user-select:none;">
          <input type="checkbox" name="shapeColors" value="${c.id}" ${i === 0 ? 'checked' : ''} style="cursor:pointer; width:16px; height:16px;">
          <span>${c.dot || '🎨'} <strong>${c.name}</strong></span>
        </label>
      `).join('');
    }

    // Populate size rows
    const sizesContainer = document.getElementById('newShapeSizesInputsContainer');
    if (sizesContainer) {
      let rowsHtml = '';
      appState.settings.sizes.forEach(sz => {
        rowsHtml += `
          <tr>
            <td style="font-weight:700; color:var(--text-primary);">${sz.name}</td>
            <td style="text-align:right;">
              <input type="number" min="0" step="1" class="form-control form-control-sm new-shape-size-low" data-size="${sz.id}" value="50" style="text-align:right; width:110px; display:inline-block;" required>
            </td>
            <td style="text-align:right;">
              <input type="number" min="0" step="0.5" class="form-control form-control-sm new-shape-size-cost" data-size="${sz.id}" value="45" style="text-align:right; width:110px; display:inline-block;" required>
            </td>
            <td style="text-align:right;">
              <input type="number" min="0" step="0.5" class="form-control form-control-sm new-shape-size-sell" data-size="${sz.id}" value="95" style="text-align:right; width:110px; display:inline-block;" required>
            </td>
          </tr>
        `;
      });
      sizesContainer.innerHTML = `
        <table class="data-table" style="width:100%; font-size:0.85rem;">
          <thead>
            <tr>
              <th>Cup Size</th>
              <th style="text-align:right;">⚠️ Low Alert Limit (Pcs)</th>
              <th style="text-align:right;">🏭 Factory Cost Price (₹)</th>
              <th style="text-align:right;">🛒 Wholesale Sell Price (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      `;
    }

    modal.classList.remove('hidden');
    if (nameInput) nameInput.focus();
  }

  function closeAddShapeModal() {
    const modal = document.getElementById('addShapeModal');
    if (modal) modal.classList.add('hidden');
  }

  function openAddSizeModal() {
    const modal = document.getElementById('addSizeModal');
    if (!modal) return;
    const form = document.getElementById('formAddNewSize');
    if (form) form.reset();
    const codeInput = document.getElementById('newSizeCode');
    if (codeInput) {
      codeInput.value = '';
      codeInput.focus();
    }
    const nameInput = document.getElementById('newSizeName');
    if (nameInput) nameInput.value = '';
    modal.classList.remove('hidden');
  }

  function closeAddSizeModal() {
    const modal = document.getElementById('addSizeModal');
    if (modal) modal.classList.add('hidden');
  }

  function handleAddNewShapeSubmit(e) {
    e.preventDefault();
    const nameInput = document.getElementById('newShapeName');
    const iconInput = document.getElementById('newShapeIcon');
    const shapeName = nameInput ? nameInput.value.trim() : '';
    const icon = iconInput && iconInput.value.trim() ? iconInput.value.trim() : '🏆';

    if (!shapeName) {
      showToast('Please enter a cup shape or product name', 'error');
      return;
    }

    // Selected colors
    const checkedColors = Array.from(document.querySelectorAll('input[name="shapeColors"]:checked')).map(cb => cb.value);
    if (checkedColors.length === 0) {
      showToast('Please select at least one available color for this shape', 'error');
      return;
    }

    // Check duplicate name
    if (appState.settings.shapes.some(s => s.name.toLowerCase() === shapeName.toLowerCase())) {
      showToast(`A shape named "${shapeName}" already exists!`, 'error');
      return;
    }

    // Generate unique ID
    const slug = shapeName.toUpperCase().replace(/[^A-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '').substring(0, 14);
    const shapeId = 'SHAPE_' + (slug || 'CUSTOM') + '_' + Date.now().toString(36).toUpperCase();

    // Read size preferences from modal inputs
    const sizesPrefs = {};
    appState.settings.sizes.forEach(sz => {
      const lowEl = document.querySelector(`.new-shape-size-low[data-size="${sz.id}"]`);
      const costEl = document.querySelector(`.new-shape-size-cost[data-size="${sz.id}"]`);
      const sellEl = document.querySelector(`.new-shape-size-sell[data-size="${sz.id}"]`);

      const lowLimit = parseInt(lowEl?.value, 10);
      const cost = parseFloat(costEl?.value);
      const sell = parseFloat(sellEl?.value);

      sizesPrefs[sz.id] = {
        lowLimit: isNaN(lowLimit) ? 50 : lowLimit,
        cost: isNaN(cost) ? 45 : cost,
        sell: isNaN(sell) ? 95 : sell
      };
    });

    const newShape = {
      id: shapeId,
      name: shapeName,
      icon: icon,
      colors: checkedColors,
      isCustom: true
    };

    appState.settings.shapes.push(newShape);

    if (!appState.settings.shapePreferences) {
      appState.settings.shapePreferences = {};
    }
    appState.settings.shapePreferences[shapeId] = {
      sizes: sizesPrefs,
      lowLimit: sizesPrefs['M']?.lowLimit ?? sizesPrefs['S']?.lowLimit ?? 50,
      cost: sizesPrefs['M']?.cost ?? sizesPrefs['S']?.cost ?? 45,
      sell: sizesPrefs['M']?.sell ?? sizesPrefs['S']?.sell ?? 95
    };

    // Initialize stock for this shape to 0
    checkedColors.forEach(c => {
      appState.settings.sizes.forEach(sz => {
        const key = getSkuKey(shapeId, c, sz.id);
        if (appState.stock[key] === undefined) {
          appState.stock[key] = 0;
        }
      });
    });

    saveSettings();
    saveStock();
    renderAll();
    closeAddShapeModal();
    showToast(`✅ "${shapeName}" added to inventory with custom limits & prices!`, 'success');
  }

  function handleAddNewSizeSubmit(e) {
    e.preventDefault();
    const codeInput = document.getElementById('newSizeCode');
    const nameInput = document.getElementById('newSizeName');

    const rawCode = codeInput ? codeInput.value.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '') : '';
    const name = nameInput ? nameInput.value.trim() : '';

    if (!rawCode || !name) {
      showToast('Please enter both size code and display name', 'error');
      return;
    }

    if (appState.settings.sizes.some(s => s.id === rawCode)) {
      showToast(`Size code "${rawCode}" already exists!`, 'error');
      return;
    }

    const newSize = {
      id: rawCode,
      name: name,
      label: name,
      isCustom: true
    };

    appState.settings.sizes.push(newSize);

    // Initialize preference for all shapes for this new size
    if (!appState.settings.shapePreferences) {
      appState.settings.shapePreferences = {};
    }
    appState.settings.shapes.forEach(shape => {
      if (!appState.settings.shapePreferences[shape.id]) {
        appState.settings.shapePreferences[shape.id] = { sizes: {} };
      }
      if (!appState.settings.shapePreferences[shape.id].sizes) {
        appState.settings.shapePreferences[shape.id].sizes = {};
      }
      if (!appState.settings.shapePreferences[shape.id].sizes[rawCode]) {
        appState.settings.shapePreferences[shape.id].sizes[rawCode] = {
          lowLimit: 50,
          cost: 45,
          sell: 95
        };
      }

      // Initialize stock for all allowed colors for this shape
      const allowedColors = shape.colors || ['PINK'];
      allowedColors.forEach(c => {
        const key = getSkuKey(shape.id, c, rawCode);
        if (appState.stock[key] === undefined) {
          appState.stock[key] = 0;
        }
      });
    });

    saveSettings();
    saveStock();
    renderAll();
    closeAddSizeModal();
    showToast(`✅ Size "${name}" (${rawCode}) added to all shapes!`, 'success');
  }

  window.gallopsDeleteShape = function (shapeId) {
    const shape = appState.settings.shapes.find(s => s.id === shapeId);
    if (!shape) return;
    if (DEFAULT_SHAPES.some(d => d.id === shapeId)) {
      showToast('Standard built-in shapes cannot be deleted.', 'error');
      return;
    }

    if (!confirm(`Are you sure you want to remove "${shape.name}"?\nExisting transaction history will be preserved.`)) {
      return;
    }

    appState.settings.shapes = appState.settings.shapes.filter(s => s.id !== shapeId);
    if (appState.settings.shapePreferences && appState.settings.shapePreferences[shapeId]) {
      delete appState.settings.shapePreferences[shapeId];
    }

    saveSettings();
    renderAll();
    showToast(`Removed "${shape.name}".`, 'info');
  };

  window.gallopsDeleteSize = function (sizeId) {
    const sz = appState.settings.sizes.find(s => s.id === sizeId);
    if (!sz) return;
    if (DEFAULT_SIZES.some(d => d.id === sizeId)) {
      showToast('Standard built-in sizes (S, M, L) cannot be deleted.', 'error');
      return;
    }

    if (!confirm(`Are you sure you want to remove size "${sz.name}" (${sizeId})?`)) {
      return;
    }

    appState.settings.sizes = appState.settings.sizes.filter(s => s.id !== sizeId);
    if (appState.settings.shapePreferences) {
      Object.keys(appState.settings.shapePreferences).forEach(sId => {
        const pref = appState.settings.shapePreferences[sId];
        if (pref && pref.sizes && pref.sizes[sizeId]) {
          delete pref.sizes[sizeId];
        }
      });
    }

    saveSettings();
    renderAll();
    showToast(`Removed size "${sz.name}".`, 'info');
  };

  function setupProductConfigControls() {
    // Open Shape Modal
    document.getElementById('btnOpenAddShapeModal')?.addEventListener('click', openAddShapeModal);
    document.getElementById('btnOpenAddShapeModalFromTable')?.addEventListener('click', openAddShapeModal);
    document.getElementById('btnAddShapeClose')?.addEventListener('click', closeAddShapeModal);
    document.getElementById('btnAddShapeCancel')?.addEventListener('click', closeAddShapeModal);

    // Open Size Modal
    document.getElementById('btnOpenAddSizeModal')?.addEventListener('click', openAddSizeModal);
    document.getElementById('btnAddSizeClose')?.addEventListener('click', closeAddSizeModal);
    document.getElementById('btnAddSizeCancel')?.addEventListener('click', closeAddSizeModal);

    // Outside clicks
    const addShapeModal = document.getElementById('addShapeModal');
    if (addShapeModal) {
      addShapeModal.addEventListener('click', (e) => {
        if (e.target === addShapeModal) closeAddShapeModal();
      });
    }

    const addSizeModal = document.getElementById('addSizeModal');
    if (addSizeModal) {
      addSizeModal.addEventListener('click', (e) => {
        if (e.target === addSizeModal) closeAddSizeModal();
      });
    }

    // Forms submit
    document.getElementById('formAddNewShape')?.addEventListener('submit', handleAddNewShapeSubmit);
    document.getElementById('formAddNewSize')?.addEventListener('submit', handleAddNewSizeSubmit);
  }

  // ================= 5 USER-FRIENDLY THEMES & COLOR PICKER =================
  const THEME_OPTIONS = [
    {
      id: 'theme-clean',
      name: 'Clean Slate & Pure White',
      icon: '⚪',
      badge: 'Recommended',
      desc: 'Crisp white & cool slate. High contrast, zero eye strain.',
      swatches: ['#f8fafc', '#ffffff', '#2563eb', '#0f172a']
    },
    {
      id: 'theme-rose',
      name: 'Gallops Rose & Pink',
      icon: '🌸',
      badge: 'Brand Signature',
      desc: 'Signature warm Gallops rose and soft berry accents.',
      swatches: ['#fff5f7', '#ffffff', '#db2777', '#881337']
    },
    {
      id: 'theme-blue',
      name: 'Corporate Navy & Sky Blue',
      icon: '🔵',
      badge: 'ERP Style',
      desc: 'Professional sapphire and fresh blue corporate tone.',
      swatches: ['#f0f7ff', '#ffffff', '#0284c7', '#0c4a6e']
    },
    {
      id: 'theme-emerald',
      name: 'Emerald Business Mint',
      icon: '🟢',
      badge: 'Restful Accounting',
      desc: 'Peaceful, natural mint green for comfortable wholesale work.',
      swatches: ['#f0fdf4', '#ffffff', '#059669', '#064e3b']
    },
    {
      id: 'theme-dark',
      name: 'Night Owl OLED Dark',
      icon: '🌙',
      badge: 'Low Light',
      desc: 'Deep charcoal dark mode for night shifts & battery saving.',
      swatches: ['#0f111a', '#161926', '#8b5cf6', '#f8fafc']
    }
  ];

  function getActiveTheme() {
    let saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (!saved || saved === 'theme-light') return 'theme-clean';
    return saved;
  }

  function applyTheme(themeId) {
    document.body.classList.remove('theme-clean', 'theme-light', 'theme-rose', 'theme-blue', 'theme-emerald', 'theme-dark');
    document.body.classList.add(themeId);
    localStorage.setItem(STORAGE_KEYS.THEME, themeId);
    renderThemePickers();
  }

  function renderThemePickers() {
    const active = getActiveTheme();
    const containers = [
      document.getElementById('themePickerGridModal'),
      document.getElementById('themePickerGridSettings')
    ];

    const html = THEME_OPTIONS.map(opt => {
      const isActive = (active === opt.id) || (opt.id === 'theme-clean' && (active === 'theme-light' || !active));
      const activeClass = isActive ? 'is-active' : '';
      return `
        <div class="theme-choice-card ${activeClass}" onclick="window.gallopsSelectTheme('${opt.id}')">
          <div class="theme-card-top">
            <div class="theme-card-title">
              <span>${opt.icon}</span>
              <span>${opt.name}</span>
            </div>
            <span class="theme-active-tag">Active ✓</span>
          </div>
          <div class="theme-card-desc">${opt.desc}</div>
          <div class="theme-swatches">
            ${opt.swatches.map(c => `<span class="theme-swatch" style="background-color: ${c};"></span>`).join('')}
          </div>
        </div>
      `;
    }).join('');

    containers.forEach(c => {
      if (c) c.innerHTML = html;
    });
  }

  window.gallopsSelectTheme = function (themeId) {
    applyTheme(themeId);
    const chosen = THEME_OPTIONS.find(t => t.id === themeId);
    showToast(`Layout color set to: ${chosen ? chosen.name : themeId}`, 'success');
  };

  window.gallopsOpenThemeModal = function () {
    renderThemePickers();
    document.getElementById('themeChoiceModal')?.classList.remove('hidden');
  };

  window.gallopsCloseThemeModal = function () {
    document.getElementById('themeChoiceModal')?.classList.add('hidden');
  };

  function setupThemeSystem() {
    applyTheme(getActiveTheme());
    renderThemePickers();

    document.getElementById('btnOpenThemeModal')?.addEventListener('click', window.gallopsOpenThemeModal);
    document.getElementById('btnThemeChoiceClose')?.addEventListener('click', window.gallopsCloseThemeModal);
    document.getElementById('btnThemeChoiceDone')?.addEventListener('click', window.gallopsCloseThemeModal);

    const modal = document.getElementById('themeChoiceModal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) window.gallopsCloseThemeModal();
      });
    }
  }

  // ================= INITIALIZATION =================
  function init() {
    setupThemeSystem();
    populateDropdowns();
    renderAll();
    setupAdjustModalControls();
    setupLowStockModalControls();
    setupShapePreferencesHandlers();
    setupProductConfigControls();

    // Nav Click handlers
    document.querySelectorAll('.side-nav .nav-item').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Header Quick Buttons
    document.getElementById('btnQuickIn')?.addEventListener('click', () => switchTab('inward'));
    document.getElementById('btnQuickOut')?.addEventListener('click', () => switchTab('outward'));
    document.getElementById('btnGoToMatrix')?.addEventListener('click', () => switchTab('matrix'));
    document.getElementById('btnSeeAllLedger')?.addEventListener('click', () => switchTab('ledger'));

    // Forms
    document.getElementById('formStockIn')?.addEventListener('submit', handleStockInSubmit);
    document.getElementById('formStockOut')?.addEventListener('submit', handleStockOutSubmit);

    // Dynamic color, price and stock hints when changing dropdowns
    document.getElementById('inShape')?.addEventListener('change', () => {
      updateColorDropdowns();
      const inShapeEl = document.getElementById('inShape');
      const inSizeEl = document.getElementById('inSize');
      const inCostPrice = document.getElementById('inCostPrice');
      if (inCostPrice && inShapeEl && inSizeEl) inCostPrice.value = getShapeSizeCostPrice(inShapeEl.value, inSizeEl.value);
    });

    document.getElementById('inSize')?.addEventListener('change', () => {
      const inShapeEl = document.getElementById('inShape');
      const inSizeEl = document.getElementById('inSize');
      const inCostPrice = document.getElementById('inCostPrice');
      if (inCostPrice && inShapeEl && inSizeEl) inCostPrice.value = getShapeSizeCostPrice(inShapeEl.value, inSizeEl.value);
    });

    document.getElementById('outShape')?.addEventListener('change', () => {
      updateColorDropdowns();
      const outShapeEl = document.getElementById('outShape');
      const outSizeEl = document.getElementById('outSize');
      const outSellPrice = document.getElementById('outSellPrice');
      if (outSellPrice && outShapeEl && outSizeEl) outSellPrice.value = getShapeSizeSellPrice(outShapeEl.value, outSizeEl.value);
      updateOutwardStockHint();
    });

    document.getElementById('outSize')?.addEventListener('change', () => {
      const outShapeEl = document.getElementById('outShape');
      const outSizeEl = document.getElementById('outSize');
      const outSellPrice = document.getElementById('outSellPrice');
      if (outSellPrice && outShapeEl && outSizeEl) outSellPrice.value = getShapeSizeSellPrice(outShapeEl.value, outSizeEl.value);
      updateOutwardStockHint();
    });

    document.getElementById('outColor')?.addEventListener('change', updateOutwardStockHint);

    // Matrix buttons
    document.getElementById('btnRefreshMatrix')?.addEventListener('click', () => {
      renderStockMatrix();
      showToast('Matrix refreshed', 'info');
    });
    document.getElementById('btnExportMatrixCsv')?.addEventListener('click', exportMatrixToCsv);

    // Ledger filters
    document.getElementById('filterLedgerType')?.addEventListener('change', renderFullLedger);
    document.getElementById('filterLedgerShape')?.addEventListener('change', renderFullLedger);
    document.getElementById('filterLedgerColor')?.addEventListener('change', renderFullLedger);
    document.getElementById('filterLedgerSize')?.addEventListener('change', renderFullLedger);
    document.getElementById('filterLedgerSearch')?.addEventListener('input', renderFullLedger);

    document.getElementById('btnExportFullLedgerCsv')?.addEventListener('click', exportFullLedgerToCsv);
    document.getElementById('btnPrintLedger')?.addEventListener('click', () => window.print());
    document.getElementById('btnDownloadSamplePdf')?.addEventListener('click', () => window.print());
    document.getElementById('btnExportExcelQuick')?.addEventListener('click', exportMatrixToCsv);

    // Backup & Restore
    document.getElementById('btnDownloadJsonBackup')?.addEventListener('click', downloadJsonBackup);
    document.getElementById('btnDownloadExcelSummary')?.addEventListener('click', exportMatrixToCsv);

    const restoreInput = document.getElementById('fileRestoreInput');
    restoreInput?.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        restoreFromJsonFile(e.target.files[0]);
      }
    });

    document.getElementById('btnLoadSampleData')?.addEventListener('click', () => {
      if (confirm('Load sample demonstration data? (Will populate realistic stock for Regular, Bell, Single Fold, Multi Fold, and LSR)')) {
        appState.stock = JSON.parse(JSON.stringify(INITIAL_STOCK_SAMPLE));
        appState.transactions = JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS_SAMPLE));
        saveStock();
        saveTransactions();
        renderAll();
        showToast('Sample wholesale stock loaded!', 'success');
      }
    });

    document.getElementById('btnResetAllData')?.addEventListener('click', () => {
      if (confirm('⚠️ WARNING: Are you sure you want to clear all stock and transactions? This cannot be undone!')) {
        appState.stock = {};
        appState.transactions = [];
        saveStock();
        saveTransactions();
        renderAll();
        showToast('All stock and history cleared.', 'info');
      }
    });

    // Register Service Worker for offline capability & instant auto-updates
    if ('serviceWorker' in navigator) {
      let isRefreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!isRefreshing) {
          isRefreshing = true;
          window.location.reload();
        }
      });

      navigator.serviceWorker.register('sw.js').then((reg) => {
        reg.update().catch(() => {});
        window.addEventListener('focus', () => {
          reg.update().catch(() => {});
        });
      }).catch(() => {});
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

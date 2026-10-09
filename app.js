/**
 * GALLOPS WHOLESALE STOCK APPLICATION - CORE CONTROLLER
 * Full Shape, Color & Size Matrix for Wholesale Menstrual Cup Business (IndiaMART)
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
    { id: 'REGULAR', name: 'Regular Shape', icon: '🌸', colors: ['PINK', 'BLUE', 'PURPLE'] },
    { id: 'BELL', name: 'Bell Shape', icon: '🔔', colors: ['PINK', 'BLUE', 'PURPLE'] },
    { id: 'SINGLE_FOLD', name: 'Single Fold', icon: '📐', colors: ['PINK', 'BLUE', 'PURPLE'] },
    { id: 'MULTI_FOLD', name: 'Multi Fold', icon: '🥏', colors: ['PINK', 'BLUE', 'PURPLE'] },
    { id: 'LSR', name: 'LSR', icon: '💎', colors: ['WHITE'] }
  ];

  const DEFAULT_COLORS = [
    { id: 'PINK', name: 'Pink', hex: '#ec4899', dot: '🔴' },
    { id: 'BLUE', name: 'Blue', hex: '#2563eb', dot: '🔵' },
    { id: 'PURPLE', name: 'Purple', hex: '#9333ea', dot: '🟣' },
    { id: 'WHITE', name: 'White', hex: '#64748b', dot: '⚪' }
  ];

  const DEFAULT_SIZES = [
    { id: 'S', name: 'Small (S)', label: 'Small (S)' },
    { id: 'M', name: 'Medium (M)', label: 'Medium (M)' },
    { id: 'L', name: 'Large (L)', label: 'Large (L)' }
  ];

  const DEFAULT_SETTINGS = {
    lowStockThreshold: 50,
    defaultCostPrice: 45,
    defaultSellPrice: 95,
    factorySupplierName: 'Supreme Silicone Molds Ltd',
    shapes: DEFAULT_SHAPES,
    colors: DEFAULT_COLORS,
    sizes: DEFAULT_SIZES
  };

  // Sample stock covering user's actual wholesale product matrix
  const INITIAL_STOCK_SAMPLE = {
    // REGULAR SHAPE
    'REGULAR_PINK_S': 160,
    'REGULAR_PINK_M': 280,
    'REGULAR_PINK_L': 120,
    'REGULAR_BLUE_S': 90,
    'REGULAR_BLUE_M': 180,
    'REGULAR_BLUE_L': 70,
    'REGULAR_PURPLE_S': 80,
    'REGULAR_PURPLE_M': 150,
    'REGULAR_PURPLE_L': 65,

    // BELL SHAPE
    'BELL_PINK_S': 210,
    'BELL_PINK_M': 350,
    'BELL_PINK_L': 140,
    'BELL_BLUE_S': 110,
    'BELL_BLUE_M': 200,
    'BELL_BLUE_L': 75,
    'BELL_PURPLE_S': 95,
    'BELL_PURPLE_M': 160,
    'BELL_PURPLE_L': 45, // Low stock alert (< 50)

    // SINGLE FOLD
    'SINGLE_FOLD_PINK_S': 130,
    'SINGLE_FOLD_PINK_M': 220,
    'SINGLE_FOLD_PINK_L': 90,
    'SINGLE_FOLD_BLUE_S': 75,
    'SINGLE_FOLD_BLUE_M': 130,
    'SINGLE_FOLD_BLUE_L': 40, // Low stock alert
    'SINGLE_FOLD_PURPLE_S': 65,
    'SINGLE_FOLD_PURPLE_M': 110,
    'SINGLE_FOLD_PURPLE_L': 35, // Low stock alert

    // MULTI FOLD
    'MULTI_FOLD_PINK_S': 140,
    'MULTI_FOLD_PINK_M': 240,
    'MULTI_FOLD_PINK_L': 105,
    'MULTI_FOLD_BLUE_S': 85,
    'MULTI_FOLD_BLUE_M': 140,
    'MULTI_FOLD_BLUE_L': 55,
    'MULTI_FOLD_PURPLE_S': 70,
    'MULTI_FOLD_PURPLE_M': 120,
    'MULTI_FOLD_PURPLE_L': 40, // Low stock alert

    // LSR (Only White Available)
    'LSR_WHITE_S': 110,
    'LSR_WHITE_M': 190,
    'LSR_WHITE_L': 85
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
      paymentStatus: 'Paid',
      reference: 'IM-ORDER-9921',
      notes: 'IndiaMART verified buyer, Bell Pink M cups',
      timestamp: Date.now() - 6 * 86400000
    },
    {
      id: 'TXN-1003',
      type: 'OUT',
      date: '2026-10-05',
      shapeId: 'SINGLE_FOLD',
      colorId: 'BLUE',
      sizeId: 'L',
      quantity: 80,
      rate: 92,
      total: 7360,
      partyName: 'Femina Care Wholesale, Bangalore',
      phone: '+91 94480 12345',
      city: 'Bangalore, Karnataka',
      paymentStatus: 'Partial',
      reference: 'IM-LEAD-7744',
      notes: 'Single Fold Blue L wholesale dispatch',
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
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        return Object.assign({}, DEFAULT_SETTINGS, JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Error loading settings', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
  }

  function saveSettings() {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(appState.settings));
  }

  function loadStock() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STOCK);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error loading stock', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_STOCK_SAMPLE));
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

    // Set default cost/sell prices
    const inCostPrice = document.getElementById('inCostPrice');
    const outSellPrice = document.getElementById('outSellPrice');
    if (inCostPrice) inCostPrice.value = appState.settings.defaultCostPrice;
    if (outSellPrice) outSellPrice.value = appState.settings.defaultSellPrice;

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

    hint.textContent = `Current Stock for ${shape.name} - ${color.name} (${size.name}): ${qty} pieces`;
    if (qty <= 0) {
      hint.style.color = 'var(--accent-rose)';
      hint.textContent += ' (OUT OF STOCK!)';
    } else if (qty < appState.settings.lowStockThreshold) {
      hint.style.color = 'var(--accent-amber)';
      hint.textContent += ' (Low Stock Alert)';
    } else {
      hint.style.color = 'var(--text-muted)';
    }
  }

  // 2. Render Dashboard KPIs & Overviews
  function renderDashboard() {
    let grandTotalUnits = 0;
    let lowStockCount = 0;
    const lowStockItems = [];

    // Calculate totals across all variations
    appState.settings.shapes.forEach(shape => {
      const colors = getColorsForShape(shape.id);
      colors.forEach(color => {
        appState.settings.sizes.forEach(size => {
          const qty = getStockQty(shape.id, color.id, size.id);
          grandTotalUnits += qty;
          if (qty < appState.settings.lowStockThreshold) {
            lowStockCount++;
            lowStockItems.push({ shape, color, size, qty });
          }
        });
      });
    });

    // Calculate Sales KPIs
    let totalUnitsSold = 0;
    let totalRevenue = 0;
    appState.transactions.forEach(t => {
      if (t.type === 'OUT') {
        totalUnitsSold += (t.quantity || 0);
        totalRevenue += (t.total || 0);
      }
    });

    const costPrice = appState.settings.defaultCostPrice || 45;
    const sellPrice = appState.settings.defaultSellPrice || 95;
    const stockValuationCost = grandTotalUnits * costPrice;
    const stockPotentialRevenue = grandTotalUnits * sellPrice;

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

    // Render Low Stock Warnings
    const warningSection = document.getElementById('lowStockWarningSection');
    if (warningSection) {
      if (lowStockCount > 0) {
        warningSection.classList.remove('hidden');
        const itemsListHtml = lowStockItems.slice(0, 6).map(item => `
          <span>${item.shape.icon} ${item.shape.name} • ${item.color.name} (${item.size.name}): <strong>${item.qty} pcs left</strong></span>
        `).join(' • ');

        warningSection.innerHTML = `
          <div class="alert-box">
            <div class="alert-box-text">
              <span>⚠️</span>
              <div>
                <strong>Low Stock Notice (${lowStockCount} items below ${appState.settings.lowStockThreshold} pcs threshold):</strong>
                <div style="font-size:0.8rem; margin-top:2px;">${itemsListHtml}</div>
              </div>
            </div>
            <div class="alert-box-action">
              <button class="btn btn-in btn-sm" id="btnLowStockReorder">Order Factory Stock 📥</button>
            </div>
          </div>
        `;

        document.getElementById('btnLowStockReorder')?.addEventListener('click', () => {
          switchTab('inward');
        });
      } else {
        warningSection.classList.add('hidden');
      }
    }

    renderShapesOverviewGrid();
    renderRecentTransactions();
    renderFastMovingSizes();
  }

  function renderShapesOverviewGrid() {
    const container = document.getElementById('shapesOverviewGrid');
    if (!container) return;

    let html = '';
    appState.settings.shapes.forEach(shape => {
      let shapeTotal = 0;
      const colors = getColorsForShape(shape.id);

      let sizePills = '';
      appState.settings.sizes.forEach(size => {
        let sizeTotal = 0;
        colors.forEach(color => {
          sizeTotal += getStockQty(shape.id, color.id, size.id);
        });
        shapeTotal += sizeTotal;

        let statusClass = sizeTotal === 0 ? 'status-empty' : sizeTotal < 50 ? 'status-low' : 'status-good';
        let statusText = sizeTotal === 0 ? 'Zero' : sizeTotal < 50 ? 'Low' : 'In Stock';

        sizePills += `
          <div class="size-pill-box">
            <div class="size-pill-label">${size.name}</div>
            <div class="size-pill-qty">${sizeTotal}</div>
            <span class="size-pill-status ${statusClass}">${statusText}</span>
          </div>
        `;
      });

      html += `
        <div class="shape-card">
          <div class="shape-card-header">
            <div class="shape-name-tag">
              <span class="shape-icon">${shape.icon}</span>
              <span>${shape.name}</span>
            </div>
            <span class="shape-total-badge">${shapeTotal} Pcs</span>
          </div>
          <div class="shape-sizes-breakdown" style="grid-template-columns: repeat(3, 1fr);">
            ${sizePills}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

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

    let sizeTotals = { S: 0, M: 0, L: 0 };
    let grandTotal = 0;
    let rowsHtml = '';

    appState.settings.shapes.forEach(shape => {
      const colors = getColorsForShape(shape.id);

      colors.forEach((color, colorIdx) => {
        let rowTotal = 0;
        let cellsHtml = '';

        appState.settings.sizes.forEach(size => {
          const qty = getStockQty(shape.id, color.id, size.id);
          rowTotal += qty;
          sizeTotals[size.id] = (sizeTotals[size.id] || 0) + qty;
          grandTotal += qty;

          let cellClass = '';
          if (qty === 0) cellClass = 'cell-empty';
          else if (qty < appState.settings.lowStockThreshold) cellClass = 'cell-low';

          cellsHtml += `
            <td>
              <div class="matrix-cell-box ${cellClass}" data-shape="${shape.id}" data-color="${color.id}" data-size="${size.id}">
                <div class="matrix-cell-qty">${qty}</div>
                <div class="matrix-cell-actions">
                  <button class="btn-mini-adjust btn-adj-minus" data-shape="${shape.id}" data-color="${color.id}" data-size="${size.id}" title="Reduce 1">−</button>
                  <button class="btn-mini-adjust btn-adj-edit" data-shape="${shape.id}" data-color="${color.id}" data-size="${size.id}" title="Set Stock">✏️</button>
                  <button class="btn-mini-adjust btn-adj-plus" data-shape="${shape.id}" data-color="${color.id}" data-size="${size.id}" title="Add 1">+</button>
                </div>
              </div>
            </td>
          `;
        });

        let statusBadge = '';
        if (rowTotal === 0) {
          statusBadge = '<span class="size-pill-status status-empty">Out of Stock</span>';
        } else if (rowTotal < appState.settings.lowStockThreshold * 2) {
          statusBadge = '<span class="size-pill-status status-low">Low Stock</span>';
        } else {
          statusBadge = '<span class="size-pill-status status-good">Healthy</span>';
        }

        // Shape name shown on first color row or per row
        const shapeCell = colorIdx === 0
          ? `<td rowspan="${colors.length}" style="vertical-align:middle; background:var(--bg-secondary); border-right:1px solid var(--border-color);">
               <div class="matrix-shape-cell">
                 <span class="shape-icon">${shape.icon}</span>
                 <strong>${shape.name}</strong>
               </div>
             </td>`
          : '';

        rowsHtml += `
          <tr>
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

    // Update Totals row in footer
    const totalS = document.getElementById('matrixTotalSizeS');
    const totalM = document.getElementById('matrixTotalSizeM');
    const totalL = document.getElementById('matrixTotalSizeL');
    const matrixGrand = document.getElementById('matrixGrandTotal');

    if (totalS) totalS.textContent = sizeTotals['S'] || 0;
    if (totalM) totalM.textContent = sizeTotals['M'] || 0;
    if (totalL) totalL.textContent = sizeTotals['L'] || 0;
    if (matrixGrand) matrixGrand.textContent = grandTotal;

    attachMatrixEventListeners();
    renderSkuCards();
  }

  function attachMatrixEventListeners() {
    document.querySelectorAll('.btn-adj-plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const { shape: shapeId, color: colorId, size: sizeId } = btn.dataset;
        const current = getStockQty(shapeId, colorId, sizeId);
        setStockQty(shapeId, colorId, sizeId, current + 1);
        renderAll();
        showToast(`+1 pc to ${getShapeById(shapeId).name} • ${getColorById(colorId).name} (${sizeId})`, 'success');
      });
    });

    document.querySelectorAll('.btn-adj-minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const { shape: shapeId, color: colorId, size: sizeId } = btn.dataset;
        const current = getStockQty(shapeId, colorId, sizeId);
        if (current <= 0) {
          showToast('Stock is already 0', 'error');
          return;
        }
        setStockQty(shapeId, colorId, sizeId, current - 1);
        renderAll();
        showToast(`-1 pc from ${getShapeById(shapeId).name} • ${getColorById(colorId).name} (${sizeId})`, 'info');
      });
    });

    document.querySelectorAll('.btn-adj-edit, .matrix-cell-box').forEach(el => {
      el.addEventListener('click', () => {
        const shapeId = el.dataset.shape || el.closest('[data-shape]')?.dataset.shape;
        const colorId = el.dataset.color || el.closest('[data-color]')?.dataset.color;
        const sizeId = el.dataset.size || el.closest('[data-size]')?.dataset.size;
        if (shapeId && colorId && sizeId) {
          openAdjustModal(shapeId, colorId, sizeId);
        }
      });
    });
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
          const estValue = qty * (appState.settings.defaultCostPrice || 45);

          let statusClass = qty === 0 ? 'status-empty' : qty < appState.settings.lowStockThreshold ? 'status-low' : 'status-good';
          let statusText = qty === 0 ? 'Out of Stock' : qty < appState.settings.lowStockThreshold ? 'Low Stock' : 'Adequate';

          html += `
            <div class="sku-card" onclick="window.gallopsOpenAdjust('${shape.id}', '${color.id}', '${size.id}')">
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

      return `
        <tr>
          <td>${formatDate(t.date)}</td>
          <td><strong>${t.partyName || 'IndiaMART Buyer'}</strong><br><small class="text-muted">${t.city || ''}</small></td>
          <td>${shape.icon} ${shape.name} • ${color.name} (${size.name})</td>
          <td><strong style="color:var(--accent-pink);">-${t.quantity}</strong></td>
          <td>₹${t.rate || 0}</td>
          <td><strong>${formatCurrency(t.total)}</strong></td>
          <td><span class="tag-badge ${t.paymentStatus === 'Paid' ? 'tag-in' : 'tag-out'}">${t.paymentStatus || 'Pending'}</span></td>
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

  // 5. Render Buyers Directory
  function renderBuyersDirectory() {
    const container = document.getElementById('buyersGrid');
    if (!container) return;

    const buyersMap = {};
    appState.transactions.forEach(t => {
      if (t.type === 'OUT' && t.partyName) {
        const name = t.partyName.trim();
        if (!buyersMap[name]) {
          buyersMap[name] = {
            name,
            city: t.city || 'IndiaMART Buyer',
            phone: t.phone || '',
            totalOrders: 0,
            totalUnits: 0,
            totalSpend: 0,
            lastOrderDate: t.date
          };
        }
        buyersMap[name].totalOrders++;
        buyersMap[name].totalUnits += (t.quantity || 0);
        buyersMap[name].totalSpend += (t.total || 0);
        if (t.date > buyersMap[name].lastOrderDate) {
          buyersMap[name].lastOrderDate = t.date;
        }
      }
    });

    const buyersList = Object.values(buyersMap).sort((a, b) => b.totalSpend - a.totalSpend);

    if (buyersList.length === 0) {
      container.innerHTML = `<div class="text-muted" style="padding:2rem; grid-column:1/-1; text-align:center;">No buyer records yet. Dispatches logged in "Wholesale Sales" will automatically generate this buyer directory!</div>`;
      return;
    }

    container.innerHTML = buyersList.map(b => `
      <div class="buyer-card">
        <div>
          <div class="buyer-header">
            <div>
              <div class="buyer-name">${b.name}</div>
              <div class="buyer-city">📍 ${b.city}</div>
            </div>
            <span class="tag-badge tag-in">${b.totalOrders} Orders</span>
          </div>
          ${b.phone ? `<div style="font-size:0.8rem; color:var(--text-secondary); margin-top:0.4rem;">📞 ${b.phone}</div>` : ''}
        </div>
        <div>
          <div class="buyer-stats">
            <div class="buyer-stat-item">
              <div class="buyer-stat-label">Total Cups</div>
              <div class="buyer-stat-val">${b.totalUnits.toLocaleString('en-IN')}</div>
            </div>
            <div class="buyer-stat-item">
              <div class="buyer-stat-label">Total Billed</div>
              <div class="buyer-stat-val" style="color:var(--accent-emerald);">${formatCurrency(b.totalSpend)}</div>
            </div>
          </div>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.5rem; text-align:right;">
            Last Order: ${formatDate(b.lastOrderDate)}
          </div>
        </div>
      </div>
    `).join('');
  }

  // Master render
  function renderAll() {
    populateDropdowns();
    renderDashboard();
    renderStockMatrix();
    renderHistoryTables();
    renderBuyersDirectory();
  }

  // ================= TRANSACTION ACTIONS =================

  // Handle Form Stock In (Factory Receipt)
  function handleStockInSubmit(e) {
    e.preventDefault();

    const shapeId = document.getElementById('inShape').value;
    const colorId = document.getElementById('inColor').value;
    const sizeId = document.getElementById('inSize').value;
    const quantity = parseInt(document.getElementById('inQuantity').value, 10);
    const rate = parseFloat(document.getElementById('inCostPrice').value) || appState.settings.defaultCostPrice;
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

  // Handle Form Stock Out (Wholesale Sale / IndiaMART)
  function handleStockOutSubmit(e) {
    e.preventDefault();

    const shapeId = document.getElementById('outShape').value;
    const colorId = document.getElementById('outColor').value;
    const sizeId = document.getElementById('outSize').value;
    const quantity = parseInt(document.getElementById('outQuantity').value, 10);
    const rate = parseFloat(document.getElementById('outSellPrice').value) || appState.settings.defaultSellPrice;
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
      reference: orderRef || 'IM-ORDER-' + Date.now().toString().slice(-4),
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
    let csv = 'Cup Shape,Color,Small (S),Medium (M),Large (L),Total Pieces,Cost Per Cup,Estimated Value\n';

    appState.settings.shapes.forEach(shape => {
      const colors = getColorsForShape(shape.id);
      colors.forEach(color => {
        const qS = getStockQty(shape.id, color.id, 'S');
        const qM = getStockQty(shape.id, color.id, 'M');
        const qL = getStockQty(shape.id, color.id, 'L');
        const total = qS + qM + qL;
        const val = total * (appState.settings.defaultCostPrice || 45);

        csv += `"${shape.name}","${color.name}",${qS},${qM},${qL},${total},${appState.settings.defaultCostPrice},${val}\n`;
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

  // ================= THEME TOGGLE =================
  function setupThemeToggle() {
    let currentTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (!currentTheme || currentTheme === 'theme-dark') {
      currentTheme = 'theme-light';
      localStorage.setItem(STORAGE_KEYS.THEME, 'theme-light');
    }
    document.body.className = currentTheme;

    document.getElementById('btnThemeToggle')?.addEventListener('click', () => {
      const isDark = document.body.classList.contains('theme-dark');
      const newTheme = isDark ? 'theme-light' : 'theme-dark';
      document.body.className = newTheme;
      localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    });
  }

  // ================= INITIALIZATION =================
  function init() {
    setupThemeToggle();
    populateDropdowns();
    renderAll();
    setupAdjustModalControls();

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

    // Dynamic color and stock hints when changing dropdowns
    document.getElementById('inShape')?.addEventListener('change', () => {
      updateColorDropdowns();
    });

    document.getElementById('outShape')?.addEventListener('change', () => {
      updateColorDropdowns();
      updateOutwardStockHint();
    });

    document.getElementById('outColor')?.addEventListener('change', updateOutwardStockHint);
    document.getElementById('outSize')?.addEventListener('change', updateOutwardStockHint);

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

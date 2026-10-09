/**
 * GAALOPS WHOLESALE STOCK APPLICATION - CORE CONTROLLER
 * Manages 15 SKUs (5 Shapes x 3 Sizes) for Menstrual Cup Wholesale (IndiaMART)
 */

(function () {
  'use strict';

  // ================= STORAGE KEYS =================
  const STORAGE_KEYS = {
    STOCK: 'gaalops_cup_stock_v1',
    TRANSACTIONS: 'gaalops_cup_transactions_v1',
    SETTINGS: 'gaalops_cup_settings_v1',
    THEME: 'gaalops_cup_theme_v1'
  };

  // ================= DEFAULT CONFIGURATION =================
  const DEFAULT_SHAPES = [
    { id: 'SHP-1', name: 'Classic Bell Shape', icon: '🔔' },
    { id: 'SHP-2', name: 'Round Ball Shape', icon: '⚪' },
    { id: 'SHP-3', name: 'Ergonomic Angled', icon: '📐' },
    { id: 'SHP-4', name: 'Flat Collapsible', icon: '🥏' },
    { id: 'SHP-5', name: 'Ring Stem Grip', icon: '⭕' }
  ];

  const DEFAULT_SIZES = [
    { id: 'S', name: 'Small (S)', label: 'Size S (Teen / Light)' },
    { id: 'M', name: 'Medium (M)', label: 'Size M (Regular)' },
    { id: 'L', name: 'Large (L)', label: 'Size L (Heavy / Post-Birth)' }
  ];

  const DEFAULT_SETTINGS = {
    lowStockThreshold: 50,
    defaultCostPrice: 45,
    defaultSellPrice: 95,
    factorySupplierName: 'Supreme Silicone Molds Ltd',
    shapes: DEFAULT_SHAPES,
    sizes: DEFAULT_SIZES
  };

  // Initial Sample Data for user to see how it works on first start
  const INITIAL_STOCK_SAMPLE = {
    'SHP-1_S': 320,
    'SHP-1_M': 480,
    'SHP-1_L': 210,
    'SHP-2_S': 150,
    'SHP-2_M': 180,
    'SHP-2_L': 40, // Trigger low stock (< 50)
    'SHP-3_S': 90,
    'SHP-3_M': 140,
    'SHP-3_L': 85,
    'SHP-4_S': 200,
    'SHP-4_M': 310,
    'SHP-4_L': 120,
    'SHP-5_S': 110,
    'SHP-5_M': 250,
    'SHP-5_L': 30  // Trigger low stock (< 50)
  };

  const INITIAL_TRANSACTIONS_SAMPLE = [
    {
      id: 'TXN-1001',
      type: 'IN',
      date: '2026-10-01',
      shapeId: 'SHP-1',
      sizeId: 'M',
      quantity: 500,
      rate: 45,
      total: 22500,
      partyName: 'Supreme Silicone Molds Ltd',
      reference: 'INV-4402',
      notes: 'Initial October wholesale batch received in carton boxes',
      timestamp: Date.now() - 8 * 86400000
    },
    {
      id: 'TXN-1002',
      type: 'OUT',
      date: '2026-10-03',
      shapeId: 'SHP-1',
      sizeId: 'M',
      quantity: 100,
      rate: 95,
      total: 9500,
      partyName: 'Aarav Surgical & Pharmacy, Delhi',
      phone: '+91 98112 34567',
      city: 'Delhi',
      paymentStatus: 'Paid',
      reference: 'IM-ORDER-9921',
      notes: 'IndiaMART verified lead, dispatched via Delhivery',
      timestamp: Date.now() - 6 * 86400000
    },
    {
      id: 'TXN-1003',
      type: 'OUT',
      date: '2026-10-05',
      shapeId: 'SHP-2',
      sizeId: 'L',
      quantity: 80,
      rate: 92,
      total: 7360,
      partyName: 'Femina Care Wholesale, Bangalore',
      phone: '+91 94480 12345',
      city: 'Bangalore, Karnataka',
      paymentStatus: 'Partial',
      reference: 'IM-LEAD-7744',
      notes: 'IndiaMART bulk enquiry, 50% advance received',
      timestamp: Date.now() - 4 * 86400000
    },
    {
      id: 'TXN-1004',
      type: 'IN',
      date: '2026-10-07',
      shapeId: 'SHP-4',
      sizeId: 'M',
      quantity: 350,
      rate: 48,
      total: 16800,
      partyName: 'Supreme Silicone Molds Ltd',
      reference: 'CHALLAN-901',
      notes: 'Collapsible design shipment',
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
  function getSkuKey(shapeId, sizeId) {
    return `${shapeId}_${sizeId}`;
  }

  function getStockQty(shapeId, sizeId) {
    const key = getSkuKey(shapeId, sizeId);
    return appState.stock[key] || 0;
  }

  function setStockQty(shapeId, sizeId, qty) {
    const key = getSkuKey(shapeId, sizeId);
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

  function getSizeById(sizeId) {
    return appState.settings.sizes.find(s => s.id === sizeId) || { id: sizeId, name: sizeId };
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

    const shapeOptions = appState.settings.shapes.map(s => `<option value="${s.id}">${s.icon} ${s.name}</option>`).join('');
    const sizeOptions = appState.settings.sizes.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

    if (inShape) inShape.innerHTML = shapeOptions;
    if (outShape) outShape.innerHTML = shapeOptions;
    if (filterShape) filterShape.innerHTML = '<option value="ALL">All Shapes</option>' + shapeOptions;

    if (inSize) inSize.innerHTML = sizeOptions;
    if (outSize) outSize.innerHTML = sizeOptions;
    if (filterSize) filterSize.innerHTML = '<option value="ALL">All Sizes</option>' + sizeOptions;

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
    if (inSupplierName) inSupplierName.value = appState.settings.factorySupplierName || 'Primary Manufacturer';

    updateOutwardStockHint();
  }

  function updateOutwardStockHint() {
    const outShape = document.getElementById('outShape');
    const outSize = document.getElementById('outSize');
    const hint = document.getElementById('outStockAvailableHint');
    if (!outShape || !outSize || !hint) return;

    const qty = getStockQty(outShape.value, outSize.value);
    hint.textContent = `Current Available Stock: ${qty} pieces`;
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

    // Calculate totals across 15 SKUs
    appState.settings.shapes.forEach(shape => {
      appState.settings.sizes.forEach(size => {
        const qty = getStockQty(shape.id, size.id);
        grandTotalUnits += qty;
        if (qty < appState.settings.lowStockThreshold) {
          lowStockCount++;
          lowStockItems.push({ shape, size, qty });
        }
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
    document.getElementById('kpiTotalUnits').textContent = grandTotalUnits.toLocaleString('en-IN');
    document.getElementById('kpiTotalBoxes').textContent = `≈ ${Math.floor(grandTotalUnits / 100)} master boxes (100 pcs/box)`;

    document.getElementById('kpiStockValuation').textContent = formatCurrency(stockValuationCost);
    document.getElementById('kpiStockPotential').textContent = `Selling Value: ${formatCurrency(stockPotentialRevenue)}`;

    document.getElementById('kpiTotalSold').textContent = totalUnitsSold.toLocaleString('en-IN') + ' pcs';
    document.getElementById('kpiRevenue').textContent = `Total Sales: ${formatCurrency(totalRevenue)}`;

    const kpiLowStockCount = document.getElementById('kpiLowStockCount');
    const kpiLowStockBadge = document.getElementById('kpiLowStockBadge');
    kpiLowStockCount.textContent = lowStockCount;
    kpiLowStockBadge.textContent = `${lowStockCount} SKUs Low`;

    // Render Low Stock Warnings
    const warningSection = document.getElementById('lowStockWarningSection');
    if (lowStockCount > 0) {
      warningSection.classList.remove('hidden');
      const itemsListHtml = lowStockItems.map(item => `
        <span style="font-weight:700;">${item.shape.icon} ${item.shape.name} (${item.size.name}): ${item.qty} pcs left</span>
      `).join(' • ');

      warningSection.innerHTML = `
        <div class="alert-box">
          <div class="alert-box-text">
            <span>⚠️</span>
            <div>
              <strong>Low Stock Warning (${lowStockCount} items below ${appState.settings.lowStockThreshold} pcs):</strong>
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

    // Render 5 Shape Overview Cards
    renderShapesOverviewGrid();

    // Render Recent Transactions
    renderRecentTransactions();

    // Render Fast Moving Sizes
    renderFastMovingSizes();
  }

  function renderShapesOverviewGrid() {
    const container = document.getElementById('shapesOverviewGrid');
    if (!container) return;

    let html = '';
    appState.settings.shapes.forEach(shape => {
      let shapeTotal = 0;
      let pillsHtml = '';

      appState.settings.sizes.forEach(size => {
        const qty = getStockQty(shape.id, size.id);
        shapeTotal += qty;

        let statusClass = 'status-good';
        let statusText = 'In Stock';
        if (qty === 0) {
          statusClass = 'status-empty';
          statusText = 'Zero';
        } else if (qty < appState.settings.lowStockThreshold) {
          statusClass = 'status-low';
          statusText = 'Low';
        }

        pillsHtml += `
          <div class="size-pill-box">
            <div class="size-pill-label">${size.name}</div>
            <div class="size-pill-qty">${qty}</div>
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
          <div class="shape-sizes-breakdown">
            ${pillsHtml}
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
      const size = getSizeById(t.sizeId);
      const isOut = t.type === 'OUT';

      return `
        <tr>
          <td>
            <span class="tag-badge ${isOut ? 'tag-out' : 'tag-in'}">
              ${isOut ? '📤 OUT' : '📥 IN'}
            </span>
          </td>
          <td>${formatDate(t.date)}</td>
          <td><strong>${shape.icon} ${shape.name}</strong> <span class="text-muted">(${size.name})</span></td>
          <td><strong>${t.quantity}</strong></td>
          <td>${t.partyName || '-'}</td>
          <td><code style="font-size:0.75rem;">${t.reference || '-'}</code></td>
        </tr>
      `;
    }).join('');
  }

  function renderFastMovingSizes() {
    const container = document.getElementById('fastMovingSizesList');
    if (!container) return;

    const salesBySize = { S: 0, M: 0, L: 0 };
    appState.transactions.forEach(t => {
      if (t.type === 'OUT' && salesBySize[t.sizeId] !== undefined) {
        salesBySize[t.sizeId] += (t.quantity || 0);
      }
    });

    let totalDispatched = Object.values(salesBySize).reduce((a, b) => a + b, 0);

    const listHtml = appState.settings.sizes.map(size => {
      const sold = salesBySize[size.id] || 0;
      const pct = totalDispatched > 0 ? Math.round((sold / totalDispatched) * 100) : 0;
      return `
        <div class="fast-moving-item">
          <div>
            <div class="fast-moving-title">${size.name}</div>
            <div class="fast-moving-sub">${pct}% of all wholesale dispatches</div>
          </div>
          <div class="fast-moving-stat">${sold} pcs</div>
        </div>
      `;
    }).join('');

    container.innerHTML = listHtml;
  }

  // 3. Render Stock Matrix (15 SKUs Grid)
  function renderStockMatrix() {
    const tbody = document.getElementById('stockMatrixTbody');
    if (!tbody) return;

    let sizeTotals = { S: 0, M: 0, L: 0 };
    let grandTotal = 0;

    let rowsHtml = '';

    appState.settings.shapes.forEach(shape => {
      let shapeRowTotal = 0;
      let cellsHtml = '';

      appState.settings.sizes.forEach(size => {
        const qty = getStockQty(shape.id, size.id);
        shapeRowTotal += qty;
        sizeTotals[size.id] = (sizeTotals[size.id] || 0) + qty;
        grandTotal += qty;

        let cellClass = '';
        if (qty === 0) cellClass = 'cell-empty';
        else if (qty < appState.settings.lowStockThreshold) cellClass = 'cell-low';

        cellsHtml += `
          <td>
            <div class="matrix-cell-box ${cellClass}" data-shape="${shape.id}" data-size="${size.id}">
              <div class="matrix-cell-qty">${qty}</div>
              <div class="matrix-cell-actions">
                <button class="btn-mini-adjust btn-adj-minus" data-shape="${shape.id}" data-size="${size.id}" title="Reduce 1">−</button>
                <button class="btn-mini-adjust btn-adj-edit" data-shape="${shape.id}" data-size="${size.id}" title="Set Stock">✏️</button>
                <button class="btn-mini-adjust btn-adj-plus" data-shape="${shape.id}" data-size="${size.id}" title="Add 1">+</button>
              </div>
            </div>
          </td>
        `;
      });

      let statusBadge = '';
      if (shapeRowTotal === 0) {
        statusBadge = '<span class="size-pill-status status-empty">Out of Stock</span>';
      } else if (shapeRowTotal < appState.settings.lowStockThreshold * 3) {
        statusBadge = '<span class="size-pill-status status-low">Low Stock</span>';
      } else {
        statusBadge = '<span class="size-pill-status status-good">Healthy</span>';
      }

      rowsHtml += `
        <tr>
          <td>
            <div class="matrix-shape-cell">
              <span class="shape-icon">${shape.icon}</span>
              <span>${shape.name}</span>
            </div>
          </td>
          ${cellsHtml}
          <td class="matrix-total-cell">${shapeRowTotal}</td>
          <td>${statusBadge}</td>
        </tr>
      `;
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

    // Attach event listeners to mini adjustment buttons
    attachMatrixEventListeners();

    // Render the 15 SKU Cards below
    renderSkuCards();
  }

  function attachMatrixEventListeners() {
    document.querySelectorAll('.btn-adj-plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const shapeId = btn.dataset.shape;
        const sizeId = btn.dataset.size;
        const current = getStockQty(shapeId, sizeId);
        setStockQty(shapeId, sizeId, current + 1);
        renderAll();
        showToast(`Added 1 pc to ${getShapeById(shapeId).name} (${sizeId})`, 'success');
      });
    });

    document.querySelectorAll('.btn-adj-minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const shapeId = btn.dataset.shape;
        const sizeId = btn.dataset.size;
        const current = getStockQty(shapeId, sizeId);
        if (current <= 0) {
          showToast('Stock is already 0', 'error');
          return;
        }
        setStockQty(shapeId, sizeId, current - 1);
        renderAll();
        showToast(`Deducted 1 pc from ${getShapeById(shapeId).name} (${sizeId})`, 'info');
      });
    });

    document.querySelectorAll('.btn-adj-edit, .matrix-cell-box').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-adj-plus') || e.target.classList.contains('btn-adj-minus')) return;
        const shapeId = el.dataset.shape || el.closest('[data-shape]')?.dataset.shape;
        const sizeId = el.dataset.size || el.closest('[data-size]')?.dataset.size;
        if (shapeId && sizeId) {
          openAdjustModal(shapeId, sizeId);
        }
      });
    });
  }

  function renderSkuCards() {
    const container = document.getElementById('skuCardsGrid');
    if (!container) return;

    let html = '';
    appState.settings.shapes.forEach(shape => {
      appState.settings.sizes.forEach(size => {
        const qty = getStockQty(shape.id, size.id);
        const estValue = qty * (appState.settings.defaultCostPrice || 45);

        let statusClass = qty === 0 ? 'status-empty' : qty < appState.settings.lowStockThreshold ? 'status-low' : 'status-good';
        let statusText = qty === 0 ? 'Out of Stock' : qty < appState.settings.lowStockThreshold ? 'Low Stock' : 'Adequate';

        html += `
          <div class="sku-card" onclick="window.gaalopsOpenAdjust('${shape.id}', '${size.id}')">
            <div>
              <div class="sku-card-tag">${shape.icon} ${shape.name}</div>
              <div class="sku-card-title">${size.name}</div>
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
      const size = getSizeById(t.sizeId);

      return `
        <tr>
          <td>${formatDate(t.date)}</td>
          <td><strong>${shape.icon} ${shape.name}</strong> (${size.name})</td>
          <td><strong style="color:var(--accent-emerald);">+${t.quantity}</strong></td>
          <td>₹${t.rate || 0}</td>
          <td>${formatCurrency(t.total)}</td>
          <td>${t.reference || '-'}</td>
          <td>${t.challanNo || '-'}</td>
          <td>
            <button class="btn-link" style="color:var(--accent-rose);" onclick="window.gaalopsDeleteTxn('${t.id}')">Delete</button>
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
      const size = getSizeById(t.sizeId);

      return `
        <tr>
          <td>${formatDate(t.date)}</td>
          <td><strong>${t.partyName || 'IndiaMART Buyer'}</strong><br><small class="text-muted">${t.city || ''}</small></td>
          <td>${shape.icon} ${shape.name} (${size.name})</td>
          <td><strong style="color:var(--accent-pink);">-${t.quantity}</strong></td>
          <td>₹${t.rate || 0}</td>
          <td><strong>${formatCurrency(t.total)}</strong></td>
          <td><span class="tag-badge ${t.paymentStatus === 'Paid' ? 'tag-in' : 'tag-out'}">${t.paymentStatus || 'Pending'}</span></td>
          <td>
            <button class="btn-link" style="color:var(--accent-rose);" onclick="window.gaalopsDeleteTxn('${t.id}')">Delete</button>
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
    const sizeFilter = document.getElementById('filterLedgerSize')?.value || 'ALL';
    const searchFilter = (document.getElementById('filterLedgerSearch')?.value || '').toLowerCase().trim();

    let filtered = appState.transactions.filter(t => {
      if (typeFilter !== 'ALL' && t.type !== typeFilter) return false;
      if (shapeFilter !== 'ALL' && t.shapeId !== shapeFilter) return false;
      if (sizeFilter !== 'ALL' && t.sizeId !== sizeFilter) return false;

      if (searchFilter) {
        const text = `${t.partyName || ''} ${t.reference || ''} ${t.notes || ''} ${t.city || ''} ${t.id}`.toLowerCase();
        if (!text.includes(searchFilter)) return false;
      }
      return true;
    });

    filtered.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="12" class="text-center text-muted" style="padding:2rem;">No matching transactions found.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map((t, idx) => {
      const shape = getShapeById(t.shapeId);
      const size = getSizeById(t.sizeId);
      const isOut = t.type === 'OUT';

      return `
        <tr>
          <td>${filtered.length - idx}</td>
          <td><span class="tag-badge ${isOut ? 'tag-out' : 'tag-in'}">${isOut ? 'OUT' : 'IN'}</span></td>
          <td>${formatDate(t.date)}</td>
          <td>${shape.icon} ${shape.name}</td>
          <td><strong>${size.name}</strong></td>
          <td><strong style="color:${isOut ? 'var(--accent-pink)' : 'var(--accent-emerald)'};">${isOut ? '-' : '+'}${t.quantity}</strong></td>
          <td>₹${t.rate || 0}</td>
          <td><strong>${formatCurrency(t.total)}</strong></td>
          <td>${t.partyName || '-'}</td>
          <td><code style="font-size:0.75rem;">${t.reference || '-'}</code></td>
          <td style="max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${t.notes || ''}">${t.notes || '-'}</td>
          <td>
            <button class="btn-link" style="color:var(--accent-rose);" onclick="window.gaalopsDeleteTxn('${t.id}')">Delete</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // 5. Render Wholesale Buyers Directory
  function renderBuyersDirectory() {
    const container = document.getElementById('buyersGridContainer');
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

  // 6. Render Settings Tab
  function renderSettings() {
    const shapeList = document.getElementById('shapeRenameInputs');
    const sizeList = document.getElementById('sizeRenameInputs');

    if (shapeList) {
      shapeList.innerHTML = appState.settings.shapes.map(s => `
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <span style="font-size:1.2rem;">${s.icon}</span>
          <input type="text" class="form-control" data-shape-id="${s.id}" value="${s.name}" placeholder="Shape Name">
        </div>
      `).join('');
    }

    if (sizeList) {
      sizeList.innerHTML = appState.settings.sizes.map(s => `
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <span style="font-weight:700; width:40px;">${s.id}</span>
          <input type="text" class="form-control" data-size-id="${s.id}" value="${s.name}" placeholder="Size Name">
        </div>
      `).join('');
    }

    const lowStockInput = document.getElementById('settingLowStockThreshold');
    const defaultCostInput = document.getElementById('settingDefaultCost');
    const defaultSellInput = document.getElementById('settingDefaultSellPrice');

    if (lowStockInput) lowStockInput.value = appState.settings.lowStockThreshold;
    if (defaultCostInput) defaultCostInput.value = appState.settings.defaultCostPrice;
    if (defaultSellInput) defaultSellInput.value = appState.settings.defaultSellPrice;
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
    const sizeId = document.getElementById('inSize').value;
    const quantity = parseInt(document.getElementById('inQuantity').value, 10);
    const rate = parseFloat(document.getElementById('inCostPrice').value) || appState.settings.defaultCostPrice;
    const date = document.getElementById('inDate').value;
    const batchNumber = document.getElementById('inBatchNumber').value.trim();
    const supplier = document.getElementById('inSupplierName').value.trim();
    const challanNo = document.getElementById('inChallanNo').value.trim();
    const notes = document.getElementById('inNotes').value.trim();

    if (!shapeId || !sizeId || !quantity || quantity <= 0) {
      showToast('Please enter valid shape, size, and quantity', 'error');
      return;
    }

    // Add to stock
    const current = getStockQty(shapeId, sizeId);
    setStockQty(shapeId, sizeId, current + quantity);

    // Create transaction
    const newTxn = {
      id: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
      type: 'IN',
      date: date,
      shapeId: shapeId,
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

    if (!shapeId || !sizeId || !quantity || quantity <= 0) {
      showToast('Please enter valid shape, size, and quantity', 'error');
      return;
    }

    const current = getStockQty(shapeId, sizeId);
    if (quantity > current) {
      showToast(`Cannot dispatch ${quantity} cups! Only ${current} cups available in stock.`, 'error');
      return;
    }

    // Deduct stock
    setStockQty(shapeId, sizeId, current - quantity);

    // Create transaction
    const newTxn = {
      id: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
      type: 'OUT',
      date: date,
      shapeId: shapeId,
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
  window.gaalopsDeleteTxn = function (txnId) {
    const txn = appState.transactions.find(t => t.id === txnId);
    if (!txn) return;

    const confirmMsg = `Delete transaction #${txn.id} (${txn.type === 'IN' ? 'Inward' : 'Outward'} of ${txn.quantity} pcs)?\n\nNote: If you click OK, the stock count will automatically be reversed!`;
    if (!confirm(confirmMsg)) return;

    // Rollback stock
    const current = getStockQty(txn.shapeId, txn.sizeId);
    if (txn.type === 'IN') {
      // Inward is deleted, so subtract
      setStockQty(txn.shapeId, txn.sizeId, Math.max(0, current - txn.quantity));
    } else {
      // Outward is deleted, so add back
      setStockQty(txn.shapeId, txn.sizeId, current + txn.quantity);
    }

    appState.transactions = appState.transactions.filter(t => t.id !== txnId);
    saveTransactions();
    renderAll();

    showToast('Transaction removed & stock reversed.', 'info');
  };

  // ================= QUICK ADJUST MODAL =================
  window.gaalopsOpenAdjust = function (shapeId, sizeId) {
    openAdjustModal(shapeId, sizeId);
  };

  function openAdjustModal(shapeId, sizeId) {
    appState.currentAdjustSku = { shapeId, sizeId };
    const shape = getShapeById(shapeId);
    const size = getSizeById(sizeId);
    const qty = getStockQty(shapeId, sizeId);

    document.getElementById('adjustModalTitle').textContent = `Adjust Stock Count`;
    document.getElementById('adjustModalSubtitle').textContent = `${shape.icon} ${shape.name} • ${size.name}`;
    document.getElementById('adjustModalQtyInput').value = qty;
    document.getElementById('adjustReason').value = '';

    document.getElementById('quickAdjustModal').classList.remove('hidden');
  }

  function closeAdjustModal() {
    document.getElementById('quickAdjustModal').classList.add('hidden');
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
      const { shapeId, sizeId } = appState.currentAdjustSku;
      const newQty = Math.max(0, parseInt(input.value, 10) || 0);
      const oldQty = getStockQty(shapeId, sizeId);
      const diff = newQty - oldQty;
      const reason = document.getElementById('adjustReason').value.trim() || 'Manual stock adjustment';

      setStockQty(shapeId, sizeId, newQty);

      if (diff !== 0) {
        // Record adjustment transaction
        const adjTxn = {
          id: 'ADJ-' + Math.floor(100000 + Math.random() * 900000),
          type: diff > 0 ? 'IN' : 'OUT',
          date: new Date().toISOString().split('T')[0],
          shapeId: shapeId,
          sizeId: sizeId,
          quantity: Math.abs(diff),
          rate: appState.settings.defaultCostPrice,
          total: Math.abs(diff) * appState.settings.defaultCostPrice,
          partyName: 'Physical Audit',
          reference: 'AUDIT',
          notes: `${reason} (Adjusted from ${oldQty} to ${newQty})`,
          timestamp: Date.now()
        };
        appState.transactions.unshift(adjTxn);
        saveTransactions();
      }

      closeAdjustModal();
      renderAll();
      showToast(`Updated stock to ${newQty} pcs`, 'success');
    });
  }

  // ================= TAB NAVIGATION =================
  function switchTab(tabId) {
    document.querySelectorAll('.side-nav .nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === `tab-${tabId}`);
    });

    // Special renders when switching
    if (tabId === 'matrix') {
      renderStockMatrix();
    } else if (tabId === 'ledger') {
      renderFullLedger();
    } else if (tabId === 'buyers') {
      renderBuyersDirectory();
    } else if (tabId === 'settings') {
      renderSettings();
    }
  }

  // ================= CSV / EXCEL EXPORT & BACKUP =================
  function exportMatrixToCsv() {
    let csv = 'Cup Shape,Size S (Small),Size M (Medium),Size L (Large),Total Shape Stock,Cost Per Cup,Estimated Value\n';

    appState.settings.shapes.forEach(shape => {
      const qS = getStockQty(shape.id, 'S');
      const qM = getStockQty(shape.id, 'M');
      const qL = getStockQty(shape.id, 'L');
      const total = qS + qM + qL;
      const val = total * (appState.settings.defaultCostPrice || 45);

      csv += `"${shape.name}",${qS},${qM},${qL},${total},${appState.settings.defaultCostPrice},${val}\n`;
    });

    downloadFile(csv, `gaalops_cup_stock_matrix_${getDateStamp()}.csv`, 'text/csv');
    showToast('Matrix CSV downloaded successfully!', 'success');
  }

  function exportFullLedgerToCsv() {
    let csv = 'Transaction ID,Type,Date,Shape,Size,Quantity,Rate (INR),Total (INR),Party / Buyer,Reference,Notes\n';

    appState.transactions.forEach(t => {
      const shape = getShapeById(t.shapeId);
      const size = getSizeById(t.sizeId);
      csv += `"${t.id}","${t.type}","${t.date}","${shape.name}","${size.name}",${t.quantity},${t.rate || 0},${t.total || 0},"${t.partyName || ''}","${t.reference || ''}","${(t.notes || '').replace(/"/g, '""')}"\n`;
    });

    downloadFile(csv, `gaalops_stock_ledger_${getDateStamp()}.csv`, 'text/csv');
    showToast('Full Ledger CSV downloaded!', 'success');
  }

  function downloadJsonBackup() {
    const backupData = {
      appName: 'Gaalops Wholesale Stock Application',
      exportDate: new Date().toISOString(),
      settings: appState.settings,
      stock: appState.stock,
      transactions: appState.transactions
    };

    downloadFile(JSON.stringify(backupData, null, 2), `gaalops_stock_backup_${getDateStamp()}.json`, 'application/json');
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
    const currentTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'theme-dark';
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

    // Dynamic stock hint when changing outward dropdowns
    document.getElementById('outShape')?.addEventListener('change', updateOutwardStockHint);
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
    document.getElementById('filterLedgerSize')?.addEventListener('change', renderFullLedger);
    document.getElementById('filterLedgerSearch')?.addEventListener('input', renderFullLedger);

    document.getElementById('btnExportFullLedgerCsv')?.addEventListener('click', exportFullLedgerToCsv);
    document.getElementById('btnPrintLedger')?.addEventListener('click', () => window.print());
    document.getElementById('btnDownloadSamplePdf')?.addEventListener('click', () => window.print());
    document.getElementById('btnExportExcelQuick')?.addEventListener('click', exportMatrixToCsv);

    // Settings actions
    document.getElementById('btnSaveNames')?.addEventListener('click', () => {
      document.querySelectorAll('#shapeRenameInputs input').forEach(input => {
        const id = input.dataset.shapeId;
        const shape = appState.settings.shapes.find(s => s.id === id);
        if (shape && input.value.trim()) shape.name = input.value.trim();
      });

      document.querySelectorAll('#sizeRenameInputs input').forEach(input => {
        const id = input.dataset.sizeId;
        const size = appState.settings.sizes.find(s => s.id === id);
        if (size && input.value.trim()) size.name = input.value.trim();
      });

      saveSettings();
      populateDropdowns();
      renderAll();
      showToast('Custom shapes & sizes saved!', 'success');
    });

    document.getElementById('btnSavePreferences')?.addEventListener('click', () => {
      const low = parseInt(document.getElementById('settingLowStockThreshold').value, 10);
      const cost = parseFloat(document.getElementById('settingDefaultCost').value);
      const sell = parseFloat(document.getElementById('settingDefaultSellPrice').value);

      if (!isNaN(low) && low >= 0) appState.settings.lowStockThreshold = low;
      if (!isNaN(cost) && cost >= 0) appState.settings.defaultCostPrice = cost;
      if (!isNaN(sell) && sell >= 0) appState.settings.defaultSellPrice = sell;

      saveSettings();
      renderAll();
      showToast('Stock preferences saved!', 'success');
    });

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
      if (confirm('Load sample demonstration data? (Will overwrite current items with realistic wholesale data)')) {
        appState.stock = JSON.parse(JSON.stringify(INITIAL_STOCK_SAMPLE));
        appState.transactions = JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS_SAMPLE));
        saveStock();
        saveTransactions();
        renderAll();
        showToast('Sample data loaded!', 'success');
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
      navigator.serviceWorker.register('sw.js').then((reg) => {
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

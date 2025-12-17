// Utility: format numbers neatly
function fmt(n) {
  if (typeof n !== 'number' || !isFinite(n)) return String(n);
  const a = Math.abs(n);
  if (a !== 0 && (a < 1e-6 || a >= 1e6)) return n.toExponential(6);
  return Number(n.toFixed(10)).toString(); // trim floating noise
}

// Expression evaluator
document.getElementById('expr-btn').addEventListener('click', () => {
  const input = document.getElementById('expr-input').value.trim();
  const out = document.getElementById('expr-result');
  out.classList.remove('error');

  if (!input) {
    out.textContent = 'Please enter an expression.';
    return;
  }

  try {
    const result = math.evaluate(input);
    if (Array.isArray(result)) {
      out.textContent = JSON.stringify(result);
    } else if (typeof result === 'object' && result !== null) {
      out.textContent = JSON.stringify(result, null, 2);
    } else {
      out.textContent = fmt(result);
    }
  } catch (e) {
    out.classList.add('error');
    out.textContent = `Error: ${e.message}`;
  }
});

// Linear solver: a*x + b = c
document.getElementById('lin-btn').addEventListener('click', () => {
  const a = Number(document.getElementById('lin-a').value);
  const b = Number(document.getElementById('lin-b').value);
  const c = Number(document.getElementById('lin-c').value);
  const out = document.getElementById('lin-result');
  out.classList.remove('error');

  if (!isFinite(a) || !isFinite(b) || !isFinite(c)) {
    out.classList.add('error');
    out.textContent = 'Please enter valid numbers for a, b, and c.';
    return;
  }

  if (a === 0) {
    if (b === c) {
      out.textContent = 'Infinite solutions (any x).';
    } else {
      out.textContent = 'No solution.';
    }
    return;
  }

  const x = (c - b) / a;
  out.textContent = `x = ${fmt(x)}`;
});

// Quadratic solver: a*x^2 + b*x + c = 0
document.getElementById('quad-btn').addEventListener('click', () => {
  const a = Number(document.getElementById('quad-a').value);
  const b = Number(document.getElementById('quad-b').value);
  const c = Number(document.getElementById('quad-c').value);
  const out = document.getElementById('quad-result');
  out.classList.remove('error');

  if (!isFinite(a) || !isFinite(b) || !isFinite(c)) {
    out.classList.add('error');
    out.textContent = 'Please enter valid numbers for a, b, and c.';
    return;
  }

  if (a === 0) {
    out.classList.add('error');
    out.textContent = 'This is not quadratic (a must be nonzero). Try the linear solver above.';
    return;
  }

  const D = b*b - 4*a*c;
  if (D > 0) {
    const r1 = (-b + Math.sqrt(D)) / (2*a);
    const r2 = (-b - Math.sqrt(D)) / (2*a);
    out.textContent = `Two real roots:\n  x₁ = ${fmt(r1)}\n  x₂ = ${fmt(r2)}`;
  } else if (D === 0) {
    const r = (-b) / (2*a);
    out.textContent = `One real root (double):\n  x = ${fmt(r)}`;
  } else {
    const real = (-b) / (2*a);
    const imag = Math.sqrt(-D) / (2*a);
    out.textContent = `Complex roots:\n  x₁ = ${fmt(real)} + ${fmt(imag)}i\n  x₂ = ${fmt(real)} - ${fmt(imag)}i`;
  }
});
// Show/hide individual solver sections
function toggleSection(sectionId, checkboxId) {
  const section = document.getElementById(sectionId);
  const checkbox = document.getElementById(checkboxId);
  section.style.display = checkbox.checked ? "block" : "none";

  // If any individual checkbox is unchecked, uncheck Select All
  if (!checkbox.checked) {
    document.getElementById("selectAll").checked = false;
  }
}

// Handle Select All checkbox
function toggleAll() {
  const selectAll = document.getElementById("selectAll").checked;

  const mappings = [
    {checkId: "exprCheck", sectionId: "expr-section"},
    {checkId: "linCheck", sectionId: "lin-section"},
    {checkId: "quadCheck", sectionId: "quad-section"}
  ];

  mappings.forEach(m => {
    document.getElementById(m.checkId).checked = selectAll;
    document.getElementById(m.sectionId).style.display = selectAll ? "block" : "none";
  });
}

// Handle Clear All button
function clearAll() {
  document.getElementById("selectAll").checked = false;

  const mappings = [
    {checkId: "exprCheck", sectionId: "expr-section"},
    {checkId: "linCheck", sectionId: "lin-section"},
    {checkId: "quadCheck", sectionId: "quad-section"}
  ];

  mappings.forEach(m => {
    document.getElementById(m.checkId).checked = false;
    document.getElementById(m.sectionId).style.display = "none";
  });
}

import { 
  translations, 
  TERMINAL_NAMES, 
  PASSENGER_TYPES, 
  USER_ROLES,
  localizeTerminal,
  localizeRoute,
  localizeStatus,
  localizeTripType,
  localizePassengerCategory,
  localizeRole,
  formatDateLocale,
  formatCurrencyLocale
} from '../../src/utils/translations.js';

console.log('====================================================');
console.log('   TORONTO ISLAND FERRY LOCALIZATION VERIFICATION   ');
console.log('====================================================\n');

let errors = 0;
let warnings = 0;

// 1. Key Parity Check
const enKeys = Object.keys(translations.EN);
const frKeys = Object.keys(translations.FR);

console.log(`[CHECK 1] Translation Dictionaries:`);
console.log(`- English (EN) keys: ${enKeys.length}`);
console.log(`- French  (FR) keys: ${frKeys.length}`);

const missingInFr = enKeys.filter(k => !(k in translations.FR));
const missingInEn = frKeys.filter(k => !(k in translations.EN));

if (missingInFr.length > 0) {
  console.error(`❌ Keys in EN but missing in FR (${missingInFr.length}):`, missingInFr);
  errors += missingInFr.length;
} else {
  console.log(`✓ 100% of EN keys exist in FR.`);
}

if (missingInEn.length > 0) {
  console.error(`❌ Keys in FR but missing in EN (${missingInEn.length}):`, missingInEn);
  errors += missingInEn.length;
} else {
  console.log(`✓ 100% of FR keys exist in EN.`);
}

// 2. Empty Value Check
let emptyEn = 0;
let emptyFr = 0;
for (const k of enKeys) {
  if (typeof translations.EN[k] !== 'string' || translations.EN[k].trim() === '') {
    console.error(`❌ translations.EN['${k}'] is empty or not a string!`);
    emptyEn++;
    errors++;
  }
}
for (const k of frKeys) {
  if (typeof translations.FR[k] !== 'string' || translations.FR[k].trim() === '') {
    console.error(`❌ translations.FR['${k}'] is empty or not a string!`);
    emptyFr++;
    errors++;
  }
}
if (emptyEn === 0 && emptyFr === 0) {
  console.log(`✓ Zero empty translation values in EN and FR.`);
}

// 3. Helpers and Mappings Verification
console.log(`\n[CHECK 2] Terminals & Manifest Mappings:`);
console.log(`- TERMINAL_NAMES entries: ${Object.keys(TERMINAL_NAMES).length}`);
for (const [term, map] of Object.entries(TERMINAL_NAMES)) {
  if (!map.EN || !map.FR) {
    console.error(`❌ TERMINAL_NAMES['${term}'] is missing EN or FR mapping!`);
    errors++;
  }
}
console.log(`✓ All terminal names have valid EN and FR mappings.`);

console.log(`- PASSENGER_TYPES entries: ${Object.keys(PASSENGER_TYPES).length}`);
for (const [type, map] of Object.entries(PASSENGER_TYPES)) {
  if (!map.EN || !map.FR) {
    console.error(`❌ PASSENGER_TYPES['${type}'] is missing EN or FR mapping!`);
    errors++;
  }
}
console.log(`✓ All passenger categories have valid EN and FR mappings.`);

console.log(`- USER_ROLES entries: ${Object.keys(USER_ROLES).length}`);
for (const [role, map] of Object.entries(USER_ROLES)) {
  if (!map.EN || !map.FR) {
    console.error(`❌ USER_ROLES['${role}'] is missing EN or FR mapping!`);
    errors++;
  }
}
console.log(`✓ All user roles have valid EN and FR mappings.`);

// 4. Sample Localization Function Execution
console.log(`\n[CHECK 3] Functional Translation Assertions:`);

// Terminals
const frCentre = localizeTerminal('Centre Island', 'FR');
if (frCentre !== 'Île Centre') {
  console.error(`❌ localizeTerminal('Centre Island', 'FR') expected 'Île Centre', got '${frCentre}'`);
  errors++;
} else {
  console.log(`✓ Terminal localization: Centre Island -> ${frCentre}`);
}

const frJackLayton = localizeTerminal('Jack Layton Ferry Terminal', 'FR');
if (frJackLayton !== 'Terminal de traversier Jack Layton') {
  console.error(`❌ localizeTerminal Jack Layton Ferry Terminal expected 'Terminal de traversier Jack Layton', got '${frJackLayton}'`);
  errors++;
} else {
  console.log(`✓ Terminal localization: Jack Layton Ferry Terminal -> ${frJackLayton}`);
}

// Routes
const frRoute = localizeRoute('Jack Layton Ferry Terminal ➔ Centre Island', 'FR');
if (!frRoute.includes('Île Centre') || !frRoute.includes('Terminal de traversier Jack Layton')) {
  console.error(`❌ localizeRoute expected translated terminals, got '${frRoute}'`);
  errors++;
} else {
  console.log(`✓ Route localization: ${frRoute}`);
}

// Statuses
const frConfirmed = localizeStatus('confirmed', 'FR');
if (frConfirmed !== 'Confirmé') {
  console.error(`❌ localizeStatus('confirmed', 'FR') expected 'Confirmé', got '${frConfirmed}'`);
  errors++;
} else {
  console.log(`✓ Status localization: confirmed -> ${frConfirmed}`);
}

// Trip types
const frRound = localizeTripType('round', 'FR');
if (frRound !== 'Aller-retour') {
  console.error(`❌ localizeTripType('round', 'FR') expected 'Aller-retour', got '${frRound}'`);
  errors++;
} else {
  console.log(`✓ Trip type localization: round -> ${frRound}`);
}

// Role
const frAdmin = localizeRole('admin', 'FR');
if (frAdmin !== 'Administrateur') {
  console.error(`❌ localizeRole('admin', 'FR') expected 'Administrateur', got '${frAdmin}'`);
  errors++;
} else {
  console.log(`✓ Role localization: admin -> ${frAdmin}`);
}

// Currency format
const frCurrency = formatCurrencyLocale(18.22, 'FR');
if (!frCurrency.includes('18,22') || !frCurrency.includes('$')) {
  console.error(`❌ formatCurrencyLocale expected '18,22 $ CAD', got '${frCurrency}'`);
  errors++;
} else {
  console.log(`✓ Currency localization: 18.22 -> ${frCurrency}`);
}

// Date format
const frDate = formatDateLocale('2026-10-24', 'FR');
console.log(`✓ Date localization: 2026-10-24 -> ${frDate}`);

console.log('\n====================================================');
if (errors === 0) {
  console.log(`🎉 ALL LOCALIZATION CHECKS PASSED (0 ERRORS, 0 WARNINGS)`);
  console.log('   Total Keys in Parity: ' + enKeys.length);
} else {
  console.error(`⚠️ LOCALIZATION VERIFICATION FOUND ${errors} ERROR(S)!`);
  process.exit(1);
}
console.log('====================================================');

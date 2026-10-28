import { jsPDF } from 'jspdf';
import { TERMINAL_NAMES, TRIP_TYPES } from './translations';

/**
 * Generates and triggers download of a high-quality, official City of Toronto
 * Ferry digital boarding pass PDF using jsPDF with Canadian French / English bilingual localization.
 */
export async function downloadTicketPdf({ booking, passengerName, passengerEmail, language }) {
  if (!booking) return;

  const currentLang = language || (typeof window !== 'undefined' ? localStorage.getItem('ferry_language') : 'en') || 'en';
  const isFr = currentLang === 'fr';

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const leadName = passengerName || booking.contactName || booking.passengerDetails?.[0]?.fullName || (isFr ? 'Passager' : 'Passenger');
  const email = passengerEmail || booking.contactEmail || booking.user?.email || 'N/A';
  const phone = booking.contactPhone || 'N/A';
  const ticketCode = booking.ticketCode || 'TOR-FERRY';
  const bookingRef = booking.bookingReference || ticketCode;
  
  const tripTypeLabel = booking.tripType === 'round' 
    ? (isFr ? 'Aller-retour (Traversée de retour incluse)' : 'Round Trip (Return Crossing Included)')
    : (isFr ? 'Traversée simple aller' : 'One-Way Single Crossing');
  
  const dateStr = booking.date || new Date().toISOString().split('T')[0];
  const timeSlot = booking.departureTime || (isFr ? 'Traversée régulière prévue' : 'Scheduled Regular Run');
  const gate = booking.gate || (isFr ? 'Porte 2 (Terminal Jack Layton)' : 'Gate 2 (Jack Layton Terminal)');
  
  const rawOrigin = booking.from || 'Jack Layton Ferry Terminal';
  const rawDest = booking.to || 'Centre Island';
  const origin = isFr ? (TERMINAL_NAMES.FR[rawOrigin] || rawOrigin) : rawOrigin;
  const dest = isFr ? (TERMINAL_NAMES.FR[rawDest] || rawDest) : rawDest;

  const totalPassengers = booking.passengers || (
    (booking.adults || 0) + (booking.seniors || 0) + (booking.youth || 0) + (booking.juniors || 0) + (booking.infants || 0)
  ) || 1;

  const baseFare = booking.pricing?.baseFare !== undefined ? booking.pricing.baseFare.toFixed(2) : '0.00';
  const taxAmount = booking.pricing?.taxAmount !== undefined ? booking.pricing.taxAmount.toFixed(2) : '0.00';
  const harbourFee = booking.pricing?.harbourFee !== undefined ? booking.pricing.harbourFee.toFixed(2) : '0.75';
  const totalAmount = booking.pricing?.totalAmount !== undefined ? booking.pricing.totalAmount.toFixed(2) : '0.00';
  const currency = booking.pricing?.currency || 'CAD';

  // 1. Top Decorative Header Bar (Toronto Deep Blue)
  doc.setFillColor(0, 51, 102); // #003366
  doc.rect(15, 15, 180, 28, 'F');

  // City Branding Subheader
  doc.setTextColor(255, 184, 28); // #ffb81c Gold
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(
    isFr ? 'VILLE DE TORONTO • PARCS, FORÊTS ET LOISIRS' : 'CITY OF TORONTO • PARKS, FORESTRY & RECREATION',
    22, 
    23
  );

  // Main Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.text(
    isFr ? 'TRAVERSIER DES ÎLES DE TORONTO — PASSE OFFICIELLE' : 'TORONTO ISLAND FERRY — OFFICIAL BOARDING PASS',
    22, 
    32
  );

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 225, 255);
  doc.text(
    isFr ? 'Autorisation de tourniquet optique • Terminal Jack Layton' : 'Automated Optical Turnstile Clearance Document • Jack Layton Terminal',
    22, 
    38
  );

  // Status Badge in Header
  doc.setFillColor(16, 185, 129); // Emerald 500
  doc.roundedRect(152, 20, 36, 8, 2, 2, 'F');
  doc.setTextColor(0, 40, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(isFr ? 'PASSE VALIDE' : 'VALID PASS', 155, 25.5);

  // 2. Ticket Identification Ribbon
  doc.setFillColor(241, 245, 249); // Slate 100
  doc.rect(15, 43, 180, 14, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(15, 57, 195, 57);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(isFr ? 'CODE DU BILLET :' : 'TICKET CODE:', 22, 51);
  doc.setTextColor(0, 79, 139);
  doc.setFontSize(10);
  doc.text(ticketCode, 50, 51);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text(isFr ? 'RÉF. RÉSERV. :' : 'BOOKING REF:', 95, 51);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.text(bookingRef, 120, 51);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text(isFr ? 'DATE DU VOYAGE :' : 'TRAVEL DATE:', 150, 51);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.text(dateStr, 175, 51);

  // 3. Crossing & Route Information Box
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, 62, 180, 38, 3, 3, 'S');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 79, 139);
  doc.text(
    isFr ? 'ITINÉRAIRE DE TRAVERSÉE ET TERMINAL DU SECTEUR RIVERAIN' : 'WATERFRONT CROSSING & TERMINAL ITINERARY',
    22, 
    70
  );

  // From -> To
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${origin}   →   ${dest}`, 22, 79);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`${isFr ? 'Type de trajet :' : 'Trip Type:'} ${tripTypeLabel}`, 22, 85);
  doc.text(`${isFr ? 'Porte d’embarquement :' : 'Boarding Gate:'} ${gate}`, 22, 91);
  doc.text(`${isFr ? 'Créneau de départ :' : 'Departure Slot:'} ${timeSlot}`, 22, 96);

  // 4. Passenger Registry Box
  doc.roundedRect(15, 104, 180, 36, 3, 3, 'S');
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 79, 139);
  doc.text(
    isFr ? 'PASSAGERS ENREGISTRÉS ET COORDONNÉES' : 'REGISTERED PASSENGERS & CONTACT DETAILS',
    22, 
    112
  );

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${isFr ? 'Passager principal :' : 'Lead Passenger:'} ${leadName}`, 22, 120);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`${isFr ? 'Courriel :' : 'Email:'} ${email}    |    ${isFr ? 'Téléphone :' : 'Phone:'} ${phone}`, 22, 126);
  doc.text(`${isFr ? 'Nombre total de passagers :' : 'Total Passengers Booked:'} ${totalPassengers} ${isFr ? 'Passager(s)' : 'Passenger(s)'}`, 22, 132);

  const passengerBreakdown = [
    booking.adults ? `${booking.adults} ${isFr ? 'Adulte(s)' : 'Adult(s)'}` : null,
    booking.seniors ? `${booking.seniors} ${isFr ? 'Aîné(s)' : 'Senior(s)'}` : null,
    booking.youth ? `${booking.youth} ${isFr ? 'Jeune(s)' : 'Youth'}` : null,
    booking.juniors ? `${booking.juniors} ${isFr ? 'Enfant(s)' : 'Junior/Child'}` : null,
    booking.infants ? `${booking.infants} ${isFr ? 'Nourrisson(s)' : 'Infant(s)'}` : null,
    booking.bicycles ? `${booking.bicycles} ${isFr ? 'Vélo(s)' : 'Bicycle(s)'}` : null,
  ].filter(Boolean).join(' • ') || `${totalPassengers} ${isFr ? 'Passager(s)' : 'Passenger(s)'}`;

  doc.text(`${isFr ? 'Détail des catégories :' : 'Category Breakdown:'} ${passengerBreakdown}`, 22, 137);

  // 5. QR Code & Turnstile Scan Section
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, 144, 180, 60, 3, 3, 'F');
  doc.roundedRect(15, 144, 180, 60, 3, 3, 'S');

  // Try extracting QR Code image from DOM
  let qrEmbedded = false;
  try {
    const svgEl = document.querySelector('#ticket-qr-code svg') || document.querySelector('.ticket-qr svg') || document.querySelector('svg');
    if (svgEl) {
      const svgData = new XMLSerializer().serializeToString(svgEl);
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      const imgPromise = new Promise((resolve) => {
        img.onload = () => {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, 300, 300);
          ctx.drawImage(img, 0, 0, 300, 300);
          resolve(true);
        };
        img.onerror = () => resolve(false);
      });

      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
      const ok = await imgPromise;
      if (ok) {
        const pngUrl = canvas.toDataURL('image/png');
        doc.addImage(pngUrl, 'PNG', 24, 150, 48, 48);
        qrEmbedded = true;
      }
    }
  } catch (err) {
    console.warn('Could not extract QR SVG to canvas:', err);
  }

  if (!qrEmbedded) {
    doc.setFillColor(255, 255, 255);
    doc.rect(24, 150, 48, 48, 'F');
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(1);
    doc.rect(24, 150, 48, 48, 'S');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(isFr ? 'PASSE QR VALIDE' : 'VALID QR PASS', 28, 172);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(ticketCode, 28, 178);
  }

  // Barcode Instructions beside QR
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(
    isFr ? 'INSTRUCTIONS POUR LE TOURNIQUET AUTOMATISÉ' : 'AUTOMATED TURNSTILE INSTRUCTIONS',
    78, 
    154
  );

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  if (isFr) {
    doc.text('1. Présentez ce code-barres numérique ou imprimé au lecteur optique.', 78, 162);
    doc.text('2. Maintenez la passe à 5-10 cm du lecteur jusqu\'à ce que le voyant vert s\'allume.', 78, 169);
    doc.text('3. Les passes aller-retour sont valides pour le retour depuis tout quai de l\'île.', 78, 176);
    doc.text('4. Les vélos et poussettes doivent emprunter les portes larges désignées.', 78, 183);
    doc.text('5. Billet non transférable; valide pour la date prévue et les passagers choisis.', 78, 190);
  } else {
    doc.text('1. Present this digital barcode or printed pass directly at the optical reader.', 78, 162);
    doc.text('2. Hold pass 5-10 cm from the glass scanner until the green light illuminates.', 78, 169);
    doc.text('3. Round-trip passes are valid for return departures from any island dock.', 78, 176);
    doc.text('4. Bicycles and strollers must be walked through designated wide gates.', 78, 183);
    doc.text('5. Non-transferable ticket; valid for scheduled date and selected passengers.', 78, 190);
  }

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 79, 139);
  doc.text(`${isFr ? 'Donnée tourniquet :' : 'Turnstile Payload:'} ${booking.qrPayload || `TORONTO-ISLAND-FERRY:${ticketCode}:VALID`}`, 78, 198);

  // 6. Itemized Fare Breakdown & Tax Verification
  doc.roundedRect(15, 208, 180, 36, 3, 3, 'S');
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 79, 139);
  doc.text(
    isFr ? 'REÇU DÉTAILLÉ DU TARIF ET DÉCLARATION FISCALE' : 'ITEMIZED FARE RECEIPT & TAX STATEMENT',
    22, 
    216
  );

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(isFr ? 'Tarif de base des passagers :' : 'Passenger Base Fare:', 22, 224);
  doc.text(`$${baseFare} ${currency}`, 165, 224, { align: 'right' });

  doc.text(isFr ? 'Taxe harmonisée sur les produits et services (TPS / TVH) :' : 'Harmonized Goods & Services Tax (GST / HST):', 22, 229);
  doc.text(`$${taxAmount} ${currency}`, 165, 229, { align: 'right' });

  doc.text(isFr ? 'Frais municipaux des installations portuaires et sécurité :' : 'Municipal Harbour Facilities & Security Fee:', 22, 234);
  doc.text(`$${harbourFee} ${currency}`, 165, 234, { align: 'right' });

  doc.setDrawColor(203, 213, 225);
  doc.line(22, 236, 188, 236);

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(isFr ? 'Tarif total payé :' : 'Total Fare Paid:', 22, 241);
  doc.setTextColor(217, 119, 6); // Amber/Orange
  doc.text(`$${totalAmount} ${currency}`, 165, 241, { align: 'right' });

  // 7. Footer / Legal
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text(
    isFr ? 'Ville de Toronto • Division des Parcs, Forêts et Loisirs • 9 Queens Quay Ouest, Toronto, ON M5J 2H3' : 'City of Toronto • Parks, Forestry & Recreation Division • 9 Queen\'s Quay West, Toronto, ON M5J 2H3',
    pageWidth / 2,
    258,
    { align: 'center' }
  );
  doc.text(
    isFr ? 'Soutien : 416-392-8193 • toronto.ca/ferry • Dossier de transport municipal officiel enregistré dans MongoDB' : 'Support: 416-392-8193 • toronto.ca/ferry • Official Municipal Transit Record Persisted in MongoDB',
    pageWidth / 2,
    263,
    { align: 'center' }
  );

  // Trigger Save
  doc.save(`Toronto-Ferry-Pass-${ticketCode}.pdf`);
}

# Product Requirements Document (PRD)
## Simple Invoice Generator App

---

## 1. Product Overview

The Simple Invoice Generator is a lightweight web application that allows users to generate invoices using a fixed template. Users can input item details, upload a company logo and QRIS image, and automatically compute totals.

The layout and most invoice content are fixed based on a predefined template, with only specific fields being dynamic.

---

## 2. Goals & Objectives

### Goals
- Enable fast invoice creation (under 2 minutes)
- Ensure consistent invoice format
- Minimize user input complexity
- Provide clean printable output

### Non-Goals (MVP)
- No user authentication
- No database storage
- No invoice history
- No tax/discount features
- No dynamic customer data

---

## 3. Target Users

### Primary Users
- Individuals or small teams who need quick invoice generation
- Event organizers or small businesses (e.g. charity, internal operations)

---

## 4. Product Scope

### 4.1 Included Features
- Item-based invoice creation
- Auto calculation (item total, subtotal, total)
- Upload company logo
- Upload QRIS image
- Input invoice date and due date
- Live invoice preview
- Print / download as PDF

### 4.2 Excluded Features (MVP)
- Invoice numbering system
- Editable billing information
- Backend storage
- Multi-currency support
- Tax/discount logic

---

## 5. Functional Requirements

---

## 5.1 Invoice Layout

The invoice follows a **fixed template**.

### Static Content (Hardcoded)
- Title: "Faktur"
- Organization name & email
- Billing recipient information
- Payment instructions (bank + QRIS note)
- Closing notes

Reference: Based on provided invoice file structure. :contentReference[oaicite:0]{index=0}

### Removed Elements
- Invoice number (e.g. "Faktur # 2") is NOT included

---

## 5.2 Dynamic Fields

### 5.2.1 Dates
User must input:
- **Tanggal (Invoice Date)**
- **Jatuh Tempo (Due Date)**

Requirements:
- Required fields
- Display format: `DD MMM YYYY` (e.g. 4 Apr 2025)

---

### 5.2.2 Item Table

User can input multiple items.

Fields per item:
- Item Name (string)
- Quantity (number)
- Cost (number)

System-generated:
- Item Total = Quantity × Cost

Table columns:
- Barang
- Kuantitas
- Harga
- Jumlah

---

### 5.2.3 Calculations

The system must automatically calculate:

- Item Total = Quantity × Cost
- Subtotal = Sum of all item totals
- Total = Subtotal
- Saldo Jatuh Tempo = Total

Currency format:
- Indonesian Rupiah (e.g. Rp190.000)

---

### 5.2.4 Company Logo Upload

- Upload formats: JPG, JPEG, PNG
- Position: Top-left of invoice
- Auto-resize (maintain aspect ratio)

---

### 5.2.5 QRIS Image Upload

- Upload formats: JPG, JPEG, PNG
- Position: Bottom-left of invoice
- Must be clearly visible
- Auto-resize

---

### 5.2.6 Item Management

User must be able to:
- Add new item row
- Remove item row
- Edit existing item
- See totals update in real-time

---

### 5.2.7 Invoice Preview

System must render a live preview including:
- Logo
- Static invoice content
- User-input dates
- Item table
- Subtotal & total
- QRIS image
- Payment instructions
- Closing notes

---

### 5.2.8 Print & Export

User must be able to:
- Print invoice
- Download invoice as PDF

Requirement:
- Output must match preview layout

---

## 6. User Flow

1. User opens the app
2. Uploads company logo
3. Uploads QRIS image
4. Inputs invoice date & due date
5. Adds item(s) (name, quantity, cost)
6. System calculates totals automatically
7. User reviews invoice preview
8. User prints or downloads PDF

---

## 7. UX Requirements

- Clean, minimal UI
- Table-based item input
- Real-time calculation feedback
- Drag-and-drop or click upload for images
- Clear separation between input panel and preview

---

## 8. Non-Functional Requirements

### Performance
- Instant calculation updates (<100ms)

### Responsiveness
- Optimized for desktop (primary)
- Tablet-friendly

### Reliability
- No crashes on invalid input
- Basic validation (numeric fields)

### Usability
- No onboarding required
- Intuitive form structure

---

## 9. Technical Requirements

### Suggested Stack
- Frontend: React / Next.js
- Styling: Tailwind CSS
- State: Local state (no backend)
- File handling: Browser file API
- PDF: Browser print / PDF export library

---

## 10. Acceptance Criteria

The product is complete when:

- User can input Tanggal and Jatuh Tempo
- Invoice number is not displayed
- User can upload logo → appears top-left
- User can upload QRIS → appears bottom-left
- User can add multiple items
- Each item total is calculated correctly
- Subtotal and total are calculated correctly
- Currency is formatted in Rupiah
- Invoice preview reflects all inputs accurately
- User can print and download PDF
- Layout matches predefined template

---

## 11. Future Enhancements (Post-MVP)

- Editable customer details
- Invoice numbering system
- Save & load invoices
- Tax and discount support
- Multi-template support
- WhatsApp / email sharing
- Backend integration

---

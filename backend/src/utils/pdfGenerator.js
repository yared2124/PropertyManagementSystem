import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Generate a contract PDF and save it to disk.
 * @param {Object} contract - Contract data from DB.
 * @param {Object} asset - Asset (property or vehicle).
 * @param {Object} tenant - User object.
 * @param {Object} landlord - User object.
 * @returns {Promise<string>} - File path to the generated PDF.
 */
export const generateContractPDF = async (
  contract,
  asset,
  tenant,
  landlord,
) => {
  return new Promise((resolve, reject) => {
    const filename = `contract_${contract.contractNumber}_${Date.now()}.pdf`;
    const filePath = path.join(process.cwd(), "uploads", "contracts", filename);
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // ----- Header -----
    doc.fontSize(20).text("PROPERTY MANAGEMENT SYSTEM", { align: "center" });
    doc.fontSize(16).text("Lease Agreement", { align: "center" });
    doc.moveDown();

    // ----- Contract Number & Date -----
    doc.fontSize(12);
    doc.text(`Contract No: ${contract.contractNumber}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    // ----- Parties -----
    doc.text("This Agreement is made between:");
    doc.text(
      `Landlord: ${landlord.firstName} ${landlord.lastName} (${landlord.email})`,
    );
    doc.text(
      `Tenant:   ${tenant.firstName} ${tenant.lastName} (${tenant.email})`,
    );
    doc.moveDown();

    // ----- Property/Asset Details -----
    doc.text("Asset Details:");
    doc.text(`Type: ${asset.assetType}`);
    if (asset.address) doc.text(`Address: ${asset.address}`);
    if (asset.area) doc.text(`Area: ${asset.area} m²`);
    if (asset.bedrooms) doc.text(`Bedrooms: ${asset.bedrooms}`);
    doc.moveDown();

    // ----- Terms -----
    doc.text(
      `Commencement Date: ${new Date(contract.startDate).toLocaleDateString()}`,
    );
    doc.text(
      `Expiry Date:       ${new Date(contract.endDate).toLocaleDateString()}`,
    );
    doc.text(`Monthly Rent:      SAR ${contract.monthlyRent}`);
    doc.text(`Security Deposit:  SAR ${contract.securityDeposit}`);
    doc.text(`Late Penalty:      SAR ${contract.latePaymentPenalty}`);
    doc.text(`Total Value:       SAR ${contract.totalAmount}`);
    doc.moveDown();

    // ----- Terms & Conditions -----
    doc.fontSize(14).text("Terms & Conditions", { underline: true });
    doc.fontSize(11);
    const tcs = contract.termsAndConditions || [
      "The tenant shall pay rent on the first of each month.",
      "The landlord is responsible for major structural repairs.",
      "The tenant shall maintain the property in good condition.",
      "No alterations without written consent of the landlord.",
    ];
    tcs.forEach((clause, i) => {
      doc.text(`${i + 1}. ${clause}`);
    });
    doc.moveDown();

    // ----- Signatures -----
    doc.fontSize(12);
    doc.text("Signatures:");
    doc.text("Landlord: ___________________   Date: __________");
    doc.text("Tenant:  ___________________   Date: __________");
    doc.text("Witness: ___________________   Date: __________");

    doc.end();

    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
};

/**
 * Generate an invoice PDF for a payment.
 * @param {Object} payment - Payment record.
 * @param {Object} contract - Related contract.
 * @returns {Promise<string>} - File path.
 */
export const generateInvoicePDF = async (payment, contract) => {
  return new Promise((resolve, reject) => {
    const filename = `invoice_${payment.paymentNumber}_${Date.now()}.pdf`;
    const filePath = path.join(process.cwd(), "uploads", "invoices", filename);
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text("INVOICE", { align: "center" });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Invoice Number: ${payment.paymentNumber}`);
    doc.text(`Date: ${new Date(payment.paymentDate).toLocaleDateString()}`);
    doc.text(`Contract: ${contract.contractNumber}`);
    doc.moveDown();
    doc.text(`Amount: SAR ${payment.amount}`);
    doc.text(`Method: ${payment.method}`);
    doc.text(`Status: ${payment.status}`);
    doc.moveDown();
    doc.text("Thank you for your payment.");

    doc.end();
    stream.on("finish", () => resolve(filePath));
    stream.on("error", reject);
  });
};

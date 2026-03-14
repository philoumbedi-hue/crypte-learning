"use client";

import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import jsPDF from "jspdf";

interface CertificateButtonProps {
    certificateId: string;
    studentName: string;
    courseTitle: string;
    issueDate: Date;
}

export default function CertificateButton({ certificateId, studentName, courseTitle, issueDate }: CertificateButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const generatePDF = async () => {
        setIsGenerating(true);
        try {
            // Create a landscape PDF
            const doc = new jsPDF({
                orientation: "l",
                unit: "mm",
                format: "a4"
            });

            // Dimensions: 297 x 210 mm
            const width = doc.internal.pageSize.getWidth();
            const height = doc.internal.pageSize.getHeight();

            // Background color
            doc.setFillColor(250, 250, 252);
            doc.rect(0, 0, width, height, "F");

            // Outer border
            doc.setDrawColor(79, 70, 229); // Indigo 600
            doc.setLineWidth(2);
            doc.rect(10, 10, width - 20, height - 20);

            // Inner border
            doc.setDrawColor(200, 200, 210);
            doc.setLineWidth(0.5);
            doc.rect(15, 15, width - 30, height - 30);

            // Header
            doc.setTextColor(30, 30, 35);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(40);
            doc.text("CERTIFICAT D'ACHÈVEMENT", width / 2, 50, { align: "center" });

            doc.setFont("helvetica", "normal");
            doc.setFontSize(16);
            doc.setTextColor(100, 100, 110);
            doc.text("Décerné avec fierté par CRYPTE Université à", width / 2, 70, { align: "center" });

            // Student Name
            doc.setFont("helvetica", "bolditalic");
            doc.setFontSize(36);
            doc.setTextColor(79, 70, 229);
            doc.text(studentName.toUpperCase(), width / 2, 100, { align: "center" });

            // Course Details
            doc.setFont("helvetica", "normal");
            doc.setFontSize(16);
            doc.setTextColor(100, 100, 110);
            doc.text("Pour avoir complété avec succès le programme intensif :", width / 2, 120, { align: "center" });

            doc.setFont("helvetica", "bold");
            doc.setFontSize(24);
            doc.setTextColor(30, 30, 35);
            doc.text(courseTitle, width / 2, 140, { align: "center" });

            // Footer Information
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.setTextColor(100, 100, 110);

            const formattedDate = new Intl.DateTimeFormat('fr-FR', {
                day: '2-digit', month: 'long', year: 'numeric'
            }).format(new Date(issueDate));

            doc.text(`Fait le : ${formattedDate}`, 40, 180);

            // Verification Link
            doc.setFontSize(10);
            const domain = window.location.origin;
            doc.text(`ID Unique : ${certificateId}`, width - 40, 175, { align: "right" });
            doc.setTextColor(79, 70, 229);
            doc.text(`${domain}/verify-certificate/${certificateId}`, width - 40, 182, { align: "right" });

            // Signature line
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(0.5);
            doc.line(40, 172, 100, 172);
            doc.setFontSize(10);
            doc.setTextColor(30, 30, 35);
            doc.text("Direction Académique", 70, 168, { align: "center" });

            // Save the PDF
            doc.save(`Certificat-${studentName.replace(/\s+/g, "_")}-${courseTitle.replace(/\s+/g, "_")}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Erreur lors de la génération du certificat.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <button
            onClick={generatePDF}
            disabled={isGenerating}
            className="flex flex-1 sm:flex-none items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
        >
            {isGenerating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <Download className="w-5 h-5" />
            )}
            Télécharger mon PDF
        </button>
    );
}

import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, ArrowLeft, Printer, FileText, Plane, MapPin } from 'lucide-react';

const Invoice = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef(null);

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      const res = await api.get(`/trips/${id}`);
      setTrip(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    try {
      const canvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Traveloop_Invoice_${trip.name.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF. Make sure all images have CORS enabled.');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="h-10 w-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
    </div>
  );

  const budgets = trip?.budgets || [];
  const subtotal = budgets.reduce((acc, b) => acc + Number(b.amount), 0);
  const gst = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + gst;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-12">
      
      {/* Top Actions */}
      <div className="flex justify-between items-center mb-8">
        <Link to={`/trips/${id}/view`} className="flex items-center gap-2 text-gray-500 hover:text-primary-600 font-medium transition">
          <ArrowLeft className="h-5 w-5" /> Back to Itinerary
        </Link>
        <div className="flex gap-3">
          <button onClick={() => window.print()} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-xl font-medium shadow-sm flex items-center gap-2 transition">
            <Printer className="h-4 w-4" /> Print
          </button>
          <button onClick={handleDownloadPDF} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-xl font-medium shadow-sm flex items-center gap-2 transition">
            <Download className="h-4 w-4" /> Download PDF
          </button>
        </div>
      </div>

      {/* Invoice Document (A4 Ratio container for visual accuracy) */}
      <div className="bg-gray-50 p-4 sm:p-8 rounded-3xl">
        <div 
          ref={invoiceRef} 
          className="bg-white w-full max-w-[800px] mx-auto min-h-[1056px] shadow-lg rounded-sm p-12 relative overflow-hidden"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {/* Decorative Top */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-primary-600"></div>
          
          {/* Header */}
          <div className="flex justify-between items-start mb-16 mt-4">
            <div>
              <div className="flex items-center gap-2 text-primary-700 font-black text-3xl tracking-tighter mb-1">
                <Plane className="h-8 w-8" /> TRAVELOOP
              </div>
              <p className="text-gray-400 text-sm font-medium tracking-wide">ITINERARY EXPENSE REPORT</p>
            </div>
            <div className="text-right">
              <h1 className="text-4xl font-black text-gray-200 uppercase tracking-widest mb-2">Invoice</h1>
              <p className="text-gray-900 font-bold text-lg">INV-{trip.id.substring(0,6).toUpperCase()}</p>
              <p className="text-gray-500 text-sm">Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Billing Info */}
          <div className="grid grid-cols-2 gap-12 mb-12">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Billed To</p>
              <h3 className="font-bold text-gray-900 text-lg">{trip.user?.firstName} {trip.user?.lastName}</h3>
              <p className="text-gray-500 text-sm">{trip.user?.email}</p>
              <p className="text-gray-500 text-sm mt-1">{trip.user?.city}, {trip.user?.country}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Trip Details</p>
              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-500" /> {trip.name}
              </h3>
              <p className="text-gray-500 text-sm">Status: <span className="uppercase font-semibold text-gray-700">{trip.status}</span></p>
              <p className="text-gray-500 text-sm">Duration: {new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Table */}
          <div className="mb-12">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-3 px-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Description</th>
                  <th className="py-3 px-2 text-xs font-bold text-gray-400 uppercase tracking-wider w-1/4">Category</th>
                  <th className="py-3 px-2 text-xs font-bold text-gray-400 uppercase tracking-wider text-right w-1/4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {budgets.length > 0 ? budgets.map((b, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-b-0">
                    <td className="py-4 px-2 text-gray-800 font-medium">{b.notes || `Budget allocation for ${b.category}`}</td>
                    <td className="py-4 px-2 text-gray-500 capitalize">{b.category}</td>
                    <td className="py-4 px-2 text-gray-900 font-bold text-right">₹{b.amount}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-gray-400 italic">No budget items found for this trip.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-24">
            <div className="w-1/2 md:w-1/3">
              <div className="flex justify-between py-2 text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between py-2 text-sm text-gray-600">
                <span>Tax (GST 18%)</span>
                <span className="font-medium text-gray-900">₹{gst}</span>
              </div>
              <div className="flex justify-between py-4 mt-2 border-t-2 border-gray-900">
                <span className="font-bold text-gray-900 text-lg uppercase">Total Due</span>
                <span className="font-black text-primary-600 text-xl">₹{grandTotal}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-12 left-12 right-12 text-center border-t border-gray-100 pt-8">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-1 flex justify-center items-center gap-1">
              <FileText className="h-3 w-3" /> Generated Automatically
            </p>
            <p className="text-gray-300 text-xs">Traveloop Inc. • Contact: support@traveloop.com</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Invoice;

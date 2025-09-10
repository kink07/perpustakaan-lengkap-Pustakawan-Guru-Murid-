import React from 'react';
import { X, Printer, Download } from 'lucide-react';

interface MemberData {
  id: number;
  name: string;
  membershipId: string;
  type: 'siswa' | 'guru' | 'pustakawan' | 'staff';
  class?: string;
  subject?: string;
  position?: string;
  email: string;
  phone: string;
  joinDate: string;
  expiryDate: string;
  status: 'active' | 'inactive' | 'suspended';
  photo: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  notes: string;
}

interface MemberCardModalProps {
  member: MemberData;
  onClose: () => void;
}

function MemberCardModal({ member, onClose }: MemberCardModalProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert('Fitur download PDF akan segera tersedia');
  };

  const generateBarcodeStripes = () => {
    const pattern = [];
    for (let i = 0; i < 50; i++) {
      const width = Math.random() > 0.5 ? 2 : 1;
      const isBlack = Math.random() > 0.3;
      pattern.push({ width, isBlack });
    }
    return pattern;
  };

  const barcodePattern = generateBarcodeStripes();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Kartu Anggota - {member.name}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Card Display */}
        <div className="p-6">
          <div className="member-cards-print-wrapper">
            <div className="member-cards-print-area flex justify-center">
              <div className={`member-card ${
                member.type === 'siswa' ? 'bg-red-600' :
                member.type === 'guru' ? 'bg-green-600' :
                member.type === 'pustakawan' ? 'bg-purple-600' :
                'bg-orange-600'
              } text-white`}>
                {/* Card Header */}
                <div className="member-card-header">
                  <div className="text-white">
                    <h3 className="text-lg font-bold">PERPUSTAKAAN DIGITAL</h3>
                    <p className="text-sm opacity-90">SMAN 1 JAKARTA</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    member.type === 'siswa' ? 'status-siswa' :
                    member.type === 'guru' ? 'status-guru' :
                    member.type === 'pustakawan' ? 'status-pustakawan' :
                    'status-staff'
                  }`}>
                    {member.type.toUpperCase()}
                  </div>
                </div>

                {/* Card Body */}
                <div className="member-card-body">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="member-photo"
                  />
                  <div className="member-info text-white">
                    <h3>{member.name}</h3>
                    <p className="opacity-90">
                      {member.type === 'siswa' ? member.class :
                       member.type === 'guru' ? member.subject :
                       member.position}
                    </p>
                    <p className="opacity-75">ID: {member.membershipId}</p>
                    <p className="opacity-75 text-xs">
                      Berlaku s/d: {new Date(member.expiryDate).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>

                {/* Barcode */}
                <div className="member-barcode">
                  <div className="flex items-end h-8 bg-white mx-2 mb-2 px-1 overflow-hidden">
                    {barcodePattern.map((stripe, index) => (
                      <div
                        key={index}
                        className={`${stripe.isBlack ? 'bg-black' : 'bg-white'} h-full`}
                        style={{ width: `${stripe.width}px` }}
                      />
                    ))}
                  </div>
                  <div className="text-center text-xs font-mono opacity-90">
                    {member.membershipId}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Kartu anggota untuk {member.name}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Printer className="w-4 h-4 mr-2 inline" />
                Print Kartu
              </button>
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2 inline" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberCardModal;
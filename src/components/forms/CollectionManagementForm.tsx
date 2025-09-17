import React, { useState } from 'react';
import { 
  Book, 
  FileText, 
  BookOpen, 
  Tag,
  Save,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  RefreshCw,
  Printer,
  Settings,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import DescriptiveCatalogingForm from '../DescriptiveCatalogingForm';
import BookListForm from './BookListForm';
import LabelBarcodeForm from './LabelBarcodeForm';

interface CollectionManagementFormProps {
  user?: any;
  onBookAdded?: () => void;
  onEditBook?: (book: any) => void;
  editingBook?: any;
}

function CollectionManagementForm({ user, onBookAdded, onEditBook, editingBook }: CollectionManagementFormProps) {
  const [activeTab, setActiveTab] = useState('cataloging');

  const tabs = [
    { id: 'cataloging', label: 'Kataloging', icon: <FileText className="w-4 h-4" /> },
    { id: 'book-list', label: 'Daftar Buku', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'label-barcode', label: 'Label & Barcode', icon: <Tag className="w-4 h-4" /> }
  ];

  const handleBookSaved = () => {
    if (onBookAdded) {
      onBookAdded();
    }
  };

  const handleEditBook = (book: any) => {
    if (onEditBook) {
      onEditBook(book);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'cataloging':
        return <DescriptiveCatalogingForm user={user} onBookAdded={handleBookSaved} editingBook={editingBook} />;
      case 'book-list':
        return <BookListForm user={user} onBookAdded={onBookAdded} onEditBook={handleEditBook} />;
      case 'label-barcode':
        return <LabelBarcodeForm user={user} onBookAdded={onBookAdded} />;
      default:
        return <DescriptiveCatalogingForm user={user} onBookAdded={handleBookSaved} editingBook={editingBook} />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Book className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Manajemen Koleksi</h2>
            <p className="text-sm text-gray-600">Kelola katalog, daftar buku, dan label barcode</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  );
}

export default CollectionManagementForm;


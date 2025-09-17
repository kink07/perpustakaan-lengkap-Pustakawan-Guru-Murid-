import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Archive, 
  RefreshCw, 
  Bookmark, 
  Clock, 
  DollarSign,
  User,
  Search,
  Scan,
  CheckCircle,
  AlertCircle,
  Eye,
  Bell,
  FileText,
  Calculator,
  Loader2,
  X,
  MoreVertical,
} from 'lucide-react';
import { databaseService } from '../../services/database';
import { User as UserType, CatalogBook, BorrowRecord, ActiveBorrowing } from '../../types/database';

interface CirculationFormProps {
  user?: any;
}

function CirculationForm({ user }: CirculationFormProps) {
  const [activeTab, setActiveTab] = useState('check-out');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Data states
  const [members, setMembers] = useState<UserType[]>([]);
  const [books, setBooks] = useState<CatalogBook[]>([]);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
  const [activeBorrowings, setActiveBorrowings] = useState<ActiveBorrowing[]>([]);
  const [selectedMember, setSelectedMember] = useState<UserType | null>(null);
  const [selectedBook, setSelectedBook] = useState<CatalogBook | null>(null);
  const [searchResults, setSearchResults] = useState<UserType[]>([]);
  const [showMemberResults, setShowMemberResults] = useState(false);
  
  const [transactionData, setTransactionData] = useState({
    memberBarcode: '',
    bookBarcode: '',
    borrowDate: new Date().toISOString().split('T')[0], // Tambahkan borrowDate
    dueDate: '',
    notes: '',
    fineAmount: '',
    paymentMethod: 'cash'
  });

  // Return form states
  const [returnData, setReturnData] = useState({
    memberBarcode: '',
    bookBarcode: '',
    returnDate: new Date().toISOString().split('T')[0],
    bookCondition: 'Baik - Tidak Ada Kerusakan',
    lateStatus: 'Tepat Waktu',
    fineAmount: 0,
    returnNotes: ''
  });
  const [selectedReturnMember, setSelectedReturnMember] = useState<UserType | null>(null);
  const [selectedReturnBook, setSelectedReturnBook] = useState<CatalogBook | null>(null);
  const [returnSearchResults, setReturnSearchResults] = useState<UserType[]>([]);
  const [showReturnMemberResults, setShowReturnMemberResults] = useState(false);
  const [memberActiveBorrowings, setMemberActiveBorrowings] = useState<ActiveBorrowing[]>([]);
  
  // Active borrowings search and selection states
  const [activeBorrowingsSearch, setActiveBorrowingsSearch] = useState('');
  const [selectedBorrowings, setSelectedBorrowings] = useState<string[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [showBulkActionsDropdown, setShowBulkActionsDropdown] = useState(false);

  const tabs = [
    { id: 'check-out', label: 'Peminjaman', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'active-borrowings', label: 'Peminjaman Aktif', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'check-in', label: 'Pengembalian', icon: <Archive className="w-4 h-4" /> },
    { id: 'renewals', label: 'Perpanjangan', icon: <RefreshCw className="w-4 h-4" /> },
    { id: 'reservations', label: 'Reservasi', icon: <Bookmark className="w-4 h-4" /> },
    { id: 'overdue-management', label: 'Manajemen Keterlambatan', icon: <Clock className="w-4 h-4" /> },
    { id: 'fines-fees', label: 'Denda & Biaya', icon: <DollarSign className="w-4 h-4" /> }
  ];

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (openDropdownId) {
        setOpenDropdownId(null);
      }
      if (showBulkActionsDropdown) {
        setShowBulkActionsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownId, showBulkActionsDropdown]);

  const loadData = async () => {
    console.log('=== LOAD DATA DEBUG ===');
    setLoading(true);
    setError(null);
    try {
      console.log('Starting to load data...');
      
      const [membersData, booksData, borrowRecordsData, activeBorrowingsData] = await Promise.all([
        databaseService.getUsers(),
        databaseService.getBooks(),
        databaseService.getBorrowRecords(),
        databaseService.getActiveBorrowings()
      ]);
      
      console.log('Loaded members:', membersData);
      console.log('Loaded books:', booksData);
      console.log('Loaded borrow records:', borrowRecordsData);
      console.log('Loaded active borrowings:', activeBorrowingsData);
      
      // Debug: Check if books have barcode field
      if (booksData && booksData.length > 0) {
        console.log('First book structure:', booksData[0]);
        console.log('Books with barcode:', booksData.filter(b => b.barcode).map(b => ({ title: b.title, barcode: b.barcode })));
        console.log('Books without barcode:', booksData.filter(b => !b.barcode).map(b => ({ title: b.title, barcode: b.barcode })));
      }
      
      // Debug: Check active borrowings structure
      if (activeBorrowingsData && activeBorrowingsData.length > 0) {
        console.log('First active borrowing structure:', activeBorrowingsData[0]);
        console.log('Active borrowings with user data:', activeBorrowingsData.filter(ab => ab.user).length);
        console.log('Active borrowings with book data:', activeBorrowingsData.filter(ab => ab.book).length);
      }
      
      setMembers(membersData);
      setBooks(booksData);
      setBorrowRecords(borrowRecordsData);
      setActiveBorrowings(activeBorrowingsData);
      
      console.log('Data loaded successfully');
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  // Search member by barcode or email
  const searchMember = async (query: string) => {
    if (!query.trim()) {
      setSelectedMember(null);
      setSearchResults([]);
      setShowMemberResults(false);
      return;
    }

    const results = members.filter(m => 
      m.name?.toLowerCase().includes(query.toLowerCase()) ||
      m.email?.toLowerCase().includes(query.toLowerCase()) ||
      (m.student_id && m.student_id.toLowerCase().includes(query.toLowerCase())) ||
      (m.teacher_id && m.teacher_id.toLowerCase().includes(query.toLowerCase())) ||
      (m.employee_id && m.employee_id.toLowerCase().includes(query.toLowerCase()))
    );

    setSearchResults(results);
    setShowMemberResults(results.length > 0);
    
    // If only one result, auto-select it
    if (results.length === 1) {
      setSelectedMember(results[0]);
      setShowMemberResults(false);
      console.log('Auto-selected member:', results[0]);
    } else if (results.length > 1) {
      // If multiple results, try to find exact match
      const exactMatch = results.find(m => 
        m.name?.toLowerCase() === query.toLowerCase() ||
        m.email?.toLowerCase() === query.toLowerCase()
      );
      if (exactMatch) {
        setSelectedMember(exactMatch);
        setShowMemberResults(false);
        console.log('Exact match found and selected:', exactMatch);
      } else {
        setSelectedMember(null);
        console.log('Multiple results found, no exact match');
      }
    } else {
      setSelectedMember(null);
      console.log('No members found');
    }
    
    // Debug log untuk membantu troubleshooting
    console.log('Searching for member:', query);
    console.log('Found members:', results);
    console.log('Selected member:', results.length === 1 ? results[0] : null);
  };

  // Select member from search results
  const selectMember = (member: UserType) => {
    setSelectedMember(member);
    setTransactionData(prev => ({...prev, memberBarcode: member.name}));
    setShowMemberResults(false);
    setSearchResults([]);
  };

  // Close search results when clicking outside
  const handleClickOutsideSearch = () => {
    if (showMemberResults) {
      setShowMemberResults(false);
      setSearchResults([]);
    }
  };

  // Search book by barcode or title
  const searchBook = async (query: string) => {
    if (!query.trim()) {
      setSelectedBook(null);
      return;
    }

      console.log('=== BOOK SEARCH DEBUG ===');
      console.log('Searching for book:', query);
      console.log('Query length:', query.length);
      console.log('Available books count:', books.length);
      console.log('Available books:', books.map(b => ({ 
        id: b.id,
        title: b.title, 
        barcode: b.barcode, 
        barcodeLength: b.barcode ? b.barcode.length : 0,
        isbn: b.isbn,
        author: b.author 
      })));

    const book = books.find(b => {
      // Normalize query - remove "LIB" prefix if present
      const normalizedQuery = query.toLowerCase().replace(/^lib/, '');
      
      // Check barcode match (with and without LIB prefix)
      const barcodeMatch = b.barcode && (
        b.barcode.toLowerCase().includes(query.toLowerCase()) ||
        b.barcode.toLowerCase().includes(normalizedQuery) ||
        b.barcode.includes(query) ||
        b.barcode.includes(normalizedQuery)
      );
      
      // Check title match
      const titleMatch = b.title && b.title.toLowerCase().includes(query.toLowerCase());
      
      // Check ISBN match
      const isbnMatch = b.isbn && b.isbn.toLowerCase().includes(query.toLowerCase());
      
      console.log(`Book ${b.title}: barcode="${b.barcode}", query="${query}", normalized="${normalizedQuery}", barcodeMatch=${barcodeMatch}, titleMatch=${titleMatch}, isbnMatch=${isbnMatch}`);
      
      return barcodeMatch || titleMatch || isbnMatch;
    });

    setSelectedBook(book || null);
    
    // Debug log untuk membantu troubleshooting
    console.log('Found book:', book);
    console.log('Selected book set to:', book ? book.title : 'null');
  };

  // Reset form
  const resetForm = () => {
    setTransactionData({
      memberBarcode: '',
      bookBarcode: '',
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      notes: '',
      fineAmount: '',
      paymentMethod: 'cash'
    });
    setSelectedMember(null);
    setSelectedBook(null);
    setSearchResults([]);
    setShowMemberResults(false);
    setError(null);
    setSuccess(null);
  };

  // Handle borrow book
  // Handle book return process
  const handleReturnBook = async (activeBorrowingId: string) => {
    console.log('=== HANDLE RETURN BOOK DEBUG ===');
    console.log('Active borrowing ID:', activeBorrowingId);
    console.log('Available active borrowings:', activeBorrowings);
    
    setLoading(true);
    setError(null);
    try {
      // Get the active borrowing record
      const activeBorrowing = activeBorrowings.find(ab => ab.id === activeBorrowingId);
      console.log('Found active borrowing:', activeBorrowing);
      
      if (!activeBorrowing) {
        setError('Data peminjaman tidak ditemukan');
        return;
      }

      const returnDate = new Date().toISOString().split('T')[0];
      console.log('Return date:', returnDate);
      
      // Update borrow_records - set return_date and status to 'returned'
      console.log('Updating borrow record...');
      await databaseService.updateBorrowRecord(activeBorrowingId, {
        return_date: returnDate,
        status: 'returned'
      });
      console.log('Borrow record updated successfully');
      
      // Remove from active_borrowings
      console.log('Deleting from active borrowings...');
      await databaseService.deleteActiveBorrowing(activeBorrowingId);
      console.log('Deleted from active borrowings successfully');
      
      // Update book status to available
      console.log('Updating book status...');
      await databaseService.updateBookStatus(activeBorrowing.book_id, 'available');
      console.log('Book status updated successfully');
      
      setSuccess('Buku berhasil dikembalikan');
      await loadData(); // Refresh data
    } catch (err) {
      console.error('Error in handleReturnBook:', err);
      setError(err instanceof Error ? err.message : 'Gagal memproses pengembalian');
    } finally {
      setLoading(false);
    }
  };

  // Handle return book from form
  const handleReturnBookFromForm = async () => {
    if (!selectedReturnMember || !selectedReturnBook) {
      setError('Pilih anggota dan buku terlebih dahulu');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Find the active borrowing record
      const activeBorrowing = activeBorrowings.find(ab => 
        ab.user_id === selectedReturnMember.id && ab.book_id === selectedReturnBook.id
      );
      
      if (!activeBorrowing) {
        setError('Tidak ada peminjaman aktif untuk buku ini');
        return;
      }

      // Update borrow_records
      await databaseService.updateBorrowRecord(activeBorrowing.id, {
        return_date: returnData.returnDate,
        status: 'returned',
        notes: returnData.returnNotes
      });
      
      // Remove from active_borrowings
      await databaseService.deleteActiveBorrowing(activeBorrowing.id);
      
      // Update book status
      await databaseService.updateBookStatus(selectedReturnBook.id, 'available');
      
      setSuccess('Buku berhasil dikembalikan');
      
      // Reset form
      setReturnData({
        memberBarcode: '',
        bookBarcode: '',
        returnDate: new Date().toISOString().split('T')[0],
        bookCondition: 'Baik - Tidak Ada Kerusakan',
        lateStatus: 'Tepat Waktu',
        fineAmount: 0,
        returnNotes: ''
      });
      setSelectedReturnMember(null);
      setSelectedReturnBook(null);
      
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memproses pengembalian');
    } finally {
      setLoading(false);
    }
  };

  // Search member for return form
  const searchReturnMember = async (query: string) => {
    if (!query.trim()) {
      setSelectedReturnMember(null);
      setMemberActiveBorrowings([]);
      setSelectedReturnBook(null);
      return;
    }

    const results = members.filter(member => 
      member.name?.toLowerCase().includes(query.toLowerCase()) ||
      member.email?.toLowerCase().includes(query.toLowerCase()) ||
      member.student_id?.toLowerCase().includes(query.toLowerCase()) ||
      member.teacher_id?.toLowerCase().includes(query.toLowerCase())
    );

    setReturnSearchResults(results);
    setShowReturnMemberResults(results.length > 0);
    
    // If only one result, auto-select it
    if (results.length === 1) {
      await selectReturnMember(results[0]);
    } else {
      setSelectedReturnMember(null);
      setMemberActiveBorrowings([]);
      setSelectedReturnBook(null);
    }
  };

  // Select member for return form
  const selectReturnMember = async (member: UserType) => {
    setSelectedReturnMember(member);
    setReturnData(prev => ({...prev, memberBarcode: member.name}));
    setShowReturnMemberResults(false);
    setReturnSearchResults([]);
    
    // Load member's active borrowings
    try {
      const borrowings = await databaseService.getActiveBorrowingsByUser(member.id);
      setMemberActiveBorrowings(borrowings);
    } catch (error) {
      console.error('Error loading member borrowings:', error);
      setMemberActiveBorrowings([]);
    }
  };

  // Search book for return form
  const searchReturnBook = async (query: string) => {
    if (!query.trim()) {
      setSelectedReturnBook(null);
      return;
    }

    // Find book in member's active borrowings
    const borrowing = memberActiveBorrowings.find(ab => {
      const book = ab.book;
      if (!book) return false;
      
      return book.barcode?.toLowerCase().includes(query.toLowerCase()) ||
             book.title?.toLowerCase().includes(query.toLowerCase()) ||
             book.isbn?.toLowerCase().includes(query.toLowerCase());
    });

    if (borrowing && borrowing.book) {
      setSelectedReturnBook(borrowing.book);
      setReturnData(prev => ({...prev, bookBarcode: borrowing.book?.barcode || ''}));
    } else {
      setSelectedReturnBook(null);
    }
  };

  // Handle extend borrowing
  const handleExtendBorrowing = async (activeBorrowingId: string) => {
    console.log('=== HANDLE EXTEND BORROWING DEBUG ===');
    console.log('Active borrowing ID:', activeBorrowingId);
    console.log('Available active borrowings:', activeBorrowings);
    
    setLoading(true);
    setError(null);
    try {
      const activeBorrowing = activeBorrowings.find(ab => ab.id === activeBorrowingId);
      console.log('Found active borrowing:', activeBorrowing);
      
      if (!activeBorrowing) {
        setError('Data peminjaman tidak ditemukan');
        return;
      }

      // Calculate new due date (extend by 7 days)
      const currentDueDate = new Date(activeBorrowing.due_date);
      const newDueDate = new Date(currentDueDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      console.log('Current due date:', currentDueDate);
      console.log('New due date:', newDueDate);
      
      // Update active_borrowings
      console.log('Updating active borrowing...');
      await databaseService.updateActiveBorrowing(activeBorrowingId, {
        due_date: newDueDate.toISOString().split('T')[0],
        renewal_count: activeBorrowing.renewal_count + 1
      });
      console.log('Active borrowing updated successfully');
      
      // Update borrow_records
      console.log('Updating borrow record...');
      await databaseService.updateBorrowRecord(activeBorrowingId, {
        due_date: newDueDate.toISOString().split('T')[0]
      });
      console.log('Borrow record updated successfully');
      
      setSuccess('Peminjaman berhasil diperpanjang');
      await loadData();
    } catch (err) {
      console.error('Error in handleExtendBorrowing:', err);
      setError(err instanceof Error ? err.message : 'Gagal memperpanjang peminjaman');
    } finally {
      setLoading(false);
    }
  };

  // Handle add borrowing from active borrowings
  const handleAddBorrowing = () => {
    // Switch to check-out tab
    setActiveTab('check-out');
  };

  // Handle bulk return
  const handleBulkReturn = async () => {
    if (selectedBorrowings.length === 0) {
      setError('Pilih peminjaman yang akan dikembalikan');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      for (const borrowingId of selectedBorrowings) {
        await handleReturnBook(borrowingId);
      }
      setSelectedBorrowings([]);
      setSuccess(`${selectedBorrowings.length} buku berhasil dikembalikan`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memproses pengembalian bulk');
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk extend
  const handleBulkExtend = async () => {
    if (selectedBorrowings.length === 0) {
      setError('Pilih peminjaman yang akan diperpanjang');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      for (const borrowingId of selectedBorrowings) {
        await handleExtendBorrowing(borrowingId);
      }
      setSelectedBorrowings([]);
      setSuccess(`${selectedBorrowings.length} peminjaman berhasil diperpanjang`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memproses perpanjangan bulk');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrowBook = async () => {
    if (!selectedMember || !selectedBook) {
      setError('Pilih anggota dan buku terlebih dahulu');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const dueDate = transactionData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      // Create active borrowing record
      const activeBorrowingData = {
        user_id: selectedMember.id,
        book_id: selectedBook.id,
        borrow_date: transactionData.borrowDate,
        due_date: dueDate,
        renewal_count: 0,
        fine_amount: 0,
        status: 'active' as const,
        notes: transactionData.notes
      };

      // Create in active_borrowings table
      await databaseService.createActiveBorrowing(activeBorrowingData);
      
      // Also create in borrow_records for historical tracking
      const borrowRecord = {
        user_id: selectedMember.id,
        book_id: selectedBook.id,
        borrow_date: transactionData.borrowDate,
        due_date: dueDate,
        status: 'active' as const,
        notes: transactionData.notes
      };
      await databaseService.createBorrowRecord(borrowRecord);
      
      // Update book status
      await databaseService.updateBookStatus(selectedBook.id, 'borrowed');
      
      setSuccess('Buku berhasil dipinjamkan');
      setTransactionData({
        memberBarcode: '',
        bookBarcode: '',
        borrowDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        notes: '',
        fineAmount: '',
        paymentMethod: 'cash'
      });
      setSelectedMember(null);
      setSelectedBook(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal meminjamkan buku');
    } finally {
      setLoading(false);
    }
  };

  const renderCheckOut = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
          Form Peminjaman Buku
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Member Information Section */}
          <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="text-md font-semibold text-blue-900 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Informasi Anggota
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cari Anggota</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={transactionData.memberBarcode}
                    onChange={(e) => {
                      setTransactionData(prev => ({...prev, memberBarcode: e.target.value}));
                      searchMember(e.target.value);
                    }}
                    onBlur={() => {
                      // Delay closing to allow clicking on results
                      setTimeout(() => {
                        setShowMemberResults(false);
                        setSearchResults([]);
                      }, 200);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Nama, NIS, atau email anggota"
                  />
                  <button 
                    type="button"
                    onClick={() => searchMember(transactionData.memberBarcode)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Search Results Dropdown */}
                {showMemberResults && searchResults.length > 0 && (
                  <div className="mt-2 border border-gray-300 rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((member) => (
                      <div
                        key={member.id}
                        onClick={() => selectMember(member)}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-600">{member.email}</p>
                            <p className="text-xs text-gray-500">
                              {member.role === 'student' && member.student_id && `NIS: ${member.student_id}`}
                              {member.role === 'teacher' && member.teacher_id && `NIP: ${member.teacher_id}`}
                              {member.role === 'librarian' && member.employee_id && `ID: ${member.employee_id}`}
                            </p>
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {member.role}
                          </div>
                        </div>
                      </div>
                    ))}
                    {searchResults.length > 1 && (
                      <div className="p-2 bg-yellow-50 border-t border-yellow-200">
                        <p className="text-xs text-yellow-800 text-center">
                          Pilih anggota yang sesuai dari daftar di atas
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {selectedMember && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Anggota dipilih:</strong> {selectedMember.name} ({selectedMember.email})
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Keanggotaan</label>
                <input
                  type="text"
                  value={selectedMember ? selectedMember.role : ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Status akan muncul setelah pencarian"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={selectedMember ? selectedMember.name : ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Nama anggota akan muncul di sini"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kelas/Jabatan</label>
                <input
                  type="text"
                  value={selectedMember ? (selectedMember.class || selectedMember.position || '') : ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Kelas atau jabatan anggota"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Buku Sedang Dipinjam</label>
                <input
                  type="number"
                  value={selectedMember ? borrowRecords.filter(r => r.user_id === selectedMember.id && r.status === 'active').length : 0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="0"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Batas Peminjaman</label>
                <input
                  type="number"
                  value={selectedMember ? (selectedMember.role === 'student' ? 5 : selectedMember.role === 'teacher' ? 10 : 15) : 5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="5"
                  readOnly
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Barcode Anggota *</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={transactionData.memberBarcode}
                onChange={(e) => setTransactionData(prev => ({...prev, memberBarcode: e.target.value}))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Scan atau ketik barcode anggota"
                required
              />
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Scan className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Barcode Buku *</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={transactionData.bookBarcode}
                onChange={(e) => {
                  setTransactionData(prev => ({...prev, bookBarcode: e.target.value}));
                  searchBook(e.target.value);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Scan atau ketik barcode buku"
                required
              />
              <button 
                type="button"
                onClick={() => searchBook(transactionData.bookBarcode)}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Scan className="w-4 h-4" />
              </button>
              <button 
                type="button"
                onClick={() => {
                  console.log('Available books with barcodes:');
                  books.forEach(b => console.log(`- ${b.title}: ${b.barcode || 'No barcode'}`));
                  alert(`Buku tersedia:\n${books.map(b => `• ${b.title}: ${b.barcode || 'Tidak ada barcode'}`).join('\n')}`);
                }}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                title="Lihat daftar buku tersedia"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
            {selectedBook && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Buku ditemukan:</strong> {selectedBook.title} - {selectedBook.author}
                </p>
                <p className="text-xs text-green-600">Status: {selectedBook.status}</p>
                <p className="text-xs text-green-600">Barcode: {selectedBook.barcode || 'Tidak ada'}</p>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Peminjaman *</label>
            <input
              type="date"
              value={transactionData.borrowDate}
              onChange={(e) => setTransactionData(prev => ({...prev, borrowDate: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Jatuh Tempo *</label>
            <input
              type="date"
              value={transactionData.dueDate}
              onChange={(e) => setTransactionData(prev => ({...prev, dueDate: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Peminjaman</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Peminjaman Reguler (7 hari)</option>
              <option>Peminjaman Panjang (14 hari)</option>
              <option>Peminjaman Referensi (3 hari)</option>
              <option>Peminjaman Guru (30 hari)</option>
              <option>Peminjaman Khusus</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Petugas</label>
            <input
              type="text"
              defaultValue={user?.name || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
              readOnly
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Peminjaman</label>
            <textarea
              value={transactionData.notes}
              onChange={(e) => setTransactionData(prev => ({...prev, notes: e.target.value}))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Catatan khusus untuk peminjaman ini"
            />
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button 
            onClick={() => {
              console.log('Button clicked!');
              console.log('loading:', loading);
              console.log('selectedMember:', selectedMember);
              console.log('selectedBook:', selectedBook);
              console.log('Button disabled:', loading || !selectedMember || !selectedBook);
              handleBorrowBook();
            }}
            disabled={loading || !selectedMember || !selectedBook}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 inline animate-spin" /> : <BookOpen className="w-4 h-4 mr-2 inline" />}
            Proses Peminjaman
          </button>
          
          {/* Debug info */}
          <div className="text-xs text-gray-500 mt-2">
            <p>Debug: Member: {selectedMember ? '✓' : '✗'} | Book: {selectedBook ? '✓' : '✗'}</p>
          </div>
          <button 
            onClick={resetForm}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset Form
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="font-semibold text-blue-900 mb-2">Peminjaman Hari Ini</h5>
          <p className="text-2xl font-bold text-blue-600">127</p>
          <p className="text-sm text-blue-700">+15% dari kemarin</p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h5 className="font-semibold text-green-900 mb-2">Buku Tersedia</h5>
          <p className="text-2xl font-bold text-green-600">12,456</p>
          <p className="text-sm text-green-700">78% dari total koleksi</p>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h5 className="font-semibold text-orange-900 mb-2">Antrian Reservasi</h5>
          <p className="text-2xl font-bold text-orange-600">23</p>
          <p className="text-sm text-orange-700">Perlu diproses</p>
        </div>
      </div>
    </div>
  );

  const renderCheckIn = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Archive className="w-5 h-5 mr-2 text-green-600" />
          Form Pengembalian Buku
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Member Information Section */}
          <div className="md:col-span-2 bg-green-50 border border-green-200 rounded-lg p-4">
            <h5 className="text-md font-semibold text-green-900 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Informasi Anggota
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cari Anggota</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={returnData.memberBarcode}
                    onChange={(e) => {
                      setReturnData(prev => ({...prev, memberBarcode: e.target.value}));
                      searchReturnMember(e.target.value);
                    }}
                    onBlur={() => {
                      setTimeout(() => {
                        setShowReturnMemberResults(false);
                        setReturnSearchResults([]);
                      }, 200);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Nama, NIS, atau email anggota"
                  />
                  <button 
                    type="button" 
                    onClick={() => searchReturnMember(returnData.memberBarcode)}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Search Results Dropdown */}
                {showReturnMemberResults && returnSearchResults.length > 0 && (
                  <div className="mt-2 border border-gray-300 rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto">
                    {returnSearchResults.map((member) => (
                      <div
                        key={member.id}
                        onClick={() => selectReturnMember(member)}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                            <div className="text-xs text-gray-500">{member.email}</div>
                            {member.student_id && (
                              <div className="text-xs text-gray-500">NIS: {member.student_id}</div>
                            )}
                            {member.teacher_id && (
                              <div className="text-xs text-gray-500">NIP: {member.teacher_id}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Keanggotaan</label>
                <input
                  type="text"
                  value={selectedReturnMember?.role || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Status akan muncul setelah pencarian"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={selectedReturnMember?.name || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Nama anggota akan muncul di sini"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kelas/Jabatan</label>
                <input
                  type="text"
                  value={selectedReturnMember?.position || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Kelas atau jabatan anggota"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Denda Belum Dibayar</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="Rp 0"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Buku yang Dipinjam</label>
                <input
                  type="number"
                  value={memberActiveBorrowings.length}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="0"
                  readOnly
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Barcode Buku *</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={returnData.bookBarcode}
                onChange={(e) => {
                  setReturnData(prev => ({...prev, bookBarcode: e.target.value}));
                  searchReturnBook(e.target.value);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Scan atau ketik barcode buku"
                required
              />
              <button 
                type="button"
                onClick={() => searchReturnBook(returnData.bookBarcode)}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Scan className="w-4 h-4" />
              </button>
            </div>
            
            {/* Show member's active borrowings */}
            {selectedReturnMember && memberActiveBorrowings.length > 0 && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buku yang Sedang Dipinjam ({memberActiveBorrowings.length})
                </label>
                <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg">
                  {memberActiveBorrowings.map((borrowing) => (
                    <div
                      key={borrowing.id}
                      onClick={() => {
                        if (borrowing.book) {
                          setSelectedReturnBook(borrowing.book);
                          setReturnData(prev => ({...prev, bookBarcode: borrowing.book?.barcode || ''}));
                        }
                      }}
                      className={`p-2 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${
                        selectedReturnBook?.id === borrowing.book?.id ? 'bg-green-50 border-green-200' : ''
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-900">
                        {borrowing.book?.title || 'Unknown Book'}
                      </div>
                      <div className="text-xs text-gray-500">
                        Barcode: {borrowing.book?.barcode} | 
                        Jatuh Tempo: {new Date(borrowing.due_date).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Pengembalian *</label>
            <input
              type="date"
              value={returnData.returnDate}
              onChange={(e) => setReturnData(prev => ({...prev, returnDate: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kondisi Buku Saat Kembali</label>
            <select 
              value={returnData.bookCondition}
              onChange={(e) => setReturnData(prev => ({...prev, bookCondition: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option>Baik - Tidak Ada Kerusakan</option>
              <option>Baik - Kerusakan Ringan</option>
              <option>Cukup - Kerusakan Sedang</option>
              <option>Buruk - Kerusakan Berat</option>
              <option>Hilang - Tidak Dikembalikan</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Keterlambatan</label>
            <select 
              value={returnData.lateStatus}
              onChange={(e) => setReturnData(prev => ({...prev, lateStatus: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option>Tepat Waktu</option>
              <option>Terlambat 1-3 Hari</option>
              <option>Terlambat 4-7 Hari</option>
              <option>Terlambat 8-14 Hari</option>
              <option>Terlambat &gt; 14 Hari</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Denda (Rp)</label>
            <input
              type="number"
              value={returnData.fineAmount}
              onChange={(e) => setReturnData(prev => ({...prev, fineAmount: parseInt(e.target.value) || 0}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Petugas Penerima</label>
            <input
              type="text"
              defaultValue={user?.name || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
              readOnly
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Pengembalian</label>
            <textarea
              rows={3}
              value={returnData.returnNotes}
              onChange={(e) => setReturnData(prev => ({...prev, returnNotes: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Catatan kondisi buku atau kejadian khusus"
            />
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button 
            onClick={handleReturnBookFromForm}
            disabled={loading || !selectedReturnMember || !selectedReturnBook}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Archive className="w-4 h-4 mr-2 inline" />
            {loading ? 'Memproses...' : 'Proses Pengembalian'}
          </button>
          <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            <Calculator className="w-4 h-4 mr-2 inline" />
            Hitung Denda
          </button>
        </div>
      </div>
    </div>
  );

  const renderRenewals = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <RefreshCw className="w-5 h-5 mr-2 text-blue-600" />
          Form Perpanjangan Peminjaman
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Barcode Anggota *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Scan barcode anggota"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Barcode Buku *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Scan barcode buku"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jatuh Tempo Saat Ini</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jatuh Tempo Baru *</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Perpanjangan</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Perpanjangan ke-1</option>
              <option>Perpanjangan ke-2</option>
              <option>Perpanjangan ke-3</option>
              <option>Perpanjangan Khusus</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alasan Perpanjangan</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Masih Membutuhkan</option>
              <option>Penelitian Berlanjut</option>
              <option>Tugas Sekolah</option>
              <option>Referensi Jangka Panjang</option>
              <option>Lainnya</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Biaya Perpanjangan (Rp)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Metode Pembayaran</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Tunai</option>
              <option>Transfer Bank</option>
              <option>E-Wallet</option>
              <option>Kartu Debit</option>
              <option>Gratis</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Perpanjangan</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Catatan khusus untuk perpanjangan ini"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <RefreshCw className="w-4 h-4 mr-2 inline" />
            Proses Perpanjangan
          </button>
        </div>
      </div>
    </div>
  );

  const renderReservations = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Bookmark className="w-5 h-5 mr-2 text-purple-600" />
          Form Reservasi Buku
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Barcode Anggota *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Scan barcode anggota"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Barcode Buku *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Scan barcode buku"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Reservasi *</label>
            <input
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Kebutuhan</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prioritas Reservasi</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Normal</option>
              <option>Tinggi - Tugas Sekolah</option>
              <option>Urgent - Ujian</option>
              <option>Khusus - Penelitian</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Metode Notifikasi</label>
            <div className="space-y-2">
              {['Email', 'SMS', 'WhatsApp', 'Telepon', 'Pengumuman'].map((method) => (
                <label key={method} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm">{method}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Durasi Hold (hari)</label>
            <input
              type="number"
              defaultValue="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="1"
              max="14"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi Pickup</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Meja Sirkulasi</option>
              <option>Ruang Referensi</option>
              <option>Loker Pickup</option>
              <option>Ruang Baca</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Alasan Reservasi</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Jelaskan mengapa buku ini perlu direservasi"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Bookmark className="w-4 h-4 mr-2 inline" />
            Buat Reservasi
          </button>
        </div>
      </div>
    </div>
  );

  const renderOverdueManagement = () => (
    <div className="space-y-6">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Manajemen Keterlambatan
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter Keterlambatan</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Semua Keterlambatan</option>
              <option>1-3 Hari Terlambat</option>
              <option>4-7 Hari Terlambat</option>
              <option>8-14 Hari Terlambat</option>
              <option>&gt; 14 Hari Terlambat</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Tindakan</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Kirim Reminder</option>
              <option>Telepon Anggota</option>
              <option>Surat Peringatan</option>
              <option>Suspend Keanggotaan</option>
              <option>Lapor ke Wali Kelas</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Template Pesan</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Reminder Sopan</option>
              <option>Peringatan Pertama</option>
              <option>Peringatan Kedua</option>
              <option>Peringatan Final</option>
              <option>Custom Message</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Metode Kontak</label>
            <div className="space-y-2">
              {['Email', 'SMS', 'WhatsApp', 'Telepon', 'Surat Fisik'].map((method) => (
                <label key={method} className="flex items-center space-x-2">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm">{method}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Tindakan</label>
            <input
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Pesan Custom</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Tulis pesan khusus untuk anggota yang terlambat"
            />
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
            <Bell className="w-4 h-4 mr-2 inline" />
            Kirim Reminder
          </button>
          <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            <AlertCircle className="w-4 h-4 mr-2 inline" />
            Suspend Anggota
          </button>
        </div>
      </div>
    </div>
  );

  const renderActiveBorrowings = () => {
    // Filter active borrowings based on search
    const filteredBorrowings = activeBorrowings.filter(borrowing => {
      if (!activeBorrowingsSearch.trim()) return true;
      
      const searchTerm = activeBorrowingsSearch.toLowerCase();
      const member = borrowing.user;
      const book = borrowing.book;
      
      return (
        member?.name?.toLowerCase().includes(searchTerm) ||
        member?.email?.toLowerCase().includes(searchTerm) ||
        member?.student_id?.toLowerCase().includes(searchTerm) ||
        member?.teacher_id?.toLowerCase().includes(searchTerm) ||
        book?.title?.toLowerCase().includes(searchTerm) ||
        book?.barcode?.toLowerCase().includes(searchTerm) ||
        book?.isbn?.toLowerCase().includes(searchTerm)
      );
    });

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Peminjaman Aktif</h1>
            <p className="text-gray-600">Kelola peminjaman buku yang sedang berlangsung</p>
          </div>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Search and Bulk Actions */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Box */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={activeBorrowingsSearch}
                  onChange={(e) => setActiveBorrowingsSearch(e.target.value)}
                  placeholder="Cari anggota, buku, atau barcode..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedBorrowings.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {selectedBorrowings.length} dipilih
                </span>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowBulkActionsDropdown(!showBulkActionsDropdown);
                    }}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  
                  {/* Bulk Actions Dropdown */}
                  {showBulkActionsDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBulkReturn();
                            setShowBulkActionsDropdown(false);
                          }}
                          disabled={selectedBorrowings.length === 0 || loading}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Archive className="w-4 h-4 mr-3 text-green-600" />
                          Kembalikan Terpilih ({selectedBorrowings.length})
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBulkExtend();
                            setShowBulkActionsDropdown(false);
                          }}
                          disabled={selectedBorrowings.length === 0 || loading}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <RefreshCw className="w-4 h-4 mr-3 text-blue-600" />
                          Perpanjang Terpilih ({selectedBorrowings.length})
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddBorrowing();
                            setShowBulkActionsDropdown(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <BookOpen className="w-4 h-4 mr-3 text-purple-600" />
                          Tambah Pinjaman Baru
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Aktif</p>
                <p className="text-2xl font-bold text-gray-900">{filteredBorrowings.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Terlambat</p>
                <p className="text-2xl font-bold text-red-600">
                  {filteredBorrowings.filter(r => r.status === 'overdue').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Peringatan</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredBorrowings.filter(r => {
                    const dueDate = new Date(r.due_date);
                    const today = new Date();
                    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    return r.status === 'active' && daysUntilDue <= 3 && daysUntilDue >= 0;
                  }).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Normal</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredBorrowings.filter(r => {
                    const dueDate = new Date(r.due_date);
                    const today = new Date();
                    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    return r.status === 'active' && daysUntilDue > 3;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Records Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedBorrowings.length === filteredBorrowings.length && filteredBorrowings.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBorrowings(filteredBorrowings.map(b => b.id));
                        } else {
                          setSelectedBorrowings([]);
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Peminjam
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Buku
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal Pinjam
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jatuh Tempo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBorrowings.map((record) => {
                const dueDate = new Date(record.due_date);
                const today = new Date();
                const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                
                let statusInfo;
                if (record.status === 'overdue' || daysUntilDue < 0) {
                  statusInfo = {
                    label: 'Terlambat',
                    color: 'text-red-600 bg-red-100',
                    days: Math.abs(daysUntilDue)
                  };
                } else if (daysUntilDue <= 3) {
                  statusInfo = {
                    label: 'Mendekati Jatuh Tempo',
                    color: 'text-yellow-600 bg-yellow-100',
                    days: daysUntilDue
                  };
                } else {
                  statusInfo = {
                    label: 'Aktif',
                    color: 'text-green-600 bg-green-100',
                    days: daysUntilDue
                  };
                }

                  return (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedBorrowings.includes(record.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBorrowings(prev => [...prev, record.id]);
                            } else {
                              setSelectedBorrowings(prev => prev.filter(id => id !== record.id));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {record.user?.name || 'Unknown User'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {record.user?.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {record.book?.title || 'Unknown Book'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {record.book?.author || 'Unknown Author'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.borrow_date).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.due_date).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                        {statusInfo.label}
                        {statusInfo.days !== undefined && (
                          <span className="ml-1">
                            ({statusInfo.days} hari)
                          </span>
                        )}
                      </span>
                    </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownId(openDropdownId === record.id ? null : record.id);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {/* Dropdown Menu */}
                          {openDropdownId === record.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                              <div className="py-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReturnBook(record.id);
                                    setOpenDropdownId(null);
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Archive className="w-4 h-4 mr-3 text-green-600" />
                                  Kembalikan
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleExtendBorrowing(record.id);
                                    setOpenDropdownId(null);
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <RefreshCw className="w-4 h-4 mr-3 text-blue-600" />
                                  Perpanjang
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddBorrowing();
                                    setOpenDropdownId(null);
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <BookOpen className="w-4 h-4 mr-3 text-purple-600" />
                                  Tambah Pinjaman
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredBorrowings.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Tidak ada peminjaman aktif</p>
            <p className="text-gray-400">Semua buku telah dikembalikan</p>
          </div>
        )}
        </div>
      </div>
    );
  };

  const renderFinesFees = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-green-600" />
          Manajemen Denda & Biaya
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Barcode Anggota *</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Scan barcode anggota"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Denda *</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Denda Keterlambatan</option>
              <option>Denda Kerusakan</option>
              <option>Denda Kehilangan</option>
              <option>Biaya Administrasi</option>
              <option>Biaya Penggantian</option>
              <option>Biaya Layanan</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Denda (Rp) *</label>
            <input
              type="number"
              value={transactionData.fineAmount}
              onChange={(e) => setTransactionData(prev => ({...prev, fineAmount: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="0"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Metode Pembayaran *</label>
            <select
              value={transactionData.paymentMethod}
              onChange={(e) => setTransactionData(prev => ({...prev, paymentMethod: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="cash">Tunai</option>
              <option value="bank_transfer">Transfer Bank</option>
              <option value="e_wallet">E-Wallet (OVO, GoPay, DANA)</option>
              <option value="debit_card">Kartu Debit</option>
              <option value="installment">Cicilan</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Pembayaran</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Belum Dibayar</option>
              <option>Dibayar Sebagian</option>
              <option>Lunas</option>
              <option>Dibebaskan</option>
              <option>Dalam Proses</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Jatuh Tempo</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Diskon/Keringanan (%)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="0"
              max="100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alasan Diskon</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Tidak Ada</option>
              <option>Siswa Berprestasi</option>
              <option>Kondisi Ekonomi</option>
              <option>Kesalahan Sistem</option>
              <option>Kebijakan Sekolah</option>
              <option>Lainnya</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Denda</label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Catatan detail tentang denda dan pembayaran"
            />
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <DollarSign className="w-4 h-4 mr-2 inline" />
            Proses Pembayaran
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FileText className="w-4 h-4 mr-2 inline" />
            Cetak Kwitansi
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Sirkulasi</h2>
            <p className="text-sm text-gray-600">Kelola peminjaman, pengembalian, dan layanan sirkulasi</p>
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
        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto">
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800">{success}</span>
            <button onClick={() => setSuccess(null)} className="ml-auto">
              <X className="w-4 h-4 text-green-600" />
            </button>
          </div>
        )}

        {activeTab === 'check-out' && renderCheckOut()}
        {activeTab === 'active-borrowings' && renderActiveBorrowings()}
        {activeTab === 'check-in' && renderCheckIn()}
        {activeTab === 'renewals' && renderRenewals()}
        {activeTab === 'reservations' && renderReservations()}
        {activeTab === 'overdue-management' && renderOverdueManagement()}
        {activeTab === 'fines-fees' && renderFinesFees()}
      </div>
    </div>
  );
}

export default CirculationForm;
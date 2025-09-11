import * as XLSX from 'xlsx';
import { ExcelBookData, ExcelMapping } from '../types/database';

// Excel Import/Export Utilities
export class ExcelUtils {
  // Parse Excel file to JSON data
  static parseExcelFile(file: File): Promise<ExcelBookData[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // Convert to ExcelBookData format
          const books: ExcelBookData[] = [];
          const headers = jsonData[0] as string[];
          
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            if (row.length === 0 || !row[0]) continue; // Skip empty rows
            
            const book: ExcelBookData = {
              title: row[0] || '',
              author: row[1] || '',
              isbn: row[2] || '',
              publisher: row[3] || '',
              publication_year: row[4] ? parseInt(row[4]) : undefined,
              category: row[5] || '',
              subcategory: row[6] || '',
              language: row[7] || 'Indonesia',
              pages: row[8] ? parseInt(row[8]) : undefined,
              description: row[9] || '',
              status: row[10] || 'available',
              location: row[11] || '',
              acquisition_date: row[12] || '',
              acquisition_method: row[13] || 'Pembelian',
              price: row[14] ? parseFloat(row[14]) : undefined,
              notes: row[15] || ''
            };
            
            books.push(book);
          }
          
          resolve(books);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsBinaryString(file);
    });
  }

  // Parse Excel file with custom mapping
  static parseExcelFileWithMapping(file: File, mapping: ExcelMapping): Promise<ExcelBookData[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // Convert column letters to numbers
          const getColumnIndex = (col: string): number => {
            let result = 0;
            for (let i = 0; i < col.length; i++) {
              result = result * 26 + (col.charCodeAt(i) - 64);
            }
            return result - 1;
          };
          
          const books: ExcelBookData[] = [];
          
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i] as any[];
            if (row.length === 0 || !row[0]) continue; // Skip empty rows
            
            const book: ExcelBookData = {
              title: mapping.title ? row[getColumnIndex(mapping.title)] || '' : '',
              author: mapping.author ? row[getColumnIndex(mapping.author)] || '' : '',
              isbn: mapping.isbn ? row[getColumnIndex(mapping.isbn)] || '' : '',
              publisher: mapping.publisher ? row[getColumnIndex(mapping.publisher)] || '' : '',
              publication_year: mapping.publication_year ? parseInt(row[getColumnIndex(mapping.publication_year)]) : undefined,
              category: mapping.category ? row[getColumnIndex(mapping.category)] || '' : '',
              subcategory: mapping.subcategory ? row[getColumnIndex(mapping.subcategory)] || '' : '',
              language: mapping.language ? row[getColumnIndex(mapping.language)] || 'Indonesia' : 'Indonesia',
              pages: mapping.pages ? parseInt(row[getColumnIndex(mapping.pages)]) : undefined,
              description: mapping.description ? row[getColumnIndex(mapping.description)] || '' : '',
              status: mapping.status ? row[getColumnIndex(mapping.status)] || 'available' : 'available',
              location: mapping.location ? row[getColumnIndex(mapping.location)] || '' : '',
              acquisition_date: mapping.acquisition_date ? row[getColumnIndex(mapping.acquisition_date)] || '' : '',
              acquisition_method: mapping.acquisition_method ? row[getColumnIndex(mapping.acquisition_method)] || 'Pembelian' : 'Pembelian',
              price: mapping.price ? parseFloat(row[getColumnIndex(mapping.price)]) : undefined,
              notes: mapping.notes ? row[getColumnIndex(mapping.notes)] || '' : ''
            };
            
            books.push(book);
          }
          
          resolve(books);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsBinaryString(file);
    });
  }

  // Export data to Excel file
  static exportToExcel(data: ExcelBookData[], filename: string = 'daftar_buku.xlsx') {
    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Prepare data for export
    const exportData = [
      ['Judul Buku', 'Penulis', 'ISBN', 'Penerbit', 'Tahun Terbit', 'Kategori', 'Sub Kategori', 'Bahasa', 'Jumlah Halaman', 'Deskripsi', 'Status', 'Lokasi', 'Tanggal Perolehan', 'Cara Perolehan', 'Harga', 'Catatan'],
      ...data.map(book => [
        book.title,
        book.author,
        book.isbn || '',
        book.publisher || '',
        book.publication_year || '',
        book.category || '',
        book.subcategory || '',
        book.language || '',
        book.pages || '',
        book.description || '',
        book.status || '',
        book.location || '',
        book.acquisition_date || '',
        book.acquisition_method || '',
        book.price || '',
        book.notes || ''
      ])
    ];
    
    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(exportData);
    
    // Set column widths
    const columnWidths = [
      { wch: 30 }, // Judul Buku
      { wch: 20 }, // Penulis
      { wch: 15 }, // ISBN
      { wch: 20 }, // Penerbit
      { wch: 12 }, // Tahun Terbit
      { wch: 15 }, // Kategori
      { wch: 15 }, // Sub Kategori
      { wch: 10 }, // Bahasa
      { wch: 15 }, // Jumlah Halaman
      { wch: 40 }, // Deskripsi
      { wch: 12 }, // Status
      { wch: 15 }, // Lokasi
      { wch: 15 }, // Tanggal Perolehan
      { wch: 15 }, // Cara Perolehan
      { wch: 12 }, // Harga
      { wch: 30 }  // Catatan
    ];
    worksheet['!cols'] = columnWidths;
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Daftar Buku');
    
    // Save file
    XLSX.writeFile(workbook, filename);
  }

  // Export to CSV
  static exportToCSV(data: ExcelBookData[], filename: string = 'daftar_buku.csv') {
    const headers = ['Judul Buku', 'Penulis', 'ISBN', 'Penerbit', 'Tahun Terbit', 'Kategori', 'Sub Kategori', 'Bahasa', 'Jumlah Halaman', 'Deskripsi', 'Status', 'Lokasi', 'Tanggal Perolehan', 'Cara Perolehan', 'Harga', 'Catatan'];
    
    const csvContent = [
      headers.join(','),
      ...data.map(book => [
        `"${book.title}"`,
        `"${book.author}"`,
        `"${book.isbn || ''}"`,
        `"${book.publisher || ''}"`,
        `"${book.publication_year || ''}"`,
        `"${book.category || ''}"`,
        `"${book.subcategory || ''}"`,
        `"${book.language || ''}"`,
        `"${book.pages || ''}"`,
        `"${book.description || ''}"`,
        `"${book.status || ''}"`,
        `"${book.location || ''}"`,
        `"${book.acquisition_date || ''}"`,
        `"${book.acquisition_method || ''}"`,
        `"${book.price || ''}"`,
        `"${book.notes || ''}"`
      ].join(','))
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Generate Excel template
  static generateTemplate(filename: string = 'template_daftar_buku.xlsx') {
    const templateData = [
      ['Judul Buku', 'Penulis', 'ISBN', 'Penerbit', 'Tahun Terbit', 'Kategori', 'Sub Kategori', 'Bahasa', 'Jumlah Halaman', 'Deskripsi', 'Status', 'Lokasi', 'Tanggal Perolehan', 'Cara Perolehan', 'Harga', 'Catatan'],
      ['Contoh: Pemrograman Web', 'Contoh: John Doe', 'Contoh: 9781234567890', 'Contoh: Penerbit ABC', '2023', 'Contoh: Teknologi', 'Contoh: Pemrograman', 'Indonesia', '300', 'Contoh deskripsi buku', 'available', 'Rak A-1', '2023-01-01', 'Pembelian', '150000', 'Contoh catatan']
    ];
    
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    
    // Set column widths
    const columnWidths = [
      { wch: 30 }, { wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 12 },
      { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 40 },
      { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 30 }
    ];
    worksheet['!cols'] = columnWidths;
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    XLSX.writeFile(workbook, filename);
  }
}


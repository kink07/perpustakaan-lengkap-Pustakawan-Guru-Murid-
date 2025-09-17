import React, { memo } from 'react';
import { 
  Share2, 
  Heart, 
  Bookmark, 
  MapPin, 
  Download 
} from 'lucide-react';
import { BookData } from '../types/book';
import { DDC_CATEGORIES } from '../constants/ddcCategories';

interface BookCardProps {
  book: BookData;
  favoriteStatus: { [bookId: string]: boolean };
  bookmarkStatus: { [bookId: string]: boolean };
  onShare: (book: BookData) => void;
  onLove: (book: BookData) => void;
  onBookmark: (book: BookData) => void;
}

const BookCard = memo(({ 
  book, 
  favoriteStatus, 
  bookmarkStatus, 
  onShare, 
  onLove, 
  onBookmark 
}: BookCardProps) => {
  return (
    <div className="bg-white border-2 border-blue-200 rounded-lg shadow-md hover:border-yellow-300 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Book Cover */}
      <div className="relative overflow-hidden">
        <img
          src={book.cover || 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300'}
          alt={book.title}
          className="w-full h-48 object-contain bg-gray-50 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300';
          }}
        />
        <div className="absolute top-3 right-3">
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            {DDC_CATEGORIES.find(cat => cat.value === book.category)?.label.split(' - ')[0] || book.category}
          </span>
        </div>
        
        {/* Action Icons */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => onShare(book)}
            className="p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
            title="Bagikan"
          >
            <Share2 className="w-4 h-4 text-gray-700 hover:text-blue-600" />
          </button>
          <button 
            onClick={() => onLove(book)}
            className={`p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-md hover:shadow-lg transition-all duration-200 ${
              favoriteStatus[book.id] ? 'ring-2 ring-red-500' : ''
            }`}
            title={favoriteStatus[book.id] ? "Hapus dari Favorit" : "Tambah ke Favorit"}
          >
            <Heart 
              className={`w-4 h-4 transition-colors duration-200 ${
                favoriteStatus[book.id] 
                  ? 'text-red-600 fill-red-600' 
                  : 'text-gray-700 hover:text-red-600'
              }`} 
            />
          </button>
          <button 
            onClick={() => onBookmark(book)}
            className={`p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-md hover:shadow-lg transition-all duration-200 ${
              bookmarkStatus[book.id] ? 'ring-2 ring-green-500' : ''
            }`}
            title={bookmarkStatus[book.id] ? "Hapus dari Bookmark" : "Simpan untuk Nanti"}
          >
            <Bookmark 
              className={`w-4 h-4 transition-colors duration-200 ${
                bookmarkStatus[book.id] 
                  ? 'text-green-600 fill-green-600' 
                  : 'text-gray-700 hover:text-green-600'
              }`} 
            />
          </button>
        </div>
      </div>

      {/* Book Info */}
      <div className="p-3">
        <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-gray-600 text-xs mb-2">{book.author}</p>

        {/* Book Details */}
        <div className="space-y-0.5 mb-2">
          <div className="flex items-center text-gray-500 text-xs">
            <span className="font-medium w-16">Terbit:</span>
            <span>{book.publisher}, {book.publicationYear}</span>
          </div>
          {book.subtitle && (
            <div className="flex items-center text-gray-500 text-xs">
              <span className="font-medium w-16">Sub Judul:</span>
              <span className="line-clamp-1">{book.subtitle}</span>
            </div>
          )}
          {book.coAuthor && (
            <div className="flex items-center text-gray-500 text-xs">
              <span className="font-medium w-16">Co-Author:</span>
              <span className="line-clamp-1">{book.coAuthor}</span>
            </div>
          )}
          {book.edition && (
            <div className="flex items-center text-gray-500 text-xs">
              <span className="font-medium w-16">Edisi:</span>
              <span>{book.edition}</span>
            </div>
          )}
          {book.isbn && (
            <div className="flex items-center text-gray-500 text-xs">
              <span className="font-medium w-16">ISBN:</span>
              <span className="font-mono text-blue-600">{book.isbn}</span>
            </div>
          )}
          {book.callNumber && (
            <div className="flex items-center text-gray-500 text-xs">
              <span className="font-medium w-16">No. Panggil:</span>
              <span className="font-mono text-blue-600">{book.callNumber}</span>
            </div>
          )}
          {book.deweyNumber && (
            <div className="flex items-center text-gray-500 text-xs">
              <span className="font-medium w-16">Dewey:</span>
              <span className="font-mono text-green-600">{book.deweyNumber}</span>
            </div>
          )}
          {book.pages && (
            <div className="flex items-center text-gray-500 text-xs">
              <span className="font-medium w-16">Halaman:</span>
              <span>{book.pages}</span>
            </div>
          )}
          {book.language && book.language !== 'Indonesia' && (
            <div className="flex items-center text-gray-500 text-xs">
              <span className="font-medium w-16">Bahasa:</span>
              <span>{book.language}</span>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-500 text-xs mb-2">
          <MapPin className="w-3 h-3 mr-1" />
          <span>{book.location}</span>
        </div>

        {/* Subjects */}
        {book.subjects && book.subjects.length > 0 && (
          <div className="mb-2">
            <div className="flex flex-wrap gap-1">
              {book.subjects.slice(0, 3).map((subject, index) => (
                <span
                  key={index}
                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  {subject}
                </span>
              ))}
              {book.subjects.length > 3 && (
                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                  +{book.subjects.length - 3} lagi
                </span>
              )}
            </div>
          </div>
        )}

        {/* Abstract */}
        {book.abstract && (
          <div className="mb-2">
            <p className="text-xs text-gray-600 line-clamp-2">
              <span className="font-medium">Abstrak:</span> {book.abstract}
            </p>
          </div>
        )}

        {/* Digital Files */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-700">File Digital:</p>
          <div className="flex flex-wrap gap-1">
            {(book.digitalFiles || []).length > 0 ? (
              (book.digitalFiles || []).map((fileUrl, index) => {
                // Extract file extension from URL
                const fileExtension = fileUrl.split('.').pop()?.toLowerCase() || '';
                const fileName = fileUrl.split('/').pop() || `File ${index + 1}`;
                
                return (
                  <a
                    key={index}
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span className="truncate max-w-20">{fileName}</span>
                  </a>
                );
              })
            ) : (
              <span className="text-gray-500 text-xs">Tidak ada file digital</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

BookCard.displayName = 'BookCard';

export default BookCard;






import { FaBook, FaBookOpen } from 'react-icons/fa';
import SectionTitle from '../SectionTitle';

export default function ReadingListTab({ readingList }) {
  return (
    <div>
      <SectionTitle icon={<FaBookOpen />} title="Reading List" />
      {readingList.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FaBook className="mx-auto text-4xl mb-3 opacity-30" />
          <p className="text-sm">Your reading list is empty.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {readingList.map(book => (
            <div key={book.id} className="flex items-center gap-4 bg-gray-50 rounded-xl
              p-4 hover:bg-gray-100/70 transition-colors">
              <div className="w-10 h-14 bg-blue-100 rounded-lg flex items-center
                justify-center shrink-0">
                <FaBook className="text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-sm truncate">{book.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{book.author}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${book.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-blue-600 w-8 text-right">
                    {book.progress}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

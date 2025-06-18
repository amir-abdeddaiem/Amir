import { notFound } from 'next/navigation';


export default function Page({ data }) {
  if (!data) {
    notFound(); // ← This will show your `app/not-found.js`
  }


  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
        {/* Same cat animation code from previous example */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">404 - Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-1">Oh no! The page you're looking for has gone missing.</p>
        <a href="/" className="inline-block px-6 py-3 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition-all hover:-translate-y-1 hover:shadow-lg">
          Take me home to cheer up the cat
        </a>
      </div>
    </div>
  );
}
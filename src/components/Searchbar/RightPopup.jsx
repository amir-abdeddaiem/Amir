// Right Popup Component (JSX)
const RightPopup = ({ onClose }) => {
  return (
    <div
      className="fixed top-20 right-5 w-64 bg-white shadow-lg p-4 rounded-lg border border-gray-300 z-50"
      style={{ zIndex: 9999 }} // Ensure popups are above other content
    >
      <h2 className="text-lg font-bold">Right Popup</h2>
      <p>Search options and settings.</p>
      <button
        onClick={onClose}
        className="mt-2 text-sm text-red-500 cursor-pointer"
      >
        Close
      </button>
    </div>
  );
};

export default RightPopup;

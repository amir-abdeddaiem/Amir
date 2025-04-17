// Left Popup Component (JSX)
const LeftPopup = ({ onClose }) => {
  return (
    <div
      className="fixed top-20 left-5 w-64 bg-white shadow-lg p-4 rounded-lg border border-gray-300 z-50"
      style={{ zIndex: 9999 }} // Ensure popups are above other content
    >
      <h2 className="text-lg font-bold">Left Popup</h2>
      <p>Additional filters or options.</p>
      <button
        onClick={onClose}
        className="mt-2 text-sm text-red-500 cursor-pointer"
      >
        Close
      </button>
    </div>
  );
};

export default LeftPopup;

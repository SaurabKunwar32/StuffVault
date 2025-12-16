import { useEffect, useRef } from "react";


export default function DirectoryModel({
    newDirname,
    setNewDirname,
    onClose,
    onCreateDirectory, }) {

    const inputRef = useRef(null);

    useEffect(() => {
        // Focus and select text only once on mount
        if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }

        // Listen for "Escape" key to close the modal
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        // Cleanup keydown event listener on unmount
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [])

    // Stop propagation when clicking inside the content
    const handleContentClick = (e) => {
        e.stopPropagation();
    }

    // Close when clicking outside the modal content
    const handleOverlayClick = () => {
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleOverlayClick}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative"
                onClick={handleContentClick}>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Create a new directory
                </h2>

                <form className="space-y-5" onSubmit={onCreateDirectory}>
                    <input
                        ref={inputRef}
                        value={newDirname}
                        onChange={(e) => setNewDirname(e.target.value)}
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                        placeholder="Enter folder name"
                    />

                    <div className="flex justify-end space-x-3">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                        >
                            Create
                        </button>
                        <button
                            onClick={onClose}
                            type="button"
                            className="bg-gray-200 text-gray-700 px-5 py-2 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen  p-6">
            <h1 className="text-5xl font-extrabold mb-4 animate-pulse text-black">
                MergeFlow
            </h1>
            <p className="text-xl text-black mb-8">
                Loading... Please wait.
            </p>
            <svg
                className="animate-spin h-16 w-16 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
            </svg>
        </div>
    );
}
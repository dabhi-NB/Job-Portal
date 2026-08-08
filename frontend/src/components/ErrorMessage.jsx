const ErrorMessage = ({ message }) => {
    if (!message) return null;
    return (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 px-3.5 py-2.5 rounded-lg text-sm font-medium mt-3">
            ⚠️ {message}
        </div>
    );
};

export default ErrorMessage;

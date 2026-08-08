const Loader = ({ message }) => {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-slate-500 dark:text-slate-400">
            <div className="w-9 h-9 border-3 border-slate-300 dark:border-slate-700 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
            <span className="text-sm font-medium">{message || 'Loading...'}</span>
        </div>
    );
};

export default Loader;

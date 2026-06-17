function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default LoadingSpinner;
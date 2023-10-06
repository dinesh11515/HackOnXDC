const Loader = ({ inComp = false }) => {
  return (
    <div
      className={`flex justify-center items-center ${
        inComp ? 'max-h-screen' : 'h-screen'
      }`}>
      <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-gray-400' />
    </div>
  );
};

export default Loader;

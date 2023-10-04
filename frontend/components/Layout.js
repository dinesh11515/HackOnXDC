// import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className='flex'>
      <Sidebar />
      <div className='w-full'>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Layout;

import { IoBarChartSharp } from 'react-icons/io5';
import { MdQueryStats } from 'react-icons/md';
import { FaWpforms } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';

const links = [

    {
      id: 1,
      text: 'Find Treatment Centre',
      path: 'add-job',
      icon: <FaWpforms />,
    },

    {
      id: 2,
      text: 'Search/Filter Resources',
      path: 'getcentre',
      icon: <ImProfile />,
    },
    {
      id: 3,
      text: 'Upload Resources',
      path: 'upload',
      icon: <ImProfile />,
    },
  ];
  
  export default links;
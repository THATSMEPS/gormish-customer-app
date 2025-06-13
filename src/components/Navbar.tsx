// import { MapPin, ArrowRight } from 'lucide-react';
// import { motion } from 'framer-motion';

// interface Props {
//   onLocationClick: () => void;
//   onProfileClick: () => void;
//   onTrackOrder: () => void;
//   selectedArea: string;
// }

// const customerData = localStorage.getItem("customerData")
// let customerNameFirstLetter: string = ''
// let trackBabyButton = false
// if (customerData) {
//   const parsedCustomerData = JSON.parse(customerData);
//   customerNameFirstLetter = parsedCustomerData.name.split('')[0];
//   console.log(customerNameFirstLetter)

//   // Check if there are any orders with 'preparing' status
//   if (parsedCustomerData.orders && Array.isArray(parsedCustomerData.orders)) {
//     // Using .some() to efficiently check if at least one order matches the condition
//     trackBabyButton = parsedCustomerData.orders.some(
//       (order: any) => order.status === 'preparing'
//     );
//   }

// }

// export const Navbar = ({ onLocationClick, onProfileClick, onTrackOrder, selectedArea }: Props) => {
//   return (
//     <div className="flex items-center justify-between px-4 py-4">
//       <div 
//         className="flex items-center gap-1 cursor-pointer w-3/5"
//         onClick={onLocationClick}
//       >
//         <motion.div
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           className="p-1.5 bg-white rounded-full flex items-center justify-center shadow-sm"
//         >
//           <MapPin className="text-black" size={20} />
//         </motion.div>
//         <span className="font-medium truncate text-sm md:text-base">{selectedArea}</span>
//       </div>

//       <div className="flex items-center gap-1 w-1/2 justify-end">
//         {trackBabyButton && (<motion.div
//           initial={{ x: 20, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={onTrackOrder}
//           className="track-order-shine bg-[#6552FF] text-white px-2 py-1 rounded-full flex items-center gap-1 cursor-pointer hover:bg-[#5242CC] transition-colors"
//         >
//           <span className="text-[10px] font-medium whitespace-nowrap">Track Baby!</span>
//           <ArrowRight size={10} />
//         </motion.div>)}
        
//         <motion.div
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           className="h-[30px] w-[30px] bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer"
//           onClick={onProfileClick}
//         >
//           <span className="text-lg font-semibold">{customerNameFirstLetter}</span>
//         </motion.div>
//       </div>
//     </div>
//   );
// };





import { MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react'; // Import useEffect and useState

interface Props {
  onLocationClick: () => void;
  onProfileClick: () => void;
  onTrackOrder: () => void;
  selectedArea: string;
}

export const Navbar = ({ onLocationClick, onProfileClick, onTrackOrder, selectedArea }: Props) => {
  // ✅ Move state management inside the component
  const [customerNameFirstLetter, setCustomerNameFirstLetter] = useState<string>('');
  const [trackBabyButton, setTrackBabyButton] = useState<boolean>(false);

  useEffect(() => {
    const updateCustomerInfo = () => {
      const customerData = localStorage.getItem("customerData");
      if (customerData) {
        try {
          const parsedCustomerData = JSON.parse(customerData);
          
          // Set customer's first letter
          if (parsedCustomerData.name) {
            setCustomerNameFirstLetter(parsedCustomerData.name.split('')[0]);
          } else {
            setCustomerNameFirstLetter(''); // Handle cases where name might be missing
          }

          // Check for 'preparing' orders for track button
          if (parsedCustomerData.orders && Array.isArray(parsedCustomerData.orders)) {
            const hasPreparingOrder = parsedCustomerData.orders.some(
              (order: any) => order.status === 'preparing'
            );
            setTrackBabyButton(hasPreparingOrder);
          } else {
            setTrackBabyButton(false); // No orders or not an array
          }
        } catch (error) {
          console.error("Error parsing customer data from localStorage in Navbar:", error);
          setCustomerNameFirstLetter('');
          setTrackBabyButton(false);
        }
      } else {
        // Clear state if no customer data in localStorage
        setCustomerNameFirstLetter('');
        setTrackBabyButton(false);
      }
    };

    // Call it initially
    updateCustomerInfo();

    // Listen for storage changes (e.g., when login/logout happens)
    window.addEventListener('storage', updateCustomerInfo);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener('storage', updateCustomerInfo);
    };
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  return (
    <div className="flex items-center justify-between px-4 py-4">
      <div 
        className="flex items-center gap-1 cursor-pointer w-3/5"
        onClick={onLocationClick}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="p-1.5 bg-white rounded-full flex items-center justify-center shadow-sm"
        >
          <MapPin className="text-black" size={20} />
        </motion.div>
        <span className="font-medium truncate text-sm md:text-base">{selectedArea}</span>
      </div>

      <div className="flex items-center gap-1 w-1/2 justify-end">
        {trackBabyButton && (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onTrackOrder}
            className="track-order-shine bg-[#6552FF] text-white px-2 py-1 rounded-full flex items-center gap-1 cursor-pointer hover:bg-[#5242CC] transition-colors"
          >
            <span className="text-[10px] font-medium whitespace-nowrap">Track Baby!</span>
            <ArrowRight size={10} />
          </motion.div>
        )}
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="h-[30px] w-[30px] bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer"
          onClick={onProfileClick}
        >
          {/* ✅ Use the state variable here */}
          <span className="text-lg font-semibold">{customerNameFirstLetter}</span>
        </motion.div>
      </div>
    </div>
  );
};
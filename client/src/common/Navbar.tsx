import { useState } from 'react';
import Secondarybar from '../component/Secondarybar'
import Topbar from '../component/Topbar'
import CartDrawer from '../component/cart/CartDrawer';


function Navbar() {

  const [isCardOpen, setIsCardOpen] = useState(false);

  const toggleCard = () => {
    setIsCardOpen((prevState) => !prevState);
  }

  return (
    <nav>
        <Topbar toggleCard={toggleCard} />
        <Secondarybar />
        <CartDrawer isCardOpen={isCardOpen} toggleCard={toggleCard}/>
    </nav>
  )
}

export default Navbar

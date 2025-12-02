// App.jsx (or App.tsx)

import "./App.css";
// 1. Correct the import to Framer Motion
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

// 2. Create the Motion Button component
const MotionButton = motion(Button);

function App() {
  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <motion.h1
          animate={{ rotate: 360 }}
          transition={{ duration: 2 }}
          className="bg-amber-300 rounded-xl p-2 text-2xl font-bold text-zinc-900 mx-10 w-fit"
        >
          Hello from Strivo
        </motion.h1>

        {/* 3. Use the new wrapped component */}
        <MotionButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          Click me
        </MotionButton>
      </div>
    </>
  );
}

export default App;

import "./App.css";

import { useState, useEffect, useRef } from "react";

import Customer from "./Customer";

import Defect from "./Defect";

import "bootstrap/dist/css/bootstrap.css";

import Security from "./Security";
import Cirs from "./Cirs";

import Regression from "./Regression";




function App() {

  const [cust, setCust] = useState(false);

  const [def, setDef] = useState(false);

  const [Sec, setSec] = useState(false);
  const [Cir, setCir] = useState(false);

  const [Reg, setReg] = useState(false);

  const appContainerRef = useRef(null);




  useEffect(() => {

    if (appContainerRef.current) {

      appContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });

    }

  }, [cust, def, Sec, Cir, Reg]);




  function f1() {

    if (!cust) {

      setCust(true);

      setDef(false);

      setSec(false);
      setCir(false);

      setReg(false);

    } else {

      appContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });

    }

  }




  function f2() {

    if (!def) {

      setCust(false);

      setDef(true);

      setSec(false);
      setCir(false);

      setReg(false);

    } else {

      appContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });

    }

  }




  function f3() {

    if (!Sec) {

      setCust(false);

      setDef(false);

      setSec(true);
      setCir(false);

      setReg(false);

    } else {

      appContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });

    }

  }
  function f4() {

    if (!Cir) {

      setCust(false);

      setDef(false);

      setSec(false);
      setCir(true);

      setReg(false);

    } else {

      appContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });

    }

  }
  function f5() {

    if (!Reg) {

      setCust(false);

      setDef(false);

      setSec(false);
      setCir(false);

      setReg(true);

    } else {

      appContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });

    }

  }




  return (

    <div className="app-container" ref={appContainerRef}>

      <div className="fixed-top-center">

        <button onClick={f1} style={{ backgroundColor: cust ? "#056178" : "#219ebc"} }>Customer</button>




        <button onClick={f2} style={{ backgroundColor: def ? "#056178" : "#219ebc"} }>Defect</button>




        <button onClick={f3} style={{ backgroundColor: Sec ? "#056178" : "#219ebc"} }>Security</button>
        <button onClick={f4} style={{ backgroundColor: Cir ? "#056178" : "#219ebc"} }>CIRS</button>
        <button onClick={f5} style={{ backgroundColor: Reg ? "#056178" : "#219ebc"} }>Regression</button>

      </div>




      <div className="content">

        {cust && <Customer />}




        {def && <Defect />}




        {Sec && <Security />}
        {Cir && <Cirs />}
        {Reg && <Regression />}

      </div>

    </div>

  );

}




export default App;
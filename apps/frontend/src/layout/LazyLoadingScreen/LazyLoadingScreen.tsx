// ---Dependencies
import React from "react";


/**
 * LazyLoadingScreen Component:  Descripción del comportamiento...
 */
export function LazyLoadingScreen() {
  // -----------------------CONSTS, HOOKS, STATES
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className="LazyLoadingScreen" style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100vh",  color: "white", fontFamily: "'Inter', sans-serif", fontSize: "24px"}}>
        <p style={{backgroundColor: "#0a1428", width: "100%", textAlign: "center", fontSize: "28px"}}>Cargando...</p>
    </div>
  );
}
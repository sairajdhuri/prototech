import { ImageResponse } from "next/og";
export const alt = "Prototech. Precision in every layer. PCB manufacturing in Pune since 1999.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() { return new ImageResponse(<div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", background: "#141482", color: "#f6f7f3", padding: "64px", fontFamily: "sans-serif" }}><div style={{ display: "flex", fontSize: 38 }}>prototech.</div><div style={{ display: "flex", fontSize: 106, lineHeight: 1.02, letterSpacing: "-5px", maxWidth: 1000 }}>Precision in every layer.</div><div style={{ display: "flex", fontSize: 26 }}>Printed circuit boards. Made in Pune since 1999.</div></div>, size); }

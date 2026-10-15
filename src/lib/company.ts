export const company = {
  name: "Prototech",
  founded: 1999,
  email: "sales@protomlb.in",
  phone: "+91 7620795067",
  phoneHref: "tel:+917620795067",
  address: "Shed No. 2, S.R. No. 44/27, Renuka Industrial Estate, Pari Company Road, Narhe, Pune 411041, Maharashtra, India",
  hours: "9:00 am – 5:30 pm",
  directions: "https://www.google.com/maps/search/?api=1&query=Prototech+Renuka+Industrial+Estate+Narhe+Pune+411041",
  source: "https://protomlb.in",
} as const;

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/machinery", label: "Machinery" },
  { href: "/products", label: "Products" },
  { href: "/customers", label: "Customers" },
  { href: "/contact", label: "Contact" },
];

export const assetBase = "https://img1.wsimg.com/isteam/ip/68492da2-903b-4178-b641-6c9c1d026062/";
const customerCrops: Record<string, string> = {
  "Img.gif": "cr=t:7.91%,l:0%,w:100%,h:84.18%",
  "CorporateFilm.png": "cr=t:4.91%,l:0%,w:100%,h:90.17%",
  "Minda-Industries-board-approves-acquisition-of.jpg": "cr=t:12.5%,l:0%,w:100%,h:75%",
  "blob-4342900.png": "cr=t:2.79%,l:0%,w:100%,h:57.5%",
  "star_engineers_india_private_limited_logo.jpeg": "cr=t:21.25%,l:0%,w:100%,h:57.5%",
  "tata-autocomp-systems-launches-vrla-batteries.webp": "cr=t:25%,l:0%,w:100%,h:50%",
};
export const originalImage = (file: string) => `${assetBase}${encodeURIComponent(file)}/:/${customerCrops[file] ? `${encodeURIComponent(customerCrops[file])}/` : ""}rs=w:1440,m`;

export const machines = [
  { id: "cnc-drilling", name: "CNC drilling", model: "Pluritec Multistation", origin: "Italy", detail: "Westwind single spindle. 125,000 rpm with air bearing.", image: "IMG_20220301_131936.jpg", stage: "Drilling" },
  { id: "cnc-routing", name: "CNC drilling & routing", model: "Pluritec Minima", origin: "Italy", detail: "Westwind single spindle. 80,000 rpm with air bearing.", image: "IMG_20220301_180918-0001.jpg", stage: "Drilling" },
  { id: "flying-probe", name: "Flying probe testing", model: "Speedy MPP 4504", origin: "MANIA, Germany", detail: "Electrical testing with the Speedy flying probe tester.", image: "IMG_20220302_133330.jpg", stage: "Testing" },
  { id: "routing", name: "Routing", model: "Single spindle router", origin: "Local manufacture", detail: "24,000 rpm single spindle machine.", image: "IMG_20220301_130230.jpg", stage: "Drilling" },
  { id: "hasl", name: "Lead-free HASL", model: "HASL machine", origin: "Local manufacture", detail: "Hot air solder levelling for lead-free surface finishing.", image: "IMG_20220302_164206.jpg", stage: "Finishing" },
  { id: "lamination", name: "Lamination", model: "Anger", origin: "Germany", detail: "Lamination equipment for multilayer PCB production.", image: "IMG_20220301_175533.jpg", stage: "Fabrication" },
  { id: "screen-printing", name: "Screen printing", model: "Screen printing machine", origin: "Local manufacture", detail: "Screen printing equipment in the Pune manufacturing facility.", image: "IMG_20220301_175548.jpg", stage: "Fabrication" },
  { id: "semi-auto-printing", name: "Semi-automatic printing", model: "Semi-automatic screen printer", origin: "Local manufacture", detail: "Semi-automatic screen printing equipment.", image: "IMG_20220301_173629.jpg", stage: "Fabrication" },
  { id: "etching", name: "Etching", model: "Fibre abrasive", origin: "Local manufacture", detail: "Etching equipment listed in the original machinery inventory.", image: "IMG_20220302_151205-0001.jpg", stage: "Fabrication" },
  { id: "developing", name: "Developing", model: "Developing machine", origin: "Local manufacture", detail: "Developing equipment for the PCB manufacturing process.", image: "IMG_20220302_151402.jpg", stage: "Fabrication" },
  { id: "brushing", name: "Brushing", model: "Brushing machine", origin: "Local manufacture", detail: "Board brushing equipment.", image: "PSX_20230221_142912.jpg", stage: "Finishing" },
  { id: "aoi", name: "Optical inspection", model: "Automated optical inspection", origin: "Orbotech, Israel", detail: "AOI equipment for optical inspection of circuit boards.", image: "1000146519.jpg", stage: "Testing" },
] as const;

export const customers = [
  { name: "Schneider Electric India Pvt. Ltd.", short: "Schneider Electric", image: "Img.gif" },
  { name: "Bharat Heavy Electricals Limited", short: "BHEL", image: "CorporateFilm.png" },
  { name: "Uno Minda Limited", short: "UNO MINDA", image: "Minda-Industries-board-approves-acquisition-of.jpg" },
  { name: "Rishabh Instruments Ltd.", short: "Rishabh", image: "blob-4342900.png" },
  { name: "Star Engineers India Pvt. Ltd.", short: "STAR", image: "star_engineers_india_private_limited_logo.jpeg" },
  { name: "TATA Autocomp Systems Ltd.", short: "TATA AutoComp", image: "tata-autocomp-systems-launches-vrla-batteries.webp" },
] as const;

export const capabilityGroups = [
  { title: "Board construction", rows: [
    ["PCB types", "Single-sided, double-sided and multilayer"],
    ["Layer count", "2–12 layers"],
    ["Base material", "FR4 TG135 glass epoxy laminate"],
    ["Material thickness", "0.80, 1.00, 1.60 and 2.40 mm"],
    ["Copper thickness", "35, 70 and 105 µm"],
    ["Maximum finished MLB size", "460 × 460 mm"],
  ] },
  { title: "Circuit geometry", rows: [
    ["Finished plated through hole", "0.25 mm (10 mil)"],
    ["Inner layer track / spacing", "0.15 / 0.15 mm (6 / 6 mil)"],
    ["Outer layer track / spacing", "0.15 / 0.15 mm (6 / 6 mil)"],
    ["SMD pitch", "0.20 mm (8 mil)"],
    ["TCP / TAB", "0.25 mm (10 mil)"],
  ] },
  { title: "Finish & testing", rows: [
    ["Surface finishes", "HAL with lead, lead-free HAL and ENIG"],
    ["Solder mask colours", "Green, white, blue, black and red"],
    ["Electrical test", "Flying probe testing; all boards electrically tested"],
    ["Published standard construction", "1.6 mm laminate; 35 µm process and finish"],
    ["Manufacturing specification", "IPC standards and customer specifications"],
  ] },
] as const;

export const boardTypes = [
  { id: "double-sided", name: "Double-sided", layers: "2 layers", description: "Circuitry on both sides of an FR4 board, with plated through holes.", image: "/media/board-green.svg", tone: "green" },
  { id: "multilayer", name: "Multilayer", layers: "Up to 12 layers", description: "Multilayer PCB manufacturing for designs with more complex interconnections.", image: "/media/board-black.svg", tone: "dark" },
  { id: "single-sided", name: "Single-sided", layers: "Single side", description: "Single-sided printed circuit boards, as listed in Prototech’s product specification.", image: "/media/board-blue.svg", tone: "blue" },
] as const;

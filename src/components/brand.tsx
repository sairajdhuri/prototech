import Image from "next/image";
import { companyLogo } from "@/lib/assets";

export function Brand() {
  return <><Image src={companyLogo} width={48} height={48} alt="" className="original-logo" /><span translate="no">prototech<span className="brand-dot">.</span></span></>;
}

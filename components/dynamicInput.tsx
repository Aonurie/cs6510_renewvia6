import dynamic from "next/dynamic";

const Input = dynamic(() => import("./input"), { ssr: false });
export default Input;

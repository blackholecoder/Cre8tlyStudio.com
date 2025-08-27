import { AiOutlineShoppingCart } from "react-icons/ai";
import { LuSplitSquareHorizontal } from "react-icons/lu";
import { TiMessages } from "react-icons/ti";
import { LiaGiftSolid } from "react-icons/lia";

import {BsMusicNoteBeamed, BsMic, BsCameraVideoFill } from 'react-icons/bs';
import { MdVerified } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { IoIosMusicalNotes } from "react-icons/io";

const color = "#BBC2CC";

function CustomIcon({name}) {
	if (name === 'beam') {
		return <BsMusicNoteBeamed size={"22px"} color={color} />;
	}

	if (name === 'double') {
		return <LuSplitSquareHorizontal size={"22px"} color={color} />;
	}

	if (name === 'message') {
		return <TiMessages size={"22px"} color={color} />;
	}

	if (name === 'gift') {
		return <LiaGiftSolid size={"22px"} color={color} />;
	}

	if (name === 'shop') {
		return <AiOutlineShoppingCart size={"22px"} color={color} />;
	}

	if (name === 'chat') {
		return <BsMic size={"22px"} color={color} />;
	}

	if (name === 'verified') {
		return <MdVerified size={"22px"} color={color} />;
	}

	if (name === 'users') {
		return <FaUsers size={"22px"} color={color} />;
	}

	if (name === 'cam') {
		return <BsCameraVideoFill size={"22px"} color={color} />;
	}
	if (name === 'music') {
		return <IoIosMusicalNotes  size={"22px"} color={color} />;
	}



}

export default CustomIcon;
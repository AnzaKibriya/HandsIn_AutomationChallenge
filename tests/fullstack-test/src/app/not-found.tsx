import { Roboto } from "next/font/google";
import type React from "react";
import type { FC } from "react";

const roboto = Roboto({
	weight: ["400", "500", "700"],
	subsets: ["latin"],
	display: "swap",
	variable: "--font-roboto",
});

const NotFoundPage: FC<React.PropsWithChildren> = async () => {
	return (
		<html className={roboto.className} lang="en" suppressHydrationWarning>
			<body>
				<div className="flex min-h-screen flex-col items-center justify-center">
					<h4 className="text-2xl">Not Found</h4>
				</div>
			</body>
		</html>
	);
};

export default NotFoundPage;

import type { FC, PropsWithChildren } from "react";
import "./globals.css";

const Layout: FC<PropsWithChildren> = async ({ children }) => {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>{children}</body>
		</html>
	);
};

export default Layout;
